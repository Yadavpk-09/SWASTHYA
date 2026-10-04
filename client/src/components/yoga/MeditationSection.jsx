// client/src/components/yoga/MeditationSection.jsx
import React, { useState, useEffect, useRef } from 'react';
import { api } from '../../services/api.js';
import {
  Sparkles,
  Play,
  CheckCircle2,
  Clock,
  User,
  Volume2,
  VolumeX,
  X,
  ExternalLink,
  Heart,
  Headphones,
  Flame
} from 'lucide-react';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const MeditationSection = () => {
  const [meditations, setMeditations] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeSession, setActiveSession] = useState(null);
  const [ambientSound, setAmbientSound] = useState(false);
  const [loading, setLoading] = useState(true);

  const { showToast } = useToast();
  const { updateUserState } = useAuth();
  const audioCtxRef = useRef(null);
  const noiseNodeRef = useRef(null);

  useEffect(() => {
    const fetchMeditations = async () => {
      try {
        const data = await api.asanas.getMeditations();
        setMeditations(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMeditations();
  }, []);

  // Ambient sound generator via Web Audio API (Pink / Soothing Ocean Wave emulation)
  const toggleAmbientSound = () => {
    if (ambientSound) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
        audioCtxRef.current = null;
      }
      setAmbientSound(false);
    } else {
      try {
        const AudioCtx = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioCtx();
        const bufferSize = ctx.sampleRate * 2;
        const noiseBuffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const output = noiseBuffer.getChannelData(0);
        let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;

        for (let i = 0; i < bufferSize; i++) {
          const white = Math.random() * 2 - 1;
          b0 = 0.99886 * b0 + white * 0.0555179;
          b1 = 0.99332 * b1 + white * 0.0750759;
          b2 = 0.96900 * b2 + white * 0.1538520;
          b3 = 0.86650 * b3 + white * 0.3104856;
          b4 = 0.55000 * b4 + white * 0.5329522;
          b5 = -0.7616 * b5 - white * 0.0168980;
          output[i] = (b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362) * 0.04;
          b6 = white * 0.115926;
        }

        const whiteNoise = ctx.createBufferSource();
        whiteNoise.buffer = noiseBuffer;
        whiteNoise.loop = true;

        const gainNode = ctx.createGain();
        gainNode.gain.setValueAtTime(0.08, ctx.currentTime);

        whiteNoise.connect(gainNode);
        gainNode.connect(ctx.destination);
        whiteNoise.start(0);

        audioCtxRef.current = ctx;
        noiseNodeRef.current = whiteNoise;
        setAmbientSound(true);
      } catch (e) {
        console.error('Ambient audio error:', e);
      }
    }
  };

  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close();
      }
    };
  }, []);

  const handleComplete = async (meditation) => {
    try {
      const res = await api.asanas.completeMeditation({
        title: meditation.title,
        durationMinutes: meditation.durationMinutes
      });

      if (res.user) updateUserState(res.user);

      showToast({
        type: 'points',
        title: 'Meditation Completed! 🧘',
        message: `Finished ${meditation.title}. +${res.addedPoints} Points!`,
        points: res.addedPoints
      });

      setActiveSession(null);
    } catch (err) {
      showToast({ type: 'error', title: 'Error logging session', message: err.message });
    }
  };

  const categories = ['All', 'Mindfulness', 'Stress Relief', 'Sleep & Rest', 'Sound Healing', 'Anxiety', 'Morning Energy'];

  const filteredMeditations = meditations.filter((m) => {
    if (selectedCategory === 'All') return true;
    return m.category.toLowerCase().includes(selectedCategory.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Top Banner with Ambient Sound Pill */}
      <div className="glass-panel" style={{
        padding: '24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px',
        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
        border: '1px solid rgba(139, 92, 246, 0.3)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 8px 20px rgba(139, 92, 246, 0.3)'
          }}>
            <Headphones size={24} color="#ffffff" />
          </div>
          <div>
            <h2 style={{ fontSize: '1.35rem', color: '#f8fafc', marginBottom: '4px' }}>
              Curated Meditation Sanctuary
            </h2>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Somatic body scans, delta-wave sleep journeys, and vagus nerve tranquilizers led by world-class mindfulness masters.
            </p>
          </div>
        </div>

        {/* Ambient Wave Sound Button */}
        <button
          onClick={toggleAmbientSound}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '9px 18px',
            borderRadius: '999px',
            border: ambientSound ? '1px solid #10b981' : '1px solid var(--border-glass)',
            background: ambientSound ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.05)',
            color: ambientSound ? '#34d399' : 'var(--text-secondary)',
            fontWeight: 600,
            fontSize: '0.85rem',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
        >
          {ambientSound ? <Volume2 size={16} color="#34d399" /> : <VolumeX size={16} />}
          <span>{ambientSound ? 'Ambient Pink Wave (Playing)' : 'Play Ambient Waves'}</span>
        </button>
      </div>

      {/* Filter Category Pills */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
        <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Focus:</span>
        {categories.map((c) => (
          <button
            key={c}
            onClick={() => setSelectedCategory(c)}
            style={{
              padding: '6px 14px',
              borderRadius: '999px',
              border: selectedCategory === c ? '1px solid var(--emerald-primary)' : '1px solid var(--border-glass)',
              background: selectedCategory === c ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.03)',
              color: selectedCategory === c ? '#34d399' : 'var(--text-secondary)',
              fontSize: '0.8rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {c}
          </button>
        ))}
      </div>

      {/* Meditations Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {filteredMeditations.map((m) => (
          <div
            key={m.id}
            className="glass-panel"
            style={{
              overflow: 'hidden',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
          >
            <div>
              {/* Thumbnail & Quick Play Overlay */}
              <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
                <img
                  src={m.thumbnailUrl}
                  alt={m.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
                <div style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(9, 13, 22, 0.85) 0%, transparent 70%)',
                  display: 'flex',
                  alignItems: 'flex-end',
                  padding: '14px'
                }}>
                  <span className="badge-pill badge-violet">{m.category}</span>
                </div>

                <button
                  onClick={() => setActiveSession(m)}
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '50px',
                    height: '50px',
                    borderRadius: '50%',
                    background: 'rgba(16, 185, 129, 0.9)',
                    border: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    cursor: 'pointer',
                    boxShadow: '0 8px 24px rgba(16, 185, 129, 0.5)',
                    transition: 'all 0.2s ease'
                  }}
                  title="Play Meditation"
                >
                  <Play size={20} fill="#ffffff" color="#ffffff" style={{ marginLeft: '3px' }} />
                </button>
              </div>

              {/* Details */}
              <div style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: '#cbd5e1' }}>
                    <User size={13} color="var(--emerald-primary)" />
                    <span>{m.instructor}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.78rem', color: '#38bdf8' }}>
                    <Clock size={13} />
                    <span>{m.durationMinutes} mins</span>
                  </div>
                </div>

                <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '8px', lineHeight: 1.4 }}>
                  {m.title}
                </h3>

                <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '14px' }}>
                  {m.description}
                </p>
              </div>
            </div>

            <div style={{ padding: '0 18px 18px 18px', display: 'flex', gap: '10px' }}>
              <button
                onClick={() => setActiveSession(m)}
                className="btn-primary"
                style={{ flex: 1, padding: '10px', fontSize: '0.85rem' }}
              >
                <Play size={16} fill="#ffffff" />
                <span>Begin Session</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Active Meditation Media Modal */}
      {activeSession && (
        <div style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(5, 8, 15, 0.85)',
          backdropFilter: 'blur(10px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          padding: '20px'
        }}>
          <div className="glass-panel" style={{
            width: '100%',
            maxWidth: '750px',
            background: 'var(--bg-main)',
            border: '1px solid var(--border-glass-bright)',
            borderRadius: '24px',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}>
            {/* Modal Header */}
            <div style={{
              padding: '16px 24px',
              borderBottom: '1px solid var(--border-glass)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <span className="badge-pill badge-violet" style={{ marginBottom: '4px' }}>
                  {activeSession.category} • {activeSession.durationMinutes} Minutes
                </span>
                <h3 style={{ fontSize: '1.25rem', color: '#f8fafc' }}>
                  {activeSession.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveSession(null)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '36px',
                  height: '36px',
                  color: 'var(--text-secondary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={20} />
              </button>
            </div>

            {/* Embedded Video/Audio Player */}
            <div style={{ width: '100%', height: '380px', background: '#000000', position: 'relative' }}>
              <iframe
                src={`${activeSession.videoUrl}?autoplay=1&rel=0`}
                title={activeSession.title}
                style={{ width: '100%', height: '100%', border: 'none' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>

            {/* Modal Footer with Complete Action */}
            <div style={{
              padding: '20px 24px',
              borderTop: '1px solid var(--border-glass)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px'
            }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Led by <strong style={{ color: '#cbd5e1' }}>{activeSession.instructor}</strong>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button
                  onClick={() => setActiveSession(null)}
                  className="btn-secondary"
                  style={{ padding: '10px 18px', fontSize: '0.85rem' }}
                >
                  Close
                </button>
                <button
                  onClick={() => handleComplete(activeSession)}
                  className="btn-primary"
                  style={{ padding: '10px 22px', fontSize: '0.85rem' }}
                >
                  <CheckCircle2 size={16} />
                  <span>Mark Session as Complete (+30 XP)</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
