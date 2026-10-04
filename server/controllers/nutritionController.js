// server/controllers/nutritionController.js
import { db } from '../config/db.js';
import { awardPointsAndEvaluateBadges } from '../services/pointsEngine.js';

export const getTodayNutrition = async (req, res) => {
  try {
    const userId = req.user.id;
    const todayStr = new Date().toISOString().split('T')[0];

    const user = db.findById('users', userId);
    const dietPlanId = user?.assignedDietPlanId || 'diet-1';
    const dietPlan = db.findById('dietPlans', dietPlanId) || db.getCollection('dietPlans')[0];

    const allLogs = db.getCollection('wellnessLogs');
    let todayLog = allLogs.find((w) => w.userId === userId && w.date === todayStr);

    if (!todayLog) {
      todayLog = {
        id: `well-${userId}-${todayStr}`,
        userId,
        date: todayStr,
        water_ml: 0,
        water_goal: 2500,
        sleepHours: 0,
        meals: []
      };
      db.insert('wellnessLogs', todayLog);
    }

    const meals = todayLog.meals || [];

    // Auto-sum consumed macros
    const consumed = meals.reduce(
      (acc, m) => ({
        calories: acc.calories + (m.calories || 0),
        protein_g: acc.protein_g + (m.protein_g || 0),
        fiber_g: acc.fiber_g + (m.fiber_g || 0),
        carbs_g: acc.carbs_g + (m.carbs_g || 0),
        fat_g: acc.fat_g + (m.fat_g || 0)
      }),
      { calories: 0, protein_g: 0, fiber_g: 0, carbs_g: 0, fat_g: 0 }
    );

    // Target macros from user's active diet plan
    const targets = {
      calories: dietPlan?.dailyCalorieTarget || 2000,
      protein_g: dietPlan?.dailyProteinTarget_g || 130,
      fiber_g: dietPlan?.dailyFiberTarget_g || 32,
      carbs_g: dietPlan?.dailyCarbTarget_g || 240,
      fat_g: dietPlan?.dailyFatTarget_g || 55
    };

    // Remaining vs Target (FR10.3)
    const remaining = {
      calories: Math.max(0, targets.calories - consumed.calories),
      protein_g: Math.max(0, targets.protein_g - consumed.protein_g),
      fiber_g: Math.max(0, targets.fiber_g - consumed.fiber_g),
      carbs_g: Math.max(0, targets.carbs_g - consumed.carbs_g),
      fat_g: Math.max(0, targets.fat_g - consumed.fat_g)
    };

    // Generate explicit guidance messages (FR10.3)
    let guidanceStatements = [];
    if (remaining.calories > 0) {
      guidanceStatements.push(`You need ${remaining.calories} more calories today.`);
    } else {
      guidanceStatements.push(`Daily calorie target met!`);
    }

    if (remaining.protein_g > 0) {
      guidanceStatements.push(`You need ${remaining.protein_g}g more protein today.`);
    } else {
      guidanceStatements.push(`Protein goal achieved for muscle synthesis!`);
    }

    if (remaining.fiber_g > 0) {
      guidanceStatements.push(`You need ${remaining.fiber_g}g more fiber for optimal digestion.`);
    } else {
      guidanceStatements.push(`Daily fiber goal achieved!`);
    }

    res.json({
      date: todayStr,
      dietPlanTitle: dietPlan?.title || 'Custom Diet Plan',
      meals,
      consumed,
      targets,
      remaining,
      guidanceStatements,
      summaryText: `You need ${remaining.protein_g}g more protein and ${remaining.fiber_g}g more fiber today.`
    });
  } catch (err) {
    console.error('Error fetching today nutrition:', err);
    res.status(500).json({ error: 'Failed to fetch nutrition data.' });
  }
};

export const logMealWithAutoMacros = async (req, res) => {
  try {
    const userId = req.user.id;
    const { foodId, customName, servings = 1, mealType = 'Breakfast' } = req.body;
    const todayStr = new Date().toISOString().split('T')[0];

    const foodDb = db.getCollection('foodItems');
    let foodItem = foodDb.find((f) => f.id === foodId);

    if (!foodItem && customName) {
      // Find by name match
      foodItem = foodDb.find((f) => f.name.toLowerCase().includes(customName.toLowerCase()));
    }

    const numServings = Number(servings) || 1;

    // Automatic macro calculation (FR10.2)
    const mealEntry = {
      id: 'meal-' + Date.now(),
      name: foodItem ? foodItem.name : (customName || 'Balanced Meal'),
      calories: Math.round((foodItem ? foodItem.calories : 250) * numServings),
      protein_g: Math.round((foodItem ? foodItem.protein : 12) * numServings),
      carbs_g: Math.round((foodItem ? foodItem.carbs : 30) * numServings),
      fat_g: Math.round((foodItem ? foodItem.fat : 8) * numServings),
      fiber_g: Math.round((foodItem ? (foodItem.fiber || 3) : 3) * numServings),
      servings: numServings,
      servingDescription: foodItem ? foodItem.serving : '1 serving',
      mealType: mealType || 'Breakfast',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    const allLogs = db.getCollection('wellnessLogs');
    let todayLog = allLogs.find((w) => w.userId === userId && w.date === todayStr);

    if (!todayLog) {
      todayLog = {
        id: `well-${userId}-${todayStr}`,
        userId,
        date: todayStr,
        water_ml: 0,
        water_goal: 2500,
        sleepHours: 0,
        meals: [mealEntry]
      };
      db.insert('wellnessLogs', todayLog);
    } else {
      const updatedMeals = [...(todayLog.meals || []), mealEntry];
      db.updateById('wellnessLogs', todayLog.id, { meals: updatedMeals });
    }

    const result = awardPointsAndEvaluateBadges(userId, 'LOG_MEAL');
    const { passwordHash: _, ...safeUser } = result.user;

    res.status(201).json({
      message: `Logged ${mealEntry.name} with auto-computed macros!`,
      meal: mealEntry,
      user: safeUser,
      addedPoints: result.addedPoints,
      newlyUnlockedBadges: result.newlyUnlocked
    });
  } catch (err) {
    console.error('Error logging meal:', err);
    res.status(500).json({ error: 'Failed to log meal.' });
  }
};

export const deleteMeal = async (req, res) => {
  try {
    const userId = req.user.id;
    const { mealId } = req.params;
    const todayStr = new Date().toISOString().split('T')[0];

    const allLogs = db.getCollection('wellnessLogs');
    const todayLog = allLogs.find((w) => w.userId === userId && w.date === todayStr);

    if (!todayLog) {
      return res.status(404).json({ error: 'Today log not found.' });
    }

    const updatedMeals = (todayLog.meals || []).filter((m) => m.id !== mealId);
    db.updateById('wellnessLogs', todayLog.id, { meals: updatedMeals });

    res.json({ message: 'Meal entry removed successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete meal.' });
  }
};

export const searchFoodDatabase = async (req, res) => {
  try {
    const { q = '' } = req.query;
    const items = db.getCollection('foodItems');
    if (!q.trim()) {
      return res.json(items.slice(0, 12));
    }

    const query = q.toLowerCase();
    const results = items.filter(
      (item) =>
        item.name.toLowerCase().includes(query) ||
        (item.serving && item.serving.toLowerCase().includes(query))
    );
    res.json(results);
  } catch (err) {
    res.status(500).json({ error: 'Failed to search food items.' });
  }
};

export const getNutritionHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const allLogs = db.getCollection('wellnessLogs');
    const userLogs = allLogs.filter((w) => w.userId === userId).slice(-7);

    const history = userLogs.map((log) => {
      const dayMeals = log.meals || [];
      const dayCalories = dayMeals.reduce((acc, m) => acc + (m.calories || 0), 0);
      const dayProtein = dayMeals.reduce((acc, m) => acc + (m.protein_g || 0), 0);
      const dayFiber = dayMeals.reduce((acc, m) => acc + (m.fiber_g || 0), 0);

      return {
        date: log.date,
        calories: dayCalories,
        protein_g: dayProtein,
        fiber_g: dayFiber,
        mealsCount: dayMeals.length
      };
    });

    res.json(history);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch nutrition history.' });
  }
};
