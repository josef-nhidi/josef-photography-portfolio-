import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// Hooks
import { useSecurity } from './hooks/useSecurity';
import { useSettings } from './hooks/useSettings';
import { useAuth } from './hooks/useAuth';

// Components
import Navbar from './components/layout/Navbar';
import PageTransition from './components/ui/PageTransition';
import SEO from './components/ui/SEO';

// Pages
import Portraits from './pages/Portraits';
import Events from './pages/Events';
import About from './pages/About';
import AlbumDetail from './pages/AlbumDetail';
import AdminDashboard from './pages/AdminDashboard';
import AdminLogin from './pages/AdminLogin';
import { ThemeProvider } from './context/ThemeContext';

/**
 * AnimatedRoutes
 * Handles route transitions and path mapping.
 */
function AnimatedRoutes({ settings, setIsAdmin, refreshSettings }) {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/"                 element={<Navigate to="/portraits" replace />} />
        <Route path="/portraits"        element={<PageTransition><Portraits settings={settings} /></PageTransition>} />
        <Route path="/events"           element={<PageTransition><Events settings={settings} /></PageTransition>} />
        <Route path="/album/:id"        element={<PageTransition><AlbumDetail settings={settings} /></PageTransition>} />
        <Route path="/about"            element={<PageTransition><About settings={settings} /></PageTransition>} />
        <Route path="/admin/josef/login"      element={<PageTransition><AdminLogin onLogin={refreshSettings} setIsAdmin={setIsAdmin} /></PageTransition>} />
        <Route path="/admin/dashboard"  element={<PageTransition><AdminDashboard setIsAdmin={setIsAdmin} /></PageTransition>} />
      </Routes>
    </AnimatePresence>
  );
}

/**
 * AppContent
 * Main layout wrapper that determines when to show the Navbar and Footer.
 */
function AppContent() {
  const location = useLocation();
  const { settings, loading, refreshSettings } = useSettings();
  const { isAdmin, setIsAdmin } = useAuth();
  const [isLensMode, setIsLensMode] = React.useState(window.innerWidth <= 1024);
  
  // Activate global security layer
  useSecurity();

  React.useEffect(() => {
    const handleResize = () => setIsLensMode(window.innerWidth <= 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const isAdminDashboard = location.pathname === '/admin/dashboard';

  if (loading) return <div className="loader-full">Loading Professional Portfolio...</div>;

  if (isAdminDashboard) {
    return <AnimatedRoutes settings={settings} setIsAdmin={setIsAdmin} refreshSettings={refreshSettings} />;
  }

  return (
    <div className={`app-layout ${isLensMode ? 'lens-mode' : ''}`}>
      <Navbar settings={settings} isAdmin={isAdmin} />
      <div className="main-content-wrapper">
        <SEO settings={settings} />
        <main className="main-content">
          <AnimatedRoutes settings={settings} setIsAdmin={setIsAdmin} refreshSettings={refreshSettings} />
        </main>
        <footer className="footer">
          {settings?.footer_copy || `© ${new Date().getFullYear()} Josef Nhidi Photography. All Rights Reserved.`}
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <Router>
        <AppContent />
      </Router>
    </ThemeProvider>
  );
}

export default App;
