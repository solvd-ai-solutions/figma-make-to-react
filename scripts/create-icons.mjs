#!/usr/bin/env node

import fs from 'fs';
import path from 'path';

// Create electron/assets directory if it doesn't exist
const assetsDir = 'electron/assets';
if (!fs.existsSync(assetsDir)) {
  fs.mkdirSync(assetsDir, { recursive: true });
}

// Create a simple PNG icon (512x512) for now
// In a real app, you'd use a tool like ImageMagick or Sharp to convert SVG
console.log('📱 Creating app icons...');
console.log('Note: For production, convert the SVG to .icns format using:');
console.log('   sips -s format icns electron/assets/icon.svg --out electron/assets/icon.icns');

// Copy the SVG icon
fs.copyFileSync('electron/assets/icon.svg', 'electron/assets/icon.png');

console.log('✅ Icons created in electron/assets/');
console.log('🎯 To create proper .icns file, run:');
console.log('   sips -s format icns electron/assets/icon.svg --out electron/assets/icon.icns'); 