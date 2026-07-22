'use client'

import { useState } from 'react'
import { formatPrice, unitLabel } from '@/lib/pricing-format'
import { QuoteForm } from '../QuoteForm'
import { VoicePlayer } from '../VoicePlayer'
import { Reveal } from '../Reveal'
import { BeforeAfter } from '../blocks'
import { Lightbox } from './Lightbox'
import { collectImages, heroImage, testimonials, stats, mediaUrl } from './shared'
import type { LayoutProps } from './types'

// GRADIENT — a bright, approachable website. Split hero (text left, image
// right) over a soft accent wash; work in a 2-column card grid; the
// before/after keeps its draggable slider (this template's audience is
// makeup/coaches/trainers who live on transformation). SaaS-portfolio energy.
export function GradientLayout({ page, accent, tpl, vars }: LayoutProps) {
  const p = page.profile
  const services = page.services
  const hero = heroImage(page)
  const images = collectImages(page)
  const quotes = testimonials(page)
  const stat = stats(page)
  const bas = page.blocks.filter(b => b.type === 'before_after')
  const firstName = p.full_name.split(' ')[0] || p.handle
  const wa = p.whatsapp_number ? `https://wa.me/${p.whatsapp_number.replace(/[^\d]/g, '')}` : null
  const [lightbox, setLightbox] = useState<number | null>(null)

  return (
    <main
      className="text-[var(--card-ink)]"
      style={{ ...vars, background: `radial-gradient(120% 90% at 85% -10%, ${accent}26, transparent 55%), var(--card-bg)` }}
    >
      {/* ---------- split hero ---------- */}
      <section className="mx-auto grid max-w-6xl items-center gap-10 px-6 pt-16 pb-12 lg:grid-cols-2 lg:px-10 lg:pt-24">
        <div>
          {p.availability_status !== 'away' && (
            <span className="mb-5 inline-flex items-center gap-2 rounded-full bg-[var(--card-surface)] px-3 py-1 text-[12px] font-medium shadow-sm">
              <span className="h-2 w-2 rounded-full" style={{ background: p.availability_status === 'busy' ? '#c98500' : '#1f9254' }} />
              {p.availability_note || (p.availability_status === 'busy' ? 'Booked — join the waitlist' : 'Available for work')}
            </span>
          )}
          <h1 className="text-[40px] font-extrabold leading-[1.02] tracking-tight lg:text-[60px]">{p.full_name}</h1>
          <p className="mt-4 text-[17px] font-bold" style={{ color: accent }}>{p.title}</p>
          {p.bio && <p className="mt-4 max-w-md text-[15px] leading-relaxed text-[var(--card-muted)]">{p.bio}</p>}
          <div className="mt-7 flex flex-wrap gap-3">
            <a href="#quote-cta" className="rounded-full px-6 py-3 text-[14px] font-black text-[var(--card-accent-ink)] shadow-lg" style={{ background: accent }}>
              Request a quote
            </a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-full bg-[var(--card-surface)] px-6 py-3 text-[14px] font-bold shadow-sm">💬 WhatsApp</a>
            )}
          </div>
          {p.voice_intro_url && (
            <div className="mt-6 max-w-sm">
              <VoicePlayer src={mediaUrl(p.voice_intro_url)} label="Hear from me" accent={accent} radiusClass="rounded-[var(--card-radius-lg)]" />
            </div>
          )}
        </div>

        <div className="relative">
          {hero.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.url} alt={hero.alt} className="aspect-[4/5] w-full rounded-[var(--card-radius-lg)] object-cover shadow-[var(--card-shadow)]" />
          ) : (
            <div className="flex aspect-[4/5] w-full items-center justify-center rounded-[var(--card-radius-lg)] text-[64px] font-black text-[var(--card-accent-ink)]" style={{ background: accent }}>
              {(p.full_name || p.handle).charAt(0).toUpperCase()}
            </div>
          )}
        </div>
      </section>

      {/* ---------- stat cards ---------- */}
      {stat.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-8 lg:px-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stat.slice(0, 3).map((s, i) => (
              <div key={i} className="rounded-[var(--card-radius-lg)] bg-[var(--card-surface)] p-6 text-center shadow-[var(--card-shadow)]">
                <div className="text-[38px] font-black leading-none" style={{ color: accent }}>{s.value}</div>
                <div className="mt-1.5 text-[13px] text-[var(--card-muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- before/after (draggable) ---------- */}
      {bas.length > 0 && (
        <section className="mx-auto max-w-3xl px-6 py-10 lg:px-10">
          <SectionHeading accent={accent}>The transformation</SectionHeading>
          <div className="mt-5 space-y-6">
            {bas.map(b => (
              <BeforeAfter key={b.id} data={b.data} accent={accent} radiusClass="rounded-[var(--card-radius-lg)]" />
            ))}
          </div>
        </section>
      )}

      {/* ---------- 2-col work grid ---------- */}
      {images.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
          <SectionHeading accent={accent}>Recent work</SectionHeading>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {images.map((im, i) => (
              <Reveal key={i}>
                <button onClick={() => setLightbox(i)} className="group block w-full overflow-hidden rounded-[var(--card-radius-lg)] shadow-sm" aria-label={im.alt || `Photo ${i + 1}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.url ?? undefined} alt={im.alt} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </button>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------- testimonials as cards ---------- */}
      {quotes.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-10 lg:px-10">
          <div className="grid gap-4 sm:grid-cols-2">
            {quotes.map((q, i) => (
              <div key={i} className="rounded-[var(--card-radius-lg)] bg-[var(--card-surface)] p-6 shadow-[var(--card-shadow)]">
                <p className="text-[15px] leading-relaxed">“{q.text}”</p>
                <p className="mt-3 text-[12px] font-semibold text-[var(--card-muted)]">{q.attribution}{q.date_label ? ` · ${q.date_label}` : ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- price cards ---------- */}
      {services.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 py-12 lg:px-10">
          <SectionHeading accent={accent}>Services & rates</SectionHeading>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(s => (
              <div key={s.id} className="rounded-[var(--card-radius-lg)] bg-[var(--card-surface)] p-5 shadow-[var(--card-shadow)]">
                <p className="text-[15px] font-bold">{s.title}</p>
                {s.price != null && <p className="mt-0.5 text-[12px] text-[var(--card-muted-2)]">{unitLabel(s.unit, 'en')}</p>}
                <p className="mt-3 text-[22px] font-black" style={{ color: accent }}>
                  {s.price == null ? "let's talk" : formatPrice(s)}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- quote ---------- */}
      <section id="quote-cta" className="mx-auto max-w-lg px-6 py-16 lg:px-10">
        <SectionHeading accent={accent}>Work with {firstName}</SectionHeading>
        <div className="mt-6">
          <QuoteForm handle={p.handle} services={services} accent={accent} avatarUrl={mediaUrl(p.avatar_url)} firstName={firstName} replyHours={p.reply_hours} corner={tpl.corner} />
          <div className="mt-3 flex gap-2">
            <a href={`/api/vcard/${p.handle}`} className="flex-1 rounded-[var(--card-radius-md)] bg-[var(--card-surface)] py-3 text-center text-[13px] font-bold shadow-sm">📇 Save contact</a>
            {p.areas_served.length > 0 && (
              <span className="flex-1 rounded-[var(--card-radius-md)] bg-[var(--card-surface)] py-3 text-center text-[12px] text-[var(--card-muted)] shadow-sm">{p.areas_served.join(' · ')}</span>
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
      <span className="h-1 w-6 rounded-full" style={{ background: accent }} />
      <h2 className="text-[12px] font-bold uppercase tracking-[0.18em] text-[var(--card-muted)]">{children}</h2>
    </div>
  )
}
