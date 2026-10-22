import { Component, Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { ProgressProvider } from './contexts/ProgressContext';
import PhoneShell from './components/layout/PhoneShell';

// Landing
import LandingScreen            from './screens/LandingScreen';

// Auth
import LoginScreen              from './screens/LoginScreen';
import SelectRoleScreen         from './screens/auth/SelectRoleScreen';
import RegisterScreen           from './screens/auth/RegisterScreen';
import RegisterSuccessScreen    from './screens/auth/RegisterSuccessScreen';
import CallbackScreen           from './screens/auth/CallbackScreen';
import VerifyEmailScreen        from './screens/auth/VerifyEmailScreen';
import ForgotPasswordScreen    from './screens/auth/ForgotPasswordScreen';
import ResetPasswordScreen     from './screens/auth/ResetPasswordScreen';

// Student
import OnboardingWizard     from './screens/OnboardingWizard';
import DashboardScreen      from './screens/DashboardScreen';
import LevelMapScreen       from './screens/LevelMapScreen';
import LevelFaseAScreen     from './screens/level/LevelFaseAScreen';
import LevelFaseBScreen     from './screens/level/LevelFaseBScreen';
import ResultCorrectScreen  from './screens/level/ResultCorrectScreen';
import ResultWrongScreen    from './screens/level/ResultWrongScreen';
import LevelCompleteScreen  from './screens/level/LevelCompleteScreen';
import LevelDemoScreen      from './screens/level/LevelDemoScreen';
import ProfileScreen        from './screens/ProfileScreen';

// Teacher
import TeacherScreen        from './screens/TeacherScreen';
import AdminPanelScreen     from './screens/AdminPanelScreen';
import ExerciseEditorScreen from './screens/ExerciseEditorScreen';
import RecursosScreen       from './screens/RecursosScreen';
import ProgressScreen       from './screens/ProgressScreen';

const PUBLIC_PATHS = ['/', '/login', '/onboarding', '/select-role', '/register', '/verify-email', '/register-success', '/auth/callback', '/forgot-password', '/reset-password'];

class ErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error) { return { error }; }
  render() {
    if (this.state.error) {
      return (
        <div style={{ padding: 40, maxWidth: 500, margin: '100px auto', textAlign: 'center' }}>
          <div style={{ fontSize: 36, fontWeight: 800, color: '#E53935', marginBottom: 8 }}>Error</div>
          <div style={{ fontSize: 14, color: '#666', marginBottom: 20 }}>{this.state.error.message}</div>
          <button onClick={() => { this.setState({ error: null }); window.location.href = '/dashboard'; }}
            style={{ padding: '10px 24px', borderRadius: 10, background: '#1565C0', color: '#fff', border: 'none', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Volver al inicio
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  const { pathname } = useLocation();
  if (!isAuthenticated && !PUBLIC_PATHS.includes(pathname)) {
    return <Navigate to="/login" replace />;
  }
  return <ErrorBoundary>{children}</ErrorBoundary>;
}

function AppRoutes() {
  return (
    <PhoneShell>
      {/* Skip link accesibilidad */}
      <a href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:bg-green-700 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:text-sm focus:font-semibold">
        Ir al contenido principal
      </a>

      <Suspense fallback={<div style={{ padding: 32, textAlign: 'center', color: '#666' }}>Cargando...</div>}>
        <Routes>
          {/* Landing */}
          <Route path="/"                  element={<LandingScreen />} />

        {/* Auth */}
        <Route path="/login"             element={<LoginScreen />} />
        <Route path="/select-role"       element={<SelectRoleScreen />} />
        <Route path="/register"          element={<RegisterScreen />} />
        <Route path="/register-success"  element={<RegisterSuccessScreen />} />
        <Route path="/verify-email"      element={<VerifyEmailScreen />} />
        <Route path="/auth/callback"     element={<CallbackScreen />} />
        <Route path="/forgot-password"  element={<ForgotPasswordScreen />} />
        <Route path="/reset-password"   element={<ResetPasswordScreen />} />
        <Route path="/onboarding"        element={<OnboardingWizard />} />

        {/* Student */}
        <Route path="/dashboard"    element={<ProtectedRoute><DashboardScreen /></ProtectedRoute>} />
        <Route path="/levels"       element={<ProtectedRoute><LevelMapScreen /></ProtectedRoute>} />
        <Route path="/level/fase-a" element={<ProtectedRoute><LevelFaseAScreen /></ProtectedRoute>} />
        <Route path="/level/fase-b" element={<ProtectedRoute><LevelFaseBScreen /></ProtectedRoute>} />
        <Route path="/level/result-correct" element={<ProtectedRoute><ResultCorrectScreen /></ProtectedRoute>} />
        <Route path="/level/result-wrong"   element={<ProtectedRoute><ResultWrongScreen /></ProtectedRoute>} />
        <Route path="/level/complete"       element={<ProtectedRoute><LevelCompleteScreen /></ProtectedRoute>} />
        <Route path="/level/demo"           element={<ProtectedRoute><LevelDemoScreen /></ProtectedRoute>} />
        <Route path="/progress"        element={<ProtectedRoute><ProgressScreen /></ProtectedRoute>} />
        <Route path="/profile"      element={<ProtectedRoute><ProfileScreen /></ProtectedRoute>} />
        <Route path="/recursos"     element={<ProtectedRoute><RecursosScreen /></ProtectedRoute>} />

        {/* Teacher */}
        <Route path="/teacher"         element={<ProtectedRoute><TeacherScreen /></ProtectedRoute>} />
        <Route path="/admin"           element={<ProtectedRoute><AdminPanelScreen /></ProtectedRoute>} />
        <Route path="/exercise-editor" element={<ProtectedRoute><ExerciseEditorScreen /></ProtectedRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </Suspense>
    </PhoneShell>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ThemeProvider>
          <ProgressProvider>
            <AppRoutes />
          </ProgressProvider>
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
