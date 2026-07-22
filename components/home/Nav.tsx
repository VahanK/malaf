'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { FaWhatsapp } from 'react-icons/fa'

// Single source of truth is lib/founder.ts. Re-export so existing
// `import { FOUNDER_WA } from '@/components/home/Nav'` callers keep working.
import { FOUNDER_WA } from '@/lib/founder'
export { FOUNDER_WA }

const LINKS = [
  { label: 'Examples', href: '/examples' },
  { label: 'Pricing', href: '#pricing' },
  { label: 'FAQ', href: '#faq' },
]

export function Nav() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Lock body scroll while the mobile sheet is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [menuOpen])

  return (
    <header
      className={`sticky top-0 z-50 bg-[#f7f3ec]/85 backdrop-blur transition-shadow ${
        scrolled ? 'border-b border-[#171310]/10 shadow-sm' : ''
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 lg:px-10">
        {/* wordmark */}
        <Link href="/" className="font-serif text-[20px] font-semibold tracking-tight text-[#171310]">
          WorkWith<span className="text-[#e8623d]">.</span>
        </Link>

        {/* desktop center links */}
        <div className="hidden items-center gap-8 md:flex">
          {LINKS.map(l => (
            <a
              key={l.href}
              href={l.href}
              className="text-[14px] text-[#5c574c] transition-colors hover:text-[#e8623d]"
            >
              {l.label}
            </a>
          ))}
        </div>

        {/* desktop right actions */}
        <div className="hidden items-center gap-4 md:flex">
          <a
            href={FOUNDER_WA}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-[14px] text-[#5c574c] transition-colors hover:text-[#171310]"
          >
            <FaWhatsapp className="text-[15px]" /> Let&apos;s talk
          </a>
          <Link href="/auth/signin" className="text-[14px] text-[#5c574c] transition-colors hover:text-[#171310]">
            Log in
          </Link>
          <Link
            href="/auth/signup"
            className="rounded-xl bg-[#e8623d] px-5 py-2.5 text-[14px] font-bold text-white transition-colors hover:bg-[#d4512f]"
          >
            Make your page
          </Link>
        </div>

        {/* mobile actions */}
        <div className="flex items-center gap-2 md:hidden">
          <Link
            href="/auth/signup"
            className="rounded-xl bg-[#e8623d] px-4 py-2 text-[13px] font-bold text-white"
          >
            Make your page
          </Link>
          <button
            onClick={() => setMenuOpen(v => !v)}
            aria-label={menuOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={menuOpen}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-[#171310] hover:bg-[#171310]/5"
          >
            {menuOpen ? <CloseIcon /> : <MenuIcon />}
          </button>
        </div>
      </nav>

      {/* mobile sheet */}
      {menuOpen && (
        <>
          <div
            className="fixed inset-0 top-16 z-40 bg-black/20 md:hidden"
            onClick={() => setMenuOpen(false)}
            aria-hidden
          />
          <div className="absolute inset-x-0 top-16 z-50 border-b border-[#171310]/10 bg-[#f7f3ec] px-6 py-6 md:hidden">
            <div className="flex flex-col gap-5">
              {LINKS.map(l => (
                <a
                  key={l.href}
                  href={l.href}
                  onClick={() => setMenuOpen(false)}
                  className="text-[18px] font-medium text-[#171310]"
                >
                  {l.label}
                </a>
              ))}
              <a
                href={FOUNDER_WA}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setMenuOpen(false)}
                className="flex items-center gap-2 text-[18px] font-medium text-[#171310]"
              >
                <FaWhatsapp className="text-[19px] text-[#e8623d]" /> Let&apos;s talk
              </a>
              <Link
                href="/auth/signin"
                onClick={() => setMenuOpen(false)}
                className="text-[18px] font-medium text-[#171310]"
              >
                Log in
              </Link>
              <Link
                href="/auth/signup"
                onClick={() => setMenuOpen(false)}
                className="mt-1 rounded-xl bg-[#e8623d] py-3 text-center text-[15px] font-bold text-white"
              >
                Make your page — free
              </Link>
            </div>
          </div>
        </>
      )}
    </header>
  )
}

function MenuIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M4 7h16M4 12h16M4 17h16" />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}
