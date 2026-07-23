'use client'

import { AiFillGithub, AiOutlineExport } from 'react-icons/ai'
import { Reveal } from '../Reveal'
import { Band, SectionKicker, TYPE_LABEL, mediaUrl, worldType, arText, type SectionProps } from './shared'
import { useEdit } from '../edit/EditContext'
import { CardImage } from '../CardImage'
import { EditImage } from '../edit/EditImage'

// SHOWCASE — work presented as CASES, not a photo wall. The developer's core
// section (also lawyers, consultants). An item is:
//   { image?, tags?[], title, blurb?, link?, link_label?,
//     repo_url?, live_url?, tech?[], size? }
// Variants:
//   - case-stack:    full-width stacked rows (image optional) — text-forward
//   - card-grid:     2–3 col case cards, with dev repo/live/tech affordances
//   - numbered-list: big serif numbered credibility rows (no images) — Anthony/OKO
//   - bento:         a mosaic of varied-span panels — the "dev with no photos" answer
//   - logo-strip:    a row of client/brand logos (reuses items[].image)
export function Showcase({ block, accent, index, toneHint, world, isRtl }: SectionProps) {
  const d = block.data as {
    items?: {
      image?: string
      tags?: string[]
      title?: string
      blurb?: string
      link?: string
      link_label?: string
      repo_url?: string
      live_url?: string
      tech?: string[]
      size?: 'sm' | 'wide' | 'tall' | 'big'
    }[]
  }
  const { editing, onBlockData } = useEdit()
  const kickerTitle = arText(isRtl, block.title, block.title_ar)
  const allItems = d.items ?? []
  const items = (d.items ?? []).filter(i => i.title || i.image)
  // Set item i's image, writing the whole items array back to the block.
  const setItemImage = (i: number, path: string) => {
    const next = allItems.map((it, j) => (j === i ? { ...it, image: path } : it))
    onBlockData(block.id, { items: next })
  }
  // Public page hides an empty section; the builder shows a placeholder so it
  // stays swappable/removable and prompts the user to add content.
  if (!items.length && !editing) return null
  const variant = block.variant || 'case-stack'
  const tone = block.tone ?? toneHint ?? 'base'
  const onDark = tone === 'dark'
  const wt = worldType(world)

  // Small reusable dev-links row (github + live) — the "projects/github/links" ask.
  const devLinks = (it: (typeof items)[number]) =>
    (it.repo_url || it.live_url) && (
      <div className="flex items-center gap-3">
        {it.repo_url && (
          <a href={it.repo_url} target="_blank" rel="noopener noreferrer" aria-label="Source code" className="text-[20px] opacity-60 transition hover:opacity-100" style={{ color: 'currentColor' }}>
            <AiFillGithub />
          </a>
        )}
        {it.live_url && (
          <a href={it.live_url} target="_blank" rel="noopener noreferrer" aria-label="Live site" className="text-[20px] opacity-60 transition hover:opacity-100" style={{ color: 'currentColor' }}>
            <AiOutlineExport />
          </a>
        )}
      </div>
    )
  const techChips = (it: (typeof items)[number]) =>
    it.tech && it.tech.length > 0 && (
      <p className="mt-2 text-[13px] font-medium" style={{ color: accent }}>{it.tech.join(' · ')}</p>
    )

  // ── numbered-list: big serif numbered rows, no images ──
  if (variant === 'numbered-list') {
    const brutal = world === 'brutalist'
    return (
      <Band tone={tone} accent={accent} frameId={block.id} frameLabel="Work" frameType="showcase" frameVariant={variant}>
        <SectionKicker index={index} title={kickerTitle} fallback={TYPE_LABEL.showcase} accent={accent} onDark={onDark} />
        <div className="divide-y divide-[var(--card-border)]">
          {items.map((it, i) => (
            <Reveal key={i}>
              <div className={`group grid grid-cols-[auto_1fr_auto] items-baseline gap-5 py-7 transition-colors sm:gap-8 ${brutal ? 'hover:bg-[var(--card-ink)] hover:text-[var(--card-bg)]' : ''}`}>
                <span className="font-serif text-[clamp(20px,3vw,34px)] tabular-nums" style={{ color: accent }}>{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-serif text-[clamp(22px,3.4vw,38px)] font-medium leading-tight tracking-[-0.01em]">{it.title}</h3>
                  {it.blurb && <p className="mt-2 max-w-md text-[14px] leading-relaxed text-[var(--card-muted)] group-hover:text-current">{it.blurb}</p>}
                  {techChips(it)}
                </div>
                <div className="flex items-center gap-4">
                  {devLinks(it)}
                  {it.link && !it.repo_url && !it.live_url && (
                    <a href={it.link} target="_blank" rel="noopener noreferrer" className="text-[20px] opacity-40 transition group-hover:translate-x-1 group-hover:opacity-100" style={{ color: accent }}>↗</a>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </Band>
    )
  }

  // ── bento: varied-span mosaic (the dev-without-photos answer) ──
  if (variant === 'bento') {
    const SPAN: Record<string, string> = {
      sm: 'col-span-1 row-span-1',
      wide: 'col-span-2 row-span-1',
      tall: 'col-span-1 row-span-2',
      big: 'col-span-2 row-span-2',
    }
    return (
      <Band tone={tone} accent={accent} frameId={block.id} frameLabel="Work" frameType="showcase" frameVariant={variant}>
        <SectionKicker index={index} title={kickerTitle} fallback="What sets me apart" accent={accent} onDark={onDark} />
        <div className="grid auto-rows-[minmax(140px,auto)] grid-cols-2 gap-4 md:grid-cols-4">
          {items.map((it, i) => (
            <Reveal key={i} className={`${SPAN[it.size ?? 'sm']} flex flex-col rounded-[var(--card-radius-lg)] border border-[var(--card-border)] bg-[var(--card-surface)] p-5`}>
              {it.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl(it.image) ?? undefined} alt="" className="mb-3 h-8 w-auto" />
              )}
              <h3 className="text-[15px] font-bold">{it.title}</h3>
              {it.blurb && <p className="mt-1 text-[13px] leading-relaxed text-[var(--card-muted)]">{it.blurb}</p>}
              {techChips(it)}
              <div className="mt-auto flex items-center gap-3 pt-3">
                {devLinks(it)}
                {it.link && !it.repo_url && !it.live_url && (
                  <a href={it.link} target="_blank" rel="noopener noreferrer" className="text-[13px] font-bold" style={{ color: accent }}>{it.link_label || 'Open'} →</a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Band>
    )
  }

  // ── logo-strip: brand/client logos ──
  if (variant === 'logo-strip') {
    return (
      <Band tone={tone} accent={accent} frameId={block.id} frameLabel="Work" frameType="showcase" frameVariant={variant}>
        <SectionKicker index={index} title={kickerTitle} fallback="Brands I've worked with" accent={accent} onDark={onDark} />
        <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-6 py-2">
          {items.map((it, i) => it.image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img key={i} src={mediaUrl(it.image) ?? undefined} alt={it.title || ''}
              className={`h-7 w-auto object-contain transition sm:h-9 ${onDark ? 'opacity-80 brightness-0 invert hover:opacity-100' : 'opacity-60 grayscale hover:grayscale-0 hover:opacity-100'}`} />
          ))}
        </div>
      </Band>
    )
  }

  // ── card-grid: case cards with dev affordances + hover tilt ──
  if (variant === 'card-grid') {
    return (
      <Band tone={tone} accent={accent} frameId={block.id} frameLabel="Work" frameType="showcase" frameVariant={variant}>
        <SectionKicker index={index} title={kickerTitle} fallback={TYPE_LABEL.showcase} accent={accent} onDark={onDark} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <Reveal key={i} className="group flex flex-col overflow-hidden rounded-[var(--card-radius-lg)] border border-[var(--card-border)] bg-[var(--card-surface)] transition-transform duration-300 hover:-translate-y-1">
              {editing ? (
                <EditImage src={it.image} onChange={p => setItemImage(allItems.indexOf(it), p)} alt={it.title} accent={accent} aspect="aspect-[4/3]" rounded="rounded-none" />
              ) : (
                <CardImage src={it.image} alt={it.title} accent={accent} aspect="aspect-[4/3]" rounded="rounded-none" className="[&>img]:transition-transform [&>img]:duration-500 group-hover:[&>img]:scale-105" />
              )}
              <div className="flex flex-1 flex-col p-5">
                {it.tags && it.tags.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {it.tags.map((t, j) => (
                      <span key={j} className="rounded-full bg-[var(--card-bg)] px-2 py-0.5 text-[11px] text-[var(--card-muted)]">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-start justify-between gap-2">
                  <h3 className="text-[17px] font-bold">{it.title}</h3>
                  {devLinks(it)}
                </div>
                {it.blurb && <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-[var(--card-muted)]">{it.blurb}</p>}
                {techChips(it)}
                {it.link && !it.repo_url && !it.live_url && (
                  <a href={it.link} target="_blank" rel="noopener noreferrer" className="mt-3 text-[13px] font-bold" style={{ color: accent }}>
                    {it.link_label || 'View'} →
                  </a>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </Band>
    )
  }

  // ── case-stack (default): big full-width rows, works with zero images ──
  return (
    <Band tone={tone} accent={accent} frameId={block.id} frameLabel="Work" frameType="showcase" frameVariant={variant}>
      <SectionKicker index={index} title={kickerTitle} fallback={TYPE_LABEL.showcase} accent={accent} onDark={onDark} />
      <div className="divide-y divide-[var(--card-border)]">
        {items.map((it, i) => (
          <Reveal key={i}>
            <div className={`grid gap-6 py-8 first:pt-0 ${it.image ? 'md:grid-cols-[1.2fr_1fr] md:items-center' : ''}`}>
              <div>
                {it.tags && it.tags.length > 0 && (
                  <div className="mb-3 flex flex-wrap gap-1.5">
                    {it.tags.map((t, j) => (
                      <span key={j} className="rounded-full border border-[var(--card-border)] px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-[var(--card-muted)]">{t}</span>
                    ))}
                  </div>
                )}
                <div className="flex items-start justify-between gap-3">
                  <h3 className={`${wt.heading} text-[clamp(22px,3vw,32px)] leading-tight`}>{it.title}</h3>
                  {devLinks(it)}
                </div>
                {it.blurb && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--card-muted)]">{it.blurb}</p>}
                {techChips(it)}
                {it.link && !it.repo_url && !it.live_url && (
                  <a href={it.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-[14px] font-bold" style={{ color: accent }}>
                    {it.link_label || 'View project'} →
                  </a>
                )}
              </div>
              {editing ? (
                <EditImage src={it.image} onChange={p => setItemImage(allItems.indexOf(it), p)} alt={it.title} accent={accent} aspect="aspect-[4/3]" rounded="rounded-[var(--card-radius-lg)]" />
              ) : (
                it.image && <CardImage src={it.image} alt={it.title} accent={accent} aspect="aspect-[4/3]" rounded="rounded-[var(--card-radius-lg)]" />
              )}
            </div>
          </Reveal>
        ))}
      </div>
    </Band>
  )
}
