import { useTheme } from '../../contexts/ThemeContext';
import { FormulaBlock, FormulaInline } from './Formula';

function parseLatexSegments(text) {
  const segments = [];
  let i = 0;
  while (i < text.length) {
    if (text[i] === '\\') {
      const start = i;
      i += 1;
      while (i < text.length && /[A-Za-z]/.test(text[i])) i += 1;
      while (i < text.length && /\s/.test(text[i])) i += 1;
      const consumeGroup = () => {
        if (text[i] !== '{') return;
        let depth = 0;
        do {
          if (text[i] === '{') depth += 1;
          else if (text[i] === '}') depth -= 1;
          i += 1;
        } while (i < text.length && depth > 0);
      };
      while (i < text.length && ['{', '^', '_'].includes(text[i])) {
        if (text[i] === '{') {
          consumeGroup();
        } else {
          i += 1;
          if (text[i] === '{') {
            consumeGroup();
          } else {
            i += 1;
          }
        }
      }
      segments.push({ type: 'latex', value: text.slice(start, i) });
    } else {
      const start = i;
      while (i < text.length && text[i] !== '\\') i += 1;
      segments.push({ type: 'text', value: text.slice(start, i) });
    }
  }
  return segments;
}

export function Explanation({ text = '', style = {}, bgColor, borderColor }) {
  const { t, themeName } = useTheme();
  const raw = String(text || '').trim();
  const looksLikeHTML = /<\/?[a-z][\s\S]*>/i.test(raw);
  const hasLatex = /\\|\\frac|\\int|\$|\^/.test(raw);
  const baseStyle = {
    fontSize: 16,
    color: t.text2,
    lineHeight: 1.75,
    whiteSpace: 'pre-wrap',
    wordBreak: 'break-word',
    textAlign: 'left',
    ...style,
  };

  if (!raw) {
    return <div style={baseStyle}>Sin explicación disponible.</div>;
  }

  if (looksLikeHTML) {
    return <div style={baseStyle} dangerouslySetInnerHTML={{ __html: raw }} />;
  }

  const segments = hasLatex ? parseLatexSegments(raw) : [{ type: 'text', value: raw }];
  const onlyMath = segments.length === 1 && segments[0].type === 'latex';

  if (onlyMath) {
    return <FormulaBlock math={raw} bgColor={bgColor || (themeName === 'dark' ? 'rgba(255,255,255,0.05)' : '#F1F8E9')} borderColor={borderColor || (themeName === 'dark' ? 'rgba(255,255,255,0.12)' : '#C5E1A5')} />;
  }

  return (
    <div style={{ padding: 14, borderRadius: 18, background: bgColor || (themeName === 'dark' ? '#111827' : '#fff7e0'), border: `1px solid ${borderColor || (themeName === 'dark' ? '#394047' : '#ffd57f')}`, ...baseStyle }}>
      {segments.map((segment, index) => (
        segment.type === 'latex'
          ? <FormulaInline key={index} math={segment.value} />
          : <span key={index}>{segment.value}</span>
      ))}
    </div>
  );
}
