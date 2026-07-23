'use client'

import { motion } from 'motion/react'
import { twMerge } from 'tailwind-merge'
import { useReducedMotion } from '../motion/gates'

interface SpinningBoxTextProps {
  words: string[]
  accent: string
  isRtl: boolean
  title?: string
}

// Faces are laid out around a cube whose depth is 5rem (translateZ base of -5rem
// keeps rotation centered). Each face is placed on a ring by rotateX and pushed
// out along its own normal with translateZ(5rem).
const FACE_TRANSFORMS = [
  'rotateX(0deg) translateZ(5rem)',
  'rotateX(-90deg) translateZ(5rem)',
  'rotateX(-180deg) translateZ(5rem)',
  'rotateX(-270deg) translateZ(5rem)',
]

export function SpinningBoxText({ words, accent, isRtl, title }: SpinningBoxTextProps) {
  const reduced = useReducedMotion()
  const faces = (words ?? []).filter(Boolean).slice(0, 4)
  if (faces.length === 0) return null

  const first = faces[0]

  // Reduced motion: first word, static, no cube, no loop.
  if (reduced) {
    return (
      <div
        dir={isRtl ? 'rtl' : 'ltr'}
        className="flex w-full max-w-full flex-col items-center gap-3 py-6 text-center"
      >
        {title ? (
          <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--card-muted)]">
            {title}
          </span>
        ) : null}
        <span
          className="text-4xl font-black leading-none sm:text-5xl"
          style={{ color: accent }}
        >
          {first}
        </span>
      </div>
    )
  }

  // rotateX steps: 0 -> -90 -> -180 -> -270, holding on each face.
  const count = faces.length
  const stops = Array.from({ length: count }, (_, i) => i * -90)
  // Build keyframes: hold each face, rotate to next. Loop returns to a full turn.
  const keyframes: number[] = []
  const times: number[] = []
  const hold = 0.16 // fraction of cycle each face rests
  const step = 1 / count
  stops.forEach((deg, i) => {
    const base = i * step
    keyframes.push(deg, deg)
    times.push(base, base + step * (1 - hold))
  })
  // close the loop back to a full -360 turn landing on face 0
  keyframes.push(-360)
  times.push(1)

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="flex w-full max-w-full flex-col items-center gap-4 py-6 text-center"
    >
      {title ? (
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-[var(--card-muted)]">
          {title}
        </span>
      ) : null}
      <div
        className="relative h-[10rem] w-full max-w-full select-none"
        style={{ perspective: '900px' }}
        aria-label={faces.join(', ')}
      >
        <motion.div
          className="absolute inset-0"
          style={{
            transformStyle: 'preserve-3d',
            transformOrigin: 'center center -5rem',
          }}
          animate={{ rotateX: keyframes }}
          transition={{
            duration: Math.max(8, count * 2.5),
            times,
            ease: 'easeInOut',
            repeat: Infinity,
          }}
        >
          {faces.map((word, i) => (
            <div
              key={i}
              className={twMerge(
                'absolute inset-0 flex items-center justify-center',
                'text-4xl font-black leading-none sm:text-5xl',
              )}
              style={{
                transform: FACE_TRANSFORMS[i],
                backfaceVisibility: 'hidden',
                color: i === 0 ? accent : 'var(--card-ink)',
              }}
            >
              <span className="max-w-full truncate px-2">{word}</span>
            </div>
          ))}
        </motion.div>
      </div>
    </div>
  )
}
