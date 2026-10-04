// server/services/nutritionCalc.js

/**
 * Calculates BMR, TDEE, and optimal daily macro targets based on Mifflin-St Jeor formula
 * @param {Object} profile - { age, gender, height, weight, goal, activityLevel, dietaryPreference }
 * @returns {Object} - { dailyCalorieTarget, dailyProteinTarget_g, dailyFiberTarget_g, dailyCarbTarget_g, dailyFatTarget_g, bmr, tdee }
 */
export function calculateNutritionTargets(profile) {
  const age = Number(profile.age) || 22;
  const height = Number(profile.height) || 170; // cm
  const weight = Number(profile.weight) || 68; // kg
  const gender = (profile.gender || 'male').toLowerCase();
  const goal = (profile.goal || profile.primaryGoal || 'general fitness').toLowerCase();
  const activityLevel = (profile.activityLevel || 'moderately active').toLowerCase();

  // Mifflin-St Jeor BMR formula
  let bmr = (10 * weight) + (6.25 * height) - (5 * age);
  if (gender === 'female') {
    bmr -= 161;
  } else {
    bmr += 5;
  }

  // Activity multipliers
  let multiplier = 1.375; // default lightly active
  if (activityLevel.includes('sedentary')) multiplier = 1.2;
  else if (activityLevel.includes('light')) multiplier = 1.375;
  else if (activityLevel.includes('moderately')) multiplier = 1.55;
  else if (activityLevel.includes('very') || activityLevel.includes('athlete')) multiplier = 1.725;

  const tdee = Math.round(bmr * multiplier);

  // Calorie adjustments based on goal
  let targetCalories = tdee;
  let proteinPerKg = 1.6;

  if (goal.includes('loss') || goal.includes('cut')) {
    targetCalories = Math.max(1200, tdee - 500); // 500 kcal deficit
    proteinPerKg = 2.0; // Higher protein to preserve lean muscle in deficit
  } else if (goal.includes('gain') || goal.includes('muscle') || goal.includes('bulk')) {
    targetCalories = tdee + 400; // 400 kcal surplus
    proteinPerKg = 2.0;
  } else {
    // General fitness / maintenance
    targetCalories = tdee;
    proteinPerKg = 1.6;
  }

  // Protein calculation
  const targetProtein = Math.round(weight * proteinPerKg);
  const proteinCalories = targetProtein * 4;

  // Fiber recommendation (standard AHA / ICMR guideline)
  const targetFiber = gender === 'female' ? 28 : 35;

  // Fat calculation (approx 25% of total calories)
  const fatCalories = targetCalories * 0.25;
  const targetFat = Math.round(fatCalories / 9);

  // Carbs calculation (remaining calories)
  const remainingCalories = Math.max(0, targetCalories - (proteinCalories + fatCalories));
  const targetCarbs = Math.round(remainingCalories / 4);

  return {
    dailyCalorieTarget: Math.round(targetCalories),
    dailyProteinTarget_g: targetProtein,
    dailyFiberTarget_g: targetFiber,
    dailyCarbTarget_g: targetCarbs,
    dailyFatTarget_g: targetFat,
    bmr: Math.round(bmr),
    tdee
  };
}
