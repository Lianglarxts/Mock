// Pure functions: everything the rooms show is calculated from the deal state.
import {
  BRANDS, CREATORS, AREAS, WEAK_AREA, WEAKEST_LINK, TRUST_WORDS, FAIR_BAND, RULER_SPAN, OFFER_STEP,
  DELIVERABLES, USAGE, PAID_ADS, EXCLUSIVE, PLATFORM_FEE, EFFORT, RUSH_PENALTY, RATES,
  VERDICT_RULES, GOALS, REGION_LABELS, CREATOR_VALUES_MIN,
} from '../data.js';

export const getCreator = (id) => CREATORS.find((c) => c.id === id) || null;
export const getBrand = (id) => BRANDS.find((b) => b.id === id) || null;
export const goalLabel = (id) => GOALS.find((g) => g.id === id)?.label.toLowerCase() || '';
export const firstName = (c) => c.name.split(' ')[0];

export const money = (n, decimals = 0) =>
  '€' + Number(n).toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
export const num = (n) => Math.round(n).toLocaleString('en-GB');
export const regionList = (codes) => codes.map((r) => REGION_LABELS[r] || r).join(', ');
export const topRegions = (shares) =>
  regionList(Object.entries(shares).sort((a, b) => b[1] - a[1]).slice(0, 2).map(([r]) => r));

// ── Who is who, from the side you play ───────────────────────
// Brand side: you pick your brand in the brief, a creator in the match.
// Creator side: you pick yourself in the brief, a brand in the match.
export function parties(deal) {
  const brand = getBrand(deal.brandId);
  const creator = getCreator(deal.creatorId);
  const isBrand = deal.side === 'brand';
  return { brand, creator, isBrand, me: isBrand ? brand : creator, partner: isBrand ? creator : brand };
}
export const partnerId = (deal) => (deal.side === 'brand' ? deal.creatorId : deal.brandId);
export const partyName = (p) => (p && 'handle' in p ? firstName(p) : p?.name);

// What each side brings to the table. On your own side these come from your brief;
// on the other side they come from the partner's profile.
function terms(brand, creator, deal) {
  const isBrand = deal.side === 'brand';
  return {
    goal: isBrand ? deal.brief.goal : brand.goal,
    budget: isBrand ? deal.brief.budget : brand.budget,
    ask: isBrand ? fairRange(creator).mid : deal.brief.minFee,
    wants: isBrand ? creator.wants : { freedom: deal.brief.freedom, longTerm: deal.brief.longTerm },
  };
}

// ── Room 2: alignment in six areas ───────────────────────────
const clamp01 = (n) => Math.max(0, Math.min(1, n));

export function sharedValues(brand, creator) {
  return brand.values.filter((v) => creator.values.includes(v));
}

function audienceArea(brand, creator) {
  const [b0, b1] = brand.ages;
  const [c0, c1] = creator.ages;
  const ages = clamp01((Math.min(b1, c1) - Math.max(b0, c0)) / (b1 - b0));
  const regions = clamp01(brand.regions.reduce((s, r) => s + (creator.regions[r] || 0), 0));
  return { value: ages * 0.5 + regions * 0.5, ages, regions };
}

export function alignment(brand, creator, deal) {
  const t = terms(brand, creator, deal);
  const aud = audienceArea(brand, creator);
  const shared = sharedValues(brand, creator);
  const ratio = t.budget / t.ask;
  const freedom = clamp01(1 - Math.max(0, (t.wants.freedom ?? 0.5) - brand.offers.freedom) * 2.5);
  const longTerm =
    t.wants.longTerm == null || t.wants.longTerm === brand.offers.longTerm ? 1 : t.wants.longTerm ? 0.4 : 0.7;

  const area = {
    product: brand.fit[creator.niche],
    audience: aud.value,
    values: [0.1, 0.5, 0.8, 1][shared.length],
    goal: t.goal ? creator.strengths[t.goal] : 0.5,
    money: ratio >= 1 ? 1 : clamp01((ratio - 0.5) / 0.5),
    style: freedom * 0.5 + longTerm * 0.5,
  };
  const why = {
    product: `${brand.product} for ${creator.nicheLabel.toLowerCase()}`,
    audience: `${Math.round(aud.ages * 100)}% age match · ${Math.round(aud.regions * 100)}% in ${regionList(brand.regions)}`,
    values: shared.length ? `share: ${shared.join(', ')}` : 'nothing in common',
    goal: t.goal ? `${goalLabel(t.goal)} is ${area.goal >= 0.7 ? 'a strength' : area.goal >= 0.5 ? 'so-so' : 'a weak spot'}` : '',
    money: ratio >= 1 ? `budget ${money(t.budget)} covers ${money(t.ask)}` : `budget ${money(t.budget)} < ${money(t.ask)}`,
    style: [
      freedom < 1 ? 'less freedom than wanted' : 'freedom ok',
      longTerm < 1 ? (t.wants.longTerm ? 'brand wants one post' : 'brand wants long-term') : 'same plan',
    ].join(' · '),
  };

  const rows = AREAS.map((a) => ({ ...a, value: area[a.id], pts: Math.round(area[a.id] * a.points), why: why[a.id] }));
  const score = rows.reduce((s, r) => s + r.pts, 0);
  const weakest = rows.reduce((w, r) => (r.value < w.value ? r : w), rows[0]);
  const success = Math.round(score * (WEAKEST_LINK.base + WEAKEST_LINK.weight * weakest.value));
  const gaps = rows.filter((r) => r.value < WEAK_AREA);
  return { score, success, rows, area, weakest, gaps, shared, goal: t.goal, budget: t.budget };
}

// The alignment for the current deal (both parties picked).
export function dealAlignment(deal) {
  const { brand, creator } = parties(deal);
  return brand && creator ? alignment(brand, creator, deal) : null;
}

// ── Room 3 ───────────────────────────────────────────────────
const wordFor = (score) => TRUST_WORDS.find((t) => score >= t.min).word;

export function creatorTrust(creator, brand) {
  const aud = audienceArea(brand, creator).value;
  const score = Math.round(creator.realFollowers * 60 + aud * 40);
  return { score, word: wordFor(score), audience: aud };
}

export function brandTrust(brand) {
  const score = Math.round(brand.paysOnTime * 60 + brand.rehire * 40);
  return { score, word: wordFor(score) };
}

// Trust in the partner (the one you're checking).
export function partnerTrust(deal) {
  const { brand, creator, isBrand } = parties(deal);
  return isBrand ? creatorTrust(creator, brand) : brandTrust(brand);
}

// ── Room 4 ───────────────────────────────────────────────────
const roundTo = (n, step) => Math.round(n / step) * step;

export function fairRange(creator) {
  const mid = roundTo((creator.followers / 1000) * creator.ratePer1k, OFFER_STEP);
  return {
    mid,
    low: roundTo(mid * (1 - FAIR_BAND), OFFER_STEP),
    high: roundTo(mid * (1 + FAIR_BAND), OFFER_STEP),
    min: roundTo(mid * RULER_SPAN.from, OFFER_STEP),
    max: roundTo(mid * RULER_SPAN.to, OFFER_STEP),
  };
}

export function priceZone(offer, range) {
  if (offer == null) return null;
  if (offer < range.low) return 'low';
  if (offer > range.high) return 'high';
  return 'fair';
}

export function deliverables(offer, range) {
  const r = offer / range.mid;
  return DELIVERABLES.find((d) => r <= d.upTo);
}

// ── Room 5 ───────────────────────────────────────────────────
export function costs(offer, terms) {
  const usage = USAGE.find((u) => u.months === terms.usageMonths) || USAGE[0];
  const rightsRate = usage.fee + (terms.paidAds ? PAID_ADS.fee : 0) + (terms.exclusive ? EXCLUSIVE.fee : 0);
  const rights = roundTo(offer * rightsRate, 5);
  const creatorGets = offer + rights;
  const fee = Math.round(creatorGets * PLATFORM_FEE);
  return { offer, rights, creatorGets, fee, total: creatorGets + fee };
}

// ── Room 6 ───────────────────────────────────────────────────
export function verdictRule(goal, brand) {
  const r = VERDICT_RULES[goal];
  if (r.goodShare == null) return r;
  return { ...r, good: Math.round(brand.productPrice * r.goodShare), ok: Math.round(brand.productPrice * r.okShare) };
}

export function results(deal) {
  const { brand, creator, isBrand } = parties(deal);
  const align = alignment(brand, creator, deal);
  const range = fairRange(creator);
  const zone = priceZone(deal.offer, range);
  const c = costs(deal.offer, deal.terms);
  const usage = USAGE.find((u) => u.months === deal.terms.usageMonths) || USAGE[0];
  const s = creator.strengths;
  const f = align.score / 100;
  const effort = EFFORT[zone];
  const rush = deal.terms.deadlineDays === 7 ? RUSH_PENALTY : 1;
  const boost = deal.terms.paidAds ? PAID_ADS.reachBoost : 1;
  const priceDrag = Math.sqrt(RATES.priceRef / brand.productPrice);

  // people share posts that feel genuine, so alignment nudges reach too
  const reach = creator.followers * creator.realFollowers * RATES.reachPerFollower * (0.5 + s.reach) * (0.7 + 0.4 * f) * effort * rush * boost;
  const clicks = reach * creator.engagement * RATES.clicksPerEngagement * Math.pow(f, 1.5) * (0.1 + s.clicks) * effort * rush;
  // an audience that matches the brand's buyers converts better; so do shared values
  const sales = clicks * RATES.buyRate * f * (0.1 + s.sales) * align.area.product * (align.area.audience / 0.75)
    * (0.8 + 0.4 * align.area.values) * (1 + usage.salesBoost) * priceDrag;

  const out = {
    reach: Math.round(reach),
    clicks: Math.round(clicks),
    sales: Math.max(1, Math.round(sales)),
    total: c.total,
    earned: c.creatorGets,
  };
  out.cpc = c.total / Math.max(1, out.clicks);
  out.cps = c.total / out.sales;
  out.costPer1k = (c.total / out.reach) * 1000;

  const rule = verdictRule(align.goal, brand);
  const value = out[rule.metric];
  out.rule = rule;
  out.value = value;
  out.goal = align.goal;
  out.metricLine = `${rule.label} ${fmtMetric(rule, value)}`;
  out.brandVerdict = value <= rule.good ? 'Worth it' : value <= rule.ok ? 'Not yet' : 'Not worth it';

  const ctx = { deal, brand, creator, align, range, zone, c, out };
  const cv = creatorVerdict(ctx);
  out.creatorVerdict = cv.verdict;
  out.creatorWhy = cv.why;

  // Your own verdict gets the full sentence; the other side gets one short line.
  out.verdict = isBrand ? out.brandVerdict : out.creatorVerdict;
  out.reason = isBrand ? brandReason(ctx) : cv.reason;
  out.theirVerdict = isBrand ? out.creatorVerdict : out.brandVerdict;
  out.theirLine = isBrand ? cv.why : out.metricLine;
  out.align = align;
  return out;
}

function fmtMetric(rule, v) {
  return rule.metric === 'cpc' ? money(v, 2) : money(v);
}

// One plain sentence that points back to the visitor's own choices (brand side).
function brandReason({ deal, creator, align, range, zone, c, out }) {
  const first = firstName(creator);
  const goal = goalLabel(align.goal);
  const metric = `${out.rule.label} was ${fmtMetric(out.rule, out.value)}`;
  const a = align.area;

  if (out.brandVerdict === 'Worth it') {
    if (zone === 'low') return `You paid below the fair range and ${first} still delivered, so the ${metric}. Next time they may say no.`;
    return `You two lined up well (${align.score}/100) and you paid a fair price, so the ${metric}.`;
  }
  // Look for the biggest problem the visitor caused, in order.
  if (zone === 'high') return `You paid ${money(deal.offer - range.high)} above the fair range, so the ${metric}.`;
  if (zone === 'low') return `You offered below the fair range, so ${first} did the minimum and the ${metric}.`;
  if (a.goal < 0.6) return `${first} is better at ${bestGoal(creator)} than at ${goal}, which was your goal, so the ${metric}.`;
  if (a.product < 0.6) return `${first}'s followers aren't into this kind of product, so the ${metric}.`;
  if (a.audience < 0.6) return `Only part of ${first}'s audience is the age and region you sell to, so the ${metric}.`;
  if (a.values < WEAK_AREA) return `You and ${first} don't share values, so the post felt like an ad and the ${metric}.`;
  if (creator.realFollowers < 0.8) return `Many of ${first}'s followers aren't real, so fewer people saw it and the ${metric}.`;
  if (c.rights > deal.offer * 0.25) return `The extra rights added ${money(c.rights)} to the cost, so the ${metric}.`;
  if (deal.terms.deadlineDays === 7) return `The 1-week deadline was rushed, so the post did worse and the ${metric}.`;
  if (a.money < 1) return `${first} usually costs more than your budget, so the match was weaker and the ${metric}.`;
  return `It was close. The ${metric}. A creator who lines up with you in more areas would tip it.`;
}

// Was it worth it for the creator? Paid fairly, kept their followers' trust, and likely to be booked again.
function creatorVerdict({ deal, brand, creator, align, range, zone, out }) {
  const earned = money(out.earned);
  const name = brand.name;
  const isMe = deal.side === 'creator';
  const you = isMe ? 'You' : firstName(creator);

  if (zone === 'low') {
    return {
      verdict: 'Not worth it',
      why: `paid ${money(range.low - deal.offer)} under fair`,
      reason: `You asked ${money(range.low - deal.offer)} less than the bottom of your fair range. You earned ${earned}, but you set a low price for next time too.`,
    };
  }
  if (align.area.values < CREATOR_VALUES_MIN) {
    return {
      verdict: 'Not yet',
      why: `earned ${earned}, but followers felt it was off-brand`,
      reason: `You earned ${earned}, but ${name} and you don't share values, so some followers felt it was just an ad. That costs you trust.`,
    };
  }
  if (out.brandVerdict === 'Not worth it') {
    return {
      verdict: 'Not yet',
      why: `earned ${earned}, unlikely to be booked again`,
      reason: `You earned ${earned}, but ${name}'s ${out.metricLine}, so they probably won't book you again.`,
    };
  }
  if (isMe && deal.brief.minFee > deal.offer) {
    return {
      verdict: 'Not yet',
      why: `earned ${earned}, under their own minimum`,
      reason: `You earned ${earned}, which is under your own minimum of ${money(deal.brief.minFee)}. A brand with a bigger budget would pay what you want.`,
    };
  }
  if (out.brandVerdict === 'Not yet') {
    return {
      verdict: 'Worth it',
      why: `earned ${earned} at a fair rate, rebooking unsure`,
      reason: `${you} earned ${earned} at a fair rate. ${name}'s ${out.metricLine} was a bit high, so a second deal isn't certain.`,
    };
  }
  return {
    verdict: 'Worth it',
    why: `earned ${earned} at a fair rate, likely rebooked`,
    reason: `${you} earned ${earned} at a fair rate, and ${name} got what they wanted (${out.metricLine}), so they'll likely book you again.`,
  };
}

function bestGoal(creator) {
  return Object.entries(creator.strengths).sort((a, b) => b[1] - a[1])[0][0];
}

// ── Locking: which rooms are done / open ─────────────────────
export function briefDone(deal) {
  if (deal.side === 'brand') return !!(deal.brandId && deal.brief.goal);
  if (deal.side === 'creator') return !!(deal.creatorId && deal.brief.longTerm != null && deal.brief.freedom != null);
  return false;
}

export function progress(deal) {
  const pid = partnerId(deal);
  const done = [
    deal.started && !!deal.side,
    briefDone(deal),
    !!pid,
    !!pid && deal.checkedId === pid,
    deal.offer != null,
    deal.escrowStep >= 5,
    deal.escrowStep >= 5,
    deal.escrowStep >= 5,
  ];
  let lastOpen = 0;
  while (lastOpen < done.length - 1 && done[lastOpen]) lastOpen++;
  return { done, lastOpen, isOpen: (i) => i <= lastOpen };
}
