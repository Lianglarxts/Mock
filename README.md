# Lumen Deal: a sketchbook concept demo

A front-end-only mock-up with fake data and no backend. It's a two-sided marketplace, and the visitor picks a side at the entrance:

- **As a brand** (Nothing, Fairphone, HAY or the fictional Lumen Studio), you set a goal and a budget, then look for a creator.
- **As a creator** (four fictional creators), you set your minimum fee, the kind of deal you want and how much creative freedom you need, then look for a brand.

Either way, both sides are scored on how well they **line up in six areas** before anyone signs. The result gives a verdict **for each side**. Each room uses the choices made in the rooms before it. Nothing is random.

> Real brand names are used only as recognisable examples. Product names and retail prices are approximate list prices. Every other number about them (budgets, payment record, past deals) is invented, and the demo isn't affiliated with any of them. The product sketches are generic drawings, not logos.

## Run it

```bash
npm install
npm run dev        # opens on http://localhost:5173 (or the next free port)
npm run build      # production build in dist/
npm run preview    # serve the build
```

Requires Node 18 or newer.

### Shareable single page

```bash
npm run build:single   # writes dist-single/lumen-deal.html
```

This packs the whole app into one self-contained HTML file. The JS and CSS are inlined and only the fonts load from Google Fonts. It's the version published as a private claude.ai artifact. To update the shared link, run the command and ask Claude to republish `dist-single/lumen-deal.html` to the artifact's URL.

## Where to change things

| What | Where |
|---|---|
| **All fake data and rules**: sides, the 4 brands, the 4 creators, goals, budget range, creator preferences, the six alignment areas and their points, trust thresholds, fair-price band, deliverables per price, deal terms and their costs, result rates, verdict thresholds | `src/data.js` |
| How alignment, success chance, trust, fair range, costs, results and both verdicts are calculated | `src/deal/derive.js` |
| The shared deal state (what's stored, what resets when you go back) | `src/deal/DealContext.jsx` |
| Room order, titles and questions | `src/deal/Nav.jsx` |
| One component per room | `src/rooms/*.jsx` |
| Hand-drawn pieces (rough.js wrapper, doors, padlock, portraits, product sketches, alignment bars, jar, ruler, map) | `src/sketch/` |
| Colours, fonts, pencil cursor | `src/styles/tokens.css` |
| Layout, paper grain, room styles | `src/styles/base.css`, `src/styles/rooms.css` |
| All animation (and the reduced-motion switch-off) | `src/styles/motion.css` |

### How the match is scored

Six areas, each scored 0–1 from both sides' data, then weighted to 100 points (`AREAS` in `src/data.js`):

| Area | Points | Compares |
|---|---|---|
| Product | 20 | the brand's `fit` for the creator's `niche` |
| Audience | 20 | the brand's `ages` / `regions` with the creator's follower `ages` / `regions` |
| Values | 15 | how many of their three `values` words they share |
| Goal | 20 | the brand's goal with the creator's `strengths` |
| Money | 15 | the brand's budget with the creator's price (fair rate on the brand side, your own minimum on the creator side) |
| Way of working | 10 | creative freedom and one-off vs long-term: what the brand `offers` and what the creator `wants` |

**Success chance** = score × (0.7 + 0.3 × weakest area), so one big gap hurts more than several small ones. Areas under 0.5 count as gaps and are drawn in red. Alignment also feeds the results (reach, clicks and sales), so better-aligned pairs really do perform better.

Your own goal, budget, minimum fee, deal type and freedom come from your brief. The other side's come from their profile (`goal`, `budget`, `wants`).

### Adding or editing a brand or creator

Copy an entry in `BRANDS` or `CREATORS` in `src/data.js`. The Match room shows four cards side by side on desktop, so a fifth would need a layout change in `src/styles/rooms.css` (`.creators`).

- A brand's `fit` needs a key for each creator `niche` (`desk`, `interior`, `tech`, `maker`). `art` picks the sketch (`glyph`, `modular`, `portable` or `desk`), and `kind` fills in the exclusivity term ("no other phone brands").
- `paysOnTime` and `rehire` set a brand's trust word. `realFollowers` and the audience area set a creator's.
- `regions` codes are `UK`, `EU`, `US` and `IN` (labels in `REGION_LABELS`). Brands list the regions they sell in. Creators give the share of their followers in each one.
- `engagement` drives clicks, `strengths` sets how good a creator's audience is at reach, clicks and sales (0–1), and `ratePer1k` and `followers` set the fair price.
- `portrait.hair` can be `curly`, `bun`, `short` or `long`, and `portrait.glasses` is `true` or `false`.

## How the deal works

- **Only the visitor's choices are stored:** side, brief, brand, creator, check, offer, terms and escrow step. Everything else is derived on each render, so changing an earlier choice updates every room straight away.
- **Picking a side** (or switching sides from the exit) starts a fresh deal.
- **Changing the brief** keeps your partner and price and recalculates everything. On the creator side, picking a different creator also clears the price, because your fair rate changes.
- **Changing the partner, price or terms** sends the money timeline back to step 0, because the deal has to be agreed again.
- **"Try another brand / creator"** keeps the brief and clears everything from the partner on.
- **A room unlocks only when the room before it is done.** On desktop, scrolling stops at the next locked door.

## Layout

- **Desktop (1024px wide or more, 600px tall or more):** rooms sit side by side. Vertical scrolling moves the corridor sideways, using GSAP ScrollTrigger and Lenis.
- **Smaller screens:** rooms stack vertically. The same locking applies, and locked rooms show a closed door.

Stack: React + Vite, GSAP (ScrollTrigger), Lenis, rough.js, plain CSS. Fonts are Instrument Serif, Inter and Caveat, from Google Fonts.
