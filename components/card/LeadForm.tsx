'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { normalizeAccent } from '@/lib/card-templates'

// The multi-step "Typeform-level" contact form that replaces the boring quote
// button (founder). One question at a time → feels engaging, converts better,
// and captures a real LEAD (name/need/budget/message). On submit it saves via
// submit_lead (zero-login, red-line safe) then hands the client a one-tap wa.me
// to the freelancer. Every lead is platform-visible traction (founder sees all).
interface Step {
  key: 'name' | 'service' | 'budget' | 'message'
  q: string
  q_ar: string
  placeholder: string
  optional?: boolean
  options?: string[]
}

const STEPS: Step[] = [
  { key: 'name', q: "First, what's your name?", q_ar: 'شو اسمك؟', placeholder: 'Your name' },
  { key: 'service', q: 'What do you need?', q_ar: 'شو بتحتاج؟', placeholder: 'e.g. a wedding shoot, a website…' },
  { key: 'budget', q: 'Rough budget? (optional)', q_ar: 'الميزانية تقريباً؟ (اختياري)', placeholder: 'Skip if unsure', optional: true, options: ['< $200', '$200–500', '$500–1500', '$1500+', 'Not sure'] },
  { key: 'message', q: 'Anything else to add?', q_ar: 'شي كمان بدك تضيفو؟', placeholder: 'A few details…', optional: true },
]

export function LeadForm({
  handle,
  accent,
  whatsapp,
  freelancerName,
  isRtl = false,
}: {
  handle: string
  accent: string
  whatsapp?: string | null
  freelancerName?: string
  isRtl?: boolean
}) {
  const a6 = normalizeAccent(accent)
  const [i, setI] = useState(0)
  const [data, setData] = useState<Record<string, string>>({})
  const [busy, setBusy] = useState(false)
  const [done, setDone] = useState<{ waHref: string | null } | null>(null)
  const [contact, setContact] = useState('')

  const step = STEPS[i]
  const isLast = i === STEPS.length
  const val = data[step?.key] ?? ''

  const next = () => setI(n => n + 1)
  const back = () => setI(n => Math.max(0, n - 1))
  const canNext = step?.optional || (step && (data[step.key] ?? '').trim().length > 0)

  const submit = async () => {
    setBusy(true)
    const supabase = createClient()
    await supabase.rpc('submit_lead', {
      p_handle: handle,
      p_name: data.name ?? '',
      p_contact: contact,
      p_service: data.service ?? '',
      p_budget: data.budget ?? '',
      p_message: data.message ?? '',
    })
    // One-tap wa.me to the freelancer with the lead prefilled.
    let waHref: string | null = null
    if (whatsapp) {
      const num = whatsapp.replace(/[^\d]/g, '')
      const msg = isRtl
        ? `مرحبا${freelancerName ? ' ' + freelancerName : ''}، أنا ${data.name || ''}. بحتاج: ${data.service || ''}. ${data.budget ? 'الميزانية: ' + data.budget + '. ' : ''}${data.message || ''}`
        : `Hi${freelancerName ? ' ' + freelancerName : ''}, I'm ${data.name || ''}. I need: ${data.service || ''}. ${data.budget ? 'Budget: ' + data.budget + '. ' : ''}${data.message || ''}`
      waHref = `https://wa.me/${num}?text=${encodeURIComponent(msg)}`
    }
    setBusy(false)
    setDone({ waHref })
  }

  if (done) {
    return (
      <div className="mx-auto max-w-md text-center" dir={isRtl ? 'rtl' : 'ltr'}>
        <div className="mb-3 text-4xl">🎉</div>
        <h3 className="text-[20px] font-black text-white">{isRtl ? 'وصلت رسالتك!' : 'Sent!'}</h3>
        <p className="mt-2 text-[14px] text-white/70">
          {isRtl ? 'رح يتواصل معك قريباً. لتسريع الأمور، ابعتلو واتساب:' : `${freelancerName || 'They'}'ll be in touch. To speed it up, message on WhatsApp:`}
        </p>
        {done.waHref && (
          <a href={done.waHref} target="_blank" rel="noopener noreferrer" className="mt-5 inline-flex items-center gap-2 rounded-full px-6 py-3 text-[15px] font-bold" style={{ background: a6, color: 'var(--card-accent-ink)' }}>
            💬 {isRtl ? 'افتح واتساب' : 'Open WhatsApp'}
          </a>
        )}
        {/* Keep the WorkWith relationship with the CLIENT alive — so when we add
            more later there's no new friction (founder). Subtle, "we elevate
            presence" voice, not a hard sell. */}
        <p className="mt-6 border-t border-white/10 pt-4 text-[12px] text-white/45">
          {isRtl ? 'هالصفحة معمولة بـ ' : 'This page runs on '}
          <a href="/" target="_blank" rel="noopener noreferrer" className="font-bold text-white/70 underline">WorkWith</a>
          {isRtl ? ' — منساعد المستقلين يطلّعوا بأحسن صورة.' : ' — we help freelancers look their best online.'}
        </p>
      </div>
    )
  }

  // Final review/contact step.
  if (isLast) {
    return (
      <div className="mx-auto max-w-md" dir={isRtl ? 'rtl' : 'ltr'}>
        <p className="mb-2 text-[13px] font-bold uppercase tracking-wide" style={{ color: a6 }}>{isRtl ? 'أخيراً' : 'Last thing'}</p>
        <h3 className="mb-4 text-[22px] font-black text-white">{isRtl ? 'كيف نتواصل معك؟' : 'How can they reach you?'}</h3>
        <input
          autoFocus
          value={contact}
          onChange={e => setContact(e.target.value)}
          placeholder={isRtl ? 'رقمك أو إيميلك' : 'Your phone or email'}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-[16px] text-white outline-none placeholder:text-white/40 focus:border-white/50"
        />
        <div className="mt-5 flex items-center gap-3">
          <button onClick={back} className="text-[14px] font-semibold text-white/60">← {isRtl ? 'رجوع' : 'Back'}</button>
          <button
            onClick={submit}
            disabled={busy || contact.trim().length < 3}
            className="ml-auto rounded-full px-7 py-3 text-[15px] font-black disabled:opacity-40"
            style={{ background: a6, color: 'var(--card-accent-ink)' }}
          >
            {busy ? '…' : isRtl ? 'إرسال' : 'Send it →'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-md" dir={isRtl ? 'rtl' : 'ltr'}>
      {/* progress */}
      <div className="mb-5 flex gap-1.5">
        {STEPS.map((_, s) => (
          <span key={s} className="h-1 flex-1 rounded-full transition-colors" style={{ background: s <= i ? a6 : 'rgba(255,255,255,0.15)' }} />
        ))}
      </div>
      <p className="mb-2 text-[13px] font-bold" style={{ color: a6 }}>{i + 1} / {STEPS.length}</p>
      <h3 className="mb-4 text-[22px] font-black leading-tight text-white">{isRtl ? step.q_ar : step.q}</h3>

      {step.options ? (
        <div className="flex flex-wrap gap-2">
          {step.options.map(opt => (
            <button
              key={opt}
              onClick={() => { setData(d => ({ ...d, [step.key]: opt })); setTimeout(next, 120) }}
              className={`rounded-full border px-4 py-2 text-[14px] font-semibold transition ${val === opt ? 'text-white' : 'border-white/25 text-white/80 hover:border-white/50'}`}
              style={val === opt ? { background: a6, borderColor: a6, color: 'var(--card-accent-ink)' } : undefined}
            >
              {opt}
            </button>
          ))}
        </div>
      ) : (
        <input
          autoFocus
          value={val}
          onChange={e => setData(d => ({ ...d, [step.key]: e.target.value }))}
          onKeyDown={e => { if (e.key === 'Enter' && canNext) next() }}
          placeholder={step.placeholder}
          className="w-full rounded-xl border border-white/20 bg-white/10 px-4 py-3.5 text-[16px] text-white outline-none placeholder:text-white/40 focus:border-white/50"
        />
      )}

      <div className="mt-5 flex items-center gap-3">
        {i > 0 && <button onClick={back} className="text-[14px] font-semibold text-white/60">← {isRtl ? 'رجوع' : 'Back'}</button>}
        <button
          onClick={next}
          disabled={!canNext}
          className="ml-auto rounded-full px-7 py-3 text-[15px] font-black disabled:opacity-40"
          style={{ background: a6, color: 'var(--card-accent-ink)' }}
        >
          {step.optional && !val ? (isRtl ? 'تخطي' : 'Skip') : isRtl ? 'التالي' : 'Next'} →
        </button>
      </div>
    </div>
  )
}
