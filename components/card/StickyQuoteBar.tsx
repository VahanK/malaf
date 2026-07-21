'use client'

import { useEffect, useState } from 'react'

// Slim bottom bar that appears once the in-page "Request a quote" CTA has
// scrolled out of view — the page's one job is converting viewers into quote
// requests (CLAUDE.md §0), so the ask stays reachable on long portfolios.
export function StickyQuoteBar({ accent, name }: { accent: string; name: string }) {
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

  return (
    <div
      className="fixed inset-x-0 bottom-0 z-40 px-4 pb-[max(env(safe-area-inset-bottom),12px)] transition-all duration-300"
      style={{
        transform: show ? 'translateY(0)' : 'translateY(110%)',
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
      }}
    >
      <div className="mx-auto flex max-w-md items-center gap-3 rounded-2xl border border-white/10 bg-[#16181f]/95 px-4 py-2.5 shadow-[0_10px_40px_rgba(0,0,0,.55)] backdrop-blur">
        <span className="min-w-0 flex-1 truncate text-[12.5px] text-[#9aa0ae]">
          Work with {name}
        </span>
        <button
          onClick={scrollToCta}
          className="shrink-0 rounded-xl px-4 py-2 text-[13px] font-black text-[#141414]"
          style={{ background: accent }}
        >
          Request a quote
        </button>
      </div>
    </div>
  )
}
