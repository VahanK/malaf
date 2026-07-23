'use client'

import { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import { useReducedMotion } from '../motion/gates'

interface SpinningBoxTextProps {
  words: string[]
  accent: string
  isRtl?: boolean
  title?: string
}

// A rotating word that flips through what you offer — reliably. Rather than a
// fragile CSS-3D cube, this is a clean vertical reel: the current word slides up
// and out while the next slides up and in (like a flip-counter). Reads as one
// animated accent word in a headline. Reduced motion → the first word, static.
export function SpinningBoxText({ words, accent, isRtl }: SpinningBoxTextProps) {
  const reduced = useReducedMotion()
  const list = (words ?? []).map(w => w.trim()).filter(Boolean).slice(0, 6)
  const [i, setI] = useState(0)

  useEffect(() => {
    if (reduced || list.length < 2) return
    const t = setInterval(() => setI(p => (p + 1) % list.length), 2200)
    return () => clearInterval(t)
  }, [reduced, list.length])

  if (list.length === 0) return null

  const widest = list.reduce((a, b) => (b.length > a.length ? b : a), '')

  if (reduced || list.length < 2) {
    return <span className="font-black" style={{ color: accent }}>{list[0]}</span>
  }

  return (
    <span className="relative inline-grid overflow-hidden align-baseline" dir={isRtl ? 'rtl' : 'ltr'} aria-label={list.join(', ')}>
      {/* invisible sizer keeps the box the width of the widest word (no reflow) */}
      <span className="invisible col-start-1 row-start-1 font-black">{widest}</span>
      <span className="col-start-1 row-start-1">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={i}
            initial={{ y: '110%', opacity: 0 }}
            animate={{ y: '0%', opacity: 1 }}
            exit={{ y: '-110%', opacity: 0 }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="inline-block whitespace-nowrap font-black"
            style={{ color: accent }}
          >
            {list[i]}
          </motion.span>
        </AnimatePresence>
      </span>
    </span>
  )
}
