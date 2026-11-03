import { useDeal } from '../deal/DealContext.jsx';
import { fairRange, getBrand, getCreator, money, num, regionList, topRegions } from '../deal/derive.js';
import { BRANDS, BUDGET, CREATORS, FREEDOM, GOALS, PARTNERSHIP } from '../data.js';
import { Avatar } from '../sketch/BrandArt.jsx';
import { RoughBox } from '../sketch/rough.jsx';
import { Chips, Field } from '../sketch/ui.jsx';
import { NextDoor, Room } from './Room.jsx';

// What the other side will see about you: the facts the match is scored on.
function Profile({ party, lines }) {
  return (
    <RoughBox className="profile" seedKey={'prof' + party.id} stroke="soft" strokeWidth={1.2} tilt>
      <RoughBox className="frame small" seedKey={'pf' + party.id} inset={2}><Avatar party={party} /></RoughBox>
      <dl className="profile-rows">
        {lines.map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}
      </dl>
    </RoughBox>
  );
}

function Slider({ label, value, onChange }) {
  return (
    <div className="budget">
      <input type="range" min={BUDGET.min} max={BUDGET.max} step={BUDGET.step} value={value} onChange={(e) => onChange(Number(e.target.value))} aria-label={label} />
      <output className="budget-value money">{money(value)}</output>
    </div>
  );
}

function BrandBrief() {
  const { deal, dispatch, prog } = useDeal();
  const { brief } = deal;
  const b = getBrand(deal.brandId);
  const set = (patch) => dispatch({ type: 'brief', patch });
  return (
    <div className="room-body brief">
      <Field label="1 · Which brand are you?">
        <Chips label="Brand" options={BRANDS.map((x) => ({ value: x.id, label: x.name, note: x.product }))} value={deal.brandId} onChange={(id) => dispatch({ type: 'pickBrand', id })} />
      </Field>
      {b && (
        <Profile
          party={b}
          lines={[
            ['About', b.about],
            ['Sells to', `${b.ages[0]}–${b.ages[1]} year olds in ${regionList(b.regions)}`],
            ['Stands for', b.values.join(', ')],
            ['Offers', `${b.offers.freedom >= 0.75 ? 'lots of' : 'some'} creative freedom · ${b.offers.longTerm ? 'long-term' : 'one-off'} deals`],
          ]}
        />
      )}
      <div className="brief-pair">
        <Field label="2 · What should the post do?">
          <Chips label="Goal" options={GOALS.map((g) => ({ value: g.id, label: g.label, note: g.note }))} value={brief.goal} onChange={(goal) => set({ goal })} />
        </Field>
        <Field label="3 · How much can you spend?" hint="Your limit for this one post.">
          <Slider label="Budget" value={brief.budget} onChange={(budget) => set({ budget })} />
        </Field>
      </div>
      <NextDoor index={1} ready={prog.done[1]} label="Find creators" hint="Pick your brand and a goal." />
    </div>
  );
}

function CreatorBrief() {
  const { deal, dispatch, prog } = useDeal();
  const { brief } = deal;
  const c = getCreator(deal.creatorId);
  const set = (patch) => dispatch({ type: 'brief', patch });
  const fair = c && fairRange(c);
  return (
    <div className="room-body brief">
      <Field label="1 · Which creator are you?">
        <Chips label="Creator" options={CREATORS.map((x) => ({ value: x.id, label: x.name, note: x.nicheLabel }))} value={deal.creatorId} onChange={(id) => dispatch({ type: 'pickMe', id })} />
      </Field>
      {c && (
        <Profile
          party={c}
          lines={[
            ['Account', `${c.handle} · ${num(c.followers / 1000)}k followers · ${(c.engagement * 100).toFixed(1)}% engagement`],
            ['Followers', `${c.ages[0]}–${c.ages[1]} year olds, mostly ${topRegions(c.regions)}`],
            ['Stands for', c.values.join(', ')],
            ['Fair rate', `${money(fair.low)}–${money(fair.high)} per post`],
          ]}
        />
      )}
      {c && (
        <div className="brief-trio">
          <Field label="2 · Your minimum fee" hint="Brands with smaller budgets score lower.">
            <Slider label="Minimum fee" value={brief.minFee} onChange={(minFee) => set({ minFee })} />
          </Field>
          <Field label="3 · What kind of deal?">
            <Chips label="Partnership" options={PARTNERSHIP} value={brief.longTerm} onChange={(longTerm) => set({ longTerm })} />
          </Field>
          <Field label="4 · Creative freedom you need">
            <Chips label="Creative freedom" options={FREEDOM} value={brief.freedom} onChange={(freedom) => set({ freedom })} />
          </Field>
        </div>
      )}
      <NextDoor index={1} ready={prog.done[1]} label="Find brands" hint={c ? 'Pick a kind of deal and how much freedom you need.' : 'Pick who you are.'} />
    </div>
  );
}

export default function Brief() {
  const { deal } = useDeal();
  return <Room index={1}>{deal.side === 'creator' ? <CreatorBrief /> : <BrandBrief />}</Room>;
}
