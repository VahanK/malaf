'use client'

import { Hero } from '../sections/Hero'
import { Contact } from '../sections/Contact'
import { Narrative } from '../sections/Narrative'
import { Showcase } from '../sections/Showcase'
import { Gallery } from '../sections/Gallery'
import { Band, SectionKicker, TYPE_LABEL, Marquee, arText, type World } from '../sections/shared'
import { SectionFrame } from '../edit/SectionFrame'
import { BeforeAfter } from '../blocks'
import { mediaUrl } from './shared'
import type { LayoutProps } from './types'
import type { PublicBlock } from '@/lib/public-page'

type Tone = 'base' | 'soft' | 'dark'

// COMPOSABLE — renders a page as an ordered stack of typed SECTIONS (Hero →
// sections → Contact), each a full-bleed band. This is the "real website"
// renderer that replaces the fixed-skeleton layouts (behind profiles.composable).
//
// New section types (narrative/showcase/gallery) render via their own
// components. Legacy per-item blocks (stat_card/testimonial/before_after) are
// GROUPED here — consecutive runs collapse into one band — so no data migration
// was needed.
export function ComposableLayout({ page, accent, vars, tpl }: LayoutProps) {
  const p = page.profile
  const world = (tpl.world ?? 'editorial-dark') as World
  const heroVariant = p.hero_variant || 'photo-bleed'
  // Arabic pages render right-to-left with the Arabic display font. The dir/lang
  // live on this subtree's <main> (app/layout.tsx's <html> stays LTR) — the same
  // scoping the zero-login document pages use. title_ar/intro_ar fall back per
  // block; a plain helper resolves the right one.
  const isRtl = p.page_language === 'ar'
  const arText = (en?: string, ar?: string) => (isRtl && ar ? ar : en) ?? ''

  // Group the block list: consecutive legacy same-type blocks fold into one
  // section; new section types stand alone. Preserves page order.
  const groups = groupBlocks(page.blocks)

  // Stateful tone cadence (the Ivory move). A blind idx%4 cycle collides because
  // several variants force a fixed tone; instead we track the LAST band's actual
  // tone and hand each flexible section the next cadence tone that DIFFERS — so
  // no two touching bands ever share a background. Sections that force their own
  // tone report it back via fixTone() to keep the chain honest.
  const CADENCE: Tone[] = ['base', 'soft', 'base', 'dark']
  let cadencePtr = 0
  let lastTone: Tone = 'base'
  const nextTone = (): Tone => {
    for (let k = 0; k < CADENCE.length; k++) {
      const t = CADENCE[(cadencePtr + k) % CADENCE.length]
      if (t !== lastTone) {
        cadencePtr = (cadencePtr + k + 1) % CADENCE.length
        lastTone = t
        return t
      }
    }
    return lastTone
  }
  const fixTone = (t: Tone): Tone => {
    lastTone = t
    return t
  }

  let idx = 0
  const nodes: React.ReactNode[] = []
  groups.forEach((g, gi) => {
    let node: React.ReactNode = null
    if (g.kind === 'stats') {
      node = <StatsBand key={gi} blocks={g.blocks} accent={accent} index={++idx} tone={fixTone('soft')} world={world} isRtl={isRtl} />
    } else if (g.kind === 'testimonials') {
      node = <TestimonialsBand key={gi} blocks={g.blocks} accent={accent} index={++idx} tone={nextTone()} isRtl={isRtl} />
    } else if (g.kind === 'comparison') {
      node = <ComparisonBand key={gi} blocks={g.blocks} accent={accent} index={++idx} tone={fixTone('soft')} isRtl={isRtl} />
    } else {
      const b = g.blocks[0]
      idx++
      const toneHint = nextTone()
      if (b.type === 'narrative') node = <Narrative key={gi} block={b} page={page} accent={accent} index={idx} toneHint={toneHint} world={world} isRtl={isRtl} />
      else if (b.type === 'showcase') node = <Showcase key={gi} block={b} page={page} accent={accent} index={idx} toneHint={toneHint} world={world} isRtl={isRtl} />
      else if (b.type === 'gallery' || b.type === 'image_grid') node = <Gallery key={gi} block={normalizeImageGrid(b)} page={page} accent={accent} index={idx} toneHint={toneHint} world={world} isRtl={isRtl} />
    }
    if (!node) return
    nodes.push(node)
    // OKO signature: an oversized scrolling word between bands — brutalist only,
    // never after the final band.
    if (world === 'brutalist' && gi < groups.length - 1) {
      nodes.push(<Marquee key={`mq-${gi}`} word={arText(g.blocks[0].title, g.blocks[0].title_ar) || TYPE_LABEL[g.blocks[0].type] || 'work'} accent={accent} />)
    }
  })

  return (
    <main
      dir={isRtl ? 'rtl' : 'ltr'}
      lang={isRtl ? 'ar' : 'en'}
      className={`text-[var(--card-ink)] ${isRtl ? 'font-[family-name:var(--font-tajawal)]' : ''}`}
      style={{ ...vars, background: 'var(--card-bg)' }}
    >
      <Hero page={page} accent={accent} variant={heroVariant} world={world} isRtl={isRtl} />
      {nodes}
      <SectionFrame blockId="contact" label="Footer" fixed="contact">
        <Contact page={page} accent={accent} world={world} isRtl={isRtl} />
      </SectionFrame>
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
function StatsBand({ blocks, accent, index, tone, world, isRtl }: { blocks: PublicBlock[]; accent: string; index: number; tone: Tone; world: World; isRtl?: boolean }) {
  const items = blocks.map(b => ({ value: (b.data.value as string) ?? '', label: (b.data.label as string) ?? '' })).filter(s => s.value)
  if (!items.length) return null
  const onDark = tone === 'dark'
  // Oversized numbers with hairline dividers (OKO/Anthony) — the scale contrast
  // is the whole design; a small stat row reads like a dashboard, not a page.
  return (
    <Band tone={tone} accent={accent} frameId={blocks[0].id} frameLabel="Numbers">
      <SectionKicker index={index} title={arText(isRtl, blocks[0].title, blocks[0].title_ar)} fallback={TYPE_LABEL.stat_card} accent={accent} onDark={onDark} />
      <div className="grid grid-cols-2 divide-x divide-[var(--card-border)] sm:grid-cols-3">
        {items.slice(0, 3).map((s, i) => (
          <div key={i} className="px-6 first:pl-0">
            <div className="font-serif text-[clamp(44px,8vw,84px)] font-black leading-none" style={{ color: accent }}>{s.value}</div>
            <div className={`mt-2 text-[13px] ${onDark ? 'text-white/60' : 'text-[var(--card-muted)]'}`}>{s.label}</div>
          </div>
        ))}
      </div>
    </Band>
  )
}

function TestimonialsBand({ blocks, accent, index, tone, isRtl }: { blocks: PublicBlock[]; accent: string; index: number; tone: Tone; isRtl?: boolean }) {
  const quotes = blocks.map(b => ({ text: (b.data.text as string) ?? '', attribution: (b.data.attribution as string) ?? '', date_label: (b.data.date_label as string) ?? '' })).filter(q => q.text)
  if (!quotes.length) return null
  const onDark = tone === 'dark'
  return (
    <Band tone={tone} accent={accent} frameId={blocks[0].id} frameLabel="Testimonials">
      <SectionKicker index={index} title={arText(isRtl, blocks[0].title, blocks[0].title_ar)} fallback={TYPE_LABEL.testimonial} accent={accent} onDark={onDark} />
      <div className="grid gap-5 sm:grid-cols-2">
        {quotes.map((q, i) => (
          <div key={i} className={`rounded-[var(--card-radius-lg)] border p-6 ${onDark ? 'border-white/15 bg-white/5' : 'border-[var(--card-border)] bg-[var(--card-surface)]'}`}>
            <p className="text-[16px] leading-relaxed">“{q.text}”</p>
            <p className={`mt-3 text-[12px] font-semibold ${onDark ? 'text-white/50' : 'text-[var(--card-muted)]'}`}>{q.attribution}{q.date_label ? ` · ${q.date_label}` : ''}</p>
          </div>
        ))}
      </div>
    </Band>
  )
}

function ComparisonBand({ blocks, accent, index, tone, isRtl }: { blocks: PublicBlock[]; accent: string; index: number; tone: Tone; isRtl?: boolean }) {
  return (
    <Band tone={tone} accent={accent} frameId={blocks[0].id} frameLabel="Before / after">
      <SectionKicker index={index} title={arText(isRtl, blocks[0].title, blocks[0].title_ar)} fallback={TYPE_LABEL.before_after} accent={accent} onDark={tone === 'dark'} />
      <div className="space-y-6">
        {blocks.map(b => (
          <BeforeAfter key={b.id} data={b.data} accent={accent} radiusClass="rounded-[var(--card-radius-lg)]" />
        ))}
      </div>
    </Band>
  )
}

export { mediaUrl }
