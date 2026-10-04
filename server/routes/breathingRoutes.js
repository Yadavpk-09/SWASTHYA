// server/routes/breathingRoutes.js
import express from 'express';
import {
  getAllBreathingTechniques,
  getBreathingTechniqueById,
  completeBreathingSession
} from '../controllers/breathingController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.get('/', getAllBreathingTechniques);
router.get('/:id', getBreathingTechniqueById);
router.post('/complete', authenticateToken, completeBreathingSession);

export default router;
