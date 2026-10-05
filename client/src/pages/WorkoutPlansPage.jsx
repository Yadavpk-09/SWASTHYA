// client/src/pages/WorkoutPlansPage.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { Dumbbell, Calendar, CheckCircle2, Play, ChevronDown, ChevronUp, Sparkles, Filter } from 'lucide-react';
import { WorkoutRunnerModal } from '../components/workout/WorkoutRunnerModal.jsx';
import { useToast } from '../context/ToastContext.jsx';

export const WorkoutPlansPage = () => {
  const { user, updateUserState } = useAuth();
  const { showToast } = useToast();

  const [plans, setPlans] = useState([]);
  const [selectedGoal, setSelectedGoal] = useState('All');
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [expandedPlanId, setExpandedPlanId] = useState(null);
  const [runnerPlan, setRunnerPlan] = useState(null);
  const [runnerDay, setRunnerDay] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const data = await api.plans.getAll();
        setPlans(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  const handleAssignPlan = async (planId) => {
    try {
      const res = await api.plans.assign(planId);
      if (res.user) updateUserState(res.user);
      showToast({
        type: 'success',
        title: 'Plan Assigned!',
        message: `Active routine updated to: ${res.plan.title}`
      });
    } catch (err) {
      showToast({ type: 'error', title: 'Error assigning plan', message: err.message });
    }
  };

  const filteredPlans = plans.filter((p) => {
    if (selectedGoal !== 'All' && !p.goalType.toLowerCase().includes(selectedGoal.toLowerCase())) {
      return false;
    }
    if (selectedLevel !== 'All' && p.level.toLowerCase() !== selectedLevel.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-primary)', marginBottom: '8px' }}>
          <Dumbbell size={20} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Structured Periodization Engine
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Curated Workout Plans</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Science-backed training programs mapped by muscle recovery splits, progressive overload, and goal targets.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="glass-panel" style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '14px' }}>
        <div className="scroll-x-touch" style={{ alignItems: 'center', flex: 1, minWidth: '240px' }}>
          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
            <Filter size={16} />
            <span>Goal:</span>
          </span>
          {['All', 'Fat Loss', 'Muscle Gain', 'Flexibility & Yoga', 'Strength', 'Endurance'].map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGoal(g)}
              style={{
                padding: '6px 14px',
                borderRadius: '999px',
                border: selectedGoal === g ? '1px solid var(--emerald-primary)' : '1px solid var(--border-glass)',
                background: selectedGoal === g ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedGoal === g ? '#34d399' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap',
                flexShrink: 0
              }}
            >
              {g}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Level:</span>
          <select
            className="input-field"
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            style={{ padding: '6px 12px', fontSize: '0.85rem', width: 'auto' }}
          >
            <option value="All">All Levels</option>
            <option value="Beginner">Beginner</option>
            <option value="Intermediate">Intermediate</option>
            <option value="Advanced">Advanced</option>
          </select>
        </div>
      </div>

      {/* Plans Grid */}
      <div className="grid-cards-responsive">
        {filteredPlans.map((plan) => {
          const isAssigned = user?.assignedPlanId === plan.id;
          const isExpanded = expandedPlanId === plan.id;

          return (
            <div
              key={plan.id}
              className="glass-panel"
              style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                border: isAssigned ? '1px solid rgba(16, 185, 129, 0.5)' : undefined
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                    <span className="badge-pill badge-emerald">{plan.goalType}</span>
                    <span className="badge-pill badge-violet">{plan.level}</span>
                  </div>
                  {isAssigned && (
                    <span className="badge-pill badge-amber" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle2 size={13} />
                      <span>Active Routine</span>
                    </span>
                  )}
                </div>

                <h3 style={{ fontSize: '1.25rem', color: '#f8fafc', marginBottom: '8px' }}>
                  {plan.title}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  {plan.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Calendar size={15} color="var(--emerald-primary)" />
                    <span>{plan.durationDays} Days / Week</span>
                  </span>
                  <span>•</span>
                  <span>{plan.days?.length || 3} Structured Workouts</span>
                </div>

                {/* Day-by-Day Accordion Breakdown */}
                {isExpanded && (
                  <div style={{
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    padding: '14px',
                    marginBottom: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}>
                    {(plan.days || []).map((day) => (
                      <div key={day.dayNumber} style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '8px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <span style={{ fontWeight: 700, fontSize: '0.85rem', color: '#f8fafc' }}>
                            Day {day.dayNumber}: {day.title}
                          </span>
                          <button
                            onClick={() => {
                              setRunnerPlan(plan);
                              setRunnerDay(day.dayNumber);
                            }}
                            className="btn-primary"
                            style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                          >
                            <Play size={12} />
                            <span>Run Day</span>
                          </button>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                          Focus: {day.focus} • {day.exercises?.length || 0} exercises
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '16px' }}>
                <button
                  onClick={() => setExpandedPlanId(isExpanded ? null : plan.id)}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: 'var(--text-secondary)',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <span>{isExpanded ? 'Hide Days' : 'View Schedule'}</span>
                  {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </button>

                {isAssigned ? (
                  <button
                    onClick={() => {
                      setRunnerPlan(plan);
                      setRunnerDay(1);
                    }}
                    className="btn-primary"
                    style={{ padding: '8px 18px', fontSize: '0.85rem' }}
                  >
                    <Play size={15} />
                    <span>Run Workout</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleAssignPlan(plan.id)}
                    className="btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '0.85rem' }}
                  >
                    <span>Assign as My Plan</span>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Workout Runner Modal */}
      {runnerPlan && (
        <WorkoutRunnerModal
          plan={runnerPlan}
          dayNumber={runnerDay}
          onClose={() => setRunnerPlan(null)}
          onWorkoutCompleted={() => {}}
        />
      )}
    </div>
  );
};
