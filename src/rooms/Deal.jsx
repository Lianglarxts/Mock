import { useDeal } from '../deal/DealContext.jsx';
import { costs, deliverables, fairRange, firstName, money, parties } from '../deal/derive.js';
import { DEADLINES, ESCROW_STEPS, EXCLUSIVE, PAID_ADS, USAGE } from '../data.js';
import Jar from '../sketch/Jar.jsx';
import { Rough, RoughBox, Scribble } from '../sketch/rough.jsx';
import { Chips } from '../sketch/ui.jsx';
import { NextDoor, Room } from './Room.jsx';

// Chip labels show what each choice costs, so the trade-off is visible before the totals.
const pct = (n) => `+${Math.round(n * 100)}%`;
const yesNo = (fee) => [{ value: false, label: 'No' }, { value: true, label: `Yes ${pct(fee)}` }];
const DEADLINE_CHIPS = DEADLINES.map((d) => ({ value: d.days, label: d.note ? `${d.label} (${d.note})` : d.label }));
const USAGE_CHIPS = USAGE.map((u) => ({ value: u.months, label: u.fee ? `${u.label} ${pct(u.fee)}` : u.label }));

export default function Deal() {
  const { deal, dispatch, prog } = useDeal();
  const { brand, creator: c, isBrand } = parties(deal);
  if (!brand || !c || deal.offer == null) return <Room index={5} />;
  const range = fairRange(c);
  const pack = deliverables(deal.offer, range);
  const cost = costs(deal.offer, deal.terms);
  const setTerms = (patch) => dispatch({ type: 'terms', patch });
  const step = deal.escrowStep;
  const canAgree = deal.terms.deadlineDays != null;
  const holder = step >= 5 ? 'payee' : step >= 2 ? 'jar' : 'payer';
  const first = firstName(c);
  const payer = { label: isBrand ? 'You' : brand.name };
  const payee = { label: isBrand ? first : 'You', party: c };

  return (
    <Room index={5}>
      <div className="room-body deal">
        <RoughBox as="article" className="sheet" aria-label="Deal sheet" seedKey="sheet" fill="paperLight" fillStyle="solid" strokeWidth={1.6} tilt={-0.6}>
          <h3 className="sheet-title">Deal sheet</h3>
          <dl className="sheet-rows">
            <dt>Between</dt><dd>{brand.name} &amp; {c.name}</dd>
            <dt>Product</dt><dd>{brand.product}</dd>
            <dt>Price</dt><dd className="money">{money(deal.offer)}</dd>
            <dt>{isBrand ? 'Creator makes' : 'You make'}</dt><dd>{pack.items.join(', ')}</dd>
          </dl>

          <div className="sheet-terms">
            <div className="term"><span className="term-label">Deadline</span>
              <Chips label="Deadline" options={DEADLINE_CHIPS} value={deal.terms.deadlineDays} onChange={(deadlineDays) => setTerms({ deadlineDays })} />
            </div>
            <div className="term"><span className="term-label">{isBrand ? 'You can' : brand.name + ' can'} reuse the post for</span>
              <Chips label="Usage" options={USAGE_CHIPS} value={deal.terms.usageMonths} onChange={(usageMonths) => setTerms({ usageMonths })} />
            </div>
            <div className="term"><span className="term-label">Run it as a paid ad?</span>
              <Chips label="Paid ads" options={yesNo(PAID_ADS.fee)} value={deal.terms.paidAds} onChange={(paidAds) => setTerms({ paidAds })} />
            </div>
            <div className="term"><span className="term-label">No other {brand.kind} brands for 3 months?</span>
              <Chips label="Exclusive" options={yesNo(EXCLUSIVE.fee)} value={deal.terms.exclusive} onChange={(exclusive) => setTerms({ exclusive })} />
            </div>
          </div>

          <dl className="sheet-rows sheet-costs">
            <dt>Creator fee</dt><dd className="money">{money(cost.offer)}</dd>
            <dt>Extra rights</dt><dd className="money">{money(cost.rights)}</dd>
            <dt>Our fee (10%, paid by the brand)</dt><dd className="money">{money(cost.fee)}</dd>
            {isBrand ? (
              <>
                <dt className="total">Total</dt>
                <dd className="total money"><span className="underlined">{money(cost.total)}<Scribble seedKey="total" color="accent" /></span></dd>
              </>
            ) : (
              <>
                <dt>{brand.name} pays</dt><dd className="money">{money(cost.total)}</dd>
                <dt className="total">You get</dt>
                <dd className="total money"><span className="underlined">{money(cost.creatorGets)}<Scribble seedKey="total" color="accent" /></span></dd>
              </>
            )}
          </dl>
        </RoughBox>

        <div className="escrow">
          <p className="escrow-line">
            {isBrand ? 'We hold the money until the work is delivered.' : `${brand.name} pays into the jar first, so you know the money is there.`}
          </p>
          <Jar holder={holder} amount={cost.creatorGets} payer={payer} payee={payee} />
          <ol className="steps">
            {ESCROW_STEPS.map((label, i) => {
              const state = i < step ? 'done' : i === step ? 'next' : 'later';
              const disabled = state !== 'next' || (i === 0 && !canAgree);
              return (
                <li key={label} className={`step step-${state}`}>
                  <button type="button" disabled={disabled} onClick={() => dispatch({ type: 'escrowNext' })}>
                    <svg className="step-dot" viewBox="0 0 30 30" aria-hidden="true">
                      <Rough
                        shape="circle"
                        args={[15, 15, 24]}
                        stroke={state === 'next' && !disabled ? 'accent' : state === 'later' || disabled ? 'faint' : 'graphite'}
                        fill={state === 'done' ? 'graphite' : undefined}
                        strokeWidth={state === 'next' ? 2 : 1.4}
                        seedKey={'st' + i}
                        opts={{ hachureGap: 2.6 }}
                      />
                    </svg>
                    <span className="step-label">{label}</span>
                    {state === 'next' && !disabled && <span className="step-cta hand-note">← click</span>}
                  </button>
                </li>
              );
            })}
          </ol>
          <div className="escrow-msg" aria-live="polite">
            {step === 0 && !canAgree && <p className="hand-note">Pick a deadline first, then click “Brief agreed”.</p>}
            {step === 5 && <p className="ok">✓ Done. {isBrand ? `${first} got paid, and you got the post.` : `You got paid, and ${brand.name} got the post.`}</p>}
          </div>
          <NextDoor index={5} ready={prog.done[5]} label="See the result" hint="Finish all 5 steps." />
        </div>
      </div>
    </Room>
  );
}
