// client/src/App.jsx
import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.jsx';
import { ToastProvider } from './context/ToastContext.jsx';
import { Navbar } from './components/common/Navbar.jsx';
import { Sidebar } from './components/common/Sidebar.jsx';
import { FitBotChatDrawer } from './components/chatbot/FitBotChatDrawer.jsx';

import { AuthPage } from './pages/AuthPage.jsx';
import { AdminAuthPage } from './pages/AdminAuthPage.jsx';
import { DashboardPage } from './pages/DashboardPage.jsx';
import { WorkoutPlansPage } from './pages/WorkoutPlansPage.jsx';
import { ExerciseLibraryPage } from './pages/ExerciseLibraryPage.jsx';
import { YogaLibraryPage } from './pages/YogaLibraryPage.jsx';
import { BreathingLibraryPage } from './pages/BreathingLibraryPage.jsx';
import { StressRoadmap } from './components/yoga/StressRoadmap.jsx';
import { NutritionPage } from './pages/NutritionPage.jsx';
import { WellnessPage } from './pages/WellnessPage.jsx';
import { ProgressPage } from './pages/ProgressPage.jsx';
import { LeaderboardPage } from './pages/LeaderboardPage.jsx';
import { ProfilePage } from './pages/ProfilePage.jsx';
import { AdminPage } from './pages/AdminPage.jsx';
import { AssessmentPage } from './pages/AssessmentPage.jsx';

const MainApp = () => {
  const { isAuthenticated, loading, isAdmin, user } = useAuth();
  const [activeTab, setActiveTab] = useState(isAdmin ? 'admin' : 'dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [authSurface, setAuthSurface] = useState(
    typeof window !== 'undefined' && window.location.pathname.startsWith('/admin') ? 'admin' : 'user'
  );

  // Sync initial tab when user logs in
  React.useEffect(() => {
    if (isAdmin && activeTab !== 'admin') {
      setActiveTab('admin');
    }
  }, [isAdmin]);

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--bg-main)',
        color: 'var(--text-secondary)',
        fontSize: '1rem',
        fontWeight: 600
      }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
          <div style={{
            width: '44px',
            height: '44px',
            borderRadius: '50%',
            border: '3px solid rgba(16, 185, 129, 0.2)',
            borderTopColor: 'var(--emerald-primary)',
            animation: 'spin 1s linear infinite'
          }} />
          <span>Synchronizing SWASTHYA Engine v2.0...</span>
        </div>
      </div>
    );
  }

  // Unauthenticated Entry Surface with Top User/Admin Options (Module 1 - FR1.1 & FR1.7)
  if (!isAuthenticated) {
    return (
      <AuthPage
        initialRole={authSurface}
        onRoleChange={(newRole) => setAuthSurface(newRole)}
      />
    );
  }

  // Render current tab page
  const renderPage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardPage setActiveTab={setActiveTab} />;
      case 'assessment':
        return <AssessmentPage onComplete={() => setActiveTab('dashboard')} />;
      case 'plans':
        return <WorkoutPlansPage />;
      case 'exercises':
        return <ExerciseLibraryPage />;
      case 'yoga':
        return <YogaLibraryPage setActiveTab={setActiveTab} />;
      case 'breathing':
        return <BreathingLibraryPage />;
      case 'stress':
        return (
          <StressRoadmap
            onSelectAsana={() => setActiveTab('yoga')}
            onStartBreathing={() => setActiveTab('breathing')}
          />
        );
      case 'nutrition':
        return <NutritionPage />;
      case 'wellness':
        return <WellnessPage />;
      case 'progress':
        return <ProgressPage />;
      case 'leaderboard':
        return <LeaderboardPage />;
      case 'profile':
        return <ProfilePage setActiveTab={setActiveTab} />;
      case 'admin':
        // Protected route: user token cannot access /admin/* (FR1.7)
        return isAdmin ? <AdminPage /> : <DashboardPage setActiveTab={setActiveTab} />;
      default:
        return <DashboardPage setActiveTab={setActiveTab} />;
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        sidebarOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
      />

      <div className="main-content">
        {/* Top Navbar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        {/* Main Page View */}
        <main className="page-body">
          {renderPage()}
        </main>

        {/* Floating AI FitBot Assistant */}
        <FitBotChatDrawer />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <ToastProvider>
      <AuthProvider>
        <MainApp />
      </AuthProvider>
    </ToastProvider>
  );
}
