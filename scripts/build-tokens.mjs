import { promises as fs } from 'fs'
import path from 'path'

const ROOT = process.cwd()
const SPEC_DIR = path.join(ROOT, 'design-specs')
const GEN_DIR = path.join(ROOT, '.generated')
const CSS_OUT = path.join(ROOT, 'src/styles/tokens.css')
const THEMES_DIR = path.join(SPEC_DIR, 'themes')
const THEMES_OUT = path.join(ROOT, 'src/styles/themes.css')
const TOKENS_JSON_OUT = path.join(GEN_DIR, 'tokens.json')

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true })
}

async function loadJson(file, fallback = {}) {
  try {
    const raw = await fs.readFile(file, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return fallback
  }
}

function toCssVars(colors) {
  const lines = [':root {']
  for (const [k, v] of Object.entries(colors)) {
    lines.push(`  --color-${k}: ${v};`)
  }
  lines.push('}', '', '.bg-background { background-color: var(--color-background); }', '.text-neutral { color: var(--color-neutral); }', '')
  return lines.join('\n')
}

function themeBlock(name, tokens) {
  const lines = [`[data-theme="${name}"] {`]
  if (tokens.colors) {
    for (const [k, v] of Object.entries(tokens.colors)) {
      lines.push(`  --color-${k}: ${v};`)
    }
  }
  lines.push('}')
  return lines.join('\n')
}

async function main() {
  const colors = await loadJson(path.join(SPEC_DIR, 'colors.json'), {
    primary: '#1d4ed8',
    secondary: '#64748b',
    accent: '#22c55e',
    neutral: '#111827',
    background: '#ffffff',
  })
  const spacing = await loadJson(path.join(SPEC_DIR, 'spacing.json'), {})
  const typography = await loadJson(path.join(SPEC_DIR, 'typography.json'), {})

  await ensureDir(path.dirname(CSS_OUT))
  await ensureDir(GEN_DIR)

  // Write CSS variables
  await fs.writeFile(CSS_OUT, toCssVars(colors))

  // Write machine-readable tokens for Tailwind config
  await fs.writeFile(
    TOKENS_JSON_OUT,
    JSON.stringify({ colors, spacing, typography }, null, 2),
    'utf-8'
  )

  // Build themes from design-specs/themes/*.json
  let themesCss = '/* generated themes */\n'
  try {
    const themeFiles = await fs.readdir(THEMES_DIR)
    for (const f of themeFiles) {
      if (!f.endsWith('.json')) continue
      const t = JSON.parse(await fs.readFile(path.join(THEMES_DIR, f), 'utf-8'))
      const name = f.replace(/\.json$/, '')
      themesCss += themeBlock(name, t) + '\n\n'
    }
  } catch {}
  await fs.writeFile(THEMES_OUT, themesCss, 'utf-8')

  console.log('✓ Tokens built:', { css: CSS_OUT, json: TOKENS_JSON_OUT })
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
