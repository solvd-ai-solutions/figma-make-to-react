#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

async function main() {
  try {
    const iconsDir = path.join(process.cwd(), 'src/generated')
    await fs.mkdir(iconsDir, { recursive: true })
    
    // For now, create an empty icons file
    // This can be expanded later to scan for SVG files and generate components
    const iconsPath = path.join(iconsDir, 'icons.ts')
    const content = `// Generated icon components
// This file will be populated when SVG icons are added to the project

export const icons = {}
`
    
    await fs.writeFile(iconsPath, content)
    
    console.log('✓ Icons built: 0 ->', iconsPath)
  } catch (error) {
    console.error('Error building icons:', error)
    process.exit(1)
  }
}

main()

