import { useNavigate, useLocation } from 'react-router-dom';

export default function RegisterSuccessScreen() {
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'tu correo';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md text-center">

        <div className="bg-green-100 rounded-full w-20 h-20 flex items-center justify-center mx-auto mb-6" style={{ boxShadow: '0 8px 28px rgba(46,125,50,0.2)' }}>
          <span className="text-4xl">📧</span>
        </div>

        <h2 className="text-3xl font-bold mb-2" style={{ color: '#1A1A1A', letterSpacing: '-0.5px' }}>¡Registrado!</h2>
        <p className="text-gray-500 mb-6">Revisa tu bandeja de entrada</p>

        <div className="bg-white rounded-2xl p-6 mb-6 text-left" style={{ border: '1.5px solid #C8E6C9', boxShadow: '0 4px 20px rgba(46,125,50,0.08)' }}>
          <p className="text-sm text-gray-600 mb-3">Enviamos un enlace de confirmación a:</p>
          <p className="font-bold text-lg mb-4" style={{ color: '#1B5E20' }}>{email}</p>

          <div className="flex flex-col gap-2">
            {['Abre tu email', 'Haz clic en el enlace de confirmación', 'Vuelve a INTEGRA+ para continuar'].map((step, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
                  style={{ background: '#2E7D32' }}>{i + 1}</div>
                <span className="text-sm text-gray-700">{step}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left" style={{ border: '1px solid #BBDEFB' }}>
          <p className="text-xs font-bold text-blue-700 mb-1">💡 ¿No lo recibes?</p>
          <p className="text-xs text-blue-600">Revisa la carpeta de spam. El email llega en menos de 2 minutos.</p>
        </div>

        <button onClick={() => navigate('/login')}
          className="w-full py-3.5 rounded-xl text-white font-bold text-base"
          style={{ background: 'linear-gradient(135deg,#2E7D32,#43A047)', boxShadow: '0 6px 20px rgba(46,125,50,0.32)', cursor: 'pointer', border: 'none' }}>
          Volver a Login
        </button>
      </div>
    </div>
  );
}
