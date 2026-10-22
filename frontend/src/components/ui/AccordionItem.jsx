import { useTheme } from '../../contexts/ThemeContext';
import { FormulaInline, FormulaBlock } from './Formula';

export function IcChevron({ open }) {
  return (
    <svg
      width="18" height="18" viewBox="0 0 24 24"
      fill="none" stroke="currentColor" strokeWidth="2.5"
      strokeLinecap="round" strokeLinejoin="round"
      style={{
        transition: 'transform 0.3s cubic-bezier(0.4,0,0.2,1)',
        transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
        flexShrink: 0,
      }}
    >
      <polyline points="6 9 12 15 18 9"/>
    </svg>
  );
}

/**
 * AccordionItem genérico para conceptos de nivel.
 * Props: concept { icon, title, formula, desc }, isOpen, onToggle, color
 */
export default function AccordionItem({ concept: c, isOpen, onToggle, color }) {
  const { t } = useTheme();

  return (
    <div style={{
      borderRadius: 16,
      border: `1.5px solid ${isOpen ? color : t.cardBorder}`,
      marginBottom: 10,
      background: t.cardBg,
      boxShadow: isOpen ? `0 4px 20px ${color}20` : '0 2px 8px rgba(0,0,0,0.04)',
      transition: 'border-color 0.25s, box-shadow 0.25s',
      overflow: 'hidden',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          gap: 14, padding: '15px 18px',
          background: 'transparent', border: 'none',
          cursor: 'pointer', textAlign: 'left', outline: 'none',
        }}
      >
        <div style={{
          width: 44, height: 44, borderRadius: 13, flexShrink: 0,
          background: isOpen ? `${color}22` : `${color}12`,
          border: `1.5px solid ${isOpen ? color + '55' : color + '25'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 20, fontWeight: 700, color,
          transition: 'background 0.25s, border-color 0.25s',
        }}>
          {c.icon}
        </div>

        <div style={{ flex: 1, minWidth: 0, textAlign: 'left' }}>
          <div style={{
            fontSize: 15, fontWeight: 800,
            color: isOpen ? color : t.text,
            marginBottom: 4,
            transition: 'color 0.25s',
          }}>
            {c.title}
          </div>
          <div style={{ fontSize: 13, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            <FormulaInline math={c.formula} />
          </div>
        </div>

        <div style={{ color: isOpen ? color : t.text3, transition: 'color 0.25s' }}>
          <IcChevron open={isOpen} />
        </div>
      </button>

      <div style={{
        maxHeight: isOpen ? 320 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.38s cubic-bezier(0.4,0,0.2,1)',
      }}>
        <div style={{
          padding: '0 18px 18px',
          animation: isOpen ? 'accordionOpen 0.3s ease both' : 'none',
        }}>
          <div style={{ borderTop: `1px solid ${color}22`, paddingTop: 14 }}>
            <p style={{
              fontSize: 14, color: t.text2,
              lineHeight: 1.75, marginBottom: 14,
              fontFamily: "'DM Sans','Nunito',sans-serif",
            }}>
              {c.desc}
            </p>
            <FormulaBlock
              math={c.formula}
              bgColor={`${color}0C`}
              borderColor={`${color}30`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
