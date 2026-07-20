'use client'

import { useState } from 'react'
import type { PublicService } from '@/lib/public-page'

interface Props {
  handle: string
  services: PublicService[]
  accent: string
}

export function QuoteForm({ handle, services, accent }: Props) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [serviceId, setServiceId] = useState('')
  const [message, setMessage] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setState('sending')
    try {
      const res = await fetch('/api/quote', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ handle, name, phone, message, serviceId: serviceId || null }),
      })
      const json = await res.json()
      setState(json.ok ? 'sent' : 'error')
    } catch {
      setState('error')
    }
  }

  if (state === 'sent') {
    return (
      <div className="rounded-2xl border border-[#1b3a2b] bg-[#0d1f17] px-4 py-4 text-center">
        <p className="text-[14px] font-bold text-[#3ddc84]">Request sent ✓</p>
        <p className="mt-1 text-[12.5px] text-[#9aa0ae]">You&apos;ll hear back on WhatsApp.</p>
      </div>
    )
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="block w-full rounded-2xl py-[15px] text-center text-base font-black text-[#141414]"
        style={{ background: accent }}
      >
        Request a quote
      </button>
    )
  }

  return (
    <form onSubmit={submit} className="space-y-2.5 rounded-2xl border border-[#262a35] bg-[#16181f] p-4">
      <input
        required
        minLength={2}
        maxLength={120}
        value={name}
        onChange={e => setName(e.target.value)}
        placeholder="Your name"
        className="w-full rounded-xl border border-[#2c313d] bg-transparent px-3.5 py-2.5 text-[14px] outline-none placeholder:text-[#6b7284] focus:border-[#c9a45c]"
      />
      <input
        value={phone}
        onChange={e => setPhone(e.target.value)}
        maxLength={30}
        placeholder="WhatsApp number (+961 …)"
        inputMode="tel"
        className="w-full rounded-xl border border-[#2c313d] bg-transparent px-3.5 py-2.5 text-[14px] outline-none placeholder:text-[#6b7284] focus:border-[#c9a45c]"
      />
      {services.length > 0 && (
        <select
          value={serviceId}
          onChange={e => setServiceId(e.target.value)}
          className="w-full rounded-xl border border-[#2c313d] bg-[#16181f] px-3.5 py-2.5 text-[14px] text-[#f4f2ec] outline-none focus:border-[#c9a45c]"
        >
          <option value="">What do you need?</option>
          {services.map(s => (
            <option key={s.id} value={s.id}>{s.title}</option>
          ))}
        </select>
      )}
      <textarea
        value={message}
        onChange={e => setMessage(e.target.value)}
        maxLength={2000}
        rows={3}
        placeholder="Tell me about it — date, place, what you have in mind…"
        className="w-full resize-none rounded-xl border border-[#2c313d] bg-transparent px-3.5 py-2.5 text-[14px] outline-none placeholder:text-[#6b7284] focus:border-[#c9a45c]"
      />
      {state === 'error' && (
        <p className="text-[12px] text-[#e34948]">Couldn&apos;t send — try again in a bit, or just WhatsApp me below.</p>
      )}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="flex-1 rounded-xl border-[1.5px] border-[#2c313d] py-2.5 text-[12.5px] font-bold text-[#f4f2ec]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={state === 'sending'}
          className="flex-[2] rounded-xl py-2.5 text-[13px] font-black text-[#141414] disabled:opacity-60"
          style={{ background: accent }}
        >
          {state === 'sending' ? 'Sending…' : 'Send request'}
        </button>
      </div>
    </form>
  )
}
