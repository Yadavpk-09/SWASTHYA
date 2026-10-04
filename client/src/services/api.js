// client/src/services/api.js

const API_BASE = '/api';

export function getAuthToken() {
  return localStorage.getItem('swasthya_token');
}

export function setAuthToken(token) {
  if (token) {
    localStorage.setItem('swasthya_token', token);
  } else {
    localStorage.removeItem('swasthya_token');
  }
}

async function request(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers
  };

  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || `Request failed with status ${res.status}`);
    }
    return data;
  } catch (err) {
    console.error(`API Error on ${endpoint}:`, err);
    throw err;
  }
}

export const api = {
  // Auth (User & Admin separate surfaces - Module 1)
  auth: {
    login: (credentials) => request('/auth/login', { method: 'POST', body: JSON.stringify(credentials) }),
    register: (details) => request('/auth/register', { method: 'POST', body: JSON.stringify(details) }),
    demoLogin: (persona) => request('/auth/demo-login', { method: 'POST', body: JSON.stringify({ persona }) }),
    googleLogin: (details) => request('/auth/google', { method: 'POST', body: JSON.stringify(details) }),
    getMe: () => request('/auth/me'),
    updateProfile: (profileData) => request('/auth/profile', { method: 'PUT', body: JSON.stringify(profileData) }),
    // Dedicated Admin Auth
    adminLogin: (credentials) => request('/auth/admin/login', { method: 'POST', body: JSON.stringify(credentials) }),
    adminRegister: (details) => request('/auth/admin/register', { method: 'POST', body: JSON.stringify(details) }),
    adminGoogleLogin: (details) => request('/auth/admin/google', { method: 'POST', body: JSON.stringify(details) }),
    // Password Recovery
    forgotPassword: (email) => request('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),
    resetPassword: (payload) => request('/auth/reset-password', { method: 'POST', body: JSON.stringify(payload) })
  },

  // Assessment & Requirement Assessment (Module 2 & 3)
  assessment: {
    submit: (data) => request('/assessment', { method: 'POST', body: JSON.stringify(data) }),
    getCurrent: () => request('/assessment/current'),
    retake: (data) => request('/assessment/retake', { method: 'POST', body: JSON.stringify(data) })
  },

  // Plans (Module 3)
  plans: {
    getAll: () => request('/plans'),
    getById: (id) => request(`/plans/${id}`),
    getRecommendation: () => request('/plans/recommendation'),
    assign: (planId) => request('/plans/assign', { method: 'POST', body: JSON.stringify({ planId }) }),
    completeWorkout: (data) => request('/plans/complete', { method: 'POST', body: JSON.stringify(data) })
  },

  // Exercises (Module 4)
  exercises: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/exercises${query ? '?' + query : ''}`);
    },
    getById: (id) => request(`/exercises/${id}`)
  },

  // Asanas & Yoga (Module 5)
  asanas: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/asanas${query ? '?' + query : ''}`);
    },
    getById: (id) => request(`/asanas/${id}`),
    getStressRoadmap: (level = 'medium') => request(`/asanas/stress-roadmap?level=${level}`),
    completeBreathing: (data) => request('/asanas/breathing/complete', { method: 'POST', body: JSON.stringify(data) }),
    getMeditations: () => request('/asanas/meditations'),
    completeMeditation: (data) => request('/asanas/meditations/complete', { method: 'POST', body: JSON.stringify(data) })
  },

  // Breathing Techniques Library (Module 6)
  breathing: {
    getAll: (params = {}) => {
      const query = new URLSearchParams(params).toString();
      return request(`/breathing${query ? '?' + query : ''}`);
    },
    getById: (id) => request(`/breathing/${id}`),
    complete: (data) => request('/breathing/complete', { method: 'POST', body: JSON.stringify(data) })
  },

  // Stress Management Roadmap (Module 7)
  roadmap: {
    getByCategory: (category = 'medium') => request(`/roadmap/${category}`),
    completeStep: (data) => request('/roadmap/step/complete', { method: 'POST', body: JSON.stringify(data) })
  },

  // Smart Calorie & Nutrition Tracker (Module 10)
  nutrition: {
    getToday: () => request('/nutrition/today'),
    logMeal: (data) => request('/nutrition/meal', { method: 'POST', body: JSON.stringify(data) }),
    deleteMeal: (mealId) => request(`/nutrition/meal/${mealId}`, { method: 'DELETE' }),
    search: (q) => request(`/nutrition/search?q=${encodeURIComponent(q || '')}`),
    getHistory: () => request('/nutrition/history')
  },

  // Wellness (Water & Sleep - Module 11)
  wellness: {
    getToday: () => request('/wellness/today'),
    logWater: (amount_ml, goal_ml, reset = false) => request('/wellness/water', {
      method: 'POST',
      body: JSON.stringify({ amount_ml, goal_ml, reset })
    }),
    logSleep: (data) => request('/wellness/sleep', { method: 'POST', body: JSON.stringify(data) }),
    logMeal: (data) => request('/wellness/meal', { method: 'POST', body: JSON.stringify(data) }),
    deleteMeal: (mealId) => request(`/wellness/meal/${mealId}`, { method: 'DELETE' }),
    searchFood: (query) => request(`/wellness/food-search?query=${encodeURIComponent(query || '')}`)
  },

  // Progress & Weekly Tracking (Module 8)
  progress: {
    getLogs: (type) => request(`/progress/logs${type ? '?type=' + type : ''}`),
    addLog: (data) => request('/progress/logs', { method: 'POST', body: JSON.stringify(data) }),
    getAnalytics: () => request('/progress/analytics'),
    getWeekly: () => request('/progress/weekly'),
    logWeeklyWeighin: (data) => request('/progress/weekly-weighin', { method: 'POST', body: JSON.stringify(data) })
  },

  // Gamification (Module 9)
  gamification: {
    getLeaderboard: () => request('/gamification/leaderboard'),
    getBadges: () => request('/gamification/badges')
  },

  // Admin Panel (Module 12)
  admin: {
    getStats: () => request('/admin/stats'),
    getUsers: () => request('/admin/users'),
    toggleUserStatus: (userId) => request(`/admin/users/${userId}/status`, { method: 'PATCH' }),
    // Exercises
    createExercise: (data) => request('/admin/exercises', { method: 'POST', body: JSON.stringify(data) }),
    updateExercise: (id, data) => request(`/admin/exercises/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteExercise: (id) => request(`/admin/exercises/${id}`, { method: 'DELETE' }),
    // Asanas
    createAsana: (data) => request('/admin/asanas', { method: 'POST', body: JSON.stringify(data) }),
    updateAsana: (id, data) => request(`/admin/asanas/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteAsana: (id) => request(`/admin/asanas/${id}`, { method: 'DELETE' }),
    // Workout Plans
    createPlan: (data) => request('/admin/plans', { method: 'POST', body: JSON.stringify(data) }),
    updatePlan: (id, data) => request(`/admin/plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deletePlan: (id) => request(`/admin/plans/${id}`, { method: 'DELETE' }),
    // Breathing Techniques
    getAllBreathing: () => request('/admin/breathing'),
    createBreathing: (data) => request('/admin/breathing', { method: 'POST', body: JSON.stringify(data) }),
    updateBreathing: (id, data) => request(`/admin/breathing/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteBreathing: (id) => request(`/admin/breathing/${id}`, { method: 'DELETE' }),
    // Diet Plans
    getAllDietPlans: () => request('/admin/diet-plans'),
    createDietPlan: (data) => request('/admin/diet-plans', { method: 'POST', body: JSON.stringify(data) }),
    updateDietPlan: (id, data) => request(`/admin/diet-plans/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteDietPlan: (id) => request(`/admin/diet-plans/${id}`, { method: 'DELETE' }),
    // Roadmaps
    getAllRoadmaps: () => request('/admin/roadmaps'),
    updateRoadmapStep: (category, stepIndex, data) => request(`/admin/roadmaps/${category}/step/${stepIndex}`, { method: 'PUT', body: JSON.stringify(data) })
  },

  // Chatbot (Module 13)
  chat: {
    ask: (message) => request('/chat/ask', { method: 'POST', body: JSON.stringify({ message }) })
  }
};

