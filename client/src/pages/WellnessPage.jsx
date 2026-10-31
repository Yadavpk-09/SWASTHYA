// client/src/pages/WellnessPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Droplet, Moon, Sparkles } from 'lucide-react';
import { WaterTracker } from '../components/wellness/WaterTracker.jsx';
import { SleepTracker } from '../components/wellness/SleepTracker.jsx';

export const WellnessPage = () => {
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [wellnessData, setWellnessData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchWellness = async () => {
    try {
      const data = await api.wellness.getToday();
      setWellnessData(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWellness();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-primary)', marginBottom: '8px' }}>
          <Droplet size={20} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Holistic Lifestyle Bio-Telemetry
          </span>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Daily metrics for somatic recovery: hydration balance and circadian sleep cycles.
        </p>
      </div>

      {/* Sub Tabs */}
      <div className="scroll-x-touch" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        {[
          { id: 'all', label: 'Overview Dashboard' },
          { id: 'water', label: 'Hydration' },
          { id: 'sleep', label: 'Sleep & Rest' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSubTab(tab.id)}
            style={{
              padding: '8px 18px',
              borderRadius: '10px',
              border: 'none',
              background: activeSubTab === tab.id ? 'var(--emerald-primary)' : 'rgba(255, 255, 255, 0.04)',
              color: activeSubTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 600,
              fontSize: '0.85rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Layout */}
      {activeSubTab === 'all' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 340px), 1fr))', gap: '24px' }}>
          <WaterTracker todayLog={wellnessData?.today} onRefresh={fetchWellness} />
          <SleepTracker todayLog={wellnessData?.today} weeklyLogs={wellnessData?.weekly} onRefresh={fetchWellness} />
        </div>
      )}

      {activeSubTab === 'water' && (
        <div style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <WaterTracker todayLog={wellnessData?.today} onRefresh={fetchWellness} />
        </div>
      )}

      {activeSubTab === 'sleep' && (
        <div style={{ maxWidth: '650px', margin: '0 auto', width: '100%' }}>
          <SleepTracker todayLog={wellnessData?.today} weeklyLogs={wellnessData?.weekly} onRefresh={fetchWellness} />
        </div>
      )}
    </div>
  );
};
