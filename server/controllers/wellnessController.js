// server/controllers/wellnessController.js
import { db } from '../config/db.js';
import { awardPointsAndEvaluateBadges } from '../services/pointsEngine.js';

function getTodayString() {
  return new Date().toISOString().split('T')[0];
}

function getOrCreateTodayLog(userId) {
  const today = getTodayString();
  let log = db.findOne('wellnessLogs', (l) => l.userId === userId && l.date === today);

  if (!log) {
    log = {
      id: `well-${userId}-${today}`,
      userId,
      date: today,
      water_ml: 0,
      water_goal: 2500,
      sleepHours: 0,
      sleepQuality: 'Good',
      sleepTime: '23:00',
      wakeTime: '07:00',
      mood: 'Focused',
      meals: []
    };
    db.insert('wellnessLogs', log);
  }
  return log;
}

export const getTodayWellness = async (req, res) => {
  try {
    const userId = req.user.id;
    const log = getOrCreateTodayLog(userId);

    // Also get last 7 days wellness for weekly trend charts
    const allUserLogs = db.find('wellnessLogs', { userId });
    allUserLogs.sort((a, b) => new Date(a.date) - new Date(b.date));
    const recentWeekly = allUserLogs.slice(-7);

    res.json({
      today: log,
      weekly: recentWeekly
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve wellness log.' });
  }
};

export const logWater = async (req, res) => {
  try {
    const userId = req.user.id;
    const { amount_ml, goal_ml, reset } = req.body;
    let log = getOrCreateTodayLog(userId);

    let newAmount = reset ? 0 : Math.max(0, (log.water_ml || 0) + (Number(amount_ml) || 0));
    let newGoal = goal_ml ? Number(goal_ml) : (log.water_goal || 2500);

    const updatedLog = db.updateById('wellnessLogs', log.id, {
      water_ml: newAmount,
      water_goal: newGoal
    });

    let result = null;
    if (newAmount >= newGoal && (log.water_ml < newGoal)) {
      // Achieved daily water goal!
      result = awardPointsAndEvaluateBadges(userId, 'LOG_WATER_GOAL', { water_ml: newAmount });
    } else if (Number(amount_ml) > 0) {
      result = awardPointsAndEvaluateBadges(userId, 'LOG_WATER_SIP', { water_ml: newAmount });
    }

    res.json({
      log: updatedLog,
      user: result?.user ? { ...result.user, passwordHash: undefined } : undefined,
      addedPoints: result?.addedPoints || 0,
      newlyUnlockedBadges: result?.newlyUnlocked || []
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log water.' });
  }
};

export const logSleep = async (req, res) => {
  try {
    const userId = req.user.id;
    const { sleepTime, wakeTime, sleepQuality = 'Good', mood = 'Refreshed' } = req.body;
    let log = getOrCreateTodayLog(userId);

    // Compute hours slept from sleepTime (e.g. "23:00") and wakeTime (e.g. "07:00")
    let hoursSlept = 7.5;
    if (sleepTime && wakeTime) {
      const [sH, sM] = sleepTime.split(':').map(Number);
      const [wH, wM] = wakeTime.split(':').map(Number);
      let diffMinutes = (wH * 60 + wM) - (sH * 60 + sM);
      if (diffMinutes < 0) diffMinutes += 24 * 60; // Crosses midnight
      hoursSlept = Number((diffMinutes / 60).toFixed(1));
    }

    const updatedLog = db.updateById('wellnessLogs', log.id, {
      sleepTime,
      wakeTime,
      sleepHours: hoursSlept,
      sleepQuality,
      mood
    });

    const result = awardPointsAndEvaluateBadges(userId, 'LOG_SLEEP', { sleepHours: hoursSlept });

    res.json({
      log: updatedLog,
      user: result?.user ? { ...result.user, passwordHash: undefined } : undefined,
      addedPoints: result?.addedPoints || 0,
      newlyUnlockedBadges: result?.newlyUnlocked || []
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log sleep.' });
  }
};

export const logMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { name, calories, mealType = 'Breakfast', time } = req.body;

    if (!name || calories === undefined) {
      return res.status(400).json({ error: 'Meal name and calories are required.' });
    }

    let log = getOrCreateTodayLog(userId);
    const newMeal = {
      id: 'm-' + Date.now(),
      name,
      calories: Number(calories) || 0,
      mealType,
      time: time || new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const currentMeals = log.meals || [];
    const updatedMeals = [...currentMeals, newMeal];

    const updatedLog = db.updateById('wellnessLogs', log.id, {
      meals: updatedMeals
    });

    const result = awardPointsAndEvaluateBadges(userId, 'LOG_MEAL');

    res.json({
      log: updatedLog,
      newMeal,
      user: result?.user ? { ...result.user, passwordHash: undefined } : undefined,
      addedPoints: result?.addedPoints || 0,
      newlyUnlockedBadges: result?.newlyUnlocked || []
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log meal.' });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mealId } = req.params;
    let log = getOrCreateTodayLog(userId);

    const updatedMeals = (log.meals || []).filter((m) => m.id !== mealId);
    const updatedLog = db.updateById('wellnessLogs', log.id, {
      meals: updatedMeals
    });

    res.json({ log: updatedLog });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete meal.' });
  }
};

export const searchFood = async (req, res) => {
  try {
    const { query } = req.query;
    const allFoods = db.getCollection('foodItems');
    if (!query) {
      return res.json(allFoods.slice(0, 10));
    }
    const q = query.toLowerCase();
    const filtered = allFoods.filter(
      (f) => f.name.toLowerCase().includes(q) || (f.serving && f.serving.toLowerCase().includes(q))
    );
    res.json(filtered);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search food.' });
  }
};
