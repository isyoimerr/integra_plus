import { useTheme } from '../../contexts/ThemeContext';

export default function ThemeToggle() {
  const { themeName, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      title={`Cambiar a tema ${themeName === 'dark' ? 'claro' : 'oscuro'}`}
      style={{
        position: 'absolute', top: 12, right: 12, zIndex: 100,
        width: 36, height: 36, borderRadius: '50%', border: 'none',
        background: themeName === 'dark' ? 'rgba(255,255,255,0.15)' : 'rgba(0,0,0,0.08)',
        cursor: 'pointer', fontSize: 17, display: 'flex', alignItems: 'center',
        justifyContent: 'center', transition: 'all 0.2s',
      }}
    >
      {themeName === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
