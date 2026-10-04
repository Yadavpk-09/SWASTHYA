// server/routes/wellnessRoutes.js
import express from 'express';
import {
  getTodayWellness,
  logWater,
  logSleep,
  logMeal,
  deleteMeal,
  searchFood
} from '../controllers/wellnessController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/today', authenticateToken, getTodayWellness);
router.post('/water', authenticateToken, logWater);
router.post('/sleep', authenticateToken, logSleep);
router.post('/meal', authenticateToken, logMeal);
router.delete('/meal/:mealId', authenticateToken, deleteMeal);
router.get('/food-search', searchFood);

export default router;
