// Pencil drawings used around the corridor. All shapes come from rough.js with fixed seeds.
import { Rough, useSize } from './rough.jsx';

export function Padlock({ size = 44, color = 'accent', seedKey = 'lock' }) {
  return (
    <svg className="padlock" width={size} height={size * 1.15} viewBox="0 0 40 46" aria-hidden="true">
      <Rough shape="path" args={['M11 21 V13 C11 3 29 3 29 13 V21']} stroke="graphite" strokeWidth={2.2} seedKey={seedKey + 's'} opts={{ roughness: 0.8 }} />
      <Rough shape="rectangle" args={[5, 20, 30, 22]} stroke="graphite" fill={color} strokeWidth={1.8} seedKey={seedKey} opts={{ hachureGap: 2.6, fillWeight: 1.1, roughness: 0.9 }} />
      <Rough shape="line" args={[20, 28, 20, 35]} stroke="paper" strokeWidth={2.4} seedKey={seedKey + 'k'} opts={{ roughness: 0.4 }} />
    </svg>
  );
}

// Big closed door with a padlock — shown in locked rooms.
export function ClosedDoor({ seedKey = 'door', small = false }) {
  return (
    <div className={`closed-door ${small ? 'is-small' : ''}`} aria-hidden="true">
      <svg viewBox="0 0 200 300" className="closed-door-svg">
        <Rough shape="rectangle" args={[8, 8, 184, 292]} strokeWidth={2} seedKey={seedKey + 'f'} />
        <Rough shape="rectangle" args={[22, 22, 156, 278]} fill="paperDark" fillStyle="solid" strokeWidth={1.6} seedKey={seedKey + 'l'} />
        <Rough shape="rectangle" args={[40, 44, 120, 90]} stroke="soft" strokeWidth={1.1} seedKey={seedKey + 'p1'} />
        <Rough shape="rectangle" args={[40, 160, 120, 118]} stroke="soft" strokeWidth={1.1} fill="faint" seedKey={seedKey + 'p2'} opts={{ hachureGap: 9 }} />
        <Rough shape="circle" args={[160, 152, 10]} strokeWidth={1.6} seedKey={seedKey + 'k'} />
        <Rough shape="line" args={[0, 300, 200, 300]} strokeWidth={1.4} seedKey={seedKey + 'g'} />
      </svg>
      <div className="closed-door-lock"><Padlock seedKey={seedKey + 'pl'} size={small ? 30 : 44} /></div>
    </div>
  );
}

// The doorway at the left edge of each open room. The leaf swings open once you arrive.
export function Doorway({ seedKey }) {
  return (
    <div className="doorway" aria-hidden="true">
      <svg className="doorway-wall" viewBox="0 0 10 1000" preserveAspectRatio="none">
        <Rough shape="line" args={[5, 0, 5, 1000]} stroke="faint" strokeWidth={1.3} seedKey={seedKey + 'w'} opts={{ roughness: 0.6 }} />
      </svg>
      <div className="doorway-frame">
        <svg viewBox="0 0 100 210" className="doorway-frame-svg">
          <Rough shape="rectangle" args={[3, 3, 94, 207]} fill="paper" fillStyle="solid" strokeWidth={1.8} seedKey={seedKey + 'fr'} />
          <Rough shape="line" args={[0, 210, 100, 210]} strokeWidth={1.4} seedKey={seedKey + 'fl'} />
        </svg>
        <div className="door-leaf">
          <svg viewBox="0 0 90 200" className="door-leaf-svg">
            <Rough shape="rectangle" args={[2, 2, 86, 196]} fill="paperDark" fillStyle="solid" strokeWidth={1.5} seedKey={seedKey + 'lf'} />
            <Rough shape="rectangle" args={[14, 16, 62, 70]} stroke="soft" strokeWidth={1} seedKey={seedKey + 'lp'} />
            <Rough shape="rectangle" args={[14, 100, 62, 84]} stroke="soft" fill="faint" strokeWidth={1} seedKey={seedKey + 'lq'} opts={{ hachureGap: 7 }} />
            <Rough shape="circle" args={[76, 104, 7]} strokeWidth={1.4} seedKey={seedKey + 'lk'} />
          </svg>
        </div>
      </div>
    </div>
  );
}

// A quick pencil tick.
export function Tick({ color = 'accent', size = 28, seedKey = 'tick' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 30 30" aria-hidden="true" className="tick">
      <Rough shape="linearPath" args={[[[4, 16], [12, 25], [27, 4]]]} stroke={color} strokeWidth={2.6} seedKey={seedKey} opts={{ roughness: 1.3 }} />
    </svg>
  );
}

// Hand-drawn ellipse around its children (for key marks like the verdict).
export function Encircle({ children, color = 'accent', seedKey = 'enc', className = '' }) {
  const [ref, { w, h }] = useSize();
  return (
    <span ref={ref} className={`encircle ${className}`}>
      {w > 0 && (
        <svg className="encircle-svg" width={w + 84} height={h + 36} aria-hidden="true">
          <Rough shape="ellipse" args={[(w + 84) / 2, (h + 36) / 2, w + 74, h + 26]} stroke={color} strokeWidth={2} seedKey={seedKey} opts={{ roughness: 1.6, bowing: 2 }} />
        </svg>
      )}
      {children}
    </span>
  );
}
