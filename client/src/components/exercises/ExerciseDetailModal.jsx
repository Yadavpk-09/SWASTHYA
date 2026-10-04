// client/src/components/exercises/ExerciseDetailModal.jsx
import React from 'react';
import { X, AlertTriangle, CheckCircle, Flame, Dumbbell } from 'lucide-react';

export const ExerciseDetailModal = ({ exercise, onClose }) => {
  if (!exercise) return null;

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      background: 'rgba(5, 8, 16, 0.85)',
      backdropFilter: 'blur(12px)',
      zIndex: 100,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '16px'
    }}>
      <div style={{
        background: '#0e1628',
        border: '1px solid var(--border-glass-bright)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '680px',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
        padding: '28px',
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        position: 'relative'
      }}>
        {/* Close Button */}
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 255, 255, 0.05)',
            border: 'none',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
        >
          <X size={18} />
        </button>

        {/* Media / Visual Preview */}
        {exercise.demoUrl && (
          <div style={{
            width: '100%',
            height: '240px',
            borderRadius: '14px',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid var(--border-glass)'
          }}>
            <img
              src={exercise.demoUrl}
              alt={exercise.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              background: 'linear-gradient(to top, rgba(14, 22, 40, 0.95), transparent)'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge-pill badge-emerald">{exercise.muscleGroup}</span>
                <span className="badge-pill badge-violet">{exercise.difficulty}</span>
                <span className="badge-pill badge-amber">{exercise.equipment}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <h2 style={{ fontSize: '1.6rem', color: '#f8fafc', marginBottom: '6px' }}>
            {exercise.name}
          </h2>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', alignSelf: 'center' }}>Targeted:</span>
            {(exercise.targetMuscles || []).map((m, idx) => (
              <span
                key={idx}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid var(--border-glass)',
                  padding: '2px 8px',
                  borderRadius: '6px',
                  fontSize: '0.75rem',
                  color: '#cbd5e1'
                }}
              >
                {m}
              </span>
            ))}
          </div>
        </div>

        {/* Step-by-step instructions */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: 'var(--emerald-primary)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>
            Step-by-Step Form Instructions
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(exercise.instructions || []).map((step, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                <span style={{
                  width: '22px',
                  height: '22px',
                  borderRadius: '50%',
                  background: 'rgba(16, 185, 129, 0.15)',
                  color: 'var(--emerald-primary)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  marginTop: '1px'
                }}>
                  {idx + 1}
                </span>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  {step}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Common Mistakes & Form Warnings */}
        {(exercise.commonMistakes || []).length > 0 && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.08)',
            border: '1px solid rgba(239, 68, 68, 0.25)',
            borderRadius: '12px',
            padding: '14px 16px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#f87171', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
              <AlertTriangle size={16} />
              <span>Common Mistakes to Avoid (Injury Prevention)</span>
            </div>
            <ul style={{ paddingLeft: '20px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {exercise.commonMistakes.map((mistake, idx) => (
                <li key={idx} style={{ fontSize: '0.825rem', color: '#fca5a5' }}>
                  {mistake}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
