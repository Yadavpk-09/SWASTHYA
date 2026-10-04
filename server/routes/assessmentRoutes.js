// server/routes/assessmentRoutes.js
import express from 'express';
import { submitAssessment, getCurrentPlanPackage } from '../controllers/assessmentController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/', authenticateToken, submitAssessment);
router.get('/current', authenticateToken, getCurrentPlanPackage);
router.post('/retake', authenticateToken, submitAssessment);

export default router;
