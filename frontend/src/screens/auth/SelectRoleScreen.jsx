import { useNavigate } from 'react-router-dom';
import SigmaBubble from '../../components/sigma/SigmaBubble';

const ROLES = [
  { id: 'estudiante', emoji: '🎓', title: 'Soy Estudiante', desc: 'Quiero aprender Cálculo Integral de forma interactiva y progresiva', color: '#2E7D32', bg: 'linear-gradient(135deg,#1B5E20,#43A047)' },
  { id: 'docente',    emoji: '📚', title: 'Soy Docente',    desc: 'Quiero gestionar estudiantes, crear ejercicios y monitorear el progreso', color: '#1565C0', bg: 'linear-gradient(135deg,#0D47A1,#1976D2)' },
];

export default function SelectRoleScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col lg:flex-row" style={{ background: '#F8FFF8' }}>
      {/* Panel decorativo — solo desktop */}
      <div className="hidden lg:flex lg:w-2/5 flex-col items-center justify-center p-16" style={{ background: 'linear-gradient(150deg,#1B5E20,#2E7D32)' }}>
        <div style={{ fontSize: 64, marginBottom: 20 }}>🎓</div>
        <h2 className="text-4xl font-black text-white text-center mb-4" style={{ letterSpacing: '-1px' }}>Únete a<br />INTEGRA+</h2>
        <p className="text-green-200 text-center text-lg leading-relaxed max-w-xs">La plataforma que hace el cálculo integral accesible para todos</p>
      </div>

      {/* Contenido principal */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 lg:p-16">
        <div className="w-full max-w-lg">
          {/* Botón volver */}
          <button onClick={() => navigate('/login')} aria-label="Volver al login"
            className="flex items-center gap-2 text-sm font-semibold mb-8"
            style={{ color: '#2E7D32', background: 'none', border: 'none', cursor: 'pointer' }}>
            ← Volver al inicio de sesión
          </button>

          <h1 className="text-2xl lg:text-3xl font-bold mb-1" style={{ color: '#1A1A1A', letterSpacing: '-0.5px' }}>¿Cuál es tu rol?</h1>
          <p className="text-sm mb-6" style={{ color: '#888' }}>Elige cómo quieres usar INTEGRA+</p>

          <div className="mb-6">
            <SigmaBubble state="neutral">¡Hola! Elige tu rol para crear tu cuenta. Si eres docente necesitarás un código especial.</SigmaBubble>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            {ROLES.map(role => (
              <button key={role.id} onClick={() => navigate('/register', { state: { rol: role.id } })}
                aria-label={`Registrarme como ${role.title}`}
                className="flex-1 text-left p-6 rounded-2xl transition-all outline-none group"
                style={{ background: '#fff', border: `2px solid ${role.color}22`, boxShadow: '0 4px 20px rgba(0,0,0,0.07)', cursor: 'pointer' }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = role.color; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = `0 12px 32px ${role.color}28`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = `${role.color}22`; e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.07)'; }}
                onFocus={e => e.currentTarget.style.outline = `3px solid ${role.color}`}
                onBlur={e => e.currentTarget.style.outline = 'none'}
              >
                <div style={{ width: 56, height: 56, borderRadius: 16, background: role.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 26, marginBottom: 16, boxShadow: `0 6px 18px ${role.color}40` }}>
                  {role.emoji}
                </div>
                <div className="text-lg font-bold mb-2" style={{ color: '#1A1A1A' }}>{role.title}</div>
                <div className="text-sm leading-relaxed mb-4" style={{ color: '#777' }}>{role.desc}</div>
                <div className="text-sm font-bold flex items-center gap-1" style={{ color: role.color }}>
                  Continuar <span>→</span>
                </div>
              </button>
            ))}
          </div>

          <p className="text-center mt-6 text-sm" style={{ color: '#999' }}>
            ¿Ya tienes cuenta?{' '}
            <button onClick={() => navigate('/login')} className="font-bold" style={{ background: 'none', border: 'none', color: '#2E7D32', cursor: 'pointer' }}>
              Iniciar sesión
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
