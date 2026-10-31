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

// Root endpoint - Server overview, status & navigation
app.get('/', (req, res) => {
  if (req.accepts('html')) {
    res.send(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>SWASTHYA Backend API Server v2.0</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif;
      background: radial-gradient(circle at top, #131c31 0%, #0b0f19 100%);
      color: #f8fafc;
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
    }
    .card {
      background: rgba(19, 27, 46, 0.85);
      border: 1px solid rgba(255, 255, 255, 0.1);
      backdrop-filter: blur(16px);
      border-radius: 24px;
      padding: clamp(24px, 5vw, 44px);
      max-width: 680px;
      width: 100%;
      box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.7), 0 0 30px rgba(16, 185, 129, 0.15);
      text-align: center;
    }
    .badge {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 16px;
      border-radius: 999px;
      background: rgba(16, 185, 129, 0.15);
      border: 1px solid rgba(16, 185, 129, 0.35);
      color: #34d399;
      font-size: 0.85rem;
      font-weight: 700;
      margin-bottom: 20px;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: #10b981;
      box-shadow: 0 0 10px #10b981;
      animation: pulse 1.8s infinite;
    }
    @keyframes pulse {
      0%, 100% { transform: scale(1); opacity: 1; }
      50% { transform: scale(1.4); opacity: 0.6; }
    }
    h1 {
      font-size: clamp(1.8rem, 4vw, 2.3rem);
      font-weight: 800;
      letter-spacing: -0.02em;
      margin-bottom: 12px;
      background: linear-gradient(135deg, #ffffff 30%, #a7f3d0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
    p.lead {
      color: #94a3b8;
      font-size: 1rem;
      line-height: 1.6;
      margin-bottom: 28px;
    }
    .btn-primary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      padding: 14px 32px;
      border-radius: 14px;
      background: linear-gradient(135deg, #10b981 0%, #06b6d4 100%);
      color: #ffffff;
      font-size: 1rem;
      font-weight: 700;
      text-decoration: none;
      box-shadow: 0 10px 25px rgba(16, 185, 129, 0.4);
      transition: all 0.2s ease;
      cursor: pointer;
      border: none;
    }
    .btn-primary:hover {
      transform: translateY(-2px);
      box-shadow: 0 15px 30px rgba(16, 185, 129, 0.5);
    }
    .btn-secondary {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      padding: 12px 24px;
      border-radius: 12px;
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid rgba(255, 255, 255, 0.15);
      color: #cbd5e1;
      font-size: 0.9rem;
      font-weight: 600;
      text-decoration: none;
      transition: all 0.2s ease;
      margin-left: 10px;
    }
    .btn-secondary:hover {
      background: rgba(255, 255, 255, 0.1);
      color: #ffffff;
    }
    .endpoints-container {
      margin-top: 32px;
      padding-top: 24px;
      border-top: 1px solid rgba(255, 255, 255, 0.08);
      text-align: left;
    }
    .endpoints-title {
      font-size: 0.8rem;
      font-weight: 700;
      color: #64748b;
      text-transform: uppercase;
      letter-spacing: 0.05em;
      margin-bottom: 12px;
    }
    .endpoints-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 8px;
    }
    .endpoint-chip {
      background: rgba(255, 255, 255, 0.04);
      border: 1px solid rgba(255, 255, 255, 0.08);
      padding: 4px 10px;
      border-radius: 8px;
      font-family: monospace;
      font-size: 0.78rem;
      color: #38bdf8;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="badge">
      <div class="pulse-dot"></div>
      <span>SWASTHYA API Server v2.0 • Online</span>
    </div>
    <h1>Backend Service is Running</h1>
    <p class="lead">
      You are viewing the REST API backend on port <strong>5000</strong>.<br/>
      To use the full SWASTHYA Web Application (Dashboard, Plans, Workouts, and Yoga), click below to launch the frontend interface:
    </p>
    <div style="display: flex; justify-content: center; flex-wrap: wrap; gap: 12px;">
      <a href="http://localhost:5173" class="btn-primary">
        <span>🚀 Open Web App (localhost:5173)</span>
      </a>
      <a href="/api/health" class="btn-secondary">
        <span>🩺 Health Check API</span>
      </a>
    </div>
    <div class="endpoints-container">
      <div class="endpoints-title">Active API Endpoints (JSON)</div>
      <div class="endpoints-grid">
        <span class="endpoint-chip">/api/auth</span>
        <span class="endpoint-chip">/api/plans</span>
        <span class="endpoint-chip">/api/assessment</span>
        <span class="endpoint-chip">/api/exercises</span>
        <span class="endpoint-chip">/api/asanas</span>
        <span class="endpoint-chip">/api/breathing</span>
        <span class="endpoint-chip">/api/roadmap</span>
        <span class="endpoint-chip">/api/nutrition</span>
        <span class="endpoint-chip">/api/wellness</span>
        <span class="endpoint-chip">/api/progress</span>
        <span class="endpoint-chip">/api/gamification</span>
        <span class="endpoint-chip">/api/admin</span>
      </div>
    </div>
  </div>
</body>
</html>`);
    return;
  }

  res.json({
    status: 'online',
    platform: 'SWASTHYA - Personalized Fitness & Yoga Management Platform API',
    version: '2.0',
    clientUrl: 'http://localhost:5173',
    healthCheck: '/api/health',
    endpoints: [
      '/api/auth',
      '/api/plans',
      '/api/assessment',
      '/api/exercises',
      '/api/asanas',
      '/api/breathing',
      '/api/roadmap',
      '/api/nutrition',
      '/api/wellness',
      '/api/progress',
      '/api/gamification',
      '/api/admin',
      '/api/chat'
    ]
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    platform: 'SWASTHYA - Personalized Fitness & Yoga Management Platform API',
    version: '2.0',
    timestamp: new Date().toISOString()
  });
});

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`SWASTHYA Backend API Server v2.0 running on http://localhost:${PORT}`);
  });
}

export default app;

