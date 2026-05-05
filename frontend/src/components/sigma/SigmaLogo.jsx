import { SIGMA_STATES } from '../../data/levelConfig';

export default function SigmaLogo({ state = 'neutral', size = 40 }) {
  const s = SIGMA_STATES[state] || SIGMA_STATES.neutral;
  return (
    <svg width={size} height={size} viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      style={{ flexShrink: 0, transition: 'all 0.4s ease' }}>
      <rect width="100" height="100" rx="22" fill={s.bg} />
      <line x1="22" y1="18" x2="78" y2="18" stroke="white" strokeWidth="7" strokeLinecap="round" />
      <line x1="22" y1="82" x2="78" y2="82" stroke="white" strokeWidth="7" strokeLinecap="round" />
      <line x1="25" y1="21" x2="50" y2="50" stroke="white" strokeWidth="7" strokeLinecap="round" />
      <line x1="50" y1="50" x2="25" y2="79" stroke="white" strokeWidth="7" strokeLinecap="round" />
      {s.brows && s.brows.map((d, i) =>
        <path key={i} d={d} fill="none" stroke="white" strokeWidth="3.5" strokeLinecap="round" />
      )}
      {s.eyes
        ? s.eyes.map((e, i) => <circle key={i} cx={e.cx} cy={e.cy} r={e.r} fill="white" />)
        : s.eyeLines && s.eyeLines.map((d, i) =>
            <path key={i} d={d} stroke="white" strokeWidth="4" strokeLinecap="round" fill="none" />
          )
      }
      <path d={s.mouthD} fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" />
    </svg>
  );
}
