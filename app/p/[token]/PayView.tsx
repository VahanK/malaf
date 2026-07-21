'use client'

import { useState } from 'react'
import QRCode from 'react-qr-code'

const KIND_FIELD: Record<string, string> = {
  whish: 'number', omt: 'reference', bob: 'number', cashunited: 'number',
  usdt: 'address', iban: 'iban', cash: '', custom: 'note',
}
const KIND_LABEL: Record<string, string> = {
  whish: 'Whish', omt: 'OMT', bob: 'BOB Finance', cashunited: 'CashUnited',
  usdt: 'USDT (TRC-20)', iban: 'Bank transfer', cash: 'Cash', custom: 'Other',
}

interface PaymentMethod {
  kind: string
  label: string
  label_ar: string
  details: Record<string, string>
  deep_link_template: string | null
  fresh_usd: boolean
}

interface PayData {
  document: {
    id: string
    doc_number: number
    status: string
    client_name: string
    language: 'en' | 'ar'
    currency: 'USD' | 'LBP'
    total: number
    usdt_reference: string | null
  }
  profile: { handle: string; full_name: string; accent_color: string | null }
  payment_methods: PaymentMethod[]
}

export function PayView({ data, token }: { data: PayData; token: string }) {
  const { document: doc, profile, payment_methods } = data
  const accent = profile.accent_color ?? '#c9a45c'
  const isRtl = doc.language === 'ar'
  const [claimed, setClaimed] = useState(doc.status === 'paid')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [file, setFile] = useState<File | null>(null)
  const [note, setNote] = useState('')

  const money = (n: number) => (doc.currency === 'USD' ? '$' : 'LBP ') + n.toLocaleString('en-US')

  const submitClaim = async () => {
    setBusy(true)
    setError(null)
    const fd = new FormData()
    if (file) fd.append('file', file)
    fd.append('note', note)
    const res = await fetch(`/api/pay/${token}/proof`, { method: 'POST', body: fd })
    const json = await res.json()
    setBusy(false)
    if (json.ok) setClaimed(true)
    else setError(json.error ?? "Couldn't submit — try again shortly.")
  }

  if (doc.status === 'paid' || claimed) {
    return (
      <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#0e0f13] text-[#f4f2ec]">
        <div className="mx-auto max-w-md px-5 py-16 text-center">
          <div className="rounded-2xl border border-[#1b3a2b] bg-[#0d1f17] px-4 py-6">
            <p className="text-[15px] font-bold text-[#3ddc84]">
              {doc.status === 'paid' ? 'Paid — thank you!' : "Got it — we'll confirm shortly."}
            </p>
            {doc.status !== 'paid' && (
              <p className="mt-1 text-[12px] text-[#9aa0ae]">{profile.full_name} will confirm once they see it.</p>
            )}
          </div>
        </div>
      </main>
    )
  }

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#0e0f13] text-[#f4f2ec]">
      <div className="mx-auto max-w-md px-5 py-8">
        <p className="text-xs text-[#9aa0ae]">Pay {profile.full_name}</p>
        <h1 className="text-3xl font-black" style={{ color: accent }}>{money(doc.total)}</h1>

        <div className="mt-5 space-y-3">
          {payment_methods.map((m, i) => {
            const field = KIND_FIELD[m.kind]
            const value = field ? m.details[field] : ''
            return (
              <div key={i} className="rounded-2xl border border-[#262a35] bg-[#16181f] p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13px] font-bold">{KIND_LABEL[m.kind] ?? m.label}</span>
                  {m.fresh_usd && <span className="text-[10px] text-[#9aa0ae]">Fresh USD</span>}
                </div>
                {value && (
                  <div className="mt-2 flex items-center justify-between rounded-xl bg-[#0e0f13] px-3 py-2">
                    <span className="text-[13px] text-[#f4f2ec]">{value}</span>
                    <CopyButton value={value} />
                  </div>
                )}
                {m.kind === 'usdt' && value && (
                  <div className="mt-3 flex justify-center rounded-xl bg-white p-3">
                    <QRCode value={value} size={140} />
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="mt-6 rounded-2xl border border-[#262a35] bg-[#16181f] p-4">
          <p className="text-[13px] font-bold">I paid</p>
          <p className="mt-1 text-[11px] text-[#9aa0ae]">Optional — attach a screenshot as proof.</p>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={e => setFile(e.target.files?.[0] ?? null)}
            className="mt-2 block w-full text-[12px] text-[#9aa0ae]"
          />
          <textarea
            rows={2}
            placeholder="Note (optional)"
            value={note}
            onChange={e => setNote(e.target.value)}
            className="mt-2 w-full resize-none rounded-lg border border-[#2c313d] bg-transparent px-3 py-2 text-[13px] outline-none placeholder:text-[#6b7284]"
          />
          {error && <p className="mt-2 text-[12px] text-[#e34948]">{error}</p>}
          <button
            onClick={submitClaim}
            disabled={busy}
            className="mt-3 w-full rounded-xl py-3 text-[14px] font-black text-[#141414] disabled:opacity-60"
            style={{ background: accent }}
          >
            {busy ? 'Sending…' : "I've paid"}
          </button>
        </div>
      </div>
    </main>
  )
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      onClick={() => {
        navigator.clipboard.writeText(value)
        setCopied(true)
        setTimeout(() => setCopied(false), 1500)
      }}
      className="text-[11px] font-bold text-[#c9a45c]"
    >
      {copied ? 'Copied' : 'Copy'}
    </button>
  )
}
