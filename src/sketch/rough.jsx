// Hand-drawn shapes with rough.js, rendered as plain React <path>s.
// Every shape gets a fixed seed, so it looks the same on every render (no jitter).
import { useLayoutEffect, useMemo, useRef, useState } from 'react';
import rough from 'roughjs';

const gen = rough.generator();

export function seedOf(str = '') {
  let h = 7;
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) % 2147483647;
  return (h % 9999) + 1;
}

// A tilt between -1 and 1 degrees, fixed per seed.
export const tiltOf = (seed) => (((seed * 9301 + 49297) % 233280) / 233280) * 2 - 1;

const COLORS = {
  graphite: 'var(--graphite)',
  soft: 'var(--graphite-soft)',
  faint: 'var(--graphite-faint)',
  accent: 'var(--accent)',
  paper: 'var(--paper)',
  paperDark: 'var(--paper-dark)',
  paperLight: 'var(--paper-light)',
};
const col = (c) => COLORS[c] || c;

/**
 * <Rough shape="rectangle" args={[x, y, w, h]} stroke="graphite" fill="faint" seedKey="..." opts={{...}} />
 * shape: any rough.js generator method (rectangle, ellipse, circle, line, linearPath, arc, path, polygon, curve)
 */
export function Rough({ shape, args, stroke = 'graphite', fill, fillStyle = 'hachure', seedKey = '', opts = {}, className = '', strokeWidth = 1.4 }) {
  const key = JSON.stringify([shape, args, fill, fillStyle, seedKey, opts, strokeWidth]);
  const sets = useMemo(() => {
    const drawable = gen[shape](...args, {
      seed: seedOf(seedKey + shape),
      roughness: 1.1,
      bowing: 1.2,
      strokeWidth,
      stroke: 'x',
      fill: fill ? 'x' : undefined,
      fillStyle,
      hachureGap: 5,
      hachureAngle: -41,
      fillWeight: 0.9,
      ...opts,
    });
    return drawable.sets.map((s) => ({ type: s.type, d: gen.opsToPath(s) }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  return (
    <g className={`rough ${className}`}>
      {sets.map((s, i) => {
        const style =
          s.type === 'path'
            ? { stroke: col(stroke), fill: 'none', strokeWidth }
            : s.type === 'fillPath'
              ? { fill: col(fill), stroke: 'none' }
              : { stroke: col(fill), fill: 'none', strokeWidth: opts.fillWeight || 0.9 };
        return <path key={i} d={s.d} pathLength={1} className={`rp rp-${s.type}`} style={style} strokeLinecap="round" />;
      })}
    </g>
  );
}

export function useSize() {
  const ref = useRef(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const measure = () => {
      const w = Math.round(el.offsetWidth);
      const h = Math.round(el.offsetHeight);
      setSize((s) => (s.w === w && s.h === h ? s : { w, h }));
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, size];
}

/**
 * A hand-drawn frame that sits behind its children and follows their size.
 * tilt: rotate the whole box (true = seeded -1..1°, number = degrees, false = none)
 */
export function RoughBox({ as: Tag = 'div', seedKey = '', stroke = 'graphite', fill, fillStyle, strokeWidth = 1.4, tilt = false, opts, className = '', style, children, inset = 2, ...rest }) {
  const [ref, { w, h }] = useSize();
  const seed = seedOf(seedKey);
  const deg = tilt === true ? tiltOf(seed) * 0.8 : typeof tilt === 'number' ? tilt : 0;
  return (
    <Tag ref={ref} className={`rbox ${className}`} style={{ ...style, ...(deg ? { transform: `rotate(${deg.toFixed(2)}deg)` } : null) }} {...rest}>
      {w > 0 && (
        <svg className="rbox-svg" width={w} height={h} aria-hidden="true" focusable="false">
          <Rough
            shape="rectangle"
            args={[inset, inset, Math.max(1, w - inset * 2), Math.max(1, h - inset * 2)]}
            stroke={stroke}
            fill={fill}
            fillStyle={fillStyle}
            seedKey={seedKey}
            strokeWidth={strokeWidth}
            opts={{ roughness: w > 400 ? 1.3 : 1, ...opts }}
          />
        </svg>
      )}
      {children}
    </Tag>
  );
}

/** A wobbly hand-drawn underline that fills its parent's width. */
export function Scribble({ seedKey = 'u', color = 'graphite', width = 2, className = '' }) {
  const [ref, { w }] = useSize();
  return (
    <span ref={ref} className={`scribble ${className}`} aria-hidden="true">
      {w > 0 && (
        <svg width={w} height="14">
          <Rough shape="curve" args={[[[2, 8], [w * 0.3, 5], [w * 0.65, 9], [w - 2, 5]]]} stroke={color} strokeWidth={width} seedKey={seedKey} opts={{ roughness: 1.4 }} />
        </svg>
      )}
    </span>
  );
}
