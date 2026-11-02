// Pure functions: everything the rooms show is calculated from the deal state.
import {
  BRAND, PRODUCTS, CREATORS, FIT_POINTS, TRUST_WORDS, FAIR_BAND, RULER_SPAN, OFFER_STEP,
  DELIVERABLES, USAGE, PAID_ADS, EXCLUSIVE, PLATFORM_FEE, EFFORT, RUSH_PENALTY, RATES,
  VERDICT_RULES, GOALS,
} from '../data.js';

export const getCreator = (id) => CREATORS.find((c) => c.id === id) || null;
export const getProduct = (id) => PRODUCTS.find((p) => p.id === id) || null;
export const goalLabel = (id) => GOALS.find((g) => g.id === id)?.label.toLowerCase() || '';

export const money = (n, decimals = 0) =>
  '€' + Number(n).toLocaleString('en-GB', { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
export const num = (n) => Math.round(n).toLocaleString('en-GB');

// ── Room 2 ───────────────────────────────────────────────────
export function fitScore(creator, brief) {
  const product = getProduct(brief.product);
  const nicheFit = product ? product.fit[creator.niche] : 0.5;
  const goalFit = brief.goal ? creator.strengths[brief.goal] : 0.5;
  const ratio = brief.budget / creator.usualPrice;
  const budgetFit = ratio >= 1 ? 1 : Math.max(0, (ratio - 0.5) / 0.5);
  const parts = {
    niche: Math.round(nicheFit * FIT_POINTS.niche),
    goal: Math.round(goalFit * FIT_POINTS.goal),
    budget: Math.round(budgetFit * FIT_POINTS.budget),
  };
  return { score: parts.niche + parts.goal + parts.budget, parts, nicheFit, goalFit, budgetFit };
}

// ── Room 3 ───────────────────────────────────────────────────
export function trust(creator) {
  const score = Math.round(creator.realFollowers * 60 + creator.audienceFit * 40);
  const word = TRUST_WORDS.find((t) => score >= t.min).word;
  return { score, word };
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
export function results(deal) {
  const creator = getCreator(deal.creatorId);
  const product = getProduct(deal.brief.product);
  const fit = fitScore(creator, deal.brief);
  const range = fairRange(creator);
  const zone = priceZone(deal.offer, range);
  const c = costs(deal.offer, deal.terms);
  const usage = USAGE.find((u) => u.months === deal.terms.usageMonths) || USAGE[0];
  const s = creator.strengths;
  const f = fit.score / 100;
  const effort = EFFORT[zone];
  const rush = deal.terms.deadlineDays === 7 ? RUSH_PENALTY : 1;
  const boost = deal.terms.paidAds ? PAID_ADS.reachBoost : 1;

  const reach = creator.followers * creator.realFollowers * RATES.reachPerFollower * (0.5 + s.reach) * effort * rush * boost;
  const clicks = reach * creator.engagement * RATES.clicksPerEngagement * Math.pow(f, 1.5) * (0.1 + s.clicks) * effort * rush;
  // audienceFit / 0.8: an audience that looks like your buyers converts better (Room 3)
  const sales = clicks * RATES.buyRate * f * (0.1 + s.sales) * product.fit[creator.niche] * (creator.audienceFit / 0.8) * (1 + usage.salesBoost);

  const out = {
    reach: Math.round(reach),
    clicks: Math.round(clicks),
    sales: Math.max(1, Math.round(sales)),
    total: c.total,
  };
  out.cpc = c.total / Math.max(1, out.clicks);
  out.cps = c.total / out.sales;
  out.costPer1k = (c.total / out.reach) * 1000;

  const rule = VERDICT_RULES[deal.brief.goal];
  const value = out[rule.metric];
  out.verdict = value <= rule.good ? 'Worth it' : value <= rule.ok ? 'Not yet' : 'Not worth it';
  out.rule = rule;
  out.value = value;
  out.reason = reason({ deal, creator, fit, range, zone, c, out, rule });
  return out;
}

function fmtMetric(rule, v) {
  return rule.metric === 'cpc' ? money(v, 2) : money(v);
}

// One plain sentence that points back to the visitor's own choices.
function reason({ deal, creator, fit, range, zone, c, out, rule }) {
  const first = creator.name.split(' ')[0];
  const goal = goalLabel(deal.brief.goal);
  const metric = `${rule.label} was ${fmtMetric(rule, out.value)}`;

  if (out.verdict === 'Worth it') {
    if (zone === 'low') return `You paid below the fair range and ${first} still delivered, so the ${metric}. Next time they may say no.`;
    return `You picked a strong fit (${fit.score}/100) and paid a fair price, so the ${metric}.`;
  }
  // Look for the biggest problem the visitor caused, in order.
  if (zone === 'high') return `You paid ${money(deal.offer - range.high)} above the fair range, so the ${metric}.`;
  if (zone === 'low') return `You offered below the fair range, so ${first} did the minimum and the ${metric}.`;
  if (fit.goalFit < 0.6) return `${first} is better at ${bestGoal(creator)} than at ${goal}, which was your goal, so the ${metric}.`;
  if (fit.nicheFit < 0.6) return `${first}'s followers aren't into this kind of product, so the ${metric}.`;
  if (creator.realFollowers < 0.8) return `Many of ${first}'s followers aren't real, so fewer people saw it and the ${metric}.`;
  if (c.rights > deal.offer * 0.25) return `The extra rights added ${money(c.rights)} to the cost, so the ${metric}.`;
  if (deal.terms.deadlineDays === 7) return `The 1-week deadline was rushed, so the post did worse and the ${metric}.`;
  if (fit.budgetFit < 1) return `${first} usually costs more than your budget, so the fit was weaker and the ${metric}.`;
  return `It was close. The ${metric}. A creator who fits your brief better would tip it.`;
}

function bestGoal(creator) {
  return Object.entries(creator.strengths).sort((a, b) => b[1] - a[1])[0][0];
}

// ── Locking: which rooms are done / open ─────────────────────
export function progress(deal) {
  const done = [
    deal.started,
    !!(deal.brief.goal && deal.brief.product),
    !!deal.creatorId,
    !!deal.creatorId && deal.checkedId === deal.creatorId,
    deal.offer != null,
    deal.escrowStep >= 5,
    deal.escrowStep >= 5,
    deal.escrowStep >= 5,
  ];
  let lastOpen = 0;
  while (lastOpen < done.length - 1 && done[lastOpen]) lastOpen++;
  return { done, lastOpen, isOpen: (i) => i <= lastOpen };
}

export { BRAND };
