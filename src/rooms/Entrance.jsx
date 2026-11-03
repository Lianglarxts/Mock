import { useDeal } from '../deal/DealContext.jsx';
import { useNav } from '../deal/Nav.jsx';
import { BRANDS, CREATORS, SIDES } from '../data.js';
import BrandArt from '../sketch/BrandArt.jsx';
import Portrait from '../sketch/Portrait.jsx';
import { Rough, RoughBox, Scribble } from '../sketch/rough.jsx';
import { Btn } from '../sketch/ui.jsx';
import { Room } from './Room.jsx';

export default function Entrance() {
  const { deal, dispatch } = useDeal();
  const { goTo } = useNav();
  return (
    <Room index={0}>
      <div className="entrance">
        <div className="entrance-text">
          <p className="hand-note">a concept demo · real brands as examples · all numbers made up</p>
          <h1 className="hero">
            One brand. One creator. A deal that works{' '}
            <span className="underlined">for both.<Scribble seedKey="hero" color="accent" width={3} /></span>
          </h1>
          <p className="hero-line">Brands find creators. Creators find brands.</p>
          <p className="hero-story">
            Before anyone signs, we check you line up in six areas: product, audience, values, goal, money and
            way of working. The fewer gaps, the better the chance it works.
          </p>
          <div className="sides">
            {SIDES.map((s) => (
              <div key={s.id} className="side">
                <Btn
                  variant={deal.side && deal.side !== s.id ? 'ghost' : 'main'}
                  onClick={() => { dispatch({ type: 'start', side: s.id }); goTo(1); }}
                  seedKey={'side' + s.id}
                >
                  {s.label} →
                </Btn>
                <span className="side-note">{s.note}</span>
              </div>
            ))}
          </div>
        </div>
        <figure className="entrance-art">
          <div className="pair">
            <RoughBox className="frame" seedKey="hero-brand" strokeWidth={1.6} inset={3} tilt={-2}><BrandArt brand={BRANDS[0]} /></RoughBox>
            <svg viewBox="0 0 80 40" className="pair-arrow" aria-hidden="true">
              <Rough shape="path" args={['M6 20 C26 8 54 8 74 20 M64 12 L74 20 L63 26 M16 14 L6 20 L17 27']} stroke="accent" strokeWidth={2} seedKey="pair" opts={{ roughness: 1.3 }} />
            </svg>
            <RoughBox className="frame" seedKey="hero-creator" strokeWidth={1.6} inset={3} tilt={2}><Portrait creator={CREATORS[0]} /></RoughBox>
          </div>
          <figcaption className="hand-note">brand ↔ creator: both sides choose</figcaption>
        </figure>
      </div>
    </Room>
  );
}
