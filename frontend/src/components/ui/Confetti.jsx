import { useMemo } from 'react';

const COLORS = ['#2E7D32','#7E57C2','#F57F17','#1565C0','#43A047','#FFB300','#E91E63','#00B4D8'];

export default function Confetti() {
  const pieces = useMemo(() => Array.from({ length: 55 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    color: COLORS[i % 8],
    delay: Math.random() * 1.5,
    duration: 2.2 + Math.random() * 1.8,
    size: 7 + Math.random() * 9,
    radius: i % 3 === 0 ? '50%' : i % 3 === 1 ? '3px' : '1px',
    rotate: Math.random() * 360,
    heightFactor: 0.5 + Math.random() * 0.8,
  })), []);

  return (
    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 5 }}>
      {pieces.map(p => (
        <div key={p.id} style={{
          position: 'absolute', left: `${p.x}%`, top: 0,
          width: p.size, height: p.size * p.heightFactor,
          background: p.color, borderRadius: p.radius,
          animationName: 'confettiFall',
          animationDuration: `${p.duration}s`,
          animationDelay: `${p.delay}s`,
          animationTimingFunction: 'cubic-bezier(0.25,0.46,0.45,0.94)',
          animationFillMode: 'both',
          transform: `rotate(${p.rotate}deg)`,
        }} />
      ))}
    </div>
  );
}
