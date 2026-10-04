// client/src/components/wellness/DietLog.jsx
import React, { useState, useEffect } from 'react';
import { Utensils, Search, Plus, Trash2, Flame, Apple, Sparkles } from 'lucide-react';
import { api } from '../../services/api.js';
import { useToast } from '../../context/ToastContext.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export const DietLog = ({ todayLog, onRefresh }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  // Manual entry
  const [customName, setCustomName] = useState('');
  const [customCalories, setCustomCalories] = useState('');
  const [mealType, setMealType] = useState('Breakfast');
  const [loading, setLoading] = useState(false);

  const { showToast } = useToast();
  const { updateUserState } = useAuth();

  const meals = todayLog?.meals || [];
  const totalCalories = meals.reduce((acc, m) => acc + (m.calories || 0), 0);

  // Live Food Search
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.wellness.searchFood(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleLogMeal = async (name, calories, type) => {
    setLoading(true);
    try {
      const res = await api.wellness.logMeal({
        name,
        calories: Number(calories),
        mealType: type || mealType
      });

      if (res.user) updateUserState(res.user);
      if (res.addedPoints > 0) {
        showToast({
          type: 'points',
          title: 'Meal Logged!',
          message: `Logged ${name} (${calories} kcal). +${res.addedPoints} Points!`,
          points: res.addedPoints
        });
      }

      setCustomName('');
      setCustomCalories('');
      setSearchQuery('');
      setSearchResults([]);
      onRefresh();
    } catch (err) {
      showToast({ type: 'error', title: 'Error logging meal', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await api.wellness.deleteMeal(mealId);
      onRefresh();
      showToast({ type: 'info', title: 'Meal Removed', message: 'Meal entry was deleted.' });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="glass-panel" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px' }}>
      {/* Title & Calorie Summary */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Utensils size={22} color="#f59e0b" />
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: '#f8fafc' }}>Diet & Nutrition Log</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Estimated Calorie Balance</p>
          </div>
        </div>

        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid var(--border-glass)',
          borderRadius: '12px',
          padding: '8px 16px',
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Flame size={18} color="#f59e0b" />
          <div>
            <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#fcd34d' }}>{totalCalories}</span>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '4px' }}>kcal logged</span>
          </div>
        </div>
      </div>

      {/* Food Search Bar */}
      <div style={{ position: 'relative' }}>
        <div style={{ display: 'flex', alignItems: 'center', position: 'relative' }}>
          <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '14px' }} />
          <input
            type="text"
            className="input-field"
            placeholder="Search healthy food items (e.g. Oatmeal, Paneer, Chicken, Eggs, Dal...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{ paddingLeft: '40px' }}
          />
        </div>

        {/* Live Search Results Dropdown */}
        {searchResults.length > 0 && (
          <div style={{
            position: 'absolute',
            top: '110%',
            left: 0,
            right: 0,
            background: '#131c31',
            border: '1px solid var(--border-glass-bright)',
            borderRadius: '12px',
            boxShadow: '0 12px 30px rgba(0, 0, 0, 0.6)',
            padding: '8px',
            zIndex: 30,
            maxHeight: '220px',
            overflowY: 'auto'
          }}>
            {searchResults.map((food) => (
              <div
                key={food.id}
                onClick={() => handleLogMeal(food.name, food.calories, mealType)}
                style={{
                  padding: '8px 12px',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  cursor: 'pointer',
                  background: 'rgba(255, 255, 255, 0.02)',
                  marginBottom: '4px',
                  transition: 'background 0.2s'
                }}
                className="hover-bg"
              >
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: '#f8fafc' }}>{food.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                    {food.serving} • P: {food.protein}g | C: {food.carbs}g | F: {food.fat}g
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#fbbf24' }}>
                    {food.calories} kcal
                  </span>
                  <Plus size={16} color="var(--emerald-primary)" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Manual Quick Add Inputs */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.02)',
        border: '1px solid var(--border-glass)',
        borderRadius: '12px',
        padding: '14px',
        display: 'flex',
        flexDirection: 'column',
        gap: '10px'
      }}>
        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
          Or Add Custom Food
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr 1fr auto', gap: '8px', alignItems: 'center' }}>
          <input
            type="text"
            className="input-field"
            placeholder="Food name (e.g. 2 Rotis)"
            value={customName}
            onChange={(e) => setCustomName(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          />

          <input
            type="number"
            className="input-field"
            placeholder="Calories (kcal)"
            value={customCalories}
            onChange={(e) => setCustomCalories(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          />

          <select
            className="input-field"
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            style={{ padding: '8px 12px', fontSize: '0.85rem' }}
          >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Dinner">Dinner</option>
            <option value="Snack">Snack</option>
          </select>

          <button
            onClick={() => {
              if (customName && customCalories) {
                handleLogMeal(customName, customCalories, mealType);
              }
            }}
            disabled={loading || !customName || !customCalories}
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.85rem', whiteSpace: 'nowrap' }}
          >
            <Plus size={16} />
            <span>Add Meal</span>
          </button>
        </div>
      </div>

      {/* Meals Logged List */}
      <div>
        <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '8px' }}>
          Logged Meals Today ({meals.length})
        </div>

        {meals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No meals logged yet today. Use the search bar above to log your nutrition!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {meals.map((meal) => (
              <div
                key={meal.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.03)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge-pill badge-amber" style={{ fontSize: '0.7rem' }}>{meal.mealType}</span>
                    <span style={{ fontWeight: 600, fontSize: '0.9rem', color: '#f8fafc' }}>{meal.name}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '2px' }}>
                    Logged at {meal.time || 'Today'}
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#fbbf24' }}>
                    {meal.calories} kcal
                  </span>
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: '#64748b',
                      cursor: 'pointer',
                      padding: '4px'
                    }}
                    title="Remove meal"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
