# Lumen Deal: a sketchbook concept demo

A front-end-only mock-up with fake data and no backend. The visitor plays the owner of **Lumen Studio**, a small lamp brand, and follows one deal with one creator from brief to result. Each room uses the choices made in the rooms before it. Nothing is random.

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
| **All fake data and rules**: brand, goals, budget range, product types, the 3 creators, fit points, trust thresholds, fair-price band, deliverables per price, deal terms and their costs, result rates, verdict thresholds | `src/data.js` |
| How scores, fair range, costs, results and the verdict sentence are calculated | `src/deal/derive.js` |
| The shared deal state (what's stored, what resets when you go back) | `src/deal/DealContext.jsx` |
| Room order, titles and questions | `src/deal/Nav.jsx` |
| One component per room | `src/rooms/*.jsx` |
| Hand-drawn pieces (rough.js wrapper, doors, padlock, lamp, portraits, jar, ruler, map) | `src/sketch/` |
| Colours, fonts, pencil cursor | `src/styles/tokens.css` |
| Layout, paper grain, room styles | `src/styles/base.css`, `src/styles/rooms.css` |
| All animation (and the reduced-motion switch-off) | `src/styles/motion.css` |

### Adding or editing a creator
Copy one entry in `CREATORS` in `src/data.js`. The Match room shows four creators side by side on desktop, so a fifth would need a layout change in `src/styles/rooms.css` (`.creators`). The fields that matter:

- `niche` must be one of the keys in each product's `fit` (`desk`, `interior`, `tech`, `maker`)
- `engagement` (share of followers who interact with a post) drives clicks; small, loyal audiences run higher
- `strengths` sets how good their audience is at reach, clicks and sales (0–1)
- `realFollowers` and `audienceFit` set the trust word
- `ratePer1k` and `followers` set the fair price
- `portrait.hair` can be `curly`, `bun`, `short` or `long`, and `portrait.glasses` is `true` or `false`

## How the deal works

- **Only the visitor's choices are stored:** brief, creator, check, offer, terms and escrow step. Everything else is derived on each render, so changing an earlier choice updates every room straight away.
- **Changing the brief** keeps your creator and price and recalculates everything.
- **Changing the creator, price or terms** sends the money timeline back to step 0, because the deal has to be agreed again.
- **"Try another choice"** keeps the brief and clears everything from the creator on.
- **A room unlocks only when the room before it is done.** On desktop, scrolling stops at the next locked door.

## Layout

- **Desktop (1024px wide or more, 600px tall or more):** rooms sit side by side. Vertical scrolling moves the corridor sideways, using GSAP ScrollTrigger and Lenis.
- **Smaller screens:** rooms stack vertically. The same locking applies, and locked rooms show a closed door.

Stack: React + Vite, GSAP (ScrollTrigger), Lenis, rough.js, plain CSS. Fonts are Instrument Serif, Inter and Caveat, from Google Fonts.
