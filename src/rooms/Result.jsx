import { useDeal } from '../deal/DealContext.jsx';
import { getCreator, money, num, results } from '../deal/derive.js';
import { useNav } from '../deal/Nav.jsx';
import { Btn } from '../sketch/ui.jsx';
import CountUp from '../sketch/CountUp.jsx';
import { Encircle } from '../sketch/drawings.jsx';
import { Scribble } from '../sketch/rough.jsx';
import { NextDoor, Room } from './Room.jsx';

export default function Result() {
  const { deal, dispatch, prog } = useDeal();
  const { goTo, seen } = useNav();
  if (!prog.done[5]) return <Room index={6} />;
  const c = getCreator(deal.creatorId);
  const r = results(deal);
  const goal = deal.brief.goal;

  const stats = [
    { key: 'reach', label: 'People reached', value: r.reach, fmt: num },
    { key: 'clicks', label: 'Clicks', value: r.clicks, fmt: num },
    { key: 'sales', label: 'Sales', value: r.sales, fmt: num },
    { key: 'cpc', label: 'Cost per click', value: r.cpc, fmt: (v) => money(v, 2), money: true },
    { key: 'cps', label: 'Cost per sale', value: r.cps, fmt: (v) => money(v), money: true },
  ];
  const highlight = { reach: 'reach', clicks: 'cpc', sales: 'cps' }[goal];

  return (
    <Room index={6}>
      <div className="room-body result">
        <p className="lead">30 days after {c.name.split(' ')[0]} posted. Total cost <b className="money">{money(r.total)}</b>.</p>
        <div className="stats">
          {stats.map((s) => (
            <div key={s.key} className={`stat ${s.key === highlight ? 'is-goal' : ''}`}>
              <Scribble seedKey={'st' + s.key} color={s.key === highlight ? 'accent' : 'graphite'} width={s.key === highlight ? 2.4 : 1.3} />
              <div className={`stat-value ${s.money ? 'money' : ''}`}><CountUp value={s.value} format={s.fmt} play={seen.has(6)} /></div>
              <div className="stat-label">{s.label}{s.key === highlight && <span className="hand-note"> ← your goal</span>}</div>
            </div>
          ))}
        </div>

        <div key={r.verdict + r.reason} className={`verdict verdict-${r.verdict.replace(/\s/g, '-').toLowerCase()}`} aria-live="polite">
          <div className="verdict-word"><Encircle seedKey={'v' + r.verdict}>{r.verdict}</Encircle></div>
          <p className="verdict-why">{r.reason}</p>
        </div>

        <div className="next-door">
          <Btn variant="ghost" onClick={() => { dispatch({ type: 'retry' }); goTo(2); }}>↺ Try another choice</Btn>
          <NextDoor index={6} ready label="To the exit" />
        </div>
      </div>
    </Room>
  );
}
