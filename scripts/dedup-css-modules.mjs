#!/usr/bin/env node
// Deduplicate identical CSS module rules across generated components by extracting them to shared.module.css

import { promises as fs } from 'fs'
import path from 'path'
import prettier from 'prettier'

const GEN_DIR = path.join(process.cwd(), 'src', 'components', 'generated')

function parseCssModule(text) {
  const rules = [] // { className, css }
  const re = /\.([a-zA-Z0-9_-]+)\s*\{([^}]*)\}/g
  let m
  while ((m = re.exec(text))) {
    const className = m[1]
    const css = m[2].trim().replace(/\s+/g, ' ').replace(/;\s+/g, '; ')
    rules.push({ className, css })
  }
  return rules
}

async function formatCss(text) {
  try {
    const cfg = await prettier.resolveConfig(process.cwd()).catch(() => null)
    return prettier.format(text, { ...(cfg || {}), parser: 'css' })
  } catch {
    return text
  }
}

async function main() {
  let files
  try { files = await fs.readdir(GEN_DIR) } catch { files = [] }
  const cssFiles = files.filter((f) => f.endsWith('.module.css'))
  if (!cssFiles.length) {
    console.log('No CSS modules to dedup')
    return
  }

  // Build cross-file map: css -> [{ file, className }]
  const map = new Map()
  const fileToRules = new Map()
  for (const f of cssFiles) {
    const p = path.join(GEN_DIR, f)
    const txt = await fs.readFile(p, 'utf-8')
    const rules = parseCssModule(txt)
    fileToRules.set(f, rules)
    for (const r of rules) {
      const key = r.css
      const arr = map.get(key) || []
      arr.push({ file: f, className: r.className })
      map.set(key, arr)
    }
  }

  // Identify duplicates across files
  const duplicates = [...map.entries()].filter(([, arr]) => {
    const uniqueFiles = new Set(arr.map((x) => x.file))
    return uniqueFiles.size > 1
  })
  if (!duplicates.length) {
    console.log('No cross-file duplicates detected; nothing to extract')
    return
  }

  // Assign shared classes
  const sharedRules = [] // { className, css }
  const cssToShared = new Map()
  let idx = 0
  for (const [css] of duplicates) {
    idx += 1
    const className = `g${idx}`
    sharedRules.push({ className, css })
    cssToShared.set(css, className)
  }

  // Write shared.module.css
  const sharedPath = path.join(GEN_DIR, 'shared.module.css')
  const sharedContent = sharedRules.map((r) => `.${r.className} { ${r.css} }`).join('\n') + '\n'
  await fs.writeFile(sharedPath, await formatCss(sharedContent), 'utf-8')

  // Rewrite components: replace styles.sN -> shared.gX for moved rules and add import
  const tsxFiles = files.filter((f) => f.endsWith('.tsx'))
  for (const f of tsxFiles) {
    const tsxPath = path.join(GEN_DIR, f)
    let src = await fs.readFile(tsxPath, 'utf-8')
    const localCss = `${f.replace(/\.tsx$/, '')}.module.css`
    const rules = fileToRules.get(localCss) || []
    let replaced = false
    for (const r of rules) {
      const sharedClass = cssToShared.get(r.css)
      if (!sharedClass) continue
      const re = new RegExp(`styles\\.${r.className}\\b`, 'g')
      if (re.test(src)) {
        src = src.replace(re, `shared.${sharedClass}`)
        replaced = true
      }
    }
    if (replaced) {
      if (!/^import\s+shared\s+from\s+['"]/m.test(src)) {
        // Insert after React and other imports
        src = src.replace(/(import[^\n]+\n)+/, (m) => m + `import shared from './shared.module.css'\n`)
      }
      await fs.writeFile(tsxPath, src, 'utf-8')
    }
  }

  // Remove moved rules from local modules
  for (const f of cssFiles) {
    const p = path.join(GEN_DIR, f)
    const txt = await fs.readFile(p, 'utf-8')
    const rules = parseCssModule(txt)
    const kept = []
    for (const r of rules) {
      if (cssToShared.has(r.css)) continue // moved
      kept.push(r)
    }
    const newContent = kept.map((r) => `.${r.className} { ${r.css} }`).join('\n') + (kept.length ? '\n' : '')
    await fs.writeFile(p, await formatCss(newContent), 'utf-8')
  }

  // Report
  const report = duplicates.map(([css, arr]) => ({ css, occurrences: arr }))
  try {
    const outDir = path.join(process.cwd(), '.generated')
    await fs.mkdir(outDir, { recursive: true })
    await fs.writeFile(path.join(outDir, 'css-dedup-report.json'), JSON.stringify({ shared: sharedRules.map(r => r.className), duplicates: report }, null, 2), 'utf-8')
  } catch {}

  console.log(`✓ Extracted ${sharedRules.length} shared CSS rules to ${path.relative(process.cwd(), sharedPath)}`)
}

main().catch((e) => { console.error(e); process.exit(1) })

