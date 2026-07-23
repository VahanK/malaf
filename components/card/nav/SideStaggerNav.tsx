'use client'

import { useRef, useState } from 'react'
import { useIsDesktopPointer } from '../motion/gates'
import type { NavProps } from '../sections/Nav'

// Right-edge dock-magnify line nav: a column of horizontal lines that swell
// toward the cursor; the section links reveal their label on hover. Very
// editorial/art-portfolio. Desktop-pointer only; RTL mirrors it to the LEFT edge.
// Lazy-loaded. On touch it renders nothing (the page's other nav/anchors suffice).
const LINE_COUNT = 24

export function SideStaggerNav({ links, ctaLabel, accent, isRtl }: NavProps) {
  const desktop = useIsDesktopPointer()
  const [mouseY, setMouseY] = useState<number | null>(null)
  const ref = useRef<HTMLDivElement>(null)
  if (!desktop) return null

  const onMove = (e: React.MouseEvent) => {
    const r = ref.current?.getBoundingClientRect()
    if (r) setMouseY(e.clientY - r.top)
  }

  const edge = isRtl ? 'left-0' : 'right-0'
  const align = isRtl ? 'items-start' : 'items-end'
  // section links + a contact CTA at the end
  const items = [...links, { label: ctaLabel, href: '#contact' }]

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={() => setMouseY(null)}
      className={`fixed ${edge} top-1/2 z-40 flex -translate-y-1/2 flex-col ${align} gap-2 px-3 py-6`}
      dir={isRtl ? 'rtl' : 'ltr'}
    >
      {Array.from({ length: LINE_COUNT }).map((_, i) => {
        // line at proportional height; width swells with proximity to cursor
        const lineY = ref.current ? (ref.current.clientHeight / LINE_COUNT) * i : 0
        const dist = mouseY === null ? 999 : Math.abs(mouseY - lineY)
        const w = Math.max(12, 44 - dist * 0.5)
        // map some lines to links
        const linkIndex = Math.floor((i / LINE_COUNT) * items.length)
        const isLinkRow = i % Math.floor(LINE_COUNT / items.length) === 0 && linkIndex < items.length
        const link = isLinkRow ? items[linkIndex] : null
        return link ? (
          <a key={i} href={link.href} className="group flex items-center gap-2 text-[12px] font-bold text-neutral-500 hover:text-neutral-900">
            <span className="opacity-0 transition group-hover:opacity-100">{link.label}</span>
            <span className="h-1 rounded-full transition-all" style={{ width: w, background: accent }} />
          </a>
        ) : (
          <span key={i} className="h-1 rounded-full bg-neutral-300 transition-all" style={{ width: w }} />
        )
      })}
    </div>
  )
}
