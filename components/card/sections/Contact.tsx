'use client'

import { QuoteForm } from '../QuoteForm'
import { mediaUrl } from '../layouts/shared'
import { normalizeAccent } from '@/lib/card-templates'
import { worldType, type World } from './shared'
import type { PublicPage } from '@/lib/public-page'

// CONTACT (fixed bone, varied face). The founder's #6 complaint: "the footer is
// always the same flat thing." So the closer now has real variety, chosen by
// contact_variant, and its heading picks up the per-world type:
//   - cta-band (default): centered dark "Let's work together" + quote form
//   - big-type:           oversized name-as-CTA on a dark band (OKO/brutalist)
//   - columns:            a real footer — contact column + quick links + socials
// All three still route to the SAME QuoteForm so the on-platform request path is
// intact; the difference is purely the closing composition.
export function Contact({
  page,
  accent,
  world,
}: {
  page: PublicPage
  accent: string
  world?: World
}) {
  const p = page.profile
  const firstName = p.full_name.split(' ')[0] || p.handle
  const wa = p.whatsapp_number ? `https://wa.me/${p.whatsapp_number.replace(/[^\d]/g, '')}` : null
  const a6 = normalizeAccent(accent)
  const wt = worldType(world)
  const variant = p.contact_variant || 'cta-band'

  const form = (
    <QuoteForm
      handle={p.handle}
      services={page.services}
      accent={a6}
      avatarUrl={mediaUrl(p.avatar_url)}
      firstName={firstName}
      replyHours={p.reply_hours}
      corner="soft"
    />
  )
  const waLink = wa && (
    <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-white/20 py-3 text-[13px] font-bold text-white">
      💬 Or message on WhatsApp
    </a>
  )
  const availLine =
    p.availability_status === 'busy' ? 'Booking the next opening' : 'Taking on new work now'

  // ── big-type: oversized "work with {name}" as the closer (brutalist/OKO) ──
  if (variant === 'big-type') {
    return (
      <section id="contact" className="w-full px-6 py-24 lg:px-10" style={{ background: 'var(--card-ink)', color: 'var(--card-bg)' }}>
        <div className="mx-auto max-w-5xl">
          <span className="text-[12px] font-semibold uppercase tracking-[0.28em]" style={{ color: a6 }}>{availLine}</span>
          <h2 className={`mt-4 ${wt.heading} leading-[0.9]`} style={{ fontSize: 'clamp(44px,10vw,140px)' }}>
            Work with<br />{firstName}
            <span style={{ color: a6 }}>.</span>
          </h2>
          <div className="mt-10 max-w-lg">
            {form}
            {waLink}
          </div>
        </div>
      </section>
    )
  }

  // ── columns: a real multi-column footer (contact + links + socials) ──
  if (variant === 'columns') {
    const links = page.services.slice(0, 4)
    return (
      <section id="contact" className="w-full px-6 py-20 lg:px-10" style={{ background: 'var(--card-ink)', color: 'var(--card-bg)' }}>
        <div className="mx-auto grid max-w-5xl gap-12 md:grid-cols-[1.2fr_0.8fr]">
          <div>
            <div className="mb-6 inline-block rounded-full px-4 py-1.5 text-[13px] font-bold" style={{ background: a6, color: 'var(--card-accent-ink)' }}>
              {availLine}
            </div>
            <h2 className={`${wt.heading} leading-tight`} style={{ fontSize: 'clamp(30px,5vw,56px)' }}>
              Let&apos;s work together.
            </h2>
            <p className="mt-3 max-w-md text-[15px] leading-relaxed text-white/60">
              Tell {firstName} what you have in mind — a date, a budget, a rough idea.
              {p.reply_hours ? <> Usually replies within {p.reply_hours}h.</> : null}
            </p>
            <div className="mt-8 max-w-md">
              {form}
              {waLink}
            </div>
          </div>
          <div className="flex flex-col gap-8 text-[14px] md:pt-16">
            {links.length > 0 && (
              <div>
                <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">Services</p>
                <ul className="space-y-2 text-white/80">
                  {links.map(s => <li key={s.id}>{s.title}</li>)}
                </ul>
              </div>
            )}
            <div>
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-[0.22em] text-white/40">Reach me</p>
              <ul className="space-y-2 text-white/80">
                {wa && <li><a href={wa} target="_blank" rel="noopener noreferrer" className="hover:text-white">WhatsApp</a></li>}
                {p.areas_served && p.areas_served.length > 0 && <li>{p.areas_served.slice(0, 3).join(' · ')}</li>}
              </ul>
            </div>
            <p className="mt-auto text-[12px] text-white/35">© {p.full_name}</p>
          </div>
        </div>
      </section>
    )
  }

  // ── cta-band (default): centered closer, upgraded with an accent strip ──
  return (
    <section id="contact" className="w-full px-6 py-24 lg:px-10" style={{ background: 'var(--card-ink)', color: 'var(--card-bg)' }}>
      <div className="mx-auto max-w-lg text-center">
        <div className="mx-auto mb-8 inline-block rounded-full px-4 py-1.5 text-[13px] font-bold" style={{ background: a6, color: 'var(--card-accent-ink)' }}>
          {availLine}
        </div>
        <h2 className={`${wt.heading} leading-tight`} style={{ fontSize: 'clamp(30px,5vw,52px)' }}>
          Let&apos;s work together.
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-white/60">
          Tell {firstName} what you have in mind — a date, a budget, a rough idea.
          {p.reply_hours ? <> Usually replies within {p.reply_hours}h.</> : null}
        </p>
        <div className="mt-8 text-left">
          {form}
          {waLink}
        </div>
      </div>
    </section>
  )
}
