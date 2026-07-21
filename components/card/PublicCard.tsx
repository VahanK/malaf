import { mediaUrl } from '@/lib/media'
import { formatPrice, unitLabel, type PublicPage } from '@/lib/public-page'
import { getCardTemplate } from '@/lib/card-templates'
import { Block } from './blocks'
import { QuoteForm } from './QuoteForm'
import { VoicePlayer } from './VoicePlayer'
import { StickyQuoteBar } from './StickyQuoteBar'
import { Reveal } from './Reveal'

const STATUS_STYLES: Record<string, { dot: string; border: string; bg: string }> = {
  available: { dot: '#3ddc84', border: 'rgba(61,220,132,.35)', bg: 'rgba(61,220,132,.1)' },
  busy: { dot: '#eda100', border: 'rgba(237,161,0,.35)', bg: 'rgba(237,161,0,.1)' },
  away: { dot: 'var(--card-muted)', border: 'var(--card-border)', bg: 'var(--card-surface-soft)' },
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-[var(--card-muted-2)]">
      {children}
    </p>
  )
}

export function PublicCard({ page }: { page: PublicPage }) {
  const { profile: p, services, blocks } = page
  const accent = p.accent_color ?? '#c9a45c'
  const tpl = getCardTemplate(p.card_template)
  const tokens = tpl.vars(accent)
  const vars = tokens as React.CSSProperties
  const status = STATUS_STYLES[p.availability_status] ?? STATUS_STYLES.available
  const avatar = mediaUrl(p.avatar_url)
  const initial = (p.full_name || p.handle).charAt(0).toUpperCase()
  const wa = p.whatsapp_number ? `https://wa.me/${p.whatsapp_number.replace(/[^\d]/g, '')}` : null
  const firstName = p.full_name.split(' ')[0] || p.handle

  const isWide = tpl.container === 'wide'
  const isDisplay = tpl.headingFont === 'display'
  const cardRadiusClass = 'rounded-[var(--card-radius-lg)]'
  const chipRadiusClass = tpl.corner === 'sharp' ? 'rounded-[var(--card-radius-md)]' : 'rounded-[var(--card-radius-full)]'

  return (
    <main
      className="min-h-screen text-[var(--card-ink)]"
      style={{
        ...vars,
        background: tpl.container === 'phone'
          ? `radial-gradient(640px 420px at 50% -120px, ${accent}30, transparent 70%), var(--card-bg)`
          : 'var(--card-bg)',
      }}
    >
      {/* On desktop, the phone-card template sits inside a wider stage with
          ambient context instead of floating alone in a narrow column;
          the wide template fills the viewport as its own layout. */}
      <div
        className={
          isWide
            ? 'mx-auto max-w-3xl px-6 pb-24 pt-16 lg:px-10'
            : 'mx-auto max-w-md px-5 pb-24 pt-10 lg:max-w-lg lg:py-16'
        }
      >
        <div className={isWide ? '' : 'lg:rounded-[28px] lg:border lg:border-[var(--card-border-soft)] lg:bg-[var(--card-surface-soft)] lg:p-8 lg:shadow-2xl'}>
        {/* identity — name huge, face first (above the fold: load animation, not scroll) */}
        <div className="card-reveal">
          <div className={`flex items-center gap-4 ${isWide ? 'flex-col text-center sm:flex-row sm:text-left' : ''}`}>
            <div className="relative shrink-0">
              {tpl.motion === 'full' && (
                <span
                  aria-hidden
                  className="glow-breathe absolute inset-0 rounded-full blur-xl"
                  style={{ background: accent }}
                />
              )}
              {avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatar}
                  alt={p.full_name}
                  className={`relative object-cover ${isWide ? 'h-[104px] w-[104px]' : 'h-[88px] w-[88px]'} rounded-full border-[3px]`}
                  style={{ borderColor: accent }}
                />
              ) : (
                <div
                  className={`relative flex items-center justify-center rounded-full border-[3px] font-black text-[var(--card-accent-ink)] ${isWide ? 'h-[104px] w-[104px] text-[40px]' : 'h-[88px] w-[88px] text-[34px]'}`}
                  style={{
                    borderColor: accent,
                    background: isWide ? accent : `radial-gradient(circle at 30% 25%, #e8cf9a, #b5883f 70%)`,
                  }}
                >
                  {initial}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <h1
                className={`leading-[1.05] tracking-[var(--card-heading-tracking)] ${isWide ? 'text-[40px]' : 'text-[32px]'}`}
                style={{
                  fontFamily: isDisplay ? 'Georgia, "Times New Roman", serif' : 'inherit',
                  fontWeight: isDisplay ? 600 : Number(tokens['--card-heading-weight']),
                }}
              >
                {p.full_name}
              </h1>
              <p className="mt-1 text-[13px] font-bold" style={{ color: accent }}>{p.title}</p>
            </div>
          </div>
          <div className={isWide ? 'flex flex-col items-center sm:items-start' : ''}>
            {(p.availability_note || p.availability_status !== 'away') && (
              <span
                className={`mt-3 inline-flex items-center gap-1.5 border px-2.5 py-[3px] text-[11px] ${chipRadiusClass}`}
                style={{ borderColor: status.border, background: status.bg }}
              >
                <span className="h-[7px] w-[7px] rounded-full" style={{ background: status.dot }} />
                {p.availability_note || (p.availability_status === 'available' ? 'Available' : p.availability_status)}
              </span>
            )}
            {p.bio && (
              <p className={`mt-3 text-[13.5px] leading-relaxed text-[var(--card-muted)] ${isWide ? 'max-w-md text-center sm:text-left' : ''}`}>
                {p.bio}
              </p>
            )}
          </div>
        </div>

        {/* voice intro — the flagship personal feature */}
        {p.voice_intro_url && (
          <div className="card-reveal mt-5" style={{ animationDelay: '120ms' }}>
            <VoicePlayer src={mediaUrl(p.voice_intro_url)} label="Hear from me" accent={accent} radiusClass={cardRadiusClass} />
          </div>
        )}

        {/* services — the one pricing schema; no fixed price = "let's talk" */}
        {services.length > 0 && (
          <Reveal className="mt-7">
            <SectionLabel>Prices</SectionLabel>
            <div className={`border border-[var(--card-border-soft)] bg-[var(--card-surface-soft)] px-4 py-1 ${cardRadiusClass}`}>
              {services.map(s => (
                <div
                  key={s.id}
                  className="flex items-center justify-between border-b border-dashed border-[var(--card-border)] py-3 text-[14px] last:border-0"
                >
                  <div className="min-w-0 pe-3">
                    <b className="font-bold">{s.title}</b>
                    {s.price != null && (
                      <span className="ms-2 text-[11px] text-[var(--card-muted-2)]">{unitLabel(s.unit, 'en')}</span>
                    )}
                  </div>
                  {s.price == null ? (
                    <span
                      className={`shrink-0 border px-2.5 py-1 text-[11.5px] font-bold ${chipRadiusClass}`}
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
            <div className={isWide ? 'grid gap-4 sm:grid-cols-2' : 'space-y-4'}>
              {blocks.map(b => (
                <Reveal key={b.id}>
                  <Block block={b} accent={accent} radiusClass={cardRadiusClass} />
                </Reveal>
              ))}
            </div>
          </div>
        )}

        {/* areas served */}
        {p.areas_served.length > 0 && (
          <Reveal className="mt-6">
            <div className={`flex flex-wrap gap-1.5 ${isWide ? 'justify-center sm:justify-start' : ''}`}>
              {p.areas_served.map(a => (
                <span key={a} className={`border border-[var(--card-border)] px-2.5 py-1 text-[11px] text-[var(--card-muted)] ${chipRadiusClass}`}>{a}</span>
              ))}
            </div>
          </Reveal>
        )}

        {/* CTAs */}
        <Reveal className="mt-7">
          <div id="quote-cta" className={isWide ? 'mx-auto max-w-sm space-y-2' : 'space-y-2'}>
            <QuoteForm
              handle={p.handle}
              services={services}
              accent={accent}
              avatarUrl={avatar}
              firstName={firstName}
              replyHours={p.reply_hours}
              corner={tpl.corner}
            />
            <div className="flex gap-2">
              <a
                href={`/api/vcard/${p.handle}`}
                className={`flex-1 border-[1.5px] border-[var(--card-border)] py-2.5 text-center text-[12.5px] font-bold transition-colors hover:border-[var(--card-muted)] ${tpl.corner === 'sharp' ? 'rounded-[var(--card-radius-md)]' : 'rounded-[13px]'}`}
              >
                📇 Save contact
              </a>
              {wa && (
                <a
                  href={wa}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex-1 border-[1.5px] border-[var(--card-border)] py-2.5 text-center text-[12.5px] font-bold transition-colors hover:border-[var(--card-muted)] ${tpl.corner === 'sharp' ? 'rounded-[var(--card-radius-md)]' : 'rounded-[13px]'}`}
                >
                  💬 WhatsApp
                </a>
              )}
            </div>
          </div>
          {p.reply_hours ? (
            <p className="mt-3 text-center text-[11px] text-[var(--card-muted)]">
              Usually replies within {p.reply_hours}h
            </p>
          ) : null}
        </Reveal>
        </div>
      </div>

      <StickyQuoteBar accent={accent} name={firstName} corner={tpl.corner} />
    </main>
  )
}
