import { useRef } from 'react';
import { money } from '../deal/derive.js';
import { OFFER_STEP } from '../data.js';
import { Rough, useSize } from './rough.jsx';

const BODY_H = 56;

// Draggable hand-drawn ruler. value = null means "not set yet" (marker shown faded in the middle).
export default function Ruler({ range, value, onChange, budget, seedKey = 'ruler' }) {
  const trackRef = useRef(null);
  const [boxRef, { w }] = useSize();
  const span = range.max - range.min;
  const pct = (v) => ((v - range.min) / span) * 100;
  const px = (v) => (pct(v) / 100) * w;
  const clamp = (v) => Math.min(range.max, Math.max(range.min, Math.round(v / OFFER_STEP) * OFFER_STEP));
  const shown = value ?? range.mid;

  const fromPointer = (e) => {
    const r = trackRef.current.getBoundingClientRect();
    const x = Math.min(1, Math.max(0, (e.clientX - r.left) / r.width));
    onChange(clamp(range.min + x * span));
  };
  const onDown = (e) => {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);
    fromPointer(e);
  };
  const onMove = (e) => {
    if (e.currentTarget.hasPointerCapture(e.pointerId)) fromPointer(e);
  };
  const onKey = (e) => {
    const step = { ArrowRight: OFFER_STEP, ArrowUp: OFFER_STEP, ArrowLeft: -OFFER_STEP, ArrowDown: -OFFER_STEP, PageUp: 100, PageDown: -100 }[e.key];
    if (step) { e.preventDefault(); onChange(clamp(shown + step)); }
  };

  // little ticks every ~25px, taller every 4th
  const ticks = [];
  if (w) {
    const n = Math.max(8, Math.floor(w / 25));
    for (let i = 1; i < n; i++) ticks.push({ x: (i / n) * w, big: i % 4 === 0 });
  }
  const showBudget = budget >= range.min && budget <= range.max;
  const lowPct = pct(range.low);
  const highPct = pct(range.high);

  return (
    <div className="ruler">
      <div
        className="ruler-track"
        ref={(el) => { trackRef.current = el; boxRef.current = el; }}
        onPointerDown={onDown}
        onPointerMove={onMove}
        role="slider"
        tabIndex={0}
        aria-label="Your offer"
        aria-valuemin={range.min}
        aria-valuemax={range.max}
        aria-valuenow={shown}
        aria-valuetext={money(shown)}
        onKeyDown={onKey}
      >
        {w > 0 && (
          <svg className="ruler-svg" width={w} height={BODY_H + 4} aria-hidden="true">
            <Rough shape="rectangle" args={[2, 2, w - 4, BODY_H]} fill="paperLight" fillStyle="solid" strokeWidth={1.8} seedKey={seedKey + 'body'} />
            <Rough shape="rectangle" args={[px(range.low), 4, px(range.high) - px(range.low), BODY_H - 4]} stroke="accent" fill="accent" strokeWidth={1.3} seedKey={seedKey + 'fair'} opts={{ hachureGap: 7, fillWeight: 0.8 }} className="ruler-fair-mark" />
            <Rough shape="path" args={[ticks.map((t) => `M${t.x} ${BODY_H + 2} L${t.x} ${BODY_H + 2 - (t.big ? 18 : 9)}`).join(' ')]} strokeWidth={1} seedKey={seedKey + 'ticks'} opts={{ roughness: 0.5 }} />
            {showBudget && <Rough shape="line" args={[px(budget), 0, px(budget), BODY_H + 4]} stroke="soft" strokeWidth={1.4} seedKey={seedKey + 'bud'} opts={{ roughness: 1.4 }} />}
          </svg>
        )}
        <span className="ruler-fair-label hand-note" style={{ left: `${(lowPct + highPct) / 2}%` }}>fair range</span>
        <span className="ruler-edge money" style={{ left: `${lowPct}%` }}>{money(range.low)}</span>
        <span className="ruler-edge money" style={{ left: `${highPct}%` }}>{money(range.high)}</span>
        {showBudget && <span className="ruler-budget hand-note" style={{ left: `${pct(budget)}%` }}>your budget</span>}

        <div className={`ruler-handle ${value == null ? 'is-ghost' : ''}`} style={{ left: `${pct(shown)}%` }}>
          <svg width="26" height="88" viewBox="0 0 26 88" className="ruler-handle-svg" aria-hidden="true">
            <Rough shape="polygon" args={[[[2, 4], [24, 4], [13, 20]]]} stroke="accent" fill="accent" fillStyle="solid" seedKey={seedKey + 'tri'} />
            <Rough shape="line" args={[13, 18, 13, 84]} stroke="accent" strokeWidth={3} seedKey={seedKey + 'pin'} opts={{ roughness: 0.6 }} />
          </svg>
          <span className="ruler-handle-value money" style={{ transform: `translateX(-${pct(shown)}%)` }}>
            {value == null ? 'drag me' : money(value)}
          </span>
        </div>
      </div>
    </div>
  );
}
