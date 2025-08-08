import { promises as fs } from 'fs'
import path from 'path'
import { load } from 'cheerio'

// Cheerio-based converter: parses HTML, normalizes attributes for JSX,
// and emits TSX components under src/components/generated.

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'figma-exports', 'code')
const OUT_DIR = path.join(ROOT, 'src', 'components', 'generated')
const MAP_FILE = path.join(ROOT, 'config', 'figma-mapping.json')
const TOKENS_FILE = path.join(ROOT, '.generated', 'tokens.json')

async function loadMapping() {
  try {
    const raw = await fs.readFile(MAP_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { classMap: {}, preserveUnknown: true }
  }
}

async function loadTokens() {
  try {
    const raw = await fs.readFile(TOKENS_FILE, 'utf-8')
    return JSON.parse(raw)
  } catch {
    return { colors: {}, spacing: {}, typography: {} }
  }
}

function parseArgs(argv) {
  const args = { mode: 'hybrid', format: false }
  for (const a of argv.slice(2)) {
    if (a.startsWith('--mode=')) args.mode = a.split('=')[1]
    else if (a === '--format') args.format = true
  }
  return args
}

function toComponentName(file) {
  const base = path.basename(file).replace(/\.[^.]+$/, '')
  const parts = base.split(/[^a-zA-Z0-9]+/).filter(Boolean)
  const name = parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join('')
  return name || 'FigmaComponent'
}

function camelCaseAttr(name) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase())
}

function styleToObjectLiteral(styleStr) {
  const entries = styleStr
    .split(';')
    .map((s) => s.trim())
    .filter(Boolean)
    .map((pair) => {
      const [k, ...rest] = pair.split(':')
      if (!k || rest.length === 0) return null
      const key = camelCaseAttr(k.trim())
      const value = rest.join(':').trim()
      return `${key}: '${value.replace(/'/g, "\\'")}'`
    })
    .filter(Boolean)
  return `{ ${entries.join(', ')} }`
}

function finalizeJsx(html) {
  // Self-close void elements for JSX
  const voids = ['area','base','br','col','embed','hr','img','input','link','meta','param','source','track','wbr']
  let out = html
  for (const tag of voids) {
    const re = new RegExp(`<${tag}([^>/]*)>`, 'gi')
    out = out.replace(re, (_m, attrs) => `<${tag}${attrs.trimEnd()} />`)
  }

  // Convert inline style="..." to style={{ ... }}
  out = out.replace(/style="([^"]*)"/g, (_m, s) => `style=${styleToObjectLiteral(s)}`)
  return out
}

function transformHtmlToJsx(inputHtml, mapping, componentName, tokens, mode) {
  const $ = load(inputHtml, { xmlMode: false, decodeEntities: false })

  const styleMap = new Map() // canonical style string -> class token (e.g., __s1__)
  const cssRules = [] // [{ className: 's1', css: 'color:red;' }]
  let styleCounter = 0
  let textCounter = 0
  let imageCounter = 0

  const props = {
    texts: [], // { token, default }
    images: [], // { token, src, alt, width, height, className }
  }

  $('*').each((_, el) => {
    const $el = $(el)
    const attribs = el.attribs || {}
    for (const [name, value] of Object.entries(attribs)) {
      if (name === 'class') {
        $el.attr('className', value)
        $el.removeAttr('class')
        continue
      }
      if (name === 'for') {
        $el.attr('htmlFor', value)
        $el.removeAttr('for')
        continue
      }
      if (/^aria-/.test(name) || /^data-/.test(name)) {
        continue // leave as-is
      }
      if (name === 'tabindex') {
        $el.attr('tabIndex', value)
        $el.removeAttr('tabindex')
        continue
      }
      // camelCase hyphenated attributes (common in SVG)
      if (name.includes('-')) {
        const cc = camelCaseAttr(name)
        if (cc !== name) {
          $el.attr(cc, value)
          $el.removeAttr(name)
        }
      }
    }

    // Map class names via config
    const cls = $el.attr('className')
    if (cls) {
      const classes = cls.split(/\s+/).filter(Boolean)
      const mapped = []
      for (const c of classes) {
        const rep = mapping.classMap?.[c]
        if (rep) {
          mapped.push(...String(rep).split(/\s+/).filter(Boolean))
        } else if (mapping.preserveUnknown) {
          mapped.push(c)
        }
      }
      if (mapped.length) $el.attr('className', mapped.join(' '))
    }

    // Grid heuristics via data-* hints
    const gridCols = $el.attr('data-grid-cols')
    const gridGap = $el.attr('data-grid-gap')
    if (gridCols) {
      const before = $el.attr('className') || ''
      const gapClass = gridGap ? ` gap-${gridGap}` : ''
      $el.attr('className', `${before} grid grid-cols-${gridCols}${gapClass}`.trim())
      $el.removeAttr('data-grid-cols')
      if (gridGap) $el.removeAttr('data-grid-gap')
    }

    // Auto-detect equal-width children -> grid
    if (el.children && el.children.length > 1) {
      const childTags = Array.from(el.children).filter((c) => c.type === 'tag')
      const widths = childTags.map((c) => (c.attribs?.style || '').match(/width:\s*([0-9.]+)%/i)?.[1]).filter(Boolean)
      if (widths.length === childTags.length) {
        const unique = new Set(widths.map((w) => Math.round(parseFloat(w))))
        if (unique.size === 1) {
          const per = [...unique][0]
          const cols = Math.round(100 / per)
          const before = $el.attr('className') || ''
          $el.attr('className', `${before} grid grid-cols-${cols}`.trim())
        }
      }
    }

    // Convert style declarations to Tailwind classes using tokens when possible
    const styleAttr = $el.attr('style')
    if (styleAttr) {
      // canonicalize: sort declarations
      const decls = styleAttr
        .split(';')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((pair) => {
          const [k, ...rest] = pair.split(':')
          if (!k || rest.length === 0) return null
          return [k.trim().toLowerCase(), rest.join(':').trim()]
        })
        .filter(Boolean)
        .sort((a, b) => (a[0] < b[0] ? -1 : 1))
      const tailwindClasses = []

      // token-based color mapping
      const colorMap = tokens.colors || {}
      const colorByValue = Object.fromEntries(
        Object.entries(colorMap).map(([k, v]) => [String(v).toLowerCase(), k])
      )
      const fontSizeMap = (tokens.typography && tokens.typography.fontSize) || {}
      const sizeByPx = {}
      for (const [k, v] of Object.entries(fontSizeMap)) {
        // v can be [size, { lineHeight }]
        const size = Array.isArray(v) ? v[0] : v
        if (typeof size === 'string' && size.endsWith('rem')) {
          // map only rem sizes to Tailwind keys
          sizeByPx[size] = k
        }
      }

      const filtered = []
      for (const [k, v] of decls) {
        const val = String(v).toLowerCase()
        if (k === 'color' && colorByValue[val]) {
          tailwindClasses.push(`text-${colorByValue[val]}`)
          continue
        }
        if ((k === 'background' || k === 'background-color') && colorByValue[val]) {
          tailwindClasses.push(`bg-${colorByValue[val]}`)
          continue
        }
        if (k === 'font-weight') {
          const fw = parseInt(val, 10)
          if (fw >= 700) tailwindClasses.push('font-bold')
          else if (fw >= 600) tailwindClasses.push('font-semibold')
          else if (fw >= 500) tailwindClasses.push('font-medium')
          else tailwindClasses.push('font-normal')
          continue
        }
        if (k === 'font-size') {
          const key = sizeByPx[val]
          if (key) {
            tailwindClasses.push(`text-${key}`)
            continue
          }
        }
        filtered.push([k, v])
      }

      // attach any tailwind classes from style
      if (tailwindClasses.length) {
        const before = $el.attr('className') || ''
        $el.attr('className', `${before} ${tailwindClasses.join(' ')}`.trim())
      }

      // Remaining style handling depends on mode
      const canonical = filtered.map(([k, v]) => `${k}: ${v};`).join(' ')
      if (mode === 'strict') {
        // Keep inline style as React object for residuals
        if (filtered.length) {
          // Will be converted later in finalizeJsx
          $el.attr('style', canonical)
        } else {
          $el.removeAttr('style')
        }
      } else {
        // Hybrid: extract to CSS Module
        let token = styleMap.get(canonical)
        if (canonical && !token) {
          styleCounter += 1
          const className = `s${styleCounter}`
          token = `__STYLE_${className}__`
          styleMap.set(canonical, token)
          cssRules.push({ className, css: canonical })
        }
        if (canonical) {
          const before2 = $el.attr('className') || ''
          $el.attr('className', `${before2} ${token}`.trim())
        }
        $el.removeAttr('style')
      }
    }

    // Named prop support via data-prop
    const dataProp = $el.attr('data-prop')
    if (dataProp) {
      const rawText = ($el.text() || '')
      const def = rawText.trim()
      const key = dataProp
      if (def) {
        props.texts.push({ token: `__PROP_${key.toUpperCase()}__`, default: def, key })
        $el.text(`__PROP_${key.toUpperCase()}__`)
      }
      $el.removeAttr('data-prop')
    }

    // Promote simple text nodes to auto props if not named
    if (!dataProp && $el.children().length === 0) {
      const text = ($el.text() || '').trim()
      if (text) {
        textCounter += 1
        const token = `__TEXT_${textCounter}__`
        props.texts.push({ token, default: text })
        $el.text(token)
      }
    }

    // Slot support via data-slot: replace inner with token
    const dataSlot = $el.attr('data-slot')
    if (dataSlot) {
      const inner = $el.html() || ''
      const token = `__SLOT_${dataSlot.toUpperCase()}__`
      props.slots = props.slots || []
      props.slots.push({ name: dataSlot, token, defaultHtml: inner })
      $el.html(token)
      $el.removeAttr('data-slot')
    }

    // Convert <img> into <Picture/> (or SVG component) with props
    if (el.tagName && el.tagName.toLowerCase() === 'img') {
      imageCounter += 1
      const idx = imageCounter
      const src = $el.attr('src') || ''
      const alt = $el.attr('alt') || ''
      const width = $el.attr('width') || ''
      const height = $el.attr('height') || ''
      const cls2 = $el.attr('className') || ''
      const svgMode = $el.attr('data-svg') === 'component'

      const propSrcName = $el.attr('data-prop-src')
      const propAltName = $el.attr('data-prop-alt')

      const token = `__IMAGE_${idx}__`
      props.images.push({ token, src, alt, width, height, className: cls2, svgMode, propSrcName, propAltName })
      $el.replaceWith(token)
    }
  })

  let normalized = $.root().html() || ''
  normalized = finalizeJsx(normalized)

  return { html: normalized, cssRules, props }
}

async function convertFile(filePath, mapping, tokens, mode) {
  const raw = await fs.readFile(filePath, 'utf-8')
  const Component = toComponentName(filePath)
  const { html, cssRules, props } = transformHtmlToJsx(raw, mapping, Component, tokens, mode)

  // Build CSS Module if any rules
  let cssImport = ''
  let cssModuleName = ''
  if (mode !== 'strict' && cssRules.length) {
    cssModuleName = `${Component}.module.css`
    cssImport = `import styles from './${cssModuleName}'\n`
    // Write CSS module file
    const cssOut = cssRules
      .map((r) => `.${r.className} { ${r.css} }`)
      .join('\n') + '\n'
    await fs.writeFile(path.join(OUT_DIR, cssModuleName), cssOut, 'utf-8')
  }

  // Replace className tokens to expressions using styles
  let jsx = html
  if (mode !== 'strict') {
    const classAttrRegex = /className="([^"]*__STYLE_[^"]*)"/g
    jsx = jsx.replace(classAttrRegex, (_m, content) => {
      const expr = content.replace(/__STYLE_(s\d+)__/g, (_m2, cn) => `\${'${'}styles.${cn}\${'}'}`)
      return `className={\`${expr}\`}`
    })
  } else {
    // Convert residual inline style to React object
    jsx = jsx.replace(/style="([^"]*)"/g, (_m, s) => `style=${styleToObjectLiteral(s)}`)
  }

  // Replace text tokens with props
  let propsInterfaceLines = []
  for (const t of props.texts) {
    const key = t.key || `text${t.token.replace(/__|TEXT_|__/g, '').toLowerCase()}`
    propsInterfaceLines.push(`${key}?: string`)
    const safe = t.default.replace(/`/g, '\\`').replace(/\$/g, '$$$$')
    jsx = jsx.replaceAll(t.token, `\${'${'}props.${key} ?? \`${safe}\`\${'}'}`)
  }

  // Replace image tokens with <Picture/> or SVG component
  let needPictureImport = false
  let imgIndex = 0
  const svgImports = []
  for (const img of props.images) {
    imgIndex += 1
    const iKey = img.propSrcName ? img.propSrcName : `image${imgIndex}Src`
    const aKey = img.propAltName ? img.propAltName : `image${imgIndex}Alt`
    propsInterfaceLines.push(`${iKey}?: string`)
    propsInterfaceLines.push(`${aKey}?: string`)
    const classExpr = img.className.includes('__STYLE_')
      ? `{\`${img.className.replace(/__STYLE_(s\d+)__/g, (_m, cn) => `\${'${'}styles.${cn}\${'}'}`)}\`}`
      : img.className
        ? `"${img.className}"`
        : 'undefined'
    const w = img.width ? ` width={${Number(img.width)}}` : ''
    const h = img.height ? ` height={${Number(img.height)}}` : ''

    if (img.svgMode && /\.svg$/i.test(img.src)) {
      const importName = `Svg${imgIndex}`
      // Import from figma-exports for bundling; optimizer still also copies to public
      const absSvg = path.join(ROOT, 'figma-exports', 'assets', path.basename(img.src))
      const relSvg = path.posix.relative(OUT_DIR, absSvg)
      const svgPath = relSvg.startsWith('.') ? relSvg : `./${relSvg}`
      svgImports.push({ importName, svgPath })
      const repl = `<${importName} className=${classExpr} />`
      jsx = jsx.replace(img.token, repl)
    } else {
      const repl = `<Picture src={props.${iKey} ?? \"/images/${path.basename(img.src)}\"} alt={props.${aKey} ?? \"${(img.alt || path.basename(img.src, '.svg')).replace(/"/g, '\\"')}\"} className=${classExpr}${w}${h} />`
      jsx = jsx.replace(img.token, repl)
      needPictureImport = true
    }
  }

  // Wrap in component with props interface
  const slotLines = (props.slots || []).map((s) => `${s.name}?: React.ReactNode`)
  for (const s of (props.slots || [])) {
    const defaultJsx = s.defaultHtml
    const expr = `\${'${'}props.${s.name} ?? (<>${defaultJsx}</>)\${'}'}`
    jsx = jsx.replace(s.token, expr)
  }

  const allPropsLines = [...propsInterfaceLines, ...slotLines]
  const propsDecl = allPropsLines.length
    ? `export interface ${Component}Props {\n  ${allPropsLines.join(';\n  ')}\n}\n`
    : ''
  const propsType = allPropsLines.length ? `${Component}Props` : '{}'

  const svgImportLines = svgImports.map((s) => `import ${s.importName} from '${s.svgPath}'`)
  const imports = [needPictureImport ? `import { Picture } from '@/components/ui/Picture'` : '', cssImport, ...svgImportLines]
    .filter(Boolean)
    .join('\n')

  const out = `import React from 'react'\n${imports}\n${propsDecl}export default function ${Component}(props: ${propsType}) {\n  return (\n    <>\n${jsx.split('\n').map((l) => '      ' + l).join('\n')}\n    </>\n  )\n}\n`
  const fileOut = path.join(OUT_DIR, `${Component}.tsx`)
  await fs.writeFile(fileOut, out, 'utf-8')
  return { in: filePath, out: fileOut }
}

async function main() {
  const args = parseArgs(process.argv)
  const mapping = await loadMapping()
  const tokens = await loadTokens()
  try { await fs.mkdir(OUT_DIR, { recursive: true }) } catch {}
  let files
  try {
    files = await fs.readdir(SRC)
  } catch {
    console.log('No figma exports found at', SRC)
    return
  }

  const htmlFiles = files.filter((f) => /\.(html|htm)$/i.test(f))
  if (htmlFiles.length === 0) {
    console.log('No HTML files to convert in', SRC)
    return
  }

  const results = []
  for (const f of htmlFiles) {
    const fp = path.join(SRC, f)
    const r = await convertFile(fp, mapping, tokens, args.mode)
    results.push(r)
  }
  console.log('✓ Converted components:', results)
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
