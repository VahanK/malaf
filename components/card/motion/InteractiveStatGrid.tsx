'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { twMerge } from 'tailwind-merge'
import { useReducedMotion } from '../motion/gates'

// Stat grid where a shared layoutId edge-line (accent) slides to the hovered /
// focused cell; the active stat is colored, the rest greyed. Reduced-motion
// renders the same grid with every cell fully colored and no sliding line.

interface Stat {
  value: string
  label: string
}

interface InteractiveStatGridProps {
  stats: Stat[]
  accent: string
  isRtl: boolean
  title?: string
}

export function InteractiveStatGrid({
  stats,
  accent,
  isRtl,
  title,
}: InteractiveStatGridProps) {
  const reduced = useReducedMotion()
  const [active, setActive] = useState(0)

  if (!stats || stats.length === 0) return null

  const cols = stats.length >= 4 ? 'grid-cols-2 sm:grid-cols-4' : 'grid-cols-2'

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full">
      {title ? (
        <h3 className="mb-4 text-sm font-semibold uppercase tracking-wide text-[var(--card-muted)]">
          {title}
        </h3>
      ) : null}

      <div className={twMerge('grid gap-3', cols)}>
        {stats.map((stat, i) => {
          const isActive = reduced || active === i
          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className={twMerge(
                'relative flex min-w-0 flex-col gap-1 overflow-hidden rounded-[var(--card-radius-lg)]',
                'border border-[var(--card-border)] bg-[var(--card-surface)] px-4 py-5',
                'outline-none transition-colors duration-300',
                isActive ? '' : 'opacity-70',
              )}
              style={
                isActive
                  ? { boxShadow: `inset 0 0 0 1px ${accent}22` }
                  : undefined
              }
            >
              {/* Accent edge-line: shared layoutId makes it slide between cells. */}
              {isActive && !reduced ? (
                <motion.span
                  layoutId="stat-edge"
                  className={twMerge(
                    'pointer-events-none absolute inset-y-0 w-[3px]',
                    isRtl ? 'right-0' : 'left-0',
                  )}
                  style={{ backgroundColor: accent }}
                  transition={{ type: 'spring', stiffness: 500, damping: 40 }}
                />
              ) : null}
              {reduced ? (
                <span
                  className={twMerge(
                    'pointer-events-none absolute inset-y-0 w-[3px]',
                    isRtl ? 'right-0' : 'left-0',
                  )}
                  style={{ backgroundColor: accent }}
                />
              ) : null}

              <span
                className="text-2xl font-bold leading-tight tabular-nums transition-colors duration-300 sm:text-3xl"
                style={{ color: isActive ? accent : 'var(--card-ink)' }}
              >
                {stat.value}
              </span>
              <span
                className={twMerge(
                  'text-xs leading-snug transition-colors duration-300',
                  isActive ? 'text-[var(--card-ink)]' : 'text-[var(--card-muted)]',
                )}
              >
                {stat.label}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
