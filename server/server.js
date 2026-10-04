// server/server.js
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import planRoutes from './routes/planRoutes.js';
import exerciseRoutes from './routes/exerciseRoutes.js';
import asanaRoutes from './routes/asanaRoutes.js';
import wellnessRoutes from './routes/wellnessRoutes.js';
import progressRoutes from './routes/progressRoutes.js';
import gamificationRoutes from './routes/gamificationRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import assessmentRoutes from './routes/assessmentRoutes.js';
import breathingRoutes from './routes/breathingRoutes.js';
import roadmapRoutes from './routes/roadmapRoutes.js';
import nutritionRoutes from './routes/nutritionRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/plans', planRoutes);
app.use('/api/exercises', exerciseRoutes);
app.use('/api/asanas', asanaRoutes);
app.use('/api/wellness', wellnessRoutes);
app.use('/api/progress', progressRoutes);
app.use('/api/gamification', gamificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/chat', chatRoutes);

// New PRD Modules routes
app.use('/api/assessment', assessmentRoutes);
app.use('/api/breathing', breathingRoutes);
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/nutrition', nutritionRoutes);

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'SWASTHYA - Personalized Fitness & Yoga Management Platform API',
    version: '2.0',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, () => {
  console.log(`SWASTHYA Backend API Server v2.0 running on http://localhost:${PORT}`);
});

