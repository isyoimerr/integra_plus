import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useToast } from '../../components/common/Toast';
import OTPInput from '../../components/forms/OTPInput';
import Spinner from '../../components/common/Spinner';
import SigmaBubble from '../../components/sigma/SigmaBubble';

const TOTAL = 10 * 60;
const CODE_LENGTH = 6;

export default function ResetPasswordScreen() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { show, ToastContainer } = useToast();

  const { email, devCode } = location.state || {};
  const [otp,        setOtp]        = useState('');
  const [password,   setPassword]   = useState('');
  const [password2,  setPassword2]  = useState('');
  const [showPw,     setShowPw]     = useState(false);
  const [seconds,    setSeconds]    = useState(TOTAL);
  const [loading,    setLoading]    = useState(false);
  const [resending,  setResending]  = useState(false);
  const [tempToken,  setTempToken]  = useState(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!email) { navigate('/forgot-password'); return; }
    timerRef.current = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(timerRef.current);
  }, [email, navigate]);

  const mins    = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs    = String(seconds % 60).padStart(2, '0');
  const expired = seconds === 0;

  const pwOk  = password.length >= 8;
  const match = password === password2 && password2.length > 0;
  const ready = otp.length === CODE_LENGTH && !expired && !loading && pwOk && match && tempToken;

  const handleVerify = async () => {
    if (otp.length !== CODE_LENGTH) return;
    try {
      const res = await authService.verificarCodigo(email, otp);
      setTempToken(res.tempToken);
      show('Código verificado. Ingresa tu nueva contraseña.', 'success');
    } catch (err) {
      show(err.message || 'Código incorrecto o expirado', 'error');
      setOtp('');
    }
  };

  const handleReset = async () => {
    if (!ready) return;
    setLoading(true);
    try {
      await authService.resetearContrasena(email, tempToken, password);
      show('¡Contraseña actualizada! Ya puedes iniciar sesión.', 'success');
      setTimeout(() => navigate('/login'), 1200);
    } catch (err) {
      show(err.message || 'Error al actualizar contraseña', 'error');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.solicitarRecuperacion(email);
      setSeconds(TOTAL);
      setOtp('');
      setTempToken(null);
      show('Nuevo código enviado', 'info');
    } catch (err) {
      show(err.message || 'Error al reenviar', 'error');
    } finally { setResending(false); }
  };

  const checks = [
    { ok: password.length >= 8, label: 'Mín. 8 caracteres' },
  ];

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <ToastContainer />

      <div className="hidden lg:flex lg:w-2/5 flex-col items-center justify-center p-16"
        style={{ background: 'linear-gradient(150deg,#1B5E20,#2E7D32)' }}>
        <span style={{ fontSize: 72, marginBottom: 24 }}>🔐</span>
        <h2 className="text-4xl font-black text-white text-center mb-4" style={{ letterSpacing: '-1px' }}>
          Nueva contraseña
        </h2>
        <p className="text-green-200 text-center text-lg leading-relaxed max-w-xs">
          Ingresa el código que te enviamos y elige tu nueva contraseña.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16" style={{ background: '#fff' }}>
        <div className="w-full max-w-md">
          <button onClick={() => navigate('/forgot-password')}
            className="flex items-center gap-2 text-sm font-semibold mb-8"
            style={{ color: '#2E7D32', background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Volver
          </button>

          <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#1A1A1A', letterSpacing: '-0.5px' }}>
            Restablecer contraseña
          </h1>
          <p className="text-sm mb-6" style={{ color: '#888' }}>
            Código enviado a <strong style={{ color: '#1B5E20' }}>{email}</strong>
          </p>

          <div className="mb-6">
            <SigmaBubble state="apoyo">
              {tempToken ? 'Ingresa tu nueva contraseña.' : 'Ingresa el código y tu nueva contraseña. ¡Casi listo!'}
            </SigmaBubble>
          </div>

          <div className="flex flex-col gap-5">
            {/* OTP */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider mb-3" style={{ color: '#555' }}>
                Código de verificación
              </label>
              <OTPInput value={otp} onChange={setOtp} disabled={loading || expired || !!tempToken} length={CODE_LENGTH} />
              <div className="text-center mt-2">
                {!tempToken && (
                  expired ? (
                    <p role="alert" className="text-sm font-semibold" style={{ color: '#E53935' }}>
                      El código expiró — reenvíalo
                    </p>
                  ) : (
                    <p className="text-sm" style={{ color: '#888' }}>
                      Expira en{' '}
                      <span className="font-bold" style={{ color: seconds < 60 ? '#E53935' : '#2E7D32', fontVariantNumeric: 'tabular-nums' }}>
                        {mins}:{secs}
                      </span>
                    </p>
                  )
                )}
              </div>
              {!tempToken && (
                <button onClick={handleVerify} disabled={otp.length !== CODE_LENGTH || expired}
                  className="w-full mt-3 py-2 rounded-xl text-white font-bold text-sm"
                  style={{
                    background: otp.length === CODE_LENGTH && !expired ? 'linear-gradient(135deg,#1B5E20,#43A047)' : '#DDD',
                    cursor: otp.length === CODE_LENGTH && !expired ? 'pointer' : 'not-allowed',
                    border: 'none',
                  }}>
                  Verificar código ✓
                </button>
              )}
            </div>

            {/* Nueva contraseña */}
            <div>
              <label htmlFor="rp-pass" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>
                Nueva contraseña <span style={{ color: '#E53935' }}>*</span>
              </label>
              <div className="relative">
                <input
                  id="rp-pass" type={showPw ? 'text' : 'password'} placeholder="Mínimo 8 caracteres"
                  value={password} onChange={e => setPassword(e.target.value)}
                  className="w-full rounded-xl text-sm outline-none"
                  style={{ padding: '13px 46px 13px 14px', border: `1.5px solid ${password && !pwOk ? '#E53935' : '#E0E0E0'}`, background: '#fff', color: '#1A1A1A' }}
                  onFocus={e => e.target.style.borderColor = '#2E7D32'}
                  onBlur={e => e.target.style.borderColor = password && !pwOk ? '#E53935' : '#E0E0E0'}
                />
                <button type="button" onClick={() => setShowPw(p => !p)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                  {showPw ? '🙈' : '👁'}
                </button>
              </div>
              {password && (
                <div className="flex gap-3 mt-2">
                  {checks.map(c => (
                    <span key={c.label} className="text-xs font-semibold flex items-center gap-1"
                      style={{ color: c.ok ? '#2E7D32' : '#BBB' }}>
                      {c.ok ? '✓' : '○'} {c.label}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Confirmar contraseña */}
            <div>
              <label htmlFor="rp-pass2" className="block text-xs font-bold uppercase tracking-wider mb-1.5" style={{ color: '#555' }}>
                Confirmar contraseña <span style={{ color: '#E53935' }}>*</span>
              </label>
              <input
                id="rp-pass2" type={showPw ? 'text' : 'password'} placeholder="Repite tu contraseña"
                value={password2} onChange={e => setPassword2(e.target.value)}
                className="w-full rounded-xl text-sm outline-none"
                style={{ padding: '13px 14px', border: `1.5px solid ${password2 && !match ? '#E53935' : '#E0E0E0'}`, background: '#fff', color: '#1A1A1A' }}
                onFocus={e => e.target.style.borderColor = '#2E7D32'}
                onBlur={e => e.target.style.borderColor = password2 && !match ? '#E53935' : '#E0E0E0'}
              />
              {password2 && !match && (
                <p className="text-xs mt-1" style={{ color: '#E53935' }}>Las contraseñas no coinciden</p>
              )}
              {password2 && match && (
                <p className="text-xs mt-1" style={{ color: '#2E7D32' }}>✓ Las contraseñas coinciden</p>
              )}
            </div>

            {/* Botón */}
            <button onClick={handleReset} disabled={!ready} aria-busy={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-all flex items-center justify-center gap-2"
              style={{
                background: ready ? 'linear-gradient(135deg,#1B5E20,#43A047)' : '#DDD',
                boxShadow: ready ? '0 6px 20px rgba(46,125,50,0.35)' : 'none',
                cursor: ready ? 'pointer' : 'not-allowed', border: 'none',
              }}>
              {loading ? <><Spinner /> Actualizando…</> : 'Restablecer contraseña ✓'}
            </button>

            {/* Reenviar */}
            <p className="text-center text-sm" style={{ color: '#AAA' }}>
              ¿No recibiste el código?{' '}
              <button onClick={handleResend} disabled={resending || (!expired && seconds > TOTAL - 30)}
                className="font-bold"
                style={{ background: 'none', border: 'none', color: '#2E7D32', cursor: 'pointer',
                  opacity: (resending || (!expired && seconds > TOTAL - 30)) ? 0.4 : 1 }}>
                {resending ? 'Reenviando…' : 'Reenviar código'}
              </button>
            </p>
          </div>

          {/* Código dev */}
          {devCode && (
            <div className="mt-4 rounded-xl p-4 text-center" style={{ background: '#FFF8E1', border: '2px dashed #FFD54F' }}>
              <p className="text-xs font-bold uppercase mb-1" style={{ color: '#F57F17' }}>Código (modo desarrollo)</p>
              <p className="text-3xl font-black tracking-widest" style={{ color: '#E65100', letterSpacing: 12 }}>{devCode}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
