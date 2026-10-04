// server/controllers/assessmentController.js
import { db } from '../config/db.js';
import { generateFullSwasthyaPlan } from '../services/planEngine.js';

export const submitAssessment = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      age,
      gender,
      height,
      weight,
      goal,
      activityLevel,
      daysAvailable,
      injuries,
      dietaryPreference,
      stressLevel,
      sleepPattern
    } = req.body;

    const numHeight = Number(height) || 170;
    const numWeight = Number(weight) || 68;
    const numAge = Number(age) || 22;
    const numDays = Number(daysAvailable) || 3;

    // Calculate BMI
    const hM = numHeight / 100;
    const bmi = Number((numWeight / (hM * hM)).toFixed(1));
    let bmiCategory = 'Normal weight';
    if (bmi < 18.5) bmiCategory = 'Underweight';
    else if (bmi >= 25 && bmi < 30) bmiCategory = 'Overweight';
    else if (bmi >= 30) bmiCategory = 'Obese';

    const assessment = {
      id: 'assess-' + Date.now(),
      userId,
      age: numAge,
      gender: gender || 'male',
      height: numHeight,
      weight: numWeight,
      bmi,
      bmiCategory,
      goal: goal || 'General Fitness',
      activityLevel: activityLevel || 'Moderately Active',
      daysAvailable: numDays,
      injuries: Array.isArray(injuries) ? injuries : (injuries ? [injuries] : []),
      dietaryPreference: dietaryPreference || 'Vegetarian',
      stressLevel: stressLevel || 'medium',
      sleepPattern: sleepPattern || 'good',
      completedAt: new Date().toISOString()
    };

    db.insert('assessments', assessment);

    // Update user profile
    const existingUser = db.findById('users', userId);
    if (existingUser) {
      db.updateById('users', userId, {
        profile: {
          ...(existingUser.profile || {}),
          age: numAge,
          gender: gender || 'male',
          height: numHeight,
          weight: numWeight,
          bmi,
          bmiCategory,
          goal: assessment.goal,
          activityLevel: assessment.activityLevel,
          availableDays: numDays,
          dietaryPreference: assessment.dietaryPreference,
          stressLevel: assessment.stressLevel,
          sleepPattern: assessment.sleepPattern,
          injuries: assessment.injuries
        },
        hasCompletedAssessment: true
      });
    }

    const updatedUser = db.findById('users', userId);

    // Execute rule-based decision engine to generate package in one pass
    const planPackage = generateFullSwasthyaPlan(assessment, updatedUser);

    res.status(201).json({
      message: 'Assessment completed and personalized plan package generated!',
      assessment,
      planPackage
    });
  } catch (err) {
    console.error('Assessment submission error:', err);
    res.status(500).json({ error: 'Failed to process assessment and generate plans.' });
  }
};

export const getCurrentPlanPackage = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = db.findById('users', userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const allAssessments = db.find('assessments', { userId });
    const latestAssessment = allAssessments.length > 0 ? allAssessments[allAssessments.length - 1] : null;

    const exercisePlanId = user.assignedExercisePlanId || 'plan-1';
    const dietPlanId = user.assignedDietPlanId || 'diet-1';
    const roadmapId = user.assignedRoadmapId || 'medium';

    const exercisePlan = db.findById('workoutPlans', exercisePlanId) || db.getCollection('workoutPlans')[0];
    const dietPlan = db.findById('dietPlans', dietPlanId) || db.getCollection('dietPlans')[0];
    const roadmaps = db.getCollection('stressRoadmaps');
    const stressRoadmap = roadmaps[roadmapId] || roadmaps['medium'];

    const exercises = db.getCollection('exercises');
    // Populate exercises in exercise plan
    const populatedExercisePlan = exercisePlan ? {
      ...exercisePlan,
      days: (exercisePlan.days || []).map((day) => ({
        ...day,
        exercises: (day.exercises || []).map((exRef) => {
          const exObj = exercises.find((e) => e.id === exRef.exerciseId);
          return {
            ...exRef,
            exercise: exObj || null
          };
        })
      }))
    } : null;

    res.json({
      user,
      assessment: latestAssessment,
      exercisePlan: populatedExercisePlan,
      dietPlan,
      meditationRecommended: user.meditationRecommended !== false,
      stressRoadmap
    });
  } catch (err) {
    console.error('Error fetching current plan package:', err);
    res.status(500).json({ error: 'Failed to fetch current plan package.' });
  }
};
