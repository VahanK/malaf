'use client'

import { useState } from 'react'
import { Reorder, useDragControls } from 'motion/react'
import { Band, SectionKicker, TYPE_LABEL, mediaUrl, arText, type SectionProps } from './shared'
import { Lightbox } from '../layouts/Lightbox'
import { useEdit } from '../edit/EditContext'
import { uploadImageWithProgress } from '@/lib/upload-with-progress'
import { HorizontalScrollGallery, SwipeCards } from '../motion/registry'

const MOTION_GALLERY: Record<string, React.ComponentType<{ images: { url: string; alt?: string }[]; accent: string; isRtl: boolean; title?: string }>> = {
  'horizontal-scroll': HorizontalScrollGallery as never,
  'swipe-deck': SwipeCards as never,
}

// GALLERY — the visual trade's core. Full-bleed image sections.
//   - masonry:     edge-to-edge columns, varied heights (editorial)
//   - grid-3:      a clean 3-col grid
//   - offset-rows: 12-col rows with per-image vertical offset + number (Agnieszka)
//   - filmstrip:   a full-bleed horizontal scroller of tall frames (Creacy)
// data: { images: [{ url, alt }] }
export function Gallery({ block, accent, index, toneHint, isRtl }: SectionProps) {
  const { editing, onBlockData } = useEdit()
  const [uploading, setUploading] = useState<{ done: number; total: number } | null>(null)
  const d = block.data as { images?: { url?: string; alt?: string }[] }
  const rawImages = (d.images ?? []).filter(im => im.url) as { url: string; alt?: string }[]
  const images = rawImages.map(im => ({ url: mediaUrl(im.url), alt: im.alt ?? '' }))
  const [lightbox, setLightbox] = useState<number | null>(null)
  // In the builder an empty gallery still renders (so the user can add photos);
  // on the public page an empty gallery shows nothing.
  if (!images.length && !editing) return null
  const variant = block.variant || 'masonry'
  const tone = block.tone ?? toneHint ?? 'base'
  const onDark = tone === 'dark'
  const kickerTitle = arText(isRtl, block.title, block.title_ar)


  // Edit-mode photo management: add (multi-select) + remove, written to the block.
  const addPhotos = async (files: FileList | null) => {
    const list = Array.from(files ?? [])
    if (!list.length) return
    setUploading({ done: 0, total: list.length })
    const uploaded: { url: string }[] = []
    for (let i = 0; i < list.length; i++) {
      const p = await uploadImageWithProgress(list[i])
      if (p) uploaded.push({ url: p })
      setUploading({ done: i + 1, total: list.length })
    }
    setUploading(null)
    if (uploaded.length) onBlockData(block.id, { images: [...rawImages, ...uploaded] })
  }
  const removePhoto = (i: number) => onBlockData(block.id, { images: rawImages.filter((_, j) => j !== i) })
  // Edit a photo's caption (shown on swipe-deck cards + as figcaptions).
  const setCaption = (i: number, alt: string) => onBlockData(block.id, { images: rawImages.map((im, j) => (j === i ? { ...im, alt } : im)) })
  // Reorder: swap photo i with its neighbor (founder: "let me swap image places").
  const movePhoto = (i: number, dir: -1 | 1) => {
    const j = i + dir
    if (j < 0 || j >= rawImages.length) return
    const next = [...rawImages]
    ;[next[i], next[j]] = [next[j], next[i]]
    onBlockData(block.id, { images: next })
  }
  // Drag-to-reorder: persist a full reordered array (touch-friendly, phone-first).
  const reorderByUrl = (urls: string[]) => {
    const byUrl = new Map(rawImages.map(im => [im.url, im]))
    const next = urls.map(u => byUrl.get(u)).filter(Boolean) as { url: string; alt?: string }[]
    if (next.length === rawImages.length) onBlockData(block.id, { images: next })
  }
  const AddTile = editing ? (
    <label className="flex aspect-square w-full cursor-pointer flex-col items-center justify-center gap-1 rounded-[var(--card-radius-md)] border-2 border-dashed border-[var(--card-border)] text-center text-[13px] font-semibold text-[var(--card-muted)] transition hover:border-[var(--card-accent)] hover:text-[var(--card-ink)]">
      {uploading ? (
        <>
          <span>Uploading {uploading.done}/{uploading.total}…</span>
          <span className="h-1.5 w-4/5 overflow-hidden rounded-full bg-[var(--card-border)]">
            <span className="block h-full rounded-full bg-[var(--card-accent)] transition-[width]" style={{ width: `${Math.round((uploading.done / uploading.total) * 100)}%` }} />
          </span>
        </>
      ) : (
        <span>＋ Add photos</span>
      )}
      <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={e => addPhotos(e.target.files)} />
    </label>
  ) : null

  // Premium-motion gallery variants. Render on the public page AND in the builder
  // (so switching to them visibly changes the layout). In the builder we add a
  // small "manage photos" strip below since the motion view isn't add/removable.
  const MOTION = MOTION_GALLERY[variant]
  if (MOTION && images.length) {
    const imgs = images.filter(im => im.url).map(im => ({ url: im.url as string, alt: im.alt }))
    return (
      <Band tone={tone} accent={accent} className="!px-0" bleed frameId={block.id} frameLabel="Gallery" frameType="gallery" frameVariant={variant}>
        <MOTION images={imgs} accent={accent} isRtl={!!isRtl} title={kickerTitle} />
        {editing && <ManagePhotosStrip rawImages={rawImages} onReorder={reorderByUrl} onRemove={removePhoto} onCaption={setCaption} addTile={AddTile} />}
      </Band>
    )
  }

  // ── offset-rows: editorial 12-col grid, each image a different span + drop ──
  if (variant === 'offset-rows') {
    const OFFSET: Array<[string, string]> = [['col-span-5', 'mt-0'], ['col-span-4', 'mt-16'], ['col-span-3', 'mt-8']]
    const chunk = <T,>(a: T[], n: number) => a.reduce<T[][]>((r, _, i) => (i % n ? r : [...r, a.slice(i, i + n)]), [])
    const rows = chunk(images, 3)
    return (
      <Band tone={tone} accent={accent} className="!py-20" frameId={block.id} frameLabel="Gallery" frameType="gallery" frameVariant={variant}>
        <SectionKicker index={index} title={kickerTitle} fallback={TYPE_LABEL.gallery} accent={accent} onDark={onDark} blockId={block.id} hideNumber={Boolean((block.data as {hide_number?: boolean}).hide_number)} />
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
      <Band tone="dark" accent={accent} bleed className="!py-20" frameId={block.id} frameLabel="Gallery" frameType="gallery" frameVariant={variant}>
        <div className="px-6 lg:px-10">
          <SectionKicker index={index} title={kickerTitle} fallback={TYPE_LABEL.gallery} accent={accent} onDark />
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
    <Band tone={tone} accent={accent} className="!py-16" frameId={block.id} frameLabel="Gallery" frameType="gallery" frameVariant={variant}>
      <SectionKicker index={index} title={kickerTitle} fallback={TYPE_LABEL.gallery} accent={accent} onDark={onDark} blockId={block.id} hideNumber={Boolean((block.data as {hide_number?: boolean}).hide_number)} />
      {variant === 'grid-3' ? (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
          {images.map((im, i) => (
            <div key={i} className="group relative overflow-hidden rounded-[var(--card-radius-md)]">
              <button onClick={() => setLightbox(i)} className="block w-full" aria-label={im.alt || `Photo ${i + 1}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.url ?? undefined} alt={im.alt} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </button>
              {editing && <PhotoControls onRemove={() => removePhoto(i)} onLeft={() => movePhoto(i, -1)} onRight={() => movePhoto(i, 1)} isFirst={i === 0} isLast={i === images.length - 1} isRtl={!!isRtl} />}
            </div>
          ))}
          {AddTile}
        </div>
      ) : (
        <div className="columns-2 gap-3 lg:columns-3 [&>*]:mb-3">
          {images.map((im, i) => (
            <div key={i} className="group relative w-full overflow-hidden rounded-[var(--card-radius-md)]">
              <button onClick={() => setLightbox(i)} className="block w-full" aria-label={im.alt || `Photo ${i + 1}`}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={im.url ?? undefined} alt={im.alt} loading="lazy" className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]" />
              </button>
              {editing && <PhotoControls onRemove={() => removePhoto(i)} onLeft={() => movePhoto(i, -1)} onRight={() => movePhoto(i, 1)} isFirst={i === 0} isLast={i === images.length - 1} isRtl={!!isRtl} />}
            </div>
          ))}
          {AddTile}
        </div>
      )}
      {lightbox !== null && <Lightbox images={images} start={lightbox} onClose={() => setLightbox(null)} />}
    </Band>
  )
}

// Small remove control shown on hover over a photo in the builder.
// Edit-mode controls on each gallery photo: reorder (◀ ▶) + remove (✕).
// Always visible on touch (no hover), reveal on hover on desktop.
function PhotoControls({ onRemove, onLeft, onRight, isFirst, isLast, isRtl }: {
  onRemove: () => void; onLeft: () => void; onRight: () => void; isFirst: boolean; isLast: boolean; isRtl: boolean
}) {
  const stop = (fn: () => void) => (e: React.MouseEvent) => { e.stopPropagation(); e.preventDefault(); fn() }
  const btn = 'flex h-7 w-7 items-center justify-center rounded-full bg-black/75 text-[13px] text-white shadow-lg disabled:opacity-30'
  // In RTL "previous" is visually on the right; keep the arrows pointing where they move.
  return (
    <div className="ww-toolbar absolute inset-x-2 top-2 z-10 flex items-center justify-between opacity-0 transition-opacity group-hover:opacity-100">
      <div className="flex gap-1.5">
        <button onClick={stop(onLeft)} disabled={isFirst} className={btn} aria-label="Move earlier">{isRtl ? '▶' : '◀'}</button>
        <button onClick={stop(onRight)} disabled={isLast} className={btn} aria-label="Move later">{isRtl ? '◀' : '▶'}</button>
      </div>
      <button onClick={stop(onRemove)} className={`${btn} bg-black/75 hover:bg-red-600`} aria-label="Remove photo">✕</button>
    </div>
  )
}

// Builder-only manager for the motion gallery variants: DRAG to reorder
// (touch-friendly, phone-first — founder: "make it draggable so it works on
// phone"), edit captions, remove, add. Uses motion's Reorder (pointer-based).
function ManagePhotosStrip({ rawImages, onReorder, onRemove, onCaption, addTile }: {
  rawImages: { url: string; alt?: string }[]
  onReorder: (urls: string[]) => void
  onRemove: (i: number) => void
  onCaption: (i: number, alt: string) => void
  addTile: React.ReactNode
}) {
  const urls = rawImages.map(im => im.url)
  return (
    <div className="mx-auto max-w-2xl border-t border-white/10 bg-black/40 px-4 py-3">
      <p className="mb-2 text-[11px] font-bold uppercase tracking-wide text-white/60">Drag to reorder · tap to caption</p>
      <Reorder.Group axis="y" values={urls} onReorder={onReorder} className="flex flex-col gap-2">
        {rawImages.map((im, i) => (
          <PhotoRow key={im.url} url={im.url} alt={im.alt} onCaption={v => onCaption(i, v)} onRemove={() => onRemove(i)} />
        ))}
      </Reorder.Group>
      <div className="mt-2 [&_label]:!aspect-auto [&_label]:!h-10 [&_label]:!flex-row [&_label]:!gap-2">{addTile}</div>
    </div>
  )
}

// One draggable photo row. A dedicated drag handle keeps the caption input
// tappable/editable without starting a drag.
function PhotoRow({ url, alt, onCaption, onRemove }: { url: string; alt?: string; onCaption: (v: string) => void; onRemove: () => void }) {
  const controls = useDragControls()
  return (
    <Reorder.Item value={url} dragListener={false} dragControls={controls} className="flex touch-none items-center gap-2 rounded-lg bg-white/5 p-1.5">
      <button
        onPointerDown={e => controls.start(e)}
        className="flex h-9 w-6 shrink-0 cursor-grab items-center justify-center text-white/40 active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        ⠿
      </button>
      <div className="h-11 w-11 shrink-0 overflow-hidden rounded-md ring-1 ring-white/20">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={mediaUrl(url) ?? undefined} alt={alt} className="h-full w-full object-cover" draggable={false} />
      </div>
      <input
        defaultValue={alt ?? ''}
        onBlur={e => onCaption(e.target.value)}
        placeholder="Add a caption…"
        className="min-w-0 flex-1 bg-transparent text-[13px] text-white outline-none placeholder:text-white/40"
      />
      <button onClick={onRemove} className="flex h-7 w-7 shrink-0 items-center justify-center rounded bg-white/10 text-[12px] text-white hover:bg-red-600" aria-label="Remove photo">✕</button>
    </Reorder.Item>
  )
}
