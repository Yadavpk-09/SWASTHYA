// client/src/components/yoga/AsanaDetailModal.jsx
import React, { useState, useEffect, useRef } from 'react';
import { X, Sparkles, ShieldAlert, Heart, Timer, Play, Pause, RotateCcw } from 'lucide-react';

export const AsanaDetailModal = ({ asana, onClose }) => {
  if (!asana) return null;

  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(asana.holdDurationSeconds || 45);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setTimerActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timerActive]);

  const resetTimer = () => {
    setTimerActive(false);
    setTimeLeft(asana.holdDurationSeconds || 45);
  };

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
        background: '#0d1526',
        border: '1px solid var(--border-glass-bright)',
        borderRadius: '20px',
        width: '100%',
        maxWidth: '700px',
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

        {/* Media Preview */}
        {asana.imageUrl && (
          <div style={{
            width: '100%',
            height: '240px',
            borderRadius: '14px',
            overflow: 'hidden',
            position: 'relative',
            border: '1px solid var(--border-glass)'
          }}>
            <img
              src={asana.imageUrl}
              alt={asana.name}
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              padding: '16px',
              background: 'linear-gradient(to top, rgba(13, 21, 38, 0.95), transparent)'
            }}>
              <div style={{ display: 'flex', gap: '8px' }}>
                <span className="badge-pill badge-emerald">{asana.category}</span>
                <span className="badge-pill badge-violet">{asana.difficulty}</span>
              </div>
            </div>
          </div>
        )}

        <div>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--emerald-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {asana.sanskritName}
          </div>
          <h2 style={{ fontSize: '1.6rem', color: '#f8fafc', marginTop: '2px' }}>
            {asana.name}
          </h2>
        </div>

        {/* Interactive Hold Timer */}
        <div style={{
          background: 'rgba(16, 185, 129, 0.08)',
          border: '1px solid rgba(16, 185, 129, 0.25)',
          borderRadius: '14px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: 'wrap',
          gap: '12px'
        }}>
          <div>
            <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)' }}>
              Recommended Hold Duration
            </div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#34d399', fontFamily: 'monospace' }}>
              {timeLeft}s remaining
            </div>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            <button
              onClick={() => setTimerActive(!timerActive)}
              className="btn-primary"
              style={{ padding: '8px 16px', fontSize: '0.85rem' }}
            >
              {timerActive ? <Pause size={15} /> : <Play size={15} />}
              <span>{timerActive ? 'Pause' : 'Start Hold'}</span>
            </button>
            <button
              onClick={resetTimer}
              className="btn-secondary"
              style={{ padding: '8px 12px' }}
              title="Reset hold timer"
            >
              <RotateCcw size={15} />
            </button>
          </div>
        </div>

        {/* Instructions */}
        <div>
          <h4 style={{ fontSize: '0.95rem', color: '#f8fafc', marginBottom: '10px' }}>
            Step-by-Step Alignment & Breath Cues
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {(asana.instructions || []).map((step, idx) => (
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

        {/* Benefits & Precautions Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
          {/* Benefits */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.02)',
            border: '1px solid var(--border-glass)',
            borderRadius: '12px',
            padding: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#34d399', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
              <Heart size={16} />
              <span>Key Benefits</span>
            </div>
            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {(asana.benefits || []).map((b, idx) => (
                <li key={idx} style={{ fontSize: '0.8rem', color: '#cbd5e1' }}>
                  {b}
                </li>
              ))}
            </ul>
          </div>

          {/* Precautions */}
          <div style={{
            background: 'rgba(244, 63, 94, 0.05)',
            border: '1px solid rgba(244, 63, 94, 0.2)',
            borderRadius: '12px',
            padding: '14px'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#fb7185', fontWeight: 700, fontSize: '0.85rem', marginBottom: '8px' }}>
              <ShieldAlert size={16} />
              <span>Precautions</span>
            </div>
            <ul style={{ paddingLeft: '18px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {(asana.precautions || []).map((p, idx) => (
                <li key={idx} style={{ fontSize: '0.8rem', color: '#fca5a5' }}>
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
