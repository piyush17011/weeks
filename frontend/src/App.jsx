import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './store/auth.jsx';
import { SettingsProvider } from './store/settings.jsx';
import LandingPage from './pages/LandingPage.jsx';
import AuthPage from './pages/AuthPage.jsx';
import GridPage from './pages/GridPage.jsx';
import WeekPage from './pages/WeekPage.jsx';
import AnalyticsPage from './pages/AnalyticsPage.jsx';
import Layout from './components/shared/Layout.jsx';

function Protected({ children }) {
  const { user, loading } = useAuth();
  if (loading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg)' }}>
      <span className="label" style={{ animation: 'pulse 1.5s infinite' }}>loading</span>
    </div>
  );
  return user ? children : <Navigate to="/auth" replace />;
}

function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/"         element={user ? <Navigate to="/grid" replace /> : <LandingPage />} />
      <Route path="/auth"     element={user ? <Navigate to="/grid" replace /> : <AuthPage />} />
      <Route path="/grid"     element={<Protected><Layout><GridPage /></Layout></Protected>} />
      <Route path="/week/:weekNumber" element={<Protected><Layout><WeekPage /></Layout></Protected>} />
      <Route path="/analytics" element={<Protected><Layout><AnalyticsPage /></Layout></Protected>} />
      <Route path="*"         element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <SettingsProvider>
        <AppRoutes />
      </SettingsProvider>
    </AuthProvider>
  );
}
