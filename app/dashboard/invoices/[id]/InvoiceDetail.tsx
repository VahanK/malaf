'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import {
  formatMoney, docPrefix, STATUS_LABEL, currentReminderTier, lastSentTier, daysOverdue,
  type DocumentRow,
} from '@/lib/documents'
import { buildWaLink, fillTemplate } from '@/lib/wa-link'

interface PaymentEvent {
  id: number
  actor: 'client' | 'owner' | 'system'
  event: string
  detail: { tier?: number; proof_path?: string } | null
  created_at: string
  proof_url: string | null
}

export function InvoiceDetail({
  doc,
  invoiceToken,
  payToken,
  events,
  freelancerName,
  shareTemplate,
  reminderTemplates,
}: {
  doc: DocumentRow
  invoiceToken: string | null
  payToken: string | null
  events: PaymentEvent[]
  freelancerName: string
  shareTemplate: string
  reminderTemplates: Record<1 | 2 | 3, string>
}) {
  const [status, setStatus] = useState(doc.status)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [receiptToken, setReceiptToken] = useState<string | null>(null)
  const [eventLog, setEventLog] = useState(events)
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerText, setComposerText] = useState('')
  const supabase = createClient()

  const origin = typeof window !== 'undefined' ? window.location.origin : ''
  const invoiceLink = invoiceToken ? `${origin}/i/${invoiceToken}` : ''
  const payLink = payToken ? `${origin}/p/${payToken}` : ''

  const send = async () => {
    setBusy('send')
    const res = await fetch(`/api/documents/${doc.id}/send`, { method: 'POST' })
    const json = await res.json()
    setBusy(null)
    if (json.ok) setStatus('sent')
    else setError(json.error ?? 'Could not send')
  }

  const confirmPayment = async () => {
    setBusy('confirm')
    const { data, error: rpcError } = await supabase.rpc('confirm_payment', { p_document_id: doc.id })
    setBusy(null)
    if (!data) { setError(rpcError?.message ?? 'Could not confirm'); return }
    setStatus('paid')
    setReceiptToken(data.receipt_token)
  }

  const voidInvoice = async () => {
    setBusy('void')
    const { data, error: rpcError } = await supabase.rpc('void_document', { p_document_id: doc.id, p_reason: '' })
    setBusy(null)
    if (data) setStatus('void')
    else setError(rpcError?.message ?? 'Could not void')
  }

  const shareLink = invoiceLink
    ? buildWaLink(doc.client_phone, fillTemplate(shareTemplate, {
        client_name: doc.client_name,
        amount: formatMoney(doc.total, doc.currency),
        doc_link: payLink || invoiceLink,
        freelancer_name: freelancerName,
      }))
    : null

  // Escalation: the next tier unlocks only once it differs from the last one
  // actually sent, so tapping "Remind" repeatedly the same day is a no-op
  // (plan §4) — this is an app-layer guard, not a DB constraint.
  const days = daysOverdue(doc.due_at)
  const eligibleTier = currentReminderTier(doc.due_at)
  const sentTier = lastSentTier(eventLog)
  const nextTier = eligibleTier > sentTier ? eligibleTier : 0
  const canRemind = nextTier > 0 && (status === 'sent' || status === 'approved') && !!doc.due_at

  const openComposer = () => {
    if (!nextTier) return
    const body = reminderTemplates[nextTier as 1 | 2 | 3] || ''
    setComposerText(fillTemplate(body, {
      client_name: doc.client_name,
      amount: formatMoney(doc.total, doc.currency),
      doc_link: payLink || invoiceLink,
      freelancer_name: freelancerName,
    }))
    setComposerOpen(true)
  }

  const sendReminder = async () => {
    const waLink = buildWaLink(doc.client_phone, composerText)
    // Log first — "reminder composed and WhatsApp opened," never claims
    // delivery WorkWith doesn't have (plan §4 honesty note).
    const { data: logged } = await supabase.rpc('log_reminder_sent', {
      p_document_id: doc.id,
      p_tier: nextTier,
      p_language: doc.language,
    })
    if (logged) {
      setEventLog([
        { id: Date.now(), actor: 'owner', event: 'reminder_sent', detail: { tier: nextTier }, created_at: new Date().toISOString(), proof_url: null },
        ...eventLog,
      ])
    }
    setComposerOpen(false)
    window.open(waLink, '_blank')
  }

  return (
    <div className="max-w-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {docPrefix('invoice')}-{doc.doc_number} · {doc.client_name}
        </h1>
        <span className="rounded-full bg-dash-surface px-2.5 py-1 text-xs font-medium text-dash-muted">
          {STATUS_LABEL[status]}
        </span>
      </div>

      <div className="mt-4 rounded-lg border border-dash-border bg-dash-surface p-4">
        {doc.line_items.map((item, i) => (
          <div key={i} className="flex justify-between border-b border-dash-border py-2 text-sm last:border-0">
            <span>{item.title} × {item.qty}</span>
            <span>{formatMoney(item.qty * item.unit_price, doc.currency)}</span>
          </div>
        ))}
        <div className="mt-2 flex justify-between text-sm font-semibold">
          <span>Total</span>
          <span>{formatMoney(doc.total, doc.currency)}</span>
        </div>
      </div>

      {error && <p className="mt-3 rounded-lg bg-dash-danger/10 px-3 py-2 text-sm text-dash-danger">{error}</p>}

      {status === 'paid' && receiptToken && (
        <p className="mt-3 rounded-lg bg-dash-success/10 px-3 py-2 text-sm text-dash-success">
          Paid — receipt ready at {origin}/r/{receiptToken}
        </p>
      )}

      {(status === 'sent' || status === 'approved') && doc.due_at && days >= 0 && (
        <p className="mt-3 text-xs text-dash-muted">
          {days === 0 ? 'Due today' : `${days} day${days === 1 ? '' : 's'} overdue`}
        </p>
      )}

      <div className="mt-4 flex flex-wrap gap-2">
        {status === 'draft' && (
          <button onClick={send} disabled={!!busy} className="rounded-lg bg-dash-accent px-4 py-2 text-sm font-semibold text-dash-accent-ink">
            {busy === 'send' ? 'Sending…' : 'Send'}
          </button>
        )}
        {(status === 'sent' || status === 'approved') && shareLink && (
          <a href={shareLink} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-dash-accent px-4 py-2 text-sm font-semibold text-dash-accent-ink">
            Share on WhatsApp
          </a>
        )}
        {invoiceToken && (status === 'sent' || status === 'approved') && (
          <a
            href={`/api/render/${invoiceToken}?type=i`}
            download={`invoice-${doc.doc_number}.png`}
            className="rounded-lg border border-dash-border px-4 py-2 text-sm"
          >
            Download as image
          </a>
        )}
        {canRemind && (
          <button onClick={openComposer} className="rounded-lg border border-dash-warning px-4 py-2 text-sm text-dash-warning">
            Remind (tier {nextTier})
          </button>
        )}
        {(status === 'sent' || status === 'approved') && (
          <button onClick={confirmPayment} disabled={!!busy} className="rounded-lg border border-dash-border px-4 py-2 text-sm">
            {busy === 'confirm' ? 'Confirming…' : 'Confirm payment'}
          </button>
        )}
        {!['void', 'paid'].includes(status) && (
          <button onClick={voidInvoice} disabled={!!busy} className="rounded-lg border border-dash-border px-4 py-2 text-sm text-dash-danger">
            Void
          </button>
        )}
      </div>

      {composerOpen && (
        <div className="mt-4 rounded-lg border border-dash-warning bg-dash-surface p-4">
          <p className="text-xs font-medium text-dash-muted">
            Review before sending — you can edit the tone.
          </p>
          <textarea
            rows={4}
            value={composerText}
            onChange={e => setComposerText(e.target.value)}
            dir={doc.language === 'ar' ? 'rtl' : 'ltr'}
            className="mt-2 w-full resize-none rounded-lg border border-dash-border bg-dash-bg px-3 py-2 text-sm outline-none focus:border-dash-accent"
          />
          <div className="mt-2 flex gap-2">
            <button onClick={() => setComposerOpen(false)} className="rounded-lg border border-dash-border px-3 py-1.5 text-xs">
              Cancel
            </button>
            <button onClick={sendReminder} className="rounded-lg bg-dash-accent px-3 py-1.5 text-xs font-semibold text-dash-accent-ink">
              Open in WhatsApp
            </button>
          </div>
        </div>
      )}

      {payLink && (
        <p className="mt-3 text-xs text-dash-muted">
          Pay link: <span className="text-dash-ink">{payLink}</span>
        </p>
      )}

      {eventLog.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-medium text-dash-ink">Activity</h2>
          <div className="mt-2 space-y-2">
            {eventLog.map(e => (
              <div key={e.id} className="rounded-lg border border-dash-border bg-dash-surface px-3 py-2 text-xs text-dash-muted">
                <span className="font-medium text-dash-ink">{eventLabel(e)}</span>
                {' · '}
                {new Date(e.created_at).toLocaleString()}
                {e.proof_url && (
                  <a href={e.proof_url} target="_blank" rel="noopener noreferrer" className="ml-2 underline">
                    View proof
                  </a>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function eventLabel(e: PaymentEvent) {
  switch (e.event) {
    case 'proof_submitted': return 'Client said "I paid"'
    case 'confirmed': return 'You confirmed payment'
    // Honest granularity (plan §4): this means "composed and WhatsApp
    // opened," never "delivered" — WorkWith has no visibility past this point.
    case 'reminder_sent': return `Reminder opened in WhatsApp (tier ${e.detail?.tier ?? '?'})`
    case 'usdt_matched': return 'USDT payment matched'
    case 'voided': return 'Voided'
    default: return e.event
  }
}
