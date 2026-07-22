'use client'

import { useState } from 'react'
import { formatPrice, unitLabel } from '@/lib/pricing-format'
import { QuoteForm } from '../QuoteForm'
import { VoicePlayer } from '../VoicePlayer'
import { Reveal } from '../Reveal'
import { Lightbox } from './Lightbox'
import { collectImages, testimonials, beforeAfters, stats, mediaUrl } from './shared'
import type { LayoutProps } from './types'

const SERIF = 'Georgia, "Times New Roman", serif'

// MINIMAL — a quiet editorial-magazine website. Centered serif name, generous
// whitespace, no photo behind the hero; work as a single-column column of
// large full-width images the visitor scrolls through slowly. The opposite
// energy of Editorial: restraint as the statement.
export function MinimalLayout({ page, accent, tpl, vars }: LayoutProps) {
  const p = page.profile
  const services = page.services
  const images = collectImages(page)
  const quotes = testimonials(page)
  const bas = beforeAfters(page)
  const stat = stats(page)
  const firstName = p.full_name.split(' ')[0] || p.handle
  const wa = p.whatsapp_number ? `https://wa.me/${p.whatsapp_number.replace(/[^\d]/g, '')}` : null
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <main className="text-[var(--card-ink)]" style={{ ...vars, background: 'var(--card-bg)' }}>
      {/* ---------- centered masthead, no image ---------- */}
      <header className="mx-auto max-w-2xl px-6 pt-24 pb-16 text-center lg:pt-32">
        {p.availability_status !== 'away' && (
          <span className="mb-8 inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] text-[var(--card-muted)]">
            <span className="h-1.5 w-1.5 rounded-full" style={{ background: p.availability_status === 'busy' ? '#c98500' : '#1f9254' }} />
            {p.availability_note || (p.availability_status === 'busy' ? 'Booked' : 'Available')}
          </span>
        )}
        <h1 className="text-[44px] leading-[1.05] lg:text-[68px]" style={{ fontFamily: SERIF, fontWeight: 500 }}>
          {p.full_name}
        </h1>
        <p className="mt-5 text-[15px] uppercase tracking-[0.18em]" style={{ color: accent }}>{p.title}</p>
        {p.bio && <p className="mx-auto mt-6 max-w-lg text-[16px] leading-relaxed text-[var(--card-muted)]">{p.bio}</p>}

        <div className="mt-9 flex items-center justify-center gap-6 text-[13px]">
          <a href="#quote-cta" className="border-b-2 pb-0.5 font-semibold" style={{ borderColor: accent, color: 'var(--card-ink)' }}>
            Request a quote
          </a>
          {wa && <a href={wa} target="_blank" rel="noopener noreferrer" className="border-b border-[var(--card-border)] pb-0.5 text-[var(--card-muted)]">WhatsApp</a>}
        </div>

        {p.voice_intro_url && (
          <div className="mx-auto mt-10 max-w-md">
            <VoicePlayer src={mediaUrl(p.voice_intro_url)} label="Hear from me" accent={accent} radiusClass="rounded-[var(--card-radius-md)]" />
          </div>
        )}
      </header>

      {/* ---------- stats as a quiet centered line ---------- */}
      {stat.length > 0 && (
        <section className="mx-auto flex max-w-3xl flex-wrap justify-center gap-x-16 gap-y-6 border-y border-[var(--card-border)] px-6 py-10">
          {stat.slice(0, 3).map((s, i) => (
            <div key={i} className="text-center">
              <div className="text-[36px]" style={{ fontFamily: SERIF, color: accent }}>{s.value}</div>
              <div className="mt-1 text-[12px] uppercase tracking-wider text-[var(--card-muted)]">{s.label}</div>
            </div>
          ))}
        </section>
      )}

      {/* ---------- single-column large-image scroll ---------- */}
      {images.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-16">
          <div className="space-y-16">
            {images.map((im, i) => (
              <Reveal key={i}>
                <figure>
                  <button onClick={() => setLightbox(i)} className="block w-full overflow-hidden" aria-label={im.alt || `Photo ${i + 1}`}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={im.url ?? undefined} alt={im.alt} loading="lazy" className="w-full object-cover" />
                  </button>
                  {im.alt && <figcaption className="mt-3 text-[12px] italic text-[var(--card-muted)]" style={{ fontFamily: SERIF }}>{im.alt}</figcaption>}
                </figure>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------- before/after ---------- */}
      {bas.map((ba, i) => (
        <section key={i} className="mx-auto max-w-3xl px-6 pb-16">
          <div className="grid grid-cols-2 gap-4">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ba.before ?? undefined} alt="Before" className="aspect-[4/5] w-full object-cover" />
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={ba.after ?? undefined} alt="After" className="aspect-[4/5] w-full object-cover" />
          </div>
          {ba.caption && <p className="mt-3 text-center text-[12px] italic text-[var(--card-muted)]" style={{ fontFamily: SERIF }}>{ba.caption}</p>}
        </section>
      ))}

      {/* ---------- testimonials ---------- */}
      {quotes.map((q, i) => (
        <section key={i} className="mx-auto max-w-2xl px-6 py-12 text-center">
          <p className="text-[22px] leading-relaxed lg:text-[26px]" style={{ fontFamily: SERIF }}>“{q.text}”</p>
          <p className="mt-4 text-[12px] uppercase tracking-wider text-[var(--card-muted)]">{q.attribution}{q.date_label ? ` · ${q.date_label}` : ''}</p>
        </section>
      ))}

      {/* ---------- rates ---------- */}
      {services.length > 0 && (
        <section className="mx-auto max-w-2xl border-t border-[var(--card-border)] px-6 py-14">
          <h2 className="text-center text-[13px] uppercase tracking-[0.22em] text-[var(--card-muted)]">Rates</h2>
          <div className="mt-8 space-y-5">
            {services.map(s => (
              <div key={s.id} className="flex items-baseline justify-between">
                <div>
                  <span className="text-[18px]" style={{ fontFamily: SERIF }}>{s.title}</span>
                  {s.price != null && <span className="ms-3 text-[12px] text-[var(--card-muted-2)]">{unitLabel(s.unit, 'en')}</span>}
                </div>
                <span className="text-[18px]" style={{ fontFamily: SERIF, color: accent }}>
                  {s.price == null ? "let's talk" : formatPrice(s)}
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- quote ---------- */}
      <section id="quote-cta" className="mx-auto max-w-lg px-6 py-20">
        <h2 className="mb-6 text-center text-[28px]" style={{ fontFamily: SERIF }}>Work with {firstName}</h2>
        <QuoteForm handle={p.handle} services={services} accent={accent} avatarUrl={mediaUrl(p.avatar_url)} firstName={firstName} replyHours={p.reply_hours} corner={tpl.corner} />
        <div className="mt-4 text-center">
          <a href={`/api/vcard/${p.handle}`} className="text-[13px] text-[var(--card-muted)] underline underline-offset-4">Save contact</a>
          {p.areas_served.length > 0 && <p className="mt-4 text-[12px] uppercase tracking-wider text-[var(--card-muted-2)]">{p.areas_served.join(' · ')}</p>}
        </div>
      </section>

      {lightbox !== null && <Lightbox images={images} start={lightbox} onClose={() => setLightbox(null)} />}
    </main>
  )
}
