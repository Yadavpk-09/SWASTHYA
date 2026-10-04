// server/middleware/auth.js
import jwt from 'jsonwebtoken';
import { db } from '../config/db.js';

export const JWT_SECRET = process.env.JWT_SECRET || 'swasthya_jwt_super_secret_key_2026';

export const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required. Please log in.' });
  }

  jwt.verify(token, JWT_SECRET, (err, userPayload) => {
    if (err) {
      return res.status(403).json({ error: 'Invalid or expired session token.' });
    }

    const user = db.findById('users', userPayload.id);
    if (!user) {
      return res.status(404).json({ error: 'User account not found.' });
    }

    req.user = user;
    next();
  });
};
