// server/controllers/roadmapController.js
import { db } from '../config/db.js';
import { awardPointsAndEvaluateBadges } from '../services/pointsEngine.js';

export const getRoadmapByCategory = async (req, res) => {
  try {
    const { category = 'medium' } = req.params;
    const cat = category.toLowerCase();
    const roadmaps = db.getCollection('stressRoadmaps');
    const roadmap = roadmaps[cat] || roadmaps['medium'];

    if (!roadmap) {
      return res.status(404).json({ error: 'Roadmap not found.' });
    }

    const allAsanas = db.getCollection('asanas');
    const allBreathing = db.getCollection('breathingTechniques');
    const allMeditations = db.getCollection('meditations');

    // Populate each step's referenced asset
    const populatedSteps = (roadmap.steps || []).map((step) => {
      let populatedRef = null;
      if (step.refType === 'asana') {
        populatedRef = allAsanas.find((a) => a.id === step.refId) || null;
      } else if (step.refType === 'breathing') {
        populatedRef = allBreathing.find((b) => b.id === step.refId) || null;
      } else if (step.refType === 'meditation') {
        populatedRef = allMeditations.find((m) => m.id === step.refId) || null;
      }

      return {
        ...step,
        referenceData: populatedRef
      };
    });

    res.json({
      ...roadmap,
      steps: populatedSteps
    });
  } catch (err) {
    console.error('Error fetching roadmap:', err);
    res.status(500).json({ error: 'Failed to fetch stress roadmap.' });
  }
};

export const completeRoadmapStep = async (req, res) => {
  try {
    const userId = req.user.id;
    const { stepNumber, category, stepTitle } = req.body;

    const logEntry = {
      id: 'prog-' + Date.now(),
      userId,
      date: new Date().toISOString().split('T')[0],
      type: 'workout',
      details: `Stress Protocol Step ${stepNumber}: ${stepTitle}`,
      durationMinutes: 5,
      calories: 15,
      value: `Completed step ${stepNumber} in ${category} stress roadmap`
    };

    db.insert('progressLogs', logEntry);

    const result = awardPointsAndEvaluateBadges(userId, 'COMPLETE_BREATHING');
    const { passwordHash: _, ...safeUser } = result.user;

    res.json({
      message: `Step ${stepNumber} completed! Keep going.`,
      log: logEntry,
      user: safeUser,
      addedPoints: result.addedPoints,
      newlyUnlockedBadges: result.newlyUnlocked
    });
  } catch (err) {
    console.error('Error completing roadmap step:', err);
    res.status(500).json({ error: 'Failed to complete roadmap step.' });
  }
};
