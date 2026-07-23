'use client'

import { useEffect, useState } from 'react'
import { useReducedMotion } from '../motion/gates'

// Airport-board split-flap display: each cell flips through a character pool to
// settle on its target letter, spelling the given text (a name / headline). Pure
// state + rAF-free interval stepping that stops once every cell has settled, so
// it costs nothing when idle. Latin + digits + space only — non-Latin text (e.g.
// Arabic) renders statically. reduced-motion → final text immediately.
const POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 '

interface SplitFlapDisplayProps {
  text: string
  accent: string
  isRtl?: boolean
  title?: string
}

const isLatin = (s: string) => /^[A-Za-z0-9 .,'!?-]*$/.test(s)

export function SplitFlapDisplay({ text, accent, isRtl }: SplitFlapDisplayProps) {
  const reduced = useReducedMotion()
  const target = (text || '').toUpperCase().slice(0, 40)
  const canFlip = !reduced && isLatin(text || '')
  const [display, setDisplay] = useState<string>(() => (canFlip ? ' '.repeat(target.length) : target))

  useEffect(() => {
    if (!canFlip) { setDisplay(target); return }
    // Each cell walks the pool from its start index toward the target index.
    const idx = target.split('').map(() => 0)
    const goalIdx = target.split('').map(ch => Math.max(0, POOL.indexOf(ch)))
    let raf = 0
    let last = 0
    const step = (t: number) => {
      if (t - last > 45) {
        last = t
        let settled = true
        for (let i = 0; i < target.length; i++) {
          if (idx[i] < goalIdx[i]) { idx[i]++; settled = false }
        }
        setDisplay(idx.map((v, i) => POOL[Math.min(v, goalIdx[i])] ?? ' ').join(''))
        if (settled) return
      }
      raf = requestAnimationFrame(step)
    }
    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, canFlip])

  const cells = (canFlip ? display : target).split('')

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="flex w-full max-w-full flex-wrap justify-center gap-1.5 py-8">
      {cells.map((ch, i) => (
        <span
          key={i}
          className="relative flex h-14 w-10 items-center justify-center rounded-md bg-neutral-900 font-mono text-[26px] font-black text-white shadow-inner sm:h-16 sm:w-12 sm:text-[32px]"
          style={{ borderBottom: `2px solid ${accent}` }}
        >
          <span className="absolute inset-x-0 top-1/2 h-px bg-black/40" />
          {ch === ' ' ? ' ' : ch}
        </span>
      ))}
    </div>
  )
}
