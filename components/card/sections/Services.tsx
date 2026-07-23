'use client'

import { Band, SectionKicker, arText, type SectionProps } from './shared'
import { Reveal } from '../Reveal'
import { Editable } from '../edit/Editable'
import { formatPrice, unitLabel } from '@/lib/pricing-format'

// SERVICES / PRICING — shows the freelancer's price list on the page. The prices
// and service data are edited in /dashboard/services (single source of truth) and
// are READ-ONLY here — the builder only lets you add an optional intro/description
// and the layout, never change a price. Founder: "services data should not be
// changeable [in the builder], only add a description optional."
//
// Variants:
//   - list   (default): stacked rows, big price on the right
//   - cards:            a 2–3 col grid of price cards
//   - menu:             a restaurant-menu look with dotted leaders
export function Services({ block, page, accent, index, toneHint, isRtl }: SectionProps) {
  const services = page.services ?? []
  if (!services.length) return null // nothing to price yet → nothing shown
  const variant = block.variant || 'list'
  const tone = block.tone ?? toneHint ?? 'base'
  const onDark = tone === 'dark'
  const kickerTitle = arText(isRtl, block.title, block.title_ar) || 'Services & Pricing'

  const lang: 'en' | 'ar' = isRtl ? 'ar' : 'en'
  const priceOf = (s: (typeof services)[number]) => {
    if (s.price == null) return isRtl ? 'حسب الطلب' : 'On request'
    return formatPrice({ price: s.price, currency: s.currency, starting_from: s.starting_from })
  }
  const unitOf = (s: (typeof services)[number]) =>
    s.price == null ? '' : `/ ${unitLabel(s.unit, lang)}`
  const titleOf = (s: (typeof services)[number]) => (isRtl && s.title_ar ? s.title_ar : s.title)

  // Optional page-side description (inline-editable; does NOT touch service data).
  const Intro = (
    <Editable
      as="p"
      blockId={block.id}
      field="intro"
      value={(block.data as { intro?: string }).intro ?? ''}
      placeholder="A line about your pricing (optional)"
      multiline
      className={`mb-8 max-w-xl text-[15px] leading-relaxed ${onDark ? 'text-white/70' : 'text-[var(--card-muted)]'}`}
    />
  )

  if (variant === 'cards') {
    return (
      <Band tone={tone} accent={accent} frameId={block.id} frameLabel="Pricing" frameType="services" frameVariant={variant}>
        <SectionKicker index={index} title={kickerTitle} fallback="Services & Pricing" accent={accent} onDark={onDark} blockId={block.id} hideNumber={Boolean((block.data as { hide_number?: boolean }).hide_number)} />
        {Intro}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {services.map((s, i) => (
            <Reveal key={i} className="flex flex-col rounded-[var(--card-radius-lg)] border border-[var(--card-border)] bg-[var(--card-surface)] p-6">
              <h3 className="text-[17px] font-bold">{titleOf(s)}</h3>
              {s.note && <p className="mt-1 flex-1 text-[13.5px] leading-relaxed text-[var(--card-muted)]">{s.note}</p>}
              <p className="mt-4 text-[24px] font-black" style={{ color: accent }}>
                {priceOf(s)} <span className="text-[13px] font-medium text-[var(--card-muted)]">{unitOf(s)}</span>
              </p>
            </Reveal>
          ))}
        </div>
      </Band>
    )
  }

  if (variant === 'menu') {
    return (
      <Band tone={tone} accent={accent} frameId={block.id} frameLabel="Pricing" frameType="services" frameVariant={variant}>
        <SectionKicker index={index} title={kickerTitle} fallback="Services & Pricing" accent={accent} onDark={onDark} blockId={block.id} hideNumber={Boolean((block.data as { hide_number?: boolean }).hide_number)} />
        {Intro}
        <div className="space-y-5">
          {services.map((s, i) => (
            <Reveal key={i} className="flex items-baseline gap-3">
              <span className="text-[17px] font-bold">{titleOf(s)}</span>
              <span className="h-px flex-1 self-center border-b border-dotted border-[var(--card-border)]" />
              <span className="whitespace-nowrap text-[16px] font-black" style={{ color: accent }}>
                {priceOf(s)} <span className="text-[12px] font-medium text-[var(--card-muted)]">{unitOf(s)}</span>
              </span>
            </Reveal>
          ))}
        </div>
      </Band>
    )
  }

  // list (default)
  return (
    <Band tone={tone} accent={accent} frameId={block.id} frameLabel="Pricing" frameType="services" frameVariant={variant}>
      <SectionKicker index={index} title={kickerTitle} fallback="Services & Pricing" accent={accent} onDark={onDark} blockId={block.id} hideNumber={Boolean((block.data as { hide_number?: boolean }).hide_number)} />
      {Intro}
      <div className="divide-y divide-[var(--card-border)]">
        {services.map((s, i) => (
          <Reveal key={i} className="flex items-center justify-between gap-6 py-5 first:pt-0">
            <div>
              <h3 className="text-[18px] font-bold">{titleOf(s)}</h3>
              {s.note && <p className="mt-1 max-w-md text-[13.5px] leading-relaxed text-[var(--card-muted)]">{s.note}</p>}
            </div>
            <p className="shrink-0 text-right text-[20px] font-black" style={{ color: accent }}>
              {priceOf(s)}
              <span className="block text-[12px] font-medium text-[var(--card-muted)]">{unitOf(s)}</span>
            </p>
          </Reveal>
        ))}
      </div>
    </Band>
  )
}
