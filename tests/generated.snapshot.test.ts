import { describe, it, expect } from 'vitest'
import fs from 'fs'
import path from 'path'
import React from 'react'
import { render } from '@testing-library/react'

const GEN_DIR = path.join(process.cwd(), 'src', 'components', 'generated')

function safeRequire(p: string) {
  try { return require(p) } catch { return null }
}

describe('Generated components', () => {
  it('renders all components without crashing', async () => {
    if (!fs.existsSync(GEN_DIR)) return
    const files = fs.readdirSync(GEN_DIR).filter((f) => f.endsWith('.tsx'))
    for (const f of files) {
      const mod = await import(path.join(GEN_DIR, f))
      const C = mod.default
      const { container } = render(React.createElement(C, {}))
      expect(container).toBeTruthy()
    }
  })
})

