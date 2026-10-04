// server/routes/gamificationRoutes.js
import express from 'express';
import { getLeaderboard, getBadges } from '../controllers/gamificationController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/leaderboard', getLeaderboard);
router.get('/badges', authenticateToken, getBadges);

export default router;
