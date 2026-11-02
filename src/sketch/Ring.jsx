import { Rough } from './rough.jsx';

// Pencil ring: graphite part = real followers, red-orange part = fake.
export default function Ring({ real, seedKey = 'ring' }) {
  const start = -Math.PI / 2;
  const split = start + Math.PI * 2 * real;
  return (
    <svg viewBox="0 0 120 120" className="ring" aria-hidden="true">
      <Rough shape="arc" args={[60, 60, 92, 92, start, split, false]} strokeWidth={6} seedKey={seedKey + 'r'} opts={{ roughness: 0.9 }} className="ring-real" />
      <Rough shape="arc" args={[60, 60, 92, 92, split + 0.06, start + Math.PI * 2, false]} stroke="accent" strokeWidth={6} seedKey={seedKey + 'f'} opts={{ roughness: 0.9 }} className="ring-fake" />
      <Rough shape="circle" args={[60, 60, 70]} stroke="faint" strokeWidth={1} seedKey={seedKey + 'i'} />
    </svg>
  );
}
