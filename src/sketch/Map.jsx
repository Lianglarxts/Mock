import { useDeal } from '../deal/DealContext.jsx';
import { ROOMS, useNav } from '../deal/Nav.jsx';
import { Padlock } from './drawings.jsx';
import { Rough, RoughBox, useSize } from './rough.jsx';

// Little sketched map fixed at the bottom. Open rooms are clickable.
export default function Map() {
  const { prog } = useDeal();
  const { goTo, current } = useNav();
  const [olRef, { w }] = useSize();
  return (
    <RoughBox as="nav" className="map" aria-label="Rooms" seedKey="map" fill="paper" fillStyle="solid" strokeWidth={1.4}>
      <ol ref={olRef}>
        {w > 0 && (
          <svg className="map-path" width={w} height="20" aria-hidden="true">
            <Rough shape="line" args={[14, 10, w - 14, 10]} stroke="faint" strokeWidth={1.2} seedKey="mapline" opts={{ roughness: 1.6, bowing: 3 }} />
          </svg>
        )}
        {ROOMS.map((r, i) => {
          const open = prog.isOpen(i);
          const here = i === current;
          const done = prog.done[i];
          return (
            <li key={r.id} className={`map-stop ${open ? 'is-open' : 'is-locked'} ${here ? 'is-here' : ''} ${done ? 'is-done' : ''}`}>
              <button type="button" disabled={!open} onClick={() => goTo(i)} aria-current={here ? 'step' : undefined} aria-label={`${r.short}${open ? '' : ' (locked)'}`}>
                <span className="map-dot" aria-hidden="true">
                  {open ? (
                    <svg width="20" height="20" viewBox="0 0 20 20">
                      <Rough
                        shape="circle"
                        args={[10, 10, here ? 15 : 12]}
                        stroke={here ? 'accent' : 'graphite'}
                        fill={here ? 'accent' : done ? 'graphite' : 'paper'}
                        fillStyle={here || !done ? 'solid' : 'hachure'}
                        strokeWidth={1.4}
                        seedKey={'dot' + i}
                        opts={{ hachureGap: 2.4 }}
                      />
                    </svg>
                  ) : (
                    <Padlock size={14} color="faint" seedKey={'mlock' + i} />
                  )}
                </span>
                <span className="map-label">{r.short}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </RoughBox>
  );
}
