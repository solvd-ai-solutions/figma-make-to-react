import { promises as fs } from 'fs'
import path from 'path'
import crypto from 'crypto'

const GEN_DIR = path.join(process.cwd(), 'src', 'components', 'generated')

async function exists(p) { try { await fs.access(p); return true } catch { return false } }

function hashCss(css) {
  return crypto.createHash('sha1').update(css).digest('hex').slice(0, 10)
}

async function main() {
  if (!(await exists(GEN_DIR))) {
    console.log('No generated components; skipping CSS trim report')
    return
  }
  const files = (await fs.readdir(GEN_DIR)).filter((f) => f.endsWith('.module.css'))
  const map = new Map() // css text -> [file, className]
  for (const f of files) {
    const content = await fs.readFile(path.join(GEN_DIR, f), 'utf-8')
    const rules = content.split(/\n/).filter(Boolean)
    let buf = ''
    for (const line of rules) {
      buf += line + '\n'
    }
    const h = hashCss(content)
    const entry = map.get(h) || []
    entry.push(f)
    map.set(h, entry)
  }
  const duplicates = Array.from(map.entries()).filter(([, files]) => files.length > 1)
  try {
    await fs.mkdir(path.join(process.cwd(), '.generated'), { recursive: true })
    await fs.writeFile(path.join(process.cwd(), '.generated', 'css-trim-report.json'), JSON.stringify({ duplicates }, null, 2), 'utf-8')
  } catch {}
  if (duplicates.length) {
    console.log('CSS duplicates detected across components:')
    for (const [hash, files] of duplicates) {
      console.log('-', hash, 'files:', files.join(', '))
    }
  } else {
    console.log('✓ No cross-file CSS duplicates found')
  }
}

main().catch((e) => { console.error(e); process.exit(1) })
