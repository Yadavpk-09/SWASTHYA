// client/src/pages/PlanSummaryPage.jsx
import React from 'react';
import {
  Sparkles,
  Dumbbell,
  Utensils,
  Moon,
  Calendar,
  Flame,
  ShieldAlert,
  ArrowRight,
  CheckCircle2,
  HeartPulse,
  Brain
} from 'lucide-react';

export const PlanSummaryPage = ({ planPackage, onEnterDashboard, onRetake }) => {
  if (!planPackage) return null;

  const { exercisePlan, dietPlan, meditationRecommended, stressRoadmap, isMeditationIncluded } = planPackage;
  const showMeditation = meditationRecommended || isMeditationIncluded;

  return (
    <div style={{
      maxWidth: '900px',
      margin: '30px auto',
      padding: '0 20px 60px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{
        padding: '32px',
        textAlign: 'center',
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(6, 182, 212, 0.1) 100%)',
        borderColor: 'rgba(16, 185, 129, 0.3)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '6px',
          padding: '4px 14px',
          borderRadius: '20px',
          background: 'rgba(16, 185, 129, 0.2)',
          border: '1px solid rgba(16, 185, 129, 0.4)',
          color: '#34d399',
          fontSize: '0.8rem',
          fontWeight: 700,
          marginBottom: '12px'
        }}>
          <Sparkles size={14} />
          <span>Requirement Assessment Complete (Module 3 - FR3.2)</span>
        </div>

        <h1 style={{ fontSize: '2.2rem', color: '#f8fafc', marginBottom: '8px' }}>
          Your Swasthya Plan Package
        </h1>
        <p style={{ color: '#cbd5e1', fontSize: '1rem', maxWidth: '650px', margin: '0 auto 20px', lineHeight: 1.5 }}>
          Our multi-domain decision engine evaluated your physical metrics, stress levels, and sleep patterns
          to synthesize your custom tripartite roadmap.
        </p>

        <button
          onClick={onEnterDashboard}
          className="btn-primary"
          style={{
            padding: '14px 36px',
            fontSize: '1rem',
            margin: '0 auto',
            boxShadow: '0 10px 30px rgba(16, 185, 129, 0.4)'
          }}
        >
          <span>Activate Plan & Enter Dashboard</span>
          <ArrowRight size={18} />
        </button>
      </div>

      {/* Package Pillars Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: showMeditation ? 'repeat(3, 1fr)' : 'repeat(2, 1fr)',
        gap: '20px'
      }}>
        {/* Pillar 1: Exercise Plan */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(16, 185, 129, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--emerald-primary)'
            }}>
              <Dumbbell size={22} />
            </div>
            <div>
              <span className="badge-pill badge-emerald" style={{ fontSize: '0.7rem' }}>Domain 1</span>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginTop: '2px' }}>Exercise Plan</h3>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Assigned Routine</div>
            <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              {exercisePlan?.title || 'Foundational Split'}
            </div>
            <div style={{ display: 'flex', gap: '8px', marginTop: '8px', flexWrap: 'wrap' }}>
              <span className="badge-pill badge-emerald">{exercisePlan?.goalType || 'Fitness'}</span>
              <span className="badge-pill badge-violet">{exercisePlan?.durationDays || 3} Days/Wk</span>
              <span className="badge-pill badge-amber">{exercisePlan?.level || 'Beginner'}</span>
            </div>
          </div>

          <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
            {exercisePlan?.description || 'Custom periodized training routine tailored to your weekly availability.'}
          </div>

          <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
              Weekly Structure:
            </div>
            {(exercisePlan?.days || []).slice(0, 3).map((d, i) => (
              <div key={i} style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', justifyContent: 'space-between', padding: '3px 0' }}>
                <span>Day {d.dayNumber}: {d.focus || d.title}</span>
                <span style={{ color: 'var(--emerald-primary)', fontWeight: 600 }}>{d.exercises?.length || 4} moves</span>
              </div>
            ))}
          </div>
        </div>

        {/* Pillar 2: Diet Plan (Mifflin-St Jeor Engine) */}
        <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'rgba(245, 158, 11, 0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#f59e0b'
            }}>
              <Utensils size={22} />
            </div>
            <div>
              <span className="badge-pill badge-amber" style={{ fontSize: '0.7rem' }}>Domain 2</span>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginTop: '2px' }}>Nutrition Plan</h3>
            </div>
          </div>

          <div style={{ background: 'rgba(255, 255, 255, 0.03)', borderRadius: '12px', padding: '14px', marginBottom: '14px' }}>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Mifflin-St Jeor Derivation</div>
            <div style={{ fontSize: '1.4rem', fontWeight: 800, color: '#fbbf24', marginTop: '2px' }}>
              {dietPlan?.dailyCalorieTarget || 2050} <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>kcal / day</span>
            </div>
            <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px' }}>
              {dietPlan?.dietaryPreference || 'Vegetarian'} • {dietPlan?.title}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '12px' }}>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Daily Protein</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8' }}>{dietPlan?.dailyProteinTarget_g || 130}g</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Daily Fiber</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>{dietPlan?.dailyFiberTarget_g || 32}g</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Carbohydrates</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fbbf24' }}>{dietPlan?.dailyCarbTarget_g || 240}g</div>
            </div>
            <div style={{ background: 'rgba(255, 255, 255, 0.02)', padding: '8px', borderRadius: '8px', textAlign: 'center' }}>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Healthy Fats</div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: '#f472b6' }}>{dietPlan?.dailyFatTarget_g || 55}g</div>
            </div>
          </div>

          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.4, flex: 1 }}>
            {dietPlan?.description || 'Macro breakdown tailored for cellular recovery and clean satiety.'}
          </div>
        </div>

        {/* Pillar 3: Meditation Recommendation (Conditional - FR3.1) */}
        {showMeditation ? (
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', borderColor: 'rgba(139, 92, 246, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background: 'rgba(139, 92, 246, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#a855f7'
              }}>
                <Brain size={22} />
              </div>
              <div>
                <span className="badge-pill badge-violet" style={{ fontSize: '0.7rem' }}>Domain 3 (Condition Met)</span>
                <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginTop: '2px' }}>Stress & Mind Protocol</h3>
              </div>
            </div>

            <div style={{
              background: 'rgba(139, 92, 246, 0.08)',
              border: '1px solid rgba(139, 92, 246, 0.25)',
              borderRadius: '12px',
              padding: '14px',
              marginBottom: '14px'
            }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#c4b5fd', textTransform: 'uppercase' }}>
                Trigger: Elevated Stress / Sleep Disruption
              </div>
              <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#f8fafc', marginTop: '4px' }}>
                {stressRoadmap?.title || 'Autonomic Nervous System Reset'}
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '4px' }}>
                Category: <strong style={{ color: '#e879f9' }}>{stressRoadmap?.category?.toUpperCase()} Stress</strong>
              </div>
            </div>

            <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5, flex: 1 }}>
              Your assessment indicated elevated sympathetic tension. Our engine activated a step-wise
              vagus nerve calming protocol pairing pranayama breathing with restorative yoga asanas.
            </div>

            <div style={{ marginTop: '16px', borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '6px' }}>
                Key Interventions:
              </div>
              <div style={{ fontSize: '0.8rem', color: '#cbd5e1', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <span>• Nadi Shodhana / 4-7-8 Breathing</span>
                <span>• Restorative Viparita Karani (Legs Up Wall)</span>
                <span>• Yoga Nidra / Deep Parasympathetic Release</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="glass-panel" style={{
            padding: '24px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            textAlign: 'center',
            borderStyle: 'dashed',
            opacity: 0.8
          }}>
            <div style={{
              width: '44px',
              height: '44px',
              borderRadius: '50%',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--text-muted)',
              marginBottom: '12px'
            }}>
              <CheckCircle2 size={24} color="#34d399" />
            </div>
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '6px' }}>
              Domain 3: Relaxation Optimal
            </h3>
            <p style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Your assessment shows Low Stress & Sound Sleep! The decision engine skipped intensive meditation
              protocols (FR3.1). You can still access relaxing asanas anytime in the Yoga Library.
            </p>
          </div>
        )}
      </div>

      {/* Retake & Actions Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        background: 'rgba(255, 255, 255, 0.02)',
        borderRadius: '14px',
        border: '1px solid var(--border-glass)'
      }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
          Need to tweak your inputs? You can retake the assessment at any time.
        </div>
        <button
          onClick={onRetake}
          className="btn-secondary"
          style={{ padding: '8px 18px', fontSize: '0.85rem' }}
        >
          Retake Assessment
        </button>
      </div>
    </div>
  );
};
