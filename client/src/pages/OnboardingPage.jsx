// client/src/pages/OnboardingPage.jsx
import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import { Sparkles, ArrowRight, ArrowLeft, CheckCircle2, ShieldCheck, HeartPulse, Scale, Flame, Activity } from 'lucide-react';
import { api } from '../services/api.js';

export const OnboardingPage = ({ onComplete }) => {
  const { user, updateProfile } = useAuth();

  const [step, setStep] = useState(1);
  const [age, setAge] = useState(user?.profile?.age || 21);
  const [gender, setGender] = useState(user?.profile?.gender || 'female');
  const [height, setHeight] = useState(user?.profile?.height || 165);
  const [weight, setWeight] = useState(user?.profile?.weight || 62);
  const [goal, setGoal] = useState(user?.profile?.goal || 'Fat Loss');
  const [activityLevel, setActivityLevel] = useState(user?.profile?.activityLevel || 'Lightly Active');
  const [availableDays, setAvailableDays] = useState(user?.profile?.availableDays || 3);
  const [injuries, setInjuries] = useState(user?.profile?.injuries?.join(', ') || '');
  const [recommendedPlan, setRecommendedPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  // Compute live BMI
  const hMeters = height / 100;
  const bmiVal = Number((weight / (hMeters * hMeters)).toFixed(1));
  let bmiCat = 'Normal weight';
  if (bmiVal < 18.5) bmiCat = 'Underweight';
  else if (bmiVal >= 25 && bmiVal < 30) bmiCat = 'Overweight';
  else if (bmiVal >= 30) bmiCat = 'Obese';

  const handleNext = async () => {
    if (step < 3) {
      setStep(step + 1);
      return;
    }

    // Step 3 -> compute recommendation preview
    setLoading(true);
    try {
      const rec = await api.plans.getRecommendation();
      setRecommendedPlan(rec);
      setStep(4);
    } catch (err) {
      console.error(err);
      setStep(4);
    } finally {
      setLoading(false);
    }
  };

  const handleFinishOnboarding = async () => {
    setLoading(true);
    try {
      const injuriesList = injuries.trim()
        ? injuries.split(',').map((s) => s.trim()).filter(Boolean)
        : [];

      await updateProfile({
        age: Number(age),
        gender,
        height: Number(height),
        weight: Number(weight),
        goal,
        activityLevel,
        availableDays: Number(availableDays),
        injuries: injuriesList,
        recalculatePlan: true
      });

      if (onComplete) onComplete();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      maxWidth: '750px',
      margin: '40px auto',
      padding: '0 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '24px'
    }}>
      {/* Step Indicators */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px' }}>
        {[1, 2, 3, 4].map((s) => (
          <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: step === s
                ? 'var(--emerald-primary)'
                : step > s
                ? 'rgba(16, 185, 129, 0.3)'
                : 'rgba(255, 255, 255, 0.08)',
              color: '#ffffff',
              fontWeight: 700,
              fontSize: '0.85rem',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              {step > s ? <CheckCircle2 size={18} /> : s}
            </div>
            {s < 4 && (
              <div style={{
                width: '40px',
                height: '2px',
                background: step > s ? 'var(--emerald-primary)' : 'rgba(255, 255, 255, 0.1)'
              }} />
            )}
          </div>
        ))}
      </div>

      <div className="glass-panel" style={{ padding: '36px 32px' }}>
        {/* Step 1: Body Metrics */}
        {step === 1 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className="badge-pill badge-emerald">Step 1 of 4</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '6px', color: '#f8fafc' }}>
                Your Physical Baseline
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                We use your height and weight to compute accurate BMI and calorie targets.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
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
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other / Prefer not to say</option>
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
                  min="100"
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

            {/* Real-time Computed BMI Banner */}
            <div style={{
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '14px',
              padding: '16px 20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                  Calculated BMI Index
                </div>
                <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#f8fafc', marginTop: '2px' }}>
                  {bmiVal} <span style={{ fontSize: '0.9rem', color: '#34d399', fontWeight: 600 }}>({bmiCat})</span>
                </div>
              </div>
              <Scale size={28} color="var(--emerald-primary)" />
            </div>
          </div>
        )}

        {/* Step 2: Primary Goal */}
        {step === 2 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className="badge-pill badge-violet">Step 2 of 4</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '6px', color: '#f8fafc' }}>
                Primary Fitness & Wellness Goal
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Select what you want to achieve first. You can always change this later.
              </p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '14px' }}>
              {[
                { id: 'Fat Loss', title: 'Fat Loss & Tone', desc: 'Caloric burn, metabolic circuits, high energy' },
                { id: 'Muscle Gain', title: 'Lean Muscle Gain', desc: 'Progressive hypertrophy, structural strength' },
                { id: 'Flexibility & Yoga', title: 'Flexibility & Mind-Body', desc: 'Spine decompression, asanas, stress release' },
                { id: 'Strength', title: 'Pure Strength', desc: 'Heavy compound lifts & neuromuscular power' },
                { id: 'Endurance', title: 'Cardio & Stamina', desc: 'Aerobic fitness, plyometrics, lung capacity' }
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setGoal(item.id)}
                  style={{
                    padding: '16px',
                    borderRadius: '14px',
                    background: goal === item.id ? 'rgba(139, 92, 246, 0.2)' : 'rgba(255, 255, 255, 0.03)',
                    border: goal === item.id ? '1px solid #8b5cf6' : '1px solid var(--border-glass)',
                    cursor: 'pointer',
                    transition: 'all 0.2s ease'
                  }}
                  className="glass-card"
                >
                  <div style={{ fontWeight: 700, fontSize: '1rem', color: goal === item.id ? '#c4b5fd' : '#f8fafc' }}>
                    {item.title}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                    {item.desc}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Schedule & Injuries */}
        {step === 3 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className="badge-pill badge-amber">Step 3 of 4</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '6px', color: '#f8fafc' }}>
                Availability & Health Constraints
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Ensure your routine fits your college/work schedule and protects past injuries.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Current Activity Level
                </label>
                <select
                  className="input-field"
                  value={activityLevel}
                  onChange={(e) => setActivityLevel(e.target.value)}
                >
                  <option value="Sedentary">Sedentary (Little or no exercise, desk work)</option>
                  <option value="Lightly Active">Lightly Active (1-3 days/week moderate movement)</option>
                  <option value="Moderately Active">Moderately Active (3-5 days/week workouts)</option>
                  <option value="Very Active">Very Active (6-7 days/week intense training)</option>
                </select>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Available Days Per Week for Workouts/Yoga
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px' }}>
                  {[3, 4, 5, 6].map((days) => (
                    <button
                      key={days}
                      type="button"
                      onClick={() => setAvailableDays(days)}
                      style={{
                        padding: '12px',
                        borderRadius: '10px',
                        border: availableDays === days ? '1px solid var(--emerald-primary)' : '1px solid var(--border-glass)',
                        background: availableDays === days ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.04)',
                        color: availableDays === days ? '#34d399' : 'var(--text-secondary)',
                        fontWeight: 700,
                        cursor: 'pointer'
                      }}
                    >
                      {days} Days
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Medical Constraints / Previous Injuries (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. Lower back stiffness, knee pain when bending deep (or leave empty)"
                  className="input-field"
                  value={injuries}
                  onChange={(e) => setInjuries(e.target.value)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Plan Recommendation Preview */}
        {step === 4 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div>
              <span className="badge-pill badge-emerald">Ready to Launch</span>
              <h2 style={{ fontSize: '1.6rem', marginTop: '6px', color: '#f8fafc' }}>
                Your Personalized Recommendation
              </h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                Our rule-based engine mapped your profile metrics to this curated program.
              </p>
            </div>

            {recommendedPlan && (
              <div style={{
                background: 'rgba(16, 185, 129, 0.08)',
                border: '1px solid rgba(16, 185, 129, 0.3)',
                borderRadius: '16px',
                padding: '24px'
              }}>
                <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                  <span className="badge-pill badge-emerald">{recommendedPlan.goalType}</span>
                  <span className="badge-pill badge-violet">{recommendedPlan.level}</span>
                  <span className="badge-pill badge-amber">{recommendedPlan.durationDays} Days / Week</span>
                </div>
                <h3 style={{ fontSize: '1.4rem', color: '#f8fafc', marginBottom: '8px' }}>
                  {recommendedPlan.title}
                </h3>
                <p style={{ color: '#cbd5e1', fontSize: '0.88rem', lineHeight: 1.5, marginBottom: '16px' }}>
                  {recommendedPlan.description}
                </p>

                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: '8px' }}>
                  Weekly Routine Breakdown:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                  {(recommendedPlan.days || []).map((day, idx) => (
                    <div key={idx} style={{
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '10px',
                      padding: '10px'
                    }}>
                      <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-primary)' }}>
                        Day {day.dayNumber}
                      </div>
                      <div style={{ fontSize: '0.825rem', fontWeight: 600, color: '#f8fafc', marginTop: '2px' }}>
                        {day.title}
                      </div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                        {day.focus} • {day.exercises?.length || 4} exercises
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Navigation Buttons */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '28px', borderTop: '1px solid var(--border-glass)', paddingTop: '20px' }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="btn-secondary"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={handleNext}
              disabled={loading}
              className="btn-primary"
            >
              <span>Continue</span>
              <ArrowRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleFinishOnboarding}
              disabled={loading}
              className="btn-primary"
              style={{ padding: '12px 28px', fontSize: '1rem' }}
            >
              <Sparkles size={18} />
              <span>Start My Journey</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
