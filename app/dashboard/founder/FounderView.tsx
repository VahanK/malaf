'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Subscription {
  tier: string
  status: string
  amount_usd: number | null
  paid_via: string | null
  note: string
}

interface Freelancer {
  id: string
  handle: string
  full_name: string
  created_at: string
  subscriptions: Subscription | Subscription[] | null
}

interface FeatureRequest {
  id: string
  profile_id: string
  body: string
  status: string
  founder_note: string
  created_at: string
  profiles: { handle: string; full_name: string } | { handle: string; full_name: string }[] | null
}

const REQUEST_STATUSES = ['new', 'seen', 'planned', 'done', 'declined']

function one<T>(v: T | T[] | null): T | null {
  return Array.isArray(v) ? v[0] ?? null : v
}

export function FounderView({ freelancers, requests }: { freelancers: Freelancer[]; requests: FeatureRequest[] }) {
  const router = useRouter()
  const supabase = createClient()
  const [busyId, setBusyId] = useState<string | null>(null)

  const markPaid = async (profileId: string) => {
    const amount = window.prompt('Amount collected (USD)?', '29')
    if (amount === null) return
    const via = window.prompt('Paid via? (whish / usdt / iban / cash)', 'whish')
    if (via === null) return
    setBusyId(profileId)
    await supabase
      .from('subscriptions')
      .update({ tier: 'founder', status: 'active', amount_usd: Number(amount) || null, paid_via: via })
      .eq('profile_id', profileId)
    setBusyId(null)
    router.refresh()
  }

  const setRequestStatus = async (id: string, status: string) => {
    setBusyId(id)
    await supabase.from('feature_requests').update({ status }).eq('id', id)
    setBusyId(null)
    router.refresh()
  }

  const setFounderNote = async (id: string, note: string) => {
    await supabase.from('feature_requests').update({ founder_note: note }).eq('id', id)
    router.refresh()
  }

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold">Founder</h1>
      <p className="mt-1 text-sm text-dash-muted">Freelancers, subscriptions, and incoming requests.</p>

      <h2 className="mt-8 text-sm font-medium text-dash-ink">Freelancers ({freelancers.length})</h2>
      <div className="mt-2 space-y-2">
        {freelancers.map(f => {
          const sub = one(f.subscriptions)
          return (
            <div key={f.id} className="flex items-center justify-between rounded-lg border border-dash-border bg-dash-surface px-3 py-2.5 text-sm">
              <div>
                <p className="font-medium text-dash-ink">{f.full_name || f.handle}</p>
                <p className="text-xs text-dash-muted">
                  malaf.work/{f.handle} · joined {new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                  sub?.tier === 'free' ? 'bg-dash-bg text-dash-muted' : 'bg-dash-success/10 text-dash-success'
                }`}>
                  {sub?.tier ?? 'free'}{sub?.amount_usd ? ` · $${sub.amount_usd}` : ''}
                </span>
                {sub?.tier === 'free' && (
                  <button
                    onClick={() => markPaid(f.id)}
                    disabled={busyId === f.id}
                    className="rounded-lg border border-dash-border px-3 py-1.5 text-xs disabled:opacity-60"
                  >
                    Mark paid
                  </button>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <h2 className="mt-8 text-sm font-medium text-dash-ink">Requests ({requests.length})</h2>
      <div className="mt-2 space-y-2">
        {requests.length === 0 && <p className="text-sm text-dash-muted">Nothing yet.</p>}
        {requests.map(r => {
          const prof = one(r.profiles)
          return (
            <div key={r.id} className="rounded-lg border border-dash-border bg-dash-surface px-3 py-2.5 text-sm">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-dash-ink">{r.body}</p>
                  <p className="mt-1 text-xs text-dash-muted">
                    {prof?.full_name || prof?.handle} · {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </p>
                </div>
                <select
                  value={r.status}
                  onChange={e => setRequestStatus(r.id, e.target.value)}
                  disabled={busyId === r.id}
                  className="shrink-0 rounded-lg border border-dash-border bg-dash-bg px-2 py-1 text-xs"
                >
                  {REQUEST_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <input
                defaultValue={r.founder_note}
                placeholder="note back to them (optional)"
                onBlur={e => e.target.value !== r.founder_note && setFounderNote(r.id, e.target.value)}
                className="mt-2 w-full rounded-lg border border-dash-border bg-dash-bg px-2 py-1 text-xs outline-none placeholder:text-dash-muted"
              />
            </div>
          )
        })}
      </div>
    </div>
  )
}
