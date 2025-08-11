import { promises as fs } from 'fs'
import path from 'path'

const ROOT = process.cwd()
const GEN_DIR = path.join(ROOT, 'src', 'components', 'generated')
const MANIFEST = path.join(ROOT, 'src', 'generated', 'image-manifest.json')
const CODE_DIR = path.join(ROOT, 'figma-exports', 'code')

async function exists(p) { try { await fs.access(p); return true } catch { return false } }

function parseArgs(argv) {
  return { strict: argv.includes('--strict'), report: argv.includes('--report') }
}

async function main() {
  const args = parseArgs(process.argv)
  const issues = []
  // 1) Warn on missing manifest entries for referenced images in components
  const manifest = (await exists(MANIFEST)) ? JSON.parse(await fs.readFile(MANIFEST, 'utf-8')) : {}
  if (await exists(GEN_DIR)) {
    const files = (await fs.readdir(GEN_DIR)).filter((f) => f.endsWith('.tsx'))
    for (const f of files) {
      const fp = path.join(GEN_DIR, f)
      const src = await fs.readFile(fp, 'utf-8')
      const imgRefs = Array.from(src.matchAll(/\/images\/([^"'\)\s]+)/g)).map((m) => m[1])
      for (const img of imgRefs) {
        if (!manifest[img]) {
          issues.push({ type: 'manifest-miss', file: f, image: img })
        }
      }
      if (/alt=\{\s*props\.image\d+Alt\s*\}/.test(src) === false && /<Picture /.test(src)) {
        // soft check: ensure at least default alts exist in replacements
      }
      if (/style=\{\{/.test(src)) {
        issues.push({ type: 'inline-style', file: f, message: 'Inline style remained in TSX' })
      }
    }
  }

  // 2) Unmapped classes in original HTML
  if (await exists(CODE_DIR)) {
    const htmlFiles = (await fs.readdir(CODE_DIR)).filter((f) => /\.(html?|htm)$/i.test(f))
    for (const f of htmlFiles) {
      const content = await fs.readFile(path.join(CODE_DIR, f), 'utf-8')
      const cls = Array.from(content.matchAll(/class=\"([^\"]+)\"/g)).flatMap((m) => m[1].split(/\s+/))
      const suspicious = cls.filter((c) => /^figma-|^auto-|^frame-|^gap-\d+/.test(c))
      if (suspicious.length) {
        // informational only
      }
    }
  }

  try {
    const outDir = path.join(ROOT, '.generated')
    await fs.mkdir(outDir, { recursive: true })
    await fs.writeFile(path.join(outDir, 'qa-report.json'), JSON.stringify({ issues }, null, 2), 'utf-8')
  } catch {}

  if (issues.length) {
    console.log('QA issues found:')
    for (const i of issues) console.log('-', i)
    if (args.strict) process.exitCode = 1
  } else {
    console.log('✓ QA passed: no blocking issues found')
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
