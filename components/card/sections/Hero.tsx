'use client'

import { VoicePlayer } from '../VoicePlayer'
import { heroImage, mediaUrl } from '../layouts/shared'
import { normalizeAccent } from '@/lib/card-templates'
import type { PublicPage } from '@/lib/public-page'

// HERO (fixed bone). Two variants:
//   - photo-bleed: full-bleed hero photo, name overlaid huge (visual trades).
//   - statement: no photo needed — huge name + statement on the wash, an
//     aurora behind it (developers/lawyers/text-forward).
export function Hero({ page, accent, variant }: { page: PublicPage; accent: string; variant: string }) {
  const p = page.profile
  const hero = heroImage(page)
  const wa = p.whatsapp_number ? `https://wa.me/${p.whatsapp_number.replace(/[^\d]/g, '')}` : null
  const a6 = normalizeAccent(accent)
  const useStatement = variant === 'statement' || !hero.url

  const availabilityPill = p.availability_status !== 'away' && (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium ${useStatement ? 'border border-[var(--card-border)] bg-[var(--card-surface)]' : 'border border-white/25 bg-black/30 text-white backdrop-blur'}`}>
      <span className="h-2 w-2 rounded-full" style={{ background: p.availability_status === 'busy' ? '#eda100' : '#3ddc84' }} />
      {p.availability_note || (p.availability_status === 'busy' ? 'Booked — join the waitlist' : 'Available for work')}
    </span>
  )

  const ctas = (onDark: boolean) => (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      <a href="#contact" className="rounded-full px-6 py-3 text-[14px] font-black" style={{ background: a6, color: 'var(--card-accent-ink)' }}>
        Request a quote
      </a>
      {wa && (
        <a href={wa} target="_blank" rel="noopener noreferrer" className={`rounded-full px-6 py-3 text-[14px] font-bold ${onDark ? 'border border-white/30 text-white backdrop-blur' : 'border border-[var(--card-border)]'}`}>
          💬 WhatsApp
        </a>
      )}
    </div>
  )

  if (useStatement) {
    return (
      <section
        className="relative w-full overflow-hidden px-6 py-24 lg:px-10 lg:py-32"
        style={{ background: `radial-gradient(80% 60% at 15% -10%, ${a6}22, transparent 55%), radial-gradient(70% 50% at 95% 10%, ${a6}14, transparent 50%), var(--card-bg)` }}
      >
        <div className="mx-auto max-w-5xl">
          {availabilityPill}
          <h1 className="mt-6 max-w-4xl font-serif text-[clamp(44px,9vw,104px)] font-semibold leading-[0.95] tracking-[-0.03em]">
            {p.full_name}
          </h1>
          <p className="mt-4 text-[clamp(16px,2vw,22px)] font-bold" style={{ color: a6 }}>{p.title}</p>
          {p.bio && <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-[var(--card-muted)]">{p.bio}</p>}
          {ctas(false)}
          {p.voice_intro_url && (
            <div className="mt-8 max-w-sm">
              <VoicePlayer src={mediaUrl(p.voice_intro_url)} label="Hear from me" accent={a6} radiusClass="rounded-[var(--card-radius-lg)]" />
            </div>
          )}
        </div>
      </section>
    )
  }

  // photo-bleed
  return (
    <section className="relative flex min-h-[88vh] w-full items-end overflow-hidden">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={hero.url ?? undefined} alt={hero.alt} className="absolute inset-0 h-full w-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
      <div className="relative mx-auto w-full max-w-5xl px-6 pb-14 lg:px-10 lg:pb-20">
        {availabilityPill}
        <h1 className="mt-5 max-w-4xl text-[13vw] font-black leading-[0.9] tracking-[-0.03em] text-white sm:text-[64px] lg:text-[92px]">
          {p.full_name}
        </h1>
        <p className="mt-4 text-[17px] font-semibold" style={{ color: a6 }}>{p.title}</p>
        {p.bio && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">{p.bio}</p>}
        {ctas(true)}
      </div>
    </section>
  )
}
