import { useDeal } from '../deal/DealContext.jsx';
import { alignment, getBrand, getCreator, goalLabel, money, num } from '../deal/derive.js';
import { BRANDS, CREATORS } from '../data.js';
import AlignBars from '../sketch/AlignBars.jsx';
import { Avatar } from '../sketch/BrandArt.jsx';
import { Tick } from '../sketch/drawings.jsx';
import { RoughBox } from '../sketch/rough.jsx';
import { NextDoor, Room } from './Room.jsx';

export default function Match() {
  const { deal, dispatch, prog } = useDeal();
  if (!prog.done[1]) return <Room index={2} />;
  const isBrand = deal.side === 'brand';
  const me = isBrand ? getBrand(deal.brandId) : getCreator(deal.creatorId);
  const list = isBrand ? CREATORS : BRANDS;
  const scored = list.map((p) => {
    const a = isBrand ? alignment(me, p, deal) : alignment(p, me, deal);
    return { p, a };
  });
  // best = highest success chance; ties go to the higher alignment score
  const best = scored.reduce((b, s) => (s.a.success > b.a.success || (s.a.success === b.a.success && s.a.score > b.a.score) ? s : b)).p.id;
  const picked = isBrand ? deal.creatorId : deal.brandId;

  return (
    <Room index={2}>
      <div className="room-body match">
        <p className="lead">
          We score six areas, from both sides. A gap in any one of them (drawn in red) drags down the chance the deal
          works, so the best pick is the one without big gaps. Pick {isBrand ? 'a creator' : 'a brand'}.
        </p>
        <div className="creators" role="radiogroup" aria-label={isBrand ? 'Creators' : 'Brands'}>
          {scored.map(({ p, a }) => {
            const on = picked === p.id;
            return (
              <RoughBox
                as="button"
                key={p.id}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={`${p.name}: ${a.success}% likely to work, ${a.score} out of 100 aligned`}
                className={`creator ${on ? 'is-on' : ''}`}
                onClick={() => dispatch({ type: 'pickPartner', id: p.id })}
                seedKey={'card' + p.id}
                stroke={on ? 'graphite' : 'faint'}
                strokeWidth={on ? 2 : 1.3}
                tilt
              >
                {on && <span className="creator-tick"><Tick seedKey={'tk' + p.id} size={36} /></span>}
                <RoughBox className="frame" seedKey={'fr' + p.id} strokeWidth={1.6} inset={3}>
                  <Avatar party={p} />
                </RoughBox>
                <div className="creator-text">
                  {p.id === best && <span className="best-tag hand-note">best match</span>}
                  <div className="creator-name">{p.name}</div>
                  {isBrand ? (
                    <>
                      <div className="creator-meta">{p.handle} · {p.nicheLabel}</div>
                      <div className="creator-meta">{num(p.followers / 1000)}k followers · {(p.engagement * 100).toFixed(1)}% engagement</div>
                    </>
                  ) : (
                    <>
                      <div className="creator-meta">{p.product} · {money(p.productPrice)}</div>
                      <div className="creator-meta">wants {goalLabel(p.goal)} · budget ~{money(p.budget)}</div>
                    </>
                  )}
                  <div className="fit">
                    <span className="fit-num">{a.success}%</span>
                    <span className="fit-of">likely to work</span>
                  </div>
                  <div className="fit-parts hand-note">
                    {a.score}/100 aligned · {a.gaps.length ? `gap: ${a.gaps.map((g) => g.label.toLowerCase()).join(', ')}` : 'no gaps'}
                  </div>
                  <AlignBars rows={a.rows} seedKey={'ab' + p.id} />
                </div>
              </RoughBox>
            );
          })}
        </div>
        <NextDoor index={2} ready={prog.done[2]} label="Check them" hint={`Pick ${isBrand ? 'a creator' : 'a brand'}.`} />
      </div>
    </Room>
  );
}
