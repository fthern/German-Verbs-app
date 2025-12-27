import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { StudySetList } from './pages/StudySetList';
import { StudySession } from './pages/StudySession';
import { QuizSession } from './pages/QuizSession';
import { SetDetails } from './pages/SetDetails';
import { InstallPrompt } from './components/InstallPrompt';
import { Login } from './pages/Login';
import { Setup } from './pages/Setup';
import { useThemeStore } from './store/useThemeStore';
import { useStudyStore } from './store/useStudyStore';
import { useAuthStore } from './store/useAuthStore';
import { Loader2 } from 'lucide-react';

function App() {
  const { theme } = useThemeStore();
  const { sync } = useStudyStore();
  const { isAuthenticated, setupRequired, checkSetupStatus, logout, token } = useAuthStore();
  const [isSessionValidating, setIsSessionValidating] = useState(isAuthenticated);

  // Check setup status on mount
  useEffect(() => {
    checkSetupStatus();
  }, [checkSetupStatus]);

  // Verify token validity on mount if authenticated
  useEffect(() => {
    if (isAuthenticated && token) {
      setIsSessionValidating(true);
      fetch('https://backend.youware.com/api/auth/me', {
        headers: { 'Authorization': `Bearer ${token}` }
      })
      .then(res => {
        if (res.status === 401) {
          logout(); // Token invalid/expired -> Logout
        }
      })
      .catch(() => {
        // Network error or other issue, maybe keep logged in or show error?
        // For security, if we can't verify, we might want to be careful, 
        // but for offline support we should allow it.
        // Let's assume offline is OK if token exists.
      })
      .finally(() => {
        setIsSessionValidating(false);
      });
    } else {
      setIsSessionValidating(false);
    }
  }, [isAuthenticated, token, logout]);

  // Sync data when authenticated
  useEffect(() => {
    if (isAuthenticated && !isSessionValidating) {
      sync();
    }
  }, [isAuthenticated, isSessionValidating, sync]);

  // Theme handling
  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove('light', 'dark');

    if (theme === 'system') {
      const systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  // Loading State (Session Check)
  if (isSessionValidating) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-100">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-brand-600" size={48} />
          <p className="text-stone-500 font-medium">Oturum doğrulanıyor...</p>
        </div>
      </div>
    );
  }

  // Auth Guard
  if (!isAuthenticated) {
    if (setupRequired === null) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-stone-100">
          <Loader2 className="animate-spin text-brand-600" size={48} />
        </div>
      );
    }

    if (setupRequired) {
      return <Setup />;
    }

    return <Login />;
  }

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 font-sans text-gray-900 dark:text-gray-100 transition-colors duration-200">
        <Routes>
          <Route path="/" element={<StudySetList />} />
          <Route path="/set/:setId" element={<SetDetails />} />
          <Route path="/study/:setId" element={<StudySession />} />
          <Route path="/study/:setId/:cardId" element={<StudySession />} />
          <Route path="/quiz/:setId" element={<QuizSession />} />
        </Routes>
        <InstallPrompt />
      </div>
    </Router>
  );
}

export default App;
