import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SigmaLogo from '../components/sigma/SigmaLogo';
import ProgressBar from '../components/ui/ProgressBar';
import BottomNav from '../components/ui/BottomNav';
import { SIGMA_STATES } from '../data/levelConfig';

export default function ProfileScreen() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { t, themeName, changeTheme } = useTheme();

  const handleLogout = () => { logout(); navigate('/login'); };

  const THEMES_LIST = [
    { id: 'light',  label: '☀️ Claro' },
    { id: 'dark',   label: '🌙 Oscuro' },
    { id: 'custom', label: '🎨 Custom' },
  ];

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.appBg, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: t.headerBg, padding: '28px 20px 32px', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', textAlign: 'center' }}>
        <div style={{ width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', fontSize: 32, fontWeight: 800, color: '#fff' }}>
          {(user?.nombre || 'U')[0].toUpperCase()}
        </div>
        <div style={{ fontSize: 22, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{user?.nombre || 'Estudiante'}</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 4 }}>{user?.email || ''}</div>
        <div style={{ marginTop: 12, display: 'inline-flex', gap: 16 }}>
          {[{ val: user?.puntos ?? 540, label: 'XP' }, { val: `${user?.racha ?? 7}🔥`, label: 'Racha' }].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 12, padding: '8px 16px', textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 800, color: '#fff' }}>{s.val}</div>
              <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>

        {/* Tema */}
        <div style={{ background: t.cardBg, borderRadius: 14, padding: '16px 18px', border: `1px solid ${t.cardBorder}`, marginBottom: 14, boxShadow: '0 2px 14px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 12 }}>Tema visual</div>
          <div style={{ display: 'flex', gap: 8 }}>
            {THEMES_LIST.map(th => (
              <button key={th.id} onClick={() => changeTheme(th.id)}
                style={{ flex: 1, padding: '9px 6px', borderRadius: 10, border: `2px solid ${themeName === th.id ? t.primary : t.cardBorder}`, background: themeName === th.id ? `${t.primary}15` : t.cardBg, color: themeName === th.id ? t.primary : t.text2, fontSize: 12, fontWeight: 600, cursor: 'pointer', transition: 'all 0.18s' }}>
                {th.label}
              </button>
            ))}
          </div>
        </div>

        {/* SIGMA estados */}
        <div style={{ background: t.cardBg, borderRadius: 14, padding: '16px 18px', border: `1px solid ${t.cardBorder}`, marginBottom: 14, boxShadow: '0 2px 14px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 12 }}>SIGMA — Estados emocionales</div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
            {Object.keys(SIGMA_STATES).map(state => (
              <div key={state} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6 }}>
                <SigmaLogo state={state} size={44} />
                <span style={{ fontSize: 10, color: t.text3, fontWeight: 600, textTransform: 'capitalize' }}>{state}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Logros */}
        <div style={{ background: t.cardBg, borderRadius: 14, padding: '16px 18px', border: `1px solid ${t.cardBorder}`, marginBottom: 14, boxShadow: '0 2px 14px rgba(0,0,0,0.05)' }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: t.text, marginBottom: 12 }}>Logros</div>
          {[
            { icon: '🔥', label: 'Racha de 7 días',      desc: 'Constancia',     pct: 100 },
            { icon: '⭐', label: 'Nivel 1 completado',    desc: '3 estrellas',    pct: 100 },
            { icon: '🧠', label: 'Maestro de bases',      desc: 'Nivel 0 perfecto', pct: 100 },
            { icon: '🔓', label: 'Nivel 2 desbloqueado',  desc: 'En progreso',    pct: 40 },
          ].map((l, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, background: `${t.primary}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>{l.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{l.label}</div>
                <div style={{ fontSize: 11, color: t.text3, marginBottom: 4 }}>{l.desc}</div>
                <ProgressBar value={l.pct} color={t.primary} bgColor={t.progressBg} height={5} />
              </div>
              {l.pct === 100 && <span style={{ fontSize: 18 }}>✅</span>}
            </div>
          ))}
        </div>

        {/* Cerrar sesión */}
        <button onClick={handleLogout}
          style={{ width: '100%', padding: '14px', borderRadius: 13, background: 'transparent', border: '1.5px solid #FFCDD2', color: '#E53935', fontSize: 15, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', marginBottom: 8 }}>
          Cerrar sesión
        </button>
      </div>

      <BottomNav />
    </div>
  );
}
