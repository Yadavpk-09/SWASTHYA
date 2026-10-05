// client/src/pages/AdminPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import {
  ShieldCheck,
  Users,
  Dumbbell,
  Sparkles,
  Activity,
  Plus,
  Trash2,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Layers,
  Calendar,
  Clock
} from 'lucide-react';
import { useToast } from '../context/ToastContext.jsx';

export const AdminPage = () => {
  const { showToast } = useToast();

  const [stats, setStats] = useState(null);
  const [usersList, setUsersList] = useState([]);
  const [exercisesList, setExercisesList] = useState([]);
  const [asanasList, setAsanasList] = useState([]);
  const [plansList, setPlansList] = useState([]);
  const [breathingList, setBreathingList] = useState([]);
  const [dietPlansList, setDietPlansList] = useState([]);
  const [roadmapsData, setRoadmapsData] = useState(null);
  const [activeAdminTab, setActiveAdminTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  // Filters for lists
  const [exSearch, setExSearch] = useState('');
  const [asanaSearch, setAsanaSearch] = useState('');
  const [planSearch, setPlanSearch] = useState('');
  const [breathSearch, setBreathSearch] = useState('');
  const [dietSearch, setDietSearch] = useState('');

  // New Exercise Form State
  const [newExName, setNewExName] = useState('');
  const [newExMuscle, setNewExMuscle] = useState('Chest');
  const [newExEquip, setNewExEquip] = useState('Dumbbell');
  const [newExDiff, setNewExDiff] = useState('Beginner');
  const [newExCue, setNewExCue] = useState('');
  const [newExCalories, setNewExCalories] = useState(90);

  // New Asana Form State
  const [newAsanaName, setNewAsanaName] = useState('');
  const [newAsanaSanskrit, setNewAsanaSanskrit] = useState('');
  const [newAsanaCat, setNewAsanaCat] = useState('Standing');
  const [newAsanaDiff, setNewAsanaDiff] = useState('Beginner');
  const [newAsanaHold, setNewAsanaHold] = useState(45);
  const [newAsanaBenefit, setNewAsanaBenefit] = useState('');

  // New Workout Plan Form State (FR12.3)
  const [newPlanTitle, setNewPlanTitle] = useState('');
  const [newPlanDesc, setNewPlanDesc] = useState('');
  const [newPlanGoal, setNewPlanGoal] = useState('Fat Loss');
  const [newPlanLevel, setNewPlanLevel] = useState('Beginner');
  const [newPlanDays, setNewPlanDays] = useState(3);

  // New Breathing Technique Form State (FR12.3)
  const [newBreathName, setNewBreathName] = useState('');
  const [newBreathSanskrit, setNewBreathSanskrit] = useState('');
  const [newBreathInhale, setNewBreathInhale] = useState(4);
  const [newBreathHold1, setNewBreathHold1] = useState(4);
  const [newBreathExhale, setNewBreathExhale] = useState(4);
  const [newBreathHold2, setNewBreathHold2] = useState(4);
  const [newBreathProcess, setNewBreathProcess] = useState('');
  const [newBreathTag, setNewBreathTag] = useState('quick calm');
  const [newBreathMins, setNewBreathMins] = useState(5);

  // New Diet Plan Form State (FR12.3)
  const [newDietTitle, setNewDietTitle] = useState('');
  const [newDietGoal, setNewDietGoal] = useState('Fat Loss');
  const [newDietPref, setNewDietPref] = useState('Vegetarian');
  const [newDietCals, setNewDietCals] = useState(1900);
  const [newDietPro, setNewDietPro] = useState(125);
  const [newDietFib, setNewDietFib] = useState(30);
  const [newDietCarb, setNewDietCarb] = useState(210);
  const [newDietFat, setNewDietFat] = useState(50);
  const [newDietDesc, setNewDietDesc] = useState('');

  const fetchAdminData = async () => {
    try {
      const [statsData, usersData, exData, asanaData, plansData, breathData, dietData, roadmapData] = await Promise.all([
        api.admin.getStats(),
        api.admin.getUsers(),
        api.exercises.getAll(),
        api.asanas.getAll(),
        api.plans.getAll(),
        api.admin.getAllBreathing(),
        api.admin.getAllDietPlans(),
        api.admin.getAllRoadmaps()
      ]);
      setStats(statsData);
      setUsersList(usersData);
      setExercisesList(exData);
      setAsanasList(asanaData);
      setPlansList(plansData);
      setBreathingList(breathData);
      setDietPlansList(dietData);
      setRoadmapsData(roadmapData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  const handleToggleUser = async (userId) => {
    try {
      const res = await api.admin.toggleUserStatus(userId);
      showToast({
        type: 'info',
        title: 'User Status Updated',
        message: res.message
      });
      fetchAdminData();
    } catch (err) {
      showToast({ type: 'error', title: 'Action failed', message: err.message });
    }
  };

  const handleCreateExercise = async (e) => {
    e.preventDefault();
    if (!newExName) return;

    try {
      await api.admin.createExercise({
        name: newExName,
        muscleGroup: newExMuscle,
        equipment: newExEquip,
        difficulty: newExDiff,
        instructions: [newExCue || 'Maintain proper core brace and controlled eccentric cadence.'],
        caloriesBurnEstimate: Number(newExCalories) || 90
      });

      showToast({ type: 'success', title: 'Exercise Created', message: `${newExName} added to verified library.` });
      setNewExName('');
      setNewExCue('');
      fetchAdminData();
    } catch (err) {
      showToast({ type: 'error', title: 'Failed to create exercise', message: err.message });
    }
  };

  const handleDeleteExercise = async (id, name) => {
    if (!window.confirm(`Delete ${name} from verified exercises?`)) return;
    try {
      await api.admin.deleteExercise(id);
      showToast({ type: 'info', title: 'Exercise Deleted', message: `${name} was removed.` });
      fetchAdminData();
    } catch (err) {
      showToast({ type: 'error', title: 'Delete Failed', message: err.message });
    }
  };

  const handleCreateAsana = async (e) => {
    e.preventDefault();
    if (!newAsanaName || !newAsanaSanskrit) return;

    try {
      await api.admin.createAsana({
        name: newAsanaName,
        sanskritName: newAsanaSanskrit,
        category: newAsanaCat,
        difficulty: newAsanaDiff,
        holdDurationSeconds: Number(newAsanaHold),
        benefits: [newAsanaBenefit || 'Improves posture, stability, and somatic tranquility.']
      });

      showToast({ type: 'success', title: 'Asana Created', message: `${newAsanaName} (${newAsanaSanskrit}) added to library.` });
      setNewAsanaName('');
      setNewAsanaSanskrit('');
      setNewAsanaBenefit('');
      fetchAdminData();
    } catch (err) {
      showToast({ type: 'error', title: 'Failed to create asana', message: err.message });
    }
  };

  const handleDeleteAsana = async (id, name) => {
    if (!window.confirm(`Delete asana ${name}?`)) return;
    try {
      await api.admin.deleteAsana(id);
      showToast({ type: 'info', title: 'Asana Deleted', message: `${name} was removed.` });
      fetchAdminData();
    } catch (err) {
      showToast({ type: 'error', title: 'Delete Failed', message: err.message });
    }
  };

  // Workout Plan Create & Delete (FR9.3)
  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!newPlanTitle) return;

    try {
      // Build default day structures based on available exercises
      const sampleEx = exercisesList.slice(0, 4).map(ex => ({
        exerciseId: ex.id,
        sets: 3,
        reps: '10-12',
        restSeconds: 60
      }));

      const generatedDays = Array.from({ length: Number(newPlanDays) }, (_, i) => ({
        dayNumber: i + 1,
        title: `Day ${i + 1}: ${newPlanGoal} Focus`,
        focus: `${newPlanGoal} Conditioning`,
        exercises: sampleEx
      }));

      await api.admin.createPlan({
        title: newPlanTitle,
        description: newPlanDesc || `Curated ${newPlanDays}-day training cycle tailored for ${newPlanGoal}.`,
        goalType: newPlanGoal,
        level: newPlanLevel,
        durationDays: Number(newPlanDays),
        days: generatedDays
      });

      showToast({ type: 'success', title: 'Workout Plan Created', message: `${newPlanTitle} template added.` });
      setNewPlanTitle('');
      setNewPlanDesc('');
      fetchAdminData();
    } catch (err) {
      showToast({ type: 'error', title: 'Failed to create plan', message: err.message });
    }
  };

  const handleDeletePlan = async (id, title) => {
    if (!window.confirm(`Delete workout plan "${title}"?`)) return;
    try {
      await api.admin.deletePlan(id);
      showToast({ type: 'info', title: 'Plan Deleted', message: `Plan "${title}" removed.` });
      fetchAdminData();
    } catch (err) {
      showToast({ type: 'error', title: 'Delete Failed', message: err.message });
    }
  };

  // Breathing Techniques CRUD (FR12.3)
  const handleCreateBreathing = async (e) => {
    e.preventDefault();
    if (!newBreathName) return;

    try {
      await api.admin.createBreathing({
        name: newBreathName,
        sanskritName: newBreathSanskrit,
        pattern: {
          inhale: Number(newBreathInhale),
          hold1: Number(newBreathHold1),
          exhale: Number(newBreathExhale),
          hold2: Number(newBreathHold2)
        },
        durationMinutes: Number(newBreathMins),
        tags: [newBreathTag],
        fullProcess: newBreathProcess || 'Inhale and exhale in calm cadence.'
      });

      showToast({ type: 'success', title: 'Breathing Technique Created', message: `${newBreathName} published to library.` });
      setNewBreathName('');
      setNewBreathSanskrit('');
      setNewBreathProcess('');
      fetchAdminData();
    } catch (err) {
      showToast({ type: 'error', title: 'Failed to create breathing technique', message: err.message });
    }
  };

  const handleDeleteBreathing = async (id, name) => {
    if (!window.confirm(`Delete breathing technique "${name}"?`)) return;
    try {
      await api.admin.deleteBreathing(id);
      showToast({ type: 'info', title: 'Technique Deleted', message: `${name} removed.` });
      fetchAdminData();
    } catch (err) {
      showToast({ type: 'error', title: 'Delete Failed', message: err.message });
    }
  };

  // Diet Plans CRUD (FR12.3)
  const handleCreateDietPlan = async (e) => {
    e.preventDefault();
    if (!newDietTitle) return;

    try {
      await api.admin.createDietPlan({
        title: newDietTitle,
        goalType: newDietGoal,
        dietaryPreference: newDietPref,
        dailyCalorieTarget: Number(newDietCals),
        dailyProteinTarget_g: Number(newDietPro),
        dailyFiberTarget_g: Number(newDietFib),
        dailyCarbTarget_g: Number(newDietCarb),
        dailyFatTarget_g: Number(newDietFat),
        description: newDietDesc || 'Targeted dietary protocol for metabolic adaptation.'
      });

      showToast({ type: 'success', title: 'Diet Plan Created', message: `${newDietTitle} published.` });
      setNewDietTitle('');
      setNewDietDesc('');
      fetchAdminData();
    } catch (err) {
      showToast({ type: 'error', title: 'Failed to create diet plan', message: err.message });
    }
  };

  const handleDeleteDietPlan = async (id, title) => {
    if (!window.confirm(`Delete diet plan "${title}"?`)) return;
    try {
      await api.admin.deleteDietPlan(id);
      showToast({ type: 'info', title: 'Diet Plan Deleted', message: `Diet plan "${title}" removed.` });
      fetchAdminData();
    } catch (err) {
      showToast({ type: 'error', title: 'Delete Failed', message: err.message });
    }
  };

  // Roadmap Step update (FR12.4)
  const handleUpdateRoadmapStep = async (cat, stepIdx, updatedData) => {
    try {
      await api.admin.updateRoadmapStep(cat, stepIdx, updatedData);
      showToast({ type: 'success', title: 'Roadmap Step Updated', message: `Step ${stepIdx + 1} updated successfully.` });
      fetchAdminData();
    } catch (err) {
      showToast({ type: 'error', title: 'Failed to update step', message: err.message });
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#a78bfa', marginBottom: '8px' }}>
          <ShieldCheck size={20} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            SWASTHYA Admin Console (Module 12)
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Platform Administration</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Platform oversight, user governance, and full CRUD management for exercises, asanas, breathing techniques, workout splits, diet plans, and stress roadmap steps.
        </p>
      </div>

      {/* Admin Subtabs */}
      <div className="scroll-x-touch" style={{ borderBottom: '1px solid var(--border-glass)', paddingBottom: '12px' }}>
        {[
          { id: 'overview', label: 'Platform Metrics (FR12.5)' },
          { id: 'users', label: `Users (${usersList.length}) (FR12.2, FR12.6)` },
          { id: 'exercises', label: `Exercises (${exercisesList.length}) (FR12.3)` },
          { id: 'asanas', label: `Asanas (${asanasList.length}) (FR12.3)` },
          { id: 'plans', label: `Workout Plans (${plansList.length}) (FR12.3)` },
          { id: 'breathing', label: `Breathing (${breathingList.length}) (FR12.3)` },
          { id: 'diet', label: `Diet Plans (${dietPlansList.length}) (FR12.3)` },
          { id: 'roadmaps', label: 'Stress Roadmaps (FR12.4)' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveAdminTab(tab.id)}
            style={{
              padding: '8px 16px',
              borderRadius: '10px',
              border: 'none',
              background: activeAdminTab === tab.id ? 'var(--violet-primary)' : 'rgba(255, 255, 255, 0.04)',
              color: activeAdminTab === tab.id ? '#ffffff' : 'var(--text-secondary)',
              fontWeight: 700,
              fontSize: '0.825rem',
              cursor: 'pointer',
              whiteSpace: 'nowrap',
              flexShrink: 0,
              transition: 'all 0.2s ease'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab: Overview Metrics */}
      {activeAdminTab === 'overview' && stats && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="grid-stats-cards">
            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Total Registered Athletes
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {stats.totalUsers}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '2px' }}>
                {stats.activeUsers} active accounts
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Cohort Average Streak
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {stats.avgStreak} <span style={{ fontSize: '1rem', color: '#ef4444' }}>Days</span>
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                Daily engagement metric
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Total Workouts Logged
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {stats.totalWorkoutsLogged}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '2px' }}>
                Across all active cohorts
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '20px' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-muted)' }}>
                Curated Content Catalog
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f8fafc', marginTop: '4px' }}>
                {exercisesList.length + asanasList.length + plansList.length}
              </div>
              <div style={{ fontSize: '0.75rem', color: '#a78bfa', marginTop: '2px' }}>
                {exercisesList.length} ex • {asanasList.length} asanas • {plansList.length} plans
              </div>
            </div>
          </div>

          {/* Most Used Plans Breakdown */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '14px' }}>
              Cohort Plan Utilization Breakdown
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {(stats.mostUsedPlans || []).map((p, idx) => (
                <div
                  key={idx}
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '10px',
                    padding: '12px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
                    {p.title}
                  </span>
                  <span className="badge-pill badge-emerald">
                    {p.userCount} {p.userCount === 1 ? 'user enrolled' : 'users enrolled'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: User Governance */}
      {activeAdminTab === 'users' && (
        <div className="glass-panel" style={{ padding: '24px', overflowX: 'auto' }}>
          <h3 style={{ fontSize: '1.1rem', color: '#f8fafc', marginBottom: '14px' }}>
            Registered Users Governance Directory
          </h3>

          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--border-glass)', color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '12px' }}>User</th>
                <th style={{ padding: '12px' }}>Role</th>
                <th style={{ padding: '12px' }}>Streak</th>
                <th style={{ padding: '12px' }}>Plan Assigned</th>
                <th style={{ padding: '12px' }}>Account Status</th>
                <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((u) => (
                <tr key={u.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)' }}>
                  <td style={{ padding: '12px' }}>
                    <div style={{ fontWeight: 600, color: '#f8fafc', fontSize: '0.9rem' }}>{u.name}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{u.email}</div>
                  </td>

                  <td style={{ padding: '12px' }}>
                    <span className={`badge-pill ${u.role === 'admin' ? 'badge-violet' : 'badge-emerald'}`}>
                      {u.role}
                    </span>
                  </td>

                  <td style={{ padding: '12px', color: '#f87171', fontWeight: 700, fontSize: '0.85rem' }}>
                    {u.currentStreak || 0}d
                  </td>

                  <td style={{ padding: '12px', fontSize: '0.825rem', color: '#cbd5e1' }}>
                    {u.planTitle || 'None'}
                  </td>

                  <td style={{ padding: '12px' }}>
                    <span style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      color: u.status === 'deactivated' ? '#f87171' : '#34d399',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}>
                      {u.status === 'deactivated' ? <XCircle size={14} /> : <CheckCircle2 size={14} />}
                      <span>{u.status === 'deactivated' ? 'Deactivated' : 'Active'}</span>
                    </span>
                  </td>

                  <td style={{ padding: '12px', textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggleUser(u.id)}
                      className={u.status === 'deactivated' ? 'btn-primary' : 'btn-secondary'}
                      style={{ padding: '6px 12px', fontSize: '0.75rem' }}
                    >
                      {u.status === 'deactivated' ? 'Reactivate' : 'Flag / Deactivate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Tab: Manage Exercises */}
      {activeAdminTab === 'exercises' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '24px' }}>
          {/* List of Verified Exercises */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>
                Verified Exercises Directory ({exercisesList.length})
              </h3>
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Filter exercises..."
                  className="input-field"
                  value={exSearch}
                  onChange={(e) => setExSearch(e.target.value)}
                  style={{ padding: '6px 10px 6px 30px', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '560px', overflowY: 'auto' }}>
              {exercisesList
                .filter(ex => ex.name.toLowerCase().includes(exSearch.toLowerCase()) || ex.muscleGroup.toLowerCase().includes(exSearch.toLowerCase()))
                .map((ex) => (
                  <div
                    key={ex.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
                        {ex.name}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                        <span className="badge-pill badge-emerald">{ex.muscleGroup}</span>
                        <span className="badge-pill badge-violet">{ex.equipment}</span>
                        <span className="badge-pill badge-amber">{ex.difficulty}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteExercise(ex.id, ex.name)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        width: '32px',
                        height: '32px',
                        color: '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Delete Exercise"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Form to Add Exercise */}
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '16px' }}>
              Add New Verified Exercise
            </h3>

            <form onSubmit={handleCreateExercise} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Exercise Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Incline Dumbbell Bench Press"
                  className="input-field"
                  value={newExName}
                  onChange={(e) => setNewExName(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Muscle Group
                  </label>
                  <select className="input-field" value={newExMuscle} onChange={(e) => setNewExMuscle(e.target.value)}>
                    <option value="Chest">Chest</option>
                    <option value="Back">Back</option>
                    <option value="Legs">Legs</option>
                    <option value="Shoulders">Shoulders</option>
                    <option value="Core">Core</option>
                    <option value="Arms">Arms</option>
                    <option value="Full Body">Full Body</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Equipment
                  </label>
                  <select className="input-field" value={newExEquip} onChange={(e) => setNewExEquip(e.target.value)}>
                    <option value="Bodyweight">Bodyweight</option>
                    <option value="Dumbbell">Dumbbell</option>
                    <option value="Barbell">Barbell</option>
                    <option value="Machine">Machine</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Difficulty
                  </label>
                  <select className="input-field" value={newExDiff} onChange={(e) => setNewExDiff(e.target.value)}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Primary Form Cue
                </label>
                <input
                  type="text"
                  placeholder="e.g. Retract scapulae and press up along 45-degree angle"
                  className="input-field"
                  value={newExCue}
                  onChange={(e) => setNewExCue(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Estimated Calorie Burn / 15 min
                </label>
                <input
                  type="number"
                  className="input-field"
                  value={newExCalories}
                  onChange={(e) => setNewExCalories(e.target.value)}
                  min="20"
                  max="300"
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '10px', marginTop: '6px' }}>
                <Plus size={16} />
                <span>Save to Exercise Library</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Manage Asanas */}
      {activeAdminTab === 'asanas' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '24px' }}>
          {/* List of Asanas */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>
                Verified Yoga Asanas ({asanasList.length})
              </h3>
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Filter asanas..."
                  className="input-field"
                  value={asanaSearch}
                  onChange={(e) => setAsanaSearch(e.target.value)}
                  style={{ padding: '6px 10px 6px 30px', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '560px', overflowY: 'auto' }}>
              {asanasList
                .filter(as => as.name.toLowerCase().includes(asanaSearch.toLowerCase()) || as.sanskritName.toLowerCase().includes(asanaSearch.toLowerCase()))
                .map((as) => (
                  <div
                    key={as.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>
                        {as.name} <span style={{ fontSize: '0.78rem', color: 'var(--emerald-primary)' }}>({as.sanskritName})</span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
                        <span className="badge-pill badge-emerald">{as.category}</span>
                        <span className="badge-pill badge-violet">{as.difficulty || 'Beginner'}</span>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{as.holdDurationSeconds}s hold</span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteAsana(as.id, as.name)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        width: '32px',
                        height: '32px',
                        color: '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Delete Asana"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Form to Add Asana */}
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '16px' }}>
              Add New Yoga Asana
            </h3>

            <form onSubmit={handleCreateAsana} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    English Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Triangle Pose"
                    className="input-field"
                    value={newAsanaName}
                    onChange={(e) => setNewAsanaName(e.target.value)}
                  />
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Sanskrit Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Trikonasana"
                    className="input-field"
                    value={newAsanaSanskrit}
                    onChange={(e) => setNewAsanaSanskrit(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Category
                  </label>
                  <select className="input-field" value={newAsanaCat} onChange={(e) => setNewAsanaCat(e.target.value)}>
                    <option value="Standing">Standing</option>
                    <option value="Inversion">Inversion</option>
                    <option value="Restorative">Restorative</option>
                    <option value="Backbend">Backbend</option>
                    <option value="Balance">Balance</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Difficulty
                  </label>
                  <select className="input-field" value={newAsanaDiff} onChange={(e) => setNewAsanaDiff(e.target.value)}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Hold (Secs)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={newAsanaHold}
                    onChange={(e) => setNewAsanaHold(e.target.value)}
                    min="15"
                    max="300"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Primary Benefit
                </label>
                <input
                  type="text"
                  placeholder="e.g. Relieves tension in hip flexors and sharpens mental presence."
                  className="input-field"
                  value={newAsanaBenefit}
                  onChange={(e) => setNewAsanaBenefit(e.target.value)}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '10px', marginTop: '6px' }}>
                <Plus size={16} />
                <span>Save to Asana Sanctuary</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Manage Workout Plans (FR9.3) */}
      {activeAdminTab === 'plans' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1.3fr) minmax(0, 1fr)', gap: '24px' }}>
          {/* List of Existing Plans */}
          <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
              <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>
                Curated Workout Plan Templates ({plansList.length})
              </h3>
              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Filter plans..."
                  className="input-field"
                  value={planSearch}
                  onChange={(e) => setPlanSearch(e.target.value)}
                  style={{ padding: '6px 10px 6px 30px', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '560px', overflowY: 'auto' }}>
              {plansList
                .filter(p => p.title.toLowerCase().includes(planSearch.toLowerCase()) || p.goalType.toLowerCase().includes(planSearch.toLowerCase()))
                .map((plan) => (
                  <div
                    key={plan.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '12px',
                      padding: '14px 16px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                        {plan.title}
                      </div>
                      <div style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                        <span className="badge-pill badge-emerald">{plan.goalType}</span>
                        <span className="badge-pill badge-violet">{plan.level}</span>
                        <span className="badge-pill badge-amber">{plan.durationDays} Days Split</span>
                      </div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '6px' }}>
                        {plan.days?.length || 0} scheduled training days • {plan.description?.slice(0, 80)}...
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeletePlan(plan.id, plan.title)}
                      style={{
                        background: 'rgba(239, 68, 68, 0.15)',
                        border: '1px solid rgba(239, 68, 68, 0.3)',
                        borderRadius: '8px',
                        width: '32px',
                        height: '32px',
                        color: '#f87171',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        cursor: 'pointer'
                      }}
                      title="Delete Workout Plan"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* Form to Add Workout Plan */}
          <div className="glass-panel" style={{ padding: '24px', height: 'fit-content' }}>
            <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '16px' }}>
              Create Curated Plan Template (FR9.3)
            </h3>

            <form onSubmit={handleCreatePlan} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Plan Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4-Day Strength & Conditioning Blitz"
                  className="input-field"
                  value={newPlanTitle}
                  onChange={(e) => setNewPlanTitle(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                  Description & Methodology
                </label>
                <textarea
                  className="input-field"
                  placeholder="Outline the training split, weekly volume, and recovery focus..."
                  value={newPlanDesc}
                  onChange={(e) => setNewPlanDesc(e.target.value)}
                  rows={3}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Primary Goal
                  </label>
                  <select className="input-field" value={newPlanGoal} onChange={(e) => setNewPlanGoal(e.target.value)}>
                    <option value="Fat Loss">Fat Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Strength">Strength</option>
                    <option value="Flexibility & Yoga">Flexibility & Yoga</option>
                    <option value="Endurance">Endurance</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Level
                  </label>
                  <select className="input-field" value={newPlanLevel} onChange={(e) => setNewPlanLevel(e.target.value)}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '6px' }}>
                    Split (Days)
                  </label>
                  <select className="input-field" value={newPlanDays} onChange={(e) => setNewPlanDays(e.target.value)}>
                    <option value={3}>3 Days / Week</option>
                    <option value={4}>4 Days / Week</option>
                    <option value={5}>5 Days / Week</option>
                    <option value={6}>6 Days / Week</option>
                  </select>
                </div>
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '10px', marginTop: '6px' }}>
                <Plus size={16} />
                <span>Publish Workout Plan Template</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Breathing Techniques CRUD (FR12.3) */}
      {activeAdminTab === 'breathing' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', alignItems: 'flex-start' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>
                  Breathing Techniques Directory ({breathingList.length})
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Curated pranayama count patterns & vagal triggers</p>
              </div>

              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Filter breathing..."
                  className="input-field"
                  value={breathSearch}
                  onChange={(e) => setBreathSearch(e.target.value)}
                  style={{ padding: '6px 10px 6px 30px', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '550px', overflowY: 'auto' }}>
              {breathingList
                .filter((b) => b.name.toLowerCase().includes(breathSearch.toLowerCase()))
                .map((breath) => (
                  <div
                    key={breath.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>{breath.name}</span>
                        {breath.sanskritName && (
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontStyle: 'italic' }}>
                            ({breath.sanskritName})
                          </span>
                        )}
                        <span className="badge-pill badge-emerald" style={{ fontSize: '0.68rem' }}>{breath.difficulty}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#38bdf8', marginTop: '2px' }}>
                        Cadence: {breath.pattern?.inhale || 4}s in / {breath.pattern?.hold1 || 0}s hold / {breath.pattern?.exhale || 4}s out / {breath.pattern?.hold2 || 0}s empty • {breath.durationMinutes || 5} mins
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteBreathing(breath.id, breath.name)}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '6px' }}
                      title="Delete technique"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* New Breathing Technique Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '4px' }}>
              Create Breathing Technique
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Add a clinical breathwork cadence to the platform catalog.
            </p>

            <form onSubmit={handleCreateBreathing} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Technique Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 4-7-8 Breathing"
                  className="input-field"
                  value={newBreathName}
                  onChange={(e) => setNewBreathName(e.target.value)}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Sanskrit / Traditional Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Nadi Shodhana"
                  className="input-field"
                  value={newBreathSanskrit}
                  onChange={(e) => setNewBreathSanskrit(e.target.value)}
                />
              </div>

              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Cadence Pattern (Seconds):
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '6px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Inhale</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newBreathInhale}
                    onChange={(e) => setNewBreathInhale(e.target.value)}
                    min="1"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hold</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newBreathHold1}
                    onChange={(e) => setNewBreathHold1(e.target.value)}
                    min="0"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Exhale</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newBreathExhale}
                    onChange={(e) => setNewBreathExhale(e.target.value)}
                    min="1"
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hold2</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newBreathHold2}
                    onChange={(e) => setNewBreathHold2(e.target.value)}
                    min="0"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Primary Tag
                  </label>
                  <select
                    className="input-field"
                    value={newBreathTag}
                    onChange={(e) => setNewBreathTag(e.target.value)}
                  >
                    <option value="quick calm">Quick Calm</option>
                    <option value="better sleep">Better Sleep</option>
                    <option value="focus">Focus</option>
                    <option value="energizing">Energizing</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Duration (Mins)
                  </label>
                  <input
                    type="number"
                    className="input-field"
                    value={newBreathMins}
                    onChange={(e) => setNewBreathMins(e.target.value)}
                    min="1"
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Execution Process
                </label>
                <textarea
                  className="input-field"
                  placeholder="Sit comfortably, keep spine upright..."
                  value={newBreathProcess}
                  onChange={(e) => setNewBreathProcess(e.target.value)}
                  rows={2}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '10px', marginTop: '4px' }}>
                <Plus size={16} />
                <span>Publish Breathing Technique</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Diet Plans CRUD (FR12.3) */}
      {activeAdminTab === 'diet' && (
        <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: '20px', alignItems: 'flex-start' }}>
          <div className="glass-panel" style={{ padding: '24px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>
                  Curated Diet Plans ({dietPlansList.length})
                </h3>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Mifflin-St Jeor target templates</p>
              </div>

              <div style={{ position: 'relative', width: '220px' }}>
                <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: '10px', top: '10px' }} />
                <input
                  type="text"
                  placeholder="Filter diet plans..."
                  className="input-field"
                  value={dietSearch}
                  onChange={(e) => setDietSearch(e.target.value)}
                  style={{ padding: '6px 10px 6px 30px', fontSize: '0.8rem' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '550px', overflowY: 'auto' }}>
              {dietPlansList
                .filter((d) => d.title.toLowerCase().includes(dietSearch.toLowerCase()))
                .map((diet) => (
                  <div
                    key={diet.id}
                    style={{
                      background: 'rgba(255, 255, 255, 0.03)',
                      border: '1px solid var(--border-glass)',
                      borderRadius: '10px',
                      padding: '12px 14px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#f8fafc' }}>{diet.title}</span>
                        <span className="badge-pill badge-amber" style={{ fontSize: '0.68rem' }}>{diet.dietaryPreference}</span>
                        <span className="badge-pill badge-violet" style={{ fontSize: '0.68rem' }}>{diet.goalType}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', color: '#cbd5e1', marginTop: '3px' }}>
                        Target: <strong style={{ color: '#fbbf24' }}>{diet.dailyCalorieTarget} kcal</strong> • P: {diet.dailyProteinTarget_g}g | Fib: {diet.dailyFiberTarget_g}g | C: {diet.dailyCarbTarget_g}g | F: {diet.dailyFatTarget_g}g
                      </div>
                    </div>

                    <button
                      onClick={() => handleDeleteDietPlan(diet.id, diet.title)}
                      style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '6px' }}
                      title="Delete diet plan"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
            </div>
          </div>

          {/* New Diet Plan Form */}
          <div className="glass-panel" style={{ padding: '24px' }}>
            <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '4px' }}>
              Create Diet Plan Template
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
              Configure macro targets calculated for metabolic profiles.
            </p>

            <form onSubmit={handleCreateDietPlan} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Diet Plan Title *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. High-Protein Muscle Fuel"
                  className="input-field"
                  value={newDietTitle}
                  onChange={(e) => setNewDietTitle(e.target.value)}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Goal Type
                  </label>
                  <select
                    className="input-field"
                    value={newDietGoal}
                    onChange={(e) => setNewDietGoal(e.target.value)}
                  >
                    <option value="Fat Loss">Fat Loss</option>
                    <option value="Muscle Gain">Muscle Gain</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="General Fitness">General Fitness</option>
                  </select>
                </div>

                <div>
                  <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                    Dietary Preference
                  </label>
                  <select
                    className="input-field"
                    value={newDietPref}
                    onChange={(e) => setNewDietPref(e.target.value)}
                  >
                    <option value="Vegetarian">Vegetarian</option>
                    <option value="Non-Vegetarian">Non-Vegetarian</option>
                    <option value="Vegan">Vegan</option>
                    <option value="Gluten-Free / Allergies">Gluten-Free / Allergies</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '6px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Daily Calories</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newDietCals}
                    onChange={(e) => setNewDietCals(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Protein (g)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newDietPro}
                    onChange={(e) => setNewDietPro(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Fiber (g)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newDietFib}
                    onChange={(e) => setNewDietFib(e.target.value)}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Carbohydrates (g)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newDietCarb}
                    onChange={(e) => setNewDietCarb(e.target.value)}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Healthy Fats (g)</label>
                  <input
                    type="number"
                    className="input-field"
                    value={newDietFat}
                    onChange={(e) => setNewDietFat(e.target.value)}
                  />
                </div>
              </div>

              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'block', marginBottom: '4px' }}>
                  Description
                </label>
                <textarea
                  className="input-field"
                  placeholder="Targeted nutrient density for steady energy..."
                  value={newDietDesc}
                  onChange={(e) => setNewDietDesc(e.target.value)}
                  rows={2}
                />
              </div>

              <button type="submit" className="btn-primary" style={{ padding: '10px', marginTop: '4px' }}>
                <Plus size={16} />
                <span>Publish Diet Plan Template</span>
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Tab: Stress Roadmaps Editor (FR12.4) */}
      {activeAdminTab === 'roadmaps' && roadmapsData && (
        <div className="glass-panel" style={{ padding: '24px' }}>
          <h3 style={{ fontSize: '1.2rem', color: '#f8fafc', marginBottom: '4px' }}>
            Stress Management Roadmap Sequence Editor (FR12.4)
          </h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '20px' }}>
            Configure and tune the sequential steps, duration, and sequence rationale for each stress category.
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {['low', 'medium', 'high'].map((catKey) => {
              const road = roadmapsData[catKey];
              if (!road) return null;
              return (
                <div
                  key={catKey}
                  style={{
                    background: 'rgba(255, 255, 255, 0.02)',
                    border: '1px solid var(--border-glass)',
                    borderRadius: '12px',
                    padding: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span className="badge-pill badge-violet" style={{ textTransform: 'uppercase' }}>
                      {catKey} Stress Chain
                    </span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      {road.steps?.length || 4} Steps
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', color: '#f8fafc', margin: 0 }}>
                    {road.title}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>
                    {road.description}
                  </p>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '6px' }}>
                    {(road.steps || []).map((step, idx) => (
                      <div
                        key={idx}
                        style={{
                          background: 'rgba(0, 0, 0, 0.3)',
                          border: '1px solid var(--border-glass)',
                          borderRadius: '8px',
                          padding: '10px'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', fontWeight: 700, color: '#38bdf8' }}>
                          <span>Step {step.stepNumber}: {step.shortLabel || step.title}</span>
                          <span>{step.durationMinutes}m</span>
                        </div>
                        <div style={{ fontSize: '0.72rem', color: '#cbd5e1', marginTop: '4px', fontStyle: 'italic' }}>
                          Why: {step.whyHere}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

