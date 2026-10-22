import { useMemo } from 'react';
import { useTheme } from '../../contexts/ThemeContext';
import ProgressBar from './ProgressBar';
import StatsCard from './StatsCard';
import WeeklyActivityChart from './WeeklyActivityChart';

export default function ProgressStatsModule({ stats = {}, students = [] }) {
  const { t } = useTheme();
  const totalStudents = students.length || stats.totalEstudiantes || 0;
  const atRiskStudents = students.filter((s) => s.riesgo);
  const averageProgress = totalStudents
    ? Math.round(students.reduce((sum, s) => sum + (Number(s.pct) || 0), 0) / totalStudents)
    : 0;
  const averageLevel = totalStudents
    ? Math.round(students.reduce((sum, s) => sum + (Number(s.nivelActual) || 0), 0) / totalStudents)
    : 0;

  const nivelDist = useMemo(() => {
    const dist = {};
    students.forEach((student) => {
      const level = Number(student.nivelActual) || 1;
      dist[level] = (dist[level] || 0) + 1;
    });
    return dist;
  }, [students]);

  return (
    <div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 18 }}>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 4 }}>Estadísticas y progreso</h2>
        <p style={{ fontSize: 13, color: t.text3, marginBottom: 0 }}>Vista exclusiva de métricas de grupo y progreso.</p>
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fit, minmax(175px, 1fr))', marginBottom: 22 }}>
        <StatsCard
          label="Estudiantes"
          value={totalStudents}
          subtext="Usuarios activos"
          type="puntos"
        />
        <StatsCard
          label="Promedio"
          value={`${stats.promedio ?? averageProgress}%`}
          subtext="Progreso medio"
          type="racha"
        />
        <StatsCard
          label="Nivel medio"
          value={averageLevel || '-'}
          subtext="Noción general"
          type="nivel"
        />
        <StatsCard
          label="En riesgo"
          value={`${atRiskStudents.length}`}
          subtext={`${totalStudents ? Math.round((atRiskStudents.length / totalStudents) * 100) : 0}% del grupo`}
          type="tiempo"
        />
      </div>

      <div style={{ display: 'grid', gap: 16, gridTemplateColumns: '1.35fr 0.85fr', marginBottom: 20 }}>
        <div style={{ background: t.cardBg, borderRadius: 18, border: `1px solid ${t.cardBorder}`, padding: 18 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 14 }}>
            <div>
              <div style={{ fontSize: 15, fontWeight: 700, color: t.text }}>Distribución por nivel</div>
              <div style={{ fontSize: 13, color: t.text3, marginTop: 3 }}>Cuántos estudiantes hay en cada nivel.</div>
            </div>
            <div style={{ fontSize: 13, fontWeight: 700, color: t.primary }}>{totalStudents} total</div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {Object.entries(nivelDist).length > 0 ? (
              Object.entries(nivelDist)
                .sort(([a], [b]) => Number(a) - Number(b))
                .map(([nivel, count]) => {
                  const pct = totalStudents ? Math.round((count / totalStudents) * 100) : 0;
                  return (
                    <div key={nivel} style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 12, alignItems: 'center' }}>
                      <div>
                        <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>Nivel {nivel}</div>
                        <div style={{ fontSize: 12, color: t.text3, marginTop: 2 }}>{count} estudiante{count === 1 ? '' : 's'}</div>
                      </div>
                      <div style={{ width: 70, textAlign: 'right', fontSize: 13, fontWeight: 700, color: t.text }}>{pct}%</div>
                      <div style={{ gridColumn: '1 / -1' }}>
                        <ProgressBar value={pct} color="#1565C0" bgColor={t.progressBg || '#F0F0F0'} />
                      </div>
                    </div>
                  );
                })
            ) : (
              <div style={{ fontSize: 13, color: t.text3 }}>No hay datos de niveles disponibles.</div>
            )}
          </div>
        </div>

        <div style={{ display: 'grid', gap: 16 }}>
          <div style={{ background: t.cardBg, borderRadius: 18, border: `1px solid ${t.cardBorder}`, padding: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 14 }}>Riesgo y salud del grupo</div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, marginBottom: 14 }}>
              <div>
                <div style={{ fontSize: 32, fontWeight: 800, color: atRiskStudents.length > 0 ? '#E53935' : '#2E7D32' }}>{atRiskStudents.length}</div>
                <div style={{ fontSize: 13, color: t.text3 }}>Estudiantes en riesgo</div>
              </div>
              <div style={{ padding: '6px 12px', background: atRiskStudents.length > 0 ? '#FFEBEE' : '#E8F5E9', borderRadius: 999, color: atRiskStudents.length > 0 ? '#C62828' : '#2E7D32', fontSize: 13, fontWeight: 700 }}>
                {totalStudents ? `${Math.round((atRiskStudents.length / totalStudents) * 100)}%` : '0%'}
              </div>
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              {atRiskStudents.slice(0, 4).map((student) => (
                <div key={student.id || student.email} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, padding: '10px 12px', borderRadius: 12, background: t.appBg, border: `1px solid ${t.cardBorder}` }}>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: t.text }}>{student.nombre}</div>
                    <div style={{ fontSize: 12, color: t.text3 }}>{student.nivelActual ? `Nivel ${student.nivelActual}` : 'Sin nivel'}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#E53935' }}>{student.pct ?? '-'}%</div>
                </div>
              ))}
              {!atRiskStudents.length && (
                <div style={{ fontSize: 13, color: t.text3 }}>No hay estudiantes en riesgo por ahora.</div>
              )}
            </div>
          </div>

          <div style={{ background: t.cardBg, borderRadius: 18, border: `1px solid ${t.cardBorder}`, padding: 18 }}>
            <div style={{ fontSize: 15, fontWeight: 700, color: t.text, marginBottom: 14 }}>Actividad reciente</div>
            <WeeklyActivityChart showLegend={false} />
          </div>
        </div>
      </div>
    </div>
  );
}
