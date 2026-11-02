import { money } from '../deal/derive.js';
import Portrait from './Portrait.jsx';
import { Rough } from './rough.jsx';

const SPOTS = ['you', 'jar', 'creator'];
const COINS = [[-16, 0], [0, 0], [16, 0], [-8, -11], [8, -11]];

// You → the jar → the creator. One pile of coins slides to whoever holds the money now.
export default function Jar({ holder, amount, creator }) {
  const spot = SPOTS.indexOf(holder);
  const first = creator.name.split(' ')[0];
  return (
    <div className="jar-row" aria-live="polite" aria-label={`Money is with: ${holder === 'creator' ? first : holder === 'jar' ? 'the jar' : 'you'}`}>
      <div className={`jar-spot ${holder === 'you' ? 'has-coins' : ''}`}>
        <svg viewBox="0 0 100 90" className="jar-art" aria-hidden="true">
          <Rough shape="rectangle" args={[12, 34, 76, 46]} fill="paperDark" fillStyle="solid" strokeWidth={1.6} seedKey="wallet" />
          <Rough shape="path" args={['M12 46 L88 46']} seedKey="wallet-flap" />
          <Rough shape="circle" args={[78, 58, 8]} seedKey="wallet-clasp" />
        </svg>
        <div className="jar-label">You</div>
      </div>
      <div className={`jar-spot ${holder === 'jar' ? 'has-coins' : ''}`}>
        <svg viewBox="0 0 100 90" className="jar-art" aria-hidden="true">
          <Rough shape="rectangle" args={[30, 4, 40, 10]} fill="soft" seedKey="lid" opts={{ hachureGap: 3 }} />
          <Rough shape="path" args={['M33 14 C22 22 20 32 20 44 L20 78 C20 86 28 88 50 88 C72 88 80 86 80 78 L80 44 C80 32 78 22 67 14 Z']} strokeWidth={1.8} seedKey="jar" />
          <Rough shape="line" args={[28, 36, 28, 62]} stroke="faint" strokeWidth={2} seedKey="shine" />
        </svg>
        <div className="jar-label">The jar</div>
      </div>
      <div className={`jar-spot ${holder === 'creator' ? 'has-coins' : ''}`}>
        <div className="jar-art jar-creator"><Portrait creator={creator} /></div>
        <div className="jar-label">{first}</div>
      </div>

      {/* the coins: one layer that slides between the three spots */}
      <div className="jar-coins" style={{ '--spot': spot }} aria-hidden="true">
        <svg viewBox="-30 -24 60 36" className="coin-pile">
          {COINS.map(([x, y], i) => (
            <Rough key={i} shape="circle" args={[x, y, 15]} stroke="accent" fill="accent" strokeWidth={1.4} seedKey={'coin' + i} opts={{ hachureGap: 2.6, roughness: 0.9 }} />
          ))}
        </svg>
        <div className="jar-amount money">{money(amount)}</div>
      </div>
    </div>
  );
}
