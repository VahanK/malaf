'use client'

import { useEffect, useState } from 'react'

// Slim bottom bar that appears once the in-page "Request a quote" CTA has
// scrolled out of view — the page's one job is converting viewers into quote
// requests (CLAUDE.md §0), so the ask stays reachable on long portfolios.
export function StickyQuoteBar({
  accent, name, corner,
}: { accent: string; name: string; corner: 'soft' | 'sharp' }) {
  const [show, setShow] = useState(false)

  useEffect(() => {
    const target = document.getElementById('quote-cta')
    if (!target || typeof IntersectionObserver === 'undefined') return
    let ctaVisible = true
    let scrolled = false
    const update = () => setShow(!ctaVisible && scrolled)
    const io = new IntersectionObserver(
      entries => { ctaVisible = entries[0].isIntersecting; update() },
      { threshold: 0 }
    )
    io.observe(target)
    // the bar appears whenever the CTA is off-screen in either direction,
    // but never on first paint before the visitor has scrolled at all
    const onScroll = () => { scrolled = window.scrollY > 300; update() }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll) }
  }, [])

  const scrollToCta = () => {
    document.getElementById('quote-cta')?.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }

  const barRadius = corner === 'sharp' ? 'rounded-[var(--card-radius-md)]' : 'rounded-2xl'
  const pillRadius = corner === 'sharp' ? 'rounded-[var(--card-radius-md)]' : 'rounded-xl'

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),12px)] transition-all duration-300"
      style={{
        transform: show ? 'translateY(0)' : 'translateY(110%)',
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <div className={`mx-auto flex max-w-md items-center gap-3 border border-[var(--card-border)] bg-[var(--card-surface)]/95 px-4 py-2.5 shadow-[var(--card-shadow)] backdrop-blur ${barRadius}`}>
        <span className="min-w-0 flex-1 truncate text-[12.5px] text-[var(--card-muted)]">
          Work with {name}
        </span>
        <button
          onClick={scrollToCta}
          className={`shrink-0 px-4 py-2 text-[13px] font-black text-[var(--card-accent-ink)] ${pillRadius}`}
          style={{ background: accent }}
        >
          Request a quote
        </button>
      </div>
    </div>
  )
}
