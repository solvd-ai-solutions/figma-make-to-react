import React from 'react'
import path from 'path'
import manifestJson from '@/generated/image-manifest.json'

type Entry = {
  original?: string
  webp?: string
  avif?: string
  width?: number
  height?: number
}

const manifest = manifestJson as Record<string, Entry>

export interface PictureProps {
  src: string
  alt: string
  className?: string
  width?: number
  height?: number
  priority?: boolean
  sizes?: string
}

function baseName(p: string) {
  try {
    return path.basename(p)
  } catch {
    const parts = p.split('/')
    return parts[parts.length - 1] || p
  }
}

export function Picture({ src, alt, className, width, height, priority, sizes }: PictureProps) {
  const key = baseName(src)
  const entry = manifest[key]
  const w = width ?? entry?.width
  const h = height ?? entry?.height
  const loading = priority ? 'eager' : 'lazy'

  if (!entry) {
    return <img src={src} alt={alt} className={className} width={w} height={h} loading={loading} />
  }

  return (
    <picture>
      {entry.avif ? <source type="image/avif" srcSet={entry.avif} sizes={sizes} /> : null}
      {entry.webp ? <source type="image/webp" srcSet={entry.webp} sizes={sizes} /> : null}
      <img
        src={entry.original || src}
        alt={alt}
        className={className}
        width={w}
        height={h}
        loading={loading}
      />
    </picture>
  )
}

