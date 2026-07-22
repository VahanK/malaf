'use client'

import { useState } from 'react'
import Link from 'next/link'
import QRCode from 'react-qr-code'
import { FaWhatsapp } from 'react-icons/fa'
import { FOUNDER_WA } from '@/components/home/Nav'

interface SubData {
  payment: {
    id: string
    status: string
    amount_usd: number
    usdt_reference: string | null
    usdt_amount: number | null
  }
  profile: { handle: string; full_name: string }
  usdt_address: string
}

export function SubscribeView({ data, token }: { data: SubData; token: string }) {
  const { payment, profile, usdt_address } = data
  const [claimed, setClaimed] = useState(payment.status === 'paid')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [note, setNote] = useState('')
  const [copied, setCopied] = useState(false)

  const usdtAmount = payment.usdt_amount ?? payment.amount_usd
  const hasUsdt = !!usdt_address && usdt_address.startsWith('T')

  const copy = (text: string) => {
    navigator.clipboard?.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  const submitClaim = async () => {
    setBusy(true)
    setError(null)
    const fd = new FormData()
    fd.append('note', note)
    try {
      const res = await fetch(`/api/subscribe/${token}/claim`, { method: 'POST', body: fd })
      const json = await res.json()
      if (json.ok) setClaimed(true)
      else setError(json.error || 'Could not submit — try again shortly')
    } catch {
      setError('Network error — try again')
    }
    setBusy(false)
  }

  if (payment.status === 'paid' || claimed) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#f7f3ec] px-6 text-[#171310]">
        <div className="max-w-sm text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1f9254]/12 text-[28px]">✅</div>
          <h1 className="mt-4 font-serif text-[24px] font-semibold">
            {payment.status === 'paid' ? "You're subscribed." : 'Got it — checking your payment.'}
          </h1>
          <p className="mt-2 text-[15px] leading-relaxed text-[#5c574c]">
            {payment.status === 'paid'
              ? 'Your subscription is active. Head back to your dashboard and publish your page.'
              : "We'll confirm your payment shortly. USDT confirms automatically; other methods are confirmed by hand — you'll get a notification the moment it's active."}
          </p>
          <Link
            href="/dashboard/profile"
            className="mt-6 inline-block rounded-xl bg-[#e8623d] px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#d4512f]"
          >
            Back to dashboard
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-[#f7f3ec] px-6 py-14 text-[#171310]">
      <div className="mx-auto max-w-md">
        <Link href="/dashboard/profile" className="text-[13px] text-[#5c574c] hover:text-[#171310]">← Back</Link>

        <h1 className="mt-6 font-serif text-[28px] font-semibold leading-tight tracking-[-0.015em]">
          Publish your page — <span className="text-[#e8623d]">${payment.amount_usd}/year</span>
        </h1>
        <p className="mt-2 text-[15px] leading-relaxed text-[#5c574c]">
          Your page at <span className="font-medium text-[#171310]">work-withme.com/{profile.handle}</span>{' '}
          goes live the moment your payment clears. That&apos;s ${payment.amount_usd} for the year — about $2.40 a month.
        </p>

        {/* USDT — the auto-confirming path */}
        {hasUsdt && (
          <section className="mt-8 rounded-2xl border border-[#171310]/10 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-semibold">Pay with USDT (TRC-20)</h2>
              <span className="rounded-full bg-[#1f9254]/12 px-2 py-0.5 text-[11px] font-semibold text-[#1f9254]">
                Confirms automatically
              </span>
            </div>
            <p className="mt-1 text-[13px] text-[#5c574c]">
              Send <span className="font-bold text-[#171310]">exactly {usdtAmount.toFixed(2)} USDT</span> to the
              address below. The extra cents are how we match your payment — send the exact amount.
            </p>

            <div className="mt-4 flex justify-center rounded-xl bg-white p-4">
              <QRCode value={usdt_address} size={148} />
            </div>

            <button
              onClick={() => copy(usdt_address)}
              className="mt-4 flex w-full items-center justify-between gap-2 rounded-lg border border-[#171310]/10 bg-[#faf8f3] px-3 py-2.5 text-left"
            >
              <span className="truncate text-[12px] text-[#5c574c]">{usdt_address}</span>
              <span className="shrink-0 text-[12px] font-semibold text-[#e8623d]">{copied ? 'Copied' : 'Copy'}</span>
            </button>
            <p className="mt-2 text-center text-[13px]">
              Amount: <span className="font-bold">{usdtAmount.toFixed(2)} USDT</span>
              <span className="text-[#8a8477]"> (exactly)</span>
            </p>
          </section>
        )}

        {/* Other rails — manual, via WhatsApp to the founder */}
        <section className="mt-4 rounded-2xl border border-[#171310]/10 bg-white p-5 shadow-sm">
          <h2 className="text-[15px] font-semibold">Prefer Whish, bank, or cash?</h2>
          <p className="mt-1 text-[13px] leading-relaxed text-[#5c574c]">
            Message us and we&apos;ll arrange it and turn your page on by hand — usually within a few hours.
          </p>
          <a
            href={`${FOUNDER_WA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-[#25D366] py-3 text-[14px] font-bold text-white"
          >
            <FaWhatsapp className="text-[17px]" /> Arrange payment on WhatsApp
          </a>
        </section>

        {/* "I paid" — for the non-USDT rails, records a claim for founder confirm */}
        <section className="mt-4 rounded-2xl border border-dashed border-[#171310]/15 p-5">
          <p className="text-[13px] text-[#5c574c]">
            Already paid by Whish, bank, or cash? Let us know and we&apos;ll confirm it.
          </p>
          <input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Optional: how you paid (e.g. Whish, ref 1234)"
            className="mt-3 w-full rounded-lg border border-[#171310]/10 bg-white px-3 py-2.5 text-[14px] outline-none placeholder:text-[#8a8477] focus:border-[#e8623d]"
          />
          {error && <p className="mt-2 text-[13px] text-[#d1453b]">{error}</p>}
          <button
            onClick={submitClaim}
            disabled={busy}
            className="mt-3 w-full rounded-xl border border-[#171310]/15 bg-white py-2.5 text-[14px] font-semibold shadow-sm transition-colors hover:bg-[#faf8f3] disabled:opacity-60"
          >
            {busy ? 'Sending…' : "I paid — confirm my subscription"}
          </button>
        </section>

        <p className="mt-6 text-center text-[12px] text-[#8a8477]">
          Your money goes straight to WorkWith — no middleman, and we never take a cut of what you earn from clients.
        </p>
      </div>
    </main>
  )
}
