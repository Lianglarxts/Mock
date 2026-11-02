import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

const reduced = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Counts from the last shown number to the new one (0.6s). Starts only once `play` is true.
export default function CountUp({ value, format, play = true }) {
  const [shown, setShown] = useState(play && !reduced() ? 0 : value);
  const from = useRef(shown);

  useEffect(() => {
    if (!play) return;
    if (reduced()) { setShown(value); from.current = value; return; }
    const obj = { v: from.current };
    const tween = gsap.to(obj, {
      v: value,
      duration: 0.6,
      ease: 'power2.out',
      onUpdate: () => setShown(obj.v),
      onComplete: () => { from.current = value; },
    });
    return () => { from.current = obj.v; tween.kill(); };
  }, [value, play]);

  return <span>{format(shown)}</span>;
}
