import { useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import ThemeToggle from '../ui/ThemeToggle';

const BARE_PATHS = ['/', '/login', '/forgot-password', '/reset-password', '/onboarding'];

export default function PhoneShell({ children }) {
  const { t } = useTheme();
  const { pathname } = useLocation();
  const bare = BARE_PATHS.includes(pathname);
  return (
    <div style={{ width: '100%', minHeight: '100vh', background: bare ? 'transparent' : t.appBg, display: 'flex', flexDirection: 'column', position: 'relative' }}>
      {!bare && <ThemeToggle />}
      <main id="main-content" role="main" style={{ display: 'flex', flexDirection: 'column', flex: 1 }}>
        {children}
      </main>
    </div>
  );
}
