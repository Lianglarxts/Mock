import { useDeal } from '../deal/DealContext.jsx';
import { dealAlignment, num, parties, partnerTrust, partyName, regionList } from '../deal/derive.js';
import { useNav } from '../deal/Nav.jsx';
import AlignBars from '../sketch/AlignBars.jsx';
import { Avatar } from '../sketch/BrandArt.jsx';
import { Encircle } from '../sketch/drawings.jsx';
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

function Bar({ value, k }) {
  return (
    <svg viewBox="0 0 200 22" className="fit-bar" aria-hidden="true">
      <Rough shape="rectangle" args={[2, 3, 196, 16]} strokeWidth={1.4} seedKey={'bo' + k} />
      <Rough shape="rectangle" args={[4, 5, 192 * value, 12]} stroke="graphite" fill="graphite" strokeWidth={0.6} seedKey={'bi' + k} opts={{ hachureGap: 2.6 }} />
    </svg>
  );
}

function Past({ items }) {
  return (
    <ul className="past">
      {items.map((p) => (
        <li key={p.brand || p.who}>
          <span className={`past-mark ${p.good ? '' : 'is-bad'}`} aria-label={p.good ? 'went well' : 'went badly'}>{p.good ? '✓' : '✗'}</span>
          <div>
            <b>{p.brand || p.who}</b>
            <div className="part-detail">{p.result}</div>
          </div>
        </li>
      ))}
    </ul>
  );
}

// Brand side: is this creator's audience real, and is it the audience you sell to?
function CreatorParts({ c, t }) {
  const realPct = Math.round(c.realFollowers * 100);
  return (
    <>
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
        <Bar value={t.audience} k={c.id} />
        <div className="part-value">{Math.round(t.audience * 100)}% look like your buyers</div>
        <div className="part-detail">{c.audienceNote}</div>
      </Part>
      <Part seedKey={'p3' + c.id} label="Past campaigns"><Past items={c.past} /></Part>
    </>
  );
}

// Creator side: will this brand pay, let you do your thing, and do creators come back?
function BrandParts({ b }) {
  const paidPct = Math.round(b.paysOnTime * 100);
  return (
    <>
      <Part seedKey={'p1' + b.id} label="Pays on time">
        <div className="ring-row">
          <Ring real={b.paysOnTime} seedKey={'ring' + b.id} />
          <div>
            <div className="part-value">{paidPct}% on time</div>
            <div className="part-detail">{100 - paidPct}% of deals were paid late<span className="money"> (red)</span>.</div>
          </div>
        </div>
      </Part>
      <Part seedKey={'p2' + b.id} label="Creators who'd work with them again">
        <Bar value={b.rehire} k={b.id} />
        <div className="part-value">{Math.round(b.rehire * 100)}% would again</div>
        <div className="part-detail">{b.about}</div>
      </Part>
      <Part seedKey={'p3' + b.id} label="Past creator deals"><Past items={b.past} /></Part>
    </>
  );
}

export default function Check() {
  const { deal, dispatch } = useDeal();
  const { goTo } = useNav();
  const { partner, brand, creator, isBrand } = parties(deal);
  if (!partner) return <Room index={3} />;
  const t = partnerTrust(deal);
  const a = dealAlignment(deal);
  const name = partyName(partner);

  return (
    <Room index={3}>
      <div className="room-body check">
        <div className="check-who">
          <RoughBox className="frame small" seedKey={'chk' + partner.id} inset={2}><Avatar party={partner} /></RoughBox>
          <div>
            <div className="creator-name">{partner.name}</div>
            <div className="creator-meta">
              {isBrand ? `${creator.handle} · ${num(creator.followers)} followers` : `${brand.product} · sells in ${regionList(brand.regions)}`}
            </div>
          </div>
          <p className="hand-note check-hint">
            {!isBrand && <span className="money">these figures are invented for the demo · </span>}
            hover each part to see more
          </p>
        </div>

        <div className="check-grid" key={partner.id}>
          {isBrand ? <CreatorParts c={creator} t={t} /> : <BrandParts b={brand} />}
        </div>

        <details className="check-align" key={'a' + partner.id}>
          <summary><span className="part-label">Where you line up</span> <span className="hand-note">{a.score}/100 · {a.success}% likely to work</span></summary>
          <AlignBars rows={a.rows} seedKey={'cab' + partner.id} detail />
        </details>

        <div className="trust" key={'t' + partner.id}>
          <span className="trust-label">Trust:</span>{' '}
          <Encircle seedKey={'tr' + partner.id} color={t.word === 'Strong' ? 'graphite' : 'accent'}>
            <span className="trust-word">{t.word}</span>
          </Encircle>
          {t.word === 'Low' && <span className="hand-note">Risky. You can still go back and pick someone else.</span>}
          {t.word === 'Okay' && !isBrand && <span className="hand-note">New brand, short track record. The jar protects you.</span>}
        </div>

        <div className="next-door">
          <Btn onClick={() => { dispatch({ type: 'confirmCheck' }); goTo(4); }} seedKey="trust-btn">I trust {name} →</Btn>
          <Btn variant="ghost" onClick={() => goTo(2)} seedKey="pick-other">Pick {isBrand ? 'someone' : 'a brand'} else</Btn>
        </div>
      </div>
    </Room>
  );
}
