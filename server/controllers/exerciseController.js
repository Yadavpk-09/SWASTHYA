// server/controllers/exerciseController.js
import { db } from '../config/db.js';

export const getAllExercises = async (req, res) => {
  try {
    const { muscle, equipment, difficulty, search } = req.query;
    let list = db.getCollection('exercises');

    if (muscle && muscle !== 'All') {
      list = list.filter((e) => e.muscleGroup.toLowerCase() === muscle.toLowerCase());
    }

    if (equipment && equipment !== 'All') {
      list = list.filter((e) => e.equipment.toLowerCase() === equipment.toLowerCase());
    }

    if (difficulty && difficulty !== 'All') {
      list = list.filter((e) => e.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.muscleGroup.toLowerCase().includes(q) ||
          (e.targetMuscles || []).some((m) => m.toLowerCase().includes(q))
      );
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercises.' });
  }
};

export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    const exercise = db.findById('exercises', id);
    if (!exercise) {
      return res.status(404).json({ error: 'Exercise not found.' });
    }
    res.json(exercise);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch exercise.' });
  }
};
