// server/routes/asanaRoutes.js
import express from 'express';
import {
  getAllAsanas,
  getAsanaById,
  getStressRoadmap,
  completeBreathingSession,
  getAllMeditations,
  completeMeditationSession
} from '../controllers/asanaController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllAsanas);
router.get('/meditations', getAllMeditations);
router.get('/stress-roadmap', getStressRoadmap);
router.get('/:id', getAsanaById);
router.post('/breathing/complete', authenticateToken, completeBreathingSession);
router.post('/meditations/complete', authenticateToken, completeMeditationSession);

export default router;
