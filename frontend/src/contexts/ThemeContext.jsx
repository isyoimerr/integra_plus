import { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import { userService } from '../services/user.service';
import { THEMES } from '../data/themes';

const ThemeContext = createContext(null);

export function ThemeProvider({ children }) {
  const { user, token } = useAuth();
  const [themeName, setThemeName] = useState(
    () => localStorage.getItem('integra_theme') || 'light'
  );
  const [customAccent, setCustomAccent] = useState(
    () => localStorage.getItem('integra_custom_accent') || '#7E57C2'
  );
  const restored = useRef(false);

  useEffect(() => {
    if (user?.tema && !restored.current) {
      const saved = user.tema;
      if (['light', 'dark', 'custom'].includes(saved)) {
        setThemeName(saved);
      }
      restored.current = true;
    }
  }, [user?.tema]);

  useEffect(() => {
    localStorage.setItem('integra_theme', themeName);
    localStorage.setItem('integra_custom_accent', customAccent);
    if (themeName === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [themeName, customAccent]);

  const changeTheme = (name, accent) => {
    if (name === 'custom' && accent) {
      setCustomAccent(accent);
    }
    setThemeName(name);
    if (token && name) {
      userService.updateTema(token, name).catch(() => {});
    }
  };
  const toggleTheme = () => {
    const next = themeName === 'dark' ? 'light' : 'dark';
    setThemeName(next);
    if (token) {
      userService.updateTema(token, next).catch(() => {});
    }
  };

  const t =
    themeName === 'custom'
      ? {
          ...THEMES.custom,
          primary: customAccent,
          primaryDark: customAccent,
          primaryLight: customAccent,
        }
      : THEMES[themeName] || THEMES.light;

  return (
    <ThemeContext.Provider value={{ themeName, t, customAccent, changeTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme debe usarse dentro de ThemeProvider');
  return ctx;
};
