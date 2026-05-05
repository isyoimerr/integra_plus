import { createContext, useContext, useState } from 'react';
import { authService } from '../services/auth.service';

const AuthContext = createContext(null);

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth debe usarse dentro de AuthProvider');
  return ctx;
};

export function AuthProvider({ children }) {
  const [user,    setUser]    = useState(() => { try { return JSON.parse(localStorage.getItem('integra_user') || 'null'); } catch { return null; } });
  const [token,   setToken]   = useState(() => localStorage.getItem('integra_token') || null);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const persist = (usuario, tk) => {
    setUser(usuario); setToken(tk);
    localStorage.setItem('integra_user',  JSON.stringify(usuario));
    localStorage.setItem('integra_token', tk);
  };

  const login = async (email, password) => {
    setLoading(true); setError(null);
    try {
      const data = await authService.login(email, password);
      persist(data.usuario, data.token);
      return data.usuario;
    } catch (err) { setError(err.message); throw err; }
    finally { setLoading(false); }
  };

  const register = async (email, nombre, password, rol, teacherCode) => {
    setLoading(true); setError(null);
    try {
      const data = await authService.register(email, nombre, password, rol, teacherCode);
      persist(data.usuario, data.token);
      return data.usuario;
    } catch (err) { setError(err.message); throw err; }
    finally { setLoading(false); }
  };

  const loginLocal = (userData, fakeToken = 'demo-local') => {
    persist(userData, fakeToken);
  };

  const logout = () => {
    setUser(null); setToken(null);
    localStorage.removeItem('integra_user');
    localStorage.removeItem('integra_token');
    localStorage.removeItem('integra_onboarding_done');
  };

  const updateUser = (partial) => {
    const updated = { ...user, ...partial };
    setUser(updated);
    localStorage.setItem('integra_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider value={{ user, token, isAuthenticated: !!token && !!user, loading, error, login, register, logout, loginLocal, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
