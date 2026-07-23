'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Request {
  id: string
  client_name: string
  client_phone: string
  message: string
  status: 'new' | 'seen' | 'replied'
  service_id: string | null
  created_at: string
  services: { title: string } | { title: string }[] | null
}

function one<T>(v: T | T[] | null): T | null {
  return Array.isArray(v) ? v[0] ?? null : v
}

const STATUS_STYLE: Record<string, string> = {
  new: 'bg-dash-accent/12 text-dash-accent',
  seen: 'bg-dash-info/12 text-dash-info',
  replied: 'bg-dash-success/12 text-dash-success',
}

export function InboxView({ requests }: { requests: Request[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [busy, setBusy] = useState<string | null>(null)

  const setStatus = async (id: string, status: string) => {
    await supabase.from('quote_requests').update({ status }).eq('id', id)
    router.refresh()
  }

  // Turn a request into a quote: mark it replied, then land in the new-quote
  // form pre-filled with the client's name/phone/service/message.
  const turnIntoQuote = async (r: Request) => {
    setBusy(r.id)
    await supabase.from('quote_requests').update({ status: 'replied' }).eq('id', r.id)
    const svc = one(r.services)
    const params = new URLSearchParams({
      name: r.client_name,
      phone: r.client_phone,
      note: r.message,
    })
    if (svc?.title) params.set('service', svc.title)
    router.push(`/dashboard/quotes/new?${params.toString()}`)
  }

  const waLink = (phone: string, name: string) =>
    phone ? `https://wa.me/${phone.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hi ${name.split(' ')[0] || ''}! Thanks for reaching out —`)}` : null

  if (!requests.length) {
    return (
      <div className="mt-6 rounded-xl border border-dashed border-dash-border p-8 text-center">
        <p className="text-sm text-dash-muted">No requests yet.</p>
        <p className="mt-1 text-[13px] text-dash-muted">
          When someone taps &ldquo;Request a quote&rdquo; on your page, they&apos;ll show up here.
        </p>
      </div>
    )
  }

  return (
    <div className="mt-5 space-y-3">
      {requests.map(r => {
        const svc = one(r.services)
        const wa = waLink(r.client_phone, r.client_name)
        return (
          <div key={r.id} className="rounded-xl border border-dash-border bg-dash-surface p-4">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-dash-ink">{r.client_name}</p>
                  <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${STATUS_STYLE[r.status] ?? ''}`}>{r.status}</span>
                </div>
                {svc?.title && <p className="mt-0.5 text-[13px] font-medium text-dash-ink">Wants: {svc.title}</p>}
                {r.client_phone && <p className="mt-0.5 text-[12px] text-dash-muted">{r.client_phone}</p>}
                <p className="mt-0.5 text-[11px] text-dash-muted">
                  {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                </p>
              </div>
            </div>

            {r.message && (
              <p className="mt-3 rounded-lg bg-dash-bg px-3 py-2 text-[13.5px] leading-relaxed text-dash-ink">{r.message}</p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2">
              <button
                onClick={() => turnIntoQuote(r)}
                disabled={busy === r.id}
                className="rounded-lg bg-dash-accent px-3 py-1.5 text-[13px] font-bold text-dash-accent-ink disabled:opacity-60"
              >
                {busy === r.id ? 'Opening…' : 'Turn into a quote →'}
              </button>
              {wa && (
                <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-dash-border px-3 py-1.5 text-[13px] font-medium text-dash-muted hover:text-dash-ink">
                  💬 Reply on WhatsApp
                </a>
              )}
              {r.status === 'new' && (
                <button onClick={() => setStatus(r.id, 'seen')} className="text-[12px] text-dash-muted hover:text-dash-ink">
                  Mark seen
                </button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
