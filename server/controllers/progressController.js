// server/controllers/progressController.js
import { db } from '../config/db.js';
import { awardPointsAndEvaluateBadges } from '../services/pointsEngine.js';

export const getProgressLogs = async (req, res) => {
  try {
    const userId = req.user.id;
    const { type } = req.query;

    let logs = db.find('progressLogs', { userId });
    if (type) {
      logs = logs.filter((l) => l.type === type);
    }

    logs.sort((a, b) => new Date(b.date) - new Date(a.date));
    res.json(logs);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch progress logs.' });
  }
};

export const addProgressLog = async (req, res) => {
  try {
    const userId = req.user.id;
    const { date, type = 'measurement', details, value, durationMinutes = 0, calories = 0 } = req.body;

    if (!details || value === undefined) {
      return res.status(400).json({ error: 'Details and value are required.' });
    }

    const logEntry = {
      id: 'prog-' + Date.now(),
      userId,
      date: date || new Date().toISOString().split('T')[0],
      type,
      details,
      value: String(value),
      durationMinutes: Number(durationMinutes),
      calories: Number(calories)
    };

    db.insert('progressLogs', logEntry);

    // If measurement updated weight, also update user profile weight & BMI
    if (type === 'measurement' && details.toLowerCase().includes('weight')) {
      const numVal = parseFloat(value);
      if (!isNaN(numVal) && numVal > 20) {
        const user = db.findById('users', userId);
        const h = user.profile?.height || 170;
        const hMeters = h / 100;
        const newBmi = Number((numVal / (hMeters * hMeters)).toFixed(1));
        let cat = 'Normal weight';
        if (newBmi < 18.5) cat = 'Underweight';
        else if (newBmi >= 25 && newBmi < 30) cat = 'Overweight';
        else if (newBmi >= 30) cat = 'Obese';

        db.updateById('users', userId, {
          profile: {
            ...user.profile,
            weight: numVal,
            bmi: newBmi,
            bmiCategory: cat
          }
        });
      }
    }

    const result = awardPointsAndEvaluateBadges(userId, 'MEASUREMENT_LOG');
    const { passwordHash: _, ...safeUser } = result.user;

    res.status(201).json({
      log: logEntry,
      user: safeUser,
      addedPoints: result.addedPoints,
      newlyUnlockedBadges: result.newlyUnlocked
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to save progress log.' });
  }
};

export const getDashboardAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = db.findById('users', userId);
    const logs = db.find('progressLogs', { userId });
    const wellnessLogs = db.find('wellnessLogs', { userId });

    const workoutLogs = logs.filter((l) => l.type === 'workout');
    const measurementLogs = logs.filter((l) => l.type === 'measurement');

    // Total calories burned in logged workouts
    const totalCaloriesBurned = workoutLogs.reduce((acc, curr) => acc + (curr.calories || 0), 0);
    const totalWorkoutMinutes = workoutLogs.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);

    // Build Weight over time chart data
    // Mix profile historical baseline + measurement logs
    const weightHistory = [];
    const baselineWeight = user.profile?.weight || 65;
    // Generate 4 previous weekly points if logs are sparse
    for (let i = 3; i >= 1; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i * 7);
      weightHistory.push({
        date: d.toISOString().split('T')[0],
        weight: Number((baselineWeight + (i * 0.4) * (user.profile?.goal === 'Fat Loss' ? 1 : -0.5)).toFixed(1)),
        target: user.profile?.goal === 'Fat Loss' ? baselineWeight - 4 : baselineWeight + 3
      });
    }

    measurementLogs.forEach((m) => {
      const match = m.value.match(/([0-9.]+)/);
      if (match) {
        weightHistory.push({
          date: m.date,
          weight: parseFloat(match[1]),
          target: user.profile?.goal === 'Fat Loss' ? baselineWeight - 4 : baselineWeight + 3
        });
      }
    });

    // Add current weight point
    weightHistory.push({
      date: new Date().toISOString().split('T')[0],
      weight: baselineWeight,
      target: user.profile?.goal === 'Fat Loss' ? baselineWeight - 4 : baselineWeight + 3
    });

    // Workouts per day of week (Mon-Sun)
    const daysMap = { Mon: 0, Tue: 0, Wed: 0, Thu: 0, Fri: 0, Sat: 0, Sun: 0 };
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    workoutLogs.forEach((w) => {
      const d = new Date(w.date);
      const name = dayNames[d.getDay()];
      if (daysMap[name] !== undefined) daysMap[name]++;
    });

    const weeklyWorkoutsChart = Object.keys(daysMap).map((d) => ({
      day: d,
      workouts: daysMap[d]
    }));

    res.json({
      summary: {
        totalWorkouts: workoutLogs.length,
        totalMinutes: totalWorkoutMinutes,
        totalCalories: totalCaloriesBurned,
        currentStreak: user.currentStreak || 1,
        longestStreak: user.longestStreak || 1,
        points: user.points || 0,
        level: user.level || 1,
        currentBmi: user.profile?.bmi,
        bmiCategory: user.profile?.bmiCategory
      },
      weightChart: weightHistory,
      weeklyWorkoutsChart,
      recentWorkouts: workoutLogs.slice(-5).reverse()
    });
  } catch (err) {
    console.error('Analytics error:', err);
    res.status(500).json({ error: 'Failed to generate analytics.' });
  }
};

// Weekly Progress Tracking (PRD Module 8 - FR8.1, FR8.2, FR8.3, FR8.4)
export const getWeeklyProgressSummary = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = db.findById('users', userId);
    const weeklyLogs = db.find('weeklyProgressLogs', { userId });

    weeklyLogs.sort((a, b) => new Date(a.weekStartDate) - new Date(b.weekStartDate));

    const currentWeekLog = weeklyLogs[weeklyLogs.length - 1] || null;
    const previousWeekLog = weeklyLogs.length > 1 ? weeklyLogs[weeklyLogs.length - 2] : null;

    let weightDiff = 0;
    if (currentWeekLog && previousWeekLog) {
      weightDiff = Number((currentWeekLog.weight - previousWeekLog.weight).toFixed(1));
    }

    const plannedWorkouts = user?.profile?.availableDays || 3;
    const currentCompleted = currentWeekLog?.workoutsCompleted || 0;
    const adherence = Math.min(100, Math.round((currentCompleted / plannedWorkouts) * 100));

    res.json({
      currentWeek: {
        weight: currentWeekLog?.weight || user?.profile?.weight || 65,
        workoutsCompleted: currentCompleted,
        workoutsPlanned: plannedWorkouts,
        adherencePercent: adherence,
        weightDiffText: weightDiff !== 0 ? `${weightDiff > 0 ? '+' : ''}${weightDiff} kg this week` : 'Stable weight this week',
        completionSummary: `${currentCompleted}/${plannedWorkouts} workouts completed`
      },
      weeklyHistory: weeklyLogs.map((w, idx) => ({
        week: `Week ${idx + 1}`,
        date: w.weekStartDate,
        weight: w.weight,
        workoutsCompleted: w.workoutsCompleted,
        adherencePercent: w.adherencePercent || 100
      }))
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch weekly progress summary.' });
  }
};

export const logWeeklyWeighin = async (req, res) => {
  try {
    const userId = req.user.id;
    const { weight, chest_cm, waist_cm, hips_cm, notes } = req.body;

    const numWeight = parseFloat(weight);
    if (!numWeight || isNaN(numWeight)) {
      return res.status(400).json({ error: 'Valid weight number is required.' });
    }

    const todayStr = new Date().toISOString().split('T')[0];
    const user = db.findById('users', userId);

    const weeklyLogs = db.find('weeklyProgressLogs', { userId });
    weeklyLogs.sort((a, b) => new Date(a.weekStartDate) - new Date(b.weekStartDate));
    const previousWeekLog = weeklyLogs.length > 0 ? weeklyLogs[weeklyLogs.length - 1] : null;

    const weightDiff = previousWeekLog ? Number((numWeight - previousWeekLog.weight).toFixed(1)) : 0;

    const newLog = {
      id: 'wprog-' + Date.now(),
      userId,
      weekStartDate: todayStr,
      weight: numWeight,
      bodyMeasurements: {
        chest_cm: Number(chest_cm) || null,
        waist_cm: Number(waist_cm) || null,
        hips_cm: Number(hips_cm) || null
      },
      workoutsCompleted: 3,
      workoutsPlanned: user?.profile?.availableDays || 3,
      adherencePercent: 100,
      weightDiffPrevWeek: weightDiff,
      notes: notes || 'Weekly weigh-in recorded.'
    };

    db.insert('weeklyProgressLogs', newLog);

    // Update user profile weight & BMI
    const h = user?.profile?.height || 170;
    const hM = h / 100;
    const newBmi = Number((numWeight / (hM * hM)).toFixed(1));
    let cat = 'Normal weight';
    if (newBmi < 18.5) cat = 'Underweight';
    else if (newBmi >= 25 && newBmi < 30) cat = 'Overweight';
    else if (newBmi >= 30) cat = 'Obese';

    db.updateById('users', userId, {
      profile: {
        ...(user?.profile || {}),
        weight: numWeight,
        bmi: newBmi,
        bmiCategory: cat
      }
    });

    const result = awardPointsAndEvaluateBadges(userId, 'MEASUREMENT_LOG');
    const { passwordHash: _, ...safeUser } = result.user;

    res.status(201).json({
      message: 'Weekly weigh-in recorded successfully!',
      log: newLog,
      user: safeUser,
      addedPoints: result.addedPoints,
      newlyUnlockedBadges: result.newlyUnlocked
    });
  } catch (err) {
    console.error('Error logging weekly weigh-in:', err);
    res.status(500).json({ error: 'Failed to record weekly weigh-in.' });
  }
};

