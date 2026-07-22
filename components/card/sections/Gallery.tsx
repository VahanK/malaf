'use client'

import { useState } from 'react'
import { Band, SectionKicker, TYPE_LABEL, mediaUrl, type SectionProps } from './shared'
import { Lightbox } from '../layouts/Lightbox'

// GALLERY — the visual trade's core. Full-bleed image sections.
//   - masonry: edge-to-edge columns, varied heights (editorial).
//   - grid-3: a clean 3-col grid.
// data: { images: [{ url, alt }] }
export function Gallery({ block, accent, index }: SectionProps) {
  const d = block.data as { images?: { url?: string; alt?: string }[] }
  const images = (d.images ?? [])
    .filter(im => im.url)
    .map(im => ({ url: mediaUrl(im.url), alt: im.alt ?? '' }))
  const [lightbox, setLightbox] = useState<number | null>(null)
  if (!images.length) return null
  const variant = block.variant || 'masonry'

  return (
    <Band tone="base" accent={accent} className="!py-16">
      <SectionKicker index={index} title={block.title} fallback={TYPE_LABEL.gallery} accent={accent} />
      {variant === 'grid-3' ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {images.map((im, i) => (
            <button key={i} onClick={() => setLightbox(i)} className="group block overflow-hidden rounded-[var(--card-radius-md)]" aria-label={im.alt || `Photo ${i + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url ?? undefined} alt={im.alt} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
            </button>
          ))}
        </div>
      ) : (
        <div className="columns-2 gap-3 lg:columns-3 [&>*]:mb-3">
          {images.map((im, i) => (
            <button key={i} onClick={() => setLightbox(i)} className="group block w-full overflow-hidden rounded-[var(--card-radius-md)]" aria-label={im.alt || `Photo ${i + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url ?? undefined} alt={im.alt} loading="lazy" className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
            </button>
          ))}
        </div>
      )}
      {lightbox !== null && <Lightbox images={images} start={lightbox} onClose={() => setLightbox(null)} />}
    </Band>
  )
}
