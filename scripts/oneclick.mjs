#!/usr/bin/env node
// One-click local converter: ingest a Figma Make ZIP/folder/CSS, run pipeline, open in Cursor

import { promises as fs } from 'fs'
import path from 'path'
import os from 'os'
import { fileURLToPath } from 'url'
import { exec } from 'child_process'
import { promisify } from 'util'
import AdmZip from 'adm-zip'

const execAsync = promisify(exec)
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

async function main() {
  const input = process.argv[2]
  if (!input) {
    console.error('Usage: node scripts/oneclick.mjs <path-to-figma-zip|folder|css>')
    process.exit(1)
  }

  const projectRoot = path.resolve(__dirname, '..')
  const codeDir = path.join(projectRoot, 'figma-exports', 'code')
  const assetsDir = path.join(projectRoot, 'figma-exports', 'assets')

  const absInput = path.resolve(process.cwd(), input)
  const stat = await fs.stat(absInput).catch(() => null)
  if (!stat) {
    console.error(`Input not found: ${absInput}`)
    process.exit(1)
  }

  console.log('✨ One-click: preparing workspace')
  await fs.mkdir(codeDir, { recursive: true })
  await fs.mkdir(assetsDir, { recursive: true })
  await clearDir(codeDir)
  await clearDir(assetsDir)

  console.log('📦 Ingesting input:', absInput)
  if (stat.isFile() && absInput.toLowerCase().endsWith('.zip')) {
    await extractZip(absInput, codeDir, assetsDir)
  } else if (stat.isDirectory()) {
    await ingestDir(absInput, codeDir, assetsDir)
  } else if (stat.isFile() && absInput.toLowerCase().endsWith('.css')) {
    await fs.copyFile(absInput, path.join(codeDir, path.basename(absInput)))
  } else {
    console.error('Unsupported input. Provide a ZIP, folder, or CSS file.')
    process.exit(1)
  }

  console.log('🧠 Generating HTML from CSS (if needed)')
  await ensureGeneratedHtml(codeDir)

  // Run pipeline
  await runStep('Design tokens', 'npm run tokens', projectRoot)
  await runStep('Icons', 'npm run icons', projectRoot)
  await runStep('Convert → React', 'npm run convert', projectRoot)
  await runStep('Assets', 'npm run assets', projectRoot)
  await runStep('QA', 'npm run qa', projectRoot, true) // do not fail build if QA fails
  await runStep('Stories', 'npm run stories', projectRoot, true)

  console.log('🔓 Opening project in Cursor…')
  try {
    await execAsync(`open -a "Cursor" "${projectRoot}"`)
    console.log('✅ Project opened in Cursor')
  } catch {
    console.log('ℹ️ Could not open Cursor automatically. Open the folder manually in Cursor.')
  }

  console.log('🚀 Done! Start the dev server with:')
  console.log('   npm run dev')
}

async function runStep(label, command, cwd, soft = false) {
  process.stdout.write(`▶ ${label}… `)
  try {
    await execAsync(command, { cwd })
    console.log('done')
  } catch (err) {
    console.log(soft ? 'skipped (non-fatal)' : 'failed')
    if (!soft) throw err
  }
}

async function clearDir(dir) {
  try {
    const files = await fs.readdir(dir)
    await Promise.all(files.map((f) => fs.rm(path.join(dir, f), { recursive: true, force: true })))
  } catch {}
}

async function extractZip(zipPath, codeDir, assetsDir) {
  const zip = new AdmZip(zipPath)
  for (const entry of zip.getEntries()) {
    if (entry.isDirectory) continue
    const name = entry.entryName
    const lower = name.toLowerCase()
    const data = entry.getData()
    if (lower.endsWith('.css') || lower.endsWith('.html') || lower.endsWith('.htm')) {
      const out = path.join(codeDir, path.basename(name))
      await fs.writeFile(out, data)
    } else if (/(png|jpe?g|svg|gif|webp|ico)$/i.test(lower)) {
      const out = path.join(assetsDir, path.basename(name))
      await fs.writeFile(out, data)
    }
  }
}

async function ingestDir(root, codeDir, assetsDir) {
  const stack = [root]
  while (stack.length) {
    const dir = stack.pop()
    const items = await fs.readdir(dir, { withFileTypes: true })
    for (const it of items) {
      const full = path.join(dir, it.name)
      if (it.isDirectory()) {
        stack.push(full)
      } else {
        const lower = it.name.toLowerCase()
        if (lower.endsWith('.css') || lower.endsWith('.html') || lower.endsWith('.htm')) {
          await fs.copyFile(full, path.join(codeDir, it.name))
        } else if (/(png|jpe?g|svg|gif|webp|ico)$/i.test(lower)) {
          await fs.copyFile(full, path.join(assetsDir, it.name))
        }
      }
    }
  }
}

async function ensureGeneratedHtml(codeDir) {
  const files = await fs.readdir(codeDir)
  const hasHtml = files.some((f) => /\.html?$/i.test(f))
  if (hasHtml) return
  const cssFile = files.find((f) => f.toLowerCase().endsWith('.css'))
  if (!cssFile) return
  const cssContent = await fs.readFile(path.join(codeDir, cssFile), 'utf-8')
  const html = generateHTMLFromCSS(cssContent)
  await fs.writeFile(path.join(codeDir, 'generated.html'), html, 'utf-8')
}

function generateHTMLFromCSS(cssContent) {
  const classMatches = cssContent.match(/\.([a-zA-Z0-9_-]+)/g) || []
  const uniqueClasses = [...new Set(classMatches)].map((c) => c.slice(1))
  let html = '<!DOCTYPE html>\n<html lang="en">\n<head>\n<meta charset="UTF-8">\n<meta name="viewport" content="width=device-width, initial-scale=1.0">\n<title>Figma Make Export</title>\n<link rel="stylesheet" href="styles.css">\n</head>\n<body>\n'
  const mainClasses = uniqueClasses.filter((c) => c.includes('container') || c.includes('section') || c.includes('header') || c.includes('footer') || c.includes('main') || c.includes('nav'))
  if (mainClasses.length > 0) {
    html += `<div class="${mainClasses[0]}">\n`
    html += '  <header class="header">\n'
    html += '    <nav class="nav">\n'
    html += '      <div class="nav-item">Home</div>\n'
    html += '      <div class="nav-item">About</div>\n'
    html += '      <div class="nav-item">Contact</div>\n'
    html += '    </nav>\n'
    html += '  </header>\n'
    html += '  <main class="main">\n'
    html += '    <section class="hero">\n'
    html += '      <h1 class="title">Welcome to Your App</h1>\n'
    html += '      <p class="subtitle">Built with Figma Make</p>\n'
    html += '    </section>\n'
    html += '  </main>\n'
    html += '  <footer class="footer">\n'
    html += '    <p>&copy; 2024 Your App</p>\n'
    html += '  </footer>\n'
    html += '</div>\n'
  } else {
    html += '<div class="app">\n  <h1>Your Figma Make Design</h1>\n  <p>Converted to React components</p>\n</div>\n'
  }
  html += '</body>\n</html>'
  return html
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})


