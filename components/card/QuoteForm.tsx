'use client'

import { useEffect, useRef, useState } from 'react'
import { formatPrice, type PricedItem } from '@/lib/pricing-format'
import type { PublicService } from '@/lib/public-page'

interface Props {
  handle: string
  services: PublicService[]
  accent: string
  avatarUrl: string | null
  firstName: string
  replyHours: number | null
  corner: 'soft' | 'sharp'
}

type Step = 'service' | 'details' | 'contact' | 'sending' | 'sent'

// The inquiry is a conversation, not a contact form — same thesis as the
// whole product: WhatsApp is the culture, the app is the artifact. The
// client "chats" with the freelancer's card; the payload still posts to the
// same /api/quote endpoint underneath.
export function QuoteForm({ handle, services, accent, avatarUrl, firstName, replyHours, corner }: Props) {
  const btnRadius = corner === 'sharp' ? 'rounded-[var(--card-radius-md)]' : 'rounded-2xl'
  const outerRadius = corner === 'sharp' ? 'rounded-[var(--card-radius-md)]' : 'rounded-2xl'
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState<Step>('service')
  const [serviceId, setServiceId] = useState('')
  const [serviceLabel, setServiceLabel] = useState('')
  const [message, setMessage] = useState('')
  const [messageSent, setMessageSent] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [error, setError] = useState(false)
  const endRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (open) endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [step, open])

  const pickService = (id: string, label: string) => {
    setServiceId(id)
    setServiceLabel(label)
    setStep('details')
  }

  const confirmDetails = () => {
    setMessageSent(message.trim())
    setStep('contact')
  }

  const submit = async () => {
    if (name.trim().length < 2) return
    setStep('sending')
    setError(false)
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          handle,
          name: name.trim(),
          phone: phone.trim(),
          message: [serviceLabel && `[${serviceLabel}]`, messageSent].filter(Boolean).join(' '),
          serviceId: serviceId || null,
        }),
      })
      const json = await res.json()
      if (json.ok) setStep('sent')
      else { setStep('contact'); setError(true) }
    } catch {
      setStep('contact')
      setError(true)
    }
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className={`block w-full py-[15px] text-center text-base font-black text-[var(--card-accent-ink)] transition-transform active:scale-[0.98] ${btnRadius}`}
        style={{ background: accent }}
      >
        Request a quote
      </button>
    )
  }

  const stepIndex = { service: 0, details: 1, contact: 2, sending: 2, sent: 3 }[step]

  return (
    <div className={`overflow-hidden bg-[#0b141a] ${outerRadius}`}>
      {/* chat header */}
      <div className="flex items-center gap-2.5 border-b border-white/5 bg-[#16181f] px-3.5 py-2.5">
        {avatarUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={avatarUrl} alt="" className="h-8 w-8 rounded-full object-cover" />
        ) : (
          <div
            className="flex h-8 w-8 items-center justify-center rounded-full text-[13px] font-black text-[#141414]"
            style={{ background: accent }}
          >
            {firstName.charAt(0).toUpperCase()}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-[13px] font-bold leading-tight">{firstName}</p>
          <p className="text-[10.5px] text-[#8696a0]">
            {replyHours ? `usually replies within ${replyHours}h` : 'replies on WhatsApp'}
          </p>
        </div>
        <button
          onClick={() => setOpen(false)}
          aria-label="Close"
          className="px-1.5 text-[#8696a0]"
        >
          ✕
        </button>
      </div>

      <div className="max-h-[420px] space-y-3 overflow-y-auto px-3.5 py-4">
        {/* beat 1 — what do you need */}
        <IncomingBubble>
          مرحبا 👋 What can I do for you?
        </IncomingBubble>

        {stepIndex === 0 && (
          <div className="chat-pop flex flex-wrap justify-end gap-1.5 ps-8">
            {services.map(s => (
              <button
                key={s.id}
                onClick={() => pickService(s.id, s.title)}
                className="rounded-full border px-3 py-1.5 text-[12.5px] font-semibold transition-transform active:scale-95"
                style={{ borderColor: `${accent}80`, color: accent }}
              >
                {s.title}
                <span className="ms-1.5 opacity-70">
                  {s.price == null ? "let's talk" : formatPrice(s as PricedItem)}
                </span>
              </button>
            ))}
            <button
              onClick={() => pickService('', 'Something else')}
              className="rounded-full border border-[#2c313d] px-3 py-1.5 text-[12.5px] font-semibold text-[#9aa0ae] transition-transform active:scale-95"
            >
              Something else
            </button>
          </div>
        )}

        {stepIndex >= 1 && <OutgoingBubble accent={accent}>{serviceLabel}</OutgoingBubble>}

        {/* beat 2 — details */}
        {stepIndex >= 1 && (
          <IncomingBubble>
            Nice — tell me a bit more. The date, the place, what you have in mind…
          </IncomingBubble>
        )}

        {stepIndex === 1 && (
          <div className="chat-pop ps-8">
            <textarea
              autoFocus
              rows={3}
              maxLength={2000}
              value={message}
              onChange={e => setMessage(e.target.value)}
              placeholder="Type it like a WhatsApp message…"
              className="w-full resize-none rounded-xl border border-[#2c313d] bg-[#16181f] px-3.5 py-2.5 text-[14px] outline-none placeholder:text-[#6b7284]"
              style={{ caretColor: accent }}
            />
            <div className="mt-1.5 flex items-center justify-end gap-3">
              <button onClick={confirmDetails} className="text-[11.5px] text-[#8696a0]">
                skip
              </button>
              <button
                onClick={confirmDetails}
                className="rounded-full px-4 py-1.5 text-[12.5px] font-black text-[#141414] transition-transform active:scale-95"
                style={{ background: accent }}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {stepIndex >= 2 && messageSent && <OutgoingBubble accent={accent}>{messageSent}</OutgoingBubble>}

        {/* beat 3 — contact */}
        {stepIndex >= 2 && step !== 'sent' && (
          <IncomingBubble>
            Last thing — your name and WhatsApp number, so I can get back to you:
          </IncomingBubble>
        )}

        {(step === 'contact' || step === 'sending') && (
          <div className="chat-pop space-y-2 ps-8">
            <input
              autoFocus
              value={name}
              onChange={e => setName(e.target.value)}
              maxLength={120}
              placeholder="Your name"
              className="w-full rounded-xl border border-[#2c313d] bg-[#16181f] px-3.5 py-2.5 text-[14px] outline-none placeholder:text-[#6b7284]"
            />
            <input
              value={phone}
              onChange={e => setPhone(e.target.value)}
              maxLength={30}
              inputMode="tel"
              placeholder="WhatsApp number (+961 …)"
              className="w-full rounded-xl border border-[#2c313d] bg-[#16181f] px-3.5 py-2.5 text-[14px] outline-none placeholder:text-[#6b7284]"
            />
            {error && (
              <p className="text-[12px] text-[#e34948]">
                Couldn&apos;t send — try again, or just WhatsApp me directly below.
              </p>
            )}
            <button
              onClick={submit}
              disabled={step === 'sending' || name.trim().length < 2}
              className="w-full rounded-xl py-2.5 text-[13.5px] font-black text-[#141414] transition-transform active:scale-[0.98] disabled:opacity-50"
              style={{ background: accent }}
            >
              {step === 'sending' ? 'Sending…' : `Send to ${firstName}`}
            </button>
          </div>
        )}

        {/* beat 4 — sent */}
        {step === 'sent' && (
          <>
            <OutgoingBubble accent={accent}>
              {name} · {phone || 'no number given'}
            </OutgoingBubble>
            <IncomingBubble>
              وصلت ✓ &nbsp;You&apos;ll hear back on WhatsApp
              {replyHours ? ` — usually within ${replyHours}h` : ''}. 🙌
            </IncomingBubble>
          </>
        )}

        <div ref={endRef} />
      </div>
    </div>
  )
}

function IncomingBubble({ children }: { children: React.ReactNode }) {
  return (
    <div className="chat-pop max-w-[85%]">
      <div className="relative rounded-lg rounded-ss-none bg-[#202c33] px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,.35)]">
        <span
          aria-hidden
          className="absolute -start-[7px] top-0 h-0 w-0 border-t-[10px] border-e-[9px] border-t-[#202c33] border-e-transparent"
        />
        <p className="text-[13.5px] leading-relaxed text-[#e9edef]">{children}</p>
      </div>
    </div>
  )
}

function OutgoingBubble({ children, accent }: { children: React.ReactNode; accent: string }) {
  return (
    <div className="chat-pop ms-auto max-w-[85%]">
      <div className="relative rounded-lg rounded-se-none bg-[#005c4b] px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,.35)]">
        <span
          aria-hidden
          className="absolute -end-[7px] top-0 h-0 w-0 border-t-[10px] border-s-[9px] border-t-[#005c4b] border-s-transparent"
        />
        <p className="text-[13.5px] leading-relaxed text-[#e9edef]">{children}</p>
        <p className="mt-0.5 text-end text-[10px] leading-none" style={{ color: accent }}>✓</p>
      </div>
    </div>
  )
}
