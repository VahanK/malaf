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
  handle: string | null
  full_name: string
  title: string
  whatsapp_number: string | null
  page_published: boolean
  composable: boolean
  avatar_url: string | null
  created_at: string
  portfolio_blocks: { count: number }[] | null
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

interface Lead {
  id: string
  created_at: string
  status: string
  name: string | null
  contact: string | null
  service: string | null
  budget: string | null
  handle: string
  full_name: string | null
}

export function FounderView({ freelancers, requests, leads = [] }: { freelancers: Freelancer[]; requests: FeatureRequest[]; leads?: Lead[] }) {
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

  // page status per user, for the management view
  const statusOf = (f: Freelancer): { label: string; cls: string } => {
    const sections = f.portfolio_blocks?.[0]?.count ?? 0
    if (f.page_published) return { label: 'Live', cls: 'bg-dash-success/12 text-dash-success' }
    if (sections > 0) return { label: 'Building', cls: 'bg-dash-warning/12 text-dash-warning' }
    return { label: 'Not started', cls: 'bg-dash-bg text-dash-muted' }
  }
  const waLink = (num: string | null, name: string) =>
    num ? `https://wa.me/${num.replace(/[^\d]/g, '')}?text=${encodeURIComponent(`Hi ${name.split(' ')[0] || ''}! It's about your WorkWith page —`)}` : null

  const liveCount = freelancers.filter(f => f.page_published).length
  const buildingCount = freelancers.filter(f => !f.page_published && (f.portfolio_blocks?.[0]?.count ?? 0) > 0).length
  const paidCount = freelancers.filter(f => { const s = one(f.subscriptions); return s && s.tier !== 'free' }).length

  return (
    <div className="max-w-3xl">
      <h1 className="text-xl font-semibold">People building with you</h1>
      <p className="mt-1 text-sm text-dash-muted">Everyone on WorkWith — where they are, and who needs a nudge.</p>

      {/* summary */}
      <div className="mt-4 grid grid-cols-5 gap-3">
        {[
          { n: freelancers.length, l: 'Total' },
          { n: liveCount, l: 'Live pages' },
          { n: buildingCount, l: 'Building' },
          { n: paidCount, l: 'Paid' },
          { n: leads.length, l: 'Leads' },
        ].map(s => (
          <div key={s.l} className="rounded-xl border border-dash-border bg-dash-surface p-3">
            <div className="text-xl font-semibold text-dash-ink">{s.n}</div>
            <div className="mt-0.5 text-[12px] text-dash-muted">{s.l}</div>
          </div>
        ))}
      </div>

      {/* Platform-wide leads — traction between freelancers and their clients.
          This is the "deal flow" picture: which pages are actually getting leads. */}
      {leads.length > 0 && (
        <>
          <h2 className="mt-8 text-sm font-medium text-dash-ink">Recent leads ({leads.length})</h2>
          <div className="mt-2 space-y-1.5">
            {leads.slice(0, 20).map(l => (
              <div key={l.id} className="flex items-center gap-3 rounded-lg border border-dash-border bg-dash-surface px-3 py-2 text-[13px]">
                <span className="font-semibold text-dash-ink">{l.name || 'Someone'}</span>
                <span className="text-dash-muted">→</span>
                <a href={`/${l.handle}`} target="_blank" rel="noopener noreferrer" className="font-medium text-dash-accent">@{l.handle}</a>
                {l.service && <span className="truncate text-dash-muted">· {l.service}</span>}
                {l.budget && <span className="ml-auto shrink-0 rounded-full bg-dash-accent/10 px-2 py-0.5 text-[11px] font-bold text-dash-accent">{l.budget}</span>}
                <span className="shrink-0 text-[11px] text-dash-muted">{new Date(l.created_at).toLocaleDateString()}</span>
              </div>
            ))}
          </div>
        </>
      )}

      <h2 className="mt-8 text-sm font-medium text-dash-ink">Everyone ({freelancers.length})</h2>
      <div className="mt-2 space-y-2">
        {freelancers.map(f => {
          const sub = one(f.subscriptions)
          const st = statusOf(f)
          const sections = f.portfolio_blocks?.[0]?.count ?? 0
          const wa = waLink(f.whatsapp_number, f.full_name)
          return (
            <div key={f.id} className="rounded-xl border border-dash-border bg-dash-surface p-3 text-sm">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="truncate font-medium text-dash-ink">{f.full_name || f.handle || 'Unnamed'}</p>
                    <span className={`shrink-0 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${st.cls}`}>{st.label}</span>
                  </div>
                  <p className="mt-0.5 truncate text-xs text-dash-muted">
                    {f.handle ? `work-withme.com/${f.handle}` : 'no handle yet'}
                    {f.title ? ` · ${f.title}` : ''}
                  </p>
                  <p className="mt-0.5 text-[11px] text-dash-muted">
                    {sections} section{sections === 1 ? '' : 's'} · joined {new Date(f.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    {sub && sub.tier !== 'free' ? ` · ${sub.tier}${sub.amount_usd ? ` $${sub.amount_usd}` : ''}` : ''}
                  </p>
                </div>
              </div>
              <div className="mt-2.5 flex flex-wrap items-center gap-2">
                {f.handle && (
                  <a href={`/${f.handle}`} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-dash-border px-2.5 py-1.5 text-xs font-medium text-dash-muted hover:text-dash-ink">
                    Preview page ↗
                  </a>
                )}
                {wa && (
                  <a href={wa} target="_blank" rel="noopener noreferrer" className="rounded-lg border border-dash-border px-2.5 py-1.5 text-xs font-medium text-dash-muted hover:text-dash-ink">
                    💬 Message
                  </a>
                )}
                {(!sub || sub.tier === 'free') && (
                  <button onClick={() => markPaid(f.id)} disabled={busyId === f.id} className="rounded-lg bg-dash-accent/10 px-2.5 py-1.5 text-xs font-semibold text-dash-accent disabled:opacity-60">
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
