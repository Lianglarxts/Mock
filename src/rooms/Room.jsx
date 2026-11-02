import { useDeal } from '../deal/DealContext.jsx';
import { ROOMS, useNav } from '../deal/Nav.jsx';
import { ClosedDoor, Doorway } from '../sketch/drawings.jsx';
import { Scribble } from '../sketch/rough.jsx';
import { Btn } from '../sketch/ui.jsx';

// Frame for every room: a doorway on the left, header + content — or a locked door.
export function Room({ index, children, className = '' }) {
  const { prog } = useDeal();
  const { seen, desktop } = useNav();
  const open = prog.isOpen(index);
  const meta = ROOMS[index];
  const isSeen = seen.has(index);
  return (
    <section
      className={`room room-${meta.id} ${open ? 'is-open' : 'is-locked'} ${isSeen ? 'is-seen' : ''} ${className}`}
      data-room={index}
      aria-label={meta.title || 'Entrance'}
    >
      {desktop && index > 0 && open && <Doorway seedKey={'dw' + index} />}
      {open ? (
        <div className="room-inner">
          {meta.title && (
            <header className="room-head">
              <span className="room-num">room {index}</span>
              <h2 className="room-title">
                <span className="underlined">{meta.title}<Scribble seedKey={'t' + index} /></span>
              </h2>
              <p className="room-q">{meta.question}</p>
            </header>
          )}
          {children}
        </div>
      ) : (
        <LockedDoor index={index} small={!desktop} />
      )}
    </section>
  );
}

function LockedDoor({ index, small }) {
  const meta = ROOMS[index];
  const prev = ROOMS[index - 1];
  return (
    <div className="locked">
      <ClosedDoor seedKey={'cd' + index} small={small} />
      <div className="locked-text">
        <span className="room-num">room {index}</span>
        <p className="locked-title">{meta.title}</p>
        <p className="locked-note">Locked. Finish “{prev.title || 'the entrance'}” to open it.</p>
      </div>
    </div>
  );
}

// "Next door" button shown at the bottom of a room.
export function NextDoor({ index, ready, label = 'Next door', hint }) {
  const { goTo } = useNav();
  return (
    <div className="next-door">
      <Btn onClick={() => goTo(index + 1)} disabled={!ready} seedKey={'next' + index}>{label} →</Btn>
      {!ready && hint && <span className="next-hint">{hint}</span>}
    </div>
  );
}
