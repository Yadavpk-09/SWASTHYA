// client/src/pages/AssessmentPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { api } from '../services/api.js';
import { PlanSummaryPage } from './PlanSummaryPage.jsx';
import {
  Sparkles,
  ArrowRight,
  ArrowLeft,
  CheckCircle2,
  Scale,
  Brain,
  Moon,
  Utensils,
  Dumbbell,
  ShieldAlert,
  Activity
} from 'lucide-react';

export const AssessmentPage = ({ onComplete }) => {
  const { user, refreshUser } = useAuth();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [planPackage, setPlanPackage] = useState(null);

  // Form State - Module 2 (FR2.1)
  const [age, setAge] = useState(user?.profile?.age || 22);
  const [gender, setGender] = useState(user?.profile?.gender || 'male');
  const [height, setHeight] = useState(user?.profile?.height || 172);
  const [weight, setWeight] = useState(user?.profile?.weight || 68);
  const [goal, setGoal] = useState(user?.profile?.goal || 'Fat Loss');
  const [activityLevel, setActivityLevel] = useState(user?.profile?.activityLevel || 'Moderately Active');
  const [daysAvailable, setDaysAvailable] = useState(user?.profile?.availableDays || 4);
  const [injuries, setInjuries] = useState(user?.profile?.injuries?.join(', ') || '');
  const [dietaryPreference, setDietaryPreference] = useState(user?.profile?.dietaryPreference || 'Vegetarian');
  const [stressLevel, setStressLevel] = useState(user?.profile?.stressLevel || 'medium');
  const [sleepPattern, setSleepPattern] = useState(user?.profile?.sleepPattern || 'fair');

  // Compute live BMI (FR2.2)
  const hM = (Number(height) || 170) / 100;
  const bmiVal = Number(((Number(weight) || 68) / (hM * hM)).toFixed(1));
  let bmiCat = 'Normal weight';
  if (bmiVal < 18.5) bmiCat = 'Underweight';
  else if (bmiVal >= 25 && bmiVal < 30) bmiCat = 'Overweight';
  else if (bmiVal >= 30) bmiCat = 'Obese';

  const handleNext = () => {
    if (step < 4) {
      setStep(step + 1);
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleSubmitAssessment = async () => {
    setLoading(true);
    try {
      const injuryArray = injuries.trim()
        ? injuries.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      const payload = {
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
        goal,
        activityLevel,
        daysAvailable: Number(daysAvailable),
        injuries: injuryArray,
        dietaryPreference,
        stressLevel,
        sleepPattern
      };

      const res = await api.assessment.submit(payload);
      if (refreshUser) await refreshUser();

      setPlanPackage(res.planPackage);
    } catch (err) {
      console.error('Assessment submission failed:', err);
    } finally {
      setLoading(false);
    }
  };

  if (planPackage) {
    return (
      <PlanSummaryPage
        planPackage={planPackage}
        onEnterDashboard={() => {
          if (onComplete) onComplete();
        }}
        onRetake={() => {
          setPlanPackage(null);
          setStep(1);
        }}
      />
    );
  }

  return (
    <div style={{
      maxWidth: '780px',
      margin: 'clamp(14px, 3vw, 30px) auto',
      padding: '0 clamp(10px, 3vw, 20px) 40px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Header and Step Progress */}
      <div style={{ textAlign: 'center' }}>
        <span className="badge-pill badge-emerald" style={{ marginBottom: '8px' }}>
          Personalized Requirement Assessment (Module 2)
        </span>
        <h1 style={{ fontSize: '2rem', color: '#f8fafc', marginTop: '6px', marginBottom: '4px' }}>
          Design Your Swasthya Journey
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
          Accurate metrics allow our engine to generate your tri-domain plan in one pass.
        </p>

        {/* Step dots */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginTop: '20px', flexWrap: 'wrap' }}>
          {[1, 2, 3, 4].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{
                width: '30px',
                height: '30px',
                borderRadius: '50%',
                background: step === s
                  ? 'var(--emerald-primary)'
                  : step > s
                  ? 'rgba(16, 185, 129, 0.3)'
                  : 'rgba(255, 255, 255, 0.08)',
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '0.8rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                {step > s ? <CheckCircle2 size={16} /> : s}
              </div>
              {s < 4 && (
                <div style={{
                  width: 'clamp(16px, 4vw, 32px)',
                  height: '2px',
                  background: step > s ? 'var(--emerald-primary)' : 'rgba(255, 255, 255, 0.1)',
                  flexShrink: 0
                }} />
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="glass-panel" style={{ padding: '34px 30px' }}>
        {/* Step 1: Physical Metrics & BMI */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className="badge-pill badge-emerald">Step 1 of 4</span>
              <h2 style={{ fontSize: '1.45rem', marginTop: '6px', color: '#f8fafc' }}>
                Physical Measurements
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Captured for Mifflin-St Jeor metabolic derivation and baseline BMI calculation.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Age
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={age}
                  onChange={(e) => setAge(e.target.value)}
                  min="14"
                  max="90"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Biological Gender
                </label>
                <select
                  className="input-field"
                  value={gender}
                  onChange={(e) => setGender(e.target.value)}
                >
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Height (cm)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={height}
                  onChange={(e) => setHeight(e.target.value)}
                  min="120"
                  max="230"
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Weight (kg)
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  min="30"
                  max="250"
                />
              </div>
            </div>

            {/* Live BMI Card */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '12px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Auto-Computed Body Mass Index (FR2.2)
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                  {bmiVal} <span style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: 600 }}>({bmiCat})</span>
                </div>
              </div>
              <Scale size={28} color="var(--emerald-primary)" />
            </div>
          </div>
        )}

        {/* Step 2: Fitness Goals & Days Available */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className="badge-pill badge-violet">Step 2 of 4</span>
              <h2 style={{ fontSize: '1.45rem', marginTop: '6px', color: '#f8fafc' }}>
                Primary Goal & Training Frequency
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Choose your fitness objective and how many days per week you can dedicate.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Primary Fitness Goal
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
                {[
                  { id: 'Fat Loss', title: 'Fat Loss / Weight Loss', desc: 'Caloric deficit, metabolic intervals' },
                  { id: 'Muscle Gain', title: 'Lean Muscle Gain', desc: 'Hypertrophy, structural loading' },
                  { id: 'General Fitness', title: 'General Fitness', desc: 'Holistic conditioning & energy' },
                  { id: 'Strength', title: 'Pure Strength', desc: 'Heavy compound power & core stability' },
                  { id: 'Flexibility & Yoga', title: 'Flexibility & Balance', desc: 'Spine mobility, posture & asanas' }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setGoal(item.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: goal === item.id ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: goal === item.id ? '1px solid #8b5cf6' : '1px solid var(--border-glass)',
                      cursor: 'pointer'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.95rem', color: goal === item.id ? '#c4b5fd' : '#f8fafc' }}>
                      {item.title}
                    </div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {item.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Current Activity Level
                </label>
                <select
                  className="input-field"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  <option value="Sedentary">Sedentary (Desk work, minimal exercise)</option>
                  <option value="Lightly Active">Lightly Active (1-3 days/week movement)</option>
                  <option value="Moderately Active">Moderately Active (3-5 days/week workouts)</option>
                  <option value="Very Active">Very Active (6-7 days/week intense training)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Available Days Per Week
                </label>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {[2, 3, 4, 5, 6].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setDaysAvailable(days)}
                      style={{
                        flex: 1,
                        padding: '10px 0',
                        borderRadius: '8px',
                        border: daysAvailable === days ? '1px solid var(--emerald-primary)' : '1px solid var(--border-glass)',
                        background: daysAvailable === days ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        color: daysAvailable === days ? '#34d399' : 'var(--text-secondary)',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {days}d
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Dietary Preference & Medical Constraints */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className="badge-pill badge-amber">Step 3 of 4</span>
              <h2 style={{ fontSize: '1.45rem', marginTop: '6px', color: '#f8fafc' }}>
                Nutrition & Physical Constraints
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                Tailor macro formulas to your diet preference and avoid aggravating injuries.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Dietary Preference
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '12px' }}>
                {[
                  { id: 'Vegetarian', label: 'Vegetarian (Dairy + Plants)' },
                  { id: 'Non-Vegetarian', label: 'Non-Vegetarian (High Protein)' },
                  { id: 'Vegan', label: 'Vegan (100% Plant-Based)' },
                  { id: 'Gluten-Free / Allergies', label: 'Gluten-Free / Allergy Aware' }
                ].map((item) => (
                  <div
                    key={item.id}
                    onClick={() => setDietaryPreference(item.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '10px',
                      background: dietaryPreference === item.id ? 'rgba(245, 158, 11, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: dietaryPreference === item.id ? '1px solid #f59e0b' : '1px solid var(--border-glass)',
                      color: dietaryPreference === item.id ? '#fbbf24' : '#f8fafc',
                      fontWeight: 600,
                      fontSize: '0.85rem',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    {item.label}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                Injuries or Medical Constraints (Optional)
              </label>
              <input
                type="text"
                placeholder="e.g. Knee patellar tendonitis, lumbar back tightness, shoulder impingement"
                className="input-field"
                value={injuries}
                onChange={(e) => setInjuries(e.target.value)}
              />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
                Separate multiple injuries with commas. Our exercise engine flags alternative forms.
              </span>
            </div>
          </div>
        )}

        {/* Step 4: Stress Level & Sleep Patterns */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className="badge-pill badge-violet">Step 4 of 4</span>
              <h2 style={{ fontSize: '1.45rem', marginTop: '6px', color: '#f8fafc' }}>
                Stress & Sleep Evaluation
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
                PRD Module 3 Rule: Elevated stress or poor sleep unlocks a targeted meditation protocol.
              </p>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Current Stress Level
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { id: 'low', title: 'Low Stress', desc: 'Calm, rested, mentally clear' },
                  { id: 'medium', title: 'Moderate Stress', desc: 'College/work pressure, occasional tension' },
                  { id: 'high', title: 'High Stress', desc: 'Exhausted, racing thoughts, muscle stiffness' }
                ].map((s) => (
                  <div
                    key={s.id}
                    onClick={() => setStressLevel(s.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: stressLevel === s.id ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: stressLevel === s.id ? '1px solid #8b5cf6' : '1px solid var(--border-glass)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: stressLevel === s.id ? '#c4b5fd' : '#f8fafc' }}>
                      {s.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {s.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '8px' }}>
                Typical Sleep Pattern
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                {[
                  { id: 'good', title: 'Good (7-9 hrs)', desc: 'Deep, uninterrupted restorative sleep' },
                  { id: 'fair', title: 'Fair (5-7 hrs)', desc: 'Moderate rest, occasional midnight wakeups' },
                  { id: 'poor', title: 'Poor (< 5 hrs / Disrupted)', desc: 'Insomnia, restlessness, daytime fatigue' }
                ].map((p) => (
                  <div
                    key={p.id}
                    onClick={() => setSleepPattern(p.id)}
                    style={{
                      padding: '14px',
                      borderRadius: '12px',
                      background: sleepPattern === p.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                      border: sleepPattern === p.id ? '1px solid #10b981' : '1px solid var(--border-glass)',
                      cursor: 'pointer',
                      textAlign: 'center'
                    }}
                  >
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: sleepPattern === p.id ? '#34d399' : '#f8fafc' }}>
                      {p.title}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '4px' }}>
                      {p.desc}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{
              background: 'rgba(255, 255, 255, 0.03)',
              borderRadius: '10px',
              padding: '12px 16px',
              fontSize: '0.8rem',
              color: '#cbd5e1'
            }}>
              <strong>Engine Preview:</strong>{' '}
              {stressLevel !== 'low' || sleepPattern !== 'good' ? (
                <span style={{ color: '#c4b5fd' }}>
                  Elevated stress / sleep disruption detected. A conditional Meditation & Stress Management Protocol will be generated alongside your Workout and Diet plan.
                </span>
              ) : (
                <span style={{ color: '#34d399' }}>
                  Low stress & good sleep detected. Engine will focus on pure Athletic & Nutrition optimization, skipping intensive meditation protocols.
                </span>
              )}
            </div>
          </div>
        )}

        {/* Buttons */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginTop: '28px',
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '20px'
        }}>
          {step > 1 ? (
            <button
              onClick={handleBack}
              className="btn-secondary"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={handleNext}
              className="btn-primary"
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmitAssessment}
              disabled={loading}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '1rem' }}
            >
              <Sparkles size={18} />
              <span>{loading ? 'Evaluating Requirements...' : 'Generate Swasthya Plan'}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
