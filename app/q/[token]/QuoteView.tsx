'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { unitLabel } from '@/lib/pricing-format'

interface LineItem {
  title: string
  qty: number
  unit_price: number
  unit: 'project' | 'session' | 'hour' | 'event' | 'day' | 'month'
}

interface TokenDoc {
  document: {
    id: string
    doc_number: number
    status: string
    client_name: string
    language: 'en' | 'ar'
    currency: 'USD' | 'LBP'
    line_items: LineItem[]
    total: number
    notes: string
    approved_at: string | null
    approved_via: string | null
  }
  profile: {
    handle: string
    full_name: string
    accent_color: string | null
    whatsapp_number: string | null
  }
}

export function QuoteView({ data, token }: { data: TokenDoc; token: string }) {
  const { document: doc, profile } = data
  const accent = profile.accent_color ?? '#c9a45c'
  const isRtl = doc.language === 'ar'
  const [status, setStatus] = useState(doc.status)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  const approve = async () => {
    setBusy(true)
    setError(null)
    const { data: ok, error: rpcError } = await supabase.rpc('approve_document_by_token', { p_token: token })
    setBusy(false)
    if (ok) setStatus('approved')
    else setError(rpcError?.message ?? "Couldn't approve — try again shortly.")
  }

  const money = (n: number) => (doc.currency === 'USD' ? '$' : 'LBP ') + n.toLocaleString('en-US')

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#0e0f13] text-[#f4f2ec]">
      <div className="mx-auto max-w-md px-5 py-8">
        <p className="text-xs text-[#9aa0ae]">Quote from</p>
        <h1 className="text-xl font-black">{profile.full_name}</h1>

        <div className="mt-5 rounded-2xl border border-[#262a35] bg-[#16181f] p-4">
          {doc.line_items.map((item, i) => (
            <div key={i} className="flex justify-between border-b border-dashed border-[#262a35] py-2.5 text-[14px] last:border-0">
              <div>
                <div>{item.title}</div>
                <div className="text-[11px] text-[#6b7284]">
                  {item.qty} × {unitLabel(item.unit, doc.language)}
                </div>
              </div>
              <span className="font-black" style={{ color: accent }}>{money(item.qty * item.unit_price)}</span>
            </div>
          ))}
          <div className="mt-2.5 flex justify-between text-[15px] font-black">
            <span>Total</span>
            <span style={{ color: accent }}>{money(doc.total)}</span>
          </div>
        </div>

        {error && <p className="mt-3 text-sm text-[#e34948]">{error}</p>}

        <div className="mt-5">
          {status === 'approved' ? (
            <div className="rounded-2xl border border-[#1b3a2b] bg-[#0d1f17] px-4 py-4 text-center">
              <p className="text-[14px] font-bold text-[#3ddc84]">Approved ✓</p>
              {doc.approved_via === 'whatsapp_manual' && (
                <p className="mt-1 text-[12px] text-[#9aa0ae]">Confirmed via WhatsApp</p>
              )}
            </div>
          ) : status === 'sent' ? (
            <button
              onClick={approve}
              disabled={busy}
              className="block w-full rounded-2xl py-[15px] text-center text-base font-black text-[#141414] disabled:opacity-60"
              style={{ background: accent }}
            >
              {busy ? 'Approving…' : 'Approve this quote'}
            </button>
          ) : (
            <p className="text-center text-sm text-[#9aa0ae]">This quote is {status}.</p>
          )}
        </div>
      </div>
    </main>
  )
}
