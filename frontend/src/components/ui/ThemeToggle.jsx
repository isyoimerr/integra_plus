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
        justifyContent: 'center', transition: 'all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        fontWeight: 700,
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.1) rotate(20deg)';
        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1) rotate(0deg)';
        e.currentTarget.style.boxShadow = 'none';
      }}
      onMouseDown={(e) => {
        // Usar keyframe global para consistencia visual
        e.currentTarget.style.animation = 'themeToggleSpin 0.45s cubic-bezier(0.34, 1.56, 0.64, 1)';
        setTimeout(() => {
          e.currentTarget.style.animation = 'none';
        }, 450);
      }}
    >
      {themeName === 'dark' ? '☀️' : '🌙'}
    </button>
  );
}
