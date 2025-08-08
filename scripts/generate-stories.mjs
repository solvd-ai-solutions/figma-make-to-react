import { promises as fs } from 'fs'
import path from 'path'

const GEN_DIR = path.join(process.cwd(), 'src', 'components', 'generated')

function toTitle(name) {
  return name.replace(/([a-z])([A-Z])/g, '$1 $2')
}

async function main() {
  let files
  try { files = await fs.readdir(GEN_DIR) } catch { files = [] }
  const tsx = files.filter((f) => f.endsWith('.tsx'))
  for (const f of tsx) {
    const base = f.replace(/\.tsx$/, '')
    const storyPath = path.join(GEN_DIR, `${base}.stories.tsx`)
    const exists = await fs.access(storyPath).then(() => true).catch(() => false)
    if (exists) continue
    const importPath = `./${base}`
    const title = `Generated/${toTitle(base)}`
    const content = `import React from 'react'\nimport C from '${importPath}'\n\nexport default {\n  title: '${title}',\n  component: C,\n} as const\n\nexport const Default = () => <C />\n`
    await fs.writeFile(storyPath, content, 'utf-8')
  }
  console.log('✓ Stories generated for', tsx.length, 'components')
}

main().catch((e) => { console.error(e); process.exit(1) })

