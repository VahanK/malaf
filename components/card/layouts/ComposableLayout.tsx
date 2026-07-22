'use client'

import { Hero } from '../sections/Hero'
import { Contact } from '../sections/Contact'
import { Narrative } from '../sections/Narrative'
import { Showcase } from '../sections/Showcase'
import { Gallery } from '../sections/Gallery'
import { Band, SectionKicker, TYPE_LABEL } from '../sections/shared'
import { BeforeAfter } from '../blocks'
import { mediaUrl } from './shared'
import type { LayoutProps } from './types'
import type { PublicBlock } from '@/lib/public-page'

// COMPOSABLE — renders a page as an ordered stack of typed SECTIONS (Hero →
// sections → Contact), each a full-bleed band. This is the "real website"
// renderer that replaces the fixed-skeleton layouts (behind profiles.composable).
//
// New section types (narrative/showcase/gallery) render via their own
// components. Legacy per-item blocks (stat_card/testimonial/before_after) are
// GROUPED here — consecutive runs collapse into one band — so no data migration
// was needed.
export function ComposableLayout({ page, accent, vars }: LayoutProps) {
  const p = page.profile
  const heroVariant = p.hero_variant || 'photo-bleed'

  // Group the block list: consecutive legacy same-type blocks fold into one
  // section; new section types stand alone. Preserves page order.
  const groups = groupBlocks(page.blocks)

  let idx = 0
  return (
    <main className="text-[var(--card-ink)]" style={{ ...vars, background: 'var(--card-bg)' }}>
      <Hero page={page} accent={accent} variant={heroVariant} />

      {groups.map((g, gi) => {
        // stats / testimonials / comparison render grouped; the rest advance the
        // numbered kicker index.
        if (g.kind === 'stats') {
          return <StatsBand key={gi} blocks={g.blocks} accent={accent} index={++idx} />
        }
        if (g.kind === 'testimonials') {
          return <TestimonialsBand key={gi} blocks={g.blocks} accent={accent} index={++idx} />
        }
        if (g.kind === 'comparison') {
          return <ComparisonBand key={gi} blocks={g.blocks} accent={accent} index={++idx} />
        }
        // single new-type section
        const b = g.blocks[0]
        idx++
        if (b.type === 'narrative') return <Narrative key={gi} block={b} page={page} accent={accent} index={idx} />
        if (b.type === 'showcase') return <Showcase key={gi} block={b} page={page} accent={accent} index={idx} />
        if (b.type === 'gallery' || b.type === 'image_grid') {
          // image_grid legacy blocks render through Gallery too.
          return <Gallery key={gi} block={normalizeImageGrid(b)} page={page} accent={accent} index={idx} />
        }
        return null
      })}

      <Contact page={page} accent={accent} />
    </main>
  )
}

// ---- grouping ----
type Group = { kind: 'stats' | 'testimonials' | 'comparison' | 'section'; blocks: PublicBlock[] }

function groupBlocks(blocks: PublicBlock[]): Group[] {
  const kindOf = (t: string): Group['kind'] =>
    t === 'stat_card' ? 'stats' : t === 'testimonial' ? 'testimonials' : t === 'before_after' ? 'comparison' : 'section'
  const out: Group[] = []
  for (const b of blocks) {
    if (b.type === 'video_link' || b.type === 'case_card') continue // not rendered as standalone sections in P1
    const kind = kindOf(b.type)
    const last = out[out.length - 1]
    if (last && last.kind === kind && kind !== 'section') last.blocks.push(b)
    else out.push({ kind, blocks: [b] })
  }
  return out
}

function normalizeImageGrid(b: PublicBlock): PublicBlock {
  if (b.type !== 'image_grid') return b
  return { ...b, type: 'gallery', variant: b.variant || 'masonry' }
}

// ---- grouped legacy bands ----
function StatsBand({ blocks, accent, index }: { blocks: PublicBlock[]; accent: string; index: number }) {
  const items = blocks.map(b => ({ value: (b.data.value as string) ?? '', label: (b.data.label as string) ?? '' })).filter(s => s.value)
  if (!items.length) return null
  return (
    <Band tone="soft" accent={accent}>
      <SectionKicker index={index} title={blocks[0].title} fallback={TYPE_LABEL.stat_card} accent={accent} />
      <div className="grid grid-cols-2 gap-8 sm:grid-cols-3">
        {items.slice(0, 3).map((s, i) => (
          <div key={i}>
            <div className="font-serif text-[clamp(36px,5vw,56px)] font-black leading-none" style={{ color: accent }}>{s.value}</div>
            <div className="mt-2 text-[13px] text-[var(--card-muted)]">{s.label}</div>
          </div>
        ))}
      </div>
    </Band>
  )
}

function TestimonialsBand({ blocks, accent, index }: { blocks: PublicBlock[]; accent: string; index: number }) {
  const quotes = blocks.map(b => ({ text: (b.data.text as string) ?? '', attribution: (b.data.attribution as string) ?? '', date_label: (b.data.date_label as string) ?? '' })).filter(q => q.text)
  if (!quotes.length) return null
  return (
    <Band tone="base" accent={accent}>
      <SectionKicker index={index} title={blocks[0].title} fallback={TYPE_LABEL.testimonial} accent={accent} />
      <div className="grid gap-5 sm:grid-cols-2">
        {quotes.map((q, i) => (
          <div key={i} className="rounded-[var(--card-radius-lg)] border border-[var(--card-border)] bg-[var(--card-surface)] p-6">
            <p className="text-[16px] leading-relaxed">“{q.text}”</p>
            <p className="mt-3 text-[12px] font-semibold text-[var(--card-muted)]">{q.attribution}{q.date_label ? ` · ${q.date_label}` : ''}</p>
          </div>
        ))}
      </div>
    </Band>
  )
}

function ComparisonBand({ blocks, accent, index }: { blocks: PublicBlock[]; accent: string; index: number }) {
  return (
    <Band tone="soft" accent={accent}>
      <SectionKicker index={index} title={blocks[0].title} fallback={TYPE_LABEL.before_after} accent={accent} />
      <div className="space-y-6">
        {blocks.map(b => (
          <BeforeAfter key={b.id} data={b.data} accent={accent} radiusClass="rounded-[var(--card-radius-lg)]" />
        ))}
      </div>
    </Band>
  )
}

export { mediaUrl }
