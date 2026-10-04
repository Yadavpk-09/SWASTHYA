// server/controllers/gamificationController.js
import { db } from '../config/db.js';

export const getLeaderboard = async (req, res) => {
  try {
    const allUsers = db.getCollection('users');

    // Filter only active users and map public fields
    const ranked = allUsers
      .filter((u) => u.status !== 'deactivated')
      .map((u) => ({
        id: u.id,
        name: u.name,
        role: u.role,
        avatarUrl: u.profile?.avatarUrl,
        goal: u.profile?.goal,
        points: u.points || 0,
        currentStreak: u.currentStreak || 0,
        level: u.level || 1,
        earnedBadgesCount: (u.earnedBadges || []).length
      }))
      .sort((a, b) => b.points - a.points);

    // Add rank index
    const leaderboardWithRank = ranked.map((item, index) => ({
      rank: index + 1,
      ...item
    }));

    res.json(leaderboardWithRank);
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve leaderboard.' });
  }
};

export const getBadges = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = db.findById('users', userId);
    const allBadges = db.getCollection('badges');

    const userBadgeSet = new Set(user.earnedBadges || []);

    const badgesWithStatus = allBadges.map((badge) => ({
      ...badge,
      unlocked: userBadgeSet.has(badge.id)
    }));

    res.json({
      badges: badgesWithStatus,
      totalEarned: userBadgeSet.size,
      totalAvailable: allBadges.length,
      currentPoints: user.points || 0,
      userLevel: user.level || 1
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to retrieve badges.' });
  }
};
