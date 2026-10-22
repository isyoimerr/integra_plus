import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { LEVEL_CONFIG } from '../data/levelConfig';
import { teacherService } from '../services/teacher.service';
import SigmaBubble from '../components/sigma/SigmaBubble';
import SigmaLogo from '../components/sigma/SigmaLogo';
import ProgressBar from '../components/ui/ProgressBar';
import { FormulaBlock, FormulaInline } from '../components/ui/Formula';

const LEVEL_COLORS = Object.fromEntries(Object.entries(LEVEL_CONFIG).map(([k, v]) => [Number(k), v.color]));
const LEVEL_NAMES  = Object.fromEntries(Object.entries(LEVEL_CONFIG).map(([k, v]) => [Number(k), `${v.title} — ${v.subtitle}`]));
const TABS = [
  { id: 'ejercicios', label: 'Ejercicios' },
  { id: 'niveles', label: 'Niveles' },
  { id: 'estudiantes', label: 'Estudiantes' },
];

export default function AdminPanelScreen({ embedded }) {
  const navigate = useNavigate();
  const { token } = useAuth();
  const { t } = useTheme();
  const [activeTab,      setActiveTab]      = useState('ejercicios');
  const [expandedLevel,  setExpandedLevel]  = useState(0);
  const [students,       setStudents]       = useState([]);
  const [loadingStudents,setLoadingStudents] = useState(false);
  const [exercises,      setExercises]      = useState(() => {
    const all = {};
    Object.keys(LEVEL_CONFIG).forEach(k => { all[k] = LEVEL_CONFIG[k].exercises.map(ex => ({ ...ex, levelId: Number(k) })); });
    return all;
  });

  useEffect(() => {
    if (!token) return;
    setLoadingStudents(true);
    teacherService.getStudents(token)
      .then(setStudents)
      .catch(() => {})
      .finally(() => setLoadingStudents(false));
  }, [token]);

  const handleDelete = (lid, idx) => setExercises(prev => { const u = { ...prev }; u[lid] = u[lid].filter((_, i) => i !== idx); return u; });
  const handleEdit   = (lid, idx) => {
    const ex = exercises[lid][idx];
    const opts = ex.opts?.length === 4 ? ex.opts : ex.opts?.length === 3 ? [...ex.opts, ''] : ['', '', '', ''];
    const correct = ex.correct || (ex.opts?.length === 4 ? 'A' : 'A');
    navigate('/exercise-editor', {
      state: {
        exercise: {
          levelId: lid, exIdx: idx, isNew: true,
          q: ex.q || '', formula: ex.formula || '', opts,
          correct, hint: ex.hint || '', explain: ex.explain || '', xp: ex.xp || 15,
        },
      },
    });
  };
  const handleAdd    = (lid)      => navigate('/exercise-editor', { state: { exercise: { isNew: true, levelId: lid, q: '', formula: '', opts: ['', '', '', ''], correct: 'A', hint: '', explain: '', xp: 15 } } });

  const header = embedded ? (
    <div style={{ padding: '0 0 14px' }}>
      <div style={{ display: 'flex', gap: 4, borderBottom: `1.5px solid ${t.cardBorder}` }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ padding: '10px 16px', border: 'none', cursor: 'pointer', background: 'transparent', color: activeTab === tab.id ? t.text : t.text3, fontSize: 13, fontWeight: activeTab === tab.id ? 700 : 500, borderBottom: activeTab === tab.id ? `2.5px solid #1565C0` : '2.5px solid transparent', transition: 'all 0.15s' }}>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  ) : (
    <div style={{ background: 'linear-gradient(150deg,#0D47A1 0%,#1565C0 100%)', padding: '18px 20px 0', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
        <button onClick={() => navigate('/teacher')} style={{ background: 'rgba(255,255,255,0.16)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 18, flexShrink: 0 }}>&larr;</button>
        <div>
          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Panel Docente</div>
          <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Administracion</div>
        </div>
        <div style={{ marginLeft: 'auto' }}><SigmaLogo state="neutral" size={32} /></div>
      </div>
      <div style={{ display: 'flex' }}>
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            style={{ flex: 1, padding: '10px 0', border: 'none', cursor: 'pointer', background: 'transparent', color: '#fff', fontSize: 13, fontWeight: 600, borderBottom: activeTab === tab.id ? '3px solid #fff' : '3px solid transparent', opacity: activeTab === tab.id ? 1 : 0.6, transition: 'all 0.18s' }}>
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: embedded ? 'transparent' : '#F5F5F5', overflow: 'hidden' }}>
      {header}

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>
        {/* EJERCICIOS */}
        {activeTab === 'ejercicios' && (
          <div>
            <SigmaBubble state="neutral">Aquí puedes agregar, editar o eliminar ejercicios por nivel.</SigmaBubble>
            {Object.keys(exercises).map(lvId => {
              const lid = Number(lvId);
              const color = LEVEL_COLORS[lid] || '#2E7D32';
              const isOpen = expandedLevel === lid;
              const exList = exercises[lid] || [];
              return (
                <div key={lid} style={{ marginBottom: 12 }}>
                  <button onClick={() => setExpandedLevel(isOpen ? -1 : lid)}
                    style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '13px 16px', borderRadius: isOpen ? '13px 13px 0 0' : 13, background: color, border: 'none', cursor: 'pointer', outline: 'none', boxShadow: `0 3px 12px ${color}44` }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700, color: '#fff', flexShrink: 0 }}>{lid}</div>
                      <div style={{ textAlign: 'left' }}>
                        <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>{LEVEL_NAMES[lid]}</div>
                        <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)' }}>{exList.length} ejercicios</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
                  </button>
                  {isOpen && (
                    <div style={{ background: embedded ? t.cardBg : '#fff', borderRadius: '0 0 13px 13px', border: `1px solid ${color}33`, borderTop: 'none', boxShadow: `0 6px 18px ${color}18` }}>
                      {exList.map((ex, idx) => (
                        <div key={idx} style={{ padding: '14px 16px', borderBottom: idx < exList.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 8 }}>
                            <div style={{ width: 24, height: 24, borderRadius: 6, flexShrink: 0, background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>{idx + 1}</div>
                            <div style={{ flex: 1 }}>
                              {ex.formula && (
                                <div style={{ marginBottom: 6 }}><FormulaBlock math={ex.formula} color={color} bgColor={`${color}06`} borderColor={`${color}20`} /></div>
                              )}
                              <div style={{ fontSize: 13, fontWeight: 600, color: embedded ? t.text : '#1A1A1A', lineHeight: 1.4 }}>{ex.q}</div>
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 6 }}>
                                {(ex.opts || []).map((opt, oi) => (
                                  <span key={oi} style={{ fontSize: 13, background: `${color}0A`, color: t.text2, borderRadius: 6, padding: '3px 10px', fontFamily: 'Georgia,serif' }}>
                                    <FormulaInline math={opt} />
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button onClick={() => handleEdit(lid, idx)} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 14, fontWeight: 600, background: `${color}15`, color, border: `1px solid ${color}33`, cursor: 'pointer' }}>Editar</button>
                            <button onClick={() => handleDelete(lid, idx)} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 14, fontWeight: 600, background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', cursor: 'pointer' }}>Eliminar</button>
                          </div>
                        </div>
                      ))}
                      <div style={{ padding: '12px 16px' }}>
                        <button onClick={() => handleAdd(lid)}
                          style={{ width: '100%', padding: '11px', borderRadius: 10, background: `${color}10`, border: `1.5px dashed ${color}55`, color, fontSize: 13, fontWeight: 700, cursor: 'pointer', transition: 'all 0.18s' }}>
                          + Agregar ejercicio
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* NIVELES */}
        {activeTab === 'niveles' && (
          <div>
            <SigmaBubble state="neutral">Vista general de los niveles activos.</SigmaBubble>
            {Object.keys(LEVEL_CONFIG).map(k => {
              const lv = LEVEL_CONFIG[k];
              const color = LEVEL_COLORS[Number(k)] || '#2E7D32';
              return (
                <div key={k} style={{ background: embedded ? t.cardBg : '#fff', borderRadius: 13, padding: '15px 17px', marginBottom: 10, border: `1px solid ${color}22`, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg,${color},${color}bb)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{k}</div>
                    <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: embedded ? t.text : '#1A1A1A' }}>{lv.subtitle}</div>
                    <div style={{ fontSize: 14, color: t.text3 }}>{lv.exercises.length} ej · {lv.xpTotal} XP · {lv.faseA.concepts.length} conceptos</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 13, fontWeight: 700, background: `${color}15`, color, borderRadius: 20, padding: '3px 10px' }}>Activo</span>
                  </div>
                  <div style={{ fontSize: 15, color: t.text3, lineHeight: 1.6, borderTop: '1px solid #F4F4F4', paddingTop: 8 }}>{lv.faseA.desc?.substring(0, 90)}...</div>
                </div>
              );
            })}

          </div>
        )}

        {/* ESTUDIANTES */}
        {activeTab === 'estudiantes' && (
          <div>
            <SigmaBubble state="alerta">{students.filter(s => s.riesgo).length} estudiantes en riesgo esta semana. Revisa su progreso y envía apoyo.</SigmaBubble>
            {loadingStudents ? (
              <div style={{ textAlign: 'center', padding: 30, color: '#777', fontSize: 13 }}>Cargando estudiantes…</div>
            ) : students.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 30, color: '#777', fontSize: 13 }}>No hay estudiantes registrados</div>
            ) : students.map((s, i) => {
              const color = s.riesgo ? '#E53935' : s.pct < 60 ? '#F57F17' : '#2E7D32';
              return (
                <div key={i} style={{ background: embedded ? t.cardBg : '#fff', borderRadius: 13, padding: '13px 15px', border: `1.5px solid ${s.riesgo ? '#FFCC02' : '#E8E8E8'}`, marginBottom: 9, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                    <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{s.nombre[0]}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: embedded ? t.text : '#1A1A1A' }}>{s.nombre}</div>
                      {s.nota && <div style={{ fontSize: 14, color: '#F57F17', marginTop: 1 }}>{s.nota}</div>}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: 15, fontWeight: 800, color }}>{s.pct}%</div>
                      <div style={{ fontSize: 13, color: t.text3 }}>Nv.{s.nivelActual} · {s.ultimoAcc}</div>
                    </div>
                  </div>
                  <ProgressBar value={s.pct} color={color} bgColor="#F0F0F0" height={5} />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
