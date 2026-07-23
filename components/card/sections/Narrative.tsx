'use client'

import { Band, SectionKicker, TYPE_LABEL, worldType, arText, type SectionProps } from './shared'
import { Editable } from '../edit/Editable'
import { SectionFrame } from '../edit/SectionFrame'
import { useEdit } from '../edit/EditContext'

// NARRATIVE — the "About" done right. NOT a bio in a centered box. The data is
// extractive (specifics the user already has), the variant dramatizes it:
//   - split-statement: asymmetric two-column (tiny label/body LEFT, HUGE bold
//     statement RIGHT) — the signature "real website" move across every reference.
//   - stacked-lead: a huge statement on a full-bleed DARK band with scale contrast.
// The statement's WEIGHT/FAMILY comes from the world (worldType) — so the same
// section reads visibly different per template (the "typography isn't the same"
// fix). data: { bold_line, body?, accent_word?, chips?[], center? }
export function Narrative({ block, accent, index, toneHint, world, isRtl }: SectionProps) {
  const d = block.data as {
    bold_line?: string
    body?: string
    accent_word?: string
    chips?: string[]
    center?: boolean
  }
  const { editing } = useEdit()
  const kickerTitle = arText(isRtl, block.title, block.title_ar)
  const boldLine = d.bold_line ?? (isRtl && block.intro_ar ? block.intro_ar : block.intro) ?? ''
  const body = d.body ?? ''
  const chips = d.chips ?? []
  const variant = block.variant || 'split-statement'
  const wt = worldType(world)

  // Render the bold statement. In edit mode it's plain click-to-edit text; on the
  // public page the accent_word is highlighted.
  const statement = (cls: string) => {
    if (editing) {
      return <Editable as="p" blockId={block.id} field="bold_line" value={boldLine} placeholder="Your bold statement" className={cls} multiline />
    }
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
  const bodyEl = (cls: string) =>
    editing ? (
      <Editable as="p" blockId={block.id} field="body" value={body} placeholder="A supporting line (optional)" className={cls} multiline />
    ) : body ? (
      <p className={cls}>{body}</p>
    ) : null

  if (variant === 'stacked-lead') {
    return (
      <SectionFrame blockId={block.id} label="About" blockType="narrative" currentVariant={variant}>
        <Band tone="dark" accent={accent}>
          <SectionKicker index={index} title={kickerTitle} fallback={TYPE_LABEL.narrative} accent={accent} onDark />
          <div className={d.center ? 'mx-auto max-w-3xl text-center' : 'max-w-3xl'}>
            {statement(`${wt.heading} text-[clamp(30px,5vw,56px)] leading-[1.06]`)}
            {bodyEl(`mt-6 max-w-xl text-[16px] leading-relaxed text-white/70 ${d.center ? 'mx-auto' : ''}`)}
          </div>
          {chips.length > 0 && (
            <div className={`mt-8 flex flex-wrap gap-2 ${d.center ? 'justify-center' : ''}`}>
              {chips.map((c, i) => (
                <span key={i} className="rounded-full border border-white/20 px-3 py-1 text-[13px] text-white/80">{c}</span>
              ))}
            </div>
          )}
        </Band>
      </SectionFrame>
    )
  }

  // split-statement (default): asymmetric — small label/body left, big statement
  // right. Widened scale gap (0.7fr / 1.7fr) makes the statement dominate.
  const tone = block.tone ?? toneHint ?? 'base'
  return (
    <SectionFrame blockId={block.id} label="About">
      <Band tone={tone} accent={accent}>
        <SectionKicker index={index} title={kickerTitle} fallback={TYPE_LABEL.narrative} accent={accent} onDark={tone === 'dark'} />
        <div className="grid gap-8 md:grid-cols-[0.7fr_1.7fr] md:gap-16">
          <div>
            {bodyEl('text-[13px] leading-relaxed text-[var(--card-muted)]')}
            {chips.length > 0 && (
              <div className="mt-5 flex flex-wrap gap-2">
                {chips.map((c, i) => (
                  <span key={i} className="rounded-full border border-[var(--card-border)] px-3 py-1 text-[13px] text-[var(--card-muted)]">{c}</span>
                ))}
              </div>
            )}
          </div>
          {statement(`${wt.heading} text-[clamp(28px,4.5vw,52px)] leading-[1.05]`)}
        </div>
      </Band>
    </SectionFrame>
  )
}
