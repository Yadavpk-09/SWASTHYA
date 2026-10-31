// client/src/components/common/Navbar.jsx
import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Flame,
  Zap,
  ShieldCheck,
  User,
  LogOut,
  ChevronDown,
  Menu,
  X,
  Sparkles,
  HeartPulse
} from 'lucide-react';

export const Navbar = ({ activeTab, setActiveTab, sidebarOpen, setSidebarOpen }) => {
  const { user, logout, demoLogin, isAdmin } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [personaOpen, setPersonaOpen] = useState(false);

  const tabTitles = {
    dashboard: 'Athlete Dashboard',
    assessment: 'My Swasthya Plan',
    plans: 'Curated Workout Plans',
    exercises: 'Exercise Library',
    yoga: 'Yoga & Asanas',
    breathing: 'Breathing Techniques',
    stress: 'Stress Management Roadmap',
    nutrition: 'Smart Nutrition Tracker',
    progress: 'Weekly Weight & Progress',
    wellness: 'Water & Sleep Tracker',
    leaderboard: 'Badges & Leaderboard',
    profile: 'Profile & Settings',
    admin: 'Admin Console'
  };

  return (
    <header className="navbar-header" style={{
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'blur(16px)',
      borderBottom: '1px solid var(--border-glass)',
      position: 'sticky',
      top: 0,
      zIndex: 40,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between'
    }}>
      {/* Left: Mobile hamburger + Mobile brand / Desktop Section Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          style={{
            background: 'none',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            padding: '6px'
          }}
          className="lg-hidden"
          aria-label="Toggle Sidebar"
        >
          {sidebarOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Mobile Brand (visible when sidebar is hidden on small screens) */}
        <div
          onClick={() => setActiveTab('dashboard')}
          style={{ alignItems: 'center', gap: '8px', cursor: 'pointer' }}
          className="lg-hidden"
        >
          <div style={{
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 14px rgba(16, 185, 129, 0.4)',
            flexShrink: 0
          }}>
            <HeartPulse size={18} color="#ffffff" />
          </div>
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 800,
              fontSize: '1.05rem',
              letterSpacing: '-0.02em',
              background: 'linear-gradient(to right, #ffffff, #a7f3d0)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              SWASTHYA
            </span>
            <span style={{
              fontSize: '0.65rem',
              fontWeight: 700,
              color: 'var(--emerald-primary)',
              background: 'rgba(16, 185, 129, 0.12)',
              padding: '1px 5px',
              borderRadius: '999px',
              marginLeft: '6px',
              border: '1px solid rgba(16, 185, 129, 0.25)'
            }}>
              v2.0
            </span>
          </div>
        </div>

        {/* Desktop Active Page Title */}
        <div className="lg-visible" style={{ alignItems: 'center' }}>
          <h1 style={{
            margin: 0,
            fontSize: '1.45rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: '#ffffff',
            letterSpacing: '-0.025em',
            lineHeight: 1.2
          }}>
            {tabTitles[activeTab] || 'Dashboard'}
          </h1>
        </div>

        {/* Mobile Active Page Title */}
        <span className="lg-hidden" style={{
          fontSize: '1.05rem',
          fontWeight: 700,
          color: '#f8fafc',
          marginLeft: '6px',
          whiteSpace: 'nowrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          maxWidth: '150px'
        }}>
          {tabTitles[activeTab] || 'Dashboard'}
        </span>
      </div>

      {/* Right: Gamification stats + Persona switcher + User profile */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        {/* Streak counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(239, 68, 68, 0.1)',
          border: '1px solid rgba(239, 68, 68, 0.25)',
          padding: '5px 10px',
          borderRadius: '999px'
        }}>
          <Flame size={16} color="#ef4444" fill="#ef4444" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fca5a5' }}>
            {user?.currentStreak || 1}<span className="hide-on-xs">d Streak</span>
          </span>
        </div>

        {/* Points counter */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '5px',
          background: 'rgba(245, 158, 11, 0.1)',
          border: '1px solid rgba(245, 158, 11, 0.25)',
          padding: '5px 10px',
          borderRadius: '999px'
        }}>
          <Zap size={16} color="#f59e0b" fill="#f59e0b" />
          <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fcd34d' }}>
            {user?.points || 0}<span className="hide-on-xs"> pts</span>
          </span>
        </div>

        {/* User avatar & dropdown */}
        <div style={{ position: 'relative' }}>
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px'
            }}
          >
            {user?.profile?.avatarUrl ? (
              <img
                src={user.profile.avatarUrl}
                alt={user?.name}
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '2px solid var(--emerald-primary)'
                }}
              />
            ) : (
              <div
                style={{
                  width: '34px',
                  height: '34px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#ffffff',
                  fontWeight: 700,
                  fontSize: '0.8rem',
                  border: '2px solid var(--emerald-primary)'
                }}
              >
                {user?.name ? user.name.slice(0, 2).toUpperCase() : <User size={16} />}
              </div>
            )}
            <ChevronDown size={14} color="var(--text-secondary)" />
          </button>

          {dropdownOpen && (
            <div
              style={{
                position: 'absolute',
                top: '120%',
                right: 0,
                width: '210px',
                maxWidth: 'calc(100vw - 20px)',
                background: '#131b2e',
                border: '1px solid var(--border-glass-bright)',
                borderRadius: '12px',
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
                padding: '8px',
                zIndex: 50
              }}
              onMouseLeave={() => setDropdownOpen(false)}
            >
              <div style={{ padding: '8px 12px', borderBottom: '1px solid var(--border-glass)' }}>
                <div style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                  {user?.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {user?.role === 'admin' ? 'Coordinator (Admin)' : 'Student Athlete'}
                </div>
              </div>

              <button
                onClick={() => { setActiveTab('profile'); setDropdownOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  background: 'none',
                  border: 'none',
                  color: '#cbd5e1',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  borderRadius: '8px'
                }}
              >
                <User size={16} />
                <span>My Profile & BMI</span>
              </button>

              {isAdmin && (
                <button
                  onClick={() => { setActiveTab('admin'); setDropdownOpen(false); }}
                  style={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '10px 12px',
                    background: 'none',
                    border: 'none',
                    color: '#a78bfa',
                    fontSize: '0.85rem',
                    cursor: 'pointer',
                    borderRadius: '8px'
                  }}
                >
                  <ShieldCheck size={16} />
                  <span>Admin Panel</span>
                </button>
              )}

              <button
                onClick={() => { logout(); setDropdownOpen(false); }}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '10px 12px',
                  background: 'none',
                  border: 'none',
                  color: '#f87171',
                  fontSize: '0.85rem',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  borderTop: '1px solid var(--border-glass)',
                  marginTop: '4px'
                }}
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
