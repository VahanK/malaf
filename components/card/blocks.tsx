'use client'

import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { mediaUrl } from '@/lib/media'
import type { PublicBlock } from '@/lib/public-page'

// Gradient stand-ins keep the card presentable before real photos are uploaded.
const GRADIENTS = [
  'linear-gradient(135deg,#42351d,#8a6f39)',
  'linear-gradient(160deg,#232733,#3d4152)',
  'linear-gradient(135deg,#1f2b26,#3c5a4c)',
  'linear-gradient(150deg,#33222b,#5e3c4e)',
  'linear-gradient(140deg,#20242e,#49506b)',
  'linear-gradient(150deg,#3d2f1c,#77602f)',
]

function Img({ url, alt, index, className }: { url?: string; alt?: string; index: number; className: string }) {
  const src = mediaUrl(url)
  const [failed, setFailed] = useState(false)
  if (src && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={src}
        alt={alt ?? ''}
        className={`${className} object-cover`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    )
  }
  return (
    <div
      role="img"
      aria-label={alt ?? ''}
      title={alt ?? ''}
      className={className}
      style={{ background: GRADIENTS[index % GRADIENTS.length] }}
    />
  )
}

interface BlockProps { data: Record<string, unknown>; accent: string; radiusClass: string }

/* ---------- image grid: editorial layout + full-screen lightbox ---------- */

interface GridImage { url?: string; alt?: string }

export function ImageGrid({ data, radiusClass }: Pick<BlockProps, 'data' | 'radiusClass'>) {
  const images = ((data.images as GridImage[] | undefined) ?? []).slice(0, 9)
  const [openAt, setOpenAt] = useState<number | null>(null)
  if (!images.length) return null
  const cellRadius = radiusClass.includes('lg') ? 'rounded-[var(--card-radius-md)]' : radiusClass

  return (
    <>
      <div className="grid grid-cols-3 gap-1.5">
        {images.map((img, i) => (
          <button
            key={i}
            onClick={() => setOpenAt(i)}
            aria-label={img.alt || `Photo ${i + 1}`}
            className={`stagger group transition-transform active:scale-[0.97] ${i === 0 ? 'col-span-2 row-span-2' : ''}`}
            style={{ transitionDelay: `${Math.min(i * 70, 420)}ms` }}
          >
            <span className={`block h-full w-full overflow-hidden ${cellRadius}`}>
              <Img
                url={img.url}
                alt={img.alt}
                index={i}
                className="aspect-square h-full w-full transition-transform duration-700 ease-out group-hover:scale-[1.06]"
              />
            </span>
          </button>
        ))}
      </div>
      {openAt !== null && (
        <Lightbox images={images} start={openAt} onClose={() => setOpenAt(null)} />
      )}
    </>
  )
}

function Lightbox({ images, start, onClose }: { images: GridImage[]; start: number; onClose: () => void }) {
  const [at, setAt] = useState(start)
  const img = images[at]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setAt(a => Math.min(a + 1, images.length - 1))
      if (e.key === 'ArrowLeft') setAt(a => Math.max(a - 1, 0))
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [images.length, onClose])

  // Portal to <body>: the card sections keep a stacking context from their
  // entrance animation, which would otherwise trap this overlay underneath
  // the sticky quote bar.
  return createPortal(
    <div
      className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
    >
      <div className="relative max-h-[80vh] w-full max-w-lg" onClick={e => e.stopPropagation()}>
        <Img url={img.url} alt={img.alt} index={at} className="max-h-[80vh] w-full rounded-xl" />
      </div>
      {img.alt && <p className="mt-3 max-w-lg text-center text-[12.5px] text-[#9aa0ae]">{img.alt}</p>}
      <div className="mt-3 flex items-center gap-5" onClick={e => e.stopPropagation()}>
        <button
          onClick={() => setAt(a => Math.max(a - 1, 0))}
          disabled={at === 0}
          aria-label="Previous photo"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30"
        >
          ‹
        </button>
        <span className="text-[11px] text-[#9aa0ae]">{at + 1} / {images.length}</span>
        <button
          onClick={() => setAt(a => Math.min(a + 1, images.length - 1))}
          disabled={at === images.length - 1}
          aria-label="Next photo"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30"
        >
          ›
        </button>
      </div>
      <button
        onClick={onClose}
        aria-label="Close"
        className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-lg text-white"
      >
        ✕
      </button>
    </div>,
    document.body
  )
}

/* ---------- before/after: draggable comparison slider ---------- */

export function BeforeAfter({ data, accent, radiusClass }: BlockProps) {
  const before = data.before as { url?: string } | undefined
  const after = data.after as { url?: string } | undefined
  const caption = (data.caption as string) ?? ''
  const [pos, setPos] = useState(50) // % from the left where the divider sits
  const ref = useRef<HTMLDivElement | null>(null)
  const dragging = useRef(false)

  const moveTo = (clientX: number) => {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const pct = ((clientX - rect.left) / rect.width) * 100
    setPos(Math.min(96, Math.max(4, pct)))
  }

  return (
    <div>
      <div
        ref={ref}
        className={`relative aspect-[4/5] touch-none select-none overflow-hidden ${radiusClass}`}
        onPointerDown={e => { dragging.current = true; moveTo(e.clientX) }}
        onPointerMove={e => { if (dragging.current) moveTo(e.clientX) }}
        onPointerUp={() => { dragging.current = false }}
        onPointerLeave={() => { dragging.current = false }}
      >
        {/* after fills; before sits on top clipped to the divider */}
        <Img url={after?.url} alt="After" index={5} className="absolute inset-0 h-full w-full" />
        <div className="absolute inset-0" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>
          <Img url={before?.url} alt="Before" index={1} className="h-full w-full" />
        </div>

        {/* divider + handle */}
        <div className="pointer-events-none absolute inset-y-0" style={{ left: `${pos}%` }}>
          <div className="h-full w-[2px] -translate-x-1/2 bg-white/90 shadow-[0_0_12px_rgba(0,0,0,.6)]" />
          <div
            className="handle-nudge absolute top-1/2 flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-[13px] font-black text-[var(--card-accent-ink)] shadow-lg"
            style={{ background: accent }}
          >
            ⇄
          </div>
        </div>

        <span
          className="absolute start-2.5 top-2.5 rounded-full bg-black/55 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white/90 transition-opacity"
          style={{ opacity: pos > 15 ? 1 : 0 }}
        >
          Before
        </span>
        <span
          className="absolute end-2.5 top-2.5 rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--card-accent-ink)] transition-opacity"
          style={{ background: accent, opacity: pos < 85 ? 1 : 0 }}
        >
          After
        </span>
      </div>
      <p className="mt-1.5 text-center text-[11px] text-[var(--card-muted-2)]">
        {caption || 'Drag to compare'}
      </p>
    </div>
  )
}

/* ---------- testimonial: true WhatsApp incoming-bubble anatomy ---------- */

export function Testimonial({ data, radiusClass }: Pick<BlockProps, 'data' | 'radiusClass'>) {
  const text = (data.text as string) ?? ''
  const attribution = (data.attribution as string) ?? ''
  const dateLabel = (data.date_label as string) ?? ''
  if (!text) return null
  return (
    <div className={`bg-[#0b141a] px-3.5 py-3.5 ${radiusClass}`}>
      <div className="relative max-w-[92%]">
        {/* bubble tail */}
        <span
          aria-hidden
          className="absolute -start-[7px] top-0 h-0 w-0 border-t-[10px] border-e-[9px] border-t-[#202c33] border-e-transparent"
        />
        <div className="rounded-lg rounded-ss-none bg-[#202c33] px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,.35)]">
          {attribution && (
            <p className="text-[11.5px] font-bold text-[#53bdeb]">{attribution}</p>
          )}
          <p className="mt-0.5 text-[13.5px] leading-relaxed text-[#e9edef]">{text}</p>
          <p className="mt-1 text-end text-[10px] leading-none text-[#8696a0]">
            {dateLabel || '11:47'}
          </p>
        </div>
      </div>
    </div>
  )
}

/* ---------- stat card: counts up when scrolled into view ---------- */

export function StatCard({ data, accent, radiusClass }: BlockProps) {
  const value = (data.value as string) ?? ''
  const label = (data.label as string) ?? ''
  const ref = useRef<HTMLDivElement | null>(null)
  const [display, setDisplay] = useState(value)

  useEffect(() => {
    const match = value.match(/^(\D*)(\d+)(.*)$/)
    if (!match) return // not numeric — render as-is
    const [, prefix, numStr, suffix] = match
    const target = parseInt(numStr, 10)
    if (target === 0 || target > 100000) return
    const el = ref.current
    if (!el || typeof IntersectionObserver === 'undefined') return

    setDisplay(`${prefix}0${suffix}`)
    const io = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return
      io.disconnect()
      const t0 = performance.now()
      const dur = 1100
      const tick = (t: number) => {
        const p = Math.min((t - t0) / dur, 1)
        const eased = 1 - Math.pow(1 - p, 3)
        setDisplay(`${prefix}${Math.round(target * eased)}${suffix}`)
        if (p < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }, { threshold: 0.4 })
    io.observe(el)
    return () => io.disconnect()
  }, [value])

  if (!value) return null
  return (
    <div ref={ref} className={`border border-[var(--card-border)] bg-[var(--card-surface)] px-4 py-5 text-center ${radiusClass}`}>
      <div className="text-[34px] font-black leading-none tabular-nums" style={{ color: accent }}>{display}</div>
      <div className="mt-1.5 text-[12.5px] text-[var(--card-muted)]">{label}</div>
    </div>
  )
}

/* ---------- video link + case card ---------- */

export function VideoLink({ data, accent, radiusClass }: BlockProps) {
  const url = (data.url as string) ?? ''
  const title = (data.title as string) ?? 'Watch'
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className={`flex items-center gap-3 border border-[var(--card-border)] bg-[var(--card-surface)] px-4 py-3 transition-colors hover:border-[var(--card-muted)] ${radiusClass}`}
    >
      <span
        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm text-[var(--card-accent-ink)]"
        style={{ background: accent }}
      >
        ▶
      </span>
      <span className="text-[13.5px] font-semibold">{title}</span>
      <span className="ms-auto text-[var(--card-muted-2)]">↗</span>
    </a>
  )
}

export function CaseCard({ data, accent, radiusClass }: BlockProps) {
  const title = (data.title as string) ?? ''
  const excerpt = (data.excerpt as string) ?? ''
  if (!title) return null
  return (
    <div className={`border border-[var(--card-border)] bg-[var(--card-surface)] px-4 py-3.5 ${radiusClass}`}>
      <div className="h-[3px] w-8 rounded-full" style={{ background: accent }} />
      <h3 className="mt-2.5 text-[14px] font-bold">{title}</h3>
      {excerpt ? <p className="mt-1 text-[12.5px] leading-relaxed text-[var(--card-muted)]">{excerpt}</p> : null}
    </div>
  )
}

export function Block({ block, accent, radiusClass }: { block: PublicBlock; accent: string; radiusClass: string }) {
  switch (block.type) {
    case 'image_grid': return <ImageGrid data={block.data} radiusClass={radiusClass} />
    case 'before_after': return <BeforeAfter data={block.data} accent={accent} radiusClass={radiusClass} />
    case 'testimonial': return <Testimonial data={block.data} radiusClass={radiusClass} />
    case 'stat_card': return <StatCard data={block.data} accent={accent} radiusClass={radiusClass} />
    case 'video_link': return <VideoLink data={block.data} accent={accent} radiusClass={radiusClass} />
    case 'case_card': return <CaseCard data={block.data} accent={accent} radiusClass={radiusClass} />
    default: return null
  }
}
