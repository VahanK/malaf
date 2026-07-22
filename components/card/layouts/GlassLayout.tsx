'use client'

import { useState } from 'react'
import { formatPrice, unitLabel } from '@/lib/pricing-format'
import { QuoteForm } from '../QuoteForm'
import { VoicePlayer } from '../VoicePlayer'
import { Reveal } from '../Reveal'
import { BeforeAfter } from '../blocks'
import { Lightbox } from './Lightbox'
import { collectImages, heroImage, testimonials, stats, mediaUrl } from './shared'
import { normalizeAccent } from '@/lib/card-templates'
import type { LayoutProps } from './types'

// GLASS — frosted, floating panels over a soft pooled wash of the freelancer's
// accent. A centered glass hero panel (not a split), then the same section
// inventory as GradientLayout restyled onto .glass-panel/.glass-chip surfaces.
// The layout paints its own background + blurred accent "orbs" — the frost has
// nothing to frost without real pooled color behind it.
export function GlassLayout({ page, accent, tpl, vars }: LayoutProps) {
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
  const a6 = normalizeAccent(accent)

  return (
    <main
      className="relative overflow-hidden text-[var(--card-ink)]"
      style={{
        ...vars,
        background: `radial-gradient(90% 70% at 12% 8%, ${a6}40, transparent 55%), radial-gradient(80% 60% at 92% 12%, ${a6}26, transparent 50%), radial-gradient(120% 90% at 50% 110%, ${a6}1f, transparent 60%), var(--card-bg)`,
      }}
    >
      {/* blurred accent orbs — the pooled color the frost blurs over */}
      <div aria-hidden className="pointer-events-none absolute -left-[10vw] -top-[10vw] h-[45vw] w-[45vw] rounded-full opacity-45" style={{ background: a6, filter: 'blur(90px)' }} />
      <div aria-hidden className="pointer-events-none absolute -right-[8vw] top-[2vw] h-[40vw] w-[40vw] rounded-full opacity-40" style={{ background: a6, filter: 'blur(90px)' }} />

      {/* ---------- centered floating glass hero ---------- */}
      <section className="relative mx-auto max-w-3xl px-6 pt-16 pb-10 lg:pt-24">
        <div className="glass-panel p-6 text-center sm:p-10">
          {hero.url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={hero.url} alt={hero.alt} className="mx-auto aspect-[4/5] w-56 rounded-[var(--card-radius-lg)] object-cover ring-1 ring-inset ring-white/25 sm:w-64" />
          ) : p.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(p.avatar_url) ?? undefined} alt={p.full_name} className="mx-auto h-32 w-32 rounded-full object-cover ring-1 ring-inset ring-white/25" />
          ) : (
            <div className="relative mx-auto">
              {/* an extra orb behind the initial so frost has color to catch */}
              <div aria-hidden className="pointer-events-none absolute left-1/2 top-1/2 h-40 w-40 -translate-x-1/2 -translate-y-1/2 rounded-full opacity-50" style={{ background: a6, filter: 'blur(50px)' }} />
              <span className="relative flex h-28 w-28 items-center justify-center rounded-full text-[52px] font-black ring-1 ring-inset ring-white/30" style={{ background: `${a6}22`, color: a6 }}>
                {(p.full_name || p.handle).charAt(0).toUpperCase()}
              </span>
            </div>
          )}

          {p.availability_status !== 'away' && (
            <span className="glass-chip mt-6 inline-flex items-center gap-2 px-3 py-1 text-[12px] font-medium">
              <span className="h-2 w-2 rounded-full" style={{ background: p.availability_status === 'busy' ? '#c98500' : '#1f9254' }} />
              {p.availability_note || (p.availability_status === 'busy' ? 'Booked — join the waitlist' : 'Available for work')}
            </span>
          )}

          <h1 className="mt-4 text-[40px] font-extrabold leading-[1.02] tracking-tight sm:text-[44px]">{p.full_name}</h1>
          <p className="mt-2 text-[16px] font-bold" style={{ color: a6 }}>{p.title}</p>
          {p.bio && <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[var(--card-muted)]">{p.bio}</p>}

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            <a href="#quote-cta" className="rounded-[var(--card-radius-full)] px-6 py-3 text-[14px] font-black shadow-lg" style={{ background: a6, color: 'var(--card-accent-ink)' }}>
              Request a quote
            </a>
            {wa && (
              <a href={wa} target="_blank" rel="noopener noreferrer" className="glass-chip px-6 py-3 text-[14px] font-bold">💬 WhatsApp</a>
            )}
          </div>

          {p.voice_intro_url && (
            <div className="mx-auto mt-6 max-w-sm">
              <VoicePlayer src={mediaUrl(p.voice_intro_url)} label="Hear from me" accent={a6} radiusClass="rounded-[var(--card-radius-lg)]" />
            </div>
          )}
        </div>
      </section>

      {/* ---------- stat tiles ---------- */}
      {stat.length > 0 && (
        <section className="relative mx-auto max-w-4xl px-6 py-8 lg:px-10">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {stat.slice(0, 3).map((s, i) => (
              <div key={i} className="glass-panel p-6 text-center">
                <div className="text-[36px] font-black leading-none" style={{ color: a6 }}>{s.value}</div>
                <div className="mt-1.5 text-[13px] text-[var(--card-muted)]">{s.label}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- before/after ---------- */}
      {bas.length > 0 && (
        <section className="relative mx-auto max-w-3xl px-6 py-8 lg:px-10">
          <SectionHeading accent={a6}>The transformation</SectionHeading>
          <div className="glass-panel mt-5 space-y-6 p-4">
            {bas.map(b => (
              <BeforeAfter key={b.id} data={b.data} accent={a6} radiusClass="rounded-[var(--card-radius-md)]" />
            ))}
          </div>
        </section>
      )}

      {/* ---------- work grid ---------- */}
      {images.length > 0 && (
        <section className="relative mx-auto max-w-5xl px-6 py-8 lg:px-10">
          <SectionHeading accent={a6}>Recent work</SectionHeading>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-3">
            {images.map((im, i) => (
              <Reveal key={i}>
                <button onClick={() => setLightbox(i)} className="group block w-full overflow-hidden rounded-[var(--card-radius-lg)] ring-1 ring-inset ring-white/25" aria-label={im.alt || `Photo ${i + 1}`}>
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={im.url ?? undefined} alt={im.alt} loading="lazy" className="aspect-square w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                </button>
              </Reveal>
            ))}
          </div>
        </section>
      )}

      {/* ---------- testimonials ---------- */}
      {quotes.length > 0 && (
        <section className="relative mx-auto max-w-4xl px-6 py-8 lg:px-10">
          <div className="grid gap-4 sm:grid-cols-2">
            {quotes.map((q, i) => (
              <div key={i} className="glass-panel p-6">
                <p className="text-[15px] leading-relaxed">“{q.text}”</p>
                <p className="mt-3 text-[12px] font-semibold text-[var(--card-muted)]">{q.attribution}{q.date_label ? ` · ${q.date_label}` : ''}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- services ---------- */}
      {services.length > 0 && (
        <section className="relative mx-auto max-w-5xl px-6 py-10 lg:px-10">
          <SectionHeading accent={a6}>Services &amp; rates</SectionHeading>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {services.map(s => (
              <div key={s.id} className="glass-panel flex h-full flex-col justify-between p-5">
                <div>
                  <p className="text-[15px] font-bold">{s.title}</p>
                  {s.note && <p className="mt-1.5 text-[12.5px] leading-relaxed text-[var(--card-muted)]">{s.note}</p>}
                </div>
                <p className="mt-4 text-[22px] font-black" style={{ color: a6 }}>
                  {s.price == null ? "Let's talk" : formatPrice(s)}
                  {s.price != null && <span className="ms-1.5 text-[12px] font-medium text-[var(--card-muted-2)]">/ {unitLabel(s.unit, 'en')}</span>}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ---------- quote ---------- */}
      <section id="quote-cta" className="relative mx-auto max-w-lg px-6 py-16 lg:px-10">
        <div className="text-center">
          <h2 className="text-[30px] font-extrabold tracking-tight sm:text-[36px]">Let&apos;s make something.</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[var(--card-muted)]">
            Tell {firstName} what you have in mind — a date, a budget, a rough idea.
            {p.reply_hours ? <> You&apos;ll usually hear back within {p.reply_hours}h.</> : null}
          </p>
        </div>
        <div className="glass-panel mt-8 p-5">
          <QuoteForm handle={p.handle} services={services} accent={a6} avatarUrl={mediaUrl(p.avatar_url)} firstName={firstName} replyHours={p.reply_hours} corner={tpl.corner} />
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="glass-chip mt-3 flex items-center justify-center gap-2 py-3 text-center text-[13px] font-bold">
              💬 Or message on WhatsApp
            </a>
          )}
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
