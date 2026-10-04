import express from 'express';
import {
  getAdminStats,
  getAllUsers,
  toggleUserStatus,
  createExercise,
  updateExercise,
  deleteExercise,
  createAsana,
  updateAsana,
  deleteAsana,
  createPlan,
  updatePlan,
  deletePlan,
  getAllBreathingAdmin,
  createBreathingAdmin,
  updateBreathingAdmin,
  deleteBreathingAdmin,
  getAllDietPlansAdmin,
  createDietPlanAdmin,
  updateDietPlanAdmin,
  deleteDietPlanAdmin,
  getAllRoadmapsAdmin,
  updateRoadmapStepAdmin
} from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';
import { requireAdmin } from '../middleware/roleCheck.js';

const router = express.Router();

// Enforce auth and admin role for all admin routes
router.use(authenticateToken, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.patch('/users/:userId/status', toggleUserStatus);

// Exercises CRUD
router.post('/exercises', createExercise);
router.put('/exercises/:id', updateExercise);
router.delete('/exercises/:id', deleteExercise);

// Asanas CRUD
router.post('/asanas', createAsana);
router.put('/asanas/:id', updateAsana);
router.delete('/asanas/:id', deleteAsana);

// Workout Plans CRUD
router.post('/plans', createPlan);
router.put('/plans/:id', updatePlan);
router.delete('/plans/:id', deletePlan);

// Breathing Techniques CRUD (PRD FR12.3)
router.get('/breathing', getAllBreathingAdmin);
router.post('/breathing', createBreathingAdmin);
router.put('/breathing/:id', updateBreathingAdmin);
router.delete('/breathing/:id', deleteBreathingAdmin);

// Diet Plans CRUD (PRD FR12.3)
router.get('/diet-plans', getAllDietPlansAdmin);
router.post('/diet-plans', createDietPlanAdmin);
router.put('/diet-plans/:id', updateDietPlanAdmin);
router.delete('/diet-plans/:id', deleteDietPlanAdmin);

// Stress Roadmaps CRUD (PRD FR12.4)
router.get('/roadmaps', getAllRoadmapsAdmin);
router.put('/roadmaps/:category/step/:stepIndex', updateRoadmapStepAdmin);

export default router;
