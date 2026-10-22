import { useTheme } from '../../contexts/ThemeContext';

const GRADIENTS = {
  puntos: { from: '#FF6B6B', to: '#FF8E72', icon: '⭐' },
  racha:  { from: '#FFD93D', to: '#FFA500', icon: '🔥' },
  nivel:  { from: '#6BCB77', to: '#4D96FF', icon: '📊' },
  tiempo: { from: '#A78BFA', to: '#7C3AED', icon: '⏱️' },
};

export default function StatsCard({ label, value, subtext, type = 'puntos', onClick, animated = true }) {
  const { t } = useTheme();
  const gradient = GRADIENTS[type] || GRADIENTS.puntos;
  
  return (
    <div
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${gradient.from}, ${gradient.to})`,
        borderRadius: 16,
        padding: '18px 16px',
        boxShadow: `0 8px 24px ${gradient.from}40, 0 2px 8px rgba(0,0,0,0.1)`,
        cursor: onClick ? 'pointer' : 'default',
        transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        transform: animated ? 'translateY(0)' : undefined,
        animation: animated ? 'slideUp 0.6s ease-out' : undefined,
        position: 'relative',
        overflow: 'hidden',
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = `0 12px 32px ${gradient.from}50, 0 4px 12px rgba(0,0,0,0.15)`;
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = `0 8px 24px ${gradient.from}40, 0 2px 8px rgba(0,0,0,0.1)`;
        }
      }}
    >
      {/* Shine effect */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: '-100%',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)',
          animation: 'shine 3s infinite',
        }}
      />
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ flex: 1 }}>
          <div style={{
            fontSize: 15,
            fontWeight: 700,
            color: 'rgba(255,255,255,0.85)',
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
            marginBottom: 6,
          }}>
            {label}
          </div>
          <div style={{
            fontSize: 32,
            fontWeight: 800,
            color: '#ffffff',
            letterSpacing: '-1px',
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: 4,
          }}>
            {value}
          </div>
          <div style={{
            fontSize: 14,
            color: 'rgba(255,255,255,0.8)',
            fontWeight: 500,
          }}>
            {subtext}
          </div>
        </div>
        <div style={{
          fontSize: 40,
          opacity: 0.3,
          marginLeft: 8,
        }}>
          {gradient.icon}
        </div>
      </div>

      <style>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes shine {
          0% {
            left: -100%;
          }
          50% {
            left: 100%;
          }
          100% {
            left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
