'use client'

import { useRef, useState } from 'react'

// After the public-page rebuild (commit d0e3de7), the layouts under
// components/card/layouts/ render everything directly. The only block still
// factored out here is the draggable before/after slider, reused by
// GradientLayout — the rest (image grid, testimonial, stat, video, case card,
// the old Block switch, and an internal Lightbox superseded by
// layouts/Lightbox.tsx) was dead code and has been removed.

// Gradient stand-ins keep the slider presentable before real photos are uploaded.
const GRADIENTS = [
  'linear-gradient(135deg,#42351d,#8a6f39)',
  'linear-gradient(160deg,#232733,#3d4152)',
  'linear-gradient(135deg,#1f2b26,#3c5a4c)',
  'linear-gradient(150deg,#33222b,#5e3c4e)',
  'linear-gradient(140deg,#20242e,#49506b)',
  'linear-gradient(150deg,#3d2f1c,#77602f)',
]

function Img({ url, alt, index, className }: { url?: string; alt?: string; index: number; className: string }) {
  const [failed, setFailed] = useState(false)
  if (url && !failed) {
    // eslint-disable-next-line @next/next/no-img-element
    return (
      <img
        src={url}
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

interface BeforeAfterProps { data: Record<string, unknown>; accent: string; radiusClass: string }

/* ---------- before/after: draggable comparison slider ---------- */

export function BeforeAfter({ data, accent, radiusClass }: BeforeAfterProps) {
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
