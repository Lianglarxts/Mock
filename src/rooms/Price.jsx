import { useDeal } from '../deal/DealContext.jsx';
import { deliverables, fairRange, firstName, money, num, parties, priceZone } from '../deal/derive.js';
import Ruler from '../sketch/Ruler.jsx';
import { NextDoor, Room } from './Room.jsx';

export default function Price() {
  const { deal, dispatch, prog } = useDeal();
  const { brand, creator, isBrand } = parties(deal);
  if (!brand || !creator) return <Room index={4} />;
  const range = fairRange(creator);
  const zone = priceZone(deal.offer, range);
  const first = firstName(creator);
  const pack = deal.offer != null ? deliverables(deal.offer, range) : null;
  const budget = isBrand ? deal.brief.budget : brand.budget;
  const overBudget = deal.offer != null && deal.offer > budget;

  return (
    <Room index={4}>
      <div className="room-body price">
        {isBrand ? (
          <p className="lead">
            For {first} ({creator.nicheLabel.toLowerCase()}, {num(creator.followers / 1000)}k followers), a fair price is{' '}
            <b className="money">{money(range.low)}–{money(range.high)}</b>. Drag the marker to make your offer.
          </p>
        ) : (
          <p className="lead">
            For an account like yours ({creator.nicheLabel.toLowerCase()}, {num(creator.followers / 1000)}k followers), a fair rate is{' '}
            <b className="money">{money(range.low)}–{money(range.high)}</b>. {brand.name} has about <b className="money">{money(budget)}</b> for this post. Drag the marker to set your price.
          </p>
        )}

        <Ruler
          range={range}
          value={deal.offer}
          budget={budget}
          budgetLabel={isBrand ? 'your budget' : `${brand.name}'s budget`}
          ariaLabel={isBrand ? 'Your offer' : 'Your price'}
          onChange={(value) => dispatch({ type: 'offer', value })}
        />

        <div className="price-notes" aria-live="polite">
          {zone === null && <p className="hand-note">Drag the marker along the ruler.</p>}
          {isBrand ? (
            <>
              {zone === 'low' && <p className="warn">⚠ Too low. {first} may say no, or do the bare minimum.</p>}
              {zone === 'high' && <p className="warn">⚠ Too high. You would pay {money(deal.offer - range.high)} more than fair.</p>}
              {zone === 'fair' && <p className="ok">✓ Fair. {first} is likely to say yes.</p>}
              {overBudget && <p className="warn">⚠ This is {money(deal.offer - budget)} over your budget.</p>}
            </>
          ) : (
            <>
              {zone === 'low' && <p className="warn">⚠ Too low. You'd be underselling yourself, and brands will expect it next time.</p>}
              {zone === 'high' && <p className="warn">⚠ Above fair. {brand.name} may push back or expect more for it.</p>}
              {zone === 'fair' && <p className="ok">✓ Fair. {brand.name} is likely to say yes.</p>}
              {overBudget && <p className="warn">⚠ This is {money(deal.offer - budget)} over {brand.name}'s budget.</p>}
              {deal.offer != null && deal.offer < deal.brief.minFee && <p className="warn">⚠ This is under your own minimum of {money(deal.brief.minFee)}.</p>}
            </>
          )}
        </div>

        {pack && (
          <div className="ask">
            <div className="field-label">At {money(deal.offer)}, {isBrand ? 'ask for' : 'you make'}:</div>
            <ul className="ask-list">
              {pack.items.map((i) => <li key={i}>{i}</li>)}
            </ul>
            <p className="hand-note">{pack.note}</p>
          </div>
        )}

        <NextDoor index={4} ready={prog.done[4]} label="Write the deal" hint={isBrand ? 'Make an offer first.' : 'Set your price first.'} />
      </div>
    </Room>
  );
}
