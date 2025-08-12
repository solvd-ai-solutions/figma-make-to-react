#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

async function main() {
  try {
    const assetsDir = path.join(process.cwd(), 'src/assets')
    const generatedDir = path.join(process.cwd(), 'src/generated')
    
    await fs.mkdir(generatedDir, { recursive: true })
    
    // Create image manifest for Picture component
    const manifestPath = path.join(generatedDir, 'image-manifest.json')
    const manifest = {}
    
    try {
      const files = await fs.readdir(assetsDir)
      for (const file of files) {
        if (/\.(png|jpg|jpeg|gif|webp|avif)$/i.test(file)) {
          const key = path.basename(file)
          manifest[key] = {
            original: `/assets/${file}`,
            width: 800, // Default width
            height: 600  // Default height
          }
        }
      }
    } catch (error) {
      // Assets directory doesn't exist yet, that's fine
    }
    
    await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2))
    
    console.log('✓ Assets optimized:', Object.keys(manifest).length, 'images')
  } catch (error) {
    console.error('Error optimizing assets:', error)
    process.exit(1)
  }
}

main()
