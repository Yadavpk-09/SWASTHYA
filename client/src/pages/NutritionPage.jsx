// client/src/pages/NutritionPage.jsx
import React, { useState, useEffect } from 'react';
import { api } from '../services/api.js';
import { useToast } from '../context/ToastContext.jsx';
import { useAuth } from '../context/AuthContext.jsx';
import {
  Utensils,
  Search,
  Plus,
  Trash2,
  Flame,
  Sparkles,
  PieChart,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Clock,
  Apple
} from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid } from 'recharts';

export const NutritionPage = () => {
  const [nutritionData, setNutritionData] = useState(null);
  const [historyData, setHistoryData] = useState([]);
  const [loading, setLoading] = useState(true);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedFood, setSelectedFood] = useState(null);
  const [servings, setServings] = useState(1);
  const [mealType, setMealType] = useState('Lunch');

  const { showToast } = useToast();
  const { updateUserState } = useAuth();

  const fetchTodayNutrition = async () => {
    try {
      const [todayRes, historyRes] = await Promise.all([
        api.nutrition.getToday(),
        api.nutrition.getHistory()
      ]);
      setNutritionData(todayRes);
      setHistoryData(historyRes);
    } catch (err) {
      console.error('Failed to load nutrition data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodayNutrition();
  }, []);

  // Search Food DB
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await api.nutrition.search(searchQuery);
        setSearchResults(results);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 200);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const handleAddMeal = async (foodItem, numServings = 1) => {
    try {
      const res = await api.nutrition.logMeal({
        foodId: foodItem?.id,
        customName: foodItem?.name,
        servings: numServings,
        mealType
      });

      if (res.user) updateUserState(res.user);

      showToast({
        type: 'points',
        title: 'Nutrient Logged!',
        message: `${res.message} (+${res.addedPoints} Points)`,
        points: res.addedPoints
      });

      setSearchQuery('');
      setSearchResults([]);
      setSelectedFood(null);
      setServings(1);
      fetchTodayNutrition();
    } catch (err) {
      showToast({ type: 'error', title: 'Logging Failed', message: err.message });
    }
  };

  const handleDeleteMeal = async (mealId) => {
    try {
      await api.nutrition.deleteMeal(mealId);
      showToast({ type: 'info', title: 'Meal Removed', message: 'The entry was deleted.' });
      fetchTodayNutrition();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
        Calculating metabolic targets...
      </div>
    );
  }

  const consumed = nutritionData?.consumed || { calories: 0, protein_g: 0, fiber_g: 0, carbs_g: 0, fat_g: 0 };
  const targets = nutritionData?.targets || { calories: 2000, protein_g: 130, fiber_g: 32, carbs_g: 240, fat_g: 55 };
  const remaining = nutritionData?.remaining || { calories: 0, protein_g: 0, fiber_g: 0, carbs_g: 0, fat_g: 0 };
  const meals = nutritionData?.meals || [];

  const calPercent = Math.min(100, Math.round((consumed.calories / (targets.calories || 1)) * 100));
  const proPercent = Math.min(100, Math.round((consumed.protein_g / (targets.protein_g || 1)) * 100));
  const fibPercent = Math.min(100, Math.round((consumed.fiber_g / (targets.fiber_g || 1)) * 100));
  const carbPercent = Math.min(100, Math.round((consumed.carbs_g / (targets.carbs_g || 1)) * 100));
  const fatPercent = Math.min(100, Math.round((consumed.fat_g / (targets.fat_g || 1)) * 100));

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '26px' }}>
      {/* Header */}
      <div>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#fbbf24', marginBottom: '8px' }}>
          <Utensils size={20} />
          <span style={{ fontWeight: 700, fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Bio-Energetic Nutrition Telemetry (Module 10)
          </span>
        </div>
        <h1 style={{ fontSize: '2.2rem', marginBottom: '8px', color: '#f8fafc' }}>
          Smart Calorie & Nutrition Tracker
        </h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
          Real-time macro accounting matched to your personalized Swasthya Diet Plan ({nutritionData?.dietPlanTitle}).
        </p>
      </div>

      {/* EXPLICIT REMAINING TARGETS BANNER (PRD FR10.3) */}
      <div className="glass-panel" style={{
        padding: '20px 24px',
        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.15) 0%, rgba(16, 185, 129, 0.1) 100%)',
        border: '1px solid rgba(245, 158, 11, 0.35)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '16px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '14px',
            background: 'rgba(245, 158, 11, 0.2)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fbbf24'
          }}>
            <Sparkles size={26} />
          </div>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', color: '#fbbf24', letterSpacing: '0.05em' }}>
              Remaining Daily Dietary Target (FR10.3)
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 700, color: '#f8fafc', marginTop: '2px' }}>
              {nutritionData?.summaryText || `You need ${remaining.protein_g}g more protein and ${remaining.fiber_g}g more fiber today.`}
            </div>
            <div style={{ fontSize: '0.8rem', color: '#cbd5e1', marginTop: '3px' }}>
              Calories Remaining: <strong style={{ color: '#38bdf8' }}>{remaining.calories} kcal</strong> •
              Carbs: <strong>{remaining.carbs_g}g</strong> • Fat: <strong>{remaining.fat_g}g</strong>
            </div>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {(nutritionData?.guidanceStatements || []).slice(0, 2).map((stmt, i) => (
            <div key={i} style={{
              background: 'rgba(0, 0, 0, 0.3)',
              padding: '6px 12px',
              borderRadius: '8px',
              fontSize: '0.75rem',
              color: '#f8fafc',
              border: '1px solid rgba(255, 255, 255, 0.08)'
            }}>
              {stmt}
            </div>
          ))}
        </div>
      </div>

      {/* Macro Tracking Gauges Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 150px), 1fr))', gap: '14px' }}>
        {/* Calories */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 700 }}>ENERGY</span>
            <span>{calPercent}%</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fbbf24', marginTop: '4px' }}>
            {consumed.calories} <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {targets.calories} kcal</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${calPercent}%`, height: '100%', background: '#fbbf24', borderRadius: '3px' }} />
          </div>
          <div style={{ fontSize: '0.7rem', color: '#f8fafc', marginTop: '6px' }}>
            {remaining.calories > 0 ? `${remaining.calories} kcal left` : 'Target achieved!'}
          </div>
        </div>

        {/* Protein */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 700 }}>PROTEIN</span>
            <span>{proPercent}%</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginTop: '4px' }}>
            {consumed.protein_g}g <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {targets.protein_g}g</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${proPercent}%`, height: '100%', background: '#38bdf8', borderRadius: '3px' }} />
          </div>
          <div style={{ fontSize: '0.7rem', color: '#f8fafc', marginTop: '6px' }}>
            {remaining.protein_g > 0 ? `${remaining.protein_g}g needed` : 'Goal crushed!'}
          </div>
        </div>

        {/* Fiber */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 700 }}>FIBER</span>
            <span>{fibPercent}%</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399', marginTop: '4px' }}>
            {consumed.fiber_g}g <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {targets.fiber_g}g</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${fibPercent}%`, height: '100%', background: '#34d399', borderRadius: '3px' }} />
          </div>
          <div style={{ fontSize: '0.7rem', color: '#f8fafc', marginTop: '6px' }}>
            {remaining.fiber_g > 0 ? `${remaining.fiber_g}g needed` : 'Optimum digestion!'}
          </div>
        </div>

        {/* Carbs */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 700 }}>CARBOHYDRATES</span>
            <span>{carbPercent}%</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#fcd34d', marginTop: '4px' }}>
            {consumed.carbs_g}g <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {targets.carbs_g}g</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${carbPercent}%`, height: '100%', background: '#fcd34d', borderRadius: '3px' }} />
          </div>
          <div style={{ fontSize: '0.7rem', color: '#f8fafc', marginTop: '6px' }}>
            {remaining.carbs_g}g remaining
          </div>
        </div>

        {/* Fats */}
        <div className="glass-panel" style={{ padding: '16px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
            <span style={{ fontWeight: 700 }}>HEALTHY FATS</span>
            <span>{fatPercent}%</span>
          </div>
          <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f472b6', marginTop: '4px' }}>
            {consumed.fat_g}g <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/ {targets.fat_g}g</span>
          </div>
          <div style={{ width: '100%', height: '6px', background: 'rgba(255, 255, 255, 0.08)', borderRadius: '3px', marginTop: '8px', overflow: 'hidden' }}>
            <div style={{ width: `${fatPercent}%`, height: '100%', background: '#f472b6', borderRadius: '3px' }} />
          </div>
          <div style={{ fontSize: '0.7rem', color: '#f8fafc', marginTop: '6px' }}>
            {remaining.fat_g}g remaining
          </div>
        </div>
      </div>

      {/* Smart Food Search & Auto Macro Logger (FR10.1 & FR10.2) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '4px' }}>
          Instant Food Macro Search (FR10.1 & FR10.2)
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '16px' }}>
          Search any seeded food item. System automatically calculates calories, protein, carbs, fat, and fiber with zero manual typing.
        </p>

        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '14px' }}>
          <div style={{ flex: 1, minWidth: '260px', position: 'relative' }}>
            <Search size={18} color="var(--text-muted)" style={{ position: 'absolute', left: '12px', top: '12px' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search e.g. Paneer Bhurji, Oats, Moong Dal, Chicken, Eggs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '38px' }}
            />

            {/* Results Dropdown */}
            {searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '105%',
                left: 0,
                right: 0,
                background: '#0f172a',
                border: '1px solid var(--border-glass-bright)',
                borderRadius: '12px',
                padding: '8px',
                maxHeight: '260px',
                overflowY: 'auto',
                zIndex: 30,
                boxShadow: '0 12px 30px rgba(0, 0, 0, 0.7)'
              }}>
                {searchResults.map((item) => (
                  <div
                    key={item.id}
                    onClick={() => {
                      setSelectedFood(item);
                      setSearchQuery(item.name);
                      setSearchResults([]);
                    }}
                    style={{
                      padding: '10px 12px',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      cursor: 'pointer',
                      background: selectedFood?.id === item.id ? 'rgba(16, 185, 129, 0.2)' : 'rgba(255, 255, 255, 0.02)',
                      marginBottom: '4px'
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.88rem', color: '#f8fafc' }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {item.serving} • P: {item.protein}g | Fib: {item.fiber || 0}g | C: {item.carbs}g | F: {item.fat}g
                      </div>
                    </div>
                    <span style={{ fontWeight: 700, color: '#fbbf24', fontSize: '0.9rem' }}>
                      {item.calories} kcal
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div style={{ width: '130px' }}>
            <select
              className="input-field"
              value={mealType}
              onChange={(e) => setMealType(e.target.value)}
            >
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
              <option value="Snack">Snack</option>
            </select>
          </div>

          <div style={{ width: '110px' }}>
            <select
              className="input-field"
              value={servings}
              onChange={(e) => setServings(Number(e.target.value))}
            >
              <option value={0.5}>0.5 Serving</option>
              <option value={1}>1 Serving</option>
              <option value={1.5}>1.5 Servings</option>
              <option value={2}>2 Servings</option>
              <option value={3}>3 Servings</option>
            </select>
          </div>

          <button
            onClick={() => {
              if (selectedFood || searchQuery) {
                handleAddMeal(selectedFood || { name: searchQuery, calories: 250, protein: 12, carbs: 30, fat: 8, fiber: 3 }, servings);
              }
            }}
            disabled={!searchQuery && !selectedFood}
            className="btn-primary"
            style={{ padding: '10px 20px', whiteSpace: 'nowrap' }}
          >
            <Plus size={16} />
            <span>Add Meal</span>
          </button>
        </div>

        {/* Selected food auto-computed preview */}
        {selectedFood && (
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.3)',
            borderRadius: '10px',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '8px'
          }}>
            <div>
              <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--emerald-primary)' }}>AUTO-CALCULATED PROFILE ({servings}x):</span>
              <div style={{ fontSize: '0.9rem', color: '#f8fafc', fontWeight: 600 }}>
                {Math.round(selectedFood.calories * servings)} kcal • Protein: {Math.round(selectedFood.protein * servings)}g •
                Fiber: {Math.round((selectedFood.fiber || 3) * servings)}g • Carbs: {Math.round(selectedFood.carbs * servings)}g •
                Fat: {Math.round(selectedFood.fat * servings)}g
              </div>
            </div>
            <span className="badge-pill badge-emerald">Ready to Log</span>
          </div>
        )}
      </div>

      {/* Logged Meals Today List */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '14px' }}>
          Today's Logged Meals ({meals.length})
        </h3>

        {meals.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '24px', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            No meals logged yet today. Use the instant search above to log your nutrition!
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {meals.map((meal) => (
              <div
                key={meal.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.02)',
                  border: '1px solid var(--border-glass)',
                  borderRadius: '12px',
                  padding: '12px 16px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="badge-pill badge-amber" style={{ fontSize: '0.7rem' }}>{meal.mealType}</span>
                    <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>{meal.name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>({meal.servings || 1} serving)</span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '4px', display: 'flex', gap: '10px' }}>
                    <span style={{ color: '#38bdf8' }}>P: {meal.protein_g}g</span>
                    <span style={{ color: '#34d399' }}>Fib: {meal.fiber_g}g</span>
                    <span style={{ color: '#fcd34d' }}>C: {meal.carbs_g}g</span>
                    <span style={{ color: '#f472b6' }}>F: {meal.fat_g}g</span>
                    <span style={{ color: 'var(--text-muted)' }}>• {meal.time}</span>
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>
                    {meal.calories} kcal
                  </span>
                  <button
                    onClick={() => handleDeleteMeal(meal.id)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '4px' }}
                    title="Remove meal"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 7-Day Nutrition History View (FR10.4) */}
      <div className="glass-panel" style={{ padding: '24px' }}>
        <h3 style={{ fontSize: '1.15rem', color: '#f8fafc', marginBottom: '6px' }}>
          7-Day Caloric & Protein History (FR10.4)
        </h3>
        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', marginBottom: '18px' }}>
          Weekly rolling intake trends compared against your personalized dietary target.
        </p>

        {historyData.length > 0 ? (
          <div style={{ height: '220px', width: '100%' }}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={historyData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255, 255, 255, 0.05)" />
                <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={11} />
                <YAxis stroke="var(--text-muted)" fontSize={11} />
                <Tooltip
                  contentStyle={{
                    background: '#0f172a',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '8px'
                  }}
                />
                <Bar dataKey="calories" fill="#fbbf24" radius={[4, 4, 0, 0]} name="Calories (kcal)" />
                <Bar dataKey="protein_g" fill="#38bdf8" radius={[4, 4, 0, 0]} name="Protein (g)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            Daily logs will compile into historical charts here.
          </div>
        )}
      </div>
    </div>
  );
};
