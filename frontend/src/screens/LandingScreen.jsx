import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import SigmaLogo from '../components/sigma/SigmaLogo';

/* ─── Breakpoint hook ─────────────────────────────────────────── */
function useBreakpoint() {
  const [w, setW] = useState(() => window.innerWidth);
  useEffect(() => {
    const h = () => setW(window.innerWidth);
    window.addEventListener('resize', h);
    return () => window.removeEventListener('resize', h);
  }, []);
  return { isMobile: w < 640, isTablet: w >= 640 && w < 1024, isDesktop: w >= 1024, width: w };
}

/* ─── Iconos CSS puro ─────────────────────────────────────────── */
function StepIcon({ type, color, size = 52 }) {
  const s = size;
  if (type === 'radar') return (
    <div style={{ position:'relative', width:s, height:s, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      {[1, 0.68, 0.38].map((ratio, i) => (
        <div key={i} style={{
          position:'absolute',
          width:s * ratio, height:s * ratio,
          borderRadius:'50%',
          border:`1.5px solid ${color}`,
          opacity:0.14 + i * 0.27,
          animation:`orbPulse ${2.2 + i * 0.55}s ease-in-out ${i * 0.48}s infinite`,
        }} />
      ))}
      <div style={{ width:s * 0.16, height:s * 0.16, borderRadius:'50%', background:color, boxShadow:`0 0 ${s * 0.22}px ${color}`, zIndex:1 }} />
    </div>
  );
  if (type === 'bolt') return (
    <div style={{ width:s, height:s, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <div style={{
        width:s * 0.44, height:s * 0.72,
        clipPath:'polygon(66% 0%,24% 49%,53% 49%,34% 100%,76% 51%,47% 51%)',
        background:`linear-gradient(175deg, ${color} 0%, ${color}77 100%)`,
        filter:`drop-shadow(0 0 7px ${color})`,
        animation:`dotPulse 2.2s ease-in-out infinite`,
      }} />
    </div>
  );
  if (type === 'star') return (
    <div style={{ width:s, height:s, display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
      <div style={{
        width:s * 0.7, height:s * 0.7,
        clipPath:'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
        background:`linear-gradient(140deg, ${color} 0%, ${color}66 100%)`,
        filter:`drop-shadow(0 0 9px ${color})`,
        animation:`sigmaFloat 3s ease-in-out infinite`,
      }} />
    </div>
  );
  return null;
}

function FeatIcon({ type, color }) {
  const c = color || '#69F0AE';
  if (type === 'chat') return (
    <div style={{ position:'relative', width:30, height:30, flexShrink:0, marginTop:1 }}>
      <div style={{ width:26, height:20, borderRadius:'7px 7px 7px 2px', border:`2px solid ${c}`, position:'absolute', top:0, left:0, boxShadow:`0 0 8px ${c}33` }} />
      <div style={{
        position:'absolute', bottom:1, left:5,
        width:0, height:0,
        borderLeft:'5px solid transparent',
        borderTop:`6px solid ${c}`,
      }} />
      {[6,13,20].map(x => (
        <div key={x} style={{ position:'absolute', top:7, left:x, width:5, height:2, borderRadius:1, background:c, opacity:0.7 }} />
      ))}
    </div>
  );
  if (type === 'adapt') return (
    <div style={{ position:'relative', width:30, height:30, flexShrink:0, marginTop:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ position:'absolute', width:28, height:28, borderRadius:'50%', border:`1.5px solid ${c}55`, animation:`orbit 6s linear infinite` }} />
      <div style={{ position:'absolute', width:18, height:18, borderRadius:'50%', border:`1.5px solid ${c}88`, animation:`orbit 4s linear reverse infinite` }} />
      <div style={{ width:6, height:6, borderRadius:'50%', background:c, boxShadow:`0 0 6px ${c}` }} />
    </div>
  );
  if (type === 'star') return (
    <div style={{ width:30, height:30, flexShrink:0, marginTop:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{
        width:22, height:22,
        clipPath:'polygon(50% 0%,61% 35%,98% 35%,68% 57%,79% 91%,50% 70%,21% 91%,32% 57%,2% 35%,39% 35%)',
        background:c,
        filter:`drop-shadow(0 0 5px ${c})`,
        animation:`dotPulse 2.5s ease-in-out infinite`,
      }} />
    </div>
  );
  if (type === 'ring') return (
    <div style={{ position:'relative', width:30, height:30, flexShrink:0, marginTop:1, display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:26, height:26, borderRadius:'50%', border:`2px solid ${c}`, boxShadow:`0 0 10px ${c}44`, animation:`orbPulse 2s ease-in-out infinite` }} />
      <div style={{ position:'absolute', width:2, height:8, background:c, top:4, left:'50%', transform:'translateX(-50%)', borderRadius:2 }} />
      <div style={{ position:'absolute', width:7, height:2, background:c, top:'50%', left:'50%', transform:'translateY(-50%)', borderRadius:2 }} />
    </div>
  );
  return null;
}

/* ─── Datos ───────────────────────────────────────────────────── */
const SYMBOLS = ['∫', 'Σ', 'dx', 'π', '∂', '∞', '√', 'Δ', 'lim', '∇', '∮', 'θ', 'λ', 'f′'];

const FEATURES = [
  { icon: '🎯', title: 'Aprendizaje progresivo', desc: 'Niveles diseñados para avanzar paso a paso' },
  { icon: '🤖', title: 'Asistente SIGMA',         desc: 'IA que guía y adapta el ritmo de estudio' },
  { icon: '⚡', title: 'Ejercicios interactivos', desc: 'Practica con retroalimentación inmediata' },
];

const STATS = [
  { value: '5+',   label: 'Módulos'   },
  { value: '14+',  label: 'Ejercicios'},
  { value: '100%', label: 'Gratuito'  },
];

const SIGMA_CYCLE = ['neutral', 'celebracion', 'apoyo', 'neutral', 'celebracion'];

/* ─── Datos nuevas secciones ──────────────────────────────────── */
const STEPS = [
  { num:'01', iconType:'radar', color:'#69F0AE', title:'Elige tu módulo',    desc:'Navega por el mapa de aprendizaje y selecciona el tema que quieres dominar a tu ritmo.' },
  { num:'02', iconType:'bolt',  color:'#FFD54F', title:'Resuelve los retos', desc:'Enfrenta ejercicios interactivos con retroalimentación inmediata. Cada error es una lección.' },
  { num:'03', iconType:'star',  color:'#FF8A65', title:'Sube de nivel',      desc:'Gana XP, desbloquea insignias y celebra cada victoria junto a SIGMA.' },
];

const PATH_NODES = [
  { label:'Repaso de Bases',     symbol:'√', xp:'75 XP',  color:'#69F0AE', colorDim:'rgba(105,240,174,0.15)' },
  { label:'Integral Indefinida', symbol:'∫', xp:'105 XP', color:'#64B5F6', colorDim:'rgba(100,181,246,0.15)' },
  { label:'Sustitución u',       symbol:'u', xp:'150 XP', color:'#CE93D8', colorDim:'rgba(206,147,216,0.15)' },
  { label:'Integral por Partes', symbol:'∂', xp:'180 XP', color:'#FFD54F', colorDim:'rgba(255,213,79,0.15)'  },
  { label:'Integral Definida',   symbol:'Σ', xp:'200 XP', color:'#FF8A65', colorDim:'rgba(255,138,101,0.15)' },
];

const SIGMA_FEATURES = [
  { iconType:'chat',  color:'#69F0AE', title:'Explica paso a paso', desc:'Descompone cada problema de forma clara, sin jerga innecesaria.' },
  { iconType:'adapt', color:'#64B5F6', title:'Se adapta a ti',       desc:'Detecta tus puntos débiles y ajusta el ritmo de aprendizaje.' },
  { iconType:'star',  color:'#FFD54F', title:'Celebra tus logros',   desc:'Cada acierto merece reconocimiento. SIGMA lo hace con estilo.' },
  { iconType:'ring',  color:'#CE93D8', title:'Siempre disponible',   desc:'De día o de noche, SIGMA está listo para acompañarte.' },
];

const ORBIT_SYMBOLS = ['∫', '∂', 'dx', '∞'];

/* ─── Componente principal ────────────────────────────────────── */
export default function LandingScreen() {
  const navigate  = useNavigate();
  const { isMobile, isTablet, isDesktop } = useBreakpoint();
  const [particles,   setParticles]  = useState([]);
  const [visible,     setVisible]    = useState(false);
  const [sigmaState,  setSigmaState] = useState('neutral');
  const [sectionsVis, setSectionsVis] = useState({});
  const sigmaTimer  = useRef(null);
  const howRef      = useRef(null);
  const pathRef     = useRef(null);
  const sigmaSecRef = useRef(null);
  const ctaRef      = useRef(null);

  useEffect(() => {
    const count = isMobile ? 12 : 22;
    setParticles(
      Array.from({ length: count }, (_, i) => ({
        id: i,
        symbol:   SYMBOLS[i % SYMBOLS.length],
        x:        Math.random() * 100,
        y:        Math.random() * 100,
        size:     isMobile ? 11 + Math.random() * 14 : 13 + Math.random() * 20,
        duration: 7  + Math.random() * 9,
        delay:    Math.random() * 6,
        opacity:  0.05 + Math.random() * 0.09,
      }))
    );
    setTimeout(() => setVisible(true), 80);
    let idx = 0;
    sigmaTimer.current = setInterval(() => {
      idx = (idx + 1) % SIGMA_CYCLE.length;
      setSigmaState(SIGMA_CYCLE[idx]);
    }, 2800);
    return () => clearInterval(sigmaTimer.current);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    const pairs = [
      { ref: howRef,      key: 'how'   },
      { ref: pathRef,     key: 'path'  },
      { ref: sigmaSecRef, key: 'sigma' },
      { ref: ctaRef,      key: 'cta'  },
    ];
    const observer = new IntersectionObserver(
      (entries) => entries.forEach(entry => {
        if (entry.isIntersecting) {
          const k = entry.target.dataset.section;
          setSectionsVis(prev => ({ ...prev, [k]: true }));
        }
      }),
      { threshold: 0.1 }
    );
    pairs.forEach(({ ref }) => { if (ref.current) observer.observe(ref.current); });
    return () => observer.disconnect();
  }, []);

  const sigmaSize     = isMobile ? 90  : isTablet ? 110 : 150;
  const satelliteSize = isMobile ? 0   : isTablet ? 36  : 48;
  const stageSize     = isMobile ? 0   : isTablet ? 220 : 280;
  const navPad        = isMobile ? '16px 20px' : '20px 40px';
  const contentPad    = isMobile ? '16px 20px 48px' : isTablet ? '24px 32px 56px' : '20px 56px 64px';
  const contentGap    = isDesktop ? 72 : 0;
  const titleSize     = isMobile ? '28px' : isTablet ? '36px' : 'clamp(36px, 3.8vw, 56px)';
  const btnMaxW       = isMobile ? '100%' : '380px';

  return (
    <>
      <style>{`
        @keyframes floatSymbol {
          0%  { transform: translateY(0)     rotate(0deg);  }
          33% { transform: translateY(-20px) rotate(6deg);  }
          66% { transform: translateY(-9px)  rotate(-4deg); }
          100%{ transform: translateY(0)     rotate(0deg);  }
        }
        @keyframes sigmaFloat {
          0%, 100% { transform: translateY(0px)  scale(1);    }
          50%      { transform: translateY(-16px) scale(1.04); }
        }
        @keyframes cardFloat {
          0%, 100% { transform: translateY(0) rotate(var(--rot)); }
          50%      { transform: translateY(-8px) rotate(var(--rot)); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to   { opacity: 1; transform: translateY(0);    }
        }
        @keyframes fadeInLeft {
          from { opacity: 0; transform: translateX(-44px); }
          to   { opacity: 1; transform: translateX(0);    }
        }
        @keyframes fadeInRight {
          from { opacity: 0; transform: translateX(44px); }
          to   { opacity: 1; transform: translateX(0);   }
        }
        @keyframes orbPulse {
          0%, 100% { transform: scale(1);    opacity: 0.38; }
          50%      { transform: scale(1.14); opacity: 0.60; }
        }
        @keyframes shimmerBtn {
          from { background-position: -200% center; }
          to   { background-position:  200% center; }
        }
        @keyframes dotPulse {
          0%, 100% { opacity: 1; transform: scale(1);   }
          50%      { opacity: .5; transform: scale(1.5); }
        }
        @keyframes orbit {
          from { transform: rotate(0deg)   translateX(90px) rotate(0deg);   }
          to   { transform: rotate(360deg) translateX(90px) rotate(-360deg); }
        }
        @keyframes orbitSm {
          from { transform: rotate(0deg)   translateX(68px) rotate(0deg);   }
          to   { transform: rotate(360deg) translateX(68px) rotate(-360deg); }
        }
        @keyframes ctaPulse {
          0%, 100% { box-shadow: 0 0 0 0   rgba(105,240,174,0.65); }
          70%      { box-shadow: 0 0 0 22px rgba(105,240,174,0);    }
        }
        @keyframes glowPop {
          0%, 100% { box-shadow: 0 0 10px 0   rgba(105,240,174,0.3); }
          50%      { box-shadow: 0 0 28px 6px rgba(105,240,174,0.55); }
        }
        @keyframes countIn {
          from { opacity:0; transform: translateY(20px) scale(0.8); }
          to   { opacity:1; transform: translateY(0)    scale(1);   }
        }
        @keyframes arrowBounce {
          0%, 100% { transform: translateX(0); }
          50%      { transform: translateX(5px); }
        }
        @keyframes ctaDiamondSpin {
          from { transform: rotate(0deg) scale(1); }
          50%  { transform: rotate(180deg) scale(1.1); }
          to   { transform: rotate(360deg) scale(1); }
        }

        .landing-sigma { animation: sigmaFloat 4s ease-in-out infinite; }

        .btn-cta {
          background: linear-gradient(135deg, #fff 0%, #e8f5e9 100%);
          color: #1B5E20;
          border: none;
          cursor: pointer;
          font-weight: 900;
          letter-spacing: 0.5px;
          border-radius: 18px;
          box-shadow: 0 10px 36px rgba(0,0,0,0.28), 0 2px 8px rgba(0,0,0,0.14);
          transition: all 0.22s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
          overflow: hidden;
        }
        .btn-cta::before {
          content: '';
          position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent);
          background-size: 200% 100%;
          opacity: 0; transition: opacity 0.3s;
        }
        .btn-cta:hover { transform: translateY(-3px) scale(1.02); box-shadow: 0 18px 48px rgba(0,0,0,0.34); }
        .btn-cta:hover::before { opacity:1; animation: shimmerBtn 0.8s linear; }
        .btn-cta:active  { transform: translateY(0) scale(0.98); }

        .btn-sec {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(10px);
          color: #fff;
          border: 2px solid rgba(255,255,255,0.32);
          cursor: pointer;
          font-weight: 700;
          border-radius: 18px;
          transition: all 0.22s ease;
        }
        .btn-sec:hover { background: rgba(255,255,255,0.18); border-color: rgba(255,255,255,0.65); transform: translateY(-2px); }

        .math-card {
          background: rgba(255,255,255,0.1);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255,255,255,0.22);
          border-radius: 14px;
          padding: 12px 18px;
          color: #fff;
          font-family: Georgia, serif;
          font-weight: 700;
          white-space: nowrap;
          box-shadow: 0 4px 20px rgba(0,0,0,0.2);
          font-size: 14px;
        }
        .feature-chip {
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.13);
          border-radius: 14px;
          display: flex; align-items: flex-start; gap: 12px;
          transition: all 0.2s;
        }
        .feature-chip:hover { background: rgba(255,255,255,0.13); transform: translateY(-2px); }
        .stat-pill {
          background: rgba(255,255,255,0.09);
          border: 1px solid rgba(255,255,255,0.18);
          border-radius: 12px;
          text-align: center;
          flex: 1;
        }
        .dot-pulse { animation: dotPulse 2s ease-in-out infinite; }

        /* ── Secciones nuevas ── */
        .step-card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.09);
          border-radius: 24px;
          padding: 32px 24px;
          transition: all 0.32s cubic-bezier(0.34,1.56,0.64,1);
        }
        .step-card:hover {
          background: rgba(255,255,255,0.1);
          transform: translateY(-10px) scale(1.02);
          box-shadow: 0 28px 56px rgba(0,0,0,0.36);
        }
        .path-node-circle {
          transition: transform 0.28s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.28s;
        }
        .path-node-wrap:hover .path-node-circle {
          transform: scale(1.18) !important;
        }
        .sigma-feat {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px;
          padding: 18px 20px;
          display: flex;
          align-items: flex-start;
          gap: 14px;
          transition: all 0.24s ease;
          cursor: default;
        }
        .sigma-feat:hover {
          background: rgba(105,240,174,0.08);
          border-color: rgba(105,240,174,0.22);
          transform: translateX(7px);
        }
        .cta-btn-final {
          background: linear-gradient(135deg, #69F0AE 0%, #00E676 50%, #69F0AE 100%);
          background-size: 200% 100%;
          color: #1B5E20;
          border: none;
          cursor: pointer;
          font-weight: 900;
          letter-spacing: 1px;
          border-radius: 22px;
          animation: ctaPulse 2.4s ease-in-out infinite, shimmerBtn 3s linear infinite;
          transition: all 0.26s cubic-bezier(0.34,1.56,0.64,1);
        }
        .cta-btn-final:hover {
          transform: translateY(-5px) scale(1.05);
          box-shadow: 0 24px 60px rgba(105,240,174,0.45) !important;
        }
        .cta-arrow { animation: arrowBounce 1.2s ease-in-out infinite; display: inline-block; }
        .big-stat  { animation: countIn 0.6s cubic-bezier(0.34,1.56,0.64,1) both; }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #071c09 0%, #0d3312 25%, #1B5E20 60%, #2E7D32 100%)',
        position: 'relative', overflow: 'hidden', display: 'flex', flexDirection: 'column',
      }}>

        {/* ── Orbs ── */}
        <div style={{ position:'absolute', top:-120, right:-80,  width:500, height:500, borderRadius:'50%', background:'radial-gradient(circle,rgba(76,175,80,.25) 0%,transparent 70%)', animation:'orbPulse 6s ease-in-out infinite', pointerEvents:'none' }} />
        <div style={{ position:'absolute', bottom:-100, left:-60, width:400, height:400, borderRadius:'50%', background:'radial-gradient(circle,rgba(27,94,32,.4) 0%,transparent 70%)',   animation:'orbPulse 8s ease-in-out 2s infinite', pointerEvents:'none' }} />

        {/* ── Partículas ── */}
        {particles.map(p => (
          <div key={p.id} style={{
            position:'absolute', left:`${p.x}%`, top:`${p.y}%`,
            fontSize: p.size, color:'#fff', opacity: p.opacity,
            fontFamily:'Georgia,serif', fontWeight:700,
            animation:`floatSymbol ${p.duration}s ease-in-out ${p.delay}s infinite`,
            pointerEvents:'none', userSelect:'none',
          }}>{p.symbol}</div>
        ))}

        {/* ── Navbar ── */}
        <nav style={{
          display:'flex', alignItems:'center', justifyContent:'space-between',
          padding: navPad, position:'relative', zIndex:10,
          opacity: visible ? 1 : 0,
          transform: visible ? 'none' : 'translateY(-20px)',
          transition: 'opacity 0.6s, transform 0.6s',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:10 }}>
            <div style={{ width:34, height:34, borderRadius:10, background:'rgba(255,255,255,.18)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,.3)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:13, color:'#fff', flexShrink:0 }}>I+</div>
            <span style={{ color:'#fff', fontWeight:800, fontSize: isMobile ? 16 : 18, letterSpacing:'-0.5px' }}>
              INTEGRA<span style={{ color:'#69F0AE' }}>+</span>
            </span>
          </div>
          <button
            onClick={() => navigate('/login')}
            style={{ background:'rgba(255,255,255,.12)', backdropFilter:'blur(8px)', border:'1px solid rgba(255,255,255,.25)', borderRadius:10, padding: isMobile ? '8px 16px' : '9px 22px', color:'#fff', fontWeight:700, fontSize: isMobile ? 13 : 14, cursor:'pointer', transition:'all 0.2s', whiteSpace:'nowrap' }}
            onMouseEnter={e => e.currentTarget.style.background='rgba(255,255,255,.22)'}
            onMouseLeave={e => e.currentTarget.style.background='rgba(255,255,255,.12)'}
          >
            Iniciar sesión
          </button>
        </nav>

        {/* ── Main content ── */}
        <div style={{
          flex:1, display:'flex',
          flexDirection: isDesktop ? 'row' : 'column',
          alignItems:'center',
          justifyContent: isDesktop ? 'center' : 'flex-start',
          padding: contentPad,
          gap: contentGap,
          position:'relative', zIndex:5,
          maxWidth:1200, margin:'0 auto', width:'100%',
        }}>
          {!isMobile && (
            <div style={{
              flex: isDesktop ? 1 : undefined,
              display:'flex', flexDirection:'column',
              alignItems:'center', justifyContent:'center',
              opacity: visible ? 1 : 0,
              animation: visible ? 'fadeInLeft 0.8s ease-out both' : 'none',
              marginBottom: isTablet ? 24 : 0,
            }}>
              <div style={{ position:'relative', width:stageSize, height:stageSize }}>
                <div style={{ position:'absolute', inset:0, borderRadius:'50%', background:'radial-gradient(circle,rgba(105,240,174,.2) 0%,transparent 70%)', pointerEvents:'none' }} />
                <div className="landing-sigma" style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)' }}>
                  <SigmaLogo state={sigmaState} size={sigmaSize} />
                </div>
                {isDesktop && <>
                  <div className="math-card" style={{ position:'absolute', top:8,    right:-12, animation:'cardFloat 5s ease-in-out infinite',        '--rot':'-4deg', transform:'rotate(-4deg)' }}>∫ f(x) dx</div>
                  <div className="math-card" style={{ position:'absolute', bottom:18, left:-18,  animation:'cardFloat 6s ease-in-out 1.5s infinite',   '--rot':'5deg',  transform:'rotate(5deg)'  }}>lim<sub>x→∞</sub> f(x)</div>
                  <div className="math-card" style={{ position:'absolute', top:'55%', right:-28, animation:'cardFloat 7s ease-in-out 0.8s infinite',   '--rot':'-2deg', transform:'rotate(-2deg)' }}>d/dx [xⁿ]</div>
                </>}
                {satelliteSize > 0 && <>
                  <div style={{ position:'absolute', top:-4,  left:8,  opacity:0.7  }}><SigmaLogo state="celebracion" size={satelliteSize} /></div>
                  <div style={{ position:'absolute', bottom:0, right:4, opacity:0.65 }}><SigmaLogo state="apoyo" size={Math.round(satelliteSize * 0.87)} /></div>
                </>}
              </div>
              <div style={{ marginTop:24, textAlign:'center' }}>
                <div style={{ color:'rgba(255,255,255,.45)', fontSize:14, letterSpacing:'2px', textTransform:'uppercase', marginBottom:4 }}>Tu asistente</div>
                <div style={{ color:'#69F0AE', fontSize: isTablet ? 17 : 20, fontWeight:900, letterSpacing:'-0.5px' }}>SIGMA</div>
              </div>
            </div>
          )}

          <div style={{
            flex: isDesktop ? 1 : undefined,
            display:'flex', flexDirection:'column',
            alignItems: isMobile ? 'center' : isTablet ? 'center' : 'flex-start',
            textAlign: isMobile ? 'center' : isTablet ? 'center' : 'left',
            width:'100%',
            maxWidth: isDesktop ? 'none' : 520,
            opacity: visible ? 1 : 0,
            animation: visible ? (isDesktop ? 'fadeInRight 0.8s ease-out 0.15s both' : 'fadeInUp 0.7s ease-out 0.1s both') : 'none',
          }}>
            {isMobile && (
              <div className="landing-sigma" style={{ marginBottom:20 }}>
                <SigmaLogo state={sigmaState} size={sigmaSize} />
              </div>
            )}
            <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(105,240,174,.11)', border:'1px solid rgba(105,240,174,.28)', borderRadius:100, padding:'6px 14px', marginBottom:20 }}>
              <div className="dot-pulse" style={{ width:7, height:7, borderRadius:'50%', background:'#69F0AE', boxShadow:'0 0 7px #69F0AE', flexShrink:0 }} />
              <span style={{ color:'#69F0AE', fontSize: isMobile ? 11 : 12, fontWeight:700, letterSpacing:'0.4px' }}>Plataforma educativa gratuita</span>
            </div>
            <h1 style={{ fontSize: titleSize, fontWeight:900, color:'#fff', letterSpacing: isMobile ? '-1px' : '-2px', lineHeight:1.1, marginBottom: isMobile ? 16 : 20 }}>
              ¡La forma{isMobile ? ' ' : <br />}
              <span style={{ background:'linear-gradient(90deg,#A5D6A7,#69F0AE,#B9F6CA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>
                divertida y efectiva
              </span>
              {isMobile ? ' ' : <br />}
              de aprender{isMobile ? ' ' : <br />}
              Cálculo Integral!
            </h1>
            <p style={{ color:'rgba(255,255,255,.7)', fontSize: isMobile ? 14 : 15, lineHeight:1.75, marginBottom: isMobile ? 28 : 36, maxWidth:420 }}>
              Aprende con SIGMA, tu asistente inteligente. Completa retos, sube de nivel y domina el cálculo de forma progresiva.
            </p>
            <div style={{ display:'flex', flexDirection:'column', gap:12, width:'100%', maxWidth: btnMaxW }}>
              <button className="btn-cta" style={{ fontSize: isMobile ? 16 : 17, padding: isMobile ? '17px 0' : '20px 0', width:'100%' }} onClick={() => navigate('/select-role')}>
                INICIAR AHORA
              </button>
              <button className="btn-sec" style={{ fontSize: isMobile ? 14 : 15, padding: isMobile ? '14px 0' : '17px 0', width:'100%' }} onClick={() => navigate('/login')}>
                Ya tengo una cuenta
              </button>
            </div>
            <div style={{ display:'flex', gap:10, marginTop: isMobile ? 28 : 36, width:'100%', maxWidth: btnMaxW }}>
              {STATS.map(({ value, label }) => (
                <div key={label} className="stat-pill" style={{ padding: isMobile ? '10px 8px' : '12px 16px' }}>
                  <div style={{ color:'#69F0AE', fontSize: isMobile ? 18 : 22, fontWeight:900 }}>{value}</div>
                  <div style={{ color:'rgba(255,255,255,.5)', fontSize: isMobile ? 10 : 11, marginTop:2 }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display:'flex', flexDirection:'column', gap: isMobile ? 8 : 10, marginTop: isMobile ? 24 : 28, width:'100%', maxWidth: isDesktop ? 420 : btnMaxW }}>
              {FEATURES.map(({ icon, title, desc }) => (
                <div key={title} className="feature-chip" style={{ padding: isMobile ? '12px 14px' : '16px 18px' }}>
                  <span style={{ fontSize: isMobile ? 18 : 20, flexShrink:0 }}>{icon}</span>
                  <div>
                    <div style={{ color:'#fff', fontWeight:700, fontSize: isMobile ? 13 : 14 }}>{title}</div>
                    <div style={{ color:'rgba(255,255,255,.5)', fontSize: isMobile ? 11 : 12, marginTop:2 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            SECCIÓN 1 — CÓMO FUNCIONA
        ════════════════════════════════════════════════ */}
        <div ref={howRef} data-section="how" style={{ position:'relative', zIndex:5, padding: isMobile ? '64px 20px' : '88px 40px', borderTop:'1px solid rgba(255,255,255,0.07)' }}>
          <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:80, height:3, background:'linear-gradient(90deg,transparent,#69F0AE,transparent)', borderRadius:100 }} />
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom: isMobile ? 40 : 60, opacity: sectionsVis.how ? 1 : 0, transform: sectionsVis.how ? 'none' : 'translateY(36px)', transition:'opacity 0.7s, transform 0.7s' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(105,240,174,.1)', border:'1px solid rgba(105,240,174,.2)', borderRadius:100, padding:'6px 16px', marginBottom:18 }}>
                <span style={{ color:'#69F0AE', fontSize:14, fontWeight:800, letterSpacing:'1.5px', textTransform:'uppercase' }}>Metodología</span>
              </div>
              <h2 style={{ color:'#fff', fontSize: isMobile ? '26px' : 'clamp(30px,3.5vw,46px)', fontWeight:900, letterSpacing:'-1.5px', lineHeight:1.1, marginBottom:16 }}>
                Simple.{' '}
                <span style={{ background:'linear-gradient(90deg,#69F0AE,#B9F6CA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>Divertido.</span>
                {' '}Efectivo.
              </h2>
              <p style={{ color:'rgba(255,255,255,.5)', fontSize: isMobile ? 14 : 16, maxWidth:460, margin:'0 auto', lineHeight:1.7 }}>
                Tres pasos que transforman la teoría en dominio real del Cálculo Integral.
              </p>
            </div>
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3,1fr)', gap: isMobile ? 16 : 24 }}>
              {STEPS.map((step, i) => (
                <div key={step.num} className="step-card" style={{ opacity: sectionsVis.how ? 1 : 0, transform: sectionsVis.how ? 'none' : 'translateY(56px)', transition:`opacity 0.7s ${i * 0.15}s, transform 0.7s ${i * 0.15}s`, borderColor:`${step.color}22` }}>
                  <div style={{ fontSize: isMobile ? 52 : 68, fontWeight:900, lineHeight:1, marginBottom:20, background:`linear-gradient(135deg, ${step.color} 0%, ${step.color}55 100%)`, WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', fontFamily:'Georgia,serif' }}>
                    {step.num}
                  </div>
                  <div style={{ marginBottom:16 }}>
                    <StepIcon type={step.iconType} color={step.color} size={isMobile ? 44 : 52} />
                  </div>
                  <div style={{ color:'#fff', fontWeight:800, fontSize: isMobile ? 16 : 18, marginBottom:10 }}>{step.title}</div>
                  <div style={{ color:'rgba(255,255,255,.48)', fontSize: isMobile ? 13 : 14, lineHeight:1.75 }}>{step.desc}</div>
                  <div style={{ marginTop:22, height:3, borderRadius:100, background:`linear-gradient(90deg, ${step.color}, transparent)` }} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            SECCIÓN 2 — MAPA DE APRENDIZAJE
        ════════════════════════════════════════════════ */}
        <div ref={pathRef} data-section="path" style={{ position:'relative', zIndex:5, padding: isMobile ? '64px 20px' : '88px 40px', borderTop:'1px solid rgba(255,255,255,0.06)', background:'rgba(0,0,0,0.22)' }}>
          <div style={{ maxWidth:1000, margin:'0 auto' }}>
            <div style={{ textAlign:'center', marginBottom: isMobile ? 44 : 64, opacity: sectionsVis.path ? 1 : 0, transform: sectionsVis.path ? 'none' : 'translateY(36px)', transition:'opacity 0.7s, transform 0.7s' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(255,213,79,.1)', border:'1px solid rgba(255,213,79,.22)', borderRadius:100, padding:'6px 16px', marginBottom:18 }}>
                <span style={{ color:'#FFD54F', fontSize:14, fontWeight:800, letterSpacing:'1.5px', textTransform:'uppercase' }}>Tu Camino</span>
              </div>
              <h2 style={{ color:'#fff', fontSize: isMobile ? '26px' : 'clamp(30px,3.5vw,46px)', fontWeight:900, letterSpacing:'-1.5px', lineHeight:1.1, marginBottom:16 }}>
                De cero a{' '}
                <span style={{ background:'linear-gradient(90deg,#FFD54F,#FFCA28)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>experto</span>
                {' '}en 5 módulos
              </h2>
              <p style={{ color:'rgba(255,255,255,.5)', fontSize: isMobile ? 14 : 16, maxWidth:440, margin:'0 auto', lineHeight:1.7 }}>
                Cada módulo desbloquea el siguiente. Avanza a tu ritmo, sin presiones ni límites de tiempo.
              </p>
            </div>

            {isMobile ? (
              /* ── Vertical móvil ── */
              <div style={{ position:'relative', paddingLeft:44 }}>
                {PATH_NODES.map((node, i) => (
                  <div key={node.label} className="path-node-wrap" style={{ display:'flex', alignItems:'center', gap:18, paddingBottom: i < PATH_NODES.length - 1 ? 36 : 0, opacity: sectionsVis.path ? 1 : 0, transform: sectionsVis.path ? 'none' : 'translateX(-24px)', transition:`opacity 0.65s ${i * 0.13}s, transform 0.65s ${i * 0.13}s` }}>
                    {i < PATH_NODES.length - 1 && (
                      <div style={{ position:'absolute', left:18, top:40 + i * (40 + 36), width:2, height:36, background:`linear-gradient(180deg,${node.color}55,${PATH_NODES[i+1].color}55)` }} />
                    )}
                    <div className="path-node-circle" style={{ width:40, height:40, borderRadius:'50%', flexShrink:0, background:`radial-gradient(circle,${node.colorDim},rgba(0,0,0,0.4))`, border:`2px solid ${node.color}`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:900, color:node.color, fontFamily:'Georgia,serif', boxShadow:`0 0 14px ${node.colorDim}` }}>
                      {node.symbol}
                    </div>
                    <div>
                      <div style={{ color:'#fff', fontWeight:700, fontSize:14 }}>{node.label}</div>
                      <div style={{ display:'inline-block', marginTop:4, background:node.colorDim, border:`1px solid ${node.color}44`, borderRadius:100, padding:'2px 10px', color:node.color, fontSize:14, fontWeight:800 }}>{node.xp}</div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* ── Horizontal desktop/tablet — sin línea, con chevrons ── */
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', padding:'0 8px' }}>
                {PATH_NODES.map((node, i) => (
                  <div key={node.label} style={{ display:'flex', alignItems:'flex-start', flex:1 }}>
                    {/* Nodo */}
                    <div className="path-node-wrap" style={{ display:'flex', flexDirection:'column', alignItems:'center', gap: isTablet ? 10 : 14, flex:1, textAlign:'center', opacity: sectionsVis.path ? 1 : 0, transform: sectionsVis.path ? 'none' : 'translateY(36px)', transition:`opacity 0.65s ${i * 0.14 + 0.2}s, transform 0.65s ${i * 0.14 + 0.2}s` }}>
                      <div className="path-node-circle" style={{ width: isTablet ? 60 : 76, height: isTablet ? 60 : 76, borderRadius:'50%', background:`radial-gradient(circle at 35% 35%,${node.colorDim},rgba(7,28,9,0.9))`, border:`2px solid ${node.color}99`, display:'flex', alignItems:'center', justifyContent:'center', fontSize: isTablet ? 22 : 28, fontWeight:900, color:node.color, fontFamily:'Georgia,serif', boxShadow:`0 0 20px ${node.colorDim}, 0 4px 16px rgba(0,0,0,0.4)`, position:'relative', zIndex:2, animation: sectionsVis.path ? `glowPop 3s ease-in-out ${i * 0.5}s infinite` : 'none' }}>
                        {node.symbol}
                      </div>
                      <div style={{ color:'#fff', fontWeight:700, fontSize: isTablet ? 11 : 13, maxWidth:110, lineHeight:1.4 }}>{node.label}</div>
                      <div style={{ background:node.colorDim, border:`1px solid ${node.color}44`, borderRadius:100, padding:'3px 12px', color:node.color, fontSize: isTablet ? 10 : 11, fontWeight:800 }}>{node.xp}</div>
                    </div>
                    {/* Flecha entre nodos */}
                    {i < PATH_NODES.length - 1 && (
                      <div style={{ display:'flex', alignItems:'center', paddingTop: isTablet ? 20 : 26, paddingBottom:0, flexShrink:0, opacity: sectionsVis.path ? 0.5 : 0, transition:`opacity 0.5s ${i * 0.14 + 0.6}s` }}>
                        <svg width={isTablet ? 20 : 28} height={isTablet ? 14 : 18} viewBox="0 0 28 18" fill="none">
                          <path d="M0 9 H22 M16 2 L26 9 L16 16" stroke="rgba(255,255,255,0.35)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            SECCIÓN 3 — SIGMA NUNCA TE ABANDONA
        ════════════════════════════════════════════════ */}
        <div ref={sigmaSecRef} data-section="sigma" style={{ position:'relative', zIndex:5, padding: isMobile ? '64px 20px' : '88px 40px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
          <div style={{ maxWidth:1100, margin:'0 auto', display:'flex', flexDirection: isMobile ? 'column' : 'row', alignItems:'center', gap: isMobile ? 44 : isTablet ? 48 : 72 }}>

            {/* Izquierda: SIGMA con órbitas de símbolos matemáticos */}
            <div style={{ flexShrink:0, position:'relative', width: isMobile ? 220 : isTablet ? 240 : 300, height: isMobile ? 220 : isTablet ? 240 : 300, opacity: sectionsVis.sigma ? 1 : 0, transform: sectionsVis.sigma ? 'none' : 'scale(0.75)', transition:'opacity 0.85s, transform 0.85s cubic-bezier(0.34,1.56,0.64,1)', alignSelf:'center' }}>
              <div style={{ position:'absolute', inset:-16, borderRadius:'50%', border:'1px dashed rgba(105,240,174,0.18)', animation:'orbit 30s linear infinite', pointerEvents:'none' }} />
              <div style={{ position:'absolute', inset:-36, borderRadius:'50%', border:'1px dashed rgba(105,240,174,0.09)', animation:'orbit 50s linear reverse infinite', pointerEvents:'none' }} />
              <div style={{ position:'absolute', inset:-24, borderRadius:'50%', background:'radial-gradient(circle,rgba(105,240,174,0.12) 0%,transparent 70%)', animation:'orbPulse 4s ease-in-out infinite', pointerEvents:'none' }} />
              <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', animation:'sigmaFloat 3.5s ease-in-out infinite' }}>
                <SigmaLogo state={sigmaState} size={isMobile ? 130 : isTablet ? 145 : 170} />
              </div>
              {ORBIT_SYMBOLS.map((sym, i) => (
                <div key={i} style={{ position:'absolute', top:'50%', left:'50%', marginTop:-22, marginLeft:-22, animation:`${isMobile ? 'orbitSm' : 'orbit'} ${7 + i * 1.5}s linear ${-i * (7 + i * 1.5) / 4}s infinite`, zIndex:4 }}>
                  <div style={{ width:44, height:44, borderRadius:'50%', background:'rgba(13,51,18,0.92)', border:'1px solid rgba(105,240,174,0.38)', display:'flex', alignItems:'center', justifyContent:'center', fontSize: sym.length > 1 ? 12 : 18, fontWeight:900, color:'#69F0AE', fontFamily:'Georgia,serif', boxShadow:'0 4px 20px rgba(0,0,0,0.4), 0 0 8px rgba(105,240,174,0.15)', backdropFilter:'blur(6px)' }}>
                    {sym}
                  </div>
                </div>
              ))}
            </div>

            {/* Derecha: features */}
            <div style={{ flex:1, opacity: sectionsVis.sigma ? 1 : 0, transform: sectionsVis.sigma ? 'none' : 'translateX(48px)', transition:'opacity 0.85s 0.2s, transform 0.85s 0.2s' }}>
              <div style={{ display:'inline-flex', alignItems:'center', gap:8, background:'rgba(105,240,174,.1)', border:'1px solid rgba(105,240,174,.2)', borderRadius:100, padding:'6px 16px', marginBottom:20 }}>
                <span style={{ color:'#69F0AE', fontSize:14, fontWeight:800, letterSpacing:'1.5px', textTransform:'uppercase' }}>IA Educativa</span>
              </div>
              <h2 style={{ color:'#fff', fontSize: isMobile ? '26px' : 'clamp(28px,3.2vw,42px)', fontWeight:900, letterSpacing:'-1.5px', lineHeight:1.15, marginBottom:14 }}>
                SIGMA nunca{!isMobile && <br />} te{' '}
                <span style={{ background:'linear-gradient(90deg,#69F0AE,#B9F6CA)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text' }}>abandona</span>
              </h2>
              <p style={{ color:'rgba(255,255,255,.5)', fontSize: isMobile ? 14 : 15, lineHeight:1.75, marginBottom:28, maxWidth:440 }}>
                Tu asistente inteligente está presente en cada paso: explica, adapta, motiva y celebra contigo.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {SIGMA_FEATURES.map(({ iconType, color, title, desc }, i) => (
                  <div key={title} className="sigma-feat" style={{ opacity: sectionsVis.sigma ? 1 : 0, transform: sectionsVis.sigma ? 'none' : 'translateX(24px)', transition:`opacity 0.55s ${0.35 + i * 0.1}s, transform 0.55s ${0.35 + i * 0.1}s` }}>
                    <FeatIcon type={iconType} color={color} />
                    <div>
                      <div style={{ color:'#fff', fontWeight:700, fontSize: isMobile ? 14 : 15 }}>{title}</div>
                      <div style={{ color:'rgba(255,255,255,.44)', fontSize: isMobile ? 12 : 13, marginTop:3, lineHeight:1.55 }}>{desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ════════════════════════════════════════════════
            SECCIÓN 4 — CTA FINAL
        ════════════════════════════════════════════════ */}
        <div ref={ctaRef} data-section="cta" style={{ position:'relative', zIndex:5, padding: isMobile ? '72px 20px 80px' : '96px 40px 104px', borderTop:'1px solid rgba(255,255,255,0.06)', background:'rgba(0,0,0,0.28)', textAlign:'center', overflow:'hidden' }}>
          <div style={{ position:'absolute', inset:0, background:'radial-gradient(ellipse 70% 60% at 50% 50%,rgba(105,240,174,0.08) 0%,transparent 70%)', animation:'orbPulse 5s ease-in-out infinite', pointerEvents:'none' }} />
          {['∫','Σ','dx','∞','π'].map((s, i) => (
            <div key={i} style={{ position:'absolute', left:`${10 + i * 20}%`, top:`${15 + (i % 2) * 55}%`, color:'rgba(105,240,174,0.1)', fontSize: 24 + i * 6, fontFamily:'Georgia,serif', fontWeight:900, pointerEvents:'none', animation:`floatSymbol ${6 + i * 2}s ease-in-out ${i * 1.1}s infinite` }}>{s}</div>
          ))}

          <div style={{ position:'relative', maxWidth:560, margin:'0 auto', opacity: sectionsVis.cta ? 1 : 0, transform: sectionsVis.cta ? 'none' : 'translateY(48px)', transition:'opacity 0.85s, transform 0.85s' }}>

            {/* Icono CSS animado — diamante giratorio */}
            <div style={{ display:'flex', justifyContent:'center', marginBottom:20 }}>
              <div style={{ position:'relative', width: isMobile ? 60 : 80, height: isMobile ? 60 : 80 }}>
                <div style={{ position:'absolute', inset:0, borderRadius:isMobile ? 16 : 20, background:'linear-gradient(135deg,#69F0AE22,#00E67622)', border:'1.5px solid #69F0AE55', animation:'ctaDiamondSpin 8s linear infinite' }} />
                <div style={{ position:'absolute', inset:8, borderRadius:isMobile ? 10 : 14, background:'linear-gradient(135deg,#69F0AE44,#00E67644)', animation:'ctaDiamondSpin 5s linear reverse infinite' }} />
                <div style={{ position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center' }}>
                  <div style={{ color:'#69F0AE', fontSize: isMobile ? 26 : 34, fontWeight:900, fontFamily:'Georgia,serif', filter:'drop-shadow(0 0 10px #69F0AE)' }}>∫</div>
                </div>
              </div>
            </div>

            <h2 style={{ color:'#fff', fontSize: isMobile ? '26px' : 'clamp(32px,3.8vw,52px)', fontWeight:900, letterSpacing: isMobile ? '-1px' : '-2px', lineHeight:1.1, marginBottom:16 }}>
              ¿Listo para dominar{!isMobile && <br />}{' '}
              <span style={{ background:'linear-gradient(90deg,#69F0AE,#B9F6CA,#69F0AE)', backgroundSize:'200% 100%', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text', animation:'shimmerBtn 3s linear infinite' }}>
                el Cálculo Integral?
              </span>
            </h2>
            <p style={{ color:'rgba(255,255,255,.48)', fontSize: isMobile ? 14 : 16, lineHeight:1.75, marginBottom:38 }}>
              Únete ahora. Gratuito siempre. Sin tarjeta. Sin excusas.
            </p>
            <button className="cta-btn-final" style={{ fontSize: isMobile ? 16 : 20, padding: isMobile ? '18px 44px' : '22px 68px' }} onClick={() => navigate('/select-role')}>
              EMPEZAR GRATIS <span className="cta-arrow">→</span>
            </button>
            <div style={{ color:'rgba(255,255,255,.22)', fontSize:15, marginTop:18, letterSpacing:'0.4px' }}>
              Sin tarjeta de crédito · Sin límites · 100% gratuito
            </div>

            <div style={{ display:'flex', justifyContent:'center', gap: isMobile ? 16 : 32, marginTop:48, flexWrap:'wrap' }}>
              {[{ num:'5+', txt:'módulos', delay:'0s' },{ num:'14+', txt:'ejercicios', delay:'0.12s' },{ num:'100%', txt:'gratuito', delay:'0.24s' }].map(({ num, txt, delay }) => (
                <div key={txt} className="big-stat" style={{ textAlign:'center', animationDelay: sectionsVis.cta ? delay : '0s', animationPlayState: sectionsVis.cta ? 'running' : 'paused' }}>
                  <div style={{ color:'#69F0AE', fontSize: isMobile ? 28 : 36, fontWeight:900, letterSpacing:'-1px' }}>{num}</div>
                  <div style={{ color:'rgba(255,255,255,.38)', fontSize:15, marginTop:2, textTransform:'uppercase', letterSpacing:'1px' }}>{txt}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <footer style={{ position:'relative', zIndex:5, borderTop:'1px solid rgba(255,255,255,0.07)', padding: isMobile ? '32px 20px 24px' : '40px 56px 28px' }}>
          <div style={{ maxWidth:1100, margin:'0 auto' }}>
            {/* Columnas */}
            <div style={{ display:'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(3,1fr)', gap: isMobile ? '24px 16px' : 32, marginBottom:32 }}>
              {/* Marca */}
              <div style={{ gridColumn: isMobile ? '1 / -1' : 'auto' }}>
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:10 }}>
                  <div style={{ width:28, height:28, borderRadius:8, background:'rgba(255,255,255,.15)', border:'1px solid rgba(255,255,255,.25)', display:'flex', alignItems:'center', justifyContent:'center', fontWeight:900, fontSize:14, color:'#fff' }}>I+</div>
                  <span style={{ color:'#fff', fontWeight:800, fontSize:15 }}>INTEGRA<span style={{ color:'#69F0AE' }}>+</span></span>
                </div>
                <p style={{ color:'rgba(255,255,255,.35)', fontSize:15, lineHeight:1.7, maxWidth:200 }}>
                  Plataforma educativa gratuita para dominar el Cálculo Integral.
                </p>
              </div>
              {/* Plataforma */}
              <div>
                <div style={{ color:'rgba(255,255,255,.5)', fontSize:13, fontWeight:800, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:12 }}>Plataforma</div>
                {[{ label:'Inicio', path:'/' }, { label:'Iniciar sesión', path:'/login' }, { label:'Registrarse', path:'/select-role' }].map(({ label, path }) => (
                  <div key={label} style={{ marginBottom:8 }}>
                    <button onClick={() => navigate(path)} style={{ background:'none', border:'none', cursor:'pointer', color:'rgba(255,255,255,.4)', fontSize:15, padding:0, transition:'color 0.18s' }} onMouseEnter={e => e.currentTarget.style.color='#69F0AE'} onMouseLeave={e => e.currentTarget.style.color='rgba(255,255,255,.4)'}>{label}</button>
                  </div>
                ))}
              </div>
              {/* Aprender */}
              <div>
                <div style={{ color:'rgba(255,255,255,.5)', fontSize:13, fontWeight:800, letterSpacing:'1.5px', textTransform:'uppercase', marginBottom:12 }}>Aprender</div>
                {['Integral Indefinida', 'Sustitución u', 'Integral Definida', 'Por Partes'].map(t => (
                  <div key={t} style={{ marginBottom:8 }}>
                    <span style={{ color:'rgba(255,255,255,.35)', fontSize:15 }}>{t}</span>
                  </div>
                ))}
              </div>
            </div>
            {/* Copyright */}
            <div style={{ borderTop:'1px solid rgba(255,255,255,0.07)', paddingTop:18, display:'flex', alignItems:'center', justifyContent: isMobile ? 'center' : 'space-between', flexWrap:'wrap', gap:8 }}>
              <span style={{ color:'rgba(255,255,255,.2)', fontSize:14 }}>© 2026 INTEGRA+ · Plataforma de Cálculo Integral</span>
              <span style={{ color:'rgba(255,255,255,.15)', fontSize:14 }}>Hecho con ∫ y pasión por las matemáticas</span>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
}
