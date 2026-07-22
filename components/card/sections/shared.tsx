'use client'

import { mediaUrl } from '@/lib/media'
import type { PublicPage, PublicBlock } from '@/lib/public-page'

// Shared primitives for composable sections. The whole point (vs the old fixed
// layouts): sections are FULL-BLEED bands with numbered kickers and asymmetric
// composition — the moves that make a page read as a real website, not app UI.

export interface SectionProps {
  block: PublicBlock
  page: PublicPage
  accent: string
  index: number // 1-based, for the numbered kicker
}

// Human-readable default label per section type, used when the user leaves the
// title blank — so a 5-min user still gets meaningful "01 / Selected Work"
// kickers, never a wall of identical "01 / About".
export const TYPE_LABEL: Record<string, string> = {
  narrative: 'About',
  showcase: 'Selected Work',
  gallery: 'Gallery',
  stat_card: 'By the Numbers',
  testimonial: 'Kind Words',
  before_after: 'The Transformation',
  image_grid: 'Work',
}

/** The numbered kicker + optional title that heads a section (Creacy/OKO move). */
export function SectionKicker({
  index,
  title,
  fallback,
  accent,
  onDark = false,
}: {
  index: number
  title?: string
  fallback: string
  accent: string
  onDark?: boolean
}) {
  const label = (title && title.trim()) || fallback
  return (
    <div className="mb-8 flex items-baseline gap-4">
      <span className="font-mono text-[13px] font-semibold tabular-nums" style={{ color: accent }}>
        {String(index).padStart(2, '0')}
      </span>
      <span className="h-px flex-1 max-w-[3rem]" style={{ background: onDark ? 'rgba(255,255,255,.2)' : 'var(--card-border)' }} />
      <span className={`text-[12px] font-semibold uppercase tracking-[0.22em] ${onDark ? 'text-white/60' : 'text-[var(--card-muted)]'}`}>
        {label}
      </span>
    </div>
  )
}

/** A full-bleed section band. `tone` controls the background — the alternating
 *  light/dark rhythm (Ivory) is 80% of the "real website" feel. */
export function Band({
  children,
  tone = 'base',
  accent,
  className = '',
}: {
  children: React.ReactNode
  tone?: 'base' | 'soft' | 'dark'
  accent?: string
  className?: string
}) {
  const bg =
    tone === 'dark'
      ? 'var(--card-ink)'
      : tone === 'soft'
        ? 'var(--card-surface-soft)'
        : 'var(--card-bg)'
  const text = tone === 'dark' ? { color: 'var(--card-bg)' } : undefined
  return (
    <section
      className={`w-full px-6 py-16 sm:py-20 lg:px-10 ${className}`}
      style={{ background: bg, ...text }}
    >
      <div className="mx-auto max-w-5xl">{children}</div>
    </section>
  )
}

export { mediaUrl }
export type { PublicBlock }
