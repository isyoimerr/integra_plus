export default function LevelGraph({ levelId }) {
  if (levelId === 0) return (
    <svg viewBox="0 0 240 120" style={{ width: '100%', height: 100, display: 'block' }}>
      <line x1="20" y1="100" x2="220" y2="100" stroke="#CCCCCC" strokeWidth="1.5" />
      <line x1="20" y1="10"  x2="20"  y2="100" stroke="#CCCCCC" strokeWidth="1.5" />
      <polyline points="20,98 60,92 100,74 140,44 180,4" fill="none" stroke="#2E7D32" strokeWidth="2.5" strokeLinecap="round" />
      <polyline points="20,80 60,68 100,56 140,44 180,32" fill="none" stroke="#43A047" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,3" />
      <text x="185" y="8"  fontSize="10" fill="#2E7D32" fontStyle="italic">f(x)=x²</text>
      <text x="185" y="35" fontSize="10" fill="#43A047" fontStyle="italic">f'=2x</text>
      <text x="22"  y="110" fontSize="9" fill="#999">0</text>
      <text x="100" y="110" fontSize="9" fill="#999">1</text>
      <text x="180" y="110" fontSize="9" fill="#999">2</text>
    </svg>
  );
  if (levelId === 1) return (
    <svg viewBox="0 0 240 120" style={{ width: '100%', height: 100, display: 'block' }}>
      <line x1="20" y1="100" x2="220" y2="100" stroke="#CCCCCC" strokeWidth="1.5" />
      <line x1="20" y1="10"  x2="20"  y2="100" stroke="#CCCCCC" strokeWidth="1.5" />
      <polyline points="20,98 60,93 100,78 140,50 180,10" fill="none" stroke="#1565C0" strokeWidth="2.5" strokeLinecap="round" />
      <polyline points="20,96 60,88 100,70 140,38 180,2" fill="none" stroke="#64B5F6" strokeWidth="2" strokeLinecap="round" strokeDasharray="5,3" />
      <text x="55" y="95" fontSize="9" fill="#64B5F6" fontStyle="italic">f(x)=x²</text>
      <text x="80" y="50" fontSize="10" fill="#1565C0" fontWeight="700">∫ f = F</text>
      <text x="22"  y="110" fontSize="9" fill="#999">0</text>
      <text x="180" y="110" fontSize="9" fill="#999">2</text>
    </svg>
  );
  return (
    <svg viewBox="0 0 240 120" style={{ width: '100%', height: 100, display: 'block' }}>
      <defs>
        <linearGradient id="lvl2g" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0%" stopColor="#7E57C2" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#7E57C2" stopOpacity="0.05" />
        </linearGradient>
      </defs>
      <line x1="20" y1="100" x2="220" y2="100" stroke="#CCCCCC" strokeWidth="1.5" />
      <line x1="20" y1="10"  x2="20"  y2="100" stroke="#CCCCCC" strokeWidth="1.5" />
      <polygon points="60,100 60,84 100,70 140,44 180,100" fill="url(#lvl2g)" />
      <polyline points="20,100 60,84 100,70 140,44 180,18" fill="none" stroke="#7E57C2" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="60"  y1="84"  x2="60"  y2="100" stroke="#7E57C2" strokeWidth="1.5" strokeDasharray="4,3" />
      <line x1="180" y1="18"  x2="180" y2="100" stroke="#7E57C2" strokeWidth="1.5" strokeDasharray="4,3" />
      <text x="56"  y="112" fontSize="10" fill="#7E57C2" fontWeight="700">a</text>
      <text x="177" y="112" fontSize="10" fill="#7E57C2" fontWeight="700">b</text>
      <text x="95"  y="82"  fontSize="11" fill="#7E57C2" fontWeight="700">∫ₐᵇ f</text>
    </svg>
  );
}
