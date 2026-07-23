'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'

// The hero centerpiece: a phone that CYCLES through real-feeling freelancer
// pages, morphing every few seconds. The product IS the pitch — you watch
// beautiful Lebanese freelancer pages appear, so we show instead of tell. Each
// "page" is a stylized mini-render (name, trade, work grid, accent) themed to a
// different trade, so it reads as a living gallery of what your page becomes.
interface Sample {
  name: string
  trade: string
  city: string
  accent: string
  bg: string
  ink: string
  images: string[]
}

const SAMPLES: Sample[] = [
  { name: 'Rami Haddad', trade: 'Wedding Photographer', city: 'Beirut', accent: '#e8623d', bg: '#0e0f13', ink: '#fff',
    images: ['/demo/photographer/w1.jpg', '/demo/photographer/w2.jpg', '/demo/photographer/w3.jpg', '/demo/photographer/w4.jpg'] },
  { name: 'Maya Khoury', trade: 'Brand Designer', city: 'Jounieh', accent: '#7c4dd6', bg: '#faf8f3', ink: '#171310',
    images: ['/demo/designer/w1.jpg', '/demo/designer/w2.jpg', '/demo/designer/w3.jpg', '/demo/designer/w4.jpg'] },
  { name: 'Omar Nassar', trade: 'Full-Stack Developer', city: 'Beirut', accent: '#1f9e8f', bg: '#0b1120', ink: '#fff',
    images: ['/demo/developer/w1.jpg', '/demo/developer/w2.jpg', '/demo/developer/w3.jpg', '/demo/developer/w4.jpg'] },
]

export function HeroPageCycler() {
  const [i, setI] = useState(0)
  useEffect(() => {
    const t = setInterval(() => setI(n => (n + 1) % SAMPLES.length), 3200)
    return () => clearInterval(t)
  }, [])
  const s = SAMPLES[i]

  return (
    <div className="relative mx-auto w-[270px] sm:w-[310px]">
      {/* soft accent glow behind the phone, tinted to the current sample */}
      <div className="pointer-events-none absolute inset-0 -z-10 blur-3xl transition-colors duration-700"
        style={{ background: `radial-gradient(circle at 55% 35%, ${s.accent}33, transparent 65%)` }} />

      <div className="overflow-hidden rounded-[2.6rem] border-8 border-[#171310] shadow-[0_28px_60px_-24px_rgba(23,19,16,.5)]" style={{ background: s.bg }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="p-5"
            style={{ color: s.ink }}
          >
            {/* status pill */}
            <div className="mb-4 inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold" style={{ background: `${s.accent}22`, color: s.accent }}>
              <span className="h-1.5 w-1.5 rounded-full" style={{ background: s.accent }} /> Available for work
            </div>
            {/* name + trade */}
            <h3 className="text-[26px] font-black leading-[0.95] tracking-tight">{s.name}</h3>
            <p className="mt-1 text-[13px] font-bold" style={{ color: s.accent }}>{s.trade} · {s.city}</p>
            {/* CTA row */}
            <div className="mt-4 flex gap-2">
              <span className="rounded-full px-3.5 py-1.5 text-[11px] font-black" style={{ background: s.accent, color: s.bg }}>Request a quote</span>
              <span className="rounded-full border px-3 py-1.5 text-[11px] font-bold" style={{ borderColor: `${s.ink}33` }}>💬 WhatsApp</span>
            </div>
            {/* work grid */}
            <div className="mt-5 grid grid-cols-2 gap-1.5">
              {s.images.map((src, k) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img key={k} src={src} alt="" className="aspect-square w-full rounded-lg object-cover" />
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* the live-link chip — single line, never wraps */}
      <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-white px-4 py-2 text-[12px] font-bold text-[#171310] shadow-lg ring-1 ring-black/5">
        work-withme.com/<span style={{ color: s.accent }}>{s.name.split(' ')[0].toLowerCase()}</span>
      </div>
    </div>
  )
}
