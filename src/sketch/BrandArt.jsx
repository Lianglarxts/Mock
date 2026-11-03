// Pencil sketch of a brand's product, in the same 120×140 frame as the creator portraits.
// These are generic product drawings, not logos.
import Portrait from './Portrait.jsx';
import { Rough } from './rough.jsx';

function Phone({ k, children }) {
  return (
    <>
      <Rough shape="ellipse" args={[60, 132, 70, 10]} stroke="faint" fill="faint" seedKey={k + 'sh'} opts={{ hachureGap: 5 }} />
      <Rough shape="rectangle" args={[32, 10, 56, 116]} fill="paperLight" fillStyle="solid" strokeWidth={1.8} seedKey={k + 'body'} opts={{ roughness: 0.8 }} />
      {children}
    </>
  );
}

const ART = {
  // See-through back with light strips.
  glyph: (k) => (
    <Phone k={k}>
      <Rough shape="circle" args={[46, 26, 12]} fill="graphite" fillStyle="solid" seedKey={k + 'cam1'} />
      <Rough shape="circle" args={[62, 26, 12]} fill="graphite" fillStyle="solid" seedKey={k + 'cam2'} />
      <Rough shape="arc" args={[54, 30, 40, 40, Math.PI * 0.9, Math.PI * 2.1, false]} stroke="accent" strokeWidth={2.4} seedKey={k + 'g1'} opts={{ roughness: 0.7 }} />
      <Rough shape="line" args={[74, 62, 74, 92]} stroke="accent" strokeWidth={2.4} seedKey={k + 'g2'} opts={{ roughness: 0.7 }} />
      <Rough shape="line" args={[52, 108, 68, 108]} stroke="accent" strokeWidth={2.4} seedKey={k + 'g3'} opts={{ roughness: 0.7 }} />
      <Rough shape="rectangle" args={[40, 54, 24, 40]} stroke="faint" fill="faint" strokeWidth={1} seedKey={k + 'in'} opts={{ hachureGap: 4 }} />
    </Phone>
  ),
  // Modular back: screws and swappable parts.
  modular: (k) => (
    <Phone k={k}>
      <Rough shape="rectangle" args={[40, 18, 22, 22]} fill="soft" seedKey={k + 'cam'} opts={{ hachureGap: 3 }} />
      <Rough shape="rectangle" args={[40, 50, 40, 46]} stroke="soft" fill="faint" strokeWidth={1.2} seedKey={k + 'bat'} opts={{ hachureGap: 6 }} />
      {[[38, 16], [82, 16], [38, 120], [82, 120], [60, 104]].map(([x, y], i) => (
        <g key={i}>
          <Rough shape="circle" args={[x, y, 7]} stroke="accent" strokeWidth={1.4} seedKey={k + 's' + i} />
          <Rough shape="line" args={[x - 2, y - 2, x + 2, y + 2]} stroke="accent" strokeWidth={1.2} seedKey={k + 'sl' + i} />
        </g>
      ))}
    </Phone>
  ),
  // Small mushroom-shaped portable lamp.
  portable: (k) => (
    <>
      <Rough shape="ellipse" args={[60, 128, 90, 12]} stroke="faint" fill="faint" seedKey={k + 'pool'} opts={{ hachureGap: 5 }} />
      {[[40, 88, 30, 112], [60, 92, 60, 118], [80, 88, 90, 112]].map((l, i) => (
        <Rough key={i} shape="line" args={l} stroke="accent" strokeWidth={1.4} seedKey={k + 'r' + i} opts={{ roughness: 1.6 }} />
      ))}
      <Rough shape="path" args={['M20 70 C22 34 98 34 100 70 Z']} fill="soft" strokeWidth={1.8} seedKey={k + 'dome'} opts={{ hachureGap: 3.5 }} />
      <Rough shape="rectangle" args={[54, 70, 12, 48]} fill="paperLight" fillStyle="solid" strokeWidth={1.6} seedKey={k + 'stem'} />
      <Rough shape="ellipse" args={[60, 120, 44, 10]} fill="soft" strokeWidth={1.6} seedKey={k + 'base'} opts={{ hachureGap: 3 }} />
    </>
  ),
  // Angled desk lamp.
  desk: (k) => (
    <>
      <Rough shape="ellipse" args={[82, 128, 60, 10]} stroke="faint" fill="faint" seedKey={k + 'pool'} opts={{ hachureGap: 5 }} />
      {[[74, 84, 68, 112], [86, 80, 92, 110]].map((l, i) => (
        <Rough key={i} shape="line" args={l} stroke="accent" strokeWidth={1.4} seedKey={k + 'r' + i} opts={{ roughness: 1.6 }} />
      ))}
      <Rough shape="ellipse" args={[34, 126, 46, 10]} fill="soft" strokeWidth={1.6} seedKey={k + 'base'} opts={{ hachureGap: 3 }} />
      <Rough shape="linearPath" args={[[[34, 122], [46, 66], [80, 44]]]} strokeWidth={2.2} seedKey={k + 'arm'} />
      <Rough shape="circle" args={[46, 66, 8]} fill="graphite" fillStyle="solid" seedKey={k + 'joint'} />
      <Rough shape="polygon" args={[[[70, 36], [102, 50], [96, 70], [64, 54]]]} fill="faint" strokeWidth={1.7} seedKey={k + 'shade'} opts={{ hachureGap: 4 }} />
      <Rough shape="line" args={[74, 64, 94, 66]} stroke="accent" strokeWidth={2} seedKey={k + 'bulb'} />
    </>
  ),
};

export default function BrandArt({ brand }) {
  return (
    <svg viewBox="0 0 120 140" className="portrait brand-art" role="img" aria-label={`Pencil sketch of the ${brand.product}`}>
      {ART[brand.art](brand.id)}
    </svg>
  );
}

// A brand or a creator, drawn in the same frame.
export function Avatar({ party }) {
  return 'handle' in party ? <Portrait creator={party} /> : <BrandArt brand={party} />;
}
