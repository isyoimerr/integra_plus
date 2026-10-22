import { useEffect, useRef } from 'react';

export default function XPBadge({ points }) {
  const prev = useRef(points);
  const didGain = prev.current !== points && points > prev.current;

  useEffect(() => {
    prev.current = points;
  }, [points]);

  return (
    <span
      style={{
        background: '#FFF8E1',
        color: '#F57F17',
        fontWeight: 700,
        fontSize: 14,
        borderRadius: 20,
        padding: '6px 16px',
        border: '1.5px solid #FFE082',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 5,
        animation: didGain ? 'xpGainPulse 0.55s ease-out' : 'none',
      }}
    >
      +{points} XP ⚡
    </span>
  );
}

