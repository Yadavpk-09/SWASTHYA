// client/src/pages/DashboardPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import {
  Flame,
  Zap,
  Scale,
  Droplets,
  Dumbbell,
  Play,
  Wind,
  Brain,
  Trophy,
  ArrowRight,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { WorkoutRunnerModal } from '../components/workout/WorkoutRunnerModal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const DashboardPage = ({ setActiveTab }) => {
  const { user, updateUserState } = useAuth();
  const { showToast } = useToast();

  const [assignedPlan, setAssignedPlan] = useState(null);
  const [todayWellness, setTodayWellness] = useState(null);
  const [analytics, setAnalytics] = useState(null);
  const [runnerOpen, setRunnerOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      const planId = user?.assignedPlanId || 'plan-1';
      const [planData, wellData, analyticsData] = await Promise.all([
        api.plans.getById(planId).catch(() => null),
        api.wellness.getToday().catch(() => null),
        api.progress.getAnalytics().catch(() => null)
      ]);

      setAssignedPlan(planData);
      setTodayWellness(wellData?.today);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, [user]);

  const handleQuickWater = async () => {
    try {
      const res = await api.wellness.logWater(250, 2500, false);
      if (res.user) updateUserState(res.user);
      showToast({
        type: 'points',
        title: 'Glass Logged!',
        message: `+250ml water logged. +${res.addedPoints} Points!`,
        points: res.addedPoints
      });
      fetchDashboardData();
    } catch (err) {
      console.error(err);
    }
  };

  const currentWater = todayWellness?.water_ml || 0;
  const goalWater = todayWellness?.water_goal || 2500;
  const waterPercent = Math.min(100, Math.round((currentWater / goalWater) * 100));

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      {/* Welcome Hero Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(19, 27, 46, 0.9) 0%, rgba(13, 21, 38, 0.9) 100%)',
        border: '1px solid var(--border-glass-bright)',
        borderRadius: '24px',
        padding: '28px 32px',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 20px 40px -15px rgba(0, 0, 0, 0.6)'
      }}>
        <div style={{
          position: 'absolute',
          top: '-30px',
          right: '-30px',
          width: '220px',
          height: '220px',
          background: 'radial-gradient(circle, rgba(16, 185, 129, 0.15) 0%, transparent 70%)',
          pointerEvents: 'none'
        }} />

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
              <span className="badge-pill badge-emerald">
                Level {user?.level || 1} Athlete
              </span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Goal: <strong style={{ color: '#cbd5e1' }}>{user?.profile?.goal || 'General Fitness'}</strong>
              </span>
            </div>
            <h1 style={{ fontSize: '2.1rem', color: '#f8fafc', marginBottom: '6px' }}>
              Welcome back, {user?.name?.split(' ')[0] || 'Athlete'}! ✨
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', maxWidth: '580px' }}>
              "Consistency compounds into strength." You are on a {user?.currentStreak || 1}-day active streak. Keep your momentum strong today!
            </p>
          </div>

          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
            <button
              onClick={() => setActiveTab('assessment')}
              className="btn-secondary"
              style={{ padding: '12px 20px', fontSize: '0.95rem', display: 'flex', alignItems: 'center', gap: '8px' }}
            >
              <Sparkles size={18} color="var(--emerald-primary)" />
              <span>My Swasthya Plan</span>
            </button>
            <button
              onClick={() => setRunnerOpen(true)}
              className="btn-primary"
              style={{ padding: '12px 24px', fontSize: '0.95rem' }}
            >
              <Play size={18} fill="#ffffff" />
              <span>Launch Today's Workout</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Stat Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px' }}>
        {/* Streak */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Active Streak
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {user?.currentStreak || 1} <span style={{ fontSize: '1rem', color: '#f87171' }}>Days</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Longest: {user?.longestStreak || 1} days
              </div>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(239, 68, 68, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Flame size={22} color="#ef4444" fill="#ef4444" />
            </div>
          </div>
        </div>

        {/* Total Points */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Wellness Points
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {user?.points || 0} <span style={{ fontSize: '1rem', color: '#fbbf24' }}>XP</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Level {user?.level || 1} • {150 - ((user?.points || 0) % 150)} to Next Lvl
              </div>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Zap size={22} color="#f59e0b" fill="#f59e0b" />
            </div>
          </div>
        </div>

        {/* BMI & Body Metrics */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                BMI Indicator
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {user?.profile?.bmi || 22.5}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '2px', fontWeight: 600 }}>
                {user?.profile?.bmiCategory || 'Normal weight'}
              </div>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Scale size={22} color="var(--emerald-primary)" />
            </div>
          </div>
        </div>

        {/* Daily Water */}
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Daily Hydration
              </div>
              <div style={{ fontSize: '1.9rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {currentWater} <span style={{ fontSize: '0.9rem', color: '#38bdf8' }}>/ {goalWater}ml</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                {waterPercent}% of target
              </div>
            </div>
            <div style={{
              width: '42px',
              height: '42px',
              borderRadius: '12px',
              background: 'rgba(6, 182, 212, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Droplets size={22} color="#06b6d4" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Row: Assigned Workout Hero + Quick Actions */}
      <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.8fr) minmax(0, 1.2fr)', gap: '20px' }}>
        {/* Today's Workout Card */}
        <div className="glass-panel" style={{ padding: '28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <span className="badge-pill badge-emerald">Today's Assigned Routine</span>
              <button
                onClick={() => setActiveTab('plans')}
                style={{
                  background: 'none',
                  border: 'none',
                  color: 'var(--text-secondary)',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  cursor: 'pointer'
                }}
              >
                <span>Switch Plan</span>
                <ArrowRight size={14} />
              </button>
            </div>

            <h2 style={{ fontSize: '1.5rem', color: '#f8fafc', marginBottom: '6px' }}>
              {assignedPlan?.title || 'Beginner Foundational Routine'}
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '20px' }}>
              {assignedPlan?.description}
            </p>

            {/* Day 1 Focus Preview */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: '14px',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>
                  {assignedPlan?.days?.[0]?.title || 'Day 1 Workout'}
                </span>
                <span className="badge-pill badge-violet">
                  {assignedPlan?.days?.[0]?.exercises?.length || 4} Exercises
                </span>
              </div>

              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {(assignedPlan?.days?.[0]?.exercises || []).map((exRef, idx) => (
                  <span
                    key={idx}
                    style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-glass)',
                      padding: '4px 10px',
                      borderRadius: '8px',
                      fontSize: '0.78rem',
                      color: '#cbd5e1'
                    }}
                  >
                    {exRef.exercise?.name || 'Exercise ' + (idx + 1)} ({exRef.sets}×{exRef.reps})
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div style={{ marginTop: '24px', display: 'flex', alignItems: 'center', gap: '14px' }}>
            <button
              onClick={() => setRunnerOpen(true)}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '0.95rem' }}
            >
              <Play size={18} fill="#ffffff" />
              <span>Start Interactive Workout</span>
            </button>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              ~35 mins • +50 Points reward
            </span>
          </div>
        </div>

        {/* Quick Holistic Wellness Actions */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Quick Water Button */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(6, 182, 212, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Droplets size={22} color="#06b6d4" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>Log 1 Glass Water</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>+250ml to your daily hydration</div>
              </div>
            </div>
            <button
              onClick={handleQuickWater}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              + Drink
            </button>
          </div>

          {/* Quick Guided Breathing */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(16, 185, 129, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Wind size={22} color="var(--emerald-primary)" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>Pranayama / Breathing</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>3-minute Box Breathing reset</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('breathing')}
              className="btn-primary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              Breathe
            </button>
          </div>

          {/* Quick Stress Roadmap */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Brain size={22} color="#a78bfa" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>Stress Roadmap</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Instant calming posture sequence</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('stress')}
              className="btn-accent"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              Analyze
            </button>
          </div>

          {/* Quick Smart Nutrition & Macros */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Flame size={22} color="#f59e0b" />
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>Smart Nutrition & Macros</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Auto-computed macros & targets</div>
              </div>
            </div>
            <button
              onClick={() => setActiveTab('nutrition')}
              className="btn-secondary"
              style={{ padding: '8px 14px', fontSize: '0.8rem' }}
            >
              Log Meal
            </button>
          </div>
        </div>
      </div>

      {/* Workout Runner Modal */}
      {runnerOpen && assignedPlan && (
        <WorkoutRunnerModal
          plan={assignedPlan}
          dayNumber={1}
          onClose={() => setRunnerOpen(false)}
          onWorkoutCompleted={fetchDashboardData}
        />
      )}
    </div>
  );
};
