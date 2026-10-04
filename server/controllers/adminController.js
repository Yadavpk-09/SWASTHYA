// server/controllers/adminController.js
import { db } from '../config/db.js';

export const getAdminStats = async (req, res) => {
  try {
    const users = db.getCollection('users');
    const plans = db.getCollection('workoutPlans');
    const exercises = db.getCollection('exercises');
    const asanas = db.getCollection('asanas');
    const progressLogs = db.getCollection('progressLogs');

    const totalUsers = users.length;
    const activeUsers = users.filter((u) => u.status !== 'deactivated').length;
    const adminCount = users.filter((u) => u.role === 'admin').length;

    // Average streak
    const avgStreak = Number(
      (users.reduce((acc, u) => acc + (u.currentStreak || 0), 0) / (totalUsers || 1)).toFixed(1)
    );

    // Plan usage distribution
    const planUsage = {};
    users.forEach((u) => {
      const pId = u.assignedPlanId || 'plan-1';
      planUsage[pId] = (planUsage[pId] || 0) + 1;
    });

    const mostUsedPlans = Object.keys(planUsage).map((pId) => {
      const planObj = plans.find((p) => p.id === pId);
      return {
        planId: pId,
        title: planObj ? planObj.title : pId,
        userCount: planUsage[pId]
      };
    }).sort((a, b) => b.userCount - a.userCount);

    // Workouts completed count
    const totalWorkouts = progressLogs.filter((p) => p.type === 'workout').length;

    res.json({
      totalUsers,
      activeUsers,
      adminCount,
      avgStreak,
      totalExercises: exercises.length,
      totalAsanas: asanas.length,
      totalPlans: plans.length,
      totalWorkoutsLogged: totalWorkouts,
      mostUsedPlans
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch admin stats.' });
  }
};

export const getAllUsers = async (req, res) => {
  try {
    const users = db.getCollection('users');
    const plans = db.getCollection('workoutPlans');

    const sanitizedUsers = users.map((u) => {
      const assignedPlan = plans.find((p) => p.id === u.assignedPlanId);
      const { passwordHash: _, ...safeUser } = u;
      return {
        ...safeUser,
        planTitle: assignedPlan ? assignedPlan.title : 'Unassigned'
      };
    });

    res.json(sanitizedUsers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch users list.' });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = db.findById('users', userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (user.role === 'admin' && user.id === req.user.id) {
      return res.status(400).json({ error: 'Cannot deactivate your own admin account.' });
    }

    const newStatus = user.status === 'deactivated' ? 'active' : 'deactivated';
    const updated = db.updateById('users', userId, { status: newStatus });

    const { passwordHash: _, ...safeUser } = updated;
    res.json({
      message: `User account is now ${newStatus}.`,
      user: safeUser
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to toggle user status.' });
  }
};

// Exercise CRUD
export const createExercise = async (req, res) => {
  try {
    const { name, muscleGroup, equipment, difficulty, instructions, commonMistakes, targetMuscles, demoUrl } = req.body;
    if (!name || !muscleGroup) {
      return res.status(400).json({ error: 'Name and muscleGroup are required.' });
    }

    const newEx = {
      id: 'ex-' + Date.now(),
      name,
      muscleGroup,
      equipment: equipment || 'Bodyweight',
      difficulty: difficulty || 'Beginner',
      demoUrl: demoUrl || 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80',
      instructions: Array.isArray(instructions) ? instructions : [instructions || 'Perform with steady form.'],
      commonMistakes: Array.isArray(commonMistakes) ? commonMistakes : [commonMistakes || 'Avoid rushing reps.'],
      targetMuscles: Array.isArray(targetMuscles) ? targetMuscles : [targetMuscles || muscleGroup],
      caloriesBurnEstimate: 90
    };

    db.insert('exercises', newEx);
    res.status(201).json(newEx);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create exercise.' });
  }
};

export const updateExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateById('exercises', id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Exercise not found.' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update exercise.' });
  }
};

export const deleteExercise = async (req, res) => {
  try {
    const { id } = req.params;
    const success = db.deleteById('exercises', id);
    if (!success) {
      return res.status(404).json({ error: 'Exercise not found.' });
    }
    res.json({ message: 'Exercise deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete exercise.' });
  }
};

// Asana CRUD
export const createAsana = async (req, res) => {
  try {
    const { name, sanskritName, category, difficulty, instructions, benefits, precautions, imageUrl, holdDurationSeconds } = req.body;
    if (!name || !sanskritName) {
      return res.status(400).json({ error: 'Name and sanskritName are required.' });
    }

    const newAsana = {
      id: 'as-' + Date.now(),
      name,
      sanskritName,
      category: category || 'Standing',
      difficulty: difficulty || 'Beginner',
      imageUrl: imageUrl || 'https://images.unsplash.com/photo-1545205597-3d9d02c29597?auto=format&fit=crop&w=800&q=80',
      holdDurationSeconds: Number(holdDurationSeconds) || 45,
      instructions: Array.isArray(instructions) ? instructions : [instructions || 'Breathe steadily in posture.'],
      benefits: Array.isArray(benefits) ? benefits : [benefits || 'Improves balance and clarity.'],
      precautions: Array.isArray(precautions) ? precautions : [precautions || 'Listen to body limits.']
    };

    db.insert('asanas', newAsana);
    res.status(201).json(newAsana);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create asana.' });
  }
};

export const updateAsana = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateById('asanas', id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Asana not found.' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update asana.' });
  }
};

export const deleteAsana = async (req, res) => {
  try {
    const { id } = req.params;
    const success = db.deleteById('asanas', id);
    if (!success) {
      return res.status(404).json({ error: 'Asana not found.' });
    }
    res.json({ message: 'Asana deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete asana.' });
  }
};

// Plan CRUD
export const createPlan = async (req, res) => {
  try {
    const { title, description, goalType, level, durationDays, days } = req.body;
    if (!title || !goalType) {
      return res.status(400).json({ error: 'Title and goalType are required.' });
    }

    const newPlan = {
      id: 'plan-' + Date.now(),
      title,
      description: description || 'Custom structured fitness plan.',
      goalType,
      level: level || 'Beginner',
      durationDays: Number(durationDays) || 3,
      weeklyFrequency: Number(durationDays) || 3,
      days: days || [
        {
          dayNumber: 1,
          title: 'Full Body Foundational Conditioning',
          focus: 'Full Body',
          exercises: [{ exerciseId: 'ex-2', sets: 3, reps: '10', restSeconds: 60 }]
        }
      ]
    };

    db.insert('workoutPlans', newPlan);
    res.status(201).json(newPlan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create workout plan.' });
  }
};

export const updatePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateById('workoutPlans', id, req.body);
    if (!updated) {
      return res.status(404).json({ error: 'Workout plan not found.' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update workout plan.' });
  }
};

export const deletePlan = async (req, res) => {
  try {
    const { id } = req.params;
    const success = db.deleteById('workoutPlans', id);
    if (!success) {
      return res.status(404).json({ error: 'Workout plan not found.' });
    }
    res.json({ message: 'Workout plan deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete workout plan.' });
  }
};

// Breathing Techniques CRUD (PRD FR12.3)
export const getAllBreathingAdmin = async (req, res) => {
  try {
    const items = db.getCollection('breathingTechniques');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch breathing techniques.' });
  }
};

export const createBreathingAdmin = async (req, res) => {
  try {
    const { name, sanskritName, pattern, fullProcess, benefits, durationMinutes, difficulty, tags, precautions } = req.body;
    if (!name || !pattern) {
      return res.status(400).json({ error: 'Name and pattern are required.' });
    }
    const newBreath = {
      id: 'breath-' + Date.now(),
      name,
      sanskritName: sanskritName || '',
      pattern: pattern || { inhale: 4, hold1: 4, exhale: 4, hold2: 4 },
      fullProcess: fullProcess || 'Inhale and exhale in rhythm.',
      benefits: Array.isArray(benefits) ? benefits : [benefits || 'Relieves stress'],
      durationMinutes: Number(durationMinutes) || 5,
      difficulty: difficulty || 'Beginner',
      tags: Array.isArray(tags) ? tags : ['quick calm'],
      precautions: precautions || 'Stop if dizzy'
    };
    db.insert('breathingTechniques', newBreath);
    res.status(201).json(newBreath);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create breathing technique.' });
  }
};

export const updateBreathingAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateById('breathingTechniques', id, req.body);
    if (!updated) return res.status(404).json({ error: 'Technique not found.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update breathing technique.' });
  }
};

export const deleteBreathingAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const success = db.deleteById('breathingTechniques', id);
    if (!success) return res.status(404).json({ error: 'Technique not found.' });
    res.json({ message: 'Breathing technique deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete breathing technique.' });
  }
};

// Diet Plans CRUD (PRD FR12.3)
export const getAllDietPlansAdmin = async (req, res) => {
  try {
    const items = db.getCollection('dietPlans');
    res.json(items);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch diet plans.' });
  }
};

export const createDietPlanAdmin = async (req, res) => {
  try {
    const { title, goalType, dietaryPreference, dailyCalorieTarget, dailyProteinTarget_g, dailyCarbTarget_g, dailyFatTarget_g, dailyFiberTarget_g, description } = req.body;
    if (!title || !dailyCalorieTarget) {
      return res.status(400).json({ error: 'Title and calorie target are required.' });
    }
    const newDiet = {
      id: 'diet-' + Date.now(),
      title,
      goalType: goalType || 'Maintenance',
      dietaryPreference: dietaryPreference || 'Vegetarian',
      dailyCalorieTarget: Number(dailyCalorieTarget),
      dailyProteinTarget_g: Number(dailyProteinTarget_g) || 120,
      dailyCarbTarget_g: Number(dailyCarbTarget_g) || 200,
      dailyFatTarget_g: Number(dailyFatTarget_g) || 50,
      dailyFiberTarget_g: Number(dailyFiberTarget_g) || 30,
      description: description || 'Personalized nutritional roadmap.'
    };
    db.insert('dietPlans', newDiet);
    res.status(201).json(newDiet);
  } catch (err) {
    res.status(500).json({ error: 'Failed to create diet plan.' });
  }
};

export const updateDietPlanAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = db.updateById('dietPlans', id, req.body);
    if (!updated) return res.status(404).json({ error: 'Diet plan not found.' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update diet plan.' });
  }
};

export const deleteDietPlanAdmin = async (req, res) => {
  try {
    const { id } = req.params;
    const success = db.deleteById('dietPlans', id);
    if (!success) return res.status(404).json({ error: 'Diet plan not found.' });
    res.json({ message: 'Diet plan deleted successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete diet plan.' });
  }
};

// Roadmaps CRUD (PRD FR12.4)
export const getAllRoadmapsAdmin = async (req, res) => {
  try {
    const roadmaps = db.getCollection('stressRoadmaps');
    res.json(roadmaps);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch roadmaps.' });
  }
};

export const updateRoadmapStepAdmin = async (req, res) => {
  try {
    const { category, stepIndex } = req.params;
    const stepData = req.body;
    const roadmaps = db.getCollection('stressRoadmaps');
    if (!roadmaps[category]) {
      return res.status(404).json({ error: 'Roadmap category not found.' });
    }
    const idx = parseInt(stepIndex);
    if (isNaN(idx) || idx < 0 || idx >= roadmaps[category].steps.length) {
      return res.status(400).json({ error: 'Invalid step index.' });
    }
    roadmaps[category].steps[idx] = { ...roadmaps[category].steps[idx], ...stepData };
    res.json(roadmaps[category]);
  } catch (err) {
    res.status(500).json({ error: 'Failed to update roadmap step.' });
  }
};

