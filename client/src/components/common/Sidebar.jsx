// client/src/components/common/Sidebar.jsx
import React from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  LayoutDashboard,
  Dumbbell,
  Library,
  Sparkles,
  Wind,
  Brain,
  Droplet,
  LineChart,
  Trophy,
  ShieldCheck,
  UserCheck,
  HelpCircle
} from 'lucide-react';

export const Sidebar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const { user, isAdmin } = useAuth();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'assessment', label: 'My Swasthya Plan', icon: Sparkles },
    { id: 'plans', label: 'Workout Plans', icon: Dumbbell },
    { id: 'exercises', label: 'Exercise Library', icon: Library },
    { id: 'yoga', label: 'Yoga / Asanas', icon: UserCheck },
    { id: 'breathing', label: 'Breathing Techniques', icon: Wind },
    { id: 'stress', label: 'Stress Roadmap', icon: Brain },
    { id: 'nutrition', label: 'Smart Nutrition Tracker', icon: HelpCircle },
    { id: 'progress', label: 'Weekly Progress', icon: LineChart },
    { id: 'wellness', label: 'Water & Sleep Tracker', icon: Droplet },
    { id: 'leaderboard', label: 'Badges & Leaderboard', icon: Trophy },
    { id: 'profile', label: 'Profile & Settings', icon: UserCheck }
  ];

  if (isAdmin) {
    navItems.push({ id: 'admin', label: 'Admin Console', icon: ShieldCheck, highlight: true });
  }

  return (
    <>
      {/* Mobile backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.7)',
            zIndex: 45
          }}
          className="lg-hidden"
        />
      )}

      <aside className={`sidebar-panel ${sidebarOpen ? 'sidebar-open' : ''}`}>
        {/* Navigation list */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', overflowY: 'auto' }}>
          <div style={{
            fontSize: '0.7rem',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            color: 'var(--text-muted)',
            padding: '4px 12px 8px 12px',
            fontWeight: 700
          }}>
            Platform Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '11px 14px',
                  borderRadius: '12px',
                  border: 'none',
                  background: isActive
                    ? item.highlight
                      ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.25) 0%, rgba(99, 102, 241, 0.25) 100%)'
                      : 'linear-gradient(135deg, rgba(16, 185, 129, 0.18) 0%, rgba(6, 182, 212, 0.18) 100%)'
                    : 'transparent',
                  color: isActive
                    ? item.highlight
                      ? '#c4b5fd'
                      : '#34d399'
                    : '#94a3b8',
                  borderLeft: isActive
                    ? item.highlight
                      ? '3px solid #8b5cf6'
                      : '3px solid #10b981'
                    : '3px solid transparent',
                  cursor: 'pointer',
                  fontWeight: isActive ? 700 : 500,
                  fontSize: '0.88rem',
                  textAlign: 'left',
                  transition: 'all 0.2s ease'
                }}
              >
                <Icon
                  size={19}
                  color={isActive ? (item.highlight ? '#a78bfa' : '#10b981') : '#64748b'}
                />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Bottom Level / Viva Card */}
        <div style={{
          background: 'rgba(23, 32, 54, 0.8)',
          border: '1px solid var(--border-glass)',
          borderRadius: '14px',
          padding: '14px',
          marginTop: '16px'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
              Level {user?.level || 1} Athlete
            </span>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--amber-primary)' }}>
              {user?.points || 0} XP
            </span>
          </div>

          {/* Progress bar to next level */}
          <div style={{
            height: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            borderRadius: '999px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              width: `${Math.min(100, (((user?.points || 0) % 150) / 150) * 100)}%`,
              background: 'linear-gradient(to right, #10b981, #06b6d4)',
              borderRadius: '999px'
            }} />
          </div>
        </div>
      </aside>
    </>
  );
};
