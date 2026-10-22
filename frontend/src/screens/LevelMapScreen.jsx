import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useProgress } from '../contexts/ProgressContext';
import { LEVEL_CONFIG } from '../data/levelConfig';
import SigmaBubble from '../components/sigma/SigmaBubble';
import SigmaLogo from '../components/sigma/SigmaLogo';

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const IcArrowLeft = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="15 18 9 12 15 6"/>
  </svg>
);
const IcCheck = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const IcLock = ({ color = 'rgba(255,255,255,0.85)' }) => (
  <svg width="22" height="22" viewBox="0 0 24 24">
    <rect x="5" y="11" width="14" height="10" rx="2" fill={color}/>
    <path d="M8 11V7a4 4 0 0 1 8 0v4" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round"/>
  </svg>
);
const IcStar = ({ size = 14, filled = true }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
      fill={filled ? '#FFD700' : 'none'} stroke="#FFD700" strokeWidth="1.5"/>
  </svg>
);
const IcBook = ({ size = 14, color = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
    <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
  </svg>
);
const IcPen = ({ size = 13, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
);
const IcLibrary = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <line x1="12" y1="6" x2="16" y2="6"/><line x1="12" y1="10" x2="16" y2="10"/>
  </svg>
);

/* ─── Math decorations ───────────────────────────────────────────────────── */
const MATH = ['∂', '∫', 'Δ', '∞'];

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function SkeletonCard({ delay = 0 }) {
  const { t } = useTheme();
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', animation: `fadeUp 0.4s ease ${delay}s both` }}>
      <div style={{ height: 100, background: t.progressBg, animation: 'skelPulse 1.5s ease-in-out infinite' }}/>
      <div style={{ padding: '14px', background: t.cardBg, border: `1.5px solid ${t.cardBorder}`, borderTop: 'none', borderRadius: '0 0 20px 20px' }}>
        {[70, 45, 100, 36].map((w, i) => (
          <div key={i} style={{ height: i === 3 ? 36 : i === 0 ? 14 : 9, background: t.progressBg, borderRadius: 6, marginBottom: 8, width: `${w}%`, animation: `skelPulse 1.5s ease-in-out ${i * 0.1}s infinite` }}/>
        ))}
      </div>
    </div>
  );
}

/* ─── 3D Level Card ──────────────────────────────────────────────────────── */
function LevelCard({ course: c, idx, onTheory, onPractice, special, onDemo }) {
  const { t } = useTheme();
  const cardRef  = useRef(null);
  const glareRef = useRef(null);
  const [pressed, setPressed] = useState(false);

  const isLocked   = c.locked;
  const isDone     = c.completed;
  const mainColor  = isLocked ? '#AFAFAF' : isDone ? '#56CC02' : c.color;

  const headerGrad = isLocked
    ? 'linear-gradient(140deg,#BEBEBE,#9E9E9E)'
    : isDone
      ? 'linear-gradient(140deg,#6EE000,#3DA800)'
      : special
        ? `linear-gradient(140deg,${c.color},${c.color}99)`
        : `linear-gradient(140deg,${c.color},${c.color}BB)`;

  /* 3D tilt */
  const handleMove = (e) => {
    if (isLocked) return;
    const el   = cardRef.current;
    const rect = el.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const rotX = ((y / rect.height) - 0.5) * -18;
    const rotY = ((x / rect.width)  - 0.5) *  20;
    el.style.transform    = `perspective(800px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.05) translateZ(14px)`;
    el.style.boxShadow    = `0 24px 60px ${mainColor}45, 0 8px 24px rgba(0,0,0,0.18)`;
    if (glareRef.current) {
      const gx = (x / rect.width)  * 100;
      const gy = (y / rect.height) * 100;
      glareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.3) 0%, transparent 60%)`;
      glareRef.current.style.opacity    = '1';
    }
  };
  const handleLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(800px) rotateX(0) rotateY(0) scale(1) translateZ(0)';
    el.style.boxShadow = isLocked ? '0 3px 14px rgba(0,0,0,0.07)' : `0 6px 24px ${mainColor}28`;
    if (glareRef.current) glareRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        borderRadius: 20, overflow: 'hidden',
        border: `2px solid ${isLocked ? t.cardBorder : mainColor + '35'}`,
        boxShadow: isLocked ? '0 3px 14px rgba(0,0,0,0.07)' : `0 6px 24px ${mainColor}28`,
        opacity: isLocked ? 0.68 : 1,
        animation: `card3D 0.6s cubic-bezier(0.34,1.28,0.64,1) ${idx * 0.1}s both`,
        transition: 'transform 0.38s cubic-bezier(0.23,1,0.32,1), box-shadow 0.38s ease',
        cursor: isLocked ? 'not-allowed' : 'default',
        position: 'relative', transformStyle: 'preserve-3d', willChange: 'transform',
      }}
    >
      {/* Glare */}
      <div ref={glareRef} style={{ position: 'absolute', inset: 0, zIndex: 10, borderRadius: 18, pointerEvents: 'none', opacity: 0, transition: 'opacity 0.2s' }}/>

      {/* Header */}
      <div style={{
        background: headerGrad,
        padding: '15px 14px 13px', position: 'relative', overflow: 'hidden',
        minHeight: 100, display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Bubble deco */}
        <div style={{ position:'absolute', right:-20, top:-20, width:84, height:84, borderRadius:'50%', background:'rgba(255,255,255,0.12)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', right:24, bottom:-26, width:58, height:58, borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }}/>
        {/* Math deco */}
        <div aria-hidden style={{
          position:'absolute', right:6, bottom:-16, fontSize:88, fontWeight:900, lineHeight:1,
          color:'rgba(255,255,255,0.12)', fontFamily:'"Georgia",serif',
          userSelect:'none', pointerEvents:'none',
        }}>
          {special ? '∞' : MATH[idx % MATH.length]}
        </div>

        {/* Status + icon */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', zIndex:1 }}>
          <span style={{ background:'rgba(255,255,255,0.22)', borderRadius:20, padding:'3px 10px', fontSize:15, fontWeight:800, color:'#fff', textTransform:'uppercase', letterSpacing:'1px' }}>
            {special ? 'Referencia rápida' : isLocked ? 'Bloqueado' : isDone ? 'Completado' : 'Disponible'}
          </span>
          <div style={{
            width:44, height:44, borderRadius:'50%', background:'rgba(255,255,255,0.2)',
            display:'flex', alignItems:'center', justifyContent:'center',
            animation: (!isLocked && !isDone && !special) ? 'pulse 2.5s ease-in-out infinite' : 'none',
          }}>
            {isLocked ? <IcLock/> : isDone ? <IcCheck/> : special ? <IcLibrary size={22}/> : <SigmaLogo state="celebracion" size={30}/>}
          </div>
        </div>

        {/* Stars (when done) */}
        {isDone && c.stars > 0 && (
          <div style={{ display:'flex', gap:3, zIndex:1 }}>
            {[1,2,3].map(s => <IcStar key={s} size={16} filled={s <= c.stars}/>)}
          </div>
        )}
        {!isDone && (
          <div style={{ fontSize:15, fontWeight:700, color:'rgba(255,255,255,0.8)', zIndex:1 }}>
            {special ? 'Recursos' : `Nivel ${idx + 1}`}
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ background: t.cardBg, padding:'13px 14px 15px' }}>
        <div style={{ fontSize:13, fontWeight:800, color: t.text, marginBottom:3, lineHeight:1.3 }}>{c.title}</div>
        {c.subtitle && <div style={{ fontSize:14, color: t.text3, marginBottom:10, lineHeight:1.4 }}>{c.subtitle}</div>}

        {/* Progress */}
        {c.progress !== null && !special && (
          <div style={{ marginBottom:12 }}>
            <div style={{ background: t.progressBg, borderRadius:4, height:6, overflow:'hidden' }}>
              <div style={{
                height:'100%', borderRadius:4, width:`${c.progress}%`,
                background: isLocked ? '#D0D0D0' : isDone ? '#56CC02' : mainColor,
                transition:'width 1.2s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: !isLocked && !isDone ? `0 0 8px ${mainColor}77` : 'none',
              }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'space-between', marginTop:4 }}>
              <span style={{ fontSize:13, color: t.text3, fontWeight:600 }}>Progreso</span>
              <span style={{ fontSize:13, fontWeight:700, color: mainColor }}>{c.progress}%</span>
            </div>
          </div>
        )}

        {/* Done badge */}
        {isDone && c.done !== null && (
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'#56CC0212', borderRadius:8, padding:'5px 8px', marginBottom:10 }}>
            <IcStar size={12} filled/>
            <span style={{ fontSize:13, fontWeight:700, color:'#2E9400' }}>{c.done} ejercicios completados</span>
          </div>
        )}

        {/* Actions */}
        {special ? (
          <div style={{ display:'flex', gap:7 }}>
            <button
              onClick={() => navigate('/recursos')}
              style={{
                width:'100%', padding:'9px 0', borderRadius:12,
                border:'none', background: mainColor, color:'#fff',
                fontSize:15, fontWeight:700, cursor:'pointer',
                boxShadow:`0 4px 12px ${mainColor}44`,
              }}>
              📖 Explorar recursos
            </button>
          </div>
        ) : !isLocked ? (
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            <div style={{ display:'flex', gap:7 }}>
              <button
                onClick={() => onTheory(c.levelKey)}
                onMouseEnter={(e) => { e.currentTarget.style.background=`${mainColor}22`; e.currentTarget.style.borderColor=mainColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.background=`${mainColor}0E`; e.currentTarget.style.borderColor=`${mainColor}55`; }}
                style={{ flex:1, padding:'9px 0', borderRadius:12, border:`2px solid ${mainColor}55`, background:`${mainColor}0E`, color: mainColor, fontSize:15, fontWeight:700, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5, transition:'all 0.15s' }}
              >
                <IcBook size={13} color={mainColor}/> Teoría
              </button>
              <button
                onClick={() => onPractice(c.levelKey)}
                onMouseDown={() => setPressed(true)}
                onMouseUp={() => setPressed(false)}
                onMouseLeave={() => { setPressed(false); }}
                style={{ flex:1, padding:'9px 0', borderRadius:12, border:'none', background: mainColor, color:'#fff', fontSize:15, fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', justifyContent:'center', gap:5, boxShadow: pressed ? `0 1px 0 ${mainColor}99` : `0 4px 0 ${mainColor}99`, transform: pressed ? 'translateY(3px)' : 'translateY(0)', transition:'transform 0.1s, box-shadow 0.1s' }}
              >
                <IcPen size={12}/> Practicar
              </button>
            </div>
            {onDemo && (
              <button
                onClick={onDemo}
                onMouseEnter={(e) => { e.currentTarget.style.background=`${mainColor}18`; e.currentTarget.style.borderColor=mainColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor=`${mainColor}44`; }}
                style={{ width:'100%', padding:'8px 0', borderRadius:12, border:`1.5px dashed ${mainColor}44`, background:'transparent', color: mainColor, fontSize:14, fontWeight:800, cursor:'pointer', letterSpacing:'0.3px', display:'flex', alignItems:'center', justifyContent:'center', gap:5, transition:'background 0.15s, border-color 0.15s' }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Demo gratuita — sin cuenta
              </button>
            )}
          </div>
        ) : (
          <div style={{ textAlign:'center', fontSize:13, color: t.text3, fontWeight:600, padding:'6px 0 2px', lineHeight:1.4 }}>
            Completa el nivel anterior para desbloquear
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function LevelMapScreen() {
  const navigate  = useNavigate();
  const { token } = useAuth();
  const { t }     = useTheme();
  const { levels, setSelectedLevel, setExerciseIdx, fetchAll, isUnlocked, getProgreso, getStars } = useProgress();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    fetchAll().finally(() => setLoading(false));
  }, [token]);

  const goToTheory   = (lk) => { setSelectedLevel(lk); navigate('/level/fase-a'); };
  const goToPractice = (lk) => { setSelectedLevel(lk); setExerciseIdx(0); navigate('/level/fase-b'); };
  const goToDemo     = () => navigate('/level/demo');

  const courses = levels.length > 0
    ? levels.map((lv) => {
        const levelKey = lv.id - 1;
        const cfg      = LEVEL_CONFIG[levelKey] || {};
        const prog     = getProgreso(levelKey);
        const unlocked = isUnlocked(levelKey);
        return {
          levelKey,
          title:     lv.nombre    || cfg.subtitle || cfg.title || `Nivel ${levelKey}`,
          subtitle:  lv.subtitulo || cfg.faseA?.headline || '',
          color:     cfg.color    || lv.color     || '#2E7D32',
          progress:  prog?.porcentaje ?? (unlocked ? 0 : null),
          done:      prog?.completado ? (prog.puntos > 0 ? Math.round(prog.puntos / 15) : 0) : null,
          stars:     getStars(levelKey) || 0,
          locked:    !unlocked,
          completed: prog?.completado ?? false,
        };
      })
    : Object.entries(LEVEL_CONFIG).map(([key, cfg]) => {
        const levelKey = parseInt(key);
        return {
          levelKey,
          title:     cfg.subtitle,
          subtitle:  cfg.faseA?.headline || '',
          color:     cfg.color,
          progress:  levelKey === 0 ? 0 : null,
          done:      null,
          stars:     0,
          locked:    levelKey > 0,
          completed: false,
        };
      });

  const recursosCard = {
    levelKey: -1, title: 'Recursos Didácticos',
    subtitle: 'Fórmulas, tablas y material de apoyo',
    color: '#E67E22', progress: null, done: null,
    stars: 0, locked: false, completed: false,
  };

  const allCards    = [...courses, recursosCard];
  const completados = courses.filter(c => c.completed).length;
  const total       = courses.length;

  const sigmaMsg = completados === 0
    ? `Empieza por el Nivel 1 — las bases lo son todo.`
    : completados === total && total > 0
      ? '¡Todos los niveles completados! Eres un crack.'
      : `Tienes ${completados} nivel${completados !== 1 ? 'es' : ''} completado${completados !== 1 ? 's' : ''}. ¡Sigue!`;

  return (
    <div style={{ flex:1, display:'flex', flexDirection:'column', background: t.appBg, overflow:'hidden', fontFamily:"'DM Sans','Nunito',sans-serif" }}>

      {/* ── Header ── */}
      <div style={{ background:'linear-gradient(150deg,#1B5E20 0%,#2E7D32 60%,#388E3C 100%)', padding:'20px 22px 18px', flexShrink:0, position:'relative', overflow:'hidden' }}>
        <div style={{ position:'absolute', right:-24, top:-24, width:110, height:110, borderRadius:'50%', background:'rgba(255,255,255,0.07)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', right:50, bottom:-30, width:72, height:72, borderRadius:'50%', background:'rgba(255,255,255,0.05)', pointerEvents:'none' }}/>

        <div style={{ display:'flex', alignItems:'center', gap:12, marginBottom:12 }}>
          <button
            onClick={() => navigate('/dashboard')}
            style={{ background:'rgba(255,255,255,0.18)', border:'none', borderRadius:12, width:38, height:38, display:'flex', alignItems:'center', justifyContent:'center', cursor:'pointer', color:'#fff', flexShrink:0, transition:'background 0.15s' }}
            onMouseEnter={(e) => e.currentTarget.style.background='rgba(255,255,255,0.28)'}
            onMouseLeave={(e) => e.currentTarget.style.background='rgba(255,255,255,0.18)'}
          >
            <IcArrowLeft/>
          </button>
          <div>
            <div style={{ fontSize:13, fontWeight:700, color:'rgba(255,255,255,0.6)', letterSpacing:'1.8px', textTransform:'uppercase', marginBottom:3 }}>
              INTEGRA+ — CÁLCULO INTEGRAL
            </div>
            <div style={{ fontSize:18, fontWeight:900, color:'#fff', letterSpacing:'-0.3px' }}>
              Ruta de aprendizaje
            </div>
          </div>
        </div>

        {/* Progress bar */}
        <div style={{ background:'rgba(255,255,255,0.18)', borderRadius:6, height:8, overflow:'hidden', marginBottom:6 }}>
          <div style={{ background:'linear-gradient(90deg,#A8FF3A,#58CC02)', height:'100%', borderRadius:6, width: total > 0 ? `${(completados/total)*100}%` : '0%', transition:'width 1.3s cubic-bezier(0.4,0,0.2,1)', boxShadow:'0 0 10px rgba(168,255,58,0.6)' }}/>
        </div>
        <div style={{ fontSize:15, color:'rgba(255,255,255,0.75)', fontWeight:600 }}>
          {completados} de {total} niveles completados
        </div>
      </div>

      {/* ── Scrollable ── */}
      <div style={{ flex:1, overflowY:'auto' }}>

        {/* SIGMA */}
        <div style={{ padding:'14px 16px 0' }}>
          <SigmaBubble state={completados === total && total > 0 ? 'celebracion' : 'neutral'}>
            {sigmaMsg}
          </SigmaBubble>
        </div>

        {/* Cards grid */}
        <div style={{ padding:'4px 16px 24px' }}>
          <div style={{ fontSize:14, fontWeight:800, color: t.text3, textTransform:'uppercase', letterSpacing:'1px', marginBottom:14, paddingLeft:2 }}>
            {loading ? 'Cargando niveles…' : `${total} niveles disponibles`}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {loading
              ? [0,1,2].map(i => <SkeletonCard key={i} delay={i*0.08}/>)
              : allCards.map((c, i) => (
                  <LevelCard
                    key={i} course={c} idx={i}
                    onTheory={goToTheory} onPractice={goToPractice}
                    special={c.levelKey === -1}
                    onDemo={c.levelKey === 0 ? goToDemo : undefined}
                  />
                ))
            }
          </div>
        </div>
      </div>

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(20px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes card3D {
          0%   { opacity:0; transform:perspective(800px) rotateX(28deg) rotateY(-10deg) scale(0.8) translateY(28px); }
          60%  { opacity:1; }
          100% { opacity:1; transform:perspective(800px) rotateX(0) rotateY(0) scale(1) translateY(0); }
        }
        @keyframes pulse {
          0%,100% { transform:scale(1);    opacity:1;    }
          50%      { transform:scale(1.12); opacity:0.82; }
        }
        @keyframes skelPulse {
          0%,100% { opacity:0.5; }
          50%     { opacity:1;   }
        }
      `}</style>
    </div>
  );
}
