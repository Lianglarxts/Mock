import { useDeal } from '../deal/DealContext.jsx';
import { firstName, money, num, parties, results } from '../deal/derive.js';
import { useNav } from '../deal/Nav.jsx';
import { Btn } from '../sketch/ui.jsx';
import CountUp from '../sketch/CountUp.jsx';
import { Encircle } from '../sketch/drawings.jsx';
import { Scribble } from '../sketch/rough.jsx';
import { NextDoor, Room } from './Room.jsx';

const slug = (v) => v.replace(/\s/g, '-').toLowerCase();

export default function Result() {
  const { deal, dispatch, prog } = useDeal();
  const { goTo, seen } = useNav();
  if (!prog.done[5]) return <Room index={6} />;
  const { brand, creator, isBrand, partner } = parties(deal);
  const r = results(deal);

  const stats = [
    { key: 'reach', label: 'People reached', value: r.reach, fmt: num },
    { key: 'clicks', label: 'Clicks', value: r.clicks, fmt: num },
    { key: 'sales', label: 'Sales', value: r.sales, fmt: num },
    isBrand
      ? { key: 'cpc', label: 'Cost per click', value: r.cpc, fmt: (v) => money(v, 2), money: true }
      : { key: 'earned', label: 'You earned', value: r.earned, fmt: (v) => money(v), money: true },
    { key: 'cps', label: 'Cost per sale', value: r.cps, fmt: (v) => money(v), money: true },
  ];
  const highlight = isBrand ? { reach: 'reach', clicks: 'cpc', sales: 'cps' }[r.goal] : 'earned';
  const theirName = isBrand ? firstName(creator) : brand.name;

  return (
    <Room index={6}>
      <div className="room-body result">
        <p className="lead">
          30 days after {isBrand ? firstName(creator) : 'you'} posted about the {brand.product}. {brand.name} paid{' '}
          <b className="money">{money(r.total)}</b> in total.
          {!isBrand && ` Their goal was ${r.goal}.`}
        </p>
        <div className="stats">
          {stats.map((s) => (
            <div key={s.key} className={`stat ${s.key === highlight ? 'is-goal' : ''}`}>
              <Scribble seedKey={'st' + s.key} color={s.key === highlight ? 'accent' : 'graphite'} width={s.key === highlight ? 2.4 : 1.3} />
              <div className={`stat-value ${s.money ? 'money' : ''}`}><CountUp value={s.value} format={s.fmt} play={seen.has(6)} /></div>
              <div className="stat-label">{s.label}{s.key === highlight && <span className="hand-note"> ← {isBrand ? 'your goal' : 'yours'}</span>}</div>
            </div>
          ))}
        </div>

        <div className="verdicts">
          <div key={r.verdict + r.reason} className={`verdict verdict-${slug(r.verdict)}`} aria-live="polite">
            <div className="verdict-for hand-note">for you</div>
            <div className="verdict-word"><Encircle seedKey={'v' + r.verdict}>{r.verdict}</Encircle></div>
            <p className="verdict-why">{r.reason}</p>
          </div>
          <div className={`verdict verdict-them verdict-${slug(r.theirVerdict)}`}>
            <div className="verdict-for hand-note">for {theirName}</div>
            <div className="verdict-them-word">{r.theirVerdict}</div>
            <p className="part-detail">{r.theirLine}</p>
          </div>
        </div>
        <p className="hand-note both-line">
          {r.verdict === 'Worth it' && r.theirVerdict === 'Worth it'
            ? `Both sides won. You lined up ${r.align.score}/100 going in.`
            : `A good deal works for both sides. The weakest area going in was ${r.align.weakest.label.toLowerCase()}.`}
        </p>

        <div className="next-door">
          <Btn variant="ghost" onClick={() => { dispatch({ type: 'retry' }); goTo(2); }}>↺ Try another {partner && 'handle' in partner ? 'creator' : 'brand'}</Btn>
          <NextDoor index={6} ready label="To the exit" />
        </div>
      </div>
    </Room>
  );
}
