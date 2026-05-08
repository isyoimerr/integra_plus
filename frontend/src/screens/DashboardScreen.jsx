import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { useProgress } from '../contexts/ProgressContext';
import { userService } from '../services/user.service';
import { LEVEL_CONFIG } from '../data/levelConfig';
import SigmaBubble from '../components/sigma/SigmaBubble';
import SigmaLogo from '../components/sigma/SigmaLogo';
import AchievementBadges from '../components/ui/AchievementBadges';
import WeeklyActivityChart from '../components/ui/WeeklyActivityChart';

/* ─── Icons ──────────────────────────────────────────────────────────────── */
const IcFlame = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2C10 5.5 8 8.5 8 11.5c0 2.5 1.6 4.5 4 4.5s4-2 4-4.5c0-1.5-.6-2.8-1.2-3.8C14.2 9.8 13 11 12 11c0 0 2.5-3.5 0-9z" fill="#FF9600"/>
    <path d="M12 14c-1.1 0-2-.9-2-2 0 2.8 1 5.5 2 7.5 1-2 2-4.7 2-7.5 0 1.1-.9 2-2 2z" fill="#FF5C00"/>
  </svg>
);
const IcStar = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" fill="#FFD700" stroke="none"/>
  </svg>
);
const IcShield = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <path d="M12 2L4 6v6c0 4.4 3.4 8.5 8 10 4.6-1.5 8-5.6 8-10V6L12 2z" fill="#1CB0F6" stroke="none"/>
    <path d="M9 12l2 2 4-4" fill="none" stroke="rgba(255,255,255,0.9)" strokeWidth="2"/>
  </svg>
);
const IcTarget = ({ size = 22, color = '#58CC02' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24">
    <circle cx="12" cy="12" r="10" fill={color + '22'} stroke={color} strokeWidth="2"/>
    <circle cx="12" cy="12" r="6"  fill={color + '33'} stroke={color} strokeWidth="1.5"/>
    <circle cx="12" cy="12" r="2.5" fill={color} stroke="none"/>
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
const IcRefresh = ({ size = 17 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
    <path d="M3 12a9 9 0 0 1 15-6.7L21 8M21 3v5h-5"/>
    <path d="M21 12a9 9 0 0 1-15 6.7L3 16M3 21v-5h5"/>
  </svg>
);
const IcLibrary = ({ size = 24, color = '#fff' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <line x1="12" y1="6" x2="16" y2="6"/><line x1="12" y1="10" x2="16" y2="10"/>
  </svg>
);

/* ─── Math decorations per level ─────────────────────────────────────────── */
const MATH_DECO = ['∂', '∫', 'Δ', '∞'];

/* ─── Stat Card ──────────────────────────────────────────────────────────── */
function StatCard({ icon, value, label, accent, delay = 0 }) {
  const { t } = useTheme();
  return (
    <div style={{
      background: t.cardBg, border: `1.5px solid ${t.cardBorder}`,
      borderRadius: 18, padding: '14px 16px',
      display: 'flex', alignItems: 'center', gap: 12,
      flex: 1, minWidth: 0,
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)',
      animation: `fadeSlideUp 0.5s ease ${delay}s both`,
    }}>
      <div style={{ width: 44, height: 44, borderRadius: 14, background: `${accent}18`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 22, fontWeight: 900, color: t.text, letterSpacing: '-0.5px', lineHeight: 1.1 }}>{value}</div>
        <div style={{ fontSize: 11, color: t.text3, fontWeight: 600, marginTop: 2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{label}</div>
      </div>
    </div>
  );
}

/* ─── Skeleton ───────────────────────────────────────────────────────────── */
function SkeletonCard({ delay = 0 }) {
  const { t } = useTheme();
  return (
    <div style={{ borderRadius: 20, overflow: 'hidden', animation: `fadeSlideUp 0.4s ease ${delay}s both` }}>
      <div style={{ height: 90, background: t.progressBg, animation: 'skeletonShine 1.6s ease-in-out infinite' }}/>
      <div style={{ padding: '12px 14px 14px', background: t.cardBg, border: `1.5px solid ${t.cardBorder}`, borderTop: 'none', borderRadius: '0 0 20px 20px' }}>
        {[65, 100, 34].map((w, i) => (
          <div key={i} style={{ height: i === 2 ? 34 : i === 0 ? 13 : 8, background: t.progressBg, borderRadius: 6, marginBottom: 8, width: `${w}%`, animation: `skeletonShine 1.6s ease-in-out ${i*0.1}s infinite` }}/>
        ))}
      </div>
    </div>
  );
}

/* ─── 3D Module Card ─────────────────────────────────────────────────────── */
function ModuleCard({ course: c, idx, onTheory, onPractice, special, onDemo }) {
  const { t } = useTheme();
  const cardRef   = useRef(null);
  const glareRef  = useRef(null);
  const [pressed, setPressed] = useState(false);

  const mainColor = c.locked ? '#AFAFAF' : c.completed ? '#56CC02' : c.color;
  const headerGrad = c.locked
    ? 'linear-gradient(140deg,#C0C0C0,#A0A0A0)'
    : c.completed
      ? 'linear-gradient(140deg,#6EE000,#3DA800)'
      : special
        ? `linear-gradient(140deg, ${c.color}, ${c.color}BB)`
        : `linear-gradient(140deg, ${c.color}EE, ${c.color}AA)`;

  /* ── 3D tilt on mouse move ── */
  const onMouseMove = (e) => {
    if (c.locked) return;
    const el   = cardRef.current;
    const rect = el.getBoundingClientRect();
    const x    = e.clientX - rect.left;
    const y    = e.clientY - rect.top;
    const cx   = rect.width  / 2;
    const cy   = rect.height / 2;
    const rotX = ((y - cy) / cy) * -10;
    const rotY = ((x - cx) / cx) *  12;

    el.style.transform = `perspective(900px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(1.04) translateZ(12px)`;
    el.style.boxShadow = `0 20px 50px ${mainColor}40, 0 6px 20px rgba(0,0,0,0.15)`;

    /* glare position */
    if (glareRef.current) {
      const gx = (x / rect.width)  * 100;
      const gy = (y / rect.height) * 100;
      glareRef.current.style.background =
        `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.28) 0%, transparent 65%)`;
      glareRef.current.style.opacity = '1';
    }
  };

  const onMouseLeave = () => {
    const el = cardRef.current;
    if (!el) return;
    el.style.transform = 'perspective(900px) rotateX(0) rotateY(0) scale(1) translateZ(0)';
    el.style.boxShadow = c.locked
      ? '0 3px 12px rgba(0,0,0,0.07)'
      : `0 4px 20px ${mainColor}22`;
    if (glareRef.current) glareRef.current.style.opacity = '0';
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        borderRadius: 20, overflow: 'hidden',
        border: `2px solid ${c.locked ? t.cardBorder : mainColor + '30'}`,
        boxShadow: c.locked ? '0 3px 12px rgba(0,0,0,0.07)' : `0 4px 20px ${mainColor}22`,
        opacity: c.locked ? 0.7 : 1,
        animation: `card3DEntry 0.55s cubic-bezier(0.34,1.3,0.64,1) ${idx * 0.1}s both`,
        transition: 'transform 0.35s cubic-bezier(0.23,1,0.32,1), box-shadow 0.35s ease',
        cursor: c.locked ? 'not-allowed' : 'default',
        position: 'relative',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
      }}
    >
      {/* ── Glare overlay ── */}
      <div ref={glareRef} style={{
        position: 'absolute', inset: 0, zIndex: 10,
        borderRadius: 18, pointerEvents: 'none',
        opacity: 0, transition: 'opacity 0.2s',
      }}/>

      {/* ── Header ── */}
      <div style={{
        background: headerGrad,
        padding: '14px 14px 12px',
        position: 'relative', overflow: 'hidden',
        minHeight: 94,
        display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
      }}>
        {/* Decorative circle bubbles */}
        <div style={{ position:'absolute', right:-18, top:-18, width:80, height:80, borderRadius:'50%', background:'rgba(255,255,255,0.12)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', right:28, bottom:-24, width:56, height:56, borderRadius:'50%', background:'rgba(255,255,255,0.08)', pointerEvents:'none' }}/>

        {/* Math decoration */}
        <div aria-hidden style={{
          position:'absolute', right:8, bottom:-14,
          fontSize: 80, fontWeight:900, lineHeight:1,
          color:'rgba(255,255,255,0.13)',
          fontFamily:'"Georgia","Times New Roman",serif',
          userSelect:'none', pointerEvents:'none', letterSpacing:'-3px',
        }}>
          {special ? '∞' : MATH_DECO[idx % MATH_DECO.length]}
        </div>

        {/* Top row: status pill + icon */}
        <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', zIndex:1 }}>
          <span style={{
            background:'rgba(255,255,255,0.22)', borderRadius:20,
            padding:'3px 10px', fontSize:9, fontWeight:800,
            color:'#fff', textTransform:'uppercase', letterSpacing:'0.9px',
          }}>
            {special ? 'Próximamente' : c.locked ? 'Bloqueado' : c.completed ? 'Completado' : 'Disponible'}
          </span>

          <div style={{
            width:42, height:42, borderRadius:'50%',
            background:'rgba(255,255,255,0.2)',
            display:'flex', alignItems:'center', justifyContent:'center',
            animation: (!c.locked && !c.completed && !special) ? 'pulseSoft 2.6s ease-in-out infinite' : 'none',
          }}>
            {c.locked
              ? <IcLock />
              : c.completed
                ? <IcCheck />
                : special
                  ? <IcLibrary size={22} />
                  : <SigmaLogo state="celebracion" size={30} />
            }
          </div>
        </div>

        {/* Level label */}
        <div style={{ zIndex:1 }}>
          <span style={{ fontSize:12, fontWeight:700, color:'rgba(255,255,255,0.8)', letterSpacing:'0.3px' }}>
            {special ? 'Recursos' : `Nivel ${idx + 1}`}
          </span>
        </div>
      </div>

      {/* ── Body ── */}
      <div style={{ background: t.cardBg, padding:'12px 14px 14px' }}>
        <div style={{ fontSize:13, fontWeight:800, color: t.text, marginBottom:3, lineHeight:1.3 }}>
          {c.title}
        </div>
        {c.subtitle && (
          <div style={{ fontSize:11, color: t.text3, marginBottom:10, lineHeight:1.4 }}>{c.subtitle}</div>
        )}

        {/* Progress bar */}
        {c.progress !== null && !special && (
          <div style={{ marginBottom:11 }}>
            <div style={{ background: t.progressBg, borderRadius:4, height:6, overflow:'hidden' }}>
              <div style={{
                height:'100%', borderRadius:4,
                width:`${c.progress}%`,
                background: c.locked ? '#D0D0D0' : c.completed ? '#56CC02' : mainColor,
                transition:'width 1.2s cubic-bezier(0.4,0,0.2,1)',
                boxShadow: !c.locked && !c.completed ? `0 0 8px ${mainColor}88` : 'none',
              }}/>
            </div>
            <div style={{ display:'flex', justifyContent:'flex-end', marginTop:3 }}>
              <span style={{ fontSize:10, fontWeight:700, color: mainColor }}>{c.progress}%</span>
            </div>
          </div>
        )}

        {/* Completed badge */}
        {c.completed && c.done !== null && (
          <div style={{ display:'flex', alignItems:'center', gap:6, background:'#56CC0212', borderRadius:8, padding:'5px 8px', marginBottom:10 }}>
            <IcStar size={13} />
            <span style={{ fontSize:10, fontWeight:700, color:'#2E9400' }}>{c.done} ejercicios completados</span>
          </div>
        )}

        {/* Buttons */}
        {special ? (
          <div style={{ textAlign:'center', padding:'6px 4px 2px' }}>
            <span style={{
              display:'inline-block', background:`${c.color}18`,
              color: c.color, fontSize:11, fontWeight:700,
              borderRadius:20, padding:'5px 16px',
              border:`1.5px solid ${c.color}44`,
            }}>
              Disponible próximamente
            </span>
          </div>
        ) : !c.locked ? (
          <div style={{ display:'flex', flexDirection:'column', gap:7 }}>
            <div style={{ display:'flex', gap:7 }}>
              <button
                onClick={() => onTheory(c.levelKey)}
                onMouseEnter={(e) => { e.currentTarget.style.background=`${mainColor}22`; e.currentTarget.style.borderColor=mainColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.background=`${mainColor}0E`; e.currentTarget.style.borderColor=`${mainColor}55`; }}
                style={{
                  flex:1, padding:'9px 0', borderRadius:12,
                  border:`2px solid ${mainColor}55`, background:`${mainColor}0E`,
                  color: mainColor, fontSize:12, fontWeight:700, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:4,
                  transition:'background 0.15s, border-color 0.15s',
                }}
              >
                <IcBook size={13} color={mainColor}/> Teoría
              </button>
              <button
                onClick={() => onPractice(c.levelKey)}
                onMouseDown={() => setPressed(true)}
                onMouseUp={() => setPressed(false)}
                onMouseLeave={() => setPressed(false)}
                style={{
                  flex:1, padding:'9px 0', borderRadius:12,
                  border:'none', background: mainColor, color:'#fff',
                  fontSize:12, fontWeight:800, cursor:'pointer',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:4,
                  boxShadow: pressed ? `0 1px 0 ${mainColor}99` : `0 4px 0 ${mainColor}99`,
                  transform: pressed ? 'translateY(3px)' : 'translateY(0)',
                  transition:'transform 0.1s, box-shadow 0.1s',
                }}
              >
                <IcPen size={12}/> Practicar
              </button>
            </div>
            {onDemo && (
              <button
                onClick={onDemo}
                onMouseEnter={(e) => { e.currentTarget.style.background=`${mainColor}18`; e.currentTarget.style.borderColor=mainColor; }}
                onMouseLeave={(e) => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor=`${mainColor}44`; }}
                style={{
                  width:'100%', padding:'8px 0', borderRadius:12,
                  border:`1.5px dashed ${mainColor}44`,
                  background:'transparent',
                  color: mainColor, fontSize:11, fontWeight:800,
                  cursor:'pointer', letterSpacing:'0.3px',
                  display:'flex', alignItems:'center', justifyContent:'center', gap:5,
                  transition:'background 0.15s, border-color 0.15s',
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="5 3 19 12 5 21 5 3"/>
                </svg>
                Demo gratuita — sin cuenta
              </button>
            )}
          </div>
        ) : (
          <div style={{ textAlign:'center', padding:'6px 4px 0', fontSize:10, color: t.text3, fontWeight:600 }}>
            Completa el nivel anterior para desbloquear
          </div>
        )}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════════════════════════ */
export default function DashboardScreen() {
  const navigate = useNavigate();
  const { user, token } = useAuth();
  const { t } = useTheme();
  const { levels, setSelectedLevel, setExerciseIdx, fetchAll, getProgreso, isUnlocked } = useProgress();
  const [stats,   setStats]   = useState({ puntos:0, racha:0, nivelActual:1, nivelesTotales:3, porcentajeCompletado:0 });
  const [loading, setLoading] = useState(true);

  const hour     = new Date().getHours();
  const greeting = hour < 12 ? 'Buenos días' : hour < 18 ? 'Buenas tardes' : 'Buenas noches';

  useEffect(() => {
    if (!token) { setLoading(false); return; }
    setLoading(true);
    Promise.all([
      fetchAll(),
      userService.getStats(token).then(setStats).catch(() => {}),
    ]).finally(() => setLoading(false));
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
          locked:    levelKey > 0,
          completed: false,
        };
      });

  /* Extra card: Recursos Didácticos */
  const recursosCard = {
    levelKey: -1,
    title: 'Recursos Didácticos',
    subtitle: 'Fórmulas, tablas y material de apoyo',
    color: '#E67E22',
    progress: null,
    done: null,
    locked: false,
    completed: false,
  };

  const allCards     = [...courses, recursosCard];
  const showSkeleton = loading;

  return (
    <div style={{
      flex:1, display:'flex', flexDirection:'column',
      background: t.appBg, overflow:'hidden',
      fontFamily:"'DM Sans','Nunito','Segoe UI',sans-serif",
    }}>

      {/* ══ TOP BAR ═══════════════════════════════════════════════════════════ */}
      <div style={{
        background: t.cardBg, borderBottom:`2px solid ${t.cardBorder}`,
        padding:'10px 20px', display:'flex', alignItems:'center',
        justifyContent:'space-between', flexShrink:0,
        boxShadow:'0 2px 12px rgba(0,0,0,0.04)', zIndex:10,
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          <div style={{
            width:38, height:38, borderRadius:'50%',
            background:`linear-gradient(135deg,${t.primary},${t.primaryDark||t.primary})`,
            display:'flex', alignItems:'center', justifyContent:'center',
            color:'#fff', fontSize:16, fontWeight:900,
            boxShadow:`0 3px 10px ${t.primary}55`, flexShrink:0,
          }}>
            {(user?.nombre||'E')[0].toUpperCase()}
          </div>
          <div>
            <div style={{ fontSize:10, color: t.text3, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.7px' }}>{greeting}</div>
            <div style={{ fontSize:16, fontWeight:900, color: t.text, letterSpacing:'-0.4px', lineHeight:1.1 }}>{user?.nombre||'Estudiante'}</div>
          </div>
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          {[
            { icon:<IcFlame size={20}/>,  val:stats.racha,  color:'#FF9600' },
            { icon:<IcStar  size={20}/>,  val:stats.puntos, color:'#D4A017' },
            { icon:<IcShield size={20}/>, val:`Nv.${stats.nivelActual}`, color:'#1CB0F6' },
          ].map(({ icon, val, color }, i) => (
            <div key={i} style={{ display:'flex', alignItems:'center', gap:3 }}>
              {icon}
              <span style={{ fontSize:15, fontWeight:900, color }}>{val}</span>
            </div>
          ))}
          <button
            onClick={() => { setLoading(true); Promise.all([fetchAll(), userService.getStats(token).then(setStats).catch(()=>{})]).finally(()=>setLoading(false)); }}
            style={{ background:'none', border:'none', cursor:'pointer', padding:5, color: t.text3, display:'flex', alignItems:'center', borderRadius:8 }}
          >
            <IcRefresh/>
          </button>
        </div>
      </div>

      {/* ══ SCROLLABLE ════════════════════════════════════════════════════════ */}
      <div style={{ flex:1, overflowY:'auto' }}>

        {/* ── Section banner ── */}
        <div style={{
          background:'linear-gradient(150deg,#1B5E20 0%,#2E7D32 60%,#388E3C 100%)',
          padding:'20px 24px 18px', position:'relative', overflow:'hidden',
        }}>
          {[[-28,-28,110,110],[ 36,-32, 72, 72],[-20,-20, 80, 80]].map(([r,b,w,h],i) => (
            <div key={i} style={{ position:'absolute', right:i===2?'auto':r, left:i===2?r:undefined, top:i===1?'auto':undefined, bottom:i===1?b:undefined, top:i!==1?b:undefined, width:w, height:h, borderRadius:'50%', background:`rgba(255,255,255,${0.07-i*0.02})`, pointerEvents:'none' }}/>
          ))}
          <div style={{ fontSize:10, fontWeight:700, color:'rgba(255,255,255,0.6)', letterSpacing:'1.8px', textTransform:'uppercase', marginBottom:4 }}>
            INTEGRA+ — CÁLCULO INTEGRAL
          </div>
          <div style={{ fontSize:19, fontWeight:900, color:'#fff', marginBottom:14, letterSpacing:'-0.3px' }}>
            Tu ruta de aprendizaje
          </div>
          <div style={{ background:'rgba(255,255,255,0.18)', borderRadius:6, height:8, overflow:'hidden', marginBottom:7 }}>
            <div style={{ background:'linear-gradient(90deg,#A8FF3A,#58CC02)', height:'100%', borderRadius:6, width:`${stats.porcentajeCompletado||0}%`, transition:'width 1.3s cubic-bezier(0.4,0,0.2,1)', boxShadow:'0 0 10px rgba(168,255,58,0.6)' }}/>
          </div>
          <div style={{ fontSize:12, color:'rgba(255,255,255,0.75)', fontWeight:600 }}>
            {stats.porcentajeCompletado}% completado · Nivel {stats.nivelActual} de {stats.nivelesTotales}
          </div>
        </div>

        {/* ── Stat cards 2×2 ── */}
        <div style={{ padding:'16px 16px 0', display:'flex', flexDirection:'column', gap:10 }}>
          <div style={{ display:'flex', gap:10 }}>
            <StatCard icon={<IcFlame size={24}/>}  value={stats.racha}  label="días de racha"  accent="#FF9600" delay={0}   />
            <StatCard icon={<IcStar size={24}/>}   value={stats.puntos} label="puntos totales" accent="#F5A623" delay={0.05}/>
          </div>
          <div style={{ display:'flex', gap:10 }}>
            <StatCard icon={<IcShield size={24}/>} value={`${stats.nivelActual}/${stats.nivelesTotales}`} label="nivel actual" accent="#1CB0F6" delay={0.1}/>
            <StatCard icon={<IcTarget size={24} color={t.primary}/>} value={`${stats.porcentajeCompletado}%`} label="completado" accent={t.primary} delay={0.15}/>
          </div>
        </div>

        {/* ── SIGMA ── */}
        <div style={{ padding:'14px 16px 0' }}>
          <SigmaBubble state="celebracion">
            {stats.racha > 0
              ? `¡${stats.racha} días seguidos! ¿Listo/a, ${user?.nombre||'campeón'}?`
              : `¡Bienvenido/a, ${user?.nombre||'campeón'}! Hoy es un buen día para aprender.`}
          </SigmaBubble>
        </div>

        {/* ── Module 3D grid ── */}
        <div style={{ padding:'4px 16px 20px' }}>
          <div style={{ fontSize:11, fontWeight:800, color: t.text3, textTransform:'uppercase', letterSpacing:'1px', marginBottom:12, paddingLeft:2 }}>
            {showSkeleton ? 'Cargando niveles…' : 'Tus niveles'}
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
            {showSkeleton
              ? [0,1,2].map(i => <SkeletonCard key={i} delay={i*0.08}/>)
              : allCards.map((c, i) => (
                  <ModuleCard
                    key={i} course={c} idx={i}
                    onTheory={goToTheory} onPractice={goToPractice}
                    special={c.levelKey === -1}
                    onDemo={c.levelKey === 0 ? goToDemo : undefined}
                  />
                ))
            }
          </div>
        </div>

        {/* ── Weekly chart ── */}
        <div style={{ padding:'0 16px 16px' }}>
          <WeeklyActivityChart type="bar" showLegend={true}/>
        </div>

        {/* ── Achievements ── */}
        <div style={{ background: t.cardBg, margin:'0 16px 16px', borderRadius:18, padding:'16px 18px', border:`1.5px solid ${t.cardBorder}`, boxShadow:'0 2px 10px rgba(0,0,0,0.05)' }}>
          <AchievementBadges
            achievements={['first_complete','three_day_streak','level_master','all_stars','speed_demon','perfect_week','thousand_points','teacher_mode']}
            earned={stats.racha > 0 ? ['first_complete','three_day_streak'] : ['first_complete']}
            showTitle={true}
          />
        </div>

        <div style={{ height:32 }}/>
      </div>

      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity:0; transform:translateY(22px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes card3DEntry {
          0%   { opacity:0; transform:perspective(900px) rotateX(30deg) rotateY(-8deg) scale(0.82) translateY(30px); }
          60%  { opacity:1; }
          100% { opacity:1; transform:perspective(900px) rotateX(0) rotateY(0) scale(1) translateY(0); }
        }
        @keyframes pulseSoft {
          0%,100% { transform:scale(1);    opacity:1;    }
          50%      { transform:scale(1.12); opacity:0.82; }
        }
        @keyframes skeletonShine {
          0%   { opacity:0.6; }
          50%  { opacity:1;   }
          100% { opacity:0.6; }
        }
      `}</style>
    </div>
  );
}
