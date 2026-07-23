'use client'

import { useState } from 'react'
import { Band, SectionKicker, TYPE_LABEL, mediaUrl, type SectionProps } from './shared'
import { Lightbox } from '../layouts/Lightbox'

// GALLERY — the visual trade's core. Full-bleed image sections.
//   - masonry:     edge-to-edge columns, varied heights (editorial)
//   - grid-3:      a clean 3-col grid
//   - offset-rows: 12-col rows with per-image vertical offset + number (Agnieszka)
//   - filmstrip:   a full-bleed horizontal scroller of tall frames (Creacy)
// data: { images: [{ url, alt }] }
export function Gallery({ block, accent, index, toneHint }: SectionProps) {
  const d = block.data as { images?: { url?: string; alt?: string }[] }
  const images = (d.images ?? [])
    .filter(im => im.url)
    .map(im => ({ url: mediaUrl(im.url), alt: im.alt ?? '' }))
  const [lightbox, setLightbox] = useState<number | null>(null)
  if (!images.length) return null
  const variant = block.variant || 'masonry'
  const tone = block.tone ?? toneHint ?? 'base'
  const onDark = tone === 'dark'

  // ── offset-rows: editorial 12-col grid, each image a different span + drop ──
  if (variant === 'offset-rows') {
    const OFFSET: Array<[string, string]> = [['col-span-5', 'mt-0'], ['col-span-4', 'mt-16'], ['col-span-3', 'mt-8']]
    const chunk = <T,>(a: T[], n: number) => a.reduce<T[][]>((r, _, i) => (i % n ? r : [...r, a.slice(i, i + n)]), [])
    const rows = chunk(images, 3)
    return (
      <Band tone={tone} accent={accent} className="!py-20">
        <SectionKicker index={index} title={block.title} fallback={TYPE_LABEL.gallery} accent={accent} onDark={onDark} />
        {rows.map((row, ri) => (
          <div key={ri} className="mb-12 grid grid-cols-12 items-end gap-4">
            {row.map((im, ci) => {
              const [span, drop] = OFFSET[ci] ?? OFFSET[1]
              const n = ri * 3 + ci + 1
              return (
                <figure key={ci} className={`${span} ${drop}`}>
                  <button onClick={() => setLightbox(ri * 3 + ci)} className="block w-full overflow-hidden rounded-[var(--card-radius-md)]" aria-label={im.alt || `Photo ${n}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={im.url ?? undefined} alt={im.alt} loading="lazy" className="w-full object-cover transition-transform duration-700 ease-out hover:scale-[1.03]" />
                  </button>
                  <figcaption className={`mt-2 flex justify-between text-[11px] uppercase tracking-widest ${onDark ? 'text-white/50' : 'text-[var(--card-muted)]'}`}>
                    <span>{im.alt}</span>
                    <span className="tabular-nums" style={{ color: accent }}>{String(n).padStart(2, '0')}</span>
                  </figcaption>
                </figure>
              )
            })}
          </div>
        ))}
        {lightbox !== null && <Lightbox images={images} start={lightbox} onClose={() => setLightbox(null)} />}
      </Band>
    )
  }

  // ── filmstrip: full-bleed horizontal scroller of tall frames ──
  if (variant === 'filmstrip') {
    return (
      <Band tone="dark" accent={accent} bleed className="!py-20">
        <div className="px-6 lg:px-10">
          <SectionKicker index={index} title={block.title} fallback={TYPE_LABEL.gallery} accent={accent} onDark />
        </div>
        <div className="mt-6 flex snap-x gap-3 overflow-x-auto px-6 lg:px-10 [&>*]:snap-center">
          {images.map((im, i) => (
            <button key={i} onClick={() => setLightbox(i)} className="shrink-0" aria-label={im.alt || `Photo ${i + 1}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={im.url ?? undefined} alt={im.alt} className="aspect-[3/2] h-[60vh] w-auto object-cover" />
            </button>
          ))}
        </div>
        {lightbox !== null && <Lightbox images={images} start={lightbox} onClose={() => setLightbox(null)} />}
      </Band>
    )
  }

  return (
    <Band tone={tone} accent={accent} className="!py-16">
      <SectionKicker index={index} title={block.title} fallback={TYPE_LABEL.gallery} accent={accent} onDark={onDark} />
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
