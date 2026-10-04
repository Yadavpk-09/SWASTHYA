// server/config/db.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import {
  initialUsers,
  initialExercises,
  initialAsanas,
  initialWorkoutPlans,
  initialBadges,
  initialProgressLogs,
  initialWellnessLogs,
  foodDatabase,
  stressRoadmapData
} from './seedData.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

// Initialize database with seed data if file doesn't exist
function initDb() {
  if (!fs.existsSync(DB_FILE)) {
    const data = {
      users: initialUsers,
      exercises: initialExercises,
      asanas: initialAsanas,
      workoutPlans: initialWorkoutPlans,
      badges: initialBadges,
      progressLogs: initialProgressLogs,
      wellnessLogs: initialWellnessLogs,
      foodItems: foodDatabase,
      stressRoadmaps: stressRoadmapData
    };
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    console.log('Database initialized with default SWASTHYA seed data.');
  }
}

initDb();

export const readDb = () => {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    console.error('Error reading db.json, reinitializing...', err);
    initDb();
    return JSON.parse(fs.readFileSync(DB_FILE, 'utf-8'));
  }
};

export const writeDb = (data) => {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    console.error('Error writing to db.json:', err);
    return false;
  }
};

export const db = {
  getCollection: (name) => {
    const current = readDb();
    return current[name] || [];
  },

  findById: (collectionName, id) => {
    const current = readDb();
    const list = current[collectionName] || [];
    return list.find((item) => item.id === id) || null;
  },

  findOne: (collectionName, predicate) => {
    const current = readDb();
    const list = current[collectionName] || [];
    return list.find(predicate) || null;
  },

  find: (collectionName, filter = {}) => {
    const current = readDb();
    let list = current[collectionName] || [];
    const keys = Object.keys(filter);
    if (keys.length === 0) return list;

    return list.filter((item) => {
      return keys.every((key) => {
        if (filter[key] === undefined) return true;
        return item[key] === filter[key];
      });
    });
  },

  insert: (collectionName, item) => {
    const current = readDb();
    if (!current[collectionName]) current[collectionName] = [];
    current[collectionName].push(item);
    writeDb(current);
    return item;
  },

  updateById: (collectionName, id, updates) => {
    const current = readDb();
    const list = current[collectionName] || [];
    const index = list.findIndex((item) => item.id === id);
    if (index === -1) return null;

    current[collectionName][index] = {
      ...list[index],
      ...updates
    };
    writeDb(current);
    return current[collectionName][index];
  },

  deleteById: (collectionName, id) => {
    const current = readDb();
    const list = current[collectionName] || [];
    const filtered = list.filter((item) => item.id !== id);
    if (filtered.length === list.length) return false;

    current[collectionName] = filtered;
    writeDb(current);
    return true;
  }
};
