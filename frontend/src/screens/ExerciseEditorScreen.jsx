import { useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { exerciseService } from '../services/exercise.service';
import { LEVEL_CONFIG } from '../data/levelConfig';
import SigmaBubble from '../components/sigma/SigmaBubble';
import { FormulaBlock, FormulaInline } from '../components/ui/Formula';

const OPT_IDS = ['A', 'B', 'C', 'D'];

function Label({ text, required }) {
  return (
    <div style={{ fontSize: 14, fontWeight: 700, color: '#555', marginBottom: 5, textTransform: 'uppercase', letterSpacing: '0.4px' }}>
      {text} {required && <span style={{ color: '#E53935' }}>*</span>}
    </div>
  );
}

// ── LaTeX Converter ──
const GREEK = { alpha: '\\alpha', beta: '\\beta', gamma: '\\gamma', delta: '\\delta', theta: '\\theta', pi: '\\pi', sigma: '\\sigma', mu: '\\mu', omega: '\\omega' };

function smartConvert(text) {
  let r = text;
  // Greek letters
  Object.entries(GREEK).forEach(([word, latex]) => {
    r = r.replace(new RegExp(`\\\\b${word}\\\\b`, 'gi'), latex);
  });
  r = r.replace(/\bpi\b/gi, '\\pi');
  // Fractions: a/b → \frac{a}{b} (simple cases)
  r = r.replace(/(\d+|\([^)]+\))\s*\/\s*(\d+|\([^)]+\))/g, '\\frac{$1}{$2}');
  // sqrt(x) → \sqrt{x}
  r = r.replace(/sqrt\(([^)]+)\)/g, '\\sqrt{$1}');
  // int → \int, sum → \sum, inf → \infty
  r = r.replace(/\bintegral\b/gi, '\\int');
  r = r.replace(/\bint\b/gi, '\\int');
  r = r.replace(/\bsum\b/gi, '\\sum');
  r = r.replace(/\binf(inity)?\b/gi, '\\infty');
  r = r.replace(/\blim\b/gi, '\\lim');
  // to → \to, -> → \rightarrow, => → \Rightarrow
  r = r.replace(/\bto\b/gi, '\\to');
  r = r.replace(/->/g, '\\rightarrow');
  r = r.replace(/=>/g, '\\Rightarrow');
  // dx → \,dx (differential)
  r = r.replace(/\bdx\b/g, '\\,dx');
  r = r.replace(/\bdy\b/g, '\\,dy');
  r = r.replace(/\bdt\b/g, '\\,dt');
  // sin, cos, tan, ln, log
  ['sin', 'cos', 'tan', 'ln', 'log'].forEach(f => {
    r = r.replace(new RegExp(`\\\\b${f}\\\\b`, 'gi'), `\\\\${f}`);
  });
  return r;
}

const SNIPPETS = [
  { label: 'Frac', latex: '\\frac{}{}' },
  { label: 'Sqrt', latex: '\\sqrt{}' },
  { label: 'Int',  latex: '\\int \\,dx' },
  { label: 'Sum',  latex: '\\sum_{}^{}' },
  { label: 'Lim',  latex: '\\lim_{}' },
  { label: 'Pi',   latex: '\\pi' },
  { label: 'Inf',  latex: '\\infty' },
  { label: 'To',   latex: '\\to' },
];

// ── Component ──
export default function ExerciseEditorScreen() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { token } = useAuth();
  const formulaRef = useRef(null);
  const ex = location.state?.exercise || {};

  const [levelId,  setLevelId]  = useState(ex.levelId ?? 0);
  const [q,        setQ]        = useState(ex.q || '');
  const [formula,  setFormula]  = useState(ex.formula || '');
  const [imageUrl, setImageUrl] = useState(ex.imageUrl || '');
  const [opts,     setOpts]     = useState(
    ex.opts?.length === 4 ? ex.opts : ex.opts?.length === 3 ? [...ex.opts, ''] : ['', '', '', '']
  );
  const [correct,  setCorrect]  = useState(ex.correct || 'A');
  const [hint,     setHint]     = useState(ex.hint || '');
  const [explain,  setExplain]  = useState(ex.explain || '');
  const [xp,       setXp]       = useState(ex.xp || 15);
  const [saved,    setSaved]    = useState(false);
  const [saving,   setSaving]   = useState(false);
  const [errors,   setErrors]   = useState({});
  const [preview,  setPreview]  = useState('nivel');
  const [zoom,     setZoom]     = useState(100);
  const [convOpen, setConvOpen] = useState(false);
  const [convText, setConvText] = useState('');
  const isNew = ex.isNew !== false;

  const color = LEVEL_CONFIG[levelId]?.color || '#2E7D32';
  const levelTitle = LEVEL_CONFIG[levelId]?.title || `Nivel ${levelId}`;

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
      const data = { nivelId: levelId + 1, enunciado: q, formula, imagen: imageUrl, opciones: opts, respuesta: opts[OPT_IDS.indexOf(correct)], hint, explicacion: explain, xpRecompensa: xp, ordenEn: (ex.exIdx ?? 0) + 1 };
      if (token) {
        isNew ? await exerciseService.create(token, data) : await exerciseService.update(token, ex.id, data);
      }
      setSaved(true);
      setTimeout(() => navigate(-1), 900);
    } catch { setSaving(false); }
  };

  const handleConvert = () => {
    const converted = smartConvert(convText);
    setFormula(converted);
    setPreview('formula');
    setConvOpen(false);
    setConvText('');
  };

  const insertSnippet = (latex) => {
    setFormula(prev => prev + ' ' + latex);
    setPreview('formula');
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
          <button onClick={() => navigate(-1)} style={{ background: 'rgba(255,255,255,0.16)', border: 'none', borderRadius: 10, width: 36, height: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: '#fff', fontSize: 18, flexShrink: 0 }}>&larr;</button>
          <div>
            <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.65)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Admin Panel</div>
            <div style={{ fontSize: 17, fontWeight: 700, color: '#fff' }}>{isNew ? 'Nuevo ejercicio' : 'Editar ejercicio'}</div>
          </div>
          {saved && (
            <div style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.2)', borderRadius: 20, padding: '4px 12px', fontSize: 15, color: '#fff', fontWeight: 600 }}>Guardado</div>
          )}
        </div>
      </div>

      <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', gap: 16, flexDirection: 'row', flexWrap: 'wrap' }}>
        {/* ── LEFT: Form ── */}
        <div style={{ flex: '1 1 420px', minWidth: 300 }}>
          {/* Nivel */}
          <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', marginBottom: 12, border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Label text="Nivel" required />
            <select value={levelId} onChange={e => { setLevelId(Number(e.target.value)); setPreview('nivel'); }}
              style={{ ...fieldStyle(false), appearance: 'none', cursor: 'pointer' }}>
              {Array.from({ length: 7 }).map((_, i) => {
                const lv = LEVEL_CONFIG[i];
                return <option key={i} value={i}>Nivel {i} &mdash; {lv?.title || ''}</option>;
              })}
            </select>
          </div>

          {/* Enunciado */}
          <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', marginBottom: 12, border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Label text="Enunciado de la pregunta" required />
            <textarea rows={3} value={q} onChange={e => { setQ(e.target.value); setPreview('formula'); }} placeholder="Ej: Resuelve la siguiente integral:"
              style={fieldStyle(errors.q)}
              onFocus={e => e.target.style.borderColor = color}
              onBlur={e => e.target.style.borderColor = errors.q ? '#E53935' : '#E0E0E0'} />
            {errors.q && <div style={{ fontSize: 14, color: '#E53935', marginTop: 3 }}>{errors.q}</div>}
          </div>

          {/* Formula */}
          <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', marginBottom: 12, border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Label text="Formula (LaTeX)" required />
            <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
              {SNIPPETS.map(s => (
                <button key={s.label} onClick={() => insertSnippet(s.latex)}
                  style={{ padding: '3px 10px', borderRadius: 6, border: `1px solid ${color}44`, background: `${color}08`, color, fontSize: 14, fontWeight: 600, cursor: 'pointer', fontFamily: 'monospace' }}>
                  {s.label}
                </button>
              ))}
            </div>
            <input ref={formulaRef} value={formula} onChange={e => { setFormula(e.target.value); setPreview('formula'); }} placeholder="\\int x^2 \\,dx"
              style={{ ...fieldStyle(errors.formula), fontFamily: 'monospace', fontSize: 13 }}
              onFocus={e => e.target.style.borderColor = color}
              onBlur={e => e.target.style.borderColor = errors.formula ? '#E53935' : '#E0E0E0'} />
            {errors.formula && <div style={{ fontSize: 14, color: '#E53935', marginTop: 3 }}>{errors.formula}</div>}

            {/* Conversor LaTeX */}
            <div style={{ marginTop: 8 }}>
              <button onClick={() => setConvOpen(!convOpen)}
                style={{ background: 'none', border: 'none', color, fontSize: 15, fontWeight: 600, cursor: 'pointer', padding: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                {convOpen ? '[-]' : '[+]'} Conversor automatico LaTeX
              </button>
              {convOpen && (
                <div style={{ marginTop: 8, padding: 10, borderRadius: 8, background: '#F8F9FA', border: '1px solid #E8E8E8' }}>
                  <div style={{ fontSize: 14, color: '#555', marginBottom: 6 }}>Escribe en texto plano y convierte a LaTeX:</div>
                  <textarea rows={3} value={convText} onChange={e => setConvText(e.target.value)}
                    placeholder="Ej: integral de x^2 dx"
                    style={{ width: '100%', padding: '8px 10px', borderRadius: 8, border: '1px solid #DDD', fontSize: 15, fontFamily: 'sans-serif', resize: 'vertical', outline: 'none' }} />
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    <button onClick={handleConvert}
                      style={{ flex: 1, padding: '7px', borderRadius: 8, background: color, color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer' }}>
                      Convertir
                    </button>
                    <button onClick={() => setConvOpen(false)}
                      style={{ padding: '7px 12px', borderRadius: 8, background: 'transparent', border: '1px solid #DDD', color: '#444', fontSize: 15, cursor: 'pointer' }}>
                      Cancelar
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Image URL */}
          <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', marginBottom: 12, border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Label text="URL de imagen (opcional)" />
            <input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://ejemplo.com/grafico.png"
              style={{ ...fieldStyle(false), fontFamily: 'monospace', fontSize: 15 }}
              onFocus={e => e.target.style.borderColor = color}
              onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
            <div style={{ fontSize: 13, color: '#777', marginTop: 4 }}>Usa una URL publica para mostrar un grafico o diagrama</div>
          </div>

          {/* Opciones */}
          <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', marginBottom: 12, border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Label text="Opciones de respuesta" required />
            <div style={{ fontSize: 14, color: '#777', marginBottom: 10 }}>Marca el radio junto a la opcion correcta</div>
            {OPT_IDS.map((id, i) => (
              <div key={id} style={{ marginBottom: 10 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <button onClick={() => { setCorrect(id); setPreview('opciones'); }}
                    style={{ width: 26, height: 26, borderRadius: '50%', flexShrink: 0, border: `2px solid ${correct === id ? color : '#DDD'}`, background: correct === id ? color : '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.18s', outline: 'none' }}>
                    {correct === id && <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#fff' }} />}
                  </button>
                  <div style={{ width: 24, height: 24, borderRadius: 7, flexShrink: 0, background: `${color}18`, color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 15 }}>{id}</div>
                  <input value={opts[i]} onChange={e => { const n = [...opts]; n[i] = e.target.value; setOpts(n); setPreview('opciones'); }}
                    placeholder={`Opcion ${id}`}
                    style={{ ...fieldStyle(errors[`opt${i}`]), flex: 1, fontFamily: 'Georgia,serif', fontSize: 15 }}
                    onFocus={e => e.target.style.borderColor = color}
                    onBlur={e => e.target.style.borderColor = errors[`opt${i}`] ? '#E53935' : '#E0E0E0'} />
                </div>
                {correct === id && <div style={{ fontSize: 14, color, fontWeight: 600, marginTop: 3, marginLeft: 68 }}>Marcada como correcta</div>}
                {errors[`opt${i}`] && <div style={{ fontSize: 14, color: '#E53935', marginTop: 3, marginLeft: 68 }}>{errors[`opt${i}`]}</div>}
              </div>
            ))}
          </div>

          {/* Hint + Explanation */}
          <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', marginBottom: 12, border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <div style={{ marginBottom: 13 }}>
              <Label text="Pista pedagogica (SIGMA)" required />
              <textarea rows={2} value={hint} onChange={e => { setHint(e.target.value); setPreview('sigma'); }} placeholder="Ej: Aplica la regla de potencia"
                style={fieldStyle(errors.hint)}
                onFocus={e => e.target.style.borderColor = color}
                onBlur={e => e.target.style.borderColor = errors.hint ? '#E53935' : '#E0E0E0'} />
              {errors.hint && <div style={{ fontSize: 14, color: '#E53935', marginTop: 3 }}>{errors.hint}</div>}
            </div>
            <Label text="Explicacion completa" required />
            <textarea rows={3} value={explain} onChange={e => { setExplain(e.target.value); setPreview('sigma'); }} placeholder="Ej: Aplicando la regla de potencia..."
              style={fieldStyle(errors.explain)}
              onFocus={e => e.target.style.borderColor = color}
              onBlur={e => e.target.style.borderColor = errors.explain ? '#E53935' : '#E0E0E0'} />
            {errors.explain && <div style={{ fontSize: 14, color: '#E53935', marginTop: 3 }}>{errors.explain}</div>}
          </div>

          {/* XP */}
          <div style={{ background: '#fff', borderRadius: 13, padding: '14px 16px', marginBottom: 12, border: '1px solid #E8E8E8', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
            <Label text="XP por resolver correctamente" />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <input type="number" min="5" max="50" step="5" value={xp} onChange={e => setXp(Number(e.target.value))}
                style={{ ...fieldStyle(false), width: 90, textAlign: 'center', fontSize: 18, fontWeight: 700, color }}
                onFocus={e => e.target.style.borderColor = color}
                onBlur={e => e.target.style.borderColor = '#E0E0E0'} />
              <span style={{ fontSize: 13, color: '#555' }}>XP por ejercicio correcto</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: 'flex', gap: 10, paddingBottom: 8 }}>
            <button onClick={handleSave} disabled={saving || saved}
              style={{ flex: 1, padding: '15px', borderRadius: 13, background: saved ? 'linear-gradient(135deg,#2E7D32,#43A047)' : `linear-gradient(135deg,${color}CC,${color})`, color: '#fff', border: 'none', fontSize: 15, fontWeight: 700, cursor: 'pointer', boxShadow: `0 6px 20px ${color}44`, transition: 'all 0.2s', letterSpacing: '-0.2px', opacity: saving ? 0.8 : 1 }}>
              {saved ? 'Guardado' : saving ? 'Guardando...' : isNew ? 'Guardar ejercicio' : 'Actualizar ejercicio'}
            </button>
            <button onClick={() => navigate(-1)}
              style={{ padding: '15px 18px', borderRadius: 13, background: 'transparent', border: '1.5px solid #E0E0E0', color: '#444', fontSize: 14, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
              Cancelar
            </button>
          </div>
        </div>

        {/* ── RIGHT: Live Preview ── */}
        <div style={{ flex: '1 1 350px', minWidth: 280, display: 'flex', flexDirection: 'column', gap: 12 }}>
          <div style={{
            background: '#fff', borderRadius: 13, padding: '16px 18px', border: '1px solid #E8E8E8',
            boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'sticky', top: 16,
          }}>
            {/* Preview header with zoom */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: color }} />
              <span style={{ fontSize: 13, fontWeight: 700, color: '#333', textTransform: 'uppercase', letterSpacing: '0.3px' }}>
                Vista previa
              </span>
              <span style={{ fontSize: 13, color: '#777', fontWeight: 600, marginLeft: 'auto' }}>{levelTitle}</span>
              {/* Zoom controls */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginLeft: 8 }}>
                <button onClick={() => setZoom(Math.max(50, zoom - 10))}
                  style={{ width: 22, height: 22, borderRadius: 4, border: '1px solid #DDD', background: '#F5F5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#444', lineHeight: 1 }}>-</button>
                <span style={{ fontSize: 13, color: '#555', fontWeight: 700, minWidth: 28, textAlign: 'center' }}>{zoom}%</span>
                <button onClick={() => setZoom(Math.min(200, zoom + 10))}
                  style={{ width: 22, height: 22, borderRadius: 4, border: '1px solid #DDD', background: '#F5F5F5', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, color: '#444', lineHeight: 1 }}>+</button>
              </div>
            </div>

            {/* Tab selector */}
            <div style={{ display: 'flex', gap: 4, marginBottom: 14 }}>
              {[
                { k: 'nivel', l: 'Nivel' },
                { k: 'formula', l: 'Formula' },
                { k: 'opciones', l: 'Opciones' },
                { k: 'sigma', l: 'Sigma' },
              ].map(t => (
                <button key={t.k} onClick={() => setPreview(t.k)}
                  style={{
                    flex: 1, padding: '6px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                    background: preview === t.k ? `${color}18` : '#F5F5F5',
                    color: preview === t.k ? color : '#AAA',
                    fontWeight: preview === t.k ? 700 : 500, fontSize: 13,
                    textTransform: 'uppercase', letterSpacing: '0.3px',
                    transition: 'all 0.12s',
                  }}>
                  {t.l}
                </button>
              ))}
            </div>

            {/* Preview content (scaled by zoom) */}
            <div style={{ transform: `scale(${zoom / 100})`, transformOrigin: 'top left', transition: 'transform 0.15s' }}>
              {/* Image */}
              {imageUrl && (
                <div style={{ marginBottom: 12, textAlign: 'center' }}>
                  <img src={imageUrl} alt="Grafico del ejercicio"
                    style={{ maxWidth: '100%', maxHeight: 180, borderRadius: 8, border: '1px solid #E0E0E0' }}
                    onError={e => { e.target.style.display = 'none'; }} />
                </div>
              )}

              {preview === 'nivel' && (
                <div>
                  <div style={{
                    background: `linear-gradient(135deg,${color}22,${color}08)`,
                    borderRadius: 10, padding: 14, textAlign: 'center',
                    border: `1px solid ${color}30`,
                  }}>
                    <div style={{ fontSize: 24, fontWeight: 800, color, marginBottom: 2 }}>{levelTitle}</div>
                    <div style={{ fontSize: 14, color: '#555' }}>
                      {LEVEL_CONFIG[levelId]?.exercises?.length || 0} ejercicios &middot; {LEVEL_CONFIG[levelId]?.faseB?.timeLimit || 0}s
                    </div>
                  </div>
                </div>
              )}

              {preview === 'formula' && formula && (
                <div>
                  <div style={{ fontSize: 13, color: '#444', marginBottom: 8, fontWeight: 600 }}>
                    {q ? q.split('\n')[0] : 'Pregunta'}
                  </div>
                  <FormulaBlock math={formula} color={color} bgColor={`${color}08`} borderColor={`${color}25`} />
                </div>
              )}

              {preview === 'opciones' && (
                <div>
                  <div style={{ fontSize: 13, color: '#444', marginBottom: 8, fontWeight: 600 }}>
                    {q ? q.split('\n')[0] : 'Pregunta'}
                  </div>
                  {formula && <div style={{ marginBottom: 10, textAlign: 'center', fontSize: 16, fontFamily: 'Georgia,serif', color: '#333' }}><FormulaInline math={formula} /></div>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {OPT_IDS.map((id, i) => {
                      const isCorrect = correct === id;
                      const showVal = opts[i] || `Opcion ${id}`;
                      return (
                        <div key={id} style={{
                          display: 'flex', alignItems: 'center', gap: 10,
                          padding: '10px 12px', borderRadius: 10,
                          border: `1.5px solid ${isCorrect ? color : '#E0E0E0'}`,
                          background: isCorrect ? `${color}0A` : '#FAFAFA',
                        }}>
                          <div style={{
                            width: 26, height: 26, borderRadius: '50%', flexShrink: 0,
                            background: isCorrect ? color : '#E0E0E0',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: 14,
                          }}>{id}</div>
                          <span style={{ fontSize: 13, fontWeight: isCorrect ? 700 : 500, color: isCorrect ? color : '#555', fontFamily: 'Georgia,serif' }}>
                            <FormulaInline math={showVal} />
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {preview === 'sigma' && hint && (
                <div>
                  <SigmaBubble state="apoyo">{hint}</SigmaBubble>
                  {explain && (
                    <div style={{ marginTop: 10, fontSize: 15, color: '#555', background: '#FFF8E1', borderRadius: 8, padding: 10, border: '1px solid #FFE082' }}>
                      <span style={{ fontWeight: 700, color: '#E65100' }}>Explicacion: </span>
                      <FormulaInline math={explain} />
                    </div>
                  )}
                </div>
              )}

              {preview === 'formula' && !formula && (
                <div style={{ textAlign: 'center', padding: 20, color: '#999', fontSize: 13 }}>
                  Escribe una formula en LaTeX para ver la vista previa
                </div>
              )}
              {preview === 'sigma' && !hint && (
                <div style={{ textAlign: 'center', padding: 20, color: '#999', fontSize: 13 }}>
                  Agrega una pista SIGMA para ver la vista previa
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
