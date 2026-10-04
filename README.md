# SWASTHYA - Personalized Fitness & Yoga Management Platform 🌿💪

A comprehensive, full-stack fitness, yoga, and wellness management platform featuring personalized workout routines, guided yoga asanas, nutrition tracking, interactive wellness monitors, AI fitness chatbot, and gamified leaderboards.

---

## 🚀 Features

- **Personalized Workout & Yoga Plans:** Dynamic plan generation based on fitness goals, activity levels, and preferences.
- **Yoga & Asana Library:** Curated postures with difficulty ratings, benefits, step-by-step guidance, and interactive timers.
- **Breathing & Meditation Library:** Guided pranayama routines with visual pacing animations and sound feedback.
- **Wellness & Health Trackers:** Integrated trackers for daily water intake, sleep cycles, and calorie logging.
- **Nutrition Planner:** Daily macronutrient and caloric target calculations with customizable meal logging.
- **AI FitBot Assistant:** Interactive virtual fitness assistant for health advice, workout questions, and motivation.
- **Gamification & Leaderboard:** Earn XP, badges, streaks, and rank on community leaderboards.
- **Admin Dashboard:** Role-based administrative management for users, exercises, analytics, and platform content.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, Vite 5, Tailwind-compatible CSS / Custom Styling, Lucide Icons, Recharts, Canvas-Confetti
- **Backend:** Node.js, Express.js, REST API Architecture, JWT Authentication, bcryptjs
- **Database:** Local JSON File-Based Database (`server/data/db.json`)

---

## ⚡ Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- `npm`

### 1. Installation

Install dependencies for both client and server:

```bash
# Install root, backend, and frontend packages
npm run install:all
```
*(Or install individually inside `/server` and `/client` directories)*

---

### 2. Running Locally

#### Run Both Frontend and Backend Concurrently:
```bash
npm run dev
```

> **Windows PowerShell Users:** If PowerShell prevents script execution (`npm.ps1 cannot be loaded`), run:
> ```powershell
> npm.cmd run dev
> ```

---

### 3. Application URLs

- **Frontend Application:** [http://localhost:5173](http://localhost:5173)
- **Backend API Server:** [http://localhost:5000](http://localhost:5000)
- **API Health Check:** [http://localhost:5000/api/health](http://localhost:5000/api/health)

---

## 📁 Project Structure

```
SWASTHYA/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # UI modules (yoga, workout, wellness, chatbot)
│   │   ├── context/        # Auth & Toast context providers
│   │   ├── pages/          # Application views (Dashboard, Yoga, Nutrition, etc.)
│   │   ├── services/       # Frontend API client
│   │   └── styles/         # Global styles
│   └── vite.config.js      # Vite configuration
│
├── server/                 # Backend Express application
│   ├── config/             # DB seeding & configuration
│   ├── controllers/        # Route controllers (Auth, Plans, Yoga, Admin, etc.)
│   ├── data/               # db.json database store
│   ├── middleware/         # JWT authentication & role-based access
│   ├── routes/             # API routing
│   └── server.js           # Server entry point
│
└── package.json            # Root workspace scripts
```

---

## 📄 License
ISC
