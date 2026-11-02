import { useDeal } from '../deal/DealContext.jsx';
import { useNav } from '../deal/Nav.jsx';
import { BRAND } from '../data.js';
import { Lamp } from '../sketch/drawings.jsx';
import { Scribble } from '../sketch/rough.jsx';
import { Btn } from '../sketch/ui.jsx';
import { Room } from './Room.jsx';

export default function Entrance() {
  const { dispatch } = useDeal();
  const { goTo } = useNav();
  return (
    <Room index={0}>
      <div className="entrance">
        <div className="entrance-text">
          <p className="hand-note">a concept demo · all data is made up</p>
          <h1 className="hero">
            One lamp. One creator. One{' '}
            <span className="underlined">fair deal.<Scribble seedKey="hero" color="accent" width={3} /></span>
          </h1>
          <p className="hero-line">Follow one deal, from first message to final result.</p>
          <p className="hero-story">
            You run <b>{BRAND.name}</b>, a small lamp brand. You want a creator to show your new {BRAND.product}.
          </p>
          <Btn onClick={() => { dispatch({ type: 'start' }); goTo(1); }} seedKey="open-first">Open the first door</Btn>
        </div>
        <figure className="entrance-art">
          <Lamp />
          <figcaption className="hand-note">the Halo desk lamp, €{BRAND.productPrice}</figcaption>
        </figure>
      </div>
    </Room>
  );
}
