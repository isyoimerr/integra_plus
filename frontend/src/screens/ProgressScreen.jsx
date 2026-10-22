import { useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { useProgress } from '../contexts/ProgressContext';
import { LEVEL_CONFIG } from '../data/levelConfig';
import ProgressBar from '../components/ui/ProgressBar';
import StatsCard from '../components/ui/StatsCard';
import WeeklyActivityChart from '../components/ui/WeeklyActivityChart';

export default function ProgressScreen() {
  const { t } = useTheme();
  const { user } = useAuth();
  const { levels, progress, fetchAll, getProgreso, getStars } = useProgress();
  const navigate = useNavigate();

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const stats = useMemo(() => {
    const completed = progress.filter((item) => item.completado).length;
    const total = levels.length || LEVEL_CONFIG.length;
    const average = progress.length
      ? Math.round(progress.reduce((sum, item) => sum + (Number(item.porcentaje) || 0), 0) / progress.length)
      : 0;
    const nextLevel = completed < total ? completed + 1 : total;
    const points = Number(user?.puntos) || 0;
    const streak = Number(user?.racha) || 0;
    const currentLevel = Number(user?.nivelActual) || nextLevel;

    return {
      completed,
      total,
      average,
      nextLevel,
      points,
      streak,
      currentLevel,
    };
  }, [levels.length, progress, user?.puntos, user?.racha, user?.nivelActual]);

  return (
    <div style={{ minHeight: 'calc(100vh - 40px)', color: t.text }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 22 }}>
        <h2 style={{ fontSize: 20, fontWeight: 800, color: t.text, marginBottom: 4 }}>Mi progreso</h2>
        <p style={{ fontSize: 13, color: t.text3, marginBottom: 0 }}>Estadísticas completas de tu avance en INTEGRA+.</p>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', marginBottom: 20 }}>
        <StatsCard label="Puntos" value={stats.points} subtext="Total acumulado" type="puntos" />
        <StatsCard label="Racha" value={`${stats.streak} días`} subtext="Seguimiento activo" type="racha" />
        <StatsCard label="Nivel actual" value={`Nv. ${stats.currentLevel}`} subtext="Dónde estás ahora" type="nivel" />
        <StatsCard label="Completado" value={`${stats.average}%`} subtext="Progreso promedio" type="tiempo" />
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1.2fr 0.8fr', marginBottom: 20 }}>
        <div style={{ background: t.cardBg, borderRadius: 18, border: `1px solid ${t.cardBorder}`, padding: 18, minWidth: 0 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16, gap: 10 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Resumen de progreso</div>
              <div style={{ fontSize: 13, color: t.text3, marginTop: 3 }}>Tu avance general en todos los niveles.</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.primary }}>{stats.completed}/{stats.total} niveles completos</div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 14, color: t.text3, marginBottom: 8 }}>Progreso total</div>
              <ProgressBar value={stats.average} color={t.primary} bgColor={t.progressBg || '#F4F6F8'} height={12} />
            </div>
            <div style={{ minWidth: 110, textAlign: 'right' }}>
              <div style={{ fontSize: 28, fontWeight: 800, color: t.text }}>{stats.average}%</div>
              <div style={{ fontSize: 12, color: t.text3 }}>Promedio por nivel</div>
            </div>
          </div>

          <div style={{ display: 'grid', gap: 12 }}>
            {Array.from({ length: stats.total }).map((_, idx) => {
              const levelKey = idx;
              const progressLevel = getProgreso(levelKey);
              const pct = progressLevel?.porcentaje ?? 0;
              const stars = getStars(levelKey);
              const title = LEVEL_CONFIG[levelKey]?.title || `Nivel ${levelKey + 1}`;
              return (
                <div key={levelKey} style={{ background: t.appBg, borderRadius: 14, padding: '14px 16px', border: `1px solid ${t.cardBorder}` }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{title}</div>
                      <div style={{ fontSize: 12, color: t.text3 }}>Nivel {levelKey + 1} · {progressLevel?.completado ? 'Completo' : (progressLevel ? 'En progreso' : 'Pendiente')}</div>
                    </div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{Math.round(pct)}%</div>
                  </div>
                  <ProgressBar value={pct} color={progressLevel?.completado ? '#2E7D32' : '#FFB300'} bgColor={t.progressBg || '#F4F6F8'} height={10} />
                  <div style={{ display: 'flex', gap: 4, marginTop: 8, fontSize: 12, color: t.text3 }}>
                    {Array.from({ length: 3 }).map((_, starIdx) => (
                      <span key={starIdx} style={{ color: starIdx < stars ? '#F9A825' : '#CBD5E1' }}>★</span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ background: t.cardBg, borderRadius: 18, border: `1px solid ${t.cardBorder}`, padding: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 12 }}>Actividad reciente</div>
            <WeeklyActivityChart showLegend={false} />
          </div>

          <div style={{ background: t.cardBg, borderRadius: 18, border: `1px solid ${t.cardBorder}`, padding: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 12 }}>Siguiente paso</div>
            <div style={{ fontSize: 14, color: t.text3, marginBottom: 16 }}>Enfócate en el nivel {stats.nextLevel} para avanzar más rápido.</div>
            <button onClick={() => navigate('/levels')}
              style={{ width: '100%', padding: '12px 14px', borderRadius: 12, border: 'none', background: t.primary, color: '#fff', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
              Ver niveles
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
