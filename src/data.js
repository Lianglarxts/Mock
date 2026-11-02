// ─────────────────────────────────────────────────────────────
//  ALL FAKE DATA + THE SIMPLE RULES LIVE HERE.
//  Change a number below and every room updates on the next load.
// ─────────────────────────────────────────────────────────────

export const BRAND = {
  name: 'Lumen Studio',
  product: 'Halo desk lamp',
  productPrice: 149, // € per lamp (a typical price for a designer desk lamp)
};

// ── Room 1: the brief ────────────────────────────────────────
export const GOALS = [
  { id: 'reach', label: 'Reach', note: 'Lots of people see the lamp' },
  { id: 'clicks', label: 'Clicks', note: 'People visit your shop' },
  { id: 'sales', label: 'Sales', note: 'People buy the lamp' },
];

export const BUDGET = { min: 400, max: 4000, step: 50, start: 1500 };

// How well each product type suits each creator niche (0 to 1).
export const PRODUCTS = [
  { id: 'workspace', label: 'Desk & workspace', fit: { desk: 1, interior: 0.5, tech: 0.7, maker: 0.6 } },
  { id: 'design', label: 'Design piece', fit: { desk: 0.7, interior: 1, tech: 0.3, maker: 0.9 } },
  { id: 'tech', label: 'Tech gadget', fit: { desk: 0.7, interior: 0.3, tech: 1, maker: 0.3 } },
];

// ── Room 2/3: the creators ───────────────────────────────────
// strengths: how good their audience is at each goal (0 to 1)
// engagement: share of followers who like/comment/save a typical post (small, loyal audiences run higher)
// realFollowers: share of followers that are real people
// audienceFit: share of their audience that looks like Lumen's buyers
// ratePer1k: fair € per 1,000 followers (smaller creators charge more per follower)
export const CREATORS = [
  {
    id: 'mara',
    name: 'Mara Okafor',
    handle: '@mara.desk',
    niche: 'desk',
    nicheLabel: 'Desk setups',
    followers: 48000,
    engagement: 0.045,
    realFollowers: 0.94,
    audienceFit: 0.82,
    audienceNote: 'Mostly 24–35, work from home, care about tidy desks.',
    strengths: { reach: 0.45, clicks: 0.85, sales: 0.9 },
    usualPrice: 800,
    ratePer1k: 16,
    past: [
      { brand: 'Nordpaper notebooks', result: '410 clicks · 19 sales', good: true },
      { brand: 'Kettle & Co. mugs', result: '290 clicks · 11 sales', good: true },
    ],
    portrait: { hair: 'curly', glasses: true },
  },
  {
    id: 'jun',
    name: 'Jun Park',
    handle: '@jun.at.home',
    niche: 'interior',
    nicheLabel: 'Calm interiors',
    followers: 210000,
    engagement: 0.022,
    realFollowers: 0.91,
    audienceFit: 0.78,
    audienceNote: 'Broad, 25–44, loves design, buys less often.',
    strengths: { reach: 0.95, clicks: 0.55, sales: 0.4 },
    usualPrice: 2600,
    ratePer1k: 12,
    past: [
      { brand: 'Moss rugs', result: '120k people reached · 14 sales', good: true },
      { brand: 'Ono vases', result: '95k people reached · 4 sales', good: false },
    ],
    portrait: { hair: 'bun', glasses: false },
  },
  {
    id: 'theo',
    name: 'Theo Brandt',
    handle: '@theo.tests',
    niche: 'tech',
    nicheLabel: 'Gadget reviews',
    followers: 86000,
    engagement: 0.03,
    realFollowers: 0.71,
    audienceFit: 0.58,
    audienceNote: 'Young, gadget fans. Some followers look bought.',
    strengths: { reach: 0.6, clicks: 0.8, sales: 0.55 },
    usualPrice: 1250,
    ratePer1k: 14,
    past: [
      { brand: 'Volt chargers', result: '520 clicks · 12 sales', good: true },
      { brand: 'Pixel stand', result: '180 clicks · 2 sales', good: false },
    ],
    portrait: { hair: 'short', glasses: false },
  },
  {
    id: 'ines',
    name: 'Ines Duarte',
    handle: '@ines.makes',
    niche: 'maker',
    nicheLabel: 'Handmade objects',
    followers: 12000,
    engagement: 0.085,
    realFollowers: 0.98,
    audienceFit: 0.9,
    audienceNote: 'Small and loyal. They buy what she recommends.',
    strengths: { reach: 0.3, clicks: 0.75, sales: 0.95 },
    usualPrice: 350,
    ratePer1k: 26,
    past: [
      { brand: 'Fern ceramics', result: '160 clicks · 9 sales', good: true },
      { brand: 'Loom & Co. throws', result: '120 clicks · 6 sales', good: true },
    ],
    portrait: { hair: 'long', glasses: false },
  },
];

// ── Room 2: fit score rules (points add up to 100) ───────────
export const FIT_POINTS = { niche: 40, goal: 35, budget: 25 };

// ── Room 3: trust rules ──────────────────────────────────────
// score = realFollowers × 60 + audienceFit × 40
export const TRUST_WORDS = [
  { min: 84, word: 'Strong' },
  { min: 70, word: 'Okay' },
  { min: 0, word: 'Low' },
];

// ── Room 4: price rules ──────────────────────────────────────
// fair middle = followers / 1000 × ratePer1k. Fair range = middle ± band.
export const FAIR_BAND = 0.2; // ±20 %
export const RULER_SPAN = { from: 0.4, to: 1.8 }; // ruler runs 40 %…180 % of the middle
export const OFFER_STEP = 25;

// What to ask for at each price (by offer ÷ fair middle).
export const DELIVERABLES = [
  { upTo: 0.8, items: ['1 reel', '7 days usage'], note: 'At this price, expect the bare minimum.' },
  { upTo: 1.0, items: ['1 reel', '2 stories', '30 days usage'], note: 'A fair, standard package.' },
  { upTo: 1.2, items: ['1 reel', '3 stories', 'link in bio for a week', '30 days usage'], note: 'Top of the fair range. Ask for a bit more.' },
  { upTo: Infinity, items: ['1 reel', '3 stories', 'link in bio for a week', '60 days usage'], note: 'You are paying extra. Ask for everything above.' },
];

// ── Room 5: deal terms ───────────────────────────────────────
export const DEADLINES = [
  { days: 7, label: '1 week', note: 'rushed' },
  { days: 14, label: '2 weeks' },
  { days: 30, label: '1 month' },
];
export const USAGE = [
  { months: 1, label: '1 month', fee: 0, salesBoost: 0 },
  { months: 3, label: '3 months', fee: 0.1, salesBoost: 0.1 },
  { months: 12, label: '1 year', fee: 0.25, salesBoost: 0.18 },
];
export const PAID_ADS = { fee: 0.2, reachBoost: 1.35 }; // you may boost the post with ads
export const EXCLUSIVE = { fee: 0.15 }; // creator can't promote other lamps for 3 months
export const PLATFORM_FEE = 0.1; // our fee on each deal

export const ESCROW_STEPS = [
  'Brief agreed',
  'Money held',
  'Work delivered',
  'Approved',
  'Money released',
];

// ── Room 6: result rules ─────────────────────────────────────
export const EFFORT = { low: 0.7, fair: 1, high: 1.05 }; // how hard the creator tries at each price
export const RUSH_PENALTY = 0.88; // 1-week deadline
// Rough rules of thumb, not sourced benchmarks: a reel reaches ~30–50 % of real followers,
// ~1–2.5 % of viewers click, ~2–5 % of clickers buy.
export const RATES = {
  reachPerFollower: 0.37, // share of real followers who see a post, before strengths
  clicksPerEngagement: 0.49, // clicks per engaged viewer, before fit + strengths
  buyRate: 0.041, // share of clickers who buy, before fit + strengths
};

// Verdict lines per goal. "Worth it" if at or under `good`, "Not yet" if at or under `ok`.
export const VERDICT_RULES = {
  reach: { metric: 'costPer1k', label: 'cost per 1,000 people reached', good: 30, ok: 50 },
  clicks: { metric: 'cpc', label: 'cost per click', good: 3, ok: 5 },
  sales: { metric: 'cps', label: 'cost per sale', good: 70, ok: 110 }, // the lamp sells for €149
};
