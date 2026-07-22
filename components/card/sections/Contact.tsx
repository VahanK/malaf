'use client'

import { QuoteForm } from '../QuoteForm'
import { mediaUrl } from '../layouts/shared'
import { normalizeAccent } from '@/lib/card-templates'
import type { PublicPage } from '@/lib/public-page'

// CONTACT (fixed bone). A full-bleed dark CTA band — the "Let's work together"
// closer every reference ends on. Reuses the conversational QuoteForm.
export function Contact({ page, accent }: { page: PublicPage; accent: string }) {
  const p = page.profile
  const firstName = p.full_name.split(' ')[0] || p.handle
  const wa = p.whatsapp_number ? `https://wa.me/${p.whatsapp_number.replace(/[^\d]/g, '')}` : null
  const a6 = normalizeAccent(accent)

  return (
    <section id="contact" className="w-full px-6 py-24 lg:px-10" style={{ background: 'var(--card-ink)', color: 'var(--card-bg)' }}>
      <div className="mx-auto max-w-lg text-center">
        <h2 className="font-serif text-[clamp(30px,5vw,52px)] font-semibold leading-tight tracking-[-0.02em]">
          Let&apos;s work together.
        </h2>
        <p className="mt-3 text-[15px] leading-relaxed text-white/60">
          Tell {firstName} what you have in mind — a date, a budget, a rough idea.
          {p.reply_hours ? <> Usually replies within {p.reply_hours}h.</> : null}
        </p>
        <div className="mt-8 text-left">
          <QuoteForm
            handle={p.handle}
            services={page.services}
            accent={a6}
            avatarUrl={mediaUrl(p.avatar_url)}
            firstName={firstName}
            replyHours={p.reply_hours}
            corner="soft"
          />
          {wa && (
            <a href={wa} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-white/20 py-3 text-[13px] font-bold text-white">
              💬 Or message on WhatsApp
            </a>
          )}
        </div>
      </div>
    </section>
  )
}
