'use client'

import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'
import { motion, AnimatePresence, useScroll, useMotionValueEvent } from 'motion/react'
import { normalizeAccent } from '@/lib/card-templates'
import type { PublicPage } from '@/lib/public-page'
import { useReducedMotion } from '../motion/gates'

// Swappable NAV / HEADER bone (founder: "still no nav … add an icon to change
// it"). A freelancer nav is simple: name/logo + anchor links to the page's own
// sections + a "Request a quote" CTA. Variants adapted from the Hover.dev set:
//   - none            : no navbar (default — existing pages unchanged)
//   - simple-floating : minimal center-top pill, hover slide-up links (cheap, universal)
//   - flyout-sticky   : full-width bar, transparent→solid shrink on scroll
//   - hamburger-overlay: burger→X morph + full-screen staggered link overlay (bold)
//   - glass-magnetic  : frosted bar w/ cursor-follow blob (desktop-only, lazy)
//   - side-stagger    : right-edge dock-magnify line nav (desktop-only, lazy, RTL-mirrors)
// Heavy cursor variants are dynamically imported so a page only ships what it picks.

const GlassMagneticNav = dynamic(() => import('../nav/GlassMagneticNav').then(m => m.GlassMagneticNav), { ssr: false })
const SideStaggerNav = dynamic(() => import('../nav/SideStaggerNav').then(m => m.SideStaggerNav), { ssr: false })

export interface NavLink {
  label: string
  href: string
}

export function Nav({ page, accent, variant, isRtl }: { page: PublicPage; accent: string; variant: string; isRtl?: boolean }) {
  const v = variant || 'none'
  if (v === 'none') return null

  const p = page.profile
  const a6 = normalizeAccent(accent)
  const name = p.full_name || p.handle
  // Anchor links to the page's own sections. We keep it short + universal.
  const links: NavLink[] = [
    { label: isRtl ? 'الأعمال' : 'Work', href: '#work' },
    { label: isRtl ? 'من أنا' : 'About', href: '#about' },
    { label: isRtl ? 'تواصل' : 'Contact', href: '#contact' },
  ]
  const ctaLabel = isRtl ? 'اطلب عرض سعر' : 'Request a quote'

  const shared = { name, links, ctaLabel, accent: a6, isRtl: !!isRtl }

  switch (v) {
    case 'simple-floating':
      return <SimpleFloatingNav {...shared} />
    case 'flyout-sticky':
      return <FlyoutStickyNav {...shared} />
    case 'hamburger-overlay':
      return <HamburgerOverlayNav {...shared} />
    case 'glass-magnetic':
      return <GlassMagneticNav {...shared} />
    case 'side-stagger':
      return <SideStaggerNav {...shared} />
    default:
      return <SimpleFloatingNav {...shared} />
  }
}

export interface NavProps {
  name: string
  links: NavLink[]
  ctaLabel: string
  accent: string
  isRtl: boolean
}

// ── simple-floating: center-top pill, hover slide-up label reveal ──
function SimpleFloatingNav({ name, links, ctaLabel, accent, isRtl }: NavProps) {
  return (
    <div className="pointer-events-none sticky top-3 z-40 flex w-full justify-center px-3" dir={isRtl ? 'rtl' : 'ltr'}>
      <nav className="pointer-events-auto flex items-center gap-1 rounded-full border border-black/10 bg-white/90 px-2 py-1.5 shadow-lg backdrop-blur">
        <span className="px-3 text-[13px] font-black tracking-tight text-neutral-900">{name}</span>
        {links.map(l => (
          <SlideUpLink key={l.href} href={l.href} label={l.label} />
        ))}
        <a href="#contact" className="ml-1 rounded-full px-3.5 py-1.5 text-[12.5px] font-bold text-white" style={{ background: accent }}>
          {ctaLabel}
        </a>
      </nav>
    </div>
  )
}

function SlideUpLink({ href, label }: { href: string; label: string }) {
  return (
    <a href={href} className="group relative block overflow-hidden px-3 py-1.5 text-[12.5px] font-semibold text-neutral-700">
      <span className="block transition-transform duration-300 group-hover:-translate-y-[130%]">{label}</span>
      <span className="absolute inset-0 flex items-center justify-center translate-y-[130%] transition-transform duration-300 group-hover:translate-y-0" style={{ color: 'inherit' }}>{label}</span>
    </a>
  )
}

// ── flyout-sticky: full-width bar, transparent+tall → solid+short on scroll ──
function FlyoutStickyNav({ name, links, ctaLabel, accent, isRtl }: NavProps) {
  const [scrolled, setScrolled] = useState(false)
  const reduced = useReducedMotion()
  const { scrollY } = useScroll()
  useMotionValueEvent(scrollY, 'change', latest => setScrolled(latest > 250))

  return (
    <nav
      dir={isRtl ? 'rtl' : 'ltr'}
      className={`sticky top-0 z-40 flex w-full items-center justify-between px-5 transition-all duration-300 lg:px-10 ${
        scrolled ? 'bg-neutral-950/95 py-3 shadow-lg backdrop-blur' : 'bg-transparent py-5'
      }`}
    >
      <span className={`text-[16px] font-black tracking-tight transition-colors ${scrolled ? 'text-white' : 'text-neutral-900'}`}>{name}</span>
      <div className="hidden items-center gap-6 md:flex">
        {links.map(l => (
          <a key={l.href} href={l.href} className={`text-[13.5px] font-semibold transition-colors ${scrolled ? 'text-white/80 hover:text-white' : 'text-neutral-700 hover:text-neutral-950'}`}>
            {l.label}
          </a>
        ))}
      </div>
      <a href="#contact" className="rounded-full px-4 py-2 text-[13px] font-bold text-white shadow" style={{ background: accent }}>
        {ctaLabel}
      </a>
      {reduced && null}
    </nav>
  )
}

// ── hamburger-overlay: burger→X + full-screen staggered links ──
function HamburgerOverlayNav({ name, links, ctaLabel, accent, isRtl }: NavProps) {
  const [open, setOpen] = useState(false)
  // lock scroll while the overlay is open
  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [open])

  return (
    <nav dir={isRtl ? 'rtl' : 'ltr'} className="sticky top-0 z-50 flex w-full items-center justify-between bg-neutral-950 px-5 py-4 lg:px-10">
      <span className="text-[16px] font-black tracking-tight text-white">{name}</span>
      <button onClick={() => setOpen(o => !o)} aria-label="Menu" className="relative z-50 flex h-9 w-9 flex-col items-center justify-center gap-[5px]">
        <span className={`h-0.5 w-6 bg-white transition-transform duration-300 ${open ? 'translate-y-[7px] rotate-45' : ''}`} />
        <span className={`h-0.5 w-6 bg-white transition-opacity duration-200 ${open ? 'opacity-0' : ''}`} />
        <span className={`h-0.5 w-6 bg-white transition-transform duration-300 ${open ? '-translate-y-[7px] -rotate-45' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ clipPath: 'circle(0% at 100% 0%)' }}
            animate={{ clipPath: 'circle(150% at 100% 0%)' }}
            exit={{ clipPath: 'circle(0% at 100% 0%)' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6"
            style={{ background: accent }}
          >
            {links.map((l, i) => (
              <motion.a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0, transition: { delay: 0.15 + i * 0.1 } }}
                className="text-[38px] font-black text-white"
              >
                {l.label}
              </motion.a>
            ))}
            <motion.a
              href="#contact"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0, transition: { delay: 0.15 + links.length * 0.1 } }}
              className="mt-4 rounded-full bg-white px-6 py-3 text-[15px] font-bold text-neutral-900"
            >
              {ctaLabel}
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
