import { useState } from 'react';
import { useDeal } from '../deal/DealContext.jsx';
import { costs, fairRange, money, parties, partnerTrust, priceZone, results } from '../deal/derive.js';
import { useNav } from '../deal/Nav.jsx';
import { DEADLINES, USAGE } from '../data.js';
import { Btn } from '../sketch/ui.jsx';
import { Tick } from '../sketch/drawings.jsx';
import { RoughBox, Scribble } from '../sketch/rough.jsx';
import { Room } from './Room.jsx';

const ZONE_WORD = { low: 'below fair', fair: 'fair', high: 'above fair' };

export default function Exit() {
  const { deal, dispatch, prog } = useDeal();
  const { goTo } = useNav();
  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);
  if (!prog.done[5]) return <Room index={7} />;

  const { brand, creator: c, isBrand } = parties(deal);
  const r = results(deal);
  const cost = costs(deal.offer, deal.terms);
  const zone = priceZone(deal.offer, fairRange(c));
  const t = deal.terms;
  const rights = [
    USAGE.find((u) => u.months === t.usageMonths).label + ' usage',
    t.paidAds ? 'paid ads' : 'no paid ads',
    t.exclusive ? 'exclusive' : 'not exclusive',
  ].join(', ');

  const rows = [
    ['You were', isBrand ? `the brand (${brand.name})` : `the creator (${c.name})`],
    ['Brand', `${brand.name} · ${brand.product}`],
    ['Creator', `${c.name} · ${c.handle}`],
    ['Lined up', `${r.align.score}/100 · ${r.align.success}% likely to work · trust ${partnerTrust(deal).word}`],
    ['Price', `${money(deal.offer)} (${ZONE_WORD[zone]})`],
    ['Deadline', DEADLINES.find((d) => d.days === t.deadlineDays).label],
    ['Rights', rights],
    [isBrand ? 'Total paid' : 'You earned', money(isBrand ? cost.total : cost.creatorGets)],
    ['Verdict', `${r.verdict} for you · ${r.theirVerdict} for them`],
  ];

  return (
    <Room index={7}>
      <div className="room-body exit">
        <RoughBox as="dl" className="summary" seedKey="summary" fill="paperLight" fillStyle="solid" strokeWidth={1.6} tilt={0.5}>
          <div className="summary-head hand-note">deal no. 0142 · signed &amp; paid</div>
          {rows.map(([k, v], i) => (
            <div key={k} className={`summary-row ${i === 7 ? 'is-money' : ''}`}><dt>{k}</dt><dd>{v}</dd></div>
          ))}
        </RoughBox>

        <div className="exit-side">
          <p className="fee-line">Brands pay a small fee (about 10%) on each deal. Creators pay nothing. <span className="underlined">No ads.<Scribble seedKey="noads" color="accent" /></span></p>

          {joined ? (
            <p className="ok thanks"><Tick size={26} seedKey="thx" /> Thanks! You’re on the list. (This is a demo, so nothing was sent.)</p>
          ) : (
            <form className="waitlist" onSubmit={(e) => { e.preventDefault(); if (email.includes('@')) setJoined(true); }}>
              <label htmlFor="wl" className="field-label">Join the waitlist as a {isBrand ? 'brand' : 'creator'}</label>
              <div className="waitlist-row">
                <span className="waitlist-input">
                  <input id="wl" type="email" required placeholder={isBrand ? 'you@yourbrand.com' : 'you@yourname.com'} value={email} onChange={(e) => setEmail(e.target.value)} />
                  <Scribble seedKey="wl" />
                </span>
                <Btn type="submit" seedKey="join">Join</Btn>
              </div>
            </form>
          )}

          <div className="next-door">
            <Btn variant="ghost" onClick={() => { dispatch({ type: 'reset' }); goTo(0); }} seedKey="restart">↺ Start a new deal</Btn>
            <Btn variant="ghost" onClick={() => { dispatch({ type: 'start', side: isBrand ? 'creator' : 'brand' }); goTo(1); }} seedKey="switch">
              Try it as a {isBrand ? 'creator' : 'brand'} →
            </Btn>
          </div>
        </div>
      </div>
    </Room>
  );
}
