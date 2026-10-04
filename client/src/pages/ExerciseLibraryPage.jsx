// client/src/pages/ExerciseLibraryPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { Search, Library, Filter, ChevronRight, Dumbbell, AlertTriangle } from 'lucide-react';
import { ExerciseDetailModal } from '../components/exercises/ExerciseDetailModal.jsx';

export const ExerciseLibraryPage = () => {
  const [exercises, setExercises] = useState([]);
  const [search, setSearch] = useState('');
  const [selectedMuscle, setSelectedMuscle] = useState('All');
  const [selectedEquipment, setSelectedEquipment] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [activeModalExercise, setActiveModalExercise] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchExercises = async () => {
    try {
      const data = await api.exercises.getAll({
        muscle: selectedMuscle,
        equipment: selectedEquipment,
        difficulty: selectedDifficulty,
        search
      });
      setExercises(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExercises();
  }, [selectedMuscle, selectedEquipment, selectedDifficulty, search]);

  const muscleGroups = ['All', 'Chest', 'Back', 'Legs', 'Shoulders', 'Core', 'Arms', 'Full Body'];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: 'var(--emerald-primary)', marginBottom: '8px' }}>
          <Library size={20} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Verified Movement Biomechanics
          </span>
        </div>
        <h1 style={{ fontSize: '2rem', marginBottom: '8px' }}>Exercise Library</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Accredited kinematic form instructions, muscle engagement breakdowns, and common error corrections to eliminate injury risk.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-panel" style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Search */}
        <div style={{ position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px', top: '14px' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search exercises by name, primary muscle, or cues..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{ paddingLeft: '42px' }}
          />
        </div>

        {/* Filter Pills */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-muted)' }}>Muscle:</span>
          {muscleGroups.map((m) => (
            <button
              key={m}
              onClick={() => setSelectedMuscle(m)}
              style={{
                padding: '6px 12px',
                borderRadius: '999px',
                border: selectedMuscle === m ? '1px solid var(--emerald-primary)' : '1px solid var(--border-glass)',
                background: selectedMuscle === m ? 'rgba(16, 185, 129, 0.18)' : 'rgba(255, 255, 255, 0.03)',
                color: selectedMuscle === m ? '#34d399' : 'var(--text-secondary)',
                fontSize: '0.8rem',
                fontWeight: 600,
                cursor: 'pointer'
              }}
            >
              {m}
            </button>
          ))}
        </div>

        {/* Equipment & Difficulty Dropdowns */}
        <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Equipment:</span>
            <select
              className="input-field"
              value={selectedEquipment}
              onChange={(e) => setSelectedEquipment(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto' }}
            >
              <option value="All">All Equipment</option>
              <option value="Bodyweight">Bodyweight</option>
              <option value="Dumbbell">Dumbbell</option>
              <option value="Barbell">Barbell</option>
              <option value="Machine">Machine</option>
            </select>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Difficulty:</span>
            <select
              className="input-field"
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              style={{ padding: '6px 12px', fontSize: '0.8rem', width: 'auto' }}
            >
              <option value="All">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>
        </div>
      </div>

      {/* Exercises Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
        {exercises.map((exercise) => (
          <div
            key={exercise.id}
            onClick={() => setActiveModalExercise(exercise)}
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
            <div style={{ height: '170px', position: 'relative', overflow: 'hidden' }}>
              <img
                src={exercise.demoUrl}
                alt={exercise.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                top: '10px',
                left: '10px',
                display: 'flex',
                gap: '6px'
              }}>
                <span className="badge-pill badge-emerald">{exercise.muscleGroup}</span>
                <span className="badge-pill badge-violet">{exercise.difficulty}</span>
              </div>
            </div>

            {/* Content */}
            <div style={{ padding: '18px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flex: 1 }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '6px' }}>
                  {exercise.name}
                </h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  Equipment: <strong style={{ color: '#cbd5e1' }}>{exercise.equipment}</strong>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '14px' }}>
                  {(exercise.targetMuscles || []).slice(0, 3).map((m, idx) => (
                    <span
                      key={idx}
                      style={{
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid var(--border-glass)',
                        padding: '2px 7px',
                        borderRadius: '6px',
                        fontSize: '0.725rem',
                        color: '#94a3b8'
                      }}
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid var(--border-glass)', paddingTop: '12px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--emerald-primary)', fontWeight: 600 }}>
                  View Step-by-Step Form
                </span>
                <ChevronRight size={16} color="var(--emerald-primary)" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Exercise Modal */}
      {activeModalExercise && (
        <ExerciseDetailModal
          exercise={activeModalExercise}
          onClose={() => setActiveModalExercise(null)}
        />
      )}
    </div>
  );
};
