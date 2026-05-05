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
    <div style={{
      display: 'flex', gap: 12, alignItems: 'flex-start',
      padding: '14px 16px', borderRadius: 14, marginBottom: 16,
      borderLeft: `3px solid ${c.border}`, background: c.bg, transition: 'all 0.3s',
    }}>
      <SigmaLogo state={state} size={38} />
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 11, fontWeight: 700, color: c.nameColor, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.6px' }}>
          SIGMA
        </div>
        <div style={{ fontSize: 15, color: t.text2, lineHeight: 1.65, fontStyle: 'italic' }}>
          {children}
        </div>
      </div>
    </div>
  );
}
