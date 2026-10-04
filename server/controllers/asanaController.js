// server/controllers/asanaController.js
import { db } from '../config/db.js';
import { awardPointsAndEvaluateBadges } from '../services/pointsEngine.js';

export const getAllAsanas = async (req, res) => {
  try {
    const { category, difficulty, search } = req.query;
    let list = db.getCollection('asanas');

    if (category && category !== 'All') {
      list = list.filter((a) => a.category.toLowerCase().includes(category.toLowerCase()));
    }

    if (difficulty && difficulty !== 'All') {
      list = list.filter((a) => a.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(
        (a) =>
          a.name.toLowerCase().includes(q) ||
          a.sanskritName.toLowerCase().includes(q) ||
          a.category.toLowerCase().includes(q) ||
          (a.benefits || []).some((b) => b.toLowerCase().includes(q))
      );
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch asanas.' });
  }
};

export const getAsanaById = async (req, res) => {
  try {
    const { id } = req.params;
    const asana = db.findById('asanas', id);
    if (!asana) {
      return res.status(404).json({ error: 'Asana not found.' });
    }
    res.json(asana);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch asana.' });
  }
};

export const getStressRoadmap = async (req, res) => {
  try {
    const { level = 'medium' } = req.query; // 'low' | 'medium' | 'high'
    const roadmaps = db.getCollection('stressRoadmaps');
    const selected = roadmaps[level] || roadmaps['medium'];

    const allAsanas = db.getCollection('asanas');
    const enrichedAsanas = (selected.recommendedAsanas || []).map((id) => {
      return allAsanas.find((a) => a.id === id) || null;
    }).filter(Boolean);

    res.json({
      level,
      ...selected,
      recommendedAsanasDetailed: enrichedAsanas
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to generate stress roadmap.' });
  }
};

export const completeBreathingSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { technique = 'Box Breathing', durationSeconds = 180 } = req.body;

    const logEntry = {
      id: 'prog-' + Date.now(),
      userId,
      date: new Date().toISOString().split('T')[0],
      type: 'workout',
      details: `Guided Breathing: ${technique}`,
      durationMinutes: Math.round(durationSeconds / 60) || 3,
      calories: 25,
      value: `${Math.round(durationSeconds / 60)} min mindful breathwork`
    };

    db.insert('progressLogs', logEntry);

    const result = awardPointsAndEvaluateBadges(userId, 'COMPLETE_BREATHING');
    const { passwordHash: _, ...safeUser } = result.user;

    res.json({
      message: 'Mindful breathing session recorded!',
      log: logEntry,
      user: safeUser,
      addedPoints: result.addedPoints,
      newlyUnlockedBadges: result.newlyUnlocked
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log breathing session.' });
  }
};

export const getAllMeditations = async (req, res) => {
  try {
    const meditations = db.getCollection('meditations');
    res.json(meditations);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch meditations.' });
  }
};

export const completeMeditationSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { title = 'Mindful Meditation', durationMinutes = 10 } = req.body;

    const logEntry = {
      id: 'prog-' + Date.now(),
      userId,
      date: new Date().toISOString().split('T')[0],
      type: 'workout',
      details: `Meditation: ${title}`,
      durationMinutes: Number(durationMinutes) || 10,
      calories: 30,
      value: `${durationMinutes} min curated meditation`
    };

    db.insert('progressLogs', logEntry);

    const result = awardPointsAndEvaluateBadges(userId, 'COMPLETE_BREATHING');
    const { passwordHash: _, ...safeUser } = result.user;

    res.json({
      message: 'Meditation session completed and logged!',
      log: logEntry,
      user: safeUser,
      addedPoints: result.addedPoints,
      newlyUnlockedBadges: result.newlyUnlocked
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to log meditation session.' });
  }
};

