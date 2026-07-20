import { mediaUrl } from '@/lib/media'
import { formatPrice, unitLabel, type PublicPage } from '@/lib/public-page'
import { Block } from './blocks'
import { QuoteForm } from './QuoteForm'
import { VoicePlayer } from './VoicePlayer'

const STATUS_STYLES: Record<string, { dot: string; text: string; border: string; bg: string }> = {
  available: { dot: '#3ddc84', text: '#3ddc84', border: 'rgba(61,220,132,.35)', bg: 'rgba(61,220,132,.1)' },
  busy: { dot: '#eda100', text: '#eda100', border: 'rgba(237,161,0,.35)', bg: 'rgba(237,161,0,.1)' },
  away: { dot: '#9aa0ae', text: '#9aa0ae', border: 'rgba(154,160,174,.35)', bg: 'rgba(154,160,174,.1)' },
}

export function PublicCard({ page }: { page: PublicPage }) {
  const { profile: p, services, blocks } = page
  const accent = p.accent_color ?? '#c9a45c'
  const status = STATUS_STYLES[p.availability_status] ?? STATUS_STYLES.available
  const avatar = mediaUrl(p.avatar_url)
  const initial = (p.full_name || p.handle).charAt(0).toUpperCase()
  const wa = p.whatsapp_number ? `https://wa.me/${p.whatsapp_number.replace(/[^\d]/g, '')}` : null

  return (
    <main className="min-h-screen bg-[#0e0f13] text-[#f4f2ec]">
      <div className="mx-auto max-w-md px-5 pb-8 pt-8">
        {/* identity */}
        <div className="flex items-center gap-3.5">
          {avatar ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatar}
              alt={p.full_name}
              className="h-[74px] w-[74px] rounded-full border-[3px] object-cover"
              style={{ borderColor: accent }}
            />
          ) : (
            <div
              className="flex h-[74px] w-[74px] items-center justify-center rounded-full border-[3px] text-3xl font-black text-[#141414]"
              style={{ borderColor: accent, background: `radial-gradient(circle at 30% 25%, #e8cf9a, #b5883f 70%)` }}
            >
              {initial}
            </div>
          )}
          <div>
            <h1 className="text-[22px] font-black leading-tight">{p.full_name}</h1>
            <p className="mt-0.5 text-[13px] font-bold" style={{ color: accent }}>{p.title}</p>
            {(p.availability_note || p.availability_status !== 'away') && (
              <span
                className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border px-2.5 py-[3px] text-[11px]"
                style={{ color: status.text, borderColor: status.border, background: status.bg }}
              >
                <span className="h-[7px] w-[7px] rounded-full" style={{ background: status.dot }} />
                {p.availability_note || (p.availability_status === 'available' ? 'Available' : p.availability_status)}
              </span>
            )}
          </div>
        </div>

        {/* voice intro — the flagship personal feature */}
        <div className="mt-4">
          <VoicePlayer src={mediaUrl(p.voice_intro_url)} label="Hear from me" />
        </div>

        {/* services — the one pricing schema */}
        {services.length > 0 && (
          <div className="mt-3">
            {services.map(s => (
              <div key={s.id} className="flex items-center justify-between border-b border-dashed border-[#262a35] px-1 py-[11px] text-[14px]">
                <div>
                  <b className="font-bold">{s.title}</b>
                  <span className="ms-2 text-[11px] text-[#6b7284]">{unitLabel(s.unit, 'en')}</span>
                </div>
                <span className="font-black" style={{ color: accent }}>{formatPrice(s)}</span>
              </div>
            ))}
          </div>
        )}

        {/* portfolio blocks */}
        <div className="mt-4 space-y-3.5">
          {blocks.map(b => <Block key={b.id} block={b} />)}
        </div>

        {/* areas served */}
        {p.areas_served.length > 0 && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {p.areas_served.map(a => (
              <span key={a} className="rounded-full border border-[#2c313d] px-2.5 py-1 text-[11px] text-[#9aa0ae]">{a}</span>
            ))}
          </div>
        )}

        {/* CTAs */}
        <div className="mt-5 space-y-2">
          <QuoteForm handle={p.handle} services={services} accent={accent} />
          <div className="flex gap-2">
            <a
              href={`/api/vcard/${p.handle}`}
              className="flex-1 rounded-[13px] border-[1.5px] border-[#2c313d] py-2.5 text-center text-[12.5px] font-bold"
            >
              📇 Save contact
            </a>
            {wa && (
              <a
                href={wa}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 rounded-[13px] border-[1.5px] border-[#2c313d] py-2.5 text-center text-[12.5px] font-bold"
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
      </div>
    </main>
  )
}
