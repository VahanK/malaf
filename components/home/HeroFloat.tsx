'use client'

import { motion, useReducedMotion } from 'framer-motion'
import type { ReactNode } from 'react'

// Thin motion wrapper for the hero phone mockup: an on-load rise + fade, plus
// the resting -2deg tilt. The mockup image itself is passed as children (a plain
// <img>), so this file owns motion only. Honors prefers-reduced-motion.
export function HeroFloat({ children }: { children: ReactNode }) {
  const reduce = useReducedMotion()

  if (reduce) {
    return <div className="lg:-rotate-2">{children}</div>
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, rotate: 0 }}
      animate={{ opacity: 1, y: 0, rotate: -2 }}
      transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      className="lg:[transform-origin:center]"
    >
      {children}
    </motion.div>
  )
}

// A floating callout pill that gently bobs. Used for the two hero overlay chips.
export function FloatPill({
  children,
  className = '',
  delay = 0,
}: {
  children: ReactNode
  className?: string
  delay?: number
}) {
  const reduce = useReducedMotion()

  const base =
    'absolute flex items-center gap-2 rounded-full bg-white px-3 py-2 text-[12px] font-semibold text-[#171310] shadow-[0_8px_24px_-8px_rgba(23,19,16,.3)]'

  if (reduce) {
    return <div className={`${base} ${className}`}>{children}</div>
  }

  return (
    <motion.div
      className={`${base} ${className}`}
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: [0, -6, 0] }}
      transition={{
        opacity: { duration: 0.4, delay: 0.5 + delay },
        y: { duration: 4, repeat: Infinity, ease: 'easeInOut', delay },
      }}
    >
      {children}
    </motion.div>
  )
}
