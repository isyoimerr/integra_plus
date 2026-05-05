import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase';

export default function CallbackScreen() {
  const navigate = useNavigate();
  const [status, setStatus] = useState('Confirmando tu cuenta…');

  useEffect(() => {
    const handle = async () => {
      if (!supabase) { navigate('/login'); return; }

      // Supabase procesa el token de la URL automáticamente al detectar el hash/code
      const { data: { session }, error } = await supabase.auth.getSession();

      if (error) {
        setStatus('Hubo un error. Intenta iniciar sesión.');
        setTimeout(() => navigate('/login'), 2500);
        return;
      }

      if (session) {
        // Email confirmado y sesión activa
        setStatus('¡Email confirmado! Redirigiendo…');
        const done = localStorage.getItem('integra_onboarding_done');
        setTimeout(() => navigate(done ? '/dashboard' : '/onboarding'), 1200);
      } else {
        // Puede tardar un instante; Supabase dispara onAuthStateChange
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
          if (session) {
            setStatus('¡Email confirmado! Redirigiendo…');
            subscription.unsubscribe();
            const done = localStorage.getItem('integra_onboarding_done');
            setTimeout(() => navigate(done ? '/dashboard' : '/onboarding'), 1200);
          }
        });
        // Timeout por si no llega
        setTimeout(() => { subscription.unsubscribe(); navigate('/login'); }, 8000);
      }
    };

    handle();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center px-6">
        <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 animate-spin"
          style={{ border: '3px solid #E8F5E9', borderTopColor: '#2E7D32' }} />
        <h2 className="text-xl font-bold mb-2" style={{ color: '#1A1A1A' }}>{status}</h2>
        <p className="text-sm text-gray-500">Un momento por favor…</p>
      </div>
    </div>
  );
}
