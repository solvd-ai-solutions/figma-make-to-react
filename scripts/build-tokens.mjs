#!/usr/bin/env node

import fs from 'fs/promises'
import path from 'path'

const TOKENS = {
  colors: {
    primary: {
      teal: '#4FB3A6',
      coral: '#FF6B6B',
      lavender: '#A8A4FF'
    },
    semantic: {
      success: '#10B981',
      warning: '#F59E0B',
      error: '#EF4444',
      info: '#3B82F6'
    },
    neutral: {
      50: '#F9FAFB',
      100: '#F3F4F6',
      200: '#E5E7EB',
      300: '#D1D5DB',
      400: '#9CA3AF',
      500: '#6B7280',
      600: '#4B5563',
      700: '#374151',
      800: '#1F2937',
      900: '#111827'
    }
  },
  spacing: {
    0: '0px',
    1: '4px',
    2: '8px',
    3: '12px',
    4: '16px',
    5: '20px',
    6: '24px',
    7: '28px',
    8: '32px',
    9: '36px',
    10: '40px',
    12: '48px',
    16: '64px',
    20: '80px',
    24: '96px'
  },
  typography: {
    fontFamily: {
      sans: ['Inter', 'system-ui', 'sans-serif'],
      mono: ['JetBrains Mono', 'monospace']
    },
    fontSize: {
      xs: ['12px', { lineHeight: '16px' }],
      sm: ['14px', { lineHeight: '20px' }],
      base: ['16px', { lineHeight: '24px' }],
      lg: ['18px', { lineHeight: '28px' }],
      xl: ['20px', { lineHeight: '28px' }],
      '2xl': ['24px', { lineHeight: '32px' }],
      '3xl': ['30px', { lineHeight: '36px' }],
      '4xl': ['36px', { lineHeight: '40px' }],
      '5xl': ['48px', { lineHeight: '48px' }]
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700'
    }
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    DEFAULT: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
  },
  borders: {
    width: {
      DEFAULT: '2px',
      thin: '1px',
      thick: '3px'
    },
    radius: {
      sm: '4px',
      DEFAULT: '8px',
      md: '12px',
      lg: '16px',
      xl: '24px',
      full: '9999px'
    }
  }
}

async function main() {
  try {
    // Ensure .generated directory exists
    const generatedDir = path.join(process.cwd(), '.generated')
    await fs.mkdir(generatedDir, { recursive: true })

    // Write JSON tokens
    const jsonPath = path.join(generatedDir, 'tokens.json')
    await fs.writeFile(jsonPath, JSON.stringify(TOKENS, null, 2))

    // Write CSS tokens
    const cssPath = path.join(process.cwd(), 'src/styles/tokens.css')
    await fs.mkdir(path.dirname(cssPath), { recursive: true })
    
    let cssContent = ':root {\n'
    
    // Colors
    Object.entries(TOKENS.colors).forEach(([category, colors]) => {
      Object.entries(colors).forEach(([name, value]) => {
        cssContent += `  --color-${category}-${name}: ${value};\n`
      })
    })
    
    // Spacing
    Object.entries(TOKENS.spacing).forEach(([name, value]) => {
      cssContent += `  --spacing-${name}: ${value};\n`
    })
    
    // Typography
    Object.entries(TOKENS.typography.fontSize).forEach(([name, [size, { lineHeight }]]) => {
      cssContent += `  --font-size-${name}: ${size};\n`
      cssContent += `  --line-height-${name}: ${lineHeight};\n`
    })
    
    Object.entries(TOKENS.typography.fontWeight).forEach(([name, value]) => {
      cssContent += `  --font-weight-${name}: ${value};\n`
    })
    
    // Shadows
    Object.entries(TOKENS.shadows).forEach(([name, value]) => {
      cssContent += `  --shadow-${name}: ${value};\n`
    })
    
    // Borders
    Object.entries(TOKENS.borders.width).forEach(([name, value]) => {
      cssContent += `  --border-width-${name}: ${value};\n`
    })
    
    Object.entries(TOKENS.borders.radius).forEach(([name, value]) => {
      cssContent += `  --border-radius-${name}: ${value};\n`
    })
    
    cssContent += '}\n'
    
    await fs.writeFile(cssPath, cssContent)

    console.log('✓ Tokens built:', {
      css: cssPath,
      json: jsonPath
    })
  } catch (error) {
    console.error('Error building tokens:', error)
    process.exit(1)
  }
}

main()
