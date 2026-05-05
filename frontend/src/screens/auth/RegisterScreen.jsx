import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { authService } from '../../services/auth.service';
import { useFormValidation, validators } from '../../hooks/useFormValidation';
import { useToast } from '../../components/common/Toast';
import Spinner from '../../components/common/Spinner';
import SigmaBubble from '../../components/sigma/SigmaBubble';

function PasswordStrength({ password }) {
  const checks = [
    { ok: password.length >= 8, label: 'Mínimo 8 caracteres' },
    { ok: /[A-Z]/.test(password), label: 'Una mayúscula' },
    { ok: /[0-9]/.test(password), label: 'Un número' },
  ];
  if (!password) return null;
  return (
    <div className="flex gap-3 mt-2">
      {checks.map(c => (
        <span key={c.label} className="text-xs font-semibold flex items-center gap-1" style={{ color: c.ok ? '#2E7D32' : '#BBB' }}>
          {c.ok ? '✓' : '○'} {c.label}
        </span>
      ))}
    </div>
  );
}

export default function RegisterScreen() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { show, ToastContainer } = useToast();

  const rol = location.state?.rol || 'estudiante';
  const isDocente = rol === 'docente';
  const color = isDocente ? '#1565C0' : '#2E7D32';
  const gradBg = isDocente ? 'linear-gradient(150deg,#0D47A1,#1565C0)' : 'linear-gradient(150deg,#1B5E20,#2E7D32)';

  const { register } = useAuth();
  const [form, setForm]   = useState({ nombre: '', email: '', password: '', teacherCode: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const { errors, validate, clearError } = useFormValidation({
    nombre:   [validators.required('Nombre requerido'), validators.minLen(2)],
    email:    [validators.required('Email requerido'), validators.email],
    password: [validators.required('Contraseña requerida'), validators.minLen(8), validators.hasUpper, validators.hasNum],
    ...(isDocente ? { teacherCode: [validators.required('Código docente requerido')] } : {}),
  });

  const set = (f, v) => { setForm(p => ({ ...p, [f]: v })); clearError(f); };

  const inputCls = (err) => `w-full rounded-xl text-sm outline-none transition-all`;
  const inputStyle = (err) => ({ padding: '13px 14px', border: `1.5px solid ${err ? '#E53935' : '#E0E0E0'}`, background: '#fff', color: '#1A1A1A' });

  const handleSubmit = async () => {
    if (!validate(form)) return;
    setLoading(true);
    try {
      // Siempre usar backend para OTP → envío desde yoimer938@gmail.com
      const res = await authService.sendOtp(form.email);
      navigate('/verify-email', { state: { ...form, rol, devCode: res.devCode } });
    } catch (err) {
      show(err.message || 'Error al enviar código', 'error');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <ToastContainer />

      {/* Panel decorativo — desktop */}
      <div className="hidden lg:flex lg:w-2/5 flex-col items-center justify-center p-16" style={{ background: gradBg }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>{isDocente ? '📚' : '🎓'}</div>
        <h2 className="text-4xl font-black text-white text-center mb-4" style={{ letterSpacing: '-1px' }}>
          {isDocente ? 'Cuenta Docente' : 'Cuenta Estudiante'}
        </h2>
        <p className="text-center text-lg leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.75)' }}>
          {isDocente ? 'Gestiona estudiantes y crea ejercicios de cálculo integral' : 'Aprende cálculo integral con SIGMA como tu guía personal'}
        </p>
      </div>

      {/* Formulario */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16" style={{ background: '#F9F9F9' }}>
        <div className="w-full max-w-md">
          <button onClick={() => navigate('/select-role')} className="flex items-center gap-2 text-sm font-semibold mb-8" style={{ color, background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Volver
          </button>

          <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#1A1A1A', letterSpacing: '-0.5px' }}>Crear cuenta</h1>
          <p className="text-sm mb-6" style={{ color: '#888' }}>{isDocente ? 'Acceso docente · INTEGRA+' : 'Estudiante · INTEGRA+'}</p>

          <div className="mb-6">
            <SigmaBubble state={isDocente ? 'alerta' : 'neutral'}>
              {isDocente ? 'Para registrarte como docente necesitas el código institucional.' : '¡Regístrate gratis! Solo necesitas tu email y una contraseña segura.'}
            </SigmaBubble>
          </div>

          <div className="flex flex-col gap-4">
            {/* Nombre */}
            <div>
              <label htmlFor="r-nombre" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>
                Nombre completo <span style={{ color: '#E53935' }}>*</span>
              </label>
              <input id="r-nombre" type="text" placeholder="Ej: Ana García"
                value={form.nombre} onChange={e => set('nombre', e.target.value)}
                aria-required="true" className={inputCls(errors.nombre)} style={inputStyle(errors.nombre)}
                onFocus={e => e.target.style.borderColor = color}
                onBlur={e => e.target.style.borderColor = errors.nombre ? '#E53935' : '#E0E0E0'}
              />
              {errors.nombre && <p role="alert" className="text-xs mt-1" style={{ color: '#E53935' }}>{errors.nombre}</p>}
            </div>

            {/* Email */}
            <div>
              <label htmlFor="r-email" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>
                Correo electrónico <span style={{ color: '#E53935' }}>*</span>
              </label>
              <input id="r-email" type="email" placeholder="nombre@correo.com"
                value={form.email} onChange={e => set('email', e.target.value)}
                aria-required="true" className={inputCls(errors.email)} style={inputStyle(errors.email)}
                onFocus={e => e.target.style.borderColor = color}
                onBlur={e => e.target.style.borderColor = errors.email ? '#E53935' : '#E0E0E0'}
              />
              {errors.email && <p role="alert" className="text-xs mt-1" style={{ color: '#E53935' }}>{errors.email}</p>}
            </div>

            {/* Contraseña */}
            <div>
              <label htmlFor="r-pass" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>
                Contraseña <span style={{ color: '#E53935' }}>*</span>
              </label>
              <div className="relative">
                <input id="r-pass" type={showPw ? 'text' : 'password'} placeholder="Mínimo 8 caracteres"
                  value={form.password} onChange={e => set('password', e.target.value)}
                  aria-required="true" className={inputCls(errors.password)} style={{ ...inputStyle(errors.password), paddingRight: 46 }}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = errors.password ? '#E53935' : '#E0E0E0'}
                />
                <button type="button" onClick={() => setShowPw(p => !p)} aria-label={showPw ? 'Ocultar' : 'Mostrar'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">👁</button>
              </div>
              <PasswordStrength password={form.password} />
              {errors.password && <p role="alert" className="text-xs mt-1" style={{ color: '#E53935' }}>{errors.password}</p>}
            </div>

            {/* Código docente */}
            {isDocente && (
              <div>
                <label htmlFor="r-code" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>
                  Código docente <span style={{ color: '#E53935' }}>*</span>
                </label>
                <input id="r-code" type="text" placeholder="Ej: DOCENTE2024"
                  value={form.teacherCode} onChange={e => set('teacherCode', e.target.value.toUpperCase())}
                  aria-required="true" className={inputCls(errors.teacherCode)} style={{ ...inputStyle(errors.teacherCode), fontFamily: 'monospace', letterSpacing: 2 }}
                  onFocus={e => e.target.style.borderColor = color}
                  onBlur={e => e.target.style.borderColor = errors.teacherCode ? '#E53935' : '#E0E0E0'}
                />
                {errors.teacherCode && <p role="alert" className="text-xs mt-1" style={{ color: '#E53935' }}>{errors.teacherCode}</p>}
                <p className="text-xs mt-1" style={{ color: '#AAA' }}>Solicítalo a tu institución educativa</p>
              </div>
            )}

            <button onClick={handleSubmit} disabled={loading} aria-busy={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-all flex items-center justify-center gap-2 mt-2"
              style={{ background: loading ? '#AAA' : `linear-gradient(135deg,${color}CC,${color})`, boxShadow: loading ? 'none' : `0 6px 20px ${color}44`, cursor: loading ? 'not-allowed' : 'pointer' }}>
              {loading ? <><Spinner />Enviando código…</> : 'Continuar →'}
            </button>

            <p className="text-center text-sm" style={{ color: '#999' }}>
              ¿Ya tienes cuenta?{' '}
              <button onClick={() => navigate('/login')} className="font-bold" style={{ background: 'none', border: 'none', color, cursor: 'pointer' }}>
                Iniciar sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
