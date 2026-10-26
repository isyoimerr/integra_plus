import { createContext, useContext, useEffect, useState } from 'react';
import { authService } from '../services/auth.service';
import { supabase } from '../services/supabase';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem('integra_user') || 'null'); } catch { return null; }
  });
  const [token, setToken] = useState(() => localStorage.getItem('integra_token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const persist = (usuario, tk) => {
    setUser(usuario);
    setToken(tk);
    localStorage.setItem('integra_user', JSON.stringify(usuario));
    localStorage.setItem('integra_token', tk);
  };

  const logout = async () => {
    if (supabase) {
      await supabase.auth.signOut().catch(() => null);
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem('integra_user');
    localStorage.removeItem('integra_token');
    localStorage.removeItem('integra_onboarding_done');
  };

  const login = async (email, password) => {
    setLoading(true); setError(null);
    try {
      if (supabase) {
        const { data, error: supabaseError } = await supabase.auth.signInWithPassword({ email, password });
        if (supabaseError) throw supabaseError;

        const sessionUser = data?.user ? {
          id: data.user.id,
          email: data.user.email,
          nombre: data.user.user_metadata?.nombre || data.user.email?.split('@')[0] || 'Usuario',
          rol: data.user.user_metadata?.rol || 'estudiante',
          tema: 'light',
        } : null;

        const accessToken = data?.session?.access_token || 'supabase-session';
        if (sessionUser) persist(sessionUser, accessToken);
        return sessionUser;
      }

      const data = await authService.login(email, password);
      persist(data.usuario, data.token);
      return data.usuario;
    } catch (err) {
      setError(err?.message || 'Error al iniciar sesión');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, nombre, password, rol, teacherCode) => {
    setLoading(true); setError(null);
    try {
      if (supabase) {
        const { data, error: supabaseError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              nombre,
              rol: rol || 'estudiante',
            },
          },
        });

        if (supabaseError) throw supabaseError;

        const sessionUser = data?.user ? {
          id: data.user.id,
          email: data.user.email,
          nombre: data.user.user_metadata?.nombre || nombre,
          rol: data.user.user_metadata?.rol || rol || 'estudiante',
          tema: 'light',
        } : null;

        const accessToken = data?.session?.access_token || 'supabase-session';
        if (sessionUser) persist(sessionUser, accessToken);
        return sessionUser;
      }

      const data = await authService.register(email, nombre, password, rol, teacherCode);
      persist(data.usuario, data.token);
      return data.usuario;
    } catch (err) {
      setError(err?.message || 'Error al registrar usuario');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const loginLocal = (userData, fakeToken = 'demo-local') => {
    persist(userData, fakeToken);
  };

  const loginWithProvider = async (provider) => {
    if (!supabase) {
      throw new Error('Login social no configurado en este entorno');
    }

    setLoading(true);
    setError(null);
    try {
      const { error: oauthError } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (oauthError) throw oauthError;
    } catch (err) {
      setError(err?.message || 'Error al iniciar sesión con proveedor externo');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!supabase) return undefined;

    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        setUser(null);
        setToken(null);
        localStorage.removeItem('integra_user');
        localStorage.removeItem('integra_token');
        return;
      }

      if (session?.user) {
        const sessionUser = {
          id: session.user.id,
          email: session.user.email,
          nombre: session.user.user_metadata?.nombre || session.user.email?.split('@')[0] || 'Usuario',
          rol: session.user.user_metadata?.rol || 'estudiante',
          tema: 'light',
        };
        persist(sessionUser, session.access_token);
      }
    });

    return () => authListener.subscription.unsubscribe();
  }, []);

  const updateUser = (partial) => {
    const updated = { ...user, ...partial };
    setUser(updated);
    localStorage.setItem('integra_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, loading, error, login, register, logout, loginLocal, loginWithProvider, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
