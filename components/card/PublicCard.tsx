import { mediaUrl } from '@/lib/media'
import { formatPrice, unitLabel, type PublicPage } from '@/lib/public-page'
import { Block } from './blocks'
import { QuoteForm } from './QuoteForm'
import { VoicePlayer } from './VoicePlayer'
import { StickyQuoteBar } from './StickyQuoteBar'
import { Reveal } from './Reveal'

const STATUS_STYLES: Record<string, { dot: string; text: string; border: string; bg: string }> = {
  available: { dot: '#3ddc84', text: '#3ddc84', border: 'rgba(61,220,132,.35)', bg: 'rgba(61,220,132,.1)' },
  busy: { dot: '#eda100', text: '#eda100', border: 'rgba(237,161,0,.35)', bg: 'rgba(237,161,0,.1)' },
  away: { dot: '#9aa0ae', text: '#9aa0ae', border: 'rgba(154,160,174,.35)', bg: 'rgba(154,160,174,.1)' },
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[#6b7284]">
      {children}
    </p>
  )
}

export function PublicCard({ page }: { page: PublicPage }) {
  const { profile: p, services, blocks } = page
  const accent = p.accent_color ?? '#c9a45c'
  const status = STATUS_STYLES[p.availability_status] ?? STATUS_STYLES.available
  const avatar = mediaUrl(p.avatar_url)
  const initial = (p.full_name || p.handle).charAt(0).toUpperCase()
  const wa = p.whatsapp_number ? `https://wa.me/${p.whatsapp_number.replace(/[^\d]/g, '')}` : null
  const firstName = p.full_name.split(' ')[0] || p.handle

  return (
    <main
      className="min-h-screen text-[#f4f2ec]"
      style={{
        background: `radial-gradient(640px 420px at 50% -120px, ${accent}30, transparent 70%), #0e0f13`,
      }}
    >
      <div className="mx-auto max-w-md px-5 pb-24 pt-10">
        {/* identity — name huge, face first (above the fold: load animation, not scroll) */}
        <div className="card-reveal">
          <div className="flex items-center gap-4">
            <div className="relative shrink-0">
              <span
                aria-hidden
                className="glow-breathe absolute inset-0 rounded-full blur-xl"
                style={{ background: accent }}
              />
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt={p.full_name}
                  className="relative h-[88px] w-[88px] rounded-full border-[3px] object-cover"
                  style={{ borderColor: accent }}
                />
              ) : (
                <div
                  className="relative flex h-[88px] w-[88px] items-center justify-center rounded-full border-[3px] text-[34px] font-black text-[#141414]"
                  style={{
                    borderColor: accent,
                    background: `radial-gradient(circle at 30% 25%, #e8cf9a, #b5883f 70%)`,
                  }}
                >
                  {initial}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h1 className="text-[32px] font-black leading-[1.05] tracking-tight">{p.full_name}</h1>
              <p className="mt-1 text-[13px] font-bold" style={{ color: accent }}>{p.title}</p>
            </div>
          </div>
          {(p.availability_note || p.availability_status !== 'away') && (
            <span
              className="mt-3 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[11px]"
              style={{ color: status.text, borderColor: status.border, background: status.bg }}
            >
              <span className="h-[7px] w-[7px] rounded-full" style={{ background: status.dot }} />
              {p.availability_note || (p.availability_status === 'available' ? 'Available' : p.availability_status)}
            </span>
          )}
          {p.bio && <p className="mt-3 text-[13.5px] leading-relaxed text-[#9aa0ae]">{p.bio}</p>}
        </div>

        {/* voice intro — the flagship personal feature */}
        {p.voice_intro_url && (
          <div className="card-reveal mt-5" style={{ animationDelay: '120ms' }}>
            <VoicePlayer src={mediaUrl(p.voice_intro_url)} label="Hear from me" accent={accent} />
          </div>
        )}

        {/* services — the one pricing schema; no fixed price = "let's talk" */}
        {services.length > 0 && (
          <Reveal className="mt-7">
            <SectionLabel>Prices</SectionLabel>
            <div className="rounded-2xl border border-[#20242e] bg-[#12141a]/70 px-4 py-1">
              {services.map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between border-b border-dashed border-[#262a35] py-3 text-[14px] last:border-0"
                >
                  <div className="min-w-0 pe-3">
                    <b className="font-bold">{s.title}</b>
                    {s.price != null && (
                      <span className="ms-2 text-[11px] text-[#6b7284]">{unitLabel(s.unit, 'en')}</span>
                    )}
                  </div>
                  {s.price == null ? (
                    <span
                      className="shrink-0 rounded-full border px-2.5 py-1 text-[11.5px] font-bold"
                      style={{ borderColor: `${accent}80`, color: accent }}
                    >
                      let&apos;s talk 💬
                    </span>
                  ) : (
                    <span className="shrink-0 font-black" style={{ color: accent }}>{formatPrice(s)}</span>
                  )}
                </div>
              ))}
            </div>
          </Reveal>
        )}

        {/* portfolio blocks — each reveals as it enters the viewport */}
        {blocks.length > 0 && (
          <div className="mt-7">
            <Reveal>
              <SectionLabel>The work</SectionLabel>
            </Reveal>
            <div className="space-y-4">
              {blocks.map(b => (
                <Reveal key={b.id}>
                  <Block block={b} accent={accent} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* areas served */}
        {p.areas_served.length > 0 && (
          <Reveal className="mt-6">
            <div className="flex flex-wrap gap-1.5">
              {p.areas_served.map(a => (
                <span key={a} className="rounded-full border border-[#2c313d] px-2.5 py-1 text-[11px] text-[#9aa0ae]">{a}</span>
              ))}
            </div>
          </Reveal>
        )}

        {/* CTAs */}
        <Reveal className="mt-7">
          <div id="quote-cta" className="space-y-2">
            <QuoteForm
              handle={p.handle}
              services={services}
              accent={accent}
              avatarUrl={avatar}
              firstName={firstName}
              replyHours={p.reply_hours}
            />
            <div className="flex gap-2">
              <a
                href={`/api/vcard/${p.handle}`}
                className="flex-1 rounded-[13px] border-[1.5px] border-[#2c313d] py-2.5 text-center text-[12.5px] font-bold transition-colors hover:border-white/30"
              >
                📇 Save contact
              </a>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 rounded-[13px] border-[1.5px] border-[#2c313d] py-2.5 text-center text-[12.5px] font-bold transition-colors hover:border-white/30"
                >
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>
          {p.reply_hours ? (
            <p className="mt-3 text-center text-[11px] text-[#9aa0ae]">
              Usually replies within {p.reply_hours}h
            </p>
          ) : null}
        </Reveal>
      </div>

      <StickyQuoteBar accent={accent} name={firstName} />
    </main>
  )
}
