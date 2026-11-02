import { useDeal } from '../deal/DealContext.jsx';
import { getCreator, num, trust } from '../deal/derive.js';
import { useNav } from '../deal/Nav.jsx';
import { Encircle } from '../sketch/drawings.jsx';
import Portrait from '../sketch/Portrait.jsx';
import Ring from '../sketch/Ring.jsx';
import { Rough, RoughBox } from '../sketch/rough.jsx';
import { Btn } from '../sketch/ui.jsx';
import { Room } from './Room.jsx';

// Each part starts as a light pencil outline; hover / focus / tap "paints in" the details.
function Part({ seedKey, label, children }) {
  return (
    <RoughBox className="check-part" seedKey={seedKey} stroke="soft" fill="faint" strokeWidth={1.3} tabIndex={0} tilt opts={{ hachureGap: 7 }}>
      <div className="part-label">{label}</div>
      {children}
    </RoughBox>
  );
}

export default function Check() {
  const { deal, dispatch } = useDeal();
  const { goTo } = useNav();
  const c = getCreator(deal.creatorId);
  if (!c) return <Room index={3} />;
  const t = trust(c);
  const realPct = Math.round(c.realFollowers * 100);
  const fitPct = Math.round(c.audienceFit * 100);
  const first = c.name.split(' ')[0];

  return (
    <Room index={3}>
      <div className="room-body check">
        <div className="check-who">
          <RoughBox className="frame small" seedKey={'chk' + c.id} inset={2}><Portrait creator={c} /></RoughBox>
          <div>
            <div className="creator-name">{c.name}</div>
            <div className="creator-meta">{c.handle} · {num(c.followers)} followers</div>
          </div>
          <p className="hand-note check-hint">hover each part to see more</p>
        </div>

        <div className="check-grid" key={c.id}>
          <Part seedKey={'p1' + c.id} label="Real followers">
            <div className="ring-row">
              <Ring real={c.realFollowers} seedKey={'ring' + c.id} />
              <div>
                <div className="part-value">{realPct}% real</div>
                <div className="part-detail">{100 - realPct}% look fake or inactive<span className="money"> (red)</span>.</div>
              </div>
            </div>
          </Part>

          <Part seedKey={'p2' + c.id} label="Audience fit">
            <svg viewBox="0 0 200 22" className="fit-bar" aria-hidden="true">
              <Rough shape="rectangle" args={[2, 3, 196, 16]} strokeWidth={1.4} seedKey={'bo' + c.id} />
              <Rough shape="rectangle" args={[4, 5, 192 * c.audienceFit, 12]} stroke="graphite" fill="graphite" strokeWidth={0.6} seedKey={'bi' + c.id} opts={{ hachureGap: 2.6 }} />
            </svg>
            <div className="part-value">{fitPct}% look like your buyers</div>
            <div className="part-detail">{c.audienceNote}</div>
          </Part>

          <Part seedKey={'p3' + c.id} label="Past campaigns">
            <ul className="past">
              {c.past.map((p) => (
                <li key={p.brand}>
                  <span className={`past-mark ${p.good ? '' : 'is-bad'}`} aria-label={p.good ? 'went well' : 'went badly'}>{p.good ? '✓' : '✗'}</span>
                  <div>
                    <b>{p.brand}</b>
                    <div className="part-detail">{p.result}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Part>
        </div>

        <div className="trust" key={"t" + c.id}>
          <span className="trust-label">Trust:</span>{' '}
          <Encircle seedKey={'tr' + c.id} color={t.word === 'Strong' ? 'graphite' : 'accent'}>
            <span className="trust-word">{t.word}</span>
          </Encircle>
          {t.word === 'Low' && <span className="hand-note">Risky. You can still go back and pick someone else.</span>}
        </div>

        <div className="next-door">
          <Btn onClick={() => { dispatch({ type: 'confirmCheck' }); goTo(4); }} seedKey="trust-btn">I trust {first} →</Btn>
          <Btn variant="ghost" onClick={() => goTo(2)} seedKey="pick-other">Pick someone else</Btn>
        </div>
      </div>
    </Room>
  );
}
