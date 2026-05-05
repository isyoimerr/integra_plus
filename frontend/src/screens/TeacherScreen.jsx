import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { teacherService } from '../services/teacher.service';
import SigmaBubble from '../components/sigma/SigmaBubble';
import ProgressBar from '../components/ui/ProgressBar';

const FALLBACK_STUDENTS = [
  { nombre: 'Valentina M.', pct: 78, color: '#2E7D32', risk: false },
  { nombre: 'Carlos R.',    pct: 55, color: '#1565C0', risk: false },
  { nombre: 'Andrés P.',    pct: 22, color: '#E53935', risk: true,  note: '48h inactivo · 8 errores consecutivos' },
];

export default function TeacherScreen() {
  const navigate = useNavigate();
  const { t } = useTheme();
  const { token } = useAuth();
  const [students, setStudents] = useState(FALLBACK_STUDENTS);
  const [stats,    setStats]    = useState({ totalEstudiantes: 24, promedio: 67, enRiesgo: 3 });

  useEffect(() => {
    if (!token) return;
    teacherService.getStats(token).then(setStats).catch(() => {});
    teacherService.getStudentsAtRisk(token).then(data => {
      if (data?.length) setStudents(data.map(s => ({ nombre: s.nombre, pct: s.pct, color: s.riesgo ? '#E53935' : '#2E7D32', risk: s.riesgo })));
    }).catch(() => {});
  }, [token]);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: t.appBg, overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(150deg,#0D47A1 0%,#1565C0 100%)', padding: '20px 20px 26px', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <button onClick={() => navigate('/login')} style={{ background: 'rgba(255,255,255,0.16)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 18, marginBottom: 12 }}>←</button>
        <div style={{ fontSize: 21, fontWeight: 700, color: '#fff' }}>Panel docente</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Ingeniería · Cálculo Integral</div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '18px 20px' }}>
        <SigmaBubble state="alerta">Andrés P. lleva 48h inactivo y 8 errores consecutivos en Integrales. Requiere atención.</SigmaBubble>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 10, marginBottom: 18 }}>
          {[
            { label: 'Estudiantes', val: stats.totalEstudiantes, color: '#1565C0', bg: 'rgba(21,101,192,0.13)' },
            { label: 'Promedio',    val: `${stats.promedio}%`,   color: '#2E7D32', bg: 'rgba(46,125,50,0.13)' },
            { label: 'En riesgo',   val: stats.enRiesgo,         color: '#E53935', bg: 'rgba(229,57,53,0.13)' },
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, borderRadius: 12, padding: '14px 10px', textAlign: 'center', border: `1px solid ${s.color}40` }}>
              <div style={{ fontSize: 24, fontWeight: 800, color: s.color, letterSpacing: '-0.5px' }}>{s.val}</div>
              <div style={{ fontSize: 10, color: t.text2, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        <div style={{ fontSize: 11, fontWeight: 700, color: t.text3, marginBottom: 11, textTransform: 'uppercase', letterSpacing: '0.7px' }}>Estudiantes</div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 18 }}>
          {students.map((s, i) => (
            <div key={i} style={{ background: t.cardBg, borderRadius: 14, padding: '14px 16px', border: `1.5px solid ${s.risk ? '#FFCC02' : t.cardBorder}`, boxShadow: '0 2px 14px rgba(0,0,0,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                    {s.nombre[0]}
                  </div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{s.nombre} {s.risk && '⚠️'}</div>
                    {s.note && <div style={{ fontSize: 11, color: '#F57F17', marginTop: 1, fontWeight: 500 }}>{s.note}</div>}
                  </div>
                </div>
                <div style={{ fontSize: 17, fontWeight: 800, color: s.color }}>{s.pct}%</div>
              </div>
              <ProgressBar value={s.pct} color={s.color} bgColor="#F0F0F0" />
            </div>
          ))}
        </div>

        <SigmaBubble state="apoyo">Ya contacté a Andrés P. con un mensaje de apoyo. ¿Deseas enviarle una nota adicional?</SigmaBubble>

        <div style={{ display: 'flex', gap: 10 }}>
          <button onClick={() => navigate('/admin')}
            style={{ flex: 1, padding: '14px', borderRadius: 13, background: 'linear-gradient(135deg,#0D47A1,#1565C0)', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer', boxShadow: '0 6px 18px rgba(13,71,161,0.35)' }}>
            ⚙️ Panel Admin
          </button>
          <button style={{ flex: 1, padding: '14px', borderRadius: 13, background: 'transparent', border: `1.5px solid ${t.cardBorder}`, color: t.text2, fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            📊 Estadísticas
          </button>
        </div>
      </div>
    </div>
  );
}
