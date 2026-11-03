// Six hand-drawn bars, one per alignment area. Gaps (weak areas) are drawn in the accent pencil.
import { WEAK_AREA } from '../data.js';
import { Rough } from './rough.jsx';

export default function AlignBars({ rows, seedKey, detail = false }) {
  return (
    <ul className={`align ${detail ? 'is-detail' : ''}`}>
      {rows.map((r) => {
        const gap = r.value < WEAK_AREA;
        return (
          <li key={r.id} className={`align-row ${gap ? 'is-gap' : ''}`}>
            <span className="align-label">{r.label}</span>
            <svg viewBox="0 0 100 12" preserveAspectRatio="none" className="align-bar" aria-hidden="true">
              <Rough shape="rectangle" args={[1, 1, 98, 10]} stroke="faint" strokeWidth={1} seedKey={seedKey + r.id + 'o'} opts={{ roughness: 0.7 }} />
              {r.value > 0.02 && (
                <Rough
                  shape="rectangle"
                  args={[2, 2.5, 96 * r.value, 7]}
                  stroke={gap ? 'accent' : 'graphite'}
                  fill={gap ? 'accent' : 'graphite'}
                  strokeWidth={0.6}
                  seedKey={seedKey + r.id + 'i'}
                  opts={{ hachureGap: 2.2, roughness: 0.7 }}
                />
              )}
            </svg>
            <span className="align-pts">{r.pts}<span className="align-of">/{r.points}</span></span>
            {detail && <span className="align-why">{r.why}</span>}
          </li>
        );
      })}
    </ul>
  );
}
