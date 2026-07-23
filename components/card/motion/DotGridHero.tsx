'use client'

import { useMemo } from 'react'
import { twMerge } from 'tailwind-merge'
import { useReducedMotion } from '../motion/gates'

// DotGridHero — an animated dot-grid backdrop for the hero (the dev-portfolio
// move). Small accent-tinted dots ripple in a staggered diagonal wave via a
// pure-CSS keyframe with per-dot animation-delay. Cheap: one keyframe, no JS
// loop, no layout. reduced-motion -> the same grid rendered static (dots sit at
// their resting size/opacity, no animation). Fills its parent, never captures
// pointer events.

type DotGridHeroProps = {
  className?: string
  accent: string
  isRtl: boolean
  title?: string
}

const COLS = 14
const ROWS = 8

export function DotGridHero({ className, accent, isRtl }: DotGridHeroProps) {
  const reduced = useReducedMotion()

  // Precompute per-dot diagonal delay so the wave sweeps across the grid. In RTL
  // we start the wave from the right edge so the motion reads with the language.
  const dots = useMemo(() => {
    const out: { key: string; delay: number; col: number; row: number }[] = []
    for (let row = 0; row < ROWS; row++) {
      for (let col = 0; col < COLS; col++) {
        const c = isRtl ? COLS - 1 - col : col
        // diagonal distance -> staggered wave; scaled to keep total loop tight
        const delay = ((c + row) / (COLS + ROWS)) * 2.4
        out.push({ key: `${row}-${col}`, delay, col, row })
      }
    }
    return out
  }, [isRtl])

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      aria-hidden="true"
      className={twMerge(
        'pointer-events-none absolute inset-0 overflow-hidden',
        className,
      )}
    >
      <div
        className="grid h-full w-full max-w-full place-items-center"
        style={{
          gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`,
          gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))`,
          // fade the field toward the edges so it stays a subtle backdrop
          maskImage:
            'radial-gradient(ellipse 80% 75% at 50% 45%, #000 40%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 80% 75% at 50% 45%, #000 40%, transparent 100%)',
        }}
      >
        {dots.map((d) => (
          <span
            key={d.key}
            className="dgh-dot block rounded-full"
            style={{
              width: '4px',
              height: '4px',
              background: accent,
              opacity: reduced ? 0.28 : undefined,
              transform: reduced ? 'scale(1)' : undefined,
              animationDelay: reduced ? undefined : `${d.delay}s`,
            }}
          />
        ))}
      </div>

      <style>{`
        .dgh-dot {
          opacity: 0.18;
          transform: scale(0.85);
          will-change: transform, opacity;
        }
        @media (prefers-reduced-motion: no-preference) {
          .dgh-dot {
            animation: dgh-pulse 2.8s ease-in-out infinite;
          }
        }
        @keyframes dgh-pulse {
          0%, 100% { opacity: 0.14; transform: scale(0.7); }
          45%      { opacity: 0.55; transform: scale(1.25); }
        }
      `}</style>
    </div>
  )
}
