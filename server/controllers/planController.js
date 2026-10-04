// server/controllers/planController.js
import { db } from '../config/db.js';
import { recommendWorkoutPlan } from '../services/planEngine.js';
import { awardPointsAndEvaluateBadges } from '../services/pointsEngine.js';

export const getAllPlans = async (req, res) => {
  try {
    const plans = db.getCollection('workoutPlans');
    res.json(plans);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve workout plans.' });
  }
};

export const getPlanById = async (req, res) => {
  try {
    const { id } = req.params;
    const plan = db.findById('workoutPlans', id);
    if (!plan) {
      return res.status(404).json({ error: 'Workout plan not found.' });
    }

    // Populate exercises
    const allExercises = db.getCollection('exercises');
    const populatedDays = (plan.days || []).map((day) => {
      const populatedExercises = (day.exercises || []).map((exRef) => {
        const fullEx = allExercises.find((e) => e.id === exRef.exerciseId);
        return {
          ...exRef,
          exercise: fullEx || { name: 'Custom Exercise', muscleGroup: 'General', difficulty: 'Beginner' }
        };
      });
      return {
        ...day,
        exercises: populatedExercises
      };
    });

    res.json({
      ...plan,
      days: populatedDays
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve workout plan.' });
  }
};

export const getRecommendation = async (req, res) => {
  try {
    const user = req.user;
    const plan = recommendWorkoutPlan({
      goal: user.profile?.goal,
      activityLevel: user.profile?.activityLevel,
      availableDays: user.profile?.availableDays
    });
    res.json(plan);
  } catch (err) {
    res.status(500).json({ error: 'Failed to get recommendation.' });
  }
};

export const assignPlan = async (req, res) => {
  try {
    const { planId } = req.body;
    const plan = db.findById('workoutPlans', planId);
    if (!plan) {
      return res.status(404).json({ error: 'Target workout plan does not exist.' });
    }

    const updatedUser = db.updateById('users', req.user.id, {
      assignedPlanId: planId
    });

    const { passwordHash: _, ...safeUser } = updatedUser;
    res.json({ user: safeUser, plan });
  } catch (err) {
    res.status(500).json({ error: 'Failed to assign plan.' });
  }
};

export const completeWorkout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dayNumber, durationMinutes = 40, exercisesCompleted = 4, notes } = req.body;

    const user = db.findById('users', userId);
    const plan = db.findById('workoutPlans', user.assignedPlanId || 'plan-1');

    const dayInfo = plan?.days?.find((d) => d.dayNumber === Number(dayNumber));
    const dayTitle = dayInfo?.title || `Day ${dayNumber} Workout`;

    // Estimate calories burned (avg ~7-8 kcal/min for circuit/lifting)
    const caloriesBurned = Math.round(durationMinutes * 7.5);

    const logEntry = {
      id: 'prog-' + Date.now(),
      userId,
      date: new Date().toISOString().split('T')[0],
      type: 'workout',
      details: `Completed: ${dayTitle} (${plan?.title || 'Personal Routine'})`,
      durationMinutes: Number(durationMinutes),
      calories: caloriesBurned,
      value: `${exercisesCompleted} exercises logged`,
      notes: notes || 'Great workout session!'
    };

    db.insert('progressLogs', logEntry);

    // Gamification points & badges
    const result = awardPointsAndEvaluateBadges(userId, 'COMPLETE_WORKOUT');

    const { passwordHash: _, ...safeUser } = result.user;

    res.json({
      message: 'Workout successfully logged!',
      log: logEntry,
      user: safeUser,
      addedPoints: result.addedPoints,
      newlyUnlockedBadges: result.newlyUnlocked
    });
  } catch (err) {
    console.error('Error completing workout:', err);
    res.status(500).json({ error: 'Failed to complete workout.' });
  }
};
