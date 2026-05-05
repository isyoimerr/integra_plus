import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { exerciseService } from '../services/exercise.service';
import SigmaBubble from '../components/sigma/SigmaBubble';

const LEVEL_COLORS = { 0: '#2E7D32', 1: '#1565C0', 2: '#7E57C2' };
const OPT_IDS = ['A', 'B', 'C'];

function Label({ text, required }) {
  return (
    <div style={{ fontSize: 11, fontWeight: 700, color: '#555', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
      {text} {required && <span style={{ color: '#E53935' }}>*</span>}
    </div>
  );
}

export default function ExerciseEditorScreen() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { token } = useAuth();
  const ex = location.state?.exercise || {};

  const [levelId,  setLevelId]  = useState(ex.levelId ?? 0);
  const [q,        setQ]        = useState(ex.q || '');
  const [formula,  setFormula]  = useState(ex.formula || '');
  const [opts,     setOpts]     = useState(ex.opts || ['', '', '']);
  const [correct,  setCorrect]  = useState(ex.correct || 'A');
  const [hint,     setHint]     = useState(ex.hint || '');
  const [explain,  setExplain]  = useState(ex.explain || '');
  const [xp,       setXp]       = useState(ex.xp || 15);
  const [saved,    setSaved]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [errors,   setErrors]   = useState({});
  const isNew = ex.isNew !== false;

  const color = LEVEL_COLORS[levelId] || '#2E7D32';

  const validate = () => {
    const e = {};
    if (!q.trim())       e.q       = 'Requerido';
    if (!formula.trim()) e.formula = 'Requerido';
    if (!hint.trim())    e.hint    = 'Requerido';
    if (!explain.trim()) e.explain = 'Requerido';
    opts.forEach((o, i) => { if (!o.trim()) e[`opt${i}`] = 'Requerido'; });
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setSaving(true);
    try {
      const data = { nivelId: levelId + 1, enunciado: q, formula, opciones: opts, respuesta: opts[OPT_IDS.indexOf(correct)], hint, explicacion: explain, xpRecompensa: xp, ordenEn: (ex.exIdx ?? 0) + 1 };
      if (token) {
        isNew ? await exerciseService.create(token, data) : await exerciseService.update(token, ex.id, data);
      }
      setSaved(true);
      setTimeout(() => navigate('/admin'), 900);
    } catch { setSaving(false); }
  };

  const fieldStyle = (err) => ({
    width: '100%', padding: '11px 13px', borderRadius: 11, fontFamily: 'Inter,sans-serif',
    fontSize: 13, outline: 'none', background: '#fff', color: '#1A1A1A',
    border: `1.5px solid ${err ? '#E53935' : '#E0E0E0'}`, transition: 'border-color 0.2s', resize: 'vertical',
  });

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', background: '#F5F5F5', overflow: 'hidden' }}>
      {/* Header */}
      <div style={{ background: `linear-gradient(150deg,${color}CC 0%,${color} 100%)`, padding: '18px 20px 20px', flexShrink: 0, boxShadow: '0 4px 20px rgba(0,0,0,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button onClick={() => navigate('/admin')} style={{ background: 'rgba(255,255,255,0.16)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 18, flexShrink: 0 }}>←</button>
          <div>
            <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Panel</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{isNew ? 'Nuevo ejercicio' : 'Editar ejercicio'}</div>
          </div>
          {saved && (
            <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 12px', fontSize: 12, color: '#fff', fontWeight: 600 }}>✓ Guardado</div>
          )}
        </div>
      </div>

      {/* Form */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px' }}>

        {/* Nivel */}
        <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', marginBottom: 12, border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <Label text="Nivel" required />
          <select value={levelId} onChange={e => setLevelId(Number(e.target.value))}
            style={{ ...fieldStyle(false), appearance: 'none', cursor: 'pointer' }}>
            <option value={0}>Nivel 0 — Repaso de Bases</option>
            <option value={1}>Nivel 1 — Integral Indefinida</option>
            <option value={2}>Nivel 2 — Integral Definida</option>
          </select>
        </div>

        {/* Enunciado + Fórmula */}
        <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', marginBottom: 12, border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: 13 }}>
            <Label text="Enunciado de la pregunta" required />
            <textarea rows={3} value={q} onChange={e => setQ(e.target.value)} placeholder="Ej: ¿Cuánto es 2/3 + 1/4?"
              style={fieldStyle(errors.q)}
              onFocus={e => e.target.style.borderColor = color}
              onBlur={e => e.target.style.borderColor = errors.q ? '#E53935' : '#E0E0E0'} />
            {errors.q && <div style={{ fontSize: 11, color: '#E53935', marginTop: 3 }}>{errors.q}</div>}
          </div>

          <Label text="Fórmula" required />
          <input value={formula} onChange={e => setFormula(e.target.value)} placeholder="Ej: 2/3 + 1/4 = ?"
            style={{ ...fieldStyle(errors.formula), fontFamily: 'Georgia,serif', fontSize: 15 }}
            onFocus={e => e.target.style.borderColor = color}
            onBlur={e => e.target.style.borderColor = errors.formula ? '#E53935' : '#E0E0E0'} />
          {formula && (
            <div style={{ marginTop: 8, background: `${color}10`, borderRadius: 9, padding: '10px', textAlign: 'center', border: `1px solid ${color}20` }}>
              <span style={{ fontSize: 18, fontFamily: 'Georgia,serif', color, fontWeight: 600 }}>{formula}</span>
            </div>
          )}
          {errors.formula && <div style={{ fontSize: 11, color: '#E53935', marginTop: 3 }}>{errors.formula}</div>}
        </div>

        {/* Opciones */}
        <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', marginBottom: 12, border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <Label text="Opciones de respuesta" required />
          <div style={{ fontSize: 11, color: '#AAA', marginBottom: 10 }}>Marca el ● junto a la opción correcta</div>
          {OPT_IDS.map((id, i) => (
            <div key={id} style={{ marginBottom: 10 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <button onClick={() => setCorrect(id)}
                  style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, border: `2px solid ${correct === id ? color : '#DDD'}`, background: correct === id ? color : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s', outline: 'none' }}>
                  {correct === id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }} />}
                </button>
                <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 12 }}>{id}</div>
                <input value={opts[i]} onChange={e => { const n = [...opts]; n[i] = e.target.value; setOpts(n); }}
                  placeholder={`Opción ${id}`}
                  style={{ ...fieldStyle(errors[`opt${i}`]), flex: 1, fontFamily: 'Georgia,serif', fontSize: 15 }}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = errors[`opt${i}`] ? '#E53935' : '#E0E0E0'} />
              </div>
              {correct === id && <div style={{ fontSize: 11, color, fontWeight: 600, marginTop: 3, marginLeft: 68 }}>✓ Marcada como correcta</div>}
              {errors[`opt${i}`] && <div style={{ fontSize: 11, color: '#E53935', marginTop: 3, marginLeft: 68 }}>{errors[`opt${i}`]}</div>}
            </div>
          ))}
        </div>

        {/* Pista + Explicación */}
        <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', marginBottom: 12, border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ marginBottom: 13 }}>
            <Label text="Pista pedagógica (SIGMA)" required />
            <textarea rows={2} value={hint} onChange={e => setHint(e.target.value)} placeholder="Ej: ¿Cuál es el MCM de 3 y 4?"
              style={fieldStyle(errors.hint)}
              onFocus={e => e.target.style.borderColor = color}
              onBlur={e => e.target.style.borderColor = errors.hint ? '#E53935' : '#E0E0E0'} />
            {errors.hint && <div style={{ fontSize: 11, color: '#E53935', marginTop: 3 }}>{errors.hint}</div>}
          </div>
          <Label text="Explicación completa" required />
          <textarea rows={3} value={explain} onChange={e => setExplain(e.target.value)} placeholder="Ej: MCM(3,4)=12 → 8/12 + 3/12 = 11/12"
            style={fieldStyle(errors.explain)}
            onFocus={e => e.target.style.borderColor = color}
            onBlur={e => e.target.style.borderColor = errors.explain ? '#E53935' : '#E0E0E0'} />
          {errors.explain && <div style={{ fontSize: 11, color: '#E53935', marginTop: 3 }}>{errors.explain}</div>}
        </div>

        {/* XP */}
        <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', marginBottom: 12, border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <Label text="XP por resolver correctamente" />
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <input type="number" min="5" max="50" step="5" value={xp} onChange={e => setXp(Number(e.target.value))}
              style={{ ...fieldStyle(false), width: 90, textAlign: 'center', fontSize: 18, fontWeight: 700, color }}
              onFocus={e => e.target.style.borderColor = color}
              onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
            <span style={{ fontSize: 13, color: '#888' }}>XP por ejercicio correcto ⚡</span>
          </div>
        </div>

        {/* Preview SIGMA */}
        {hint && (
          <div style={{ marginBottom: 16 }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#888', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.4px' }}>Preview — SIGMA Pista</div>
            <SigmaBubble state="apoyo">{hint}</SigmaBubble>
          </div>
        )}

        {/* Botones */}
        <div style={{ display: 'flex', gap: 10, paddingBottom: 8 }}>
          <button onClick={handleSave} disabled={saving || saved}
            style={{ flex: 1, padding: '15px', borderRadius: 13, background: saved ? 'linear-gradient(135deg,#2E7D32,#43A047)' : `linear-gradient(135deg,${color}CC,${color})`, color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 20px ${color}44`, transition: 'all 0.2s', letterSpacing: '-0.2px', opacity: saving ? 0.8 : 1 }}>
            {saved ? '✓ Guardado' : saving ? 'Guardando…' : isNew ? 'Guardar ejercicio' : 'Actualizar ejercicio'}
          </button>
          <button onClick={() => navigate('/admin')}
            style={{ padding: '15px 18px', borderRadius: 13, background: 'transparent', border: '1.5px solid #E0E0E0', color: '#666', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
