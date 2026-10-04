// client/src/pages/ProgressPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  LineChart as ChartIcon,
  Plus,
  Scale,
  Flame,
  Calendar,
  Dumbbell,
  Clock,
  Sparkles,
  TrendingDown,
  TrendingUp,
  CheckCircle2,
  Activity,
  Layers
} from 'lucide-react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend
} from 'recharts';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';

export const ProgressPage = () => {
  const { user, updateUserState } = useAuth();
  const { showToast } = useToast();

  const [analytics, setAnalytics] = useState(null);
  const [weeklyData, setWeeklyData] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Weekly Weigh-in Modal (FR8.1)
  const [showWeighinModal, setShowWeighinModal] = useState(false);
  const [newWeight, setNewWeight] = useState('');
  const [chestCm, setChestCm] = useState('');
  const [waistCm, setWaistCm] = useState('');
  const [hipsCm, setHipsCm] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchProgress = async () => {
    try {
      const [analyticsData, weeklyRes, logsData] = await Promise.all([
        api.progress.getAnalytics(),
        api.progress.getWeekly(),
        api.progress.getLogs()
      ]);
      setAnalytics(analyticsData);
      setWeeklyData(weeklyRes);
      setLogs(logsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProgress();
  }, []);

  const handleWeeklyWeighin = async (e) => {
    e.preventDefault();
    if (!newWeight) return;
    setSubmitting(true);

    try {
      const res = await api.progress.logWeeklyWeighin({
        weight: parseFloat(newWeight),
        chest_cm: chestCm ? parseFloat(chestCm) : null,
        waist_cm: waistCm ? parseFloat(waistCm) : null,
        hips_cm: hipsCm ? parseFloat(hipsCm) : null,
        notes
      });

      if (res.user) updateUserState(res.user);

      showToast({
        type: 'points',
        title: 'Weekly Weigh-in Recorded!',
        message: `${res.message} (+${res.addedPoints} Points)`,
        points: res.addedPoints
      });

      setNewWeight('');
      setChestCm('');
      setWaistCm('');
      setHipsCm('');
      setNotes('');
      setShowWeighinModal(false);
      fetchProgress();
    } catch (err) {
      showToast({ type: 'error', title: 'Weigh-in Error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const currentWeek = weeklyData?.currentWeek || {
    weight: user?.profile?.weight || 65,
    workoutsCompleted: 3,
    workoutsPlanned: 4,
    adherencePercent: 75,
    weightDiffText: '-0.4 kg this week',
    completionSummary: '3/4 workouts completed'
  };

  const weeklyHistory = weeklyData?.weeklyHistory || [];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-primary)', marginBottom: '8px' }}>
            <ChartIcon size={20} />
            <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              Longitudinal Physical Telemetry (Module 8)
            </span>
          </div>
          <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: '#f8fafc' }}>
            Weekly Weight & Progress Tracking
          </h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
            Scientific progress logging: prompt-based weekly weigh-ins to remove water weight volatility and track true plan adherence.
          </p>
        </div>

        <button
          onClick={() => setShowWeighinModal(true)}
          className="btn-primary"
          style={{ padding: '12px 24px', fontSize: '0.925rem' }}
        >
          <Scale size={18} />
          <span>Log Weekly Weigh-In</span>
        </button>
      </div>

      {/* WEEKLY PROMPT & COMPARISON SUMMARY CARD (PRD FR8.1 & FR8.3) */}
      <div className="glass-panel" style={{
        padding: '24px',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.08) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)',
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
        gap: '20px',
        alignItems: 'center'
      }}>
        {/* Weekly Prompt Reminder (FR8.1) */}
        <div>
          <span className="badge-pill badge-emerald" style={{ fontSize: '0.72rem' }}>
            Weekly Cadence Protocol (FR8.1)
          </span>
          <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginTop: '6px' }}>
            Weekly Weigh-in Prompt
          </h3>
          <p style={{ fontSize: '0.85rem', color: '#cbd5e1', lineHeight: 1.5, marginTop: '4px' }}>
            The Swasthya engine prompts for weight and circumference once per week rather than daily,
            preventing daily water-fluid bias and maintaining authentic motivation.
          </p>
        </div>

        {/* Current vs Prev Week Comparative Card (FR8.3) */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.35)',
          borderRadius: '14px',
          padding: '16px 20px',
          border: '1px solid rgba(255, 255, 255, 0.08)'
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
            Current Week vs Previous Week (FR8.3)
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '10px', marginTop: '4px' }}>
            <span style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc' }}>
              {currentWeek.weight} kg
            </span>
            <span style={{
              fontSize: '0.9rem',
              fontWeight: 700,
              color: currentWeek.weightDiffText.includes('-') ? '#34d399' : '#fbbf24',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {currentWeek.weightDiffText.includes('-') ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
              <span>{currentWeek.weightDiffText}</span>
            </span>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '12px', borderTop: '1px solid var(--border-glass)', paddingTop: '10px' }}>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Workouts Completed:</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: '#38bdf8' }}>
                {currentWeek.completionSummary}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Plan Adherence:</div>
              <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--emerald-primary)' }}>
                {currentWeek.adherencePercent}% Adherent
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Metric Tiles */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Workouts Logged
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
            {analytics?.summary?.totalWorkouts || 0}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '2px' }}>
            {analytics?.summary?.totalMinutes || 0} cumulative minutes
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Total Energy Burned
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
            {analytics?.summary?.totalCalories || 0} <span style={{ fontSize: '1rem', color: '#fbbf24' }}>kcal</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Active physical expenditure
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Current BMI Profile
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
            {user?.profile?.bmi || 22.5}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '2px' }}>
            {user?.profile?.bmiCategory || 'Normal weight'}
          </div>
        </div>

        <div className="glass-panel" style={{ padding: '20px' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
            Consistency Streak
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
            {user?.currentStreak || 1} <span style={{ fontSize: '1rem', color: '#f87171' }}>Days</span>
          </div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
            Longest record: {user?.longestStreak || 1} days
          </div>
        </div>
      </div>

      {/* WEEKLY TREND GRAPHS (PRD FR8.2 & FR8.4) */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(420px, 1fr))', gap: '20px' }}>
        {/* Weight over weeks graph (FR8.2) */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>Weight Over Weeks (kg)</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Retained historical weekly trend line (FR8.2 & FR8.4)</p>
            </div>
            <span className="badge-pill badge-emerald">Weekly Log</span>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            {weeklyHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={weeklyHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                  <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} domain={['dataMin - 1', 'dataMax + 1']} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{ fill: '#10b981', r: 4 }} activeDot={{ r: 6 }} name="Weight (kg)" />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                No weekly weigh-ins recorded yet.
              </div>
            )}
          </div>
        </div>

        {/* Workouts completed & Adherence % (FR8.2) */}
        <div className="glass-panel" style={{ padding: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
            <div>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>Plan Adherence % & Volume</h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Adherence % to generated Swasthya plan (FR8.2)</p>
            </div>
            <span className="badge-pill badge-violet">Adherence</span>
          </div>

          <div style={{ width: '100%', height: '260px' }}>
            {weeklyHistory.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={weeklyHistory}>
                  <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.06)" />
                  <XAxis dataKey="week" stroke="#64748b" fontSize={11} tickLine={false} />
                  <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} tickLine={false} />
                  <Tooltip
                    contentStyle={{ background: '#0f172a', border: '1px solid var(--border-glass)', borderRadius: '8px' }}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Bar dataKey="adherencePercent" fill="#06b6d4" radius={[6, 6, 0, 0]} name="Adherence %" />
                  <Bar dataKey="workoutsCompleted" fill="#8b5cf6" radius={[6, 6, 0, 0]} name="Workouts Done" />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-muted)' }}>
                Weekly adherence will chart here after your check-ins.
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Activity Log List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '14px' }}>
          Recent Activity & Session Logs
        </h3>

        {logs.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No sessions logged yet. Complete today's workout or breathing session to earn points!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {logs.map((log) => (
              <div
                key={log.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge-pill ${log.type === 'workout' ? 'badge-emerald' : 'badge-violet'}`}>
                      {log.type}
                    </span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
                      {log.details}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Logged on {log.date} • {log.value}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.85rem' }}>
                  {log.durationMinutes > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#cbd5e1' }}>
                      <Clock size={14} color="var(--emerald-primary)" />
                      <span>{log.durationMinutes} mins</span>
                    </span>
                  )}
                  {log.calories > 0 && (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px', color: '#fbbf24', fontWeight: 700 }}>
                      <Flame size={14} />
                      <span>{log.calories} kcal</span>
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Weekly Weigh-In Modal (FR8.1: weight + optional measurements) */}
      {showWeighinModal && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 16, 0.85)',
          backdropFilter: 'blur(10px)',
          zIndex: 100,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '16px'
        }}>
          <div className="glass-panel" style={{ width: '100%', maxWidth: '460px', padding: '28px' }}>
            <h3 style={{ fontSize: '1.3rem', color: '#f8fafc', marginBottom: '6px' }}>
              Weekly Weigh-In Check-In (FR8.1)
            </h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
              Log weight and optional body tape circumferences for your rolling weekly assessment.
            </p>

            <form onSubmit={handleWeeklyWeighin} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Body Weight (kg) *
                </label>
                <input
                  type="number"
                  step="0.1"
                  required
                  placeholder="e.g. 64.5"
                  className="input-field"
                  value={newWeight}
                  onChange={(e) => setNewWeight(e.target.value)}
                  autoFocus
                />
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '4px' }}>
                Optional Body Tape Measurements:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Chest (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 96"
                    className="input-field"
                    value={chestCm}
                    onChange={(e) => setChestCm(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Waist (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 80"
                    className="input-field"
                    value={waistCm}
                    onChange={(e) => setWaistCm(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', display: 'block', marginBottom: '4px' }}>
                    Hips (cm)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    placeholder="e.g. 98"
                    className="input-field"
                    value={hipsCm}
                    onChange={(e) => setHipsCm(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Check-in Notes (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Felt energetic, recovery on point this week"
                  className="input-field"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '12px' }}>
                <button
                  type="button"
                  onClick={() => setShowWeighinModal(false)}
                  className="btn-secondary"
                  style={{ padding: '8px 16px' }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-primary"
                  style={{ padding: '8px 24px' }}
                >
                  <span>{submitting ? 'Recording...' : 'Save Weekly Check-In'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
