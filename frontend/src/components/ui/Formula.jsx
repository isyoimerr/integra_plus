import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';

export function FormulaBlock({ math, color, bgColor, borderColor }) {
  return (
    <div style={{
      background: bgColor || 'rgba(46,125,50,0.07)',
      borderRadius: 12,
      padding: '16px 18px',
      textAlign: 'center',
      border: `1px solid ${borderColor || 'rgba(46,125,50,0.2)'}`,
      overflowX: 'auto',
    }}>
      <BlockMath math={math} />
    </div>
  );
}

export function FormulaInline({ math }) {
  return <InlineMath math={math} />;
}
