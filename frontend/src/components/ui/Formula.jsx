import { Component } from 'react';
import { BlockMath, InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import { useTheme } from '../../contexts/ThemeContext';

// Inject a small CSS override so KaTeX respects the surrounding color (helps dark mode)
if (typeof window !== 'undefined' && !window.__katex_color_override__) {
  const s = document.createElement('style');
  s.innerHTML = `
    .katex, .katex * { color: inherit !important; }
    .katex .katex-html { color: inherit !important; }
  `;
  document.head.appendChild(s);
  window.__katex_color_override__ = true;
}

class SafeBlockMath extends Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }
  componentDidCatch() { this.setState({ error: true }); }
  render() {
    if (this.state.error) {
      return <div style={{ fontSize: 15, fontFamily: 'Georgia,serif', color: '#666' }}>{this.props.math}</div>;
    }
    return <BlockMath math={this.props.math} />;
  }
}

class SafeInlineMath extends Component {
  constructor(props) {
    super(props);
    this.state = { error: false };
  }
  componentDidCatch() { this.setState({ error: true }); }
  render() {
    if (this.state.error) {
      return <span style={{ fontFamily: 'Georgia,serif' }}>{this.props.math}</span>;
    }
    return <InlineMath math={this.props.math} />;
  }
}

export function FormulaBlock({ math, color, bgColor, borderColor }) {
  // useTheme is a hook; wrap inner component to use it
  function Wrapped() {
    const { t } = useTheme();
    const textColor = t.text;

    // simple luminance check for hex backgrounds to decide math text color
    const getContrastColor = (bg) => {
      if (!bg || typeof bg !== 'string') return textColor;
      try {
        const hex = bg.trim().replace(/[^0-9a-fA-F#]/g, '');
        const h = hex.startsWith('#') ? hex.slice(1) : hex;
        if (h.length === 3) {
          const r = parseInt(h[0] + h[0], 16);
          const g = parseInt(h[1] + h[1], 16);
          const b = parseInt(h[2] + h[2], 16);
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          return lum > 0.7 ? '#222' : textColor;
        }
        if (h.length === 6) {
          const r = parseInt(h.slice(0, 2), 16);
          const g = parseInt(h.slice(2, 4), 16);
          const b = parseInt(h.slice(4, 6), 16);
          const lum = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
          return lum > 0.7 ? '#222' : textColor;
        }
      } catch (e) { /* ignore */ }
      return textColor;
    };

    const mathColor = getContrastColor(bgColor);

    return (
      <div style={{
        background: bgColor || 'rgba(46,125,50,0.07)',
        borderRadius: 12,
        padding: '16px 18px',
        textAlign: 'center',
        border: `1px solid ${borderColor || 'rgba(46,125,50,0.2)'}`,
        overflowX: 'auto',
        color: mathColor,
      }}>
        <div style={{ color: mathColor }}>
          <SafeBlockMath math={math} />
        </div>
      </div>
    );
  }
  return <Wrapped />;
}

export function FormulaInline({ math }) {
  return <SafeInlineMath math={math} />;
}
