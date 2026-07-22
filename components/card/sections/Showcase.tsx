'use client'

import { Band, SectionKicker, TYPE_LABEL, mediaUrl, type SectionProps } from './shared'

// SHOWCASE — work presented as CASES, not a photo wall. This is the developer's
// core section (and lawyers, consultants): title + blurb + optional image/tags/link.
//   - case-stack: full-width stacked rows, each a big case (image optional).
//   - card-grid: a 2-3 col grid of case cards.
// data: { items: [{ image?, tags?[], title, blurb, link?, link_label? }] }
export function Showcase({ block, accent, index }: SectionProps) {
  const d = block.data as {
    items?: { image?: string; tags?: string[]; title?: string; blurb?: string; link?: string; link_label?: string }[]
  }
  const items = (d.items ?? []).filter(i => i.title)
  if (!items.length) return null
  const variant = block.variant || 'case-stack'

  if (variant === 'card-grid') {
    return (
      <Band tone="soft" accent={accent}>
        <SectionKicker index={index} title={block.title} fallback={TYPE_LABEL.showcase} accent={accent} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((it, i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-[var(--card-radius-lg)] border border-[var(--card-border)] bg-[var(--card-surface)]">
              {it.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl(it.image) ?? undefined} alt={it.title} loading="lazy" className="aspect-[4/3] w-full object-cover" />
              )}
              <div className="flex flex-1 flex-col p-5">
                {it.tags && it.tags.length > 0 && (
                  <div className="mb-2 flex flex-wrap gap-1.5">
                    {it.tags.map((t, j) => (
                      <span key={j} className="rounded-full bg-[var(--card-bg)] px-2 py-0.5 text-[11px] text-[var(--card-muted)]">{t}</span>
                    ))}
                  </div>
                )}
                <h3 className="text-[17px] font-bold">{it.title}</h3>
                {it.blurb && <p className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-[var(--card-muted)]">{it.blurb}</p>}
                {it.link && (
                  <a href={it.link} target="_blank" rel="noopener noreferrer" className="mt-3 text-[13px] font-bold" style={{ color: accent }}>
                    {it.link_label || 'View'} →
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </Band>
    )
  }

  // case-stack (default): big full-width rows. Text-forward — works with zero images.
  return (
    <Band tone="base" accent={accent}>
      <SectionKicker index={index} title={block.title} fallback={TYPE_LABEL.showcase} accent={accent} />
      <div className="divide-y divide-[var(--card-border)]">
        {items.map((it, i) => (
          <div key={i} className={`grid gap-6 py-8 first:pt-0 ${it.image ? 'md:grid-cols-[1.2fr_1fr] md:items-center' : ''}`}>
            <div>
              {it.tags && it.tags.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-1.5">
                  {it.tags.map((t, j) => (
                    <span key={j} className="rounded-full border border-[var(--card-border)] px-2.5 py-0.5 text-[11px] uppercase tracking-wider text-[var(--card-muted)]">{t}</span>
                  ))}
                </div>
              )}
              <h3 className="font-serif text-[clamp(22px,3vw,32px)] font-semibold leading-tight tracking-[-0.01em]">{it.title}</h3>
              {it.blurb && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-[var(--card-muted)]">{it.blurb}</p>}
              {it.link && (
                <a href={it.link} target="_blank" rel="noopener noreferrer" className="mt-4 inline-block text-[14px] font-bold" style={{ color: accent }}>
                  {it.link_label || 'View project'} →
                </a>
              )}
            </div>
            {it.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={mediaUrl(it.image) ?? undefined} alt={it.title} loading="lazy" className="aspect-[4/3] w-full rounded-[var(--card-radius-lg)] object-cover" />
            )}
          </div>
        ))}
      </div>
    </Band>
  )
}
