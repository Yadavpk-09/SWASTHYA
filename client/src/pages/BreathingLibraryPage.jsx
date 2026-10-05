// client/src/pages/BreathingLibraryPage.jsx
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Wind,
  Play,
  Pause,
  RotateCcw,
  Volume2,
  VolumeX,
  Search,
  CheckCircle2,
  Sparkles,
  Info,
  Clock,
  ShieldAlert,
  ArrowRight,
  Filter
} from 'lucide-react';

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
    // Autoplay policy fallback
  }
}

export const BreathingLibraryPage = () => {
  const [techniques, setTechniques] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('All');

  // Active Timer Modal / View
  const [activeTechnique, setActiveTechnique] = useState(null);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [timeLeftInPhase, setTimeLeftInPhase] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [targetCycles, setTargetCycles] = useState(4);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [sessionCompleted, setSessionCompleted] = useState(false);

  const { showToast } = useToast();
  const { updateUserState } = useAuth();
  const timerRef = useRef(null);

  const tagsList = ['All', 'quick calm', 'better sleep', 'focus', 'energizing'];

  useEffect(() => {
    fetchTechniques();
  }, [selectedTag]);

  const fetchTechniques = async () => {
    setLoading(true);
    try {
      const data = await api.breathing.getAll({
        tag: selectedTag === 'All' ? '' : selectedTag
      });
      setTechniques(data);
      if (!activeTechnique && data.length > 0) {
        // default preview first
        setActiveTechnique(data[0]);
      }
    } catch (err) {
      console.error('Error fetching breathing techniques:', err);
    } finally {
      setLoading(false);
    }
  };

  // Convert technique pattern object to phases array
  const getPhases = (tech) => {
    if (!tech) return [{ name: 'Inhale', duration: 4, action: 'Inhale deeply' }];
    const pat = tech.pattern || { inhale: 4, hold1: 4, exhale: 4, hold2: 4 };
    const list = [];
    if (pat.inhale > 0) list.push({ name: 'Inhale', duration: pat.inhale, action: 'Slow, steady inhalation through nostrils' });
    if (pat.hold1 > 0) list.push({ name: 'Hold', duration: pat.hold1, action: 'Retain breath with relaxed chest' });
    if (pat.exhale > 0) list.push({ name: 'Exhale', duration: pat.exhale, action: 'Smooth, continuous exhalation' });
    if (pat.hold2 > 0) list.push({ name: 'Hold Empty', duration: pat.hold2, action: 'Rest lungs empty before next cycle' });
    return list;
  };

  const currentPhases = getPhases(activeTechnique);
  const currentPhase = currentPhases[currentPhaseIndex] || currentPhases[0];

  const handleSelectTechnique = (tech) => {
    setActiveTechnique(tech);
    setIsTimerActive(false);
    setCurrentPhaseIndex(0);
    const phases = getPhases(tech);
    setTimeLeftInPhase(phases[0].duration);
    setCompletedCycles(0);
    setSessionCompleted(false);

    // Scroll to timer
    const el = document.getElementById('breathing-timer-anchor');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const handleReset = () => {
    setIsTimerActive(false);
    setCurrentPhaseIndex(0);
    setTimeLeftInPhase(currentPhases[0].duration);
    setCompletedCycles(0);
    setSessionCompleted(false);
  };

  // Timer Tick
  useEffect(() => {
    if (!isTimerActive) {
      clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setTimeLeftInPhase((prev) => {
        if (prev > 1) return prev - 1;

        const nextIndex = (currentPhaseIndex + 1) % currentPhases.length;
        setCurrentPhaseIndex(nextIndex);

        if (soundEnabled) {
          playChime(nextIndex === 0 ? 528 : 432);
        }

        if (nextIndex === 0) {
          const newCycles = completedCycles + 1;
          setCompletedCycles(newCycles);
          if (newCycles >= targetCycles) {
            setIsTimerActive(false);
            setSessionCompleted(true);
            onFinishSession();
          }
        }

        return currentPhases[nextIndex].duration;
      });
    }, 1000);

    return () => clearInterval(timerRef.current);
  }, [isTimerActive, currentPhaseIndex, currentPhases, completedCycles, targetCycles, soundEnabled]);

  const onFinishSession = async () => {
    try {
      const res = await api.breathing.complete({
        techniqueId: activeTechnique?.id,
        techniqueName: activeTechnique?.name,
        durationMinutes: activeTechnique?.durationMinutes || 4
      });

      if (res.user) updateUserState(res.user);

      showToast({
        type: 'points',
        title: 'Pranayama Practice Complete!',
        message: `${res.message} (+${res.addedPoints} Points)`,
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

  const filteredTechniques = techniques.filter((t) => {
    const q = searchQuery.toLowerCase();
    return (
      t.name.toLowerCase().includes(q) ||
      (t.sanskritName && t.sanskritName.toLowerCase().includes(q)) ||
      (t.tags || []).some((tag) => tag.toLowerCase().includes(q))
    );
  });

  const isInhale = currentPhase?.name.toLowerCase().includes('inhale');
  const isExhale = currentPhase?.name.toLowerCase().includes('exhale');

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '30px' }}>
      {/* Top Banner */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: 'var(--emerald-primary)',
          background: 'rgba(16, 185, 129, 0.1)',
          padding: '6px 14px',
          borderRadius: '20px',
          marginBottom: '10px'
        }}>
          <Wind size={18} />
          <span style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Pranayama & Neuro-Somatic Regulation (Module 6)
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: '#f8fafc' }}>
          Breathing Techniques
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Master authentic yogic and clinical breathwork patterns to modulate heart rate variability,
          suppress sympathetic cortisol, and enter peak mental states.
        </p>
      </div>

      {/* Guided Visual Timer Experience */}
      <div id="breathing-timer-anchor" className="glass-panel" style={{
        padding: '36px 24px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        minHeight: '420px',
        overflow: 'hidden',
        background: 'linear-gradient(180deg, rgba(16, 185, 129, 0.08) 0%, rgba(15, 23, 42, 0.6) 100%)'
      }}>
        {/* Active Technique Banner */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          marginBottom: '20px',
          zIndex: 10
        }}>
          <span className="badge-pill badge-emerald">{activeTechnique?.name || 'Box Breathing'}</span>
          {activeTechnique?.sanskritName && (
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
              ({activeTechnique.sanskritName})
            </span>
          )}
          <span className="badge-pill badge-violet">{activeTechnique?.difficulty || 'Beginner'}</span>
        </div>

        {/* Animated Orb */}
        <div
          className="breathing-orb"
          style={{
            background: isInhale
              ? 'radial-gradient(circle, #34d399 0%, #059669 65%, #064e3b 100%)'
              : isExhale
              ? 'radial-gradient(circle, #38bdf8 0%, #0284c7 65%, #0c4a6e 100%)'
              : 'radial-gradient(circle, #a78bfa 0%, #7c3aed 65%, #3b0764 100%)',
            boxShadow: isTimerActive
              ? isInhale
                ? '0 0 60px rgba(16, 185, 129, 0.65), inset 0 0 20px rgba(255, 255, 255, 0.4)'
                : '0 0 50px rgba(6, 182, 212, 0.55), inset 0 0 20px rgba(255, 255, 255, 0.3)'
              : '0 0 30px rgba(255, 255, 255, 0.1)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            transform: isTimerActive
              ? isInhale
                ? 'scale(1.28)'
                : isExhale
                ? 'scale(0.85)'
                : 'scale(1.15)'
              : 'scale(1)',
            transition: `transform ${currentPhase?.duration || 4}s ease-in-out, background 0.8s ease, box-shadow 0.8s ease`,
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
            {isTimerActive ? currentPhase?.name : 'Ready'}
          </div>

          <div style={{
            fontSize: '2.6rem',
            fontWeight: 800,
            fontFamily: 'var(--font-heading)',
            color: '#ffffff',
            textShadow: '0 2px 10px rgba(0, 0, 0, 0.5)'
          }}>
            {isTimerActive ? timeLeftInPhase : currentPhase?.duration || 4}s
          </div>
        </div>

        {/* Phase Action */}
        <div style={{ marginTop: '26px', textAlign: 'center', zIndex: 10 }}>
          <div style={{ fontSize: '1.05rem', fontWeight: 600, color: '#f8fafc', marginBottom: '4px' }}>
            {isTimerActive ? currentPhase?.action : 'Click Start to begin guided breathing session'}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Cycle {completedCycles + 1} of {targetCycles} • Cadence: {currentPhases.map(p => `${p.name} ${p.duration}s`).join(' - ')}
          </div>
        </div>

        {sessionCompleted && (
          <div style={{
            marginTop: '16px',
            background: 'rgba(16, 185, 129, 0.15)',
            border: '1px solid rgba(16, 185, 129, 0.4)',
            padding: '8px 18px',
            borderRadius: '10px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#34d399',
            fontSize: '0.85rem',
            fontWeight: 600,
            zIndex: 10
          }}>
            <CheckCircle2 size={16} />
            <span>Practice complete! Parasympathetic vagal tone elevated.</span>
          </div>
        )}

        {/* Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '22px', zIndex: 10 }}>
          <button
            onClick={() => setIsTimerActive(!isTimerActive)}
            className="btn-primary"
            style={{ padding: '12px 30px', fontSize: '0.95rem' }}
          >
            {isTimerActive ? <Pause size={18} /> : <Play size={18} />}
            <span>{isTimerActive ? 'Pause Session' : 'Start Session'}</span>
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
            title={soundEnabled ? 'Mute tone' : 'Unmute tone'}
          >
            {soundEnabled ? <Volume2 size={18} color="#34d399" /> : <VolumeX size={18} color="#64748b" />}
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Situation Tag Filter (FR6.4) */}
          <div className="scroll-x-touch" style={{ flex: 1, minWidth: '220px' }}>
            {tagsList.map((tag) => (
              <button
                key={tag}
                onClick={() => setSelectedTag(tag)}
                style={{
                  padding: '7px 16px',
                  borderRadius: '20px',
                  border: selectedTag === tag ? '1px solid var(--emerald-primary)' : '1px solid var(--border-glass)',
                  background: selectedTag === tag ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                  color: selectedTag === tag ? '#34d399' : 'var(--text-secondary)',
                  fontWeight: 600,
                  fontSize: '0.825rem',
                  textTransform: 'capitalize',
                  cursor: 'pointer',
                  whiteSpace: 'nowrap',
                  flexShrink: 0
                }}
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Search box */}
          <div style={{ position: 'relative', minWidth: '240px' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              placeholder="Search techniques or benefits..."
              className="input-field"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '36px', paddingRight: '12px', fontSize: '0.85rem' }}
            />
          </div>
        </div>

        {/* Techniques Grid (FR6.1, FR6.2) */}
        <div className="grid-cards-responsive">
          {filteredTechniques.map((tech) => {
            const isSelected = activeTechnique?.id === tech.id;
            return (
              <div
                key={tech.id}
                className="glass-panel"
                style={{
                  padding: '22px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                  borderColor: isSelected ? 'rgba(16, 185, 129, 0.4)' : 'var(--border-glass)',
                  background: isSelected ? 'rgba(16, 185, 129, 0.05)' : 'var(--bg-glass)',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '2px' }}>
                      {tech.name}
                    </h3>
                    {tech.sanskritName && (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                        {tech.sanskritName}
                      </span>
                    )}
                  </div>
                  <span className="badge-pill badge-emerald">{tech.difficulty}</span>
                </div>

                {/* Tags */}
                <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                  {(tech.tags || []).map((t, idx) => (
                    <span key={idx} className="badge-pill badge-violet" style={{ fontSize: '0.7rem' }}>
                      {t}
                    </span>
                  ))}
                  <span className="badge-pill badge-amber" style={{ fontSize: '0.7rem' }}>
                    <Clock size={12} style={{ display: 'inline', marginRight: '3px' }} />
                    {tech.durationMinutes || 5} mins
                  </span>
                </div>

                {/* Benefits */}
                <div style={{ fontSize: '0.825rem', color: '#cbd5e1', lineHeight: 1.5 }}>
                  <div style={{ fontWeight: 700, color: 'var(--emerald-primary)', marginBottom: '3px', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                    Key Physiological Benefits:
                  </div>
                  <ul style={{ paddingLeft: '16px', margin: 0 }}>
                    {(tech.benefits || []).slice(0, 2).map((b, i) => (
                      <li key={i}>{b}</li>
                    ))}
                  </ul>
                </div>

                {/* Step-by-Step process preview */}
                <div style={{
                  fontSize: '0.8rem',
                  color: 'var(--text-secondary)',
                  background: 'rgba(255, 255, 255, 0.02)',
                  padding: '10px 12px',
                  borderRadius: '8px',
                  border: '1px solid var(--border-glass)',
                  flex: 1
                }}>
                  <div style={{ fontWeight: 700, color: '#f8fafc', marginBottom: '4px', fontSize: '0.75rem' }}>
                    Process:
                  </div>
                  {tech.fullProcess}
                </div>

                {/* Caution note */}
                {tech.precautions && (
                  <div style={{ fontSize: '0.75rem', color: '#fbbf24', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <ShieldAlert size={14} />
                    <span>{tech.precautions}</span>
                  </div>
                )}

                {/* Action button */}
                <button
                  onClick={() => handleSelectTechnique(tech)}
                  className={isSelected ? 'btn-primary' : 'btn-secondary'}
                  style={{
                    width: '100%',
                    padding: '10px',
                    fontSize: '0.85rem',
                    marginTop: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '6px'
                  }}
                >
                  <Play size={14} />
                  <span>{isSelected ? 'Ready on Guided Timer' : 'Select Technique'}</span>
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
