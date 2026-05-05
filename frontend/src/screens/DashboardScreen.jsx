import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useProgress } from '../contexts/ProgressContext';
import { userService } from '../services/user.service';
import { LEVEL_CONFIG } from '../data/levelConfig';
import SigmaBubble from '../components/sigma/SigmaBubble';
import ProgressBar from '../components/ui/ProgressBar';
import BottomNav from '../components/ui/BottomNav';

export default function DashboardScreen() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { t } = useTheme();
  const { levels, setSelectedLevel, setExerciseIdx, fetchAll, getProgreso, isUnlocked } = useProgress();
  const [stats, setStats] = useState({ puntos: 0, racha: 0, nivelActual: 1, nivelesTotales: 3, porcentajeCompletado: 0 });
  const [showOnlyUnlocked, setShowOnlyUnlocked] = useState(false);

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  useEffect(() => {
    if (token) {
      fetchAll();
      userService.getStats(token).then(setStats).catch(() => {});
    }
  }, [token]);

  const goToTheory   = (levelKey) => { setSelectedLevel(levelKey); navigate('/level/fase-a'); };
  const goToPractice = (levelKey) => { setSelectedLevel(levelKey); setExerciseIdx(0); navigate('/level/fase-b'); };

  // Construir lista de cursos desde la DB
  const courses = levels.map((lv) => {
    const levelKey = lv.id - 1;
    const cfg      = LEVEL_CONFIG[levelKey] || {};
    const prog     = getProgreso(levelKey);
    const unlocked = isUnlocked(levelKey);
    return {
      levelKey,
      title:    `${lv.nombre} · ${lv.subtitulo || ''}`,
      color:    cfg.color || lv.color || '#2E7D32',
      progress: prog?.porcentaje ?? (unlocked ? 0 : null),
      done:     prog?.completado ? (prog.puntos > 0 ? Math.round(prog.puntos / 15) : 0) : null,
      locked:   !unlocked,
      isNew:    !prog && unlocked,
    };
  }).filter(c => !showOnlyUnlocked || !c.locked);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.appBg, overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: t.headerBg, padding: '28px 20px 32px', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.15)', animation: 'slideDown 0.5s ease-out' }}>
        <div style={{ display: 'flex', alignItems: 'center', marginBottom: 20 }}>
          <div style={{ width: 50, height: 50, borderRadius: '50%', background: `linear-gradient(135deg, ${t.primary}, ${t.primary}aa)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: 20, fontWeight: 800, marginRight: 15, animation: 'popIn 0.6s ease-out 0.1s both' }}>
            {(user?.nombre || 'E')[0].toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', marginBottom: 3, fontWeight: 500 }}>{greeting},</div>
            <div style={{ fontSize: 30, fontWeight: 800, color: '#fff', letterSpacing: '-0.8px', fontFamily: "'DM Sans',sans-serif" }}>
              {user?.nombre || 'Estudiante'}
            </div>
          </div>
          <button onClick={() => { fetchAll(); userService.getStats(token).then(setStats).catch(() => {}); }}
            style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '8px', border: 'none', color: '#fff', cursor: 'pointer', transition: 'all 0.2s ease' }}
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.25)'}
            onMouseLeave={(e) => e.target.style.background = 'rgba(255,255,255,0.15)'}>
            🔄
          </button>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10 }}>
          {[
            { label: 'Puntos', val: stats.puntos,             sub: '⬆ hoy' },
            { label: 'Racha',  val: `${stats.racha} 🔥`,      sub: 'días seguidos' },
            { label: 'Nivel',  val: `Nv. ${stats.nivelActual}`, sub: `de ${stats.nivelesTotales}` },
          ].map((s, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)', borderRadius: 13, padding: '13px 10px', border: '1px solid rgba(255,255,255,0.22)', textAlign: 'center', transition: 'transform 0.2s ease, box-shadow 0.2s ease', cursor: 'pointer' }}
                 onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                 onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: 5 }}>{s.label}</div>
              <div style={{ fontSize: 21, fontWeight: 800, color: '#fff', letterSpacing: '-0.5px' }}>{s.val}</div>
              <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', marginTop: 3 }}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
        <SigmaBubble state="celebracion" style={{ animation: 'popIn 0.6s ease-out' }}>
          {stats.racha > 0
            ? `¡${stats.racha} días seguidos! Eso no es cualquier cosa. ¿Listo/a, ${user?.nombre || 'campeón'}?`
            : `¡Bienvenido/a, ${user?.nombre || 'campeón'}! Hoy es un buen día para aprender. 🚀`}
        </SigmaBubble>

        {/* Progreso general */}
        <div style={{ background: t.cardBg, borderRadius: 16, padding: '18px 20px', border: `1px solid ${t.cardBorder}`, marginBottom: 16, boxShadow: '0 2px 14px rgba(0,0,0,0.05)', animation: 'fadeSlideUp 0.5s ease 0.2s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Progreso general</div>
            <span style={{ background: `${t.primary}18`, color: t.primary, fontSize: 12, fontWeight: 700, borderRadius: 20, padding: '4px 12px' }}>
              Nv. {stats.nivelActual} de {stats.nivelesTotales}
            </span>
          </div>
          <ProgressBar value={stats.porcentajeCompletado} color={t.primary} bgColor={t.progressBg} />
          <div style={{ textAlign: 'right', fontSize: 12, color: t.text3, marginTop: 6 }}>{stats.porcentajeCompletado}% completado</div>
        </div>

        <div style={{ fontSize: 12, fontWeight: 700, color: t.text3, marginBottom: 14, textTransform: 'uppercase', letterSpacing: '0.7px' }}>
          {courses.length ? 'Tus niveles' : 'Cargando niveles…'}
        </div>

        {/* Toggle para preferencias */}
        <div style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 10 }}>
          <label style={{ fontSize: 14, color: t.text2 }}>
            <input type="checkbox" checked={showOnlyUnlocked} onChange={(e) => setShowOnlyUnlocked(e.target.checked)} style={{ marginRight: 8 }} />
            Mostrar solo desbloqueados
          </label>
        </div>

        {courses.map((c, i) => (
          <div key={i} style={{ background: t.cardBg, borderRadius: 16, padding: '16px 18px', border: `1px solid ${t.cardBorder}`, marginBottom: 12, boxShadow: '0 2px 14px rgba(0,0,0,0.05)', opacity: c.locked ? 0.55 : 1, animation: `fadeSlideUp 0.5s ease ${i * 0.1}s both`, transition: 'transform 0.2s ease' }}
               onMouseEnter={(e) => !c.locked && (e.target.style.transform = 'translateY(-2px)')}
               onMouseLeave={(e) => !c.locked && (e.target.style.transform = 'translateY(0)')}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: c.progress !== null ? 12 : 0 }}>
              <div>
                <div style={{ fontSize: 16, fontWeight: 700, color: t.text, marginBottom: 4 }}>{c.title}</div>
                {c.done !== null && <div style={{ fontSize: 13, color: t.text2 }}>{c.done} ejercicios completados</div>}
              </div>
              {c.locked && <span style={{ background: '#F5F5F5', color: '#999', fontSize: 12, fontWeight: 700, borderRadius: 20, padding: '4px 12px', flexShrink: 0, marginLeft: 8 }}>🔒 Bloqueado</span>}
              {c.isNew  && <span style={{ background: '#E3F2FD', color: '#1565C0', fontSize: 12, fontWeight: 700, borderRadius: 20, padding: '4px 12px', flexShrink: 0, marginLeft: 8 }}>Nuevo 🆕</span>}
            </div>
            {c.progress !== null && <ProgressBar value={c.progress} color={c.color} bgColor={t.progressBg} />}
            {!c.locked && (
              <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                <button onClick={() => goToTheory(c.levelKey)}
                  style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: `1.5px solid ${c.color}44`, background: 'transparent', color: c.color, fontSize: 14, fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => { e.target.style.background = `${c.color}22`; e.target.style.transform = 'scale(1.02)'; }}
                  onMouseLeave={(e) => { e.target.style.background = 'transparent'; e.target.style.transform = 'scale(1)'; }}>
                  📖 Teoría
                </button>
                <button onClick={() => goToPractice(c.levelKey)}
                  style={{ flex: 1, padding: '11px 0', borderRadius: 10, border: 'none', background: c.color, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: `0 4px 14px ${c.color}40`, transition: 'all 0.2s ease' }}
                  onMouseEnter={(e) => e.target.style.transform = 'scale(1.05)'}
                  onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}>
                  ✏️ PRÁCTICA
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <BottomNav />
    </div>
  );
}
