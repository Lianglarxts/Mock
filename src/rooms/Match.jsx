import { useDeal } from '../deal/DealContext.jsx';
import { fitScore, num } from '../deal/derive.js';
import { CREATORS } from '../data.js';
import { Tick } from '../sketch/drawings.jsx';
import Portrait from '../sketch/Portrait.jsx';
import { RoughBox } from '../sketch/rough.jsx';
import { NextDoor, Room } from './Room.jsx';

export default function Match() {
  const { deal, dispatch, prog } = useDeal();
  const scored = CREATORS.map((c) => ({ c, fit: fitScore(c, deal.brief) }));
  const best = Math.max(...scored.map((s) => s.fit.score));

  return (
    <Room index={2}>
      <div className="room-body match">
        <p className="lead">Each fit score adds up three things: do their followers like this kind of product, are they good at your goal, and do they fit your budget? Pick one.</p>
        <div className="creators" role="radiogroup" aria-label="Creators">
          {scored.map(({ c, fit }) => {
            const on = deal.creatorId === c.id;
            return (
              <RoughBox
                as="button"
                key={c.id}
                type="button"
                role="radio"
                aria-checked={on}
                className={`creator ${on ? 'is-on' : ''}`}
                onClick={() => dispatch({ type: 'pickCreator', id: c.id })}
                seedKey={'card' + c.id}
                stroke={on ? 'graphite' : 'faint'}
                strokeWidth={on ? 2 : 1.3}
                tilt
              >
                {on && <span className="creator-tick"><Tick seedKey={'tk' + c.id} size={36} /></span>}
                <RoughBox className="frame" seedKey={'fr' + c.id} strokeWidth={1.6} inset={3}>
                  <Portrait creator={c} />
                </RoughBox>
                <div className="creator-text">
                  {fit.score === best && <span className="best-tag hand-note">best fit</span>}
                  <div className="creator-name">{c.name}</div>
                  <div className="creator-meta">{c.handle} · {c.nicheLabel}</div>
                  <div className="creator-meta">{num(c.followers / 1000)}k followers · {(c.engagement * 100).toFixed(1)}% engagement</div>
                  <div className="fit">
                    <span className="fit-num">{fit.score}</span>
                    <span className="fit-of">/100 fit</span>
                  </div>
                  <div className="fit-parts hand-note">
                    product {fit.parts.niche} + goal {fit.parts.goal} + budget {fit.parts.budget}
                  </div>
                </div>
              </RoughBox>
            );
          })}
        </div>
        <NextDoor index={2} ready={prog.done[2]} label="Check them" hint="Pick a creator." />
      </div>
    </Room>
  );
}
