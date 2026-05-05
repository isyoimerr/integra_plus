import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/auth.service';
import { useToast } from '../../components/common/Toast';
import Spinner from '../../components/common/Spinner';
import SigmaBubble from '../../components/sigma/SigmaBubble';

export default function ForgotPasswordScreen() {
  const navigate = useNavigate();
  const { show, ToastContainer } = useToast();
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!email.trim()) { show('Ingresa tu correo', 'warn'); return; }
    setLoading(true);
    try {
      const res = await authService.solicitarRecuperacion(email.trim());
      show('Código enviado a tu correo', 'success');
      navigate('/reset-password', { state: { email: email.trim(), devCode: res?.devCode } });
    } catch (err) {
      show(err.message || 'Error al enviar el código', 'error');
    } finally { setLoading(false); }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <ToastContainer />

      <div className="hidden lg:flex lg:w-2/5 flex-col items-center justify-center p-16"
        style={{ background: 'linear-gradient(150deg,#1B5E20,#2E7D32)' }}>
        <span style={{ fontSize: 72, marginBottom: 24 }}>🔑</span>
        <h2 className="text-4xl font-black text-white text-center mb-4" style={{ letterSpacing: '-1px' }}>
          ¿Olvidaste tu contraseña?
        </h2>
        <p className="text-green-200 text-center text-lg leading-relaxed max-w-xs">
          No te preocupes, te enviaremos un código de recuperación a tu correo.
        </p>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16" style={{ background: '#fff' }}>
        <div className="w-full max-w-md">
          <button onClick={() => navigate('/login')}
            className="flex items-center gap-2 text-sm font-semibold mb-8"
            style={{ color: '#2E7D32', background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Volver al inicio de sesión
          </button>

          <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#1A1A1A', letterSpacing: '-0.5px' }}>
            Recuperar contraseña
          </h1>
          <p className="text-sm mb-6" style={{ color: '#888' }}>
            Ingresa tu correo y te enviaremos un código de 6 dígitos
          </p>

          <div className="mb-6">
            <SigmaBubble state="apoyo">
              Tranquilo/a, pasa. Te mando un código ahora mismo para que puedas crear una nueva contraseña. 🔐
            </SigmaBubble>
          </div>

          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="fp-email" className="block text-xs font-bold uppercase tracking-wider mb-1.5"
                style={{ color: '#555' }}>
                Correo electrónico <span style={{ color: '#E53935' }}>*</span>
              </label>
              <input
                id="fp-email" type="email" placeholder="nombre@correo.com"
                value={email} onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
                autoComplete="email" aria-required="true"
                className="w-full rounded-xl text-sm outline-none"
                style={{ padding: '13px 14px', border: '1.5px solid #E0E0E0', background: '#fff', color: '#1A1A1A' }}
                onFocus={e => e.target.style.borderColor = '#2E7D32'}
                onBlur={e => e.target.style.borderColor = '#E0E0E0'}
              />
            </div>

            <button onClick={handleSubmit} disabled={loading} aria-busy={loading}
              className="w-full py-3.5 rounded-xl text-white font-bold text-base transition-all flex items-center justify-center gap-2 mt-2"
              style={{
                background: loading ? '#AAA' : 'linear-gradient(135deg,#1B5E20,#43A047)',
                boxShadow: loading ? 'none' : '0 6px 20px rgba(46,125,50,0.32)',
                cursor: loading ? 'not-allowed' : 'pointer', border: 'none',
              }}>
              {loading ? <><Spinner /> Enviando…</> : 'Enviar código de recuperación →'}
            </button>

            <p className="text-center text-sm" style={{ color: '#999' }}>
              ¿Recordaste tu contraseña?{' '}
              <button onClick={() => navigate('/login')}
                className="font-bold"
                style={{ background: 'none', border: 'none', color: '#2E7D32', cursor: 'pointer' }}>
                Iniciar sesión
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
