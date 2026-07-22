'use client'

import { Band, SectionKicker, TYPE_LABEL, type SectionProps } from './shared'

// NARRATIVE — the "About" done right. NOT a bio in a centered box. The data is
// extractive (specifics the user already has), the variant dramatizes it:
//   - split-statement: asymmetric two-column (tiny label/body LEFT, HUGE bold
//     statement RIGHT) — the signature "real website" move across every reference.
//   - stacked-lead: a huge statement on a full-bleed DARK band with scale contrast.
// data: { bold_line, body?, accent_word?, chips?[] }
export function Narrative({ block, accent, index }: SectionProps) {
  const d = block.data as {
    bold_line?: string
    body?: string
    accent_word?: string
    chips?: string[]
  }
  const boldLine = d.bold_line ?? block.intro ?? ''
  const body = d.body ?? ''
  const chips = d.chips ?? []
  const variant = block.variant || 'split-statement'

  // Render the bold statement with the accent_word highlighted.
  const statement = (cls: string) => {
    if (d.accent_word && boldLine.includes(d.accent_word)) {
      const [before, after] = boldLine.split(d.accent_word)
      return (
        <p className={cls}>
          {before}
          <span style={{ color: accent }}>{d.accent_word}</span>
          {after}
        </p>
      )
    }
    return <p className={cls}>{boldLine}</p>
  }

  if (variant === 'stacked-lead') {
    return (
      <Band tone="dark" accent={accent}>
        <SectionKicker index={index} title={block.title} fallback={TYPE_LABEL.narrative} accent={accent} onDark />
        {statement('max-w-3xl font-serif text-[clamp(28px,4.5vw,52px)] font-semibold leading-[1.08] tracking-[-0.02em]')}
        {body && <p className="mt-6 max-w-xl text-[16px] leading-relaxed text-white/70">{body}</p>}
        {chips.length > 0 && (
          <div className="mt-8 flex flex-wrap gap-2">
            {chips.map((c, i) => (
              <span key={i} className="rounded-full border border-white/20 px-3 py-1 text-[13px] text-white/80">{c}</span>
            ))}
          </div>
        )}
      </Band>
    )
  }

  // split-statement (default): asymmetric — small label/body left, big statement right.
  return (
    <Band tone="base" accent={accent}>
      <SectionKicker index={index} title={block.title} fallback={TYPE_LABEL.narrative} accent={accent} />
      <div className="grid gap-8 md:grid-cols-[0.8fr_1.6fr] md:gap-14">
        <div>
          {body && <p className="text-[15px] leading-relaxed text-[var(--card-muted)]">{body}</p>}
          {chips.length > 0 && (
            <div className="mt-5 flex flex-wrap gap-2">
              {chips.map((c, i) => (
                <span key={i} className="rounded-full border border-[var(--card-border)] px-3 py-1 text-[13px] text-[var(--card-muted)]">{c}</span>
              ))}
            </div>
          )}
        </div>
        {statement('font-serif text-[clamp(26px,4vw,44px)] font-semibold leading-[1.1] tracking-[-0.02em] text-[var(--card-ink)]')}
      </div>
    </Band>
  )
}
