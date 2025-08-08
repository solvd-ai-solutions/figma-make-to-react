#!/usr/bin/env node

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

console.log('🚀 Building Figma Converter Desktop App...');
console.log('==========================================');

try {
  // Step 1: Install dependencies if needed
  console.log('📦 Checking dependencies...');
  if (!fs.existsSync('node_modules/electron')) {
    console.log('Installing Electron dependencies...');
    execSync('npm install', { stdio: 'inherit' });
  }

  // Step 2: Build Next.js app
  console.log('🔨 Building Next.js app...');
  execSync('npm run build', { stdio: 'inherit' });

  // Step 3: Build Electron app
  console.log('⚡ Building Electron app...');
  execSync('npm run electron-dist', { stdio: 'inherit' });

  console.log('✅ Build complete!');
  console.log('');
  console.log('📁 Your app is ready in: dist/');
  console.log('🎯 To install in Applications:');
  console.log('   cp -r dist/mac/Figma\ Converter.app /Applications/');
  console.log('');
  console.log('🚀 To run the app:');
  console.log('   open dist/mac/Figma\ Converter.app');

} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
} 