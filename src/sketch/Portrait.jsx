// Pencil-style creator portrait, drawn with rough.js. No photos.
import { Rough } from './rough.jsx';

const CURLS = Array.from({ length: 9 }, (_, i) => {
  const a = Math.PI * (1.05 + (i / 8) * 0.9);
  return [60 + Math.cos(a) * 27, 54 + Math.sin(a) * 25];
});

export default function Portrait({ creator }) {
  const { hair, glasses } = creator.portrait;
  const k = creator.id;
  const fine = { roughness: 0.6 };
  return (
    <svg viewBox="0 0 120 140" className="portrait" role="img" aria-label={`Pencil drawing of ${creator.name}`}>
      {/* shoulders, shaded */}
      <Rough shape="path" args={['M16 140 C20 114 40 104 60 104 C80 104 100 114 104 140 Z']} fill="faint" seedKey={k + 'body'} opts={{ hachureGap: 4.5 }} />
      <Rough shape="path" args={['M52 92 L52 106 M68 92 L68 106']} seedKey={k + 'neck'} opts={fine} />
      {/* long hair falls behind the head, so it's drawn first */}
      {hair === 'long' && (
        <Rough shape="path" args={['M33 62 C29 34 45 25 60 25 C77 25 92 34 87 62 L92 104 C80 104 76 92 78 70 L42 70 C44 92 40 104 28 104 Z']} fill="soft" seedKey={k + 'back'} opts={{ hachureGap: 3, hachureAngle: 80 }} />
      )}
      {/* head */}
      <Rough shape="ellipse" args={[60, 62, 50, 60]} fill="paper" fillStyle="solid" strokeWidth={1.6} seedKey={k + 'head'} />

      {hair === 'curly' &&
        CURLS.map(([x, y], i) => (
          <Rough key={i} shape="circle" args={[x, y, 17]} fill="soft" seedKey={k + 'c' + i} strokeWidth={1.1} opts={{ hachureGap: 3, roughness: 1.3 }} />
        ))}
      {hair === 'bun' && (
        <>
          <Rough shape="circle" args={[60, 26, 20]} fill="soft" seedKey={k + 'bun'} opts={{ hachureGap: 3 }} />
          <Rough shape="path" args={['M35 58 C34 38 46 31 60 31 C74 31 86 38 85 58 C80 46 70 42 60 42 C48 42 40 47 35 58 Z']} fill="soft" seedKey={k + 'hair'} opts={{ hachureGap: 3 }} />
        </>
      )}
      {hair === 'short' && (
        <Rough shape="path" args={['M35 56 C33 36 46 30 62 30 C77 30 88 38 85 55 C80 44 66 41 51 45 C43 47 38 51 35 56 Z']} fill="soft" seedKey={k + 'hair'} opts={{ hachureGap: 2.8, hachureAngle: 60 }} />
      )}

      {hair === 'long' && (
        <Rough shape="path" args={['M35 58 C34 37 47 30 60 30 C74 30 86 37 85 58 C78 50 70 40 58 40 C50 46 42 50 35 58 Z']} fill="soft" seedKey={k + 'fringe'} opts={{ hachureGap: 3, hachureAngle: 70 }} />
      )}
      {glasses && (
        <>
          <Rough shape="rectangle" args={[40, 59, 15, 10]} seedKey={k + 'g1'} strokeWidth={1.3} opts={fine} />
          <Rough shape="rectangle" args={[65, 59, 15, 10]} seedKey={k + 'g2'} strokeWidth={1.3} opts={fine} />
          <Rough shape="line" args={[55, 63, 65, 63]} seedKey={k + 'g3'} opts={fine} />
        </>
      )}
      {/* face */}
      <Rough shape="path" args={['M46 64 h4 M70 64 h4']} strokeWidth={2} seedKey={k + 'eyes'} opts={{ roughness: 0.3 }} />
      <Rough shape="path" args={['M60 68 L57 78 L62 78']} strokeWidth={1.1} seedKey={k + 'nose'} opts={fine} />
      <Rough shape="path" args={['M51 85 C55 89 65 89 69 85']} strokeWidth={1.3} seedKey={k + 'mouth'} opts={fine} />
    </svg>
  );
}
