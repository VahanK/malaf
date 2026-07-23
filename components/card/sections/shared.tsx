'use client'

import { mediaUrl } from '@/lib/media'
import { SectionFrame } from '../edit/SectionFrame'
import { Editable } from '../edit/Editable'
import { useEdit } from '../edit/EditContext'
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

/** The section header: a small numbered eyebrow ABOVE a big, bold section title.
 *  Previously this was just a 12px uppercase micro-label, which made every
 *  section read identically and small on mobile. Now the title is a real heading
 *  — large (bigger floor on phones) and bold — so sections have presence and
 *  hierarchy, and each one's own title differentiates it. */
export function SectionKicker({
  index,
  title,
  fallback,
  accent,
  onDark = false,
  heading,
  blockId,
  hideNumber,
}: {
  index: number
  title?: string
  fallback: string
  accent: string
  onDark?: boolean
  /** Optional per-world heading class (family/weight/case). */
  heading?: string
  /** When set, the title is inline-editable and the number can be toggled. */
  blockId?: string
  /** Hide the numbered eyebrow (per-section preference). */
  hideNumber?: boolean
}) {
  const label = (title && title.trim()) || fallback
  return (
    <div className="mb-10">
      {!hideNumber && (
        <div className="mb-3 flex items-center gap-3">
          <span className="font-mono text-[13px] font-bold tabular-nums" style={{ color: accent }}>
            {String(index).padStart(2, '0')}
          </span>
          <span className="h-px w-8" style={{ background: accent }} />
          <span className={`text-[11px] font-bold uppercase tracking-[0.24em] ${onDark ? 'text-white/50' : 'text-[var(--card-muted)]'}`}>
            {fallback}
          </span>
          {blockId && <SectionKickerControls blockId={blockId} hideNumber={false} />}
        </div>
      )}
      {hideNumber && blockId && (
        <div className="mb-3"><SectionKickerControls blockId={blockId} hideNumber={true} /></div>
      )}
      {blockId ? (
        <Editable
          as="h2"
          blockId={blockId}
          field="title"
          value={title ?? ''}
          placeholder={fallback}
          className={`${heading ?? 'font-sans font-black tracking-[-0.03em]'} leading-[0.98]`}
          style={{ fontSize: 'clamp(30px,7vw,54px)' }}
        />
      ) : (
        <h2 className={`${heading ?? 'font-sans font-black tracking-[-0.03em]'} leading-[0.98]`} style={{ fontSize: 'clamp(30px,7vw,54px)' }}>
          {label}
        </h2>
      )}
    </div>
  )
}

// Edit-mode-only control to hide/show the section number. Renders nothing on the
// public page (useEdit().editing is false there).
function SectionKickerControls({ blockId, hideNumber }: { blockId: string; hideNumber: boolean }) {
  const { editing, onBlockData } = useEdit()
  if (!editing) return null
  return (
    <button
      onClick={() => onBlockData(blockId, { hide_number: !hideNumber })}
      className="ww-toolbar rounded-full bg-black/60 px-2 py-0.5 text-[10px] font-bold text-white opacity-0 transition group-hover/edit:opacity-100"
    >
      {hideNumber ? '＋ number' : '✕ number'}
    </button>
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
    <div className="hidden overflow-hidden border-y border-[var(--card-border)] py-8 sm:block" aria-hidden>
      <div className="flex items-center whitespace-nowrap leading-none [animation:card-marquee_28s_linear_infinite] motion-reduce:[animation:none]">
        {Array.from({ length: 8 }).map((_, i) => (
          <span
            key={i}
            className="mx-6 font-sans text-[clamp(36px,7vw,80px)] font-black uppercase leading-none tracking-[-0.02em]"
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
