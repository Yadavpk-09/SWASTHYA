import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Search, Sparkles, Wind, Brain, ChevronRight, Heart, Timer, Headphones } from 'lucide-react';
import { AsanaDetailModal } from '../components/yoga/AsanaDetailModal.jsx';
import { MeditationSection } from '../components/yoga/MeditationSection.jsx';

export const YogaLibraryPage = ({ setActiveTab }) => {
  const [activeSubTab, setActiveSubTab] = useState('asanas'); // 'asanas' | 'meditation'
  const [asanas, setAsanas] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeModalAsana, setActiveModalAsana] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchAsanas = async () => {
    try {
      const data = await api.asanas.getAll({
        category: selectedCategory,
        search
      });
      setAsanas(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAsanas();
  }, [selectedCategory, search]);

  const categories = ['All', 'Standing', 'Inversion', 'Restorative', 'Backbend', 'Balance'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-primary)', marginBottom: '8px' }}>
          <Sparkles size={20} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Hatha & Vinyasa Alignment
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Yoga & Asana Sanctuary</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Traditional Yogic asanas with Sanskrit etymology, breath synchronization, anatomical benefits, and contraindications.
        </p>
      </div>

      {/* Triad Quick Action Cards: Breathing, Meditation & Stress Roadmap */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
        <div
          onClick={() => setActiveTab('breathing')}
          className="glass-panel"
          style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(6, 182, 212, 0.12) 100%)',
            border: '1px solid rgba(16, 185, 129, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--emerald-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Wind size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#f8fafc' }}>Breathing Techniques</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Box Breathing, 4-7-8 & Pranayama</p>
            </div>
          </div>
          <ChevronRight size={20} color="var(--emerald-primary)" />
        </div>

        <div
          onClick={() => setActiveSubTab('meditation')}
          className="glass-panel"
          style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(6, 182, 212, 0.12) 0%, rgba(59, 130, 246, 0.12) 100%)',
            border: '1px solid rgba(6, 182, 212, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: '#06b6d4',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Headphones size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#f8fafc' }}>Curated Meditation</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Sound Baths & Nidra (FR5.3)</p>
            </div>
          </div>
          <ChevronRight size={20} color="#38bdf8" />
        </div>

        <div
          onClick={() => setActiveTab('stress')}
          className="glass-panel"
          style={{
            padding: '20px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            cursor: 'pointer',
            background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.12) 0%, rgba(99, 102, 241, 0.12) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: 'var(--violet-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff'
            }}>
              <Brain size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.05rem', color: '#f8fafc' }}>Stress Roadmap</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Somatic Calming Sequences</p>
            </div>
          </div>
          <ChevronRight size={20} color="#a78bfa" />
        </div>
      </div>

      {/* Subtabs Toggle */}
      <div style={{ display: 'flex', gap: '8px', borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        <button
          onClick={() => setActiveSubTab('asanas')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeSubTab === 'asanas' ? 'var(--emerald-primary)' : 'rgba(255, 255, 255, 0.04)',
            color: activeSubTab === 'asanas' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer'
          }}
        >
          Traditional Yoga & Asanas ({asanas.length} Poses)
        </button>
        <button
          onClick={() => setActiveSubTab('meditation')}
          style={{
            padding: '8px 18px',
            borderRadius: '10px',
            border: 'none',
            background: activeSubTab === 'meditation' ? 'var(--cyan-accent)' : 'rgba(255, 255, 255, 0.04)',
            color: activeSubTab === 'meditation' ? '#ffffff' : 'var(--text-secondary)',
            fontWeight: 700,
            fontSize: '0.85rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px'
          }}
        >
          <Headphones size={15} />
          <span>Curated Meditation Sanctuary (FR5.3)</span>
        </button>
      </div>

      {activeSubTab === 'meditation' ? (
        <MeditationSection />
      ) : (
        <>
          {/* Filter and Search Bar */}
          <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ position: 'relative' }}>
              <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
              <input
                type="text"
                className="input-field"
                placeholder="Search asanas by English or Sanskrit name (e.g. Tadasana, Downward Dog, Cobra)..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                style={{ paddingLeft: '42px' }}
              />
            </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Category:</span>
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
                cursor: 'pointer'
              }}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Asanas Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {asanas.map((asana) => (
          <div
            key={asana.id}
            onClick={() => setActiveModalAsana(asana)}
            className="glass-panel"
            style={{
              overflow: 'hidden',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              transition: 'transform 0.2s ease, border-color 0.2s ease'
            }}
          >
            {/* Image Preview */}
            <div style={{ height: '180px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={asana.imageUrl}
                alt={asana.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                display: 'flex',
                gap: '6px'
              }}>
                <span className="badge-pill badge-emerald">{asana.category}</span>
                <span className="badge-pill badge-violet">{asana.difficulty}</span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-primary)', textTransform: 'uppercase' }}>
                  {asana.sanskritName}
                </div>
                <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginTop: '2px', marginBottom: '8px' }}>
                  {asana.name}
                </h3>

                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '12px' }}>
                  {asana.instructions?.[0] || 'Hold with steady nasal breath and relaxed jaw.'}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  <Timer size={14} color="#34d399" />
                  <span>Recommended hold: {asana.holdDurationSeconds || 45} seconds</span>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '12px', marginTop: '14px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--emerald-primary)', fontWeight: 600 }}>
                  Practice & Alignment
                </span>
                <ChevronRight size={16} color="var(--emerald-primary)" />
              </div>
            </div>
          </div>
        ))}
      </div>
        </>
      )}

      {/* Modal */}
      {activeModalAsana && (
        <AsanaDetailModal
          asana={activeModalAsana}
          onClose={() => setActiveModalAsana(null)}
        />
      )}
    </div>
  );
};
