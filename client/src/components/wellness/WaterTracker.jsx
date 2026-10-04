// client/src/components/wellness/WaterTracker.jsx
import React, { useState } from 'react';
import { Droplets, Plus, RotateCcw, CheckCircle2, Target } from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const WaterTracker = ({ todayLog, onRefresh }) => {
  const [customMl, setCustomMl] = useState('');
  const [customGoal, setCustomGoal] = useState('');
  const [showGoalInput, setShowGoalInput] = useState(false);
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const { updateUserState } = useAuth();

  const currentMl = todayLog?.water_ml || 0;
  const goalMl = todayLog?.water_goal || 2500;
  const percent = Math.min(100, Math.round((currentMl / goalMl) * 100));

  const handleAddWater = async (amount) => {
    setLoading(true);
    try {
      const res = await api.wellness.logWater(amount, goalMl, false);
      if (res.user) updateUserState(res.user);
      if (res.addedPoints > 0) {
        showToast({
          type: 'points',
          title: 'Hydrated!',
          message: `Added ${amount}ml. +${res.addedPoints} Points!`,
          points: res.addedPoints
        });
      }
      if (res.newlyUnlockedBadges?.length > 0) {
        res.newlyUnlockedBadges.forEach((b) => {
          showToast({
            type: 'badge',
            title: `Badge Unlocked: ${b.name}!`,
            message: b.description
          });
        });
      }
      onRefresh();
    } catch (err) {
      showToast({ type: 'error', title: 'Error logging water', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async () => {
    try {
      await api.wellness.logWater(0, goalMl, true);
      onRefresh();
      showToast({ type: 'info', title: 'Water Reset', message: 'Today’s water count was reset.' });
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateGoal = async () => {
    if (!customGoal) return;
    try {
      await api.wellness.logWater(0, Number(customGoal), false);
      setShowGoalInput(false);
      setCustomGoal('');
      onRefresh();
      showToast({ type: 'success', title: 'Goal Updated', message: `Daily water target set to ${customGoal}ml` });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'rgba(6, 182, 212, 0.15)',
            border: '1px solid rgba(6, 182, 212, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Droplets size={22} color="#06b6d4" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>Daily Hydration</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Target: {goalMl} ml / day</p>
          </div>
        </div>

        <button
          onClick={() => setShowGoalInput(!showGoalInput)}
          style={{
            background: 'none',
            border: '1px solid var(--border-glass)',
            borderRadius: '8px',
            padding: '6px 10px',
            color: 'var(--text-secondary)',
            fontSize: '0.75rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}
        >
          <Target size={14} />
          <span>Adjust Goal</span>
        </button>
      </div>

      {showGoalInput && (
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <input
            type="number"
            placeholder="New goal in ml (e.g. 3000)"
            className="input-field"
            value={customGoal}
            onChange={(e) => setCustomGoal(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          />
          <button onClick={handleUpdateGoal} className="btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Save
          </button>
        </div>
      )}

      {/* Visual Liquid Bottle Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '8px' }}>
          <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', fontFamily: 'var(--font-heading)' }}>
            {currentMl} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 500 }}>/ {goalMl} ml</span>
          </div>
          <div style={{
            fontSize: '1rem',
            fontWeight: 700,
            color: percent >= 100 ? '#34d399' : '#38bdf8'
          }}>
            {percent}%
          </div>
        </div>

        <div style={{
          height: '18px',
          background: 'rgba(255, 255, 255, 0.06)',
          borderRadius: '999px',
          overflow: 'hidden',
          padding: '2px',
          boxShadow: 'inset 0 2px 4px rgba(0, 0, 0, 0.4)'
        }}>
          <div style={{
            height: '100%',
            width: `${percent}%`,
            background: percent >= 100
              ? 'linear-gradient(90deg, #10b981 0%, #06b6d4 100%)'
              : 'linear-gradient(90deg, #0284c7 0%, #38bdf8 100%)',
            borderRadius: '999px',
            transition: 'width 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            boxShadow: '0 0 12px rgba(6, 182, 212, 0.5)'
          }} />
        </div>
      </div>

      {/* Quick Add Buttons */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
        <button
          onClick={() => handleAddWater(250)}
          disabled={loading}
          className="btn-secondary"
          style={{ padding: '10px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '2px' }}
        >
          <span style={{ fontWeight: 700 }}>+250 ml</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Glass</span>
        </button>

        <button
          onClick={() => handleAddWater(500)}
          disabled={loading}
          className="btn-secondary"
          style={{ padding: '10px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '2px' }}
        >
          <span style={{ fontWeight: 700 }}>+500 ml</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Bottle</span>
        </button>

        <button
          onClick={() => handleAddWater(1000)}
          disabled={loading}
          className="btn-secondary"
          style={{ padding: '10px', fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: '2px' }}
        >
          <span style={{ fontWeight: 700 }}>+1000 ml</span>
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Carafe</span>
        </button>
      </div>

      {/* Custom Log & Reset */}
      <div style={{ display: 'flex', gap: '8px', alignItems: 'center', paddingTop: '4px' }}>
        <input
          type="number"
          placeholder="Custom ml (e.g. 350)"
          className="input-field"
          value={customMl}
          onChange={(e) => setCustomMl(e.target.value)}
          style={{ padding: '8px 12px', fontSize: '0.85rem' }}
        />
        <button
          onClick={() => {
            if (customMl) {
              handleAddWater(Number(customMl));
              setCustomMl('');
            }
          }}
          className="btn-primary"
          style={{ padding: '8px 14px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
        >
          <Plus size={16} />
          <span>Add</span>
        </button>

        <button
          onClick={handleReset}
          className="btn-secondary"
          style={{ padding: '8px 12px' }}
          title="Reset today's water"
        >
          <RotateCcw size={15} />
        </button>
      </div>
    </div>
  );
};
