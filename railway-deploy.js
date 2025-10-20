#!/usr/bin/env node

// Railway deployment script
// This ensures only backend files are processed

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Railway Backend Deployment Script');
console.log('====================================');

// Check if we're in the backend directory
const backendPath = path.join(__dirname, 'backend');
if (!fs.existsSync(backendPath)) {
  console.error('❌ Backend directory not found!');
  process.exit(1);
}

// Copy backend package.json to root for Railway
const backendPackagePath = path.join(backendPath, 'package.json');
const rootPackagePath = path.join(__dirname, 'package.json');

if (fs.existsSync(backendPackagePath)) {
  console.log('📦 Copying backend package.json...');
  fs.copyFileSync(backendPackagePath, rootPackagePath);
  console.log('✅ Backend package.json copied');
}

// Install dependencies in backend directory
console.log('📥 Installing backend dependencies...');
try {
  execSync('cd backend && npm ci --production', { stdio: 'inherit' });
  console.log('✅ Dependencies installed');
} catch (error) {
  console.error('❌ Failed to install dependencies:', error.message);
  process.exit(1);
}

console.log('🎉 Railway deployment preparation complete!');
console.log('Backend ready for deployment');
