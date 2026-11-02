import { useDeal } from '../deal/DealContext.jsx';
import { deliverables, fairRange, getCreator, money, num, priceZone } from '../deal/derive.js';
import Ruler from '../sketch/Ruler.jsx';
import { NextDoor, Room } from './Room.jsx';

export default function Price() {
  const { deal, dispatch, prog } = useDeal();
  const c = getCreator(deal.creatorId);
  if (!c) return <Room index={4} />;
  const range = fairRange(c);
  const zone = priceZone(deal.offer, range);
  const first = c.name.split(' ')[0];
  const pack = deal.offer != null ? deliverables(deal.offer, range) : null;

  return (
    <Room index={4}>
      <div className="room-body price">
        <p className="lead">
          For {first} ({c.nicheLabel.toLowerCase()}, {num(c.followers / 1000)}k followers), a fair price is{' '}
          <b className="money">{money(range.low)}–{money(range.high)}</b>. Drag the marker to make your offer.
        </p>

        <Ruler range={range} value={deal.offer} budget={deal.brief.budget} onChange={(value) => dispatch({ type: 'offer', value })} />

        <div className="price-notes" aria-live="polite">
          {zone === null && <p className="hand-note">Drag the marker along the ruler.</p>}
          {zone === 'low' && <p className="warn">⚠ Too low. {first} may say no, or do the bare minimum.</p>}
          {zone === 'high' && <p className="warn">⚠ Too high. You would pay {money(deal.offer - range.high)} more than fair.</p>}
          {zone === 'fair' && <p className="ok">✓ Fair. {first} is likely to say yes.</p>}
          {deal.offer != null && deal.offer > deal.brief.budget && (
            <p className="warn">⚠ This is {money(deal.offer - deal.brief.budget)} over your budget.</p>
          )}
        </div>

        {pack && (
          <div className="ask">
            <div className="field-label">At {money(deal.offer)}, ask for:</div>
            <ul className="ask-list">
              {pack.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
            <p className="hand-note">{pack.note}</p>
          </div>
        )}

        <NextDoor index={4} ready={prog.done[4]} label="Write the deal" hint="Make an offer first." />
      </div>
    </Room>
  );
}
