import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useToast } from '../components/common/Toast';
import Spinner from '../components/common/Spinner';
import SigmaLogo from '../components/sigma/SigmaLogo';

const SYMBOLS = ['∫', 'Σ', 'dx', 'π', '∂', '∞', '√', 'Δ', '∮', 'θ', 'lim', '∇'];

const SIGMA_MESSAGES = {
  idle:    '¡Hola! Soy SIGMA. Ingresa tus datos para continuar aprendiendo.',
  email:   '¡Perfecto! Ahora escribe tu contraseña.',
  pass:    '¡Listo! Pulsa el botón para entrar.',
  loading: 'Verificando tus credenciales...',
  error:   'Hmm, algo salió mal. Revisa tus datos.',
};

function FloatingLabel({ id, label, type = 'text', value, onChange, onKeyDown, autoComplete, rightSlot }) {
  const [focused, setFocused] = useState(false);
  const active = focused || value.length > 0;

  return (
    <div style={{ position: 'relative', marginBottom: 4 }}>
      <label htmlFor={id} style={{
        position: 'absolute',
        left: 16,
        top: active ? 8 : '50%',
        transform: active ? 'none' : 'translateY(-50%)',
        fontSize: active ? 11 : 14,
        fontWeight: active ? 700 : 400,
        color: active ? '#2E7D32' : 'rgba(0,0,0,0.45)',
        letterSpacing: active ? '0.6px' : 0,
        textTransform: active ? 'uppercase' : 'none',
        transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)',
        pointerEvents: 'none',
        zIndex: 2,
      }}>
        {label}
      </label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        onKeyDown={onKeyDown}
        autoComplete={autoComplete}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: '100%',
          padding: active ? '26px 48px 10px 16px' : '18px 48px 18px 16px',
          border: `1.5px solid ${focused ? 'rgba(105,240,174,0.7)' : 'rgba(255,255,255,0.12)'}`,
          borderRadius: 14,
          background: 'rgba(255,255,255,0.9)',
          backdropFilter: 'blur(8px)',
          color: '#000',
          fontSize: 15,
          outline: 'none',
          transition: 'all 0.25s ease',
          boxShadow: focused ? '0 0 0 3px rgba(105,240,174,0.1), inset 0 1px 0 rgba(255,255,255,0.05)' : 'inset 0 1px 0 rgba(255,255,255,0.03)',
        }}
      />
      {rightSlot && (
        <div style={{ position: 'absolute', right: 14, top: '50%', transform: 'translateY(-50%)' }}>
          {rightSlot}
        </div>
      )}
    </div>
  );
}

export default function LoginScreen() {
  const navigate  = useNavigate();
  const { login, loginLocal } = useAuth();
  const { show, ToastContainer } = useToast();

  const [email,    setEmail]   = useState('');
  const [pass,     setPass]    = useState('');
  const [showPw,   setShowPw]  = useState(false);
  const [loading,  setLoading] = useState(false);
  const [isDemo,   setIsDemo]  = useState(false);
  const [particles, setParticles] = useState([]);
  const [sigmaKey, setSigmaKey]  = useState('idle');
  const [cardIn,   setCardIn]  = useState(false);

  useEffect(() => {
    setParticles(
      Array.from({ length: 20 }, (_, i) => ({
        id: i,
        symbol: SYMBOLS[i % SYMBOLS.length],
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: 12 + Math.random() * 18,
        duration: 8 + Math.random() * 10,
        delay: Math.random() * 6,
        opacity: 0.04 + Math.random() * 0.09,
      }))
    );
    setTimeout(() => setCardIn(true), 100);
  }, []);

  useEffect(() => {
    if (loading)       { setSigmaKey('loading'); return; }
    if (pass.length)   { setSigmaKey('pass');    return; }
    if (email.length)  { setSigmaKey('email');   return; }
    setSigmaKey('idle');
  }, [email, pass, loading]);

  const sigmaState = sigmaKey === 'error' ? 'alerta' : sigmaKey === 'loading' ? 'inactivo' : sigmaKey === 'pass' ? 'celebracion' : sigmaKey === 'email' ? 'apoyo' : 'neutral';

  const doLogin = async () => {
    if (!email.trim() || !pass.trim()) { show('Email y contraseña requeridos', 'warn'); return; }
    if (!/\S+@\S+\.\S+/.test(email.trim())) { show('Formato de email inválido', 'warn'); return; }
    setLoading(true);
    try {
      const usuario = await login(email.trim(), pass);
      if (usuario?.rol === 'docente') {
        navigate('/teacher');
      } else if (usuario?.onboardingDone) {
        navigate('/dashboard');
      } else {
        navigate('/onboarding');
      }
    } catch (err) {
      setSigmaKey('error');
      show(err.message || 'Credenciales incorrectas', 'error');
    } finally { setLoading(false); }
  };

  const doDemo = async () => {
    setIsDemo(true);
    try {
      await login('estudiante@demo.com', 'demo123');
      navigate('/onboarding');
    } catch {
      loginLocal({ nombre: 'Demo', email: 'demo@integra.local', rol: 'estudiante', puntos: 0, racha: 0 });
      navigate('/onboarding');
    } finally { setIsDemo(false); }
  };

  return (
    <>
      <style>{`
        @keyframes bgSymbol {
          0%   { transform: translateY(0) rotate(0deg); opacity: var(--op); }
          50%  { transform: translateY(-28px) rotate(10deg); opacity: calc(var(--op) * 1.6); }
          100% { transform: translateY(0) rotate(0deg); opacity: var(--op); }
        }
        @keyframes cardSlideUp {
          from { opacity: 0; transform: translateY(40px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes sigmaWiggle {
          0%, 100% { transform: rotate(0deg); }
          20%      { transform: rotate(-8deg); }
          40%      { transform: rotate(8deg); }
          60%      { transform: rotate(-4deg); }
          80%      { transform: rotate(4deg); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0) scale(1); opacity: 0.35; }
          50%       { transform: translateY(-30px) scale(1.1); opacity: 0.55; }
        }
        @keyframes pulseRing {
          0%   { box-shadow: 0 0 0 0 rgba(105,240,174,0.4); }
          70%  { box-shadow: 0 0 0 14px rgba(105,240,174,0); }
          100% { box-shadow: 0 0 0 0 rgba(105,240,174,0); }
        }
        @keyframes shimmerBtn {
          from { background-position: -200% center; }
          to   { background-position: 200% center; }
        }

        .login-card {
          animation: cardSlideUp 0.55s cubic-bezier(0.34,1.2,0.64,1) both;
        }
        .sigma-idle    { animation: none; }
        .sigma-loading { animation: sigmaWiggle 0.8s ease-in-out infinite; }
        .sigma-error   { animation: sigmaWiggle 0.5s ease-in-out 3; }
        .sigma-pass    { animation: none; }

        .btn-login {
          width: 100%;
          padding: 18px 0;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: 0.3px;
          color: #fff;
          background: linear-gradient(135deg, #1B5E20 0%, #2E7D32 50%, #43A047 100%);
          background-size: 200% 100%;
          box-shadow: 0 8px 32px rgba(46,125,50,0.5), 0 2px 8px rgba(0,0,0,0.2);
          transition: all 0.25s cubic-bezier(0.34,1.56,0.64,1);
          position: relative;
          overflow: hidden;
        }
        .btn-login::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
          background-size: 200% 100%;
          opacity: 0;
          transition: opacity 0.3s;
        }
        .btn-login:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 14px 40px rgba(46,125,50,0.6), 0 4px 12px rgba(0,0,0,0.25);
        }
        .btn-login:hover::after { opacity: 1; animation: shimmerBtn 0.9s linear; }
        .btn-login:active:not(:disabled) { transform: translateY(0) scale(0.98); }
        .btn-login:disabled { opacity: 0.6; cursor: not-allowed; }

        .btn-ghost {
          width: 100%;
          padding: 15px 0;
          border-radius: 14px;
          background: rgba(255,255,255,0.06);
          border: 1.5px solid rgba(255,255,255,0.14);
          color: rgba(255,255,255,0.8);
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-ghost:hover:not(:disabled) {
          background: rgba(255,255,255,0.12);
          border-color: rgba(255,255,255,0.3);
          color: #fff;
          transform: translateY(-1px);
        }
        .btn-ghost:disabled { opacity: 0.5; cursor: not-allowed; }

        .eye-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 4px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: rgba(255,255,255,0.4);
          transition: color 0.2s;
          font-size: 18px;
        }
        .eye-btn:hover { color: rgba(255,255,255,0.8); }

        .divider-text {
          color: rgba(255,255,255,0.3);
          font-size: 12px;
          position: relative;
          text-align: center;
        }
        .divider-text::before, .divider-text::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 38%;
          height: 1px;
          background: rgba(255,255,255,0.1);
        }
        .divider-text::before { left: 0; }
        .divider-text::after  { right: 0; }

        .pulse-sigma { animation: pulseRing 2s ease-out infinite; }

        input::placeholder { color: rgba(0,0,0,0.5); }
        input:-webkit-autofill,
        input:-webkit-autofill:hover,
        input:-webkit-autofill:focus {
          -webkit-text-fill-color: #000;
          -webkit-box-shadow: 0 0 0px 1000px rgba(255,255,255,0.9) inset;
          transition: background-color 5000s ease-in-out 0s;
        }
      `}</style>

      <div style={{
        minHeight: '100vh',
        background: 'linear-gradient(160deg, #061508 0%, #0d2810 30%, #14421a 65%, #1B5E20 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        padding: '24px 16px',
      }}>
        <ToastContainer />

        {/* Orbs */}
        <div style={{ position: 'absolute', top: -150, right: -100, width: 450, height: 450, borderRadius: '50%', background: 'radial-gradient(circle, rgba(46,125,50,0.3) 0%, transparent 65%)', animation: 'orbFloat 7s ease-in-out infinite', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -120, left: -80, width: 380, height: 380, borderRadius: '50%', background: 'radial-gradient(circle, rgba(105,240,174,0.08) 0%, transparent 65%)', animation: 'orbFloat 9s ease-in-out 3s infinite', pointerEvents: 'none' }} />

        {/* Símbolos */}
        {particles.map(p => (
          <div key={p.id} style={{
            position: 'absolute',
            left: `${p.x}%`,
            top: `${p.y}%`,
            fontSize: p.size,
            color: '#fff',
            opacity: p.opacity,
            fontFamily: 'Georgia, serif',
            fontWeight: 700,
            animation: `bgSymbol ${p.duration}s ease-in-out ${p.delay}s infinite`,
            '--op': p.opacity,
            pointerEvents: 'none',
            userSelect: 'none',
          }}>{p.symbol}</div>
        ))}

        {/* Card */}
        <div className={cardIn ? 'login-card' : ''} style={{
          width: '100%',
          maxWidth: 420,
          background: 'rgba(255,255,255,0.05)',
          backdropFilter: 'blur(24px)',
          WebkitBackdropFilter: 'blur(24px)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: 28,
          padding: '36px 36px 32px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4), 0 1px 0 rgba(255,255,255,0.08) inset',
          position: 'relative',
          zIndex: 10,
        }}>

          {/* Header */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: 28 }}>
            {/* Logo */}
            <div style={{
              width: 56, height: 56, borderRadius: 18,
              background: 'linear-gradient(135deg, #1B5E20, #43A047)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, fontWeight: 900, color: '#fff',
              boxShadow: '0 8px 24px rgba(46,125,50,0.5)',
              marginBottom: 16,
            }}>I+</div>
            <h1 style={{ color: '#fff', fontSize: 26, fontWeight: 900, letterSpacing: '-0.8px', margin: 0 }}>
              INTEGRA<span style={{ color: '#69F0AE' }}>+</span>
            </h1>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13, marginTop: 4 }}>Cálculo Integral · Bienvenido de vuelta</p>
          </div>

          {/* SIGMA bubble */}
          <div style={{
            display: 'flex', gap: 12, alignItems: 'center',
            background: 'rgba(105,240,174,0.06)',
            border: '1px solid rgba(105,240,174,0.18)',
            borderRadius: 14, padding: '12px 14px',
            marginBottom: 24,
            transition: 'all 0.4s ease',
          }}>
            <div className={`sigma-${sigmaKey}`} style={{ flexShrink: 0 }}>
              <SigmaLogo state={sigmaState} size={40} />
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 800, color: '#69F0AE', letterSpacing: '0.8px', textTransform: 'uppercase', marginBottom: 3 }}>SIGMA</div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', lineHeight: 1.5, transition: 'all 0.3s' }}>
                {SIGMA_MESSAGES[sigmaKey] || SIGMA_MESSAGES.idle}
              </div>
            </div>
          </div>

          {/* Formulario */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            <FloatingLabel
              id="login-email"
              label="Correo electrónico"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doLogin()}
              autoComplete="email"
            />

            <FloatingLabel
              id="login-pass"
              label="Contraseña"
              type={showPw ? 'text' : 'password'}
              value={pass}
              onChange={e => setPass(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && doLogin()}
              autoComplete="current-password"
              rightSlot={
                <button type="button" className="eye-btn" onClick={() => setShowPw(p => !p)} aria-label={showPw ? 'Ocultar' : 'Mostrar'}>
                  {showPw
                    ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></svg>
                    : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                  }
                </button>
              }
            />

            {/* Forgot */}
            <div style={{ textAlign: 'right', marginTop: -6 }}>
              <button onClick={() => navigate('/forgot-password')}
                style={{ background: 'none', border: 'none', color: '#69F0AE', fontSize: 15, fontWeight: 600, cursor: 'pointer', padding: 0, opacity: 0.85, transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.target.style.opacity = '1'}
                onMouseLeave={e => e.target.style.opacity = '0.85'}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>

            {/* Login btn */}
            <button className="btn-login" onClick={doLogin} disabled={loading} aria-busy={loading}>
              {loading
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner />Iniciando sesión…</span>
                : 'Iniciar sesión'
              }
            </button>

            {/* Divider */}
            <div className="divider-text">o</div>

            {/* Demo */}
            <button className="btn-ghost" onClick={doDemo} disabled={isDemo} aria-busy={isDemo}>
              {isDemo
                ? <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}><Spinner color="rgba(255,255,255,0.7)" />Cargando demo…</span>
                : '⚡ Acceso demo rápido'
              }
            </button>

            {/* Register */}
            <button className="btn-ghost" onClick={() => navigate('/select-role')}>
              ¿No tienes cuenta? <span style={{ color: '#69F0AE', fontWeight: 700 }}>Regístrate →</span>
            </button>
          </div>

          {/* Back to landing */}
          <div style={{ textAlign: 'center', marginTop: 22 }}>
            <button onClick={() => navigate('/')}
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', fontSize: 15, cursor: 'pointer', transition: 'color 0.2s', padding: 0 }}
              onMouseEnter={e => e.target.style.color = 'rgba(255,255,255,0.6)'}
              onMouseLeave={e => e.target.style.color = 'rgba(255,255,255,0.3)'}
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
    </>
  );
}
