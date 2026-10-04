// server/routes/roadmapRoutes.js
import express from 'express';
import { getRoadmapByCategory, completeRoadmapStep } from '../controllers/roadmapController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/:category', getRoadmapByCategory);
router.post('/step/complete', authenticateToken, completeRoadmapStep);

export default router;
