import { useLocation } from 'react-router-dom';
import { useTheme } from '../../contexts/ThemeContext';
import LeftNav from './LeftNav';

const BARE_PATHS = ['/', '/login', '/forgot-password', '/reset-password', '/onboarding'];

const NO_SIDEBAR = [
  '/', '/login', '/forgot-password', '/reset-password', '/onboarding',
  '/select-role', '/register', '/register-success', '/verify-email', '/auth/callback',
];

export default function PhoneShell({ children }) {
  const { t } = useTheme();
  const { pathname } = useLocation();

  const bare        = BARE_PATHS.includes(pathname);
  const showSidebar = !NO_SIDEBAR.includes(pathname);

  return (
    <div style={{
      width: '100%', minHeight: '100vh',
      background: bare ? 'transparent' : t.appBg,
      display: 'flex', flexDirection: 'row',
      position: 'relative',
    }}>
      {showSidebar && <LeftNav />}

      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <main id="main-content" role="main" style={{ display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }}>
          {children}
        </main>
      </div>
    </div>
  );
}
