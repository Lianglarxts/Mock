// ─────────────────────────────────────────────────────────────
//  ALL FAKE DATA + THE SIMPLE RULES LIVE HERE.
//  Change a number below and every room updates on the next load.
//
//  Real brand names (Nothing, Fairphone, HAY) are used only as
//  recognisable examples. Product names and retail prices are
//  approximate public list prices; every other number about them
//  (budgets, payment record, past deals) is invented for the demo.
//  The creators and Lumen Studio are fictional.
// ─────────────────────────────────────────────────────────────

// ── Room 0: which side are you on? ───────────────────────────
export const SIDES = [
  { id: 'brand', label: "I'm a brand", note: 'Find a creator who fits your product.' },
  { id: 'creator', label: "I'm a creator", note: 'Find a brand you actually want to work with.' },
];

// ── Shared vocabulary ────────────────────────────────────────
export const GOALS = [
  { id: 'reach', label: 'Reach', note: 'Lots of people see the product' },
  { id: 'clicks', label: 'Clicks', note: 'People visit the shop' },
  { id: 'sales', label: 'Sales', note: 'People buy it' },
];

export const BUDGET = { min: 200, max: 4000, step: 50, start: 1500 };

export const REGION_LABELS = { UK: 'UK', EU: 'Europe', US: 'US', IN: 'India' };

// ── The brands ───────────────────────────────────────────────
// fit: how well the product suits each creator niche (0 to 1)
// ages / regions: who the brand sells to
// values: three words the brand stands for (matched against the creator's)
// goal / budget: what the brand usually wants from one post (used when YOU are the creator)
// offers: how much creative freedom (0 to 1) and whether they want a long-term partner
// paysOnTime / rehire: share of deals paid on time, share of creators who'd work with them again
// art: which pencil sketch to draw (see src/sketch/BrandArt.jsx)
export const BRANDS = [
  {
    id: 'nothing',
    name: 'Nothing',
    product: 'Phone (3a)',
    productPrice: 349,
    kind: 'phone',
    about: 'London consumer-tech brand. See-through design, light-up back.',
    fit: { desk: 0.8, interior: 0.4, tech: 1, maker: 0.4 },
    ages: [18, 34],
    regions: ['UK', 'EU', 'IN'],
    values: ['design', 'tech', 'bold'],
    goal: 'clicks',
    budget: 3000,
    offers: { freedom: 0.8, longTerm: true },
    paysOnTime: 0.97,
    rehire: 0.84,
    past: [
      { who: '@theo.tests', result: 'unboxing reel · 520 clicks', good: true },
      { who: '@mara.desk', result: 'desk setup · 410 clicks', good: true },
    ],
    art: 'glyph',
  },
  {
    id: 'fairphone',
    name: 'Fairphone',
    product: 'Fairphone (Gen. 6)',
    productPrice: 599,
    kind: 'phone',
    about: 'Amsterdam phone maker. Repairable phones, fairer materials.',
    fit: { desk: 0.6, interior: 0.3, tech: 0.8, maker: 1 },
    ages: [25, 45],
    regions: ['EU', 'UK'],
    values: ['sustainable', 'repair', 'tech'],
    goal: 'sales',
    budget: 1200,
    offers: { freedom: 0.9, longTerm: true },
    paysOnTime: 0.95,
    rehire: 0.88,
    past: [
      { who: '@ines.makes', result: 'repair-it-yourself video · 14 sales', good: true },
      { who: '@theo.tests', result: 'spec review · 3 sales', good: false },
    ],
    art: 'modular',
  },
  {
    id: 'hay',
    name: 'HAY',
    product: 'PC Portable lamp',
    productPrice: 129,
    kind: 'lamp',
    about: 'Copenhagen design brand. Colourful furniture and objects.',
    fit: { desk: 0.7, interior: 1, tech: 0.2, maker: 0.8 },
    ages: [25, 44],
    regions: ['EU', 'US', 'UK'],
    values: ['design', 'calm', 'craft'],
    goal: 'reach',
    budget: 2800,
    offers: { freedom: 0.6, longTerm: false },
    paysOnTime: 0.93,
    rehire: 0.75,
    past: [
      { who: '@jun.at.home', result: 'living room tour · 120k reached', good: true },
      { who: '@mara.desk', result: 'desk corner · 60 clicks', good: false },
    ],
    art: 'portable',
  },
  {
    id: 'lumen',
    name: 'Lumen Studio',
    product: 'Halo desk lamp',
    productPrice: 149,
    kind: 'lamp',
    about: 'A small, new lamp brand (fictional). Only a few deals so far.',
    fit: { desk: 1, interior: 0.6, tech: 0.5, maker: 0.6 },
    ages: [24, 40],
    regions: ['EU', 'UK'],
    values: ['design', 'minimal', 'craft'],
    goal: 'sales',
    budget: 900,
    offers: { freedom: 0.5, longTerm: false },
    paysOnTime: 0.8,
    rehire: 0.6,
    past: [
      { who: '@ines.makes', result: 'studio shelf · 9 sales', good: true },
      { who: 'a gadget channel', result: 'paid 3 weeks late', good: false },
    ],
    art: 'desk',
  },
];

// ── The creators (all fictional) ─────────────────────────────
// strengths: how good their audience is at each goal (0 to 1)
// engagement: share of followers who like/comment/save a typical post (small, loyal audiences run higher)
// realFollowers: share of followers that are real people
// ages / regions: who follows them (regions = share of followers per region)
// values: three words their content stands for
// wants: creative freedom they need and whether they look for long-term partners (used when YOU are the brand)
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
    ages: [24, 35],
    regions: { EU: 0.5, UK: 0.25, US: 0.25 },
    values: ['minimal', 'design', 'tech'],
    wants: { freedom: 0.7, longTerm: true },
    audienceNote: 'Work from home, care about tidy desks.',
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
    ages: [25, 44],
    regions: { US: 0.45, EU: 0.35, UK: 0.15, IN: 0.05 },
    values: ['calm', 'design', 'craft'],
    wants: { freedom: 0.9, longTerm: false },
    audienceNote: 'Broad, loves design, buys less often.',
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
    ages: [16, 28],
    regions: { IN: 0.35, US: 0.3, UK: 0.2, EU: 0.15 },
    values: ['tech', 'bold', 'affordable'],
    wants: { freedom: 0.5, longTerm: false },
    audienceNote: 'Young gadget fans. Some followers look bought.',
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
    nicheLabel: 'Handmade & repair',
    followers: 12000,
    engagement: 0.085,
    realFollowers: 0.98,
    ages: [28, 45],
    regions: { EU: 0.7, UK: 0.2, US: 0.1 },
    values: ['craft', 'sustainable', 'repair'],
    wants: { freedom: 0.95, longTerm: true },
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

// ── Room 1 (creator side): what you want from a brand ────────
export const PARTNERSHIP = [
  { value: false, label: 'One post', note: 'A one-off deal' },
  { value: true, label: 'Long-term', note: 'Several posts over months' },
];
export const FREEDOM = [
  { value: 0.5, label: 'Some is fine', note: 'Happy to follow a script' },
  { value: 0.9, label: 'A lot', note: 'I make it my way' },
];

// ── Room 2: alignment. Six areas, both sides. Points add up to 100. ──
export const AREAS = [
  { id: 'product', label: 'Product', points: 20 },
  { id: 'audience', label: 'Audience', points: 20 },
  { id: 'values', label: 'Values', points: 15 },
  { id: 'goal', label: 'Goal', points: 20 },
  { id: 'money', label: 'Money', points: 15 },
  { id: 'style', label: 'Way of working', points: 10 },
];
export const WEAK_AREA = 0.5; // below this an area counts as a gap
// Success chance = score × (WEAKEST_LINK.base + WEAKEST_LINK.weight × weakest area).
// So one big gap hurts more than several small ones.
export const WEAKEST_LINK = { base: 0.7, weight: 0.3 };

// ── Room 3: trust rules ──────────────────────────────────────
// creator: realFollowers × 60 + audience area × 40
// brand:   paysOnTime × 60 + rehire × 40
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

// What the creator makes at each price (by price ÷ fair middle).
export const DELIVERABLES = [
  { upTo: 0.8, items: ['1 reel', '7 days usage'], note: 'At this price, expect the bare minimum.' },
  { upTo: 1.0, items: ['1 reel', '2 stories', '30 days usage'], note: 'A fair, standard package.' },
  { upTo: 1.2, items: ['1 reel', '3 stories', 'link in bio for a week', '30 days usage'], note: 'Top of the fair range. A bit more is fair.' },
  { upTo: Infinity, items: ['1 reel', '3 stories', 'link in bio for a week', '60 days usage'], note: 'Well above fair. Everything above is expected.' },
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
export const PAID_ADS = { fee: 0.2, reachBoost: 1.35 }; // the brand may boost the post with ads
export const EXCLUSIVE = { fee: 0.15 }; // creator can't promote rival products for 3 months
export const PLATFORM_FEE = 0.1; // our fee on each deal, paid by the brand

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
// ~1–2.5 % of viewers click, ~2–5 % of clickers buy (fewer for pricier products).
export const RATES = {
  reachPerFollower: 0.37, // share of real followers who see a post, before strengths
  clicksPerEngagement: 0.7, // clicks per engaged viewer, before alignment + strengths
  buyRate: 0.05, // share of clickers who buy a €149 product, before alignment + strengths
  priceRef: 149, // pricier products convert less: × √(priceRef / price)
};

// Brand verdict per goal. "Worth it" if at or under `good`, "Not yet" if at or under `ok`.
// For sales, the limits are a share of the product's price.
export const VERDICT_RULES = {
  reach: { metric: 'costPer1k', label: 'cost per 1,000 people reached', good: 30, ok: 50 },
  clicks: { metric: 'cpc', label: 'cost per click', good: 3, ok: 5 },
  sales: { metric: 'cps', label: 'cost per sale', goodShare: 0.47, okShare: 0.74 },
};

// Creator verdict: values below this make followers trust the creator less.
export const CREATOR_VALUES_MIN = 0.5;
