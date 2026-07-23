'use client'

import { useRef } from 'react'
import { useIsDesktopPointer } from '../motion/gates'
import type { NavProps } from '../sections/Nav'

// Frosted-glass nav with a gradient blob that follows the cursor inside the bar.
// Desktop-pointer only (cursor tracking); on touch / reduced viewport it degrades
// to a plain frosted bar. Lazy-loaded so only pages that pick it ship this.
export function GlassMagneticNav({ name, links, ctaLabel, accent, isRtl }: NavProps) {
  const desktop = useIsDesktopPointer()
  const blobRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)

  const onMove = (e: React.MouseEvent) => {
    if (!desktop || !blobRef.current || !navRef.current) return
    const r = navRef.current.getBoundingClientRect()
    blobRef.current.style.transform = `translate(${e.clientX - r.left - 40}px, ${e.clientY - r.top - 40}px)`
  }

  return (
    <div className="sticky top-3 z-40 flex w-full justify-center px-3" dir={isRtl ? 'rtl' : 'ltr'}>
      <nav
        ref={navRef}
        onMouseMove={onMove}
        className="relative flex items-center gap-1 overflow-hidden rounded-full border border-white/30 bg-white/15 px-2 py-1.5 shadow-lg backdrop-blur-xl"
        style={desktop ? { cursor: 'none' } : undefined}
      >
        {desktop && (
          <div
            ref={blobRef}
            className="pointer-events-none absolute left-0 top-0 h-20 w-20 rounded-full opacity-70 blur-2xl transition-transform duration-100"
            style={{ background: accent }}
          />
        )}
        <span className="relative z-10 px-3 text-[13px] font-black tracking-tight text-neutral-900">{name}</span>
        {links.map(l => (
          <a key={l.href} href={l.href} className="relative z-10 rounded-full px-3 py-1.5 text-[12.5px] font-semibold text-neutral-800 transition hover:bg-white/40">
            {l.label}
          </a>
        ))}
        <a href="#contact" className="relative z-10 ml-1 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold text-white" style={{ background: accent }}>
          {ctaLabel}
        </a>
      </nav>
    </div>
  )
}
