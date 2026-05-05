import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LEVEL_CONFIG } from '../data/levelConfig';
import SigmaBubble from '../components/sigma/SigmaBubble';
import SigmaLogo from '../components/sigma/SigmaLogo';
import ProgressBar from '../components/ui/ProgressBar';

const LEVEL_COLORS = { 0: '#2E7D32', 1: '#1565C0', 2: '#7E57C2' };
const LEVEL_NAMES  = { 0: 'Nivel 0 — Repaso de Bases', 1: 'Nivel 1 — Integral Indefinida', 2: 'Nivel 2 — Integral Definida' };
const TABS = [{ id: 'ejercicios', label: 'Ejercicios' }, { id: 'niveles', label: 'Niveles' }, { id: 'estudiantes', label: 'Estudiantes' }];

const STUDENTS = [
  { nombre: 'Valentina M.', pct: 78, color: '#2E7D32', level: 'Nv.2', last: 'Hoy',    status: 'ok' },
  { nombre: 'Carlos R.',    pct: 55, color: '#1565C0', level: 'Nv.1', last: 'Ayer',   status: 'ok' },
  { nombre: 'Andrés P.',    pct: 22, color: '#E53935', level: 'Nv.0', last: '48h',    status: 'risk', note: '8 errores consecutivos' },
  { nombre: 'María L.',     pct: 64, color: '#F57F17', level: 'Nv.1', last: '2 días', status: 'warn' },
  { nombre: 'Juan S.',      pct: 31, color: '#E53935', level: 'Nv.0', last: '72h',    status: 'risk', note: 'Inactivo 72h' },
];

export default function AdminPanelScreen() {
  const navigate = useNavigate();
  const [activeTab,      setActiveTab]      = useState('ejercicios');
  const [expandedLevel,  setExpandedLevel]  = useState(0);
  const [exercises,      setExercises]      = useState(() => {
    const all = {};
    Object.keys(LEVEL_CONFIG).forEach(k => { all[k] = LEVEL_CONFIG[k].exercises.map(ex => ({ ...ex, levelId: Number(k) })); });
    return all;
  });

  const handleDelete = (lid, idx) => setExercises(prev => { const u = { ...prev }; u[lid] = u[lid].filter((_, i) => i !== idx); return u; });
  const handleEdit   = (lid, idx) => navigate('/exercise-editor', { state: { exercise: { ...exercises[lid][idx], levelId: lid, exIdx: idx, isNew: false } } });
  const handleAdd    = (lid)      => navigate('/exercise-editor', { state: { exercise: { isNew: true, levelId: lid, q: '', formula: '', opts: ['', '', ''], correct: 'A', hint: '', explain: '', xp: 15 } } });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F5F5F5', overflow: 'hidden' }}>
      <div style={{ background: 'linear-gradient(150deg,#0D47A1 0%,#1565C0 100%)', padding: '18px 20px 0', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
          <button onClick={() => navigate('/teacher')} style={{ background: 'rgba(255,255,255,0.16)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 18, flexShrink: 0 }}>←</button>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Panel Docente</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: '#fff' }}>Administración</div>
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
                        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.75)' }}>{exList.length} ejercicios</div>
                      </div>
                    </div>
                    <span style={{ fontSize: 18, color: 'rgba(255,255,255,0.8)', transform: isOpen ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }}>›</span>
                  </button>
                  {isOpen && (
                    <div style={{ background: '#fff', borderRadius: '0 0 13px 13px', border: `1px solid ${color}33`, borderTop: 'none', boxShadow: `0 6px 18px ${color}18` }}>
                      {exList.map((ex, idx) => (
                        <div key={idx} style={{ padding: '12px 16px', borderBottom: idx < exList.length - 1 ? '1px solid #F0F0F0' : 'none' }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 6 }}>
                            <div style={{ width: 22, height: 22, borderRadius: 6, flexShrink: 0, background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, fontWeight: 700 }}>{idx + 1}</div>
                            <div style={{ flex: 1 }}>
                              <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', lineHeight: 1.4 }}>{ex.q?.length > 48 ? ex.q.substring(0, 48) + '…' : ex.q}</div>
                              <div style={{ fontSize: 11, color: '#888', fontFamily: 'Georgia,serif' }}>{ex.opts?.join(' · ')}</div>
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                            <button onClick={() => handleEdit(lid, idx)} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: `${color}15`, color, border: `1px solid ${color}33`, cursor: 'pointer' }}>✏️ Editar</button>
                            <button onClick={() => handleDelete(lid, idx)} style={{ padding: '5px 12px', borderRadius: 8, fontSize: 11, fontWeight: 600, background: '#FFEBEE', color: '#C62828', border: '1px solid #FFCDD2', cursor: 'pointer' }}>🗑 Eliminar</button>
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
                <div key={k} style={{ background: '#fff', borderRadius: 13, padding: '15px 17px', marginBottom: 10, border: `1px solid ${color}22`, boxShadow: '0 2px 10px rgba(0,0,0,0.05)' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 8 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 11, background: `linear-gradient(135deg,${color},${color}bb)`, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: 15, flexShrink: 0 }}>{k}</div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A' }}>{lv.subtitle}</div>
                      <div style={{ fontSize: 11, color: '#888' }}>{lv.exercises.length} ej · {lv.xpTotal} XP · {lv.faseA.concepts.length} conceptos</div>
                    </div>
                    <span style={{ marginLeft: 'auto', fontSize: 10, fontWeight: 700, background: `${color}15`, color, borderRadius: 20, padding: '3px 10px' }}>Activo</span>
                  </div>
                  <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6, borderTop: '1px solid #F4F4F4', paddingTop: 8 }}>{lv.faseA.desc?.substring(0, 90)}…</div>
                </div>
              );
            })}
            <div style={{ background: '#F8F8F8', borderRadius: 13, padding: '15px 17px', border: '1.5px dashed #DDDDDD', textAlign: 'center', color: '#AAAAAA', fontSize: 13 }}>🔒 Niveles 3–7 próximamente</div>
          </div>
        )}

        {/* ESTUDIANTES */}
        {activeTab === 'estudiantes' && (
          <div>
            <SigmaBubble state="alerta">3 estudiantes en riesgo esta semana. Revisa su progreso y envía apoyo.</SigmaBubble>
            {STUDENTS.map((s, i) => (
              <div key={i} style={{ background: '#fff', borderRadius: 13, padding: '13px 15px', border: `1.5px solid ${s.status === 'risk' ? '#FFCC02' : s.status === 'warn' ? '#FFE0B2' : '#E8E8E8'}`, marginBottom: 9, boxShadow: '0 2px 10px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 7 }}>
                  <div style={{ width: 34, height: 34, borderRadius: '50%', flexShrink: 0, background: `${s.color}18`, color: s.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14 }}>{s.nombre[0]}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{s.nombre} {s.status === 'risk' ? '⚠️' : s.status === 'warn' ? '🟡' : ''}</div>
                    {s.note && <div style={{ fontSize: 11, color: '#F57F17', marginTop: 1 }}>{s.note}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: 15, fontWeight: 800, color: s.color }}>{s.pct}%</div>
                    <div style={{ fontSize: 10, color: '#AAA' }}>{s.level} · {s.last}</div>
                  </div>
                </div>
                <ProgressBar value={s.pct} color={s.color} bgColor="#F0F0F0" height={5} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
