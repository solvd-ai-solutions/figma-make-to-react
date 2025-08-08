import { promises as fs } from 'fs'
import path from 'path'
import sharp from 'sharp'
import { optimize as svgoOptimize } from 'svgo'

// Optimizes assets from figma-exports/assets into public/images
// - Raster (png/jpg/jpeg): optimize + emit webp/avif variants
// - SVG: optimize via SVGO

const ROOT = process.cwd()
const SRC = path.join(ROOT, 'figma-exports', 'assets')
const OUT = path.join(ROOT, 'public', 'images')
const MANIFEST_SRC = path.join(ROOT, 'src', 'generated', 'image-manifest.json')

const manifest = {}

async function ensureDir(dir) { await fs.mkdir(dir, { recursive: true }) }

function isRaster(file) { return /\.(png|jpe?g)$/i.test(file) }
function isSvg(file) { return /\.svg$/i.test(file) }

async function optimizeRaster(srcPath, outBase) {
  const pipeline = sharp(srcPath)
  const ext = path.extname(srcPath).toLowerCase()
  const baseNoExt = outBase.replace(/\.[^.]+$/, '')

  // Write optimized original format
  if (ext === '.png') {
    await pipeline.png({ compressionLevel: 9, palette: true }).toFile(outBase)
  } else {
    await pipeline.jpeg({ quality: 80, mozjpeg: true }).toFile(outBase)
  }

  // WebP
  await sharp(srcPath).webp({ quality: 80 }).toFile(`${baseNoExt}.webp`)
  // AVIF
  await sharp(srcPath).avif({ quality: 50 }).toFile(`${baseNoExt}.avif`)

  const meta = await sharp(outBase).metadata()
  return {
    original: toPublicPath(outBase),
    webp: toPublicPath(`${baseNoExt}.webp`),
    avif: toPublicPath(`${baseNoExt}.avif`),
    width: meta.width,
    height: meta.height,
  }
}

async function optimizeSvg(srcPath, outPath) {
  const raw = await fs.readFile(srcPath, 'utf-8')
  const { data } = svgoOptimize(raw, { path: srcPath })
  await fs.writeFile(outPath, data, 'utf-8')
  return { original: toPublicPath(outPath) }
}

function toPublicPath(p) {
  const i = p.lastIndexOf('/public')
  return i >= 0 ? p.slice(i + '/public'.length) : p
}

async function processDir(srcDir, outDir) {
  let entries
  try { entries = await fs.readdir(srcDir, { withFileTypes: true }) } catch { return 0 }
  await ensureDir(outDir)
  let count = 0
  for (const e of entries) {
    const s = path.join(srcDir, e.name)
    const d = path.join(outDir, e.name)
    if (e.isDirectory()) {
      count += await processDir(s, d)
    } else if (isRaster(e.name)) {
      const entry = await optimizeRaster(s, d)
      manifest[e.name] = entry
      count++
    } else if (isSvg(e.name)) {
      const entry = await optimizeSvg(s, d)
      manifest[e.name] = entry
      count++
    } else {
      await fs.copyFile(s, d)
      manifest[e.name] = { original: toPublicPath(d) }
      count++
    }
  }
  return count
}

async function main() {
  const n = await processDir(SRC, OUT)
  await ensureDir(path.dirname(MANIFEST_SRC))
  await fs.writeFile(MANIFEST_SRC, JSON.stringify(manifest, null, 2), 'utf-8')
  console.log(`✓ Assets optimized: ${n} files -> ${OUT}`)
}

main().catch((e) => { console.error(e); process.exit(1) })
