// server/routes/planRoutes.js
import express from 'express';
import {
  getAllPlans,
  getPlanById,
  getRecommendation,
  assignPlan,
  completeWorkout
} from '../controllers/planController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllPlans);
router.get('/recommendation', authenticateToken, getRecommendation);
router.get('/:id', getPlanById);
router.post('/assign', authenticateToken, assignPlan);
router.post('/complete', authenticateToken, completeWorkout);

export default router;
