// server/routes/nutritionRoutes.js
import express from 'express';
import {
  getTodayNutrition,
  logMealWithAutoMacros,
  deleteMeal,
  searchFoodDatabase,
  getNutritionHistory
} from '../controllers/nutritionController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/today', authenticateToken, getTodayNutrition);
router.post('/meal', authenticateToken, logMealWithAutoMacros);
router.delete('/meal/:mealId', authenticateToken, deleteMeal);
router.get('/search', authenticateToken, searchFoodDatabase);
router.get('/history', authenticateToken, getNutritionHistory);

export default router;
