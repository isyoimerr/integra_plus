import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import SigmaLogo from '../sigma/SigmaLogo';

/* ─── Nav items ──────────────────────────────────────────────────────────── */
const ITEMS = [
  {
    label: 'Aprender', path: '/dashboard', color: '#58CC02',
    icon: (s) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
        <polyline points="9 22 9 12 15 12 15 22"/>
      </svg>
    ),
  },
  {
    label: 'Niveles', path: '/levels', color: '#1CB0F6',
    icon: (s) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10"/>
        <polygon points="10 8 16 12 10 16 10 8"/>
      </svg>
    ),
  },
  {
    label: 'Práctica', path: '/levels', activePaths: ['/level/'], color: '#FF9600',
    icon: (s) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 20h9"/>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
      </svg>
    ),
  },
  {
    label: 'Perfil', path: '/profile', color: '#CE82FF',
    icon: (s) => (
      <svg width={s} height={s} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
        <circle cx="12" cy="7" r="4"/>
      </svg>
    ),
  },
];

/* ─── Sun/Moon toggle icon ───────────────────────────────────────────────── */
const IcSun = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);
const IcMoon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);
const IcChevronLeft = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IcChevronRight = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
);

/* ─── LeftNav ─────────────────────────────────────────────────────────────── */
export default function LeftNav() {
  const { t, themeName, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [collapsed, setCollapsed] = useState(false);

  const W = collapsed ? 72 : 224;

  return (
    <>
      <nav style={{
        width: W,
        minWidth: W,
        background: t.cardBg,
        borderRight: `2px solid ${t.cardBorder}`,
        display: 'flex',
        flexDirection: 'column',
        padding: collapsed ? '18px 8px 20px' : '18px 10px 20px',
        gap: 2,
        flexShrink: 0,
        position: 'sticky',
        top: 0,
        height: '100vh',
        overflowX: 'hidden',
        overflowY: 'auto',
        transition: 'width 0.28s cubic-bezier(0.4,0,0.2,1), min-width 0.28s cubic-bezier(0.4,0,0.2,1), padding 0.28s ease',
        fontFamily: "'DM Sans','Nunito','Segoe UI',sans-serif",
        zIndex: 20,
      }}>

        {/* ── Brand + toggle button ── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: collapsed ? 'center' : 'space-between',
          padding: collapsed ? '2px 0 18px' : '2px 4px 18px',
          gap: 10,
          overflow: 'hidden',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 9, flexShrink: 0 }}>
            <SigmaLogo state="celebracion" size={34} />
            {!collapsed && (
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: 14, fontWeight: 900, color: t.primary, letterSpacing: '-0.2px', lineHeight: 1.15, whiteSpace: 'nowrap', animation: 'fadeInLeft 0.2s ease' }}>
                  INTEGRA+
                </div>
                <div style={{ fontSize: 9, color: t.text3, fontWeight: 600, letterSpacing: '0.4px', whiteSpace: 'nowrap' }}>
                  Cálculo Integral
                </div>
              </div>
            )}
          </div>

          {/* Collapse toggle */}
          {!collapsed && (
            <button
              onClick={() => setCollapsed(true)}
              title="Colapsar menú"
              style={{
                width: 28, height: 28, borderRadius: 8,
                border: `1.5px solid ${t.cardBorder}`,
                background: t.appBg,
                cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: t.text3, flexShrink: 0,
                transition: 'background 0.15s',
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = t.cardBorder}
              onMouseLeave={(e) => e.currentTarget.style.background = t.appBg}
            >
              <IcChevronLeft />
            </button>
          )}
        </div>

        {/* Expand button when collapsed */}
        {collapsed && (
          <button
            onClick={() => setCollapsed(false)}
            title="Expandir menú"
            style={{
              width: 36, height: 36, borderRadius: 10,
              border: `1.5px solid ${t.cardBorder}`,
              background: t.appBg,
              cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: t.text3, alignSelf: 'center', marginBottom: 10,
              transition: 'background 0.15s',
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = t.cardBorder}
            onMouseLeave={(e) => e.currentTarget.style.background = t.appBg}
          >
            <IcChevronRight />
          </button>
        )}

        {/* ── Nav items ── */}
        {ITEMS.map((item, i) => {
          const isActive = item.activePaths
            ? item.activePaths.some(p => pathname.startsWith(p))
            : item.path && pathname.startsWith(item.path);

          return (
            <button
              key={i}
              onClick={() => item.path && navigate(item.path)}
              title={collapsed ? item.label : undefined}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: collapsed ? 'center' : 'flex-start',
                gap: collapsed ? 0 : 12,
                padding: collapsed ? '10px 0' : '10px 12px',
                borderRadius: 14,
                border: 'none',
                cursor: 'pointer',
                background: isActive ? `${item.color}18` : 'transparent',
                color: isActive ? item.color : t.text2,
                fontWeight: isActive ? 800 : 600,
                fontSize: 14,
                letterSpacing: isActive ? '-0.2px' : '0',
                transition: 'all 0.18s ease',
                textAlign: 'left',
                width: '100%',
                position: 'relative',
                outline: 'none',
                overflow: 'hidden',
                whiteSpace: 'nowrap',
              }}
              onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = t.appBg; }}
              onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = 'transparent'; }}
            >
              {/* Active left bar */}
              {isActive && (
                <div style={{
                  position: 'absolute', left: 0, top: '18%', bottom: '18%',
                  width: 3, borderRadius: 4, background: item.color,
                }}/>
              )}

              {/* Icon box */}
              <div style={{
                width: 38, height: 38, borderRadius: 12,
                background: isActive ? `${item.color}22` : t.appBg,
                border: `1.5px solid ${isActive ? item.color + '44' : t.cardBorder}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                flexShrink: 0,
                color: isActive ? item.color : t.text3,
                transition: 'all 0.18s',
              }}>
                {item.icon(20)}
              </div>

              {!collapsed && (
                <span style={{ animation: 'fadeInLeft 0.18s ease' }}>
                  {item.label}
                </span>
              )}
            </button>
          );
        })}

        {/* ── Spacer ── */}
        <div style={{ flex: 1 }} />

        {/* ── Theme toggle ── */}
        <button
          onClick={toggleTheme}
          title={`Cambiar a tema ${themeName === 'dark' ? 'claro' : 'oscuro'}`}
          style={{
            display: 'flex', alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'flex-start',
            gap: collapsed ? 0 : 12,
            padding: collapsed ? '10px 0' : '10px 12px',
            borderRadius: 14, border: 'none',
            background: 'transparent',
            color: t.text3, cursor: 'pointer',
            fontWeight: 600, fontSize: 14,
            width: '100%', transition: 'all 0.18s',
            whiteSpace: 'nowrap', overflow: 'hidden',
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = t.appBg}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div style={{
            width: 38, height: 38, borderRadius: 12,
            background: t.appBg, border: `1.5px solid ${t.cardBorder}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0, color: t.text3,
          }}>
            {themeName === 'dark' ? <IcSun /> : <IcMoon />}
          </div>
          {!collapsed && (
            <span style={{ animation: 'fadeInLeft 0.18s ease' }}>
              {themeName === 'dark' ? 'Tema claro' : 'Tema oscuro'}
            </span>
          )}
        </button>

        {/* ── Footer ── */}
        {!collapsed && (
          <div style={{
            padding: '10px 6px 0',
            borderTop: `1.5px solid ${t.cardBorder}`,
            marginTop: 6,
            animation: 'fadeInLeft 0.2s ease',
          }}>
            <div style={{ fontSize: 10, color: t.text3, fontWeight: 600, letterSpacing: '0.4px', textAlign: 'center', lineHeight: 1.6 }}>
              INTEGRA+ v1.0
              <br />Plataforma de Cálculo Integral
            </div>
          </div>
        )}
      </nav>

      <style>{`
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </>
  );
}
