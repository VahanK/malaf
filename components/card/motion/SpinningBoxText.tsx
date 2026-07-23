'use client'

import { motion } from 'motion/react'
import { useReducedMotion } from '../motion/gates'

interface SpinningBoxTextProps {
  words: string[]
  accent: string
  isRtl?: boolean
  title?: string
}

// A 3D word-cube that rotates on the X axis through up to 4 faces (the words),
// like a flip-clock reel. Sized to the TEXT (an inline-ish word), not a big
// full-width block — it reads as a rotating word in a headline. Each face sits on
// the front of a cube of half-height H, placed by rotateX(i*-90) + translateZ(H).
// The reel holds on each face, then rotates to the next; loops forever.
const H = 44 // px — half the cube height; face line-height ≈ 2*H

export function SpinningBoxText({ words, accent, isRtl, title }: SpinningBoxTextProps) {
  const reduced = useReducedMotion()
  const faces = (words ?? []).map(w => w.trim()).filter(Boolean).slice(0, 4)
  if (faces.length === 0) return null

  // Reduced motion (or a single word): show the first word statically.
  if (reduced || faces.length === 1) {
    return (
      <span className="inline-block font-black" style={{ color: accent, fontSize: `${H * 0.85}px`, lineHeight: `${H * 2}px` }} dir={isRtl ? 'rtl' : 'ltr'}>
        {faces[0]}
      </span>
    )
  }

  const count = faces.length
  // Keyframes: hold each face, then rotate -90° to the next; close on a full turn.
  const kf: number[] = []
  const times: number[] = []
  const hold = 0.55 // fraction of each face's slot spent holding still
  for (let i = 0; i < count; i++) {
    const slot = i / count
    kf.push(i * -90, i * -90)
    times.push(slot, slot + (1 / count) * hold)
  }
  kf.push(count * -90)
  times.push(1)

  return (
    <span
      className="relative inline-block align-baseline"
      dir={isRtl ? 'rtl' : 'ltr'}
      style={{ height: `${H * 2}px`, perspective: '600px', minWidth: '1ch' }}
      aria-label={faces.join(', ')}
    >
      <motion.span
        className="absolute left-0 top-0 block"
        style={{ transformStyle: 'preserve-3d', transformOrigin: `center center -${H}px` }}
        animate={{ rotateX: kf }}
        transition={{ duration: Math.max(6, count * 2.4), times, ease: 'easeInOut', repeat: Infinity, repeatType: 'loop' }}
      >
        {faces.map((word, i) => (
          <span
            key={i}
            className="absolute left-0 top-0 flex items-center whitespace-nowrap font-black"
            style={{
              transform: `rotateX(${i * 90}deg) translateZ(${H}px)`,
              backfaceVisibility: 'hidden',
              height: `${H * 2}px`,
              fontSize: `${H * 0.85}px`,
              lineHeight: `${H * 2}px`,
              color: i === 0 ? accent : 'var(--card-ink)',
            }}
          >
            {word}
          </span>
        ))}
      </motion.span>
      {/* invisible sizer so the inline box takes the widest word's width */}
      <span className="invisible whitespace-nowrap font-black" style={{ fontSize: `${H * 0.85}px`, lineHeight: `${H * 2}px` }}>
        {faces.reduce((a, b) => (b.length > a.length ? b : a), '')}
      </span>
    </span>
  )
}
