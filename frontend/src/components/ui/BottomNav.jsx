import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';

const ITEMS = [
  { path: '/dashboard', label: 'Inicio',   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg> },
  { path: '/levels',    label: 'Niveles',  icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M3 3l7.07 16.97 2.51-7.39 7.39-2.51L3 3z"/><path d="M13 13l6 6"/></svg> },
  { path: '/levels',    label: 'Práctica', icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>, activePaths: ['/level/'] },
  { path: '/profile',   label: 'Perfil',   icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" width="22" height="22"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg> },
];

export default function BottomNav() {
  const { t } = useTheme();
  const navigate = useNavigate();
  const { pathname } = useLocation();

  return (
    <nav aria-label="Navegación principal" style={{ display: 'flex', borderTop: `1px solid ${t.navBorder}`, background: t.navBg, flexShrink: 0 }}>
      {ITEMS.map((item, i) => {
        const active = item.activePaths
          ? item.activePaths.some(p => pathname.startsWith(p))
          : pathname.startsWith(item.path);
        return (
          <button key={i} onClick={() => navigate(item.path)}
            aria-label={item.label}
            aria-current={active ? 'page' : undefined}
            style={{ flex: 1, padding: '11px 0 9px', border: 'none', background: 'none', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4, color: active ? t.primary : '#AAAAAA', transition: 'color 0.18s' }}>
            {item.icon}
            <span style={{ fontSize: 11, fontWeight: active ? 700 : 500 }}>{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
