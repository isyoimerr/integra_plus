import { useTheme } from '../../contexts/ThemeContext';
import SigmaLogo from './SigmaLogo';

const PALETTES = {
  neutral:    { border: '#7E57C2', bg: 'rgba(126,87,194,0.10)', nameColor: '#7E57C2' },
  celebracion:{ border: '#2E7D32', bg: 'rgba(46,125,50,0.10)',  nameColor: '#2E7D32' },
  apoyo:      { border: '#F57F17', bg: 'rgba(245,127,23,0.10)', nameColor: '#E65100' },
  alerta:     { border: '#E53935', bg: 'rgba(229,57,53,0.10)',  nameColor: '#C62828' },
  inactivo:   { border: '#546E7A', bg: 'rgba(84,110,122,0.10)', nameColor: '#546E7A' },
};

export default function SigmaBubble({ state = 'neutral', children }) {
  const { t } = useTheme();
  const c = PALETTES[state] || PALETTES.neutral;
  return (
    <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: 6, borderRadius: 16, marginBottom: 12, transition: 'all 0.3s' }}>
      <div style={{ flexShrink: 0, marginLeft: 6 }}>
        <SigmaLogo state={state} size={34} />
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ background: t.cardBg, padding: '12px 14px', borderRadius: 12, borderLeft: `3px solid ${c.border}`, boxShadow: '0 10px 30px rgba(0,0,0,0.25)', color: t.text, minWidth: 220 }}>
          <div style={{ fontSize: 12, fontWeight: 800, color: c.nameColor, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
            SIGMA
          </div>
          <div style={{ fontSize: 15, color: t.text2, lineHeight: 1.6, fontStyle: 'italic', whiteSpace: 'pre-line' }}>
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
