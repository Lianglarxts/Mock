import { useDeal } from '../deal/DealContext.jsx';
import { money } from '../deal/derive.js';
import { BUDGET, GOALS, PRODUCTS } from '../data.js';
import { Chips, Field } from '../sketch/ui.jsx';
import { NextDoor, Room } from './Room.jsx';

export default function Brief() {
  const { deal, dispatch, prog } = useDeal();
  const { brief } = deal;
  const set = (patch) => dispatch({ type: 'brief', patch });

  return (
    <Room index={1}>
      <div className="room-body brief">
        <Field label="1 · What should the post do?">
          <Chips
            label="Goal"
            options={GOALS.map((g) => ({ value: g.id, label: g.label, note: g.note }))}
            value={brief.goal}
            onChange={(goal) => set({ goal })}
          />
        </Field>

        <Field label="2 · How much can you spend?" hint="Your limit for this one post.">
          <div className="budget">
            <input
              type="range"
              min={BUDGET.min}
              max={BUDGET.max}
              step={BUDGET.step}
              value={brief.budget}
              onChange={(e) => set({ budget: Number(e.target.value) })}
              aria-label="Budget"
            />
            <output className="budget-value money">{money(brief.budget)}</output>
          </div>
        </Field>

        <Field label="3 · What kind of product is the lamp?">
          <Chips
            label="Product type"
            options={PRODUCTS.map((p) => ({ value: p.id, label: p.label }))}
            value={brief.product}
            onChange={(product) => set({ product })}
          />
        </Field>

        <NextDoor index={1} ready={prog.done[1]} label="Find creators" hint="Pick a goal and a kind of product." />
      </div>
    </Room>
  );
}
