// client/src/components/yoga/BreathingTimer.jsx
import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Sparkles, CheckCircle2, Wind } from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

const TECHNIQUES = {
  box: {
    id: 'box',
    name: 'Box Breathing',
    description: 'Equal 4-phase cadence to calm nervous system and sharpen focus.',
    phases: [
      { name: 'Inhale', duration: 4, action: 'Breathe in through nose deeply' },
      { name: 'Hold', duration: 4, action: 'Hold full breath calmly' },
      { name: 'Exhale', duration: 4, action: 'Release breath smoothly through mouth' },
      { name: 'Hold', duration: 4, action: 'Rest lungs empty before next cycle' }
    ]
  },
  relax478: {
    id: 'relax478',
    name: '4-7-8 Relaxing Breath',
    description: 'Dr. Andrew Weil technique to lower blood pressure and prepare for deep sleep.',
    phases: [
      { name: 'Inhale', duration: 4, action: 'Inhale quietly through nose' },
      { name: 'Hold', duration: 7, action: 'Retain oxygen in lungs' },
      { name: 'Exhale', duration: 8, action: 'Make whooshing sound through mouth' }
    ]
  },
  calm: {
    id: 'calm',
    name: 'Coherent Resonance (5-5)',
    description: 'Balances autonomic nervous system with 6 breaths per minute.',
    phases: [
      { name: 'Inhale', duration: 5, action: 'Smooth deep belly expansion' },
      { name: 'Exhale', duration: 5, action: 'Gentle release down through body' }
    ]
  }
};

// Web Audio API chime generator for zero-dependency sound
function playChime(freq = 440) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 1.2);

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 1.2);
  } catch (e) {
    // Ignore audio autoplay restrictions
  }
}

export const BreathingTimer = () => {
  const [selectedTech, setSelectedTech] = useState('box');
  const [isActive, setIsActive] = useState(false);
  const [phaseIndex, setPhaseIndex] = useState(0);
  const [timeLeftInPhase, setTimeLeftInPhase] = useState(TECHNIQUES.box.phases[0].duration);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [targetCycles, setTargetCycles] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const { showToast } = useToast();
  const { updateUserState } = useAuth();
  const timerRef = useRef(null);

  const currentTechnique = TECHNIQUES[selectedTech];
  const currentPhase = currentTechnique.phases[phaseIndex];

  // Reset when technique changes
  const switchTechnique = (techKey) => {
    setSelectedTech(techKey);
    setIsActive(false);
    setPhaseIndex(0);
    setTimeLeftInPhase(TECHNIQUES[techKey].phases[0].duration);
    setCompletedCycles(0);
    setSessionCompleted(false);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhaseIndex(0);
    setTimeLeftInPhase(currentTechnique.phases[0].duration);
    setCompletedCycles(0);
    setSessionCompleted(false);
  };

  // Main countdown timer
  useEffect(() => {
    if (!isActive) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeftInPhase((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition to next phase
        const nextIndex = (phaseIndex + 1) % currentTechnique.phases.length;
        setPhaseIndex(nextIndex);

        if (soundEnabled) {
          playChime(nextIndex === 0 ? 528 : 432); // Soothing solfeggio frequency
        }

        // If looped back to 0, completed 1 cycle
        if (nextIndex === 0) {
          const newCycles = completedCycles + 1;
          setCompletedCycles(newCycles);

          if (newCycles >= targetCycles) {
            setIsActive(false);
            setSessionCompleted(true);
            completeSession();
          }
        }

        return currentTechnique.phases[nextIndex].duration;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isActive, phaseIndex, currentTechnique, completedCycles, targetCycles, soundEnabled]);

  const completeSession = async () => {
    try {
      const res = await api.asanas.completeBreathing({
        technique: currentTechnique.name,
        durationSeconds: completedCycles * currentTechnique.phases.reduce((acc, p) => acc + p.duration, 0)
      });

      if (res.user) {
        updateUserState(res.user);
      }

      showToast({
        type: 'points',
        title: 'Zen Session Completed!',
        message: `Great mindfulness practice! ${res.addedPoints} Points added.`,
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
    } catch (err) {
      console.error(err);
    }
  };

  // Compute visual scale for breathing orb
  const isInhale = currentPhase.name.toLowerCase().includes('inhale');
  const isExhale = currentPhase.name.toLowerCase().includes('exhale');

  return (
    <div style={{ maxWidth: '850px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-primary)', marginBottom: '8px' }}>
          <Wind size={20} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Pranayama & Neuro-Somatic Regulation
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Guided Breathing Timer</h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '580px', margin: '0 auto', fontSize: '0.95rem' }}>
          Visual rhythmic guide engineered to stimulate parasympathetic vagal recovery, regulate heart rate, and restore mental presence.
        </p>
      </div>

      {/* Technique Selector Pills */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', flexWrap: 'wrap' }}>
        {Object.values(TECHNIQUES).map((tech) => (
          <button
            key={tech.id}
            onClick={() => switchTechnique(tech.id)}
            style={{
              padding: '10px 18px',
              borderRadius: '999px',
              border: selectedTech === tech.id ? '1px solid var(--emerald-primary)' : '1px solid var(--border-glass)',
              background: selectedTech === tech.id ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.04)',
              color: selectedTech === tech.id ? '#34d399' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tech.name}
          </button>
        ))}
      </div>

      {/* Main Breathing Experience Panel */}
      <div className="glass-panel" style={{
        padding: '40px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: '440px',
        overflow: 'hidden'
      }}>
        {/* Background Aura Rings */}
        <div style={{
          position: 'absolute',
          width: '320px',
          height: '320px',
          borderRadius: '50%',
          border: '1px dashed rgba(16, 185, 129, 0.2)',
          pointerEvents: 'none'
        }} className="animate-pulse-ring" />

        <div style={{
          position: 'absolute',
          width: '420px',
          height: '420px',
          borderRadius: '50%',
          border: '1px dashed rgba(6, 182, 212, 0.12)',
          pointerEvents: 'none'
        }} />

        {/* Breathing Orb */}
        <div
          style={{
            width: '210px',
            height: '210px',
            borderRadius: '50%',
            background: isInhale
              ? 'radial-gradient(circle, #34d399 0%, #059669 65%, #064e3b 100%)'
              : isExhale
              ? 'radial-gradient(circle, #38bdf8 0%, #0284c7 65%, #0c4a6e 100%)'
              : 'radial-gradient(circle, #a78bfa 0%, #7c3aed 65%, #3b0764 100%)',
            boxShadow: isActive
              ? isInhale
                ? '0 0 60px rgba(16, 185, 129, 0.6), inset 0 0 20px rgba(255, 255, 255, 0.4)'
                : '0 0 45px rgba(6, 182, 212, 0.5), inset 0 0 20px rgba(255, 255, 255, 0.3)'
              : '0 0 30px rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isActive
              ? isInhale
                ? 'scale(1.28)'
                : isExhale
                ? 'scale(0.85)'
                : 'scale(1.15)'
              : 'scale(1)',
            transition: `transform ${currentPhase.duration}s ease-in-out, background 0.8s ease, box-shadow 0.8s ease`,
            zIndex: 10
          }}
        >
          <div style={{
            fontSize: '1.25rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            color: '#ffffff',
            textShadow: '0 2px 8px rgba(0, 0, 0, 0.5)'
          }}>
            {isActive ? currentPhase.name : 'Ready'}
          </div>

          <div style={{
            fontSize: '2.5rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: '#ffffff',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }}>
            {isActive ? timeLeftInPhase : currentPhase.duration}s
          </div>
        </div>

        {/* Phase Instruction Text */}
        <div style={{ marginTop: '30px', textAlign: 'center', zIndex: 10 }}>
          <div style={{ fontSize: '1.1rem', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
            {isActive ? currentPhase.action : 'Press Start to begin guided breathwork'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Cycle {completedCycles + 1} of {targetCycles} • {currentTechnique.name}
          </div>
        </div>

        {/* Success Banner if completed */}
        {sessionCompleted && (
          <div style={{
            marginTop: '20px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '10px 18px',
            borderRadius: '12px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#34d399',
            fontSize: '0.9rem',
            fontWeight: 600
          }}>
            <CheckCircle2 size={18} />
            <span>Session complete! Relax and notice your grounded mental clarity.</span>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '28px', zIndex: 10 }}>
          <button
            onClick={() => setIsActive(!isActive)}
            className="btn-primary"
            style={{ padding: '12px 28px', fontSize: '1rem', minWidth: '130px' }}
          >
            {isActive ? <Pause size={18} /> : <Play size={18} />}
            <span>{isActive ? 'Pause' : 'Start'}</span>
          </button>

          <button
            onClick={handleReset}
            className="btn-secondary"
            style={{ padding: '12px 16px' }}
            title="Reset timer"
          >
            <RotateCcw size={18} />
          </button>

          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="btn-secondary"
            style={{ padding: '12px 16px' }}
            title={soundEnabled ? 'Mute chimes' : 'Unmute chimes'}
          >
            {soundEnabled ? <Volume2 size={18} color="#34d399" /> : <VolumeX size={18} color="#64748b" />}
          </button>
        </div>
      </div>

      {/* Technique Guide Card */}
      <div className="glass-panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '1.05rem', marginBottom: '8px', color: '#f8fafc' }}>
          Science & Technique: {currentTechnique.name}
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', lineHeight: 1.6, marginBottom: '14px' }}>
          {currentTechnique.description}
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '12px' }}>
          {currentTechnique.phases.map((p, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.03)',
              border: '1px solid var(--border-glass)',
              borderRadius: '10px',
              padding: '12px'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-primary)', textTransform: 'uppercase' }}>
                Phase {idx + 1}: {p.name} ({p.duration}s)
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
                {p.action}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
