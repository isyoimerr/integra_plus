import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useAuth } from '../../contexts/AuthContext';
import { useToast } from '../../components/common/Toast';
import OTPInput from '../../components/forms/OTPInput';
import Spinner from '../../components/common/Spinner';
import SigmaBubble from '../../components/sigma/SigmaBubble';

const TOTAL = 5 * 60;
const CODE_LENGTH = 4;

export default function VerifyEmailScreen() {
  const navigate  = useNavigate();
  const location  = useLocation();
  const { loginLocal } = useAuth();
  const { show, ToastContainer } = useToast();

  const { nombre, email, password, rol, teacherCode, devCode } = location.state || {};
  const [otp,       setOtp]       = useState('');
  const [seconds,   setSeconds]   = useState(TOTAL);
  const [loading,   setLoading]   = useState(false);
  const [resending, setResending] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (!email) { navigate('/login'); return; }
    timerRef.current = setInterval(() => setSeconds(s => s > 0 ? s - 1 : 0), 1000);
    return () => clearInterval(timerRef.current);
  }, [email, navigate]);

  const mins    = String(Math.floor(seconds / 60)).padStart(2, '0');
  const secs    = String(seconds % 60).padStart(2, '0');
  const expired = seconds === 0;
  const ready   = otp.length === CODE_LENGTH && !expired && !loading;

  const handleVerify = async () => {
    if (!ready) return;
    setLoading(true);
    try {
      await authService.verifyOtp(email, otp);

      const data = await authService.register(email, nombre, password, rol, teacherCode);
      if (data?.token) {
        loginLocal(data.usuario, data.token);
      } else {
        loginLocal({ nombre, email, rol, puntos: 0, racha: 0 });
      }
      show('¡Cuenta creada!', 'success');
      setTimeout(() => navigate('/onboarding'), 800);
    } catch (err) {
      show(err.message || 'Código incorrecto', 'error');
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      await authService.sendOtp(email);
      setSeconds(TOTAL);
      setOtp('');
      show('Código reenviado a tu email', 'info');
    } catch (err) {
      show(err.message || 'Error al reenviar', 'error');
    } finally { setResending(false); }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <ToastContainer />

      <div className="hidden lg:flex lg:w-2/5 flex-col items-center justify-center p-16"
        style={{ background: 'linear-gradient(150deg,#1B5E20,#2E7D32)' }}>
        <span style={{ fontSize: 72, marginBottom: 24 }}>📧</span>
        <h2 className="text-4xl font-black text-white text-center mb-4" style={{ letterSpacing: '-1px' }}>
          Revisa tu email
        </h2>
        <p className="text-green-200 text-center text-lg leading-relaxed max-w-xs">
          Te enviamos un código de {CODE_LENGTH} dígitos desde yoimer938@gmail.com
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16" style={{ background: '#fff' }}>
        <div className="w-full max-w-md">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-semibold mb-8"
            style={{ color: '#2E7D32', background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Volver
          </button>

          <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#1A1A1A', letterSpacing: '-0.5px' }}>
            Confirma tu email
          </h1>
          <p className="text-sm mb-6" style={{ color: '#888' }}>
            Ingresa el código de {CODE_LENGTH} dígitos que te enviamos
          </p>

          <div className="mb-6">
            <SigmaBubble state="apoyo">
              Te envié un código a tu correo. ¡Revisa también la carpeta de spam!
            </SigmaBubble>
          </div>

          <div className="rounded-xl p-4 mb-6 text-center" style={{ background: '#F0FBF1', border: '1.5px solid #C8E6C9' }}>
            <div className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#888' }}>Código enviado a</div>
            <div className="font-bold text-base" style={{ color: '#1B5E20' }}>{email}</div>
          </div>

          <div className="mb-6">
            <OTPInput value={otp} onChange={setOtp} disabled={loading || expired} length={CODE_LENGTH} />
          </div>

          <div className="text-center mb-6">
            {expired ? (
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
            )}
          </div>

          <button onClick={handleVerify} disabled={!ready} aria-busy={loading}
            className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-all flex items-center justify-center gap-2 mb-4"
            style={{
              background: ready ? 'linear-gradient(135deg,#1B5E20,#43A047)' : '#DDD',
              boxShadow: ready ? '0 6px 20px rgba(46,125,50,0.35)' : 'none',
              cursor: ready ? 'pointer' : 'not-allowed', border: 'none',
            }}>
            {loading ? <><Spinner /> Verificando…</> : 'Verificar código ✓'}
          </button>

          <p className="text-center text-sm" style={{ color: '#AAA' }}>
            ¿No lo recibiste?{' '}
            <button onClick={handleResend} disabled={resending || (!expired && seconds > TOTAL - 30)}
              className="font-bold"
              style={{ background: 'none', border: 'none', color: '#2E7D32', cursor: 'pointer',
                opacity: (resending || (!expired && seconds > TOTAL - 30)) ? 0.4 : 1 }}>
              {resending ? 'Reenviando…' : 'Reenviar código'}
            </button>
          </p>

          <div className="mt-6 rounded-xl p-4" style={{ background: '#FFF8E1', border: '1px solid #FFE082' }}>
            <p className="text-xs font-bold mb-2" style={{ color: '#F57F17' }}>¿Cómo encuentro el código?</p>
            <ol className="text-xs space-y-1" style={{ color: '#666' }}>
              <li>1. Abre el email enviado desde <strong>yoimer938@gmail.com</strong></li>
              <li>2. Busca el código de {CODE_LENGTH} dígitos en el cuerpo del mensaje</li>
              <li>3. Ingrésalo arriba antes de que expire</li>
              <li>4. Si no aparece, revisa la carpeta <strong>Spam / No deseado</strong></li>
            </ol>
          </div>

          {devCode && (
            <div className="mt-4 rounded-xl p-4 text-center" style={{ background: '#E8F5E9', border: '2px dashed #A5D6A7' }}>
              <p className="text-xs font-bold uppercase mb-1" style={{ color: '#2E7D32' }}>Código (modo desarrollo)</p>
              <p className="text-3xl font-black tracking-widest" style={{ color: '#1B5E20', letterSpacing: 12 }}>{devCode}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
