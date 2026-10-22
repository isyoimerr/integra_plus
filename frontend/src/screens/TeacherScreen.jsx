import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { useAuth } from '../contexts/AuthContext';
import { teacherService } from '../services/teacher.service';
import { exerciseService } from '../services/exercise.service';
import { LEVEL_CONFIG } from '../data/levelConfig';
import { FormulaInline } from '../components/ui/Formula';
import ProgressBar from '../components/ui/ProgressBar';
import ProgressStatsModule from '../components/ui/ProgressStatsModule';
import AdminPanelScreen from './AdminPanelScreen';

const MODULES = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'students',  label: 'Estudiantes' },
  { id: 'progress',  label: 'Progreso individual' },
  { id: 'assign',    label: 'Asignar ejercicios' },
  { id: 'stats',     label: 'Estadisticas' },
  { id: 'admin',     label: 'Administrar ejercicios' },
];

export default function TeacherScreen() {
  const navigate = useNavigate();
  const { t, themeName, toggleTheme } = useTheme();
  const { token, logout } = useAuth();
  const [module, setModule] = useState('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [students, setStudents] = useState([]);
  const [stats, setStats] = useState({ totalEstudiantes: 0, promedio: 0, enRiesgo: 0 });
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([
      teacherService.getStats(token).catch(() => null),
      teacherService.getStudents(token).catch(() => []),
    ]).then(([s, st]) => {
      if (s) setStats(s);
      if (st?.length) setStudents(st);
    }).finally(() => setLoading(false));
  }, [token]);

  const filteredStudents = students.filter(s =>
    s.nombre?.toLowerCase().includes(search.toLowerCase())
  );

  const handleLogout = () => { logout(); navigate('/login'); };

  const renderContent = () => {
    if (loading) return <div style={{ padding: 40, textAlign: 'center', color: t.text3 }}>Cargando...</div>;

    switch (module) {
      case 'dashboard': return <DashboardModule stats={stats} students={students} navigate={navigate} t={t} themeName={themeName} />;
      case 'students': return <StudentsModule students={filteredStudents} search={search} setSearch={setSearch} selectedStudent={selectedStudent} setSelectedStudent={setSelectedStudent} t={t} />;
      case 'progress': return <ProgressModule student={selectedStudent} students={students} setSelectedStudent={setSelectedStudent} t={t} token={token} />;
      case 'assign': return <AssignModule students={students} t={t} token={token} />;
      case 'stats': return <StatsModule students={students} stats={stats} t={t} />;
      case 'admin': return <AdminPanelScreen embedded />;
      default: return null;
    }
  };

  const bg = themeName === 'dark' ? '#0F1117' : '#F0F2F5';
  const sidebarBg = themeName === 'dark' ? '#1A1D27' : '#fff';
  const borderColor = themeName === 'dark' ? 'rgba(255,255,255,0.08)' : '#E0E0E0';

  return (
    <div style={{ flex: 1, display: 'flex', background: bg, overflow: 'hidden', fontFamily: "'DM Sans','Nunito','Segoe UI',sans-serif" }}>
      {/* Sidebar */}
      <div style={{
        width: collapsed ? 60 : 220, minWidth: collapsed ? 60 : 220,
        background: sidebarBg, borderRight: `1px solid ${borderColor}`,
        display: 'flex', flexDirection: 'column', padding: collapsed ? '14px 4px' : '18px 10px',
        transition: 'width 0.25s, min-width 0.25s, padding 0.25s',
        gap: 1, flexShrink: 0, overflow: 'hidden',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: collapsed ? '2px 0 14px' : '2px 6px 16px', justifyContent: collapsed ? 'center' : 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 30, height: 30, borderRadius: 7, background: 'linear-gradient(135deg,#1565C0,#1976D2)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 13, flexShrink: 0 }}>D</div>
            {!collapsed && <span style={{ fontSize: 14, fontWeight: 800, color: t.text, letterSpacing: '-0.2px' }}>Docente</span>}
          </div>
          {!collapsed && (
            <button onClick={() => setCollapsed(true)}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.text3, fontSize: 14, padding: 4, lineHeight: 1 }}>&lsaquo;</button>
          )}
        </div>

        {collapsed && (
          <button onClick={() => setCollapsed(false)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.text3, fontSize: 14, padding: '2px 0 10px', textAlign: 'center', lineHeight: 1 }}>&rsaquo;</button>
        )}

        {MODULES.map(m => {
          const active = module === m.id;
          return (
            <button key={m.id} onClick={() => { setModule(m.id); if (window.innerWidth < 768) setCollapsed(true); }}
              style={{
                display: 'flex', alignItems: 'center', gap: 8, justifyContent: collapsed ? 'center' : 'flex-start',
                padding: collapsed ? '9px 0' : '9px 10px', borderRadius: 8, border: 'none',
                cursor: 'pointer', background: active ? `${t.primary}16` : 'transparent',
                color: active ? t.primary : t.text2, fontWeight: active ? 700 : 500, fontSize: 13,
                transition: 'all 0.12s', whiteSpace: 'nowrap', overflow: 'hidden',
                width: '100%', position: 'relative',
              }}>
              {active && !collapsed && (
                <div style={{ position: 'absolute', left: 0, top: '20%', bottom: '20%', width: 3, background: t.primary, borderRadius: 3 }} />
              )}
              {active && collapsed && (
                <div style={{ position: 'absolute', left: 2, top: '20%', bottom: '20%', width: 2, background: t.primary, borderRadius: 2 }} />
              )}
              <div style={{
                width: collapsed ? 22 : 20, height: collapsed ? 22 : 20, borderRadius: 6, flexShrink: 0,
                background: active ? `${t.primary}14` : `${t.text3}0C`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 13, fontWeight: 700, color: active ? t.primary : t.text3,
              }}>
                {m.label.charAt(0)}
              </div>
              {!collapsed && <span>{m.label}</span>}
            </button>
          );
        })}

        <div style={{ flex: 1 }} />

        <button onClick={toggleTheme}
          style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '9px 0' : '9px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: t.text3, fontWeight: 500, fontSize: 15, width: '100%', whiteSpace: 'nowrap' }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: `${t.text3}0C`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, color: t.text3 }}>
            {themeName === 'dark' ? 'L' : 'D'}
          </div>
          {!collapsed && <span>{themeName === 'dark' ? 'Modo claro' : 'Modo oscuro'}</span>}
        </button>

        <button onClick={handleLogout}
          style={{ display: 'flex', alignItems: 'center', gap: 8, justifyContent: collapsed ? 'center' : 'flex-start', padding: collapsed ? '9px 0' : '9px 10px', borderRadius: 8, border: 'none', cursor: 'pointer', background: 'transparent', color: '#E53935', fontWeight: 500, fontSize: 15, width: '100%', whiteSpace: 'nowrap' }}>
          <div style={{ width: 20, height: 20, borderRadius: 6, flexShrink: 0, background: '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 15, fontWeight: 700, color: '#E53935' }}>x</div>
          {!collapsed && <span>Salir</span>}
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{
          flex: 1, overflowY: 'auto', padding: '24px',
          maxWidth: 960, width: '100%', margin: '0 auto',
        }}>
          {renderContent()}
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════ MODULES ════════════════════════════ */

function DashboardModule({ stats, students, navigate, t, themeName }) {
  const enRiesgo = students.filter(s => s.riesgo).length;
  const bg = themeName === 'dark' ? '#1E2030' : '#fff';

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 4 }}>Dashboard</h2>
      <p style={{ fontSize: 13, color: t.text3, marginBottom: 20 }}>Resumen general del progreso</p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
        {[
          { label: 'Estudiantes', val: stats.totalEstudiantes, color: '#1565C0' },
          { label: 'Promedio grupal', val: `${stats.promedio}%`, color: '#2E7D32' },
          { label: 'En riesgo', val: enRiesgo, color: '#E53935' },
        ].map((s, i) => (
          <div key={i} style={{ background: bg, borderRadius: 12, padding: '18px 16px', border: `1px solid ${t.cardBorder}` }}>
            <div style={{ fontSize: 26, fontWeight: 800, color: s.color, letterSpacing: '-0.5px' }}>{s.val}</div>
            <div style={{ fontSize: 15, color: t.text3, fontWeight: 600, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button onClick={() => navigate('/exercise-editor')}
          style={{ padding: '12px 24px', borderRadius: 10, background: '#2E7D32', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Crear ejercicio
        </button>
        <button onClick={() => navigate('/levels')}
          style={{ padding: '12px 24px', borderRadius: 10, background: '#E67E22', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Vista estudiante
        </button>
      </div>
    </div>
  );
}

function StudentsModule({ students, search, setSearch, selectedStudent, setSelectedStudent, t }) {
  const sorted = [...students].sort((a, b) => (a.riesgo === b.riesgo ? 0 : a.riesgo ? -1 : 1));
  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 4 }}>Estudiantes</h2>
      <p style={{ fontSize: 13, color: t.text3, marginBottom: 16 }}>Selecciona un estudiante para ver su detalle</p>

      <input value={search} onChange={e => setSearch(e.target.value)}
        placeholder="Buscar estudiante..."
        style={{
          width: '100%', padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${t.cardBorder}`,
          background: t.cardBg, color: t.text, fontSize: 13, outline: 'none', marginBottom: 16,
        }} />

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
        {sorted.map((s, i) => {
          const color = s.riesgo ? '#E53935' : s.pct < 60 ? '#F57F17' : '#2E7D32';
          const sel = selectedStudent?.id === s.id;
          return (
            <button key={i} onClick={() => setSelectedStudent(s)}
              style={{
                display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
                borderRadius: 10, border: `1.5px solid ${sel ? color : t.cardBorder}`,
                background: sel ? `${color}0A` : t.cardBg, cursor: 'pointer',
                textAlign: 'left', width: '100%', transition: 'all 0.12s',
              }}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14, flexShrink: 0 }}>{s.nombre?.[0] || '?'}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{s.nombre}</div>
                <div style={{ fontSize: 14, color: t.text3 }}>{s.email} - Nv.{s.nivelActual}</div>
              </div>
              <div style={{ fontSize: 16, fontWeight: 800, color, flexShrink: 0 }}>{s.pct}%</div>
            </button>
          );
        })}
        {sorted.length === 0 && <div style={{ textAlign: 'center', color: t.text3, fontSize: 13, padding: 20 }}>Sin resultados</div>}
      </div>
    </div>
  );
}

function ProgressModule({ student, students, setSelectedStudent, t, token }) {
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token || !student?.id) { setDetail(null); return; }
    setLoading(true);
    teacherService.getStudentProgress(token, student.id)
      .then(setDetail)
      .catch(() => setDetail(null))
      .finally(() => setLoading(false));
  }, [token, student?.id]);

  if (!student) {
    return (
      <div>
        <h2 style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 4 }}>Progreso individual</h2>
        <p style={{ fontSize: 13, color: t.text3, marginBottom: 16 }}>Selecciona un estudiante para ver su progreso por nivel</p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {students.filter(s => s.id !== student?.id).slice(0, 10).map((s, i) => (
            <button key={i} onClick={() => setSelectedStudent(s)}
              style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 10, border: `1px solid ${t.cardBorder}`, background: t.cardBg, cursor: 'pointer', textAlign: 'left', width: '100%', transition: 'all 0.12s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = t.primary}
              onMouseLeave={e => e.currentTarget.style.borderColor = t.cardBorder}>
              <div style={{ width: 34, height: 34, borderRadius: '50%', background: `${s.riesgo ? '#E53935' : '#2E7D32'}18`, color: s.riesgo ? '#E53935' : '#2E7D32', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>{s.nombre?.[0]}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: t.text }}>{s.nombre}</div>
                <div style={{ fontSize: 14, color: t.text3 }}>Nv.{s.nivelActual} - {s.pct}% global</div>
              </div>
              <span style={{ fontSize: 13, fontWeight: 700, color: s.riesgo ? '#E53935' : '#2E7D32' }}>{s.pct}%</span>
              <span style={{ fontSize: 16, color: t.text3, marginLeft: 4 }}>&rsaquo;</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const isRiesgo = student.riesgo;
  const accent = isRiesgo ? '#E53935' : '#1565C0';

  if (loading) return <div style={{ padding: 40, textAlign: 'center', color: t.text3 }}>Cargando detalle...</div>;

  const pctGlobal = detail?.niveles?.length
    ? Math.round(detail.niveles.reduce((s, n) => s + n.porcentaje, 0) / detail.niveles.length)
    : student.pct || 0;

  return (
    <div>
      {/* Header with back */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
        <button onClick={() => { setSelectedStudent(null); setDetail(null); }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: t.text3, fontSize: 22, padding: '0 4px', lineHeight: 1 }}>&larr;</button>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: `${accent}18`, color: accent, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 16, flexShrink: 0 }}>
          {detail?.nombre?.[0] || student.nombre?.[0] || '?'}
        </div>
        <div>
          <h2 style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 1 }}>{detail?.nombre || student.nombre}</h2>
          <p style={{ fontSize: 15, color: t.text3 }}>{detail?.email || student.email}</p>
        </div>
        {isRiesgo && (
          <div style={{ marginLeft: 'auto', background: '#FFEBEE', color: '#E53935', fontSize: 14, fontWeight: 700, borderRadius: 20, padding: '3px 12px' }}>
            En riesgo
          </div>
        )}
      </div>

      {/* Stats row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: 8, marginBottom: 20 }}>
        {[
          { label: 'Puntos', val: detail?.puntos ?? student.puntos ?? 0, color: '#F57F17' },
          { label: 'Racha', val: `${detail?.racha ?? student.racha ?? 0}d`, color: '#1565C0' },
          { label: 'Nivel act.', val: detail?.nivelActual ?? student.nivelActual ?? 1, color: '#2E7D32' },
          { label: 'Global', val: `${pctGlobal}%`, color: accent },
        ].map((s, i) => (
          <div key={i} style={{ background: t.cardBg, borderRadius: 10, padding: '12px 14px', border: `1px solid ${t.cardBorder}`, textAlign: 'center' }}>
            <div style={{ fontSize: 22, fontWeight: 800, color: s.color }}>{s.val}</div>
            <div style={{ fontSize: 13, color: t.text3, fontWeight: 600, marginTop: 1 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Per-level detail */}
      <h3 style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 10 }}>Niveles</h3>
      <div style={{ display: 'grid', gap: 8, marginBottom: 24 }}>
        {Array.from({ length: 7 }).map((_, i) => {
          const lv = LEVEL_CONFIG[i];
          const prog = detail?.niveles?.find(p => p.nivelId === i + 1);
          const pct = prog?.porcentaje;
          const done = prog?.completado;
          const lvColor = lv?.color || '#666';

          return (
            <div key={i} style={{ background: t.cardBg, borderRadius: 10, padding: '14px 16px', border: `1px solid ${t.cardBorder}` }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 7, background: `${lvColor}18`, color: lvColor, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15, flexShrink: 0 }}>{i + 1}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: t.text }}>{lv?.title || `Nivel ${i + 1}`}</div>
                  <div style={{ fontSize: 13, color: t.text3 }}>{lv?.subtitle || ''}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 15, fontWeight: 800, color: pct !== undefined ? (done ? '#2E7D32' : '#F57F17') : '#BBB' }}>
                    {pct !== undefined ? `${Math.round(pct)}%` : '-'}
                  </div>
                  {pct !== undefined && (
                    <div style={{ fontSize: 15, color: t.text3 }}>{prog.intentos} intentos / {prog.errores} err</div>
                  )}
                </div>
              </div>
              {pct !== undefined && (
                <ProgressBar value={Math.round(pct)} color={done ? '#2E7D32' : '#F57F17'} bgColor={t.progressBg || '#F0F0F0'} height={5} />
              )}
            </div>
          );
        })}
      </div>

      {/* Recent results */}
      {detail?.ultimosResultados?.length > 0 && (
        <div>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: t.text, marginBottom: 10 }}>Ultimos resultados</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {detail.ultimosResultados.map((r, i) => (
              <div key={r.id || i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, background: t.cardBg, border: `1px solid ${t.cardBorder}` }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', flexShrink: 0, background: r.correcto ? '#E8F5E9' : '#FFEBEE', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700, color: r.correcto ? '#2E7D32' : '#E53935' }}>
                  {r.correcto ? 'V' : 'X'}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: t.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{r.enunciado}</div>
                </div>
                <span style={{ fontSize: 13, color: t.text3, flexShrink: 0 }}>
                  {r.timestamp ? new Date(r.timestamp).toLocaleDateString() : ''}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {(!detail?.ultimosResultados || detail.ultimosResultados.length === 0) && (
        <div style={{ textAlign: 'center', padding: 20, color: t.text3, fontSize: 15 }}>Sin resultados recientes</div>
      )}
    </div>
  );
}

function AssignModule({ students, t, token }) {
  const [selStudent, setSelStudent] = useState('');
  const [selLevel, setSelLevel] = useState(0);
  const [selectedExs, setSelectedExs] = useState([]);
  const [msg, setMsg] = useState('');
  const [levelExs, setLevelExs] = useState([]);
  const [loadingExs, setLoadingExs] = useState(false);

  useEffect(() => {
    if (!token) return;
    setLoadingExs(true);
    exerciseService.getByNivel(token, selLevel + 1)
      .then(data => setLevelExs(Array.isArray(data) ? data : []))
      .catch(() => setLevelExs([]))
      .finally(() => setLoadingExs(false));
  }, [token, selLevel]);

  const toggleEx = (id) => {
    setSelectedExs(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const handleAssign = async () => {
    if (!selStudent || selectedExs.length === 0) { setMsg('Selecciona estudiante y al menos un ejercicio'); return; }
    setMsg(`${selectedExs.length} ejercicio(s) asignados a ${students.find(s => s.id === Number(selStudent))?.nombre}`);
    setSelectedExs([]);
  };

  return (
    <div>
      <h2 style={{ fontSize: 18, fontWeight: 800, color: t.text, marginBottom: 4 }}>Asignar ejercicios</h2>
      <p style={{ fontSize: 13, color: t.text3, marginBottom: 16 }}>Selecciona estudiante, nivel y ejercicios especificos</p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <select value={selStudent} onChange={e => setSelStudent(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${t.cardBorder}`, background: t.cardBg, color: t.text, fontSize: 13, outline: 'none' }}>
          <option value="">-- Seleccionar estudiante --</option>
          {students.map(s => <option key={s.id} value={s.id}>{s.nombre} ({s.email})</option>)}
        </select>

        <select value={selLevel} onChange={e => setSelLevel(Number(e.target.value))}
          style={{ padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${t.cardBorder}`, background: t.cardBg, color: t.text, fontSize: 13, outline: 'none' }}>
          {Array.from({ length: 7 }).map((_, i) => {
            const lv = LEVEL_CONFIG[i];
            return <option key={i} value={i}>{lv?.title || `Nivel ${i}`}</option>;
          })}
        </select>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 300, overflowY: 'auto', padding: '4px 0' }}>
          {loadingExs ? (
            <div style={{ textAlign: 'center', padding: 20, color: t.text3, fontSize: 13 }}>Cargando ejercicios...</div>
          ) : levelExs.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 20, color: t.text3, fontSize: 13 }}>No hay ejercicios en este nivel</div>
          ) : levelExs.map((ex, i) => {
            const sel = selectedExs.includes(ex.id);
            return (
              <label key={ex.id || i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 14px', borderRadius: 10, border: `1.5px solid ${sel ? t.primary : t.cardBorder}`, background: sel ? `${t.primary}0A` : t.cardBg, cursor: 'pointer' }}>
                <input type="checkbox" checked={sel} onChange={() => toggleEx(ex.id)} style={{ accentColor: t.primary }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: t.text }}>{ex.enunciado}</div>
                  {ex.formula && <div style={{ fontSize: 15, fontFamily: 'Georgia,serif', color: t.text3, marginTop: 2 }}><FormulaInline math={ex.formula} /></div>}
                </div>
              </label>
            );
          })}
        </div>

        <button onClick={handleAssign}
          style={{ width: '100%', padding: '12px', borderRadius: 10, background: '#1565C0', color: '#fff', border: 'none', fontSize: 14, fontWeight: 700, cursor: 'pointer' }}>
          Asignar a estudiante
        </button>

        {msg && <div style={{ textAlign: 'center', fontSize: 13, fontWeight: 600, color: '#2E7D32', padding: 8 }}>{msg}</div>}
      </div>
    </div>
  );
}

function StatsModule({ students, stats }) {
  return <ProgressStatsModule stats={stats} students={students} />;
}
