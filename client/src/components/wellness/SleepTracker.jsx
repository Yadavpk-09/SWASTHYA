// client/src/components/wellness/SleepTracker.jsx
import React, { useState } from 'react';
import { Moon, Bed, Clock, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const SleepTracker = ({ todayLog, weeklyLogs = [], onRefresh }) => {
  const [sleepTime, setSleepTime] = useState(todayLog?.sleepTime || '23:00');
  const [wakeTime, setWakeTime] = useState(todayLog?.wakeTime || '07:00');
  const [sleepQuality, setSleepQuality] = useState(todayLog?.sleepQuality || 'Good');
  const [mood, setMood] = useState(todayLog?.mood || 'Refreshed');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const { updateUserState } = useAuth();

  const handleSaveSleep = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.wellness.logSleep({
        sleepTime,
        wakeTime,
        sleepQuality,
        mood
      });

      if (res.user) updateUserState(res.user);
      if (res.addedPoints > 0) {
        showToast({
          type: 'points',
          title: 'Sleep Logged!',
          message: `Recorded ${res.log.sleepHours} hrs of sleep. +${res.addedPoints} Points!`,
          points: res.addedPoints
        });
      }
      onRefresh();
    } catch (err) {
      showToast({ type: 'error', title: 'Error logging sleep', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div style={{
          width: '38px',
          height: '38px',
          borderRadius: '12px',
          background: 'rgba(139, 92, 246, 0.15)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Moon size={22} color="#a78bfa" />
        </div>
        <div>
          <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>Sleep & Recovery</h3>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            Last Night: <strong style={{ color: '#c4b5fd' }}>{todayLog?.sleepHours ? `${todayLog.sleepHours} hrs (${todayLog.sleepQuality})` : 'Not logged yet'}</strong>
          </p>
        </div>
      </div>

      {/* Sleep Time Inputs */}
      <form onSubmit={handleSaveSleep} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Bedtime
            </label>
            <input
              type="time"
              className="input-field"
              value={sleepTime}
              onChange={(e) => setSleepTime(e.target.value)}
              required
            />
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Wake Time
            </label>
            <input
              type="time"
              className="input-field"
              value={wakeTime}
              onChange={(e) => setWakeTime(e.target.value)}
              required
            />
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Quality
            </label>
            <select
              className="input-field"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(e.target.value)}
            >
              <option value="Restful">Restful & Deep</option>
              <option value="Good">Good</option>
              <option value="Fair">Fair / Interrupted</option>
              <option value="Disturbed">Disturbed / Restless</option>
            </select>
          </div>

          <div>
            <label style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
              Morning Mood
            </label>
            <select
              className="input-field"
              value={mood}
              onChange={(e) => setMood(e.target.value)}
            >
              <option value="Refreshed">Refreshed & Ready</option>
              <option value="Energized">High Energy</option>
              <option value="Normal">Normal</option>
              <option value="Groggy">Groggy / Fatigued</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn-accent"
          style={{ width: '100%', padding: '10px' }}
        >
          <Bed size={16} />
          <span>Save Sleep Log (+15 XP)</span>
        </button>
      </form>

      {/* Mini 7-day Sleep History */}
      {weeklyLogs.length > 0 && (
        <div style={{ borderTop: '1px solid var(--border-glass)', paddingTop: '14px' }}>
          <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '10px' }}>
            Past 7 Days Sleep Volume
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', height: '60px', gap: '8px' }}>
            {weeklyLogs.map((log, idx) => {
              const hrs = log.sleepHours || 0;
              const barHeight = Math.min(100, Math.round((hrs / 10) * 100));
              const d = new Date(log.date);
              const dayStr = ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][d.getDay()];

              return (
                <div key={idx} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                  <span style={{ fontSize: '0.65rem', color: '#c4b5fd', fontWeight: 700 }}>{hrs}h</span>
                  <div style={{
                    width: '100%',
                    height: `${barHeight}%`,
                    background: hrs >= 7 ? 'linear-gradient(180deg, #a78bfa 0%, #7c3aed 100%)' : 'rgba(167, 139, 250, 0.4)',
                    borderRadius: '4px',
                    minHeight: '6px'
                  }} />
                  <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{dayStr}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
