'use client'

import { mediaUrl } from '@/lib/media'
import { SectionFrame } from '../edit/SectionFrame'
import type { PublicPage, PublicBlock } from '@/lib/public-page'

// Shared primitives for composable sections. The whole point (vs the old fixed
// layouts): sections are FULL-BLEED bands with numbered kickers and asymmetric
// composition — the moves that make a page read as a real website, not app UI.

// A "world" is the visual identity a template belongs to (1:1 with card_template
// id). It drives per-world TYPE — the founder's "typography isn't the same for
// anything" fix. Each world differs from the others by a real lever (family OR
// weight OR case), never a tracking nudge, so the eye catches the difference.
export type World =
  | 'editorial-dark' | 'minimal-light' | 'warm-gradient'
  | 'glassmorphism' | 'midnight' | 'clean-gradient'
  | 'brutalist' | 'bento'

export interface SectionProps {
  block: PublicBlock
  page: PublicPage
  accent: string
  index: number // 1-based, for the numbered kicker
  toneHint?: 'base' | 'soft' | 'dark' // cadence tone from the layout (flexible variants use it)
  world?: World // type identity — sections read this for per-world headings
  isRtl?: boolean // Arabic page — sections prefer *_ar fields + inherit RTL from <main>
}

/** Resolve the display string for a section, preferring the Arabic value on an
 *  RTL page and falling back to the English one. */
export function arText(isRtl: boolean | undefined, en?: string, ar?: string): string {
  return ((isRtl && ar ? ar : en) ?? '')
}

/** Per-world heading treatment. The single source of the "type isn't the same"
 *  differentiation: returns the heading class string (family/weight/case), the
 *  hero max font size, and whether kickers uppercase — each world moves at least
 *  one full lever from the others. */
export function worldType(world?: World): { heading: string; heroMax: number; kickerUpper: boolean } {
  switch (world) {
    case 'brutalist':
      return { heading: 'font-sans font-black uppercase tracking-[-0.04em]', heroMax: 200, kickerUpper: true }
    case 'minimal-light':
      return { heading: 'font-serif font-normal tracking-[-0.04em]', heroMax: 120, kickerUpper: false }
    case 'warm-gradient':
      return { heading: 'font-serif font-medium tracking-[-0.01em]', heroMax: 100, kickerUpper: false }
    case 'bento':
      return { heading: 'font-serif font-bold tracking-normal', heroMax: 72, kickerUpper: false }
    case 'midnight':
      return { heading: 'font-sans font-extrabold uppercase tracking-[-0.03em]', heroMax: 104, kickerUpper: true }
    case 'glassmorphism':
      return { heading: 'font-sans font-semibold tracking-[-0.02em]', heroMax: 96, kickerUpper: false }
    case 'clean-gradient':
      return { heading: 'font-sans font-extrabold tracking-[-0.025em] card-gradient-text', heroMax: 96, kickerUpper: false }
    case 'editorial-dark':
    default:
      return { heading: 'font-sans font-black tracking-[-0.03em]', heroMax: 104, kickerUpper: false }
  }
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
  bleed = false,
  id,
  frameId,
  frameLabel,
  frameType,
  frameVariant,
}: {
  children: React.ReactNode
  tone?: 'base' | 'soft' | 'dark'
  accent?: string
  className?: string
  /** Skip the horizontal padding + centered max-width container so a variant
   *  can run truly edge-to-edge (filmstrips, marquees). The variant supplies
   *  its own padding. */
  bleed?: boolean
  id?: string
  /** When set, the band is wrapped in the builder's SectionFrame (swap/move/
   *  remove toolbar). No-op on the public page. Lets any Band-based section
   *  become editable by just passing its block id + label. */
  frameId?: string
  frameLabel?: string
  /** Block type + current variant so the swap picker can show layout options. */
  frameType?: string
  frameVariant?: string
}) {
  const bg =
    tone === 'dark'
      ? 'var(--card-ink)'
      : tone === 'soft'
        ? 'var(--card-surface-soft)'
        : 'var(--card-bg)'
  const text = tone === 'dark' ? { color: 'var(--card-bg)' } : undefined
  const inner = (
    <section
      id={id}
      className={`w-full py-16 sm:py-20 ${bleed ? '' : 'px-6 lg:px-10'} ${className}`}
      style={{ background: bg, ...text }}
    >
      {bleed ? children : <div className="mx-auto max-w-5xl">{children}</div>}
    </section>
  )
  if (frameId) {
    return (
      <SectionFrame blockId={frameId} label={frameLabel ?? 'Section'} blockType={frameType} currentVariant={frameVariant}>
        {inner}
      </SectionFrame>
    )
  }
  return inner
}

/** OKO-style marquee divider — an oversized word scrolling between bands, half
 *  outline / half fill. Hidden on mobile (3G budget) and capped in length so a
 *  long title can't blow the layout. `motion-reduce` stops the scroll. */
export function Marquee({ word, accent }: { word: string; accent: string }) {
  const w = (word || 'work').length > 12 ? word.slice(0, 12).trim() : word || 'work'
  return (
    <div className="hidden overflow-hidden border-y border-[var(--card-border)] py-5 sm:block" aria-hidden>
      <div className="flex whitespace-nowrap [animation:card-marquee_28s_linear_infinite] motion-reduce:[animation:none]">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="mx-6 font-sans text-[clamp(36px,7vw,88px)] font-black uppercase tracking-[-0.02em]"
            style={i % 2 ? { WebkitTextStroke: '2px var(--card-ink)', color: 'transparent' } : { color: accent }}
          >
            {w}
          </span>
        ))}
      </div>
    </div>
  )
}

export { mediaUrl }
export type { PublicBlock }
