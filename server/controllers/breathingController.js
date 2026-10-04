// server/controllers/breathingController.js
import { db } from '../config/db.js';
import { awardPointsAndEvaluateBadges } from '../services/pointsEngine.js';

export const getAllBreathingTechniques = async (req, res) => {
  try {
    const { tag, difficulty, search } = req.query;
    let list = db.getCollection('breathingTechniques');

    if (tag && tag !== 'All') {
      list = list.filter((b) => (b.tags || []).some((t) => t.toLowerCase() === tag.toLowerCase()));
    }

    if (difficulty && difficulty !== 'All') {
      list = list.filter((b) => b.difficulty.toLowerCase() === difficulty.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      list = list.filter((b) =>
        b.name.toLowerCase().includes(q) ||
        (b.sanskritName && b.sanskritName.toLowerCase().includes(q)) ||
        (b.tags || []).some((t) => t.toLowerCase().includes(q))
      );
    }

    res.json(list);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch breathing techniques.' });
  }
};

export const getBreathingTechniqueById = async (req, res) => {
  try {
    const { id } = req.params;
    const item = db.findById('breathingTechniques', id);
    if (!item) {
      return res.status(404).json({ error: 'Breathing technique not found.' });
    }
    res.json(item);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch breathing technique.' });
  }
};

export const completeBreathingSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { techniqueId, durationMinutes = 4, techniqueName } = req.body;

    const technique = db.findById('breathingTechniques', techniqueId);
    const title = technique ? technique.name : (techniqueName || 'Mindful Breathing');

    const logEntry = {
      id: 'prog-' + Date.now(),
      userId,
      date: new Date().toISOString().split('T')[0],
      type: 'workout',
      details: `Breathing Session: ${title}`,
      durationMinutes: Number(durationMinutes) || 4,
      calories: 20,
      value: `${durationMinutes} mins mindful breath control`
    };

    db.insert('progressLogs', logEntry);

    const result = awardPointsAndEvaluateBadges(userId, 'COMPLETE_BREATHING');
    const { passwordHash: _, ...safeUser } = result.user;

    res.json({
      message: `Completed ${title}! Points awarded.`,
      log: logEntry,
      user: safeUser,
      addedPoints: result.addedPoints,
      newlyUnlockedBadges: result.newlyUnlocked
    });
  } catch (err) {
    console.error('Error logging breathing session:', err);
    res.status(500).json({ error: 'Failed to log breathing completion.' });
  }
};
