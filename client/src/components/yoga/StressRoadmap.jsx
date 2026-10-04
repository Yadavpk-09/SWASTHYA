// client/src/components/yoga/StressRoadmap.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  Brain,
  Sparkles,
  CheckCircle2,
  Wind,
  Moon,
  Heart,
  HelpCircle,
  Clock,
  ArrowRight,
  Flame,
  ShieldCheck,
  ChevronDown
} from 'lucide-react';

export const StressRoadmap = ({ onSelectAsana, onStartBreathing }) => {
  const [category, setCategory] = useState('medium');
  const [roadmap, setRoadmap] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeStepNode, setActiveStepNode] = useState(null);
  const [completedStepNumbers, setCompletedStepNumbers] = useState([]);

  const { showToast } = useToast();
  const { updateUserState } = useAuth();

  useEffect(() => {
    fetchRoadmap(category);
  }, [category]);

  const fetchRoadmap = async (cat) => {
    setLoading(true);
    try {
      const data = await api.roadmap.getByCategory(cat);
      setRoadmap(data);
      if (data.steps && data.steps.length > 0) {
        setActiveStepNode(data.steps[0]);
      }
    } catch (err) {
      console.error('Error fetching stress roadmap:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteStep = async (step) => {
    try {
      const res = await api.roadmap.completeStep({
        stepNumber: step.stepNumber,
        category,
        stepTitle: step.title
      });

      setCompletedStepNumbers((prev) => [...prev, step.stepNumber]);
      if (res.user) updateUserState(res.user);

      showToast({
        type: 'points',
        title: `Step ${step.stepNumber} Completed!`,
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
      console.error('Failed to complete roadmap step:', err);
    }
  };

  const getStepIcon = (refType) => {
    switch (refType) {
      case 'breathing':
        return <Wind size={16} color="#38bdf8" />;
      case 'asana':
        return <Heart size={16} color="var(--emerald-primary)" />;
      case 'meditation':
        return <Moon size={16} color="#a855f7" />;
      default:
        return <Brain size={16} color="#fbbf24" />;
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '8px',
          color: '#c084fc',
          background: 'rgba(168, 85, 247, 0.1)',
          padding: '6px 14px',
          borderRadius: '20px',
          marginBottom: '10px'
        }}>
          <Brain size={18} />
          <span style={{ fontWeight: 700, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Adaptive Neuro-Somatic Protocol (Module 7)
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: '#f8fafc' }}>
          Stress Management Roadmap
        </h1>
        <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto', fontSize: '0.95rem', lineHeight: 1.5 }}>
          Select your stress category to explore a step-wise sequence. Hover or tap each node to understand
          why each intervention is placed at that exact physiological point in the chain.
        </p>
      </div>

      {/* Category Selector Tabs (FR7.1) */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '12px' }}>
        {[
          { id: 'low', label: 'Low Stress (Flow Maintenance)', color: '#10b981' },
          { id: 'medium', label: 'Medium Stress (Vagal Reset)', color: '#f59e0b' },
          { id: 'high', label: 'High Stress (Acute Calming)', color: '#ef4444' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setCategory(tab.id)}
            style={{
              padding: '10px 22px',
              borderRadius: '12px',
              border: category === tab.id ? `1px solid ${tab.color}` : '1px solid var(--border-glass)',
              background: category === tab.id ? `${tab.color}22` : 'rgba(255, 255, 255, 0.04)',
              color: category === tab.id ? tab.color : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.875rem',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {roadmap && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {/* Category Roadmap Header Banner */}
          <div className="glass-panel" style={{
            padding: '24px',
            borderLeft: `4px solid ${category === 'high' ? '#ef4444' : category === 'medium' ? '#f59e0b' : '#10b981'}`
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
              <div>
                <span className="badge-pill badge-violet" style={{ textTransform: 'uppercase', fontSize: '0.7rem' }}>
                  {category} Stress Protocol
                </span>
                <h2 style={{ fontSize: '1.4rem', color: '#f8fafc', marginTop: '4px' }}>
                  {roadmap.title}
                </h2>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '4px', maxWidth: '650px' }}>
                  {roadmap.description}
                </p>
              </div>

              <div style={{
                background: 'rgba(255, 255, 255, 0.04)',
                padding: '8px 16px',
                borderRadius: '10px',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Steps in Chain</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#f8fafc' }}>
                  {roadmap.steps?.length || 4} Sequential Nodes
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Step-Wise Roadmap Track (FR7.1 & FR7.2) */}
          <div className="glass-panel" style={{ padding: '34px 24px', position: 'relative', overflowX: 'auto' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'relative',
              minWidth: '600px',
              padding: '0 20px'
            }}>
              {/* Connecting progress track line */}
              <div style={{
                position: 'absolute',
                top: '28px',
                left: '40px',
                right: '40px',
                height: '4px',
                background: 'linear-gradient(90deg, #10b981 0%, #06b6d4 50%, #8b5cf6 100%)',
                zIndex: 1,
                borderRadius: '4px'
              }} />

              {/* Numbered Step Nodes */}
              {(roadmap.steps || []).map((step, idx) => {
                const isSelected = activeStepNode?.stepNumber === step.stepNumber;
                const isCompleted = completedStepNumbers.includes(step.stepNumber);

                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setActiveStepNode(step)}
                    onClick={() => setActiveStepNode(step)}
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'relative',
                      zIndex: 10,
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{
                      width: '56px',
                      height: '56px',
                      borderRadius: '50%',
                      background: isCompleted
                        ? '#10b981'
                        : isSelected
                        ? 'linear-gradient(135deg, #06b6d4 0%, #8b5cf6 100%)'
                        : '#1e293b',
                      border: isSelected ? '3px solid #38bdf8' : '2px solid rgba(255, 255, 255, 0.2)',
                      boxShadow: isSelected ? '0 0 25px rgba(56, 189, 248, 0.6)' : 'none',
                      color: '#ffffff',
                      fontWeight: 800,
                      fontSize: '1.1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      transition: 'all 0.2s ease',
                      transform: isSelected ? 'scale(1.15)' : 'scale(1)'
                    }}>
                      {isCompleted ? <CheckCircle2 size={24} /> : step.stepNumber}
                    </div>

                    <div style={{ marginTop: '10px', textAlign: 'center' }}>
                      <div style={{
                        fontSize: '0.85rem',
                        fontWeight: isSelected ? 700 : 600,
                        color: isSelected ? '#38bdf8' : '#f8fafc',
                        whiteSpace: 'nowrap'
                      }}>
                        {step.shortLabel || step.title}
                      </div>
                      <div style={{ fontSize: '0.725rem', color: 'var(--text-muted)' }}>
                        {step.durationMinutes} mins
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Active Node Detail Card (FR7.2: Hover/Tap reveal card) */}
          {activeStepNode && (
            <div className="glass-panel" style={{
              padding: '28px',
              border: '1px solid rgba(56, 189, 248, 0.35)',
              background: 'linear-gradient(180deg, rgba(15, 23, 42, 0.8) 0%, rgba(30, 41, 59, 0.8) 100%)',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <span className="badge-pill badge-violet">Node #{activeStepNode.stepNumber}</span>
                    <span className="badge-pill badge-emerald" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      {getStepIcon(activeStepNode.refType)}
                      <span style={{ textTransform: 'capitalize' }}>{activeStepNode.refType}</span>
                    </span>
                    <span className="badge-pill badge-amber">
                      <Clock size={12} style={{ display: 'inline', marginRight: '4px' }} />
                      {activeStepNode.durationMinutes} Minutes
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.45rem', color: '#f8fafc', marginBottom: '8px' }}>
                    {activeStepNode.title}
                  </h3>
                </div>

                <button
                  onClick={() => handleCompleteStep(activeStepNode)}
                  disabled={completedStepNumbers.includes(activeStepNode.stepNumber)}
                  className={completedStepNumbers.includes(activeStepNode.stepNumber) ? 'btn-secondary' : 'btn-primary'}
                  style={{ padding: '10px 20px', fontSize: '0.9rem' }}
                >
                  <CheckCircle2 size={16} />
                  <span>{completedStepNumbers.includes(activeStepNode.stepNumber) ? 'Step Completed' : 'Mark Step Complete (+25 pts)'}</span>
                </button>
              </div>

              {/* RATIONALE: Why it's placed at this point in the sequence (FR7.2) */}
              <div style={{
                background: 'rgba(56, 189, 248, 0.08)',
                border: '1px solid rgba(56, 189, 248, 0.25)',
                borderRadius: '12px',
                padding: '14px 18px',
                marginTop: '16px',
                marginBottom: '16px'
              }}>
                <div style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                  color: '#38bdf8',
                  marginBottom: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  <Sparkles size={14} />
                  <span>Why This Step Is Placed Here (Sequence Rationale):</span>
                </div>
                <div style={{ fontSize: '0.88rem', color: '#e2e8f0', lineHeight: 1.5 }}>
                  {activeStepNode.whyHere || 'Optimizes neuro-muscular readiness and vagal parasympathetic signaling.'}
                </div>
              </div>

              {/* Full process instructions */}
              <div style={{
                background: 'rgba(255, 255, 255, 0.03)',
                border: '1px solid var(--border-glass)',
                borderRadius: '12px',
                padding: '16px',
                marginTop: '12px'
              }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                  Step Execution Process:
                </div>
                <p style={{ fontSize: '0.88rem', color: '#cbd5e1', lineHeight: 1.6, margin: 0 }}>
                  {activeStepNode.fullProcess}
                </p>
              </div>

              {/* Referenced Asset Data */}
              {activeStepNode.referenceData && (
                <div style={{ marginTop: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    Referenced Catalog Entry: <strong style={{ color: '#f8fafc' }}>{activeStepNode.referenceData.name}</strong>
                  </span>

                  {activeStepNode.refType === 'breathing' && onStartBreathing && (
                    <button
                      onClick={onStartBreathing}
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <Wind size={14} />
                      <span>Open in Breathing Timer</span>
                    </button>
                  )}

                  {activeStepNode.refType === 'asana' && onSelectAsana && (
                    <button
                      onClick={() => onSelectAsana(activeStepNode.referenceData)}
                      className="btn-secondary"
                      style={{ padding: '6px 14px', fontSize: '0.8rem' }}
                    >
                      <Heart size={14} />
                      <span>View Asana Form Guide</span>
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
