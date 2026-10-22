/**
 * LevelDemoScreen — Demo completo de Nivel 0: Repaso de Bases
 * Funciona 100% local (sin DB). Teoría → Práctica → Resultado.
 */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import { Explanation } from '../../components/ui/Explanation';
import { FormulaBlock, FormulaInline } from '../../components/ui/Formula';
import SigmaBubble from '../../components/sigma/SigmaBubble';
import SigmaLogo from '../../components/sigma/SigmaLogo';
import LevelGraph from './LevelGraph';

/* ────────────────────────────────────────────────────────────────────────── */
/*  CONTENIDO NIVEL 0 — REPASO DE BASES                                      */
/* ────────────────────────────────────────────────────────────────────────── */
const LEVEL = {
  color:     '#2E7D32',
  colorDark: '#1B5E20',
  colorLight:'#43A047',
  header:    'linear-gradient(150deg,#1B5E20 0%,#2E7D32 100%)',

  concepts: [
    {
      icon: '½',
      title: 'Fracciones',
      formula: '\\dfrac{a}{b} + \\dfrac{c}{d} = \\dfrac{ad + bc}{bd}',
      shortFormula: '\\dfrac{2}{3} + \\dfrac{1}{4} = \\dfrac{11}{12}',
      color: '#2E7D32',
      desc: 'Para sumar fracciones necesitas el Mínimo Común Múltiplo (MCM). Para dividir, inviertes la segunda fracción y multiplicas.',
      extra: '\\dfrac{a}{b} \\div \\dfrac{c}{d} = \\dfrac{a}{b} \\times \\dfrac{d}{c}',
      tip: 'El MCM de 3 y 4 es 12. Siempre busca el denominador común.',
    },
    {
      icon: 'xⁿ',
      title: 'Potencias y Exponentes',
      formula: '(x^n)^m = x^{n \\cdot m}',
      shortFormula: '(x^2)^3 = x^6',
      color: '#1565C0',
      desc: 'La potencia de una potencia multiplica los exponentes. Un exponente negativo indica el recíproco. La raíz cuadrada es exponente ½.',
      extra: 'x^{-n} = \\dfrac{1}{x^n} \\qquad \\sqrt{x} = x^{1/2}',
      tip: 'Regla clave: xᵃ · xᵇ = xᵃ⁺ᵇ — sumas exponentes al multiplicar misma base.',
    },
    {
      icon: '∂',
      title: 'Derivadas Básicas',
      formula: '\\dfrac{d}{dx}[x^n] = n \\cdot x^{n-1}',
      shortFormula: '\\dfrac{d}{dx}[x^3] = 3x^2',
      color: '#7E57C2',
      desc: 'La regla de la potencia: baja el exponente como coeficiente y luego réstale 1. La derivada de una constante es siempre cero.',
      extra: '\\dfrac{d}{dx}[e^x] = e^x \\qquad \\dfrac{d}{dx}[\\ln x] = \\dfrac{1}{x}',
      tip: 'La derivada es la "velocidad de cambio" de la función — eso es lo que integrarás.',
    },
  ],

  exercises: [
    {
      n: 1, q: '¿Cuánto es', formula: '\\dfrac{2}{3} + \\dfrac{1}{4} = ?',
      opts: ['\\dfrac{5}{7}', '\\dfrac{11}{12}', '\\dfrac{6}{7}'],
      correct: 1,
      hint: 'Busca el MCM de 3 y 4 (es 12). Convierte ambas fracciones.',
      explain: 'MCM(3,4) = 12 → \\dfrac{8}{12} + \\dfrac{3}{12} = \\dfrac{11}{12}',
      topic: 'Fracciones',
    },
    {
      n: 2, q: '¿Cuánto es', formula: '\\dfrac{2}{3} \\div \\dfrac{1}{4} = ?',
      opts: ['\\dfrac{2}{12}', '\\dfrac{1}{6}', '\\dfrac{8}{3}'],
      correct: 2,
      hint: 'Dividir fracción = invertir la segunda y multiplicar.',
      explain: '\\dfrac{2}{3} \\times \\dfrac{4}{1} = \\dfrac{8}{3}',
      topic: 'Fracciones',
    },
    {
      n: 3, q: 'Simplifica', formula: '(x^2)^3 = ?',
      opts: ['x^5', 'x^6', 'x^8'],
      correct: 1,
      hint: 'Potencia de potencia: multiplica los exponentes 2 × 3.',
      explain: '(x^2)^3 = x^{2 \\times 3} = x^6',
      topic: 'Potencias',
    },
    {
      n: 4, q: 'Simplifica', formula: '\\dfrac{1}{\\sqrt{x}} = ?',
      opts: ['x^{1/2}', 'x^{-2}', 'x^{-1/2}'],
      correct: 2,
      hint: '√x = x^(1/2). Al pasar al numerador, el exponente cambia de signo.',
      explain: '\\dfrac{1}{x^{1/2}} = x^{-1/2}',
      topic: 'Potencias',
    },
    {
      n: 5, q: 'Calcula la derivada', formula: '\\dfrac{d}{dx}[x^3] = ?',
      opts: ['x^2', '3x', '3x^2'],
      correct: 2,
      hint: 'Regla de potencia: baja el 3, réstale 1 al exponente.',
      explain: '\\dfrac{d}{dx}[x^3] = 3 \\cdot x^{3-1} = 3x^2',
      topic: 'Derivadas',
    },
    {
      n: 6, q: 'Regla del producto', formula: '\\dfrac{d}{dx}[x^2 \\cdot \\sin(x)] = ?',
      opts: ['2x \\cdot \\cos(x)', '2x \\cdot \\sin(x) + x^2 \\cdot \\cos(x)', 'x^2 \\cdot \\cos(x)'],
      correct: 1,
      hint: 'Regla del producto: (uv)\' = u\'v + uv\'. Aquí u=x², v=sin(x).',
      explain: "u'=2x,\\; v'=\\cos(x) \\Rightarrow 2x\\sin(x) + x^2\\cos(x)",
      topic: 'Derivadas',
    },
  ],
};

const TOPIC_COLOR = { 'Fracciones':'#2E7D32', 'Potencias':'#1565C0', 'Derivadas':'#7E57C2' };

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const IcX = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);
const IcHeart = ({ filled = true }) => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"
      fill={filled ? '#FF4757' : 'none'} stroke={filled ? '#FF4757' : '#ccc'} strokeWidth="2"/>
  </svg>
);
const IcCheck = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcStar = ({ filled = true, size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill={filled ? '#FFD700' : '#DDD'} stroke={filled ? '#F5A623' : '#CCC'} strokeWidth="1.5"/>
  </svg>
);
const IcArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);

/* ─── Progress bar ───────────────────────────────────────────────────────── */
function ProgressBar({ value, color, height = 8 }) {
  return (
    <div style={{ background:'#EEE', borderRadius: height, height, overflow:'hidden' }}>
      <div style={{ width:`${value}%`, height:'100%', background: color, borderRadius: height, transition:'width 0.7s cubic-bezier(0.4,0,0.2,1)', boxShadow:`0 0 8px ${color}77` }}/>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PHASE 0 — TEORÍA
═══════════════════════════════════════════════════════════════════════════ */
function TheoryPhase({ onStart }) {
  const { t } = useTheme();
  const [expanded, setExpanded] = useState(null);
  const c = LEVEL;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', animation:'fadeUp 0.4s ease' }}>
      {/* Header */}
      <div style={{ background: c.header, padding:'22px 20px 24px', flexShrink:0, boxShadow:'0 4px 20px rgba(0,0,0,0.18)', position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-20, top:-20, width:100, height:100, borderRadius:'50%', background:'rgba(255,255,255,0.08)' }}/>
        <div style={{ position:'absolute', left:-16, bottom:-20, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.06)' }}/>
        <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14, zIndex:1, position:'relative' }}>
          <div style={{ background:'rgba(255,255,255,0.2)', borderRadius:12, padding:'4px 12px', display:'inline-flex', alignItems:'center', gap:6 }}>
            <span style={{ fontSize:14, color:'rgba(255,255,255,0.9)', fontWeight:700, letterSpacing:'0.6px', textTransform:'uppercase' }}>Demo · Nivel 0</span>
          </div>
        </div>
        <div style={{ fontSize:14, color:'rgba(255,255,255,0.65)', fontWeight:700, textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:4 }}>REPASO DE BASES</div>
        <div style={{ fontSize:22, fontWeight:900, color:'#fff', letterSpacing:'-0.3px', marginBottom:4 }}>
          Fracciones, Potencias y Derivadas
        </div>
        <div style={{ fontSize:13, color:'rgba(255,255,255,0.75)' }}>
          Sin estas bases, el Cálculo Integral no tiene sentido.
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'16px 20px' }}>
        <SigmaBubble state="neutral">
          Vamos a refrescar las bases. Sin esto, el cálculo integral será un misterio. Sin presión — aquí aprendemos antes de practicar.
        </SigmaBubble>

        {/* Gráfica */}
        <div style={{ background: t.cardBg, borderRadius:16, padding:'16px 18px', border:`1.5px solid ${t.cardBorder}`, marginBottom:14, boxShadow:'0 2px 12px rgba(0,0,0,0.06)' }}>
          <div style={{ fontSize:14, fontWeight:700, color: c.color, textTransform:'uppercase', letterSpacing:'0.8px', marginBottom:6 }}>Visualización</div>
          <div style={{ fontSize:16, fontWeight:800, color: t.text, marginBottom:10 }}>Función y su derivada</div>
          <div style={{ background: t.appBg, borderRadius:12, padding:12, border:`1px solid ${t.cardBorder}` }}>
            <LevelGraph levelId={0}/>
          </div>
          <div style={{ fontSize:15, color: t.text3, marginTop:8, lineHeight:1.5 }}>
            La línea sólida es f(x)=x². La discontinua es su derivada f'(x)=2x. La integral es la operación inversa a la derivada.
          </div>
        </div>

        {/* Conceptos — acordeón */}
        <div style={{ fontSize:14, fontWeight:800, color: t.text3, textTransform:'uppercase', letterSpacing:'1px', marginBottom:12, paddingLeft:2 }}>
          3 conceptos clave
        </div>
        {c.concepts.map((concept, i) => (
          <button
            key={i}
            onClick={() => setExpanded(expanded === i ? null : i)}
            style={{
              width:'100%', display:'block',
              background: t.cardBg, borderRadius:16,
              padding:'16px 18px',
              border:`2px solid ${expanded === i ? concept.color : t.cardBorder}`,
              marginBottom:10, textAlign:'left', cursor:'pointer',
              transition:'all 0.22s ease', outline:'none',
              boxShadow: expanded === i ? `0 6px 24px ${concept.color}25` : '0 2px 10px rgba(0,0,0,0.05)',
              animation:`fadeUp 0.4s ease ${i*0.1}s both`,
            }}
          >
            <div style={{ display:'flex', alignItems:'center', gap:14 }}>
              <div style={{ width:46, height:46, borderRadius:14, background:`${concept.color}18`, color: concept.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:900, flexShrink:0, border:`1.5px solid ${concept.color}30` }}>
                {concept.icon}
              </div>
              <div style={{ flex:1, minWidth:0 }}>
                <div style={{ fontSize:15, fontWeight:800, color: t.text, marginBottom:4 }}>{concept.title}</div>
                <div style={{ fontSize:13, overflow:'hidden' }}>
                  <FormulaInline math={concept.shortFormula}/>
                </div>
              </div>
              <div style={{ fontSize:20, color: t.text3, transition:'transform 0.2s', transform: expanded === i ? 'rotate(90deg)' : 'none', flexShrink:0 }}>›</div>
            </div>

            {expanded === i && (
              <div style={{ marginTop:14, paddingTop:14, borderTop:`1.5px solid ${concept.color}25`, animation:'expandDown 0.2s ease' }}>
                <FormulaBlock math={concept.formula}/>
                <div style={{ fontSize:14, color: t.text2, lineHeight:1.75, marginTop:10, marginBottom:12 }}>
                  {concept.desc}
                </div>
                <FormulaBlock math={concept.extra}/>
                <div style={{ marginTop:10, background:`${concept.color}0E`, borderRadius:10, padding:'10px 14px', border:`1px solid ${concept.color}30` }}>
                  <span style={{ fontSize:14, fontWeight:700, color: concept.color, textTransform:'uppercase', letterSpacing:'0.5px' }}>Tip: </span>
                  <span style={{ fontSize:13, color: t.text2 }}>{concept.tip}</span>
                </div>
              </div>
            )}
          </button>
        ))}
        <div style={{ height:16 }}/>
      </div>

      {/* CTA */}
      <div style={{ padding:'14px 20px 24px', flexShrink:0, borderTop:`1.5px solid ${t.cardBorder}`, background: t.cardBg }}>
        <button
          onClick={onStart}
          style={{ width:'100%', padding:'17px', borderRadius:16, border:'none', background: c.header, color:'#fff', fontSize:16, fontWeight:800, cursor:'pointer', boxShadow:`0 8px 28px ${c.color}55`, letterSpacing:'-0.2px', transition:'transform 0.15s, box-shadow 0.15s' }}
          onMouseEnter={(e) => { e.currentTarget.style.transform='translateY(-2px)'; e.currentTarget.style.boxShadow=`0 12px 36px ${c.color}66`; }}
          onMouseLeave={(e) => { e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow=`0 8px 28px ${c.color}55`; }}
        >
          Entendido — ¡A practicar!
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PHASE 1 — PRÁCTICA
═══════════════════════════════════════════════════════════════════════════ */
function PracticePhase({ onFinish }) {
  const { t, themeName } = useTheme();
  const [idx,      setIdx]      = useState(0);
  const [selected, setSelected] = useState(null);
  const [state,    setState]    = useState('idle'); // idle | correct | wrong
  const [lives,    setLives]    = useState(3);
  const [score,    setScore]    = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [results,  setResults]  = useState([]);

  const ex      = LEVEL.exercises[idx];
  const total   = LEVEL.exercises.length;
  const topColor = TOPIC_COLOR[ex.topic] || LEVEL.color;
  const OPTIONS  = ['A', 'B', 'C'];

  const verify = () => {
    if (selected === null || state !== 'idle') return;
    const isCorrect = selected === ex.correct;
    setState(isCorrect ? 'correct' : 'wrong');
    if (isCorrect) {
      setScore(s => s + 15);
    } else {
      setLives(l => l - 1);
    }
    setResults(r => [...r, { idx, correct: isCorrect }]);
  };

  const next = () => {
    if (idx + 1 >= total || lives <= 0) {
      onFinish(score + (state === 'correct' ? 0 : 0), results, lives);
    } else {
      setIdx(i => i + 1);
      setSelected(null);
      setState('idle');
      setShowHint(false);
    }
  };

  /* auto-avanzar si se acaban las vidas */
  useEffect(() => {
    if (lives === 0) {
      const t = setTimeout(() => onFinish(score, results, 0), 1200);
      return () => clearTimeout(t);
    }
  }, [lives]);

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', animation:'fadeUp 0.3s ease' }}>
      {/* Header */}
      <div style={{ background:`linear-gradient(150deg,${topColor}DD,${topColor})`, padding:'16px 20px 14px', flexShrink:0, boxShadow:'0 4px 16px rgba(0,0,0,0.15)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:10 }}>
          <div style={{ fontSize:14, fontWeight:800, color:'rgba(255,255,255,0.8)', textTransform:'uppercase', letterSpacing:'1px' }}>
            {ex.topic} · {idx+1} / {total}
          </div>
          <div style={{ display:'flex', gap:4 }}>
            {[1,2,3].map(h => <IcHeart key={h} filled={h <= lives}/>)}
          </div>
        </div>
        <ProgressBar value={((idx) / total) * 100} color="rgba(255,255,255,0.6)" height={6}/>
        <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
          <span style={{ fontSize:13, color:'rgba(255,255,255,0.7)', fontWeight:600 }}>Progreso</span>
          <span style={{ fontSize:14, fontWeight:800, color:'rgba(255,255,255,0.95)' }}>+{score} XP</span>
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'18px 20px' }}>

        {/* SIGMA feedback */}
        {state === 'correct' && (
          <SigmaBubble state="celebracion">
            ¡Exacto! Vas entendiendo la lógica. ¡Sigue así!
          </SigmaBubble>
        )}
        {state === 'wrong' && (
          <SigmaBubble state="alerta">
            Casi. Recuerda: {LEVEL.exercises[idx].hint}
          </SigmaBubble>
        )}

        {/* Pregunta */}
        <div style={{ background: t.cardBg, borderRadius:18, padding:'20px 20px 16px', border:`2px solid ${topColor}30`, marginBottom:16, boxShadow:`0 4px 20px ${topColor}15`, animation:'popIn 0.35s cubic-bezier(0.34,1.4,0.64,1)' }}>
          <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:14 }}>
            <div style={{ width:36, height:36, borderRadius:10, background:`${topColor}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:800, color: topColor, flexShrink:0 }}>
              {idx+1}
            </div>
            <div style={{ fontSize:15, fontWeight:700, color: t.text }}>{ex.q}</div>
          </div>
          <div style={{ background: t.appBg, borderRadius:12, padding:'14px 12px', border:`1px solid ${t.cardBorder}`, textAlign:'center' }}>
            <FormulaBlock math={ex.formula}/>
          </div>
        </div>

        {/* Opciones */}
        <div style={{ display:'flex', flexDirection:'column', gap:10, marginBottom:16 }}>
          {ex.opts.map((opt, i) => {
            const letter  = OPTIONS[i];
            const isSelected = selected === i;
            const isCorrectOpt = i === ex.correct;
            let bg = t.cardBg, border = `2px solid ${t.cardBorder}`, color = t.text;
            let shadow = '0 2px 8px rgba(0,0,0,0.05)';

            if (state !== 'idle') {
              if (isCorrectOpt) { bg = '#E8F5E9'; border = '2px solid #56CC02'; color = '#2E7D32'; shadow = '0 4px 16px rgba(86,204,2,0.2)'; }
              else if (isSelected && !isCorrectOpt) { bg = '#FFEBEE'; border = '2px solid #FF4757'; color = '#C62828'; }
            } else if (isSelected) {
              bg = `${topColor}12`; border = `2px solid ${topColor}`; shadow = `0 4px 16px ${topColor}25`;
            }

            return (
              <button
                key={i}
                onClick={() => state === 'idle' && setSelected(i)}
                style={{
                  background: bg, border, borderRadius:14, padding:'14px 16px',
                  display:'flex', alignItems:'center', gap:14,
                  cursor: state !== 'idle' ? 'default' : 'pointer',
                  textAlign:'left', outline:'none', color,
                  boxShadow: shadow,
                  transition:'all 0.18s ease',
                  animation:`fadeUp 0.35s ease ${i*0.06}s both`,
                  transform: isSelected && state === 'idle' ? 'scale(1.01)' : 'scale(1)',
                }}
                onMouseEnter={(e) => { if (state === 'idle' && !isSelected) e.currentTarget.style.transform = 'scale(1.01)'; }}
                onMouseLeave={(e) => { if (!isSelected) e.currentTarget.style.transform = 'scale(1)'; }}
              >
                {/* Letter badge */}
                <div style={{
                  width:34, height:34, borderRadius:10, flexShrink:0,
                  background: state !== 'idle'
                    ? isCorrectOpt ? '#56CC02' : isSelected ? '#FF4757' : t.progressBg
                    : isSelected ? topColor : t.progressBg,
                  display:'flex', alignItems:'center', justifyContent:'center',
                  fontSize:13, fontWeight:900, color: (state !== 'idle' && (isCorrectOpt || (isSelected && !isCorrectOpt))) || isSelected ? '#fff' : t.text3,
                  transition:'all 0.18s',
                }}>
                  {state !== 'idle' && isCorrectOpt ? <IcCheck size={16}/> : letter}
                </div>

                <div style={{ flex:1, minWidth:0 }}>
                  <FormulaInline math={opt}/>
                </div>
              </button>
            );
          })}
        </div>

        {/* Hint */}
        {state === 'idle' && !showHint && (
          <button
            onClick={() => setShowHint(true)}
            style={{ background:'none', border:`1.5px dashed ${t.cardBorder}`, borderRadius:12, padding:'10px 16px', width:'100%', cursor:'pointer', color: t.text3, fontSize:13, fontWeight:600, marginBottom:12 }}
          >
            Necesito una pista
          </button>
        )}
        {showHint && state === 'idle' && (
          <div style={{ background:`${topColor}0E`, border:`1.5px solid ${topColor}35`, borderRadius:12, padding:'12px 16px', marginBottom:12, animation:'fadeUp 0.2s ease' }}>
            <div style={{ fontSize:14, fontWeight:800, color: topColor, textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:4 }}>Pista</div>
            <div style={{ fontSize:13, color: t.text2, lineHeight:1.6 }}>{ex.hint}</div>
          </div>
        )}

        {/* Explicación tras responder */}
        {state !== 'idle' && (
          <div style={{
            background: state==='correct'
              ? (themeName === 'dark' ? 'rgba(86,204,2,0.14)' : '#E8F5E9')
              : (themeName === 'dark' ? 'rgba(255,152,0,0.14)' : '#FFF3E0'),
            border: `1.5px solid ${state==='correct'
              ? (themeName === 'dark' ? 'rgba(86,204,2,0.32)' : '#56CC02')
              : (themeName === 'dark' ? 'rgba(255,152,0,0.3)' : '#FF9600')}`,
            borderRadius:14, padding:'14px 16px', marginBottom:16, animation:'popIn 0.3s ease'
          }}>
            <div style={{ fontSize:14, fontWeight:800, color: state==='correct' ? (themeName === 'dark' ? '#B9F6CA' : '#2E9400') : (themeName === 'dark' ? '#FFD180' : '#E67E22'), textTransform:'uppercase', letterSpacing:'0.6px', marginBottom:6 }}>
              {state==='correct' ? '¡Correcto!' : 'Respuesta explicada'}
            </div>
            <Explanation
              text={ex.explain}
              bgColor={themeName === 'dark' ? 'rgba(255,255,255,0.05)' : (state==='correct' ? '#E8F5E9' : '#FFF3E0')}
              borderColor={themeName === 'dark' ? 'rgba(255,255,255,0.12)' : (state==='correct' ? '#56CC02' : '#FF9600')}
            />
          </div>
        )}

        <div style={{ height:16 }}/>
      </div>

      {/* Footer */}
      <div style={{ padding:'12px 20px 24px', flexShrink:0, borderTop:`1.5px solid ${t.cardBorder}`, background: t.cardBg }}>
        {state === 'idle' ? (
          <button
            onClick={verify}
            disabled={selected === null}
            style={{
              width:'100%', padding:'16px', borderRadius:14, border:'none',
              background: selected !== null ? `linear-gradient(135deg,${topColor},${topColor}CC)` : t.progressBg,
              color: selected !== null ? '#fff' : t.text3,
              fontSize:15, fontWeight:800, cursor: selected !== null ? 'pointer' : 'not-allowed',
              boxShadow: selected !== null ? `0 6px 24px ${topColor}44` : 'none',
              transition:'all 0.2s',
            }}
          >
            Verificar respuesta
          </button>
        ) : (
          <button
            onClick={next}
            style={{ width:'100%', padding:'16px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${topColor},${topColor}CC)`, color:'#fff', fontSize:15, fontWeight:800, cursor:'pointer', boxShadow:`0 6px 24px ${topColor}44`, transition:'transform 0.15s', animation:'popIn 0.3s ease' }}
            onMouseEnter={(e) => e.currentTarget.style.transform='translateY(-2px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform='translateY(0)'}
          >
            {idx + 1 >= total ? 'Ver resultado' : 'Siguiente →'}
          </button>
        )}
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   PHASE 2 — RESULTADO
═══════════════════════════════════════════════════════════════════════════ */
function ResultPhase({ score, results, lives, onRetry }) {
  const { t } = useTheme();
  const correct = results.filter(r => r.correct).length;
  const total   = LEVEL.exercises.length;
  const pct     = Math.round((correct / total) * 100);
  const stars   = pct >= 90 ? 3 : pct >= 60 ? 2 : pct >= 30 ? 1 : 0;
  const passed  = pct >= 50;

  const sigmaMsg = passed
    ? `¡${pct}% de aciertos! Las bases están sólidas. Ahora estás listo para las integrales.`
    : `${pct}% de aciertos. Sin problema — el repaso es parte del proceso. ¡Inténtalo de nuevo!`;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', overflow:'hidden', animation:'fadeUp 0.4s ease' }}>
      <div style={{ background: passed ? 'linear-gradient(150deg,#1B5E20,#2E7D32)' : 'linear-gradient(150deg,#B71C1C,#D32F2F)', padding:'24px 22px 22px', flexShrink:0, boxShadow:'0 4px 20px rgba(0,0,0,0.2)' }}>
        <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.7)', textTransform:'uppercase', letterSpacing:'1.5px', marginBottom:4 }}>
          Resultado · Nivel 0
        </div>
        <div style={{ fontSize:22, fontWeight:900, color:'#fff' }}>
          {passed ? '¡Bases dominadas!' : 'Sigue intentando'}
        </div>
      </div>

      <div style={{ flex:1, overflowY:'auto', padding:'20px 20px' }}>
        {/* Stars */}
        <div style={{ display:'flex', justifyContent:'center', gap:10, marginBottom:24, animation:'popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) 0.2s both' }}>
          {[1,2,3].map(s => (
            <div key={s} style={{ animation:`popIn 0.5s cubic-bezier(0.34,1.56,0.64,1) ${s*0.12}s both` }}>
              <IcStar filled={s <= stars} size={52}/>
            </div>
          ))}
        </div>

        {/* Score card */}
        <div style={{ background: t.cardBg, borderRadius:20, padding:'22px 24px', border:`2px solid ${passed?'#56CC02':'#FF4757'}33`, boxShadow:`0 6px 24px ${passed?'#56CC02':'#FF4757'}18`, marginBottom:16, textAlign:'center', animation:'fadeUp 0.4s ease 0.1s both' }}>
          <div style={{ fontSize:52, fontWeight:900, color: passed?'#2E9400':'#C62828', letterSpacing:'-2px', lineHeight:1 }}>{pct}%</div>
          <div style={{ fontSize:15, color: t.text2, marginTop:4, fontWeight:600 }}>{correct} de {total} correctas · {score} XP</div>
          <div style={{ display:'flex', justifyContent:'center', marginTop:14 }}>
            <ProgressBar value={pct} color={passed?'#56CC02':'#FF4757'} height={10}/>
          </div>
        </div>

        {/* Detail per exercise */}
        <div style={{ fontSize:14, fontWeight:800, color: t.text3, textTransform:'uppercase', letterSpacing:'1px', marginBottom:10 }}>
          Detalle por ejercicio
        </div>
        <div style={{ display:'flex', flexDirection:'column', gap:8 }}>
          {results.map((r, i) => {
            const ex = LEVEL.exercises[i];
            return (
              <div key={i} style={{ background: t.cardBg, borderRadius:12, padding:'12px 14px', border:`1.5px solid ${r.correct?'#56CC0233':'#FF475733'}`, display:'flex', alignItems:'center', gap:12, animation:`fadeUp 0.3s ease ${i*0.05}s both` }}>
                <div style={{ width:32, height:32, borderRadius:10, background: r.correct?'#56CC02':'#FF4757', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                  {r.correct ? <IcCheck size={16}/> : <IcX/>}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontSize:14, fontWeight:700, color: TOPIC_COLOR[ex.topic]||LEVEL.color, textTransform:'uppercase', letterSpacing:'0.5px' }}>{ex.topic}</div>
                  <div style={{ fontSize:15, color: t.text2, fontWeight:600 }}>{ex.q}</div>
                </div>
                <span style={{ fontSize:14, fontWeight:800, color: r.correct?'#2E9400':'#C62828' }}>
                  {r.correct ? '+15 XP' : '−♥'}
                </span>
              </div>
            );
          })}
        </div>

        <div style={{ padding:'14px 0' }}>
          <SigmaBubble state={passed ? 'celebracion' : 'apoyo'}>{sigmaMsg}</SigmaBubble>
        </div>
      </div>

      {/* Footer buttons */}
      <div style={{ padding:'12px 20px 24px', flexShrink:0, borderTop:`1.5px solid ${t.cardBorder}`, background: t.cardBg, display:'flex', gap:10 }}>
        <button
          onClick={onRetry}
          style={{ flex:1, padding:'15px', borderRadius:14, border:`2px solid ${LEVEL.color}55`, background:`${LEVEL.color}0E`, color: LEVEL.color, fontSize:14, fontWeight:700, cursor:'pointer', transition:'all 0.15s' }}
          onMouseEnter={(e) => { e.currentTarget.style.background=`${LEVEL.color}20`; }}
          onMouseLeave={(e) => { e.currentTarget.style.background=`${LEVEL.color}0E`; }}
        >
          Intentar de nuevo
        </button>
        <button
          onClick={() => window.history.back()}
          style={{ flex:2, padding:'15px', borderRadius:14, border:'none', background:`linear-gradient(135deg,${LEVEL.color},${LEVEL.colorDark})`, color:'#fff', fontSize:14, fontWeight:800, cursor:'pointer', boxShadow:`0 6px 20px ${LEVEL.color}44`, transition:'transform 0.15s' }}
          onMouseEnter={(e) => e.currentTarget.style.transform='translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform='translateY(0)'}
        >
          Continuar →
        </button>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════════
   MAIN EXPORT
═══════════════════════════════════════════════════════════════════════════ */
export default function LevelDemoScreen() {
  const navigate = useNavigate();
  const { t }   = useTheme();
  const [phase,   setPhase]   = useState('theory'); // theory | practice | result
  const [score,   setScore]   = useState(0);
  const [results, setResults] = useState([]);
  const [lives,   setLives]   = useState(3);

  const handleStart  = () => setPhase('practice');
  const handleFinish = (s, r, l) => { setScore(s); setResults(r); setLives(l); setPhase('result'); };
  const handleRetry  = () => { setPhase('theory'); setScore(0); setResults([]); setLives(3); };

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background: t.appBg, overflow:'hidden', fontFamily:"'DM Sans','Nunito',sans-serif" }}>

      {/* Top close bar */}
      <div style={{ background: t.cardBg, borderBottom:`2px solid ${t.cardBorder}`, padding:'10px 18px', display:'flex', alignItems:'center', justifyContent:'space-between', flexShrink:0 }}>
        <button onClick={() => navigate(-1)} style={{ background:'none', border:'none', cursor:'pointer', color: t.text2, display:'flex', alignItems:'center', gap:6, fontSize:14, fontWeight:700, padding:'4px 8px', borderRadius:8 }}>
          <IcArrowLeft/> Volver
        </button>
        <div style={{ display:'flex', alignItems:'center', gap:8 }}>
          <SigmaLogo state="celebracion" size={28}/>
          <span style={{ fontSize:13, fontWeight:800, color: LEVEL.color }}>Nivel 0 — Demo</span>
        </div>
        <div style={{ width:60 }}/>
      </div>

      {/* Phases */}
      {phase === 'theory'   && <TheoryPhase   onStart={handleStart} />}
      {phase === 'practice' && <PracticePhase onFinish={handleFinish} />}
      {phase === 'result'   && <ResultPhase   score={score} results={results} lives={lives} onRetry={handleRetry} />}

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes popIn {
          from { opacity:0; transform:scale(0.75); }
          to   { opacity:1; transform:scale(1); }
        }
        @keyframes expandDown {
          from { opacity:0; transform:translateY(-8px); }
          to   { opacity:1; transform:translateY(0); }
        }
      `}</style>
    </div>
  );
}
