// server/routes/exerciseRoutes.js
import express from 'express';
import { getAllExercises, getExerciseById } from '../controllers/exerciseController.js';

const router = express.Router();

router.get('/', getAllExercises);
router.get('/:id', getExerciseById);

export default router;
