// start.js - Cross-platform dev launcher for SWASTHYA (runs backend + frontend)
const { spawn } = require('child_process');
const path = require('path');

console.log('\n🌿 Starting SWASTHYA Platform...');
console.log('--------------------------------------------');

// 1. Start Express Backend
const server = spawn('node', ['server.js'], {
  cwd: path.join(__dirname, 'server'),
  stdio: 'inherit',
  shell: true
});

// 2. Start Vite Frontend
const vitePath = path.join(__dirname, 'client', 'node_modules', 'vite', 'bin', 'vite.js');
const client = spawn('node', [vitePath], {
  cwd: path.join(__dirname, 'client'),
  stdio: 'inherit',
  shell: true
});

const cleanup = () => {
  console.log('\n🛑 Stopping SWASTHYA servers...');
  try { server.kill(); } catch (e) {}
  try { client.kill(); } catch (e) {}
  process.exit();
};

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
