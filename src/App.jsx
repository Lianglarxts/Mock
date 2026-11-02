import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import { DealProvider, useDeal } from './deal/DealContext.jsx';
import { NavCtx, ROOMS } from './deal/Nav.jsx';
import Entrance from './rooms/Entrance.jsx';
import Brief from './rooms/Brief.jsx';
import Match from './rooms/Match.jsx';
import Check from './rooms/Check.jsx';
import Price from './rooms/Price.jsx';
import Deal from './rooms/Deal.jsx';
import Result from './rooms/Result.jsx';
import Exit from './rooms/Exit.jsx';
import Map from './sketch/Map.jsx';

gsap.registerPlugin(ScrollTrigger);

const DESKTOP_QUERY = '(min-width: 1024px) and (min-height: 600px)';

function useMedia(query) {
  const [match, setMatch] = useState(() => window.matchMedia(query).matches);
  useEffect(() => {
    const mq = window.matchMedia(query);
    const on = () => setMatch(mq.matches);
    mq.addEventListener('change', on);
    return () => mq.removeEventListener('change', on);
  }, [query]);
  return match;
}

export default function App() {
  return (
    <DealProvider>
      <Corridor />
    </DealProvider>
  );
}

function Corridor() {
  const { prog } = useDeal();
  const desktop = useMedia(DESKTOP_QUERY);
  const reduced = useMedia('(prefers-reduced-motion: reduce)');
  const outerRef = useRef(null);
  const stickyRef = useRef(null);
  const trackRef = useRef(null);
  const lenisRef = useRef(null);
  const [roomW, setRoomW] = useState(() => document.documentElement.clientWidth);
  const [current, setCurrent] = useState(0);
  const [seen, setSeen] = useState(() => new Set([0]));

  // You can scroll through every open room plus the next locked door — no further.
  const reachable = Math.min(ROOMS.length, prog.lastOpen + 2);

  // ── Smooth scroll (off when reduced motion is on) ──
  useEffect(() => {
    if (reduced) return;
    const lenis = new Lenis({ lerp: 0.12 });
    lenisRef.current = lenis;
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (t) => lenis.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => { gsap.ticker.remove(tick); lenis.destroy(); lenisRef.current = null; };
  }, [reduced]);

  // ── Room width = visible width (excludes the scrollbar) ──
  useEffect(() => {
    const onResize = () => setRoomW(document.documentElement.clientWidth);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  // ── Desktop: vertical scroll drives the track sideways ──
  // The outer box is tall enough for the reachable rooms; a sticky inner box holds the track.
  useLayoutEffect(() => {
    if (!desktop) return;
    const ctx = gsap.context(() => {
      gsap.to(trackRef.current, {
        x: () => -(reachable - 1) * roomW,
        ease: 'none',
        scrollTrigger: {
          trigger: outerRef.current,
          start: 'top top',
          end: 'bottom bottom',
          scrub: true,
          invalidateOnRefresh: true,
        },
      });
    });
    ScrollTrigger.refresh();
    lenisRef.current?.resize();
    return () => ctx.revert();
  }, [desktop, reachable, roomW]);

  // ── Which room are we in (for the map), and how far have we got (for door swings + drawings)? ──
  const [arrived, setArrived] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      if (desktop) {
        const pos = (window.scrollY - (outerRef.current?.offsetTop || 0)) / roomW;
        setCurrent(Math.max(0, Math.min(reachable - 1, Math.round(pos))));
        setArrived(Math.floor(pos + 0.35)); // a room counts as "arrived" once ~2/3 of it is on screen
      } else {
        let idx = 0;
        let far = 0;
        document.querySelectorAll('[data-room]').forEach((el, i) => {
          const top = el.getBoundingClientRect().top;
          if (top <= window.innerHeight * 0.4) idx = i;
          if (top <= window.innerHeight * 0.75) far = i;
        });
        setCurrent(idx);
        setArrived(far);
      }
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [desktop, reachable, roomW]);

  // ── Rooms you have arrived in (door swings open, drawings draw in once). Re-locked rooms close again. ──
  useEffect(() => {
    setSeen((prev) => {
      const next = new Set([...prev].filter((i) => prog.isOpen(i)));
      for (let i = 0; i <= arrived; i++) if (prog.isOpen(i)) next.add(i);
      return next.size === prev.size && [...next].every((i) => prev.has(i)) ? prev : next;
    });
  }, [arrived, prog]);

  // ── goTo(i): wait one frame so newly unlocked rooms exist, then scroll ──
  const goTo = useCallback((i, { immediate = false } = {}) => {
    requestAnimationFrame(() => requestAnimationFrame(() => {
      let y;
      if (desktop) {
        y = (outerRef.current?.offsetTop || 0) + i * roomW;
      } else {
        const el = document.querySelector(`[data-room="${i}"]`);
        y = el ? el.getBoundingClientRect().top + window.scrollY : 0;
      }
      const lenis = lenisRef.current;
      if (lenis) {
        lenis.resize();
        lenis.scrollTo(y, immediate ? { immediate: true, force: true } : { duration: 0.6, force: true });
      } else {
        window.scrollTo(0, y);
      }
    }));
  }, [desktop, roomW]);

  // ── Keep your place when the window is resized or the layout switches desktop ↔ mobile ──
  const currentRef = useRef(0);
  const firstLayout = useRef(true);
  useLayoutEffect(() => {
    if (firstLayout.current) { firstLayout.current = false; return; }
    goTo(currentRef.current, { immediate: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomW, desktop]);
  useEffect(() => { currentRef.current = current; }, [current]);

  // ── Desktop: keyboard focus must never scroll the clipped corridor sideways by itself.
  //    Instead, tabbing into another room walks the corridor to that room. ──
  useEffect(() => {
    if (!desktop) return;
    const sticky = stickyRef.current;
    const track = trackRef.current;
    const lockScroll = () => { if (sticky.scrollLeft || sticky.scrollTop) { sticky.scrollLeft = 0; sticky.scrollTop = 0; } };
    const onFocus = (e) => {
      lockScroll();
      const room = e.target.closest('[data-room]');
      const i = room ? Number(room.dataset.room) : -1;
      if (i >= 0 && i !== currentRef.current) goTo(i);
    };
    sticky.addEventListener('scroll', lockScroll);
    track.addEventListener('focusin', onFocus);
    return () => { sticky.removeEventListener('scroll', lockScroll); track.removeEventListener('focusin', onFocus); };
  }, [desktop, goTo]);

  const nav = useMemo(() => ({ goTo, current, desktop, seen }), [goTo, current, desktop, seen]);

  const rooms = (
    <>
      <Entrance /><Brief /><Match /><Check /><Price /><Deal /><Result /><Exit />
    </>
  );

  return (
    <NavCtx.Provider value={nav}>
      {desktop ? (
        <div
          className="corridor"
          ref={outerRef}
          style={{ height: `calc(100vh + ${(reachable - 1) * roomW}px)`, '--room-w': `${roomW}px` }}
        >
          <div className="corridor-sticky" ref={stickyRef}>
            <div className="track" ref={trackRef}>{rooms}</div>
          </div>
        </div>
      ) : (
        <main className="stack">{rooms}</main>
      )}
      <Map />
    </NavCtx.Provider>
  );
}
