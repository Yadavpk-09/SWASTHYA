// server/services/pointsEngine.js
import { db } from '../config/db.js';

export const ACTION_POINTS = {
  COMPLETE_WORKOUT: 50,
  LOG_WATER_GOAL: 20,
  LOG_WATER_SIP: 5,
  LOG_SLEEP: 15,
  LOG_MEAL: 10,
  COMPLETE_BREATHING: 25,
  MEASUREMENT_LOG: 15
};

export function awardPointsAndEvaluateBadges(userId, actionType, extraData = {}) {
  const user = db.findById('users', userId);
  if (!user) return null;

  const pointsToAdd = ACTION_POINTS[actionType] || 10;
  const newPoints = (user.points || 0) + pointsToAdd;

  // Streak logic
  const todayStr = new Date().toISOString().split('T')[0];
  const lastActiveStr = user.lastActiveAt ? user.lastActiveAt.split('T')[0] : null;

  let currentStreak = user.currentStreak || 1;
  let longestStreak = user.longestStreak || 1;

  if (lastActiveStr) {
    const diffDays = Math.round(
      (new Date(todayStr).getTime() - new Date(lastActiveStr).getTime()) / (1000 * 3600 * 24)
    );
    if (diffDays === 1) {
      currentStreak += 1;
      if (currentStreak > longestStreak) longestStreak = currentStreak;
    } else if (diffDays > 1) {
      currentStreak = 1;
    }
  }

  const level = Math.floor(newPoints / 150) + 1;

  // Check badges
  const allBadges = db.getCollection('badges');
  const earnedBadges = new Set(user.earnedBadges || []);
  const newlyUnlocked = [];

  const workouts = db.find('progressLogs', { userId, type: 'workout' });
  const totalWorkouts = workouts.length + (actionType === 'COMPLETE_WORKOUT' ? 1 : 0);

  allBadges.forEach((badge) => {
    if (earnedBadges.has(badge.id)) return;

    let unlocked = false;
    if (badge.id === 'b-first-step' && totalWorkouts >= 1) unlocked = true;
    if (badge.id === 'b-streak-7' && currentStreak >= 7) unlocked = true;
    if (badge.id === 'b-streak-14' && currentStreak >= 14) unlocked = true;
    if (badge.id === 'b-century-club' && newPoints >= 500) unlocked = true;
    if (badge.id === 'b-hydration-hero' && (extraData.water_ml >= 2500 || actionType === 'LOG_WATER_GOAL')) unlocked = true;
    if (badge.id === 'b-zen-master' && actionType === 'COMPLETE_BREATHING') {
      unlocked = true;
    }

    if (unlocked) {
      earnedBadges.add(badge.id);
      newlyUnlocked.push(badge);
    }
  });

  const updatedUser = db.updateById('users', userId, {
    points: newPoints,
    currentStreak,
    longestStreak,
    level,
    lastActiveAt: new Date().toISOString(),
    earnedBadges: Array.from(earnedBadges)
  });

  return {
    user: updatedUser,
    addedPoints: pointsToAdd,
    newlyUnlocked
  };
}
