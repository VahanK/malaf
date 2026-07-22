'use client'

import { useState } from 'react'
import { formatPrice, unitLabel } from '@/lib/pricing-format'
import { QuoteForm } from '../QuoteForm'
import { VoicePlayer } from '../VoicePlayer'
import { Reveal } from '../Reveal'
import { Lightbox } from './Lightbox'
import { collectImages, heroImage, testimonials, beforeAfters, stats, mediaUrl } from './shared'
import type { LayoutProps } from './types'

// EDITORIAL — a dark gallery website. Full-bleed hero photo with the name
// laid over it in huge type; work as an edge-to-edge masonry wall; prices a
// quiet strip; testimonials as pull-quotes. Reads like a photographer's site,
// not a stacked-card app screen.
export function EditorialLayout({ page, accent, tpl, vars }: LayoutProps) {
  const p = page.profile
  const services = page.services
  const hero = heroImage(page)
  const images = collectImages(page)
  const quotes = testimonials(page)
  const bas = beforeAfters(page)
  const stat = stats(page)
  const firstName = p.full_name.split(' ')[0] || p.handle
  const wa = p.whatsapp_number ? `https://wa.me/${p.whatsapp_number.replace(/[^\d]/g, '')}` : null
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <main className="text-[var(--card-ink)]" style={{ ...vars, background: 'var(--card-bg)' }}>
      {/* ---------- full-bleed hero ---------- */}
      <section className="relative flex min-h-[92vh] items-end overflow-hidden">
        {hero.url ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={hero.url} alt={hero.alt} className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <div className="absolute inset-0" style={{ background: `radial-gradient(80% 80% at 50% 20%, ${accent}55, #0e0f13)` }} />
        )}
        {/* legibility gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-40"
          style={{ background: `linear-gradient(to bottom, ${accent}22, transparent)` }}
        />

        <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 lg:px-10 lg:pb-20">
          {p.availability_status !== 'away' && (
            <span className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/25 bg-black/30 px-3 py-1 text-[12px] text-white backdrop-blur">
              <span className="h-2 w-2 rounded-full" style={{ background: p.availability_status === 'busy' ? '#eda100' : '#3ddc84' }} />
              {p.availability_note || (p.availability_status === 'busy' ? 'Booked — join the waitlist' : 'Available for work')}
            </span>
          )}
          <h1 className="max-w-4xl text-[13vw] font-black leading-[0.9] tracking-[-0.03em] text-white sm:text-[64px] lg:text-[88px]">
            {p.full_name}
          </h1>
          <p className="mt-4 max-w-xl text-[16px] font-semibold" style={{ color: accent }}>{p.title}</p>
          {p.bio && <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75">{p.bio}</p>}

          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a href="#quote-cta" className="rounded-full px-6 py-3 text-[14px] font-black text-[var(--card-accent-ink)]" style={{ background: accent }}>
              Request a quote
            </a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-full border border-white/30 px-6 py-3 text-[14px] font-bold text-white backdrop-blur">
                💬 WhatsApp
              </a>
            )}
          </div>
        </div>
      </section>

      {/* ---------- voice intro (if any) ---------- */}
      {p.voice_intro_url && (
        <section className="mx-auto max-w-2xl px-6 py-10 lg:px-10">
          <VoicePlayer src={mediaUrl(p.voice_intro_url)} label="Hear from me" accent={accent} radiusClass="rounded-[var(--card-radius-lg)]" />
        </section>
      )}

      {/* ---------- stat band ---------- */}
      {stat.length > 0 && (
        <section className="border-y border-[var(--card-border-soft)]">
          <div className="mx-auto grid max-w-6xl grid-cols-2 divide-x divide-[var(--card-border-soft)] sm:grid-cols-3 lg:px-10">
            {stat.slice(0, 3).map((s, i) => (
              <div key={i} className="px-6 py-10 text-center">
                <div className="text-[44px] font-black leading-none" style={{ color: accent }}>{s.value}</div>
                <div className="mt-2 text-[13px] text-[var(--card-muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- edge-to-edge gallery wall ---------- */}
      {images.length > 0 && (
        <section className="mx-auto max-w-6xl px-3 py-14 lg:px-6">
          <SectionHeading accent={accent}>Selected work</SectionHeading>
          <div className="mt-6 columns-2 gap-3 lg:columns-3 [&>*]:mb-3">
            {images.map((im, i) => (
              <Reveal key={i}>
                <button
                  onClick={() => setLightbox(i)}
                  className="group block w-full overflow-hidden rounded-[var(--card-radius-md)]"
                  aria-label={im.alt || `Photo ${i + 1}`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={im.url ?? undefined}
                    alt={im.alt}
                    loading="lazy"
                    className="w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                  />
                </button>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------- before/after ---------- */}
      {bas.map((ba, i) => (
        <section key={i} className="mx-auto max-w-4xl px-6 py-10 lg:px-10">
          <div className="grid grid-cols-2 gap-3">
            <figure className="overflow-hidden rounded-[var(--card-radius-md)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ba.before ?? undefined} alt="Before" className="aspect-[4/5] w-full object-cover" />
              <figcaption className="mt-2 text-[11px] uppercase tracking-wider text-[var(--card-muted-2)]">Before</figcaption>
            </figure>
            <figure className="overflow-hidden rounded-[var(--card-radius-md)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={ba.after ?? undefined} alt="After" className="aspect-[4/5] w-full object-cover" />
              <figcaption className="mt-2 text-[11px] uppercase tracking-wider" style={{ color: accent }}>After</figcaption>
            </figure>
          </div>
          {ba.caption && <p className="mt-3 text-center text-[13px] text-[var(--card-muted)]">{ba.caption}</p>}
        </section>
      ))}

      {/* ---------- pull-quote testimonials ---------- */}
      {quotes.map((q, i) => (
        <section key={i} className="mx-auto max-w-3xl px-6 py-14 text-center lg:px-10">
          <p className="text-[24px] font-semibold leading-snug lg:text-[30px]">
            <span style={{ color: accent }}>“</span>{q.text}<span style={{ color: accent }}>”</span>
          </p>
          <p className="mt-4 text-[13px] text-[var(--card-muted)]">
            {q.attribution}{q.date_label ? ` · ${q.date_label}` : ''}
          </p>
        </section>
      ))}

      {/* ---------- prices strip ---------- */}
      {services.length > 0 && (
        <section className="border-t border-[var(--card-border-soft)] bg-[var(--card-surface-soft)]">
          <div className="mx-auto max-w-4xl px-6 py-12 lg:px-10">
            <SectionHeading accent={accent}>Rates</SectionHeading>
            <div className="mt-6 divide-y divide-[var(--card-border)]">
              {services.map(s => (
                <div key={s.id} className="flex items-baseline justify-between py-4">
                  <div>
                    <span className="text-[17px] font-bold">{s.title}</span>
                    {s.price != null && <span className="ms-3 text-[12px] text-[var(--card-muted-2)]">{unitLabel(s.unit, 'en')}</span>}
                  </div>
                  <span className="text-[18px] font-black" style={{ color: accent }}>
                    {s.price == null ? "let's talk" : formatPrice(s)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------- contact / quote ---------- */}
      <section id="quote-cta" className="mx-auto max-w-lg px-6 py-16 lg:px-10">
        <SectionHeading accent={accent}>Work with {firstName}</SectionHeading>
        <div className="mt-6">
          <QuoteForm handle={p.handle} services={services} accent={accent} avatarUrl={mediaUrl(p.avatar_url)} firstName={firstName} replyHours={p.reply_hours} corner={tpl.corner} />
          <div className="mt-3 flex gap-2">
            <a href={`/api/vcard/${p.handle}`} className="flex-1 rounded-[var(--card-radius-md)] border border-[var(--card-border)] py-3 text-center text-[13px] font-bold">📇 Save contact</a>
            {p.areas_served.length > 0 && (
              <span className="flex-1 rounded-[var(--card-radius-md)] border border-[var(--card-border)] py-3 text-center text-[12px] text-[var(--card-muted)]">
                {p.areas_served.join(' · ')}
              </span>
            )}
          </div>
          {p.reply_hours ? <p className="mt-3 text-center text-[11px] text-[var(--card-muted)]">Usually replies within {p.reply_hours}h</p> : null}
        </div>
      </section>

      {lightbox !== null && <Lightbox images={images} start={lightbox} onClose={() => setLightbox(null)} />}
    </main>
  )
}

function SectionHeading({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="h-px w-8" style={{ background: accent }} />
      <h2 className="text-[12px] font-bold uppercase tracking-[0.22em] text-[var(--card-muted)]">{children}</h2>
    </div>
  )
}
