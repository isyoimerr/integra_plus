/**
 * styleConfig.js
 * Centraliza estilos reutilizables y paleta de colores
 * Objetivo: eliminar duplicación, mejorar mantenibilidad
 */

export const COLORS = {
  // Transparentes reutilizados
  white_18: 'rgba(255,255,255,0.18)',
  white_12: 'rgba(255,255,255,0.12)',
  white_25: 'rgba(255,255,255,0.25)',
  white_22: 'rgba(255,255,255,0.22)',
  white_28: 'rgba(255,255,255,0.28)',
  white_32: 'rgba(255,255,255,0.32)',
  white_35: 'rgba(255,255,255,0.35)',
  white_45: 'rgba(255,255,255,0.45)',
  white_65: 'rgba(255,255,255,0.65)',
  white_70: 'rgba(255,255,255,0.70)',
  black_07: 'rgba(0,0,0,0.07)',
  black_14: 'rgba(0,0,0,0.14)',
  black_20: 'rgba(0,0,0,0.20)',
  black_28: 'rgba(0,0,0,0.28)',
  black_34: 'rgba(0,0,0,0.34)',
};

export const TRANSITIONS = {
  fast: 'all 0.15s ease',
  normal: 'all 0.2s ease',
  smooth: 'all 0.3s cubic-bezier(0.34,1.56,0.64,1)',
  bounce: 'all 0.22s cubic-bezier(0.34,1.56,0.64,1)',
};

export const CARD_STYLES = {
  base: (t) => ({
    background: t.cardBg,
    borderRadius: 16,
    padding: '18px 20px',
    border: `1px solid ${t.cardBorder}`,
    boxShadow: `0 2px 16px ${COLORS.black_07}`,
    transition: TRANSITIONS.normal,
  }),
  elevated: (t, color) => ({
    background: t.cardBg,
    borderRadius: 16,
    padding: '18px 20px',
    border: `1.5px solid ${color}`,
    boxShadow: `0 4px 20px ${color}44`,
    transition: TRANSITIONS.normal,
  }),
  interactive: (t, color) => ({
    ...CARD_STYLES.base(t),
    border: `1px solid ${color}55`,
    background: `${color}12`,
    cursor: 'pointer',
  }),
};

export const BUTTON_STYLES = {
  primary: (color) => ({
    background: color,
    color: '#fff',
    border: 'none',
    borderRadius: 12,
    padding: '9px 0',
    fontSize: 12,
    fontWeight: 700,
    cursor: 'pointer',
    transition: TRANSITIONS.fast,
  }),
  secondary: (t) => ({
    background: t.cardBg,
    border: `1px solid ${t.cardBorder}`,
    color: t.text,
    borderRadius: 10,
    padding: '8px 0',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
    transition: TRANSITIONS.fast,
  }),
  ghost: (color) => ({
    background: `${color}12`,
    border: `2px solid ${color}55`,
    color: color,
    borderRadius: 10,
    padding: '8px 0',
    fontSize: 11,
    fontWeight: 700,
    cursor: 'pointer',
    transition: TRANSITIONS.fast,
  }),
};

export const FLEX_PATTERNS = {
  center: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerColumn: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  spaceBetween: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  wrap: (gap = 12) => ({
    display: 'flex',
    flexWrap: 'wrap',
    gap,
  }),
};

export const SHADOW_STYLES = {
  soft: '0 2px 8px rgba(0,0,0,0.1)',
  medium: '0 4px 16px rgba(0,0,0,0.15)',
  hard: '0 8px 28px rgba(0,0,0,0.25)',
};

export const TEXT_STYLES = {
  caption: {
    fontSize: 11,
    fontWeight: 600,
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
  },
  label: {
    fontSize: 12,
    fontWeight: 700,
    letterSpacing: '0.5px',
  },
  body: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 1.5,
  },
  heading3: {
    fontSize: 18,
    fontWeight: 800,
    letterSpacing: '-0.5px',
  },
};
