// client/src/components/workout/WorkoutRunnerModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  CheckCircle2,
  Timer,
  Play,
  Pause,
  RotateCcw,
  Flame,
  Award,
  ChevronRight,
  Info
} from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const WorkoutRunnerModal = ({ plan, dayNumber = 1, onClose, onWorkoutCompleted }) => {
  const { updateUserState } = useAuth();
  const { showToast } = useToast();

  const dayData = plan?.days?.find((d) => d.dayNumber === Number(dayNumber)) || plan?.days?.[0];
  const exercises = dayData?.exercises || [];

  // Track completed sets map: { 'exIdx-setIdx': true }
  const [completedSets, setCompletedSets] = useState({});
  const [activeExerciseIndex, setActiveExerciseIndex] = useState(0);
  const [workoutSeconds, setWorkoutSeconds] = useState(0);
  const [workoutPaused, setWorkoutPaused] = useState(false);

  // Rest Timer state
  const [restTimerActive, setRestTimerActive] = useState(false);
  const [restSecondsLeft, setRestSecondsLeft] = useState(60);
  const [targetRestSeconds, setTargetRestSeconds] = useState(60);

  const workoutTimerRef = useRef(null);
  const restTimerRef = useRef(null);

  // Overall workout elapsed timer
  useEffect(() => {
    if (!workoutPaused) {
      workoutTimerRef.current = setInterval(() => {
        setWorkoutSeconds((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(workoutTimerRef.current);
  }, [workoutPaused]);

  // Rest countdown timer
  useEffect(() => {
    if (restTimerActive) {
      restTimerRef.current = setInterval(() => {
        setRestSecondsLeft((prev) => {
          if (prev <= 1) {
            setRestTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(restTimerRef.current);
  }, [restTimerActive]);

  const toggleSet = (exIdx, setIdx, restSec = 60) => {
    const key = `${exIdx}-${setIdx}`;
    const nextVal = !completedSets[key];
    setCompletedSets((prev) => ({
      ...prev,
      [key]: nextVal
    }));

    if (nextVal) {
      // Trigger rest timer
      setTargetRestSeconds(restSec || 60);
      setRestSecondsLeft(restSec || 60);
      setRestTimerActive(true);
    }
  };

  const currentExercise = exercises[activeExerciseIndex];
  const totalSetsExpected = exercises.reduce((acc, ex) => acc + (ex.sets || 3), 0);
  const totalSetsDone = Object.values(completedSets).filter(Boolean).length;
  const progressPercent = totalSetsExpected > 0 ? Math.round((totalSetsDone / totalSetsExpected) * 100) : 0;

  const handleFinish = async () => {
    try {
      const minutes = Math.max(1, Math.round(workoutSeconds / 60));
      const res = await api.plans.completeWorkout({
        dayNumber,
        durationMinutes: minutes,
        exercisesCompleted: exercises.length,
        notes: `Finished in ${minutes} minutes with ${totalSetsDone} sets completed!`
      });

      if (res.user) {
        updateUserState(res.user);
      }

      showToast({
        type: 'points',
        title: 'Workout Crushed!',
        message: `Awarded +${res.addedPoints} Points. Great discipline!`,
        points: res.addedPoints
      });

      if (res.newlyUnlockedBadges?.length > 0) {
        res.newlyUnlockedBadges.forEach((b) => {
          showToast({
            type: 'badge',
            title: `Badge Unlocked: ${b.name}!`,
            message: b.description
          });
        });
      }

      if (onWorkoutCompleted) onWorkoutCompleted();
      onClose();
    } catch (err) {
      showToast({
        type: 'error',
        title: 'Failed to record workout',
        message: err.message
      });
    }
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-card" style={{ maxWidth: '920px' }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-glass)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          background: 'rgba(15, 23, 42, 0.6)'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span className="badge-pill badge-emerald">Live Workout Session</span>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Day {dayNumber}: {dayData?.title}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', marginTop: '4px', color: '#f8fafc' }}>
              {plan?.title}
            </h2>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* Workout Stopwatch */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              background: 'rgba(255, 255, 255, 0.05)',
              padding: '6px 12px',
              borderRadius: '999px',
              border: '1px solid var(--border-glass)'
            }}>
              <Timer size={16} color="var(--emerald-primary)" />
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '0.95rem' }}>
                {formatTime(workoutSeconds)}
              </span>
            </div>

            <button
              onClick={onClose}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-secondary)',
                cursor: 'pointer',
                padding: '6px'
              }}
            >
              <X size={22} />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div style={{ height: '4px', background: 'rgba(255, 255, 255, 0.05)', width: '100%' }}>
          <div style={{
            height: '100%',
            width: `${progressPercent}%`,
            background: 'linear-gradient(to right, #10b981, #06b6d4)',
            transition: 'width 0.3s ease'
          }} />
        </div>

        {/* Modal Body */}
        <div className="workout-runner-body">
          {/* Left: Exercises List Navigation */}
          <div className="workout-runner-sidebar" style={{
            borderRight: '1px solid var(--border-glass)',
            padding: '16px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            background: 'rgba(11, 17, 30, 0.5)'
          }}>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
              Day Routine ({exercises.length} Exercises)
            </div>

            {exercises.map((item, idx) => {
              const isSelected = activeExerciseIndex === idx;
              const setsForThisEx = Array.from({ length: item.sets || 3 }).filter((_, sIdx) => completedSets[`${idx}-${sIdx}`]).length;
              const isExDone = setsForThisEx === (item.sets || 3);

              return (
                <div
                  key={idx}
                  onClick={() => setActiveExerciseIndex(idx)}
                  style={{
                    padding: '12px',
                    borderRadius: '12px',
                    background: isSelected ? 'rgba(16, 185, 129, 0.15)' : 'rgba(255, 255, 255, 0.03)',
                    border: isSelected ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid var(--border-glass)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s ease'
                  }}
                >
                  <div>
                    <div style={{
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: isExDone ? '#34d399' : '#f8fafc',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px'
                    }}>
                      {isExDone && <CheckCircle2 size={14} color="#34d399" />}
                      <span>{item.exercise?.name || 'Exercise ' + (idx + 1)}</span>
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                      {item.sets} sets × {item.reps} reps
                    </div>
                  </div>

                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: isExDone ? '#34d399' : 'var(--text-muted)'
                  }}>
                    {setsForThisEx}/{item.sets}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right: Active Exercise Tracker & Rest Counter */}
          <div style={{
            padding: '24px',
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            gap: '20px'
          }}>
            {currentExercise && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span className="badge-pill badge-violet">{currentExercise.exercise?.muscleGroup || 'Target'}</span>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                    Rest Interval: {currentExercise.restSeconds || 60}s
                  </span>
                </div>

                <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '4px' }}>
                  {currentExercise.exercise?.name}
                </h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', marginBottom: '16px' }}>
                  Equipment: <strong style={{ color: '#cbd5e1' }}>{currentExercise.exercise?.equipment || 'Bodyweight'}</strong>
                </p>

                {/* Rest Timer Notice if active */}
                {restTimerActive && (
                  <div style={{
                    background: 'rgba(6, 182, 212, 0.12)',
                    border: '1px solid rgba(6, 182, 212, 0.3)',
                    borderRadius: '12px',
                    padding: '12px 18px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    marginBottom: '16px',
                    animation: 'fadeIn 0.2s ease'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <Timer size={18} color="#38bdf8" />
                      <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#e0f2fe' }}>
                        Rest Interval: Breathe & catch your breath
                      </span>
                    </div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'monospace' }}>
                      {restSecondsLeft}s
                    </div>
                  </div>
                )}

                {/* Interactive Sets Table */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: '60px 1fr 1fr 80px',
                    fontSize: '0.75rem',
                    textTransform: 'uppercase',
                    color: 'var(--text-muted)',
                    fontWeight: 700,
                    padding: '0 8px'
                  }}>
                    <span>Set</span>
                    <span>Target Reps</span>
                    <span>Rest</span>
                    <span style={{ textAlign: 'right' }}>Complete</span>
                  </div>

                  {Array.from({ length: currentExercise.sets || 3 }).map((_, sIdx) => {
                    const isDone = !!completedSets[`${activeExerciseIndex}-${sIdx}`];
                    return (
                      <div
                        key={sIdx}
                        style={{
                          display: 'grid',
                          gridTemplateColumns: '60px 1fr 1fr 80px',
                          alignItems: 'center',
                          padding: '10px 12px',
                          background: isDone ? 'rgba(16, 185, 129, 0.1)' : 'rgba(255, 255, 255, 0.03)',
                          border: isDone ? '1px solid rgba(16, 185, 129, 0.3)' : '1px solid var(--border-glass)',
                          borderRadius: '10px'
                        }}
                      >
                        <span style={{ fontWeight: 700, color: '#f8fafc' }}>#{sIdx + 1}</span>
                        <span style={{ color: '#cbd5e1' }}>{currentExercise.reps} reps</span>
                        <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>{currentExercise.restSeconds || 60}s</span>
                        <div style={{ textAlign: 'right' }}>
                          <button
                            onClick={() => toggleSet(activeExerciseIndex, sIdx, currentExercise.restSeconds)}
                            style={{
                              width: '32px',
                              height: '32px',
                              borderRadius: '8px',
                              border: isDone ? 'none' : '1px solid var(--border-glass-bright)',
                              background: isDone ? 'var(--emerald-primary)' : 'rgba(255, 255, 255, 0.05)',
                              color: '#ffffff',
                              cursor: 'pointer',
                              display: 'inline-flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              transition: 'all 0.2s ease'
                            }}
                          >
                            {isDone && <CheckCircle2 size={18} />}
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Form pointers */}
                {currentExercise.exercise?.instructions?.length > 0 && (
                  <div style={{
                    marginTop: '20px',
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    padding: '12px'
                  }}>
                    <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '4px' }}>
                      Key Form Cue:
                    </div>
                    <div style={{ fontSize: '0.825rem', color: '#cbd5e1' }}>
                      {currentExercise.exercise.instructions[0]}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Bottom Actions */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              borderTop: '1px solid var(--border-glass)',
              paddingTop: '16px',
              marginTop: '16px'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Progress</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#f8fafc' }}>
                  {totalSetsDone} of {totalSetsExpected} Sets Logged ({progressPercent}%)
                </div>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                {activeExerciseIndex < exercises.length - 1 ? (
                  <button
                    onClick={() => setActiveExerciseIndex((prev) => prev + 1)}
                    className="btn-secondary"
                  >
                    <span>Next Exercise</span>
                    <ChevronRight size={16} />
                  </button>
                ) : null}

                <button
                  onClick={handleFinish}
                  className="btn-primary"
                  style={{ padding: '10px 24px' }}
                >
                  <Award size={18} />
                  <span>Finish Workout (+50 XP)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
