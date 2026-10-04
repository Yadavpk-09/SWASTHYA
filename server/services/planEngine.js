// server/services/planEngine.js
import { db } from '../config/db.js';
import { calculateNutritionTargets } from './nutritionCalc.js';

/**
 * Maps goal, activity level, and available days to closest curated exercise plan template
 */
export function recommendWorkoutPlan({ goal, activityLevel, availableDays }) {
  const plans = db.getCollection('workoutPlans');
  if (!plans || plans.length === 0) return null;

  const days = Number(availableDays) || 3;
  const normalizedGoal = (goal || '').toLowerCase();
  const normalizedActivity = (activityLevel || '').toLowerCase();

  // 1. Direct goal match
  let matches = plans.filter((p) => {
    const planGoal = p.goalType.toLowerCase();
    return (
      planGoal.includes(normalizedGoal) ||
      normalizedGoal.includes(planGoal) ||
      (normalizedGoal.includes('weight loss') && (planGoal.includes('fat') || planGoal.includes('loss'))) ||
      (normalizedGoal.includes('gain') && (planGoal.includes('muscle') || planGoal.includes('gain'))) ||
      (normalizedGoal.includes('muscle') && planGoal.includes('muscle')) ||
      (normalizedGoal.includes('yoga') && planGoal.includes('yoga')) ||
      (normalizedGoal.includes('strength') && planGoal.includes('strength')) ||
      (normalizedGoal.includes('endurance') && planGoal.includes('endurance')) ||
      (normalizedGoal.includes('fitness') && (planGoal.includes('fat') || planGoal.includes('conditioning')))
    );
  });

  if (matches.length > 0) {
    // Pick plan closest to availableDays
    matches.sort((a, b) => {
      const diffA = Math.abs(a.durationDays - days);
      const diffB = Math.abs(b.durationDays - days);
      return diffA - diffB;
    });
    return matches[0];
  }

  // Fallback based on activity
  if (normalizedActivity.includes('very') || days >= 5) {
    const adv = plans.find((p) => p.level === 'Advanced' || p.durationDays >= 4);
    if (adv) return adv;
  }

  return plans[0];
}

/**
 * Maps goal and dietary preference to closest curated Diet Plan template,
 * while customizing macro targets via Mifflin-St Jeor formula
 */
export function recommendDietPlan(assessment, userProfile) {
  const dietPlans = db.getCollection('dietPlans');
  const goal = (assessment.goal || userProfile.goal || 'General Fitness').toLowerCase();
  const pref = (assessment.dietaryPreference || userProfile.dietaryPreference || 'Vegetarian').toLowerCase();

  // Compute calculated macro targets
  const calculatedMacros = calculateNutritionTargets({
    ...userProfile,
    ...assessment
  });

  // Match curated template by goal and preference
  let match = dietPlans.find((d) => {
    const dGoal = d.goalType.toLowerCase();
    const dPref = d.dietaryPreference.toLowerCase();
    const goalMatch = dGoal.includes(goal) || goal.includes(dGoal) || (goal.includes('loss') && dGoal.includes('loss'));
    const prefMatch = dPref.includes(pref) || pref.includes(dPref);
    return goalMatch && prefMatch;
  });

  if (!match) {
    // Match by preference
    match = dietPlans.find((d) => d.dietaryPreference.toLowerCase().includes(pref)) || dietPlans[0];
  }

  return {
    ...match,
    // Override with user's personalized targets from Mifflin-St Jeor
    dailyCalorieTarget: calculatedMacros.dailyCalorieTarget,
    dailyProteinTarget_g: calculatedMacros.dailyProteinTarget_g,
    dailyFiberTarget_g: calculatedMacros.dailyFiberTarget_g,
    dailyCarbTarget_g: calculatedMacros.dailyCarbTarget_g,
    dailyFatTarget_g: calculatedMacros.dailyFatTarget_g,
    bmr: calculatedMacros.bmr,
    tdee: calculatedMacros.tdee
  };
}

/**
 * Full Multi-Domain Decision Engine (PRD Module 3 - FR3.1)
 * Evaluates the completed assessment and generates in one pass:
 * 1. Exercise Plan
 * 2. Diet Plan (calories, protein, fiber, carbs, fat)
 * 3. Meditation Recommendation (only if elevated stress or poor sleep pattern)
 */
export function generateFullSwasthyaPlan(assessment, user) {
  const userProfile = user.profile || {};
  const mergedProfile = { ...userProfile, ...assessment };

  // 1. Exercise Plan
  const exercisePlan = recommendWorkoutPlan({
    goal: assessment.goal || mergedProfile.goal,
    activityLevel: assessment.activityLevel || mergedProfile.activityLevel,
    availableDays: assessment.daysAvailable || mergedProfile.availableDays
  });

  // 2. Diet Plan
  const dietPlan = recommendDietPlan(assessment, mergedProfile);

  // 3. Meditation Recommendation (FR3.1)
  // ONLY generated/shown if assessment indicates elevated stress level (medium/high) or poor sleep pattern
  const stressLevel = (assessment.stressLevel || '').toLowerCase();
  const sleepPattern = (assessment.sleepPattern || '').toLowerCase();

  const isElevatedStress = stressLevel === 'medium' || stressLevel === 'high';
  const isPoorSleep = sleepPattern === 'poor' || sleepPattern === 'fair' || sleepPattern.includes('insomnia');

  const meditationRecommended = isElevatedStress || isPoorSleep;

  let meditationRecommendation = null;
  let stressRoadmap = null;

  if (meditationRecommended) {
    const meditations = db.getCollection('meditations');
    const roadmaps = db.getCollection('stressRoadmaps');

    const roadmapCategory = stressLevel === 'high' ? 'high' : 'medium';
    stressRoadmap = roadmaps[roadmapCategory] || roadmaps['medium'];

    // Pick top recommended meditation
    meditationRecommendation = meditations.find((m) => {
      if (stressLevel === 'high') return m.category.toLowerCase().includes('anxiety') || m.category.toLowerCase().includes('sleep');
      if (sleepPattern === 'poor') return m.category.toLowerCase().includes('sleep');
      return m.category.toLowerCase().includes('stress');
    }) || meditations[0];
  }

  // Create GeneratedPlan package
  const generatedPlan = {
    id: 'gen-plan-' + Date.now(),
    userId: user.id,
    assessmentId: assessment.id,
    exercisePlanId: exercisePlan ? exercisePlan.id : 'plan-1',
    dietPlanId: dietPlan ? dietPlan.id : 'diet-1',
    meditationRecommended,
    stressRoadmapId: meditationRecommended ? (stressLevel || 'medium') : null,
    generatedAt: new Date().toISOString()
  };

  db.insert('generatedPlans', generatedPlan);

  // Update user active plan pointers
  db.updateById('users', user.id, {
    assignedExercisePlanId: exercisePlan ? exercisePlan.id : 'plan-1',
    assignedDietPlanId: dietPlan ? dietPlan.id : 'diet-1',
    assignedRoadmapId: meditationRecommended ? (stressLevel || 'medium') : 'low',
    meditationRecommended,
    lastActiveAt: new Date().toISOString()
  });

  return {
    packageId: generatedPlan.id,
    user: db.findById('users', user.id),
    exercisePlan,
    dietPlan,
    meditationRecommended,
    meditationRecommendation,
    stressRoadmap,
    stressLevel: assessment.stressLevel,
    sleepPattern: assessment.sleepPattern,
    generatedAt: generatedPlan.generatedAt
  };
}
