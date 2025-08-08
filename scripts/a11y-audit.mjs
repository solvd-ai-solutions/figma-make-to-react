import { promises as fs } from 'fs'
import path from 'path'

const GEN_DIR = path.join(process.cwd(), 'src', 'components', 'generated')

async function exists(p) { try { await fs.access(p); return true } catch { return false } }

async function main() {
  const issues = []
  if (!(await exists(GEN_DIR))) {
    console.log('No generated components to audit')
    return
  }

  const files = (await fs.readdir(GEN_DIR)).filter((f) => f.endsWith('.tsx'))
  for (const f of files) {
    const fp = path.join(GEN_DIR, f)
    const src = await fs.readFile(fp, 'utf-8')
    // 1) <Picture ... alt={...}> should exist where used
    const pictureCount = (src.match(/<Picture /g) || []).length
    const altCount = (src.match(/alt=\{/g) || []).length
    if (pictureCount && altCount < pictureCount) {
      issues.push({ file: f, type: 'missing-alt', message: 'Picture without alt prop' })
    }
    // 2) Empty interactive elements
    if (/<button[^>]*>\s*<\/button>/.test(src)) {
      issues.push({ file: f, type: 'empty-button', message: 'Empty button content' })
    }
    // 3) aria-label for icon-only buttons
    const iconOnlyBtn = src.match(/<button[^>]*>(\s*<[^>]+>\s*)+<\/button>/g)
    if (iconOnlyBtn) {
      const withoutAria = iconOnlyBtn.filter((b) => !/aria-label=/.test(b))
      if (withoutAria.length) {
        issues.push({ file: f, type: 'icon-button-aria', message: 'Icon-only button missing aria-label' })
      }
    }
  }

  if (issues.length) {
    console.log('A11y issues:')
    for (const i of issues) console.log('-', i)
    process.exitCode = 1
  } else {
    console.log('✓ A11y audit passed')
  }
}

main().catch((e) => { console.error(e); process.exit(1) })

