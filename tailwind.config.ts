import type { Config } from 'tailwindcss'
import fs from 'fs'

// Load generated tokens if present, fallback to defaults
let colors: Record<string, string> = {
  primary: '#1d4ed8',
  secondary: '#64748b',
  accent: '#22c55e',
  neutral: '#111827',
  background: '#ffffff',
}
let spacing: Record<string, string> = {}
let typography: any = {}
try {
  const raw = fs.readFileSync('./.generated/tokens.json', 'utf-8')
  const t = JSON.parse(raw)
  colors = { ...colors, ...(t.colors || {}) }
  spacing = { ...(t.spacing || {}) }
  typography = { ...(t.typography || {}) }
} catch {}

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors,
      spacing,
      fontFamily: typography.fontFamily || {},
      fontSize: typography.fontSize || {},
    },
  },
  plugins: [],
}
export default config
