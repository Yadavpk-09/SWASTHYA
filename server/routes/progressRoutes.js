// server/routes/progressRoutes.js
import express from 'express';
import {
  getProgressLogs,
  addProgressLog,
  getDashboardAnalytics,
  getWeeklyProgressSummary,
  logWeeklyWeighin
} from '../controllers/progressController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/logs', authenticateToken, getProgressLogs);
router.post('/logs', authenticateToken, addProgressLog);
router.get('/analytics', authenticateToken, getDashboardAnalytics);
router.get('/weekly', authenticateToken, getWeeklyProgressSummary);
router.post('/weekly-weighin', authenticateToken, logWeeklyWeighin);

export default router;
