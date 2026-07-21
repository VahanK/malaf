'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatMoney, docPrefix, STATUS_LABEL, type DocumentRow } from '@/lib/documents'
import { buildWaLink, fillTemplate } from '@/lib/wa-link'

interface PaymentEvent {
  id: number
  actor: 'client' | 'owner' | 'system'
  event: string
  detail: Record<string, unknown>
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
}: {
  doc: DocumentRow
  invoiceToken: string | null
  payToken: string | null
  events: PaymentEvent[]
  freelancerName: string
  shareTemplate: string
}) {
  const [status, setStatus] = useState(doc.status)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [receiptToken, setReceiptToken] = useState<string | null>(null)
  const router = useRouter()
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

      {payLink && (
        <p className="mt-3 text-xs text-dash-muted">
          Pay link: <span className="text-dash-ink">{payLink}</span>
        </p>
      )}

      {events.length > 0 && (
        <div className="mt-6">
          <h2 className="text-sm font-medium text-dash-ink">Activity</h2>
          <div className="mt-2 space-y-2">
            {events.map(e => (
              <div key={e.id} className="rounded-lg border border-dash-border bg-dash-surface px-3 py-2 text-xs text-dash-muted">
                <span className="font-medium text-dash-ink">{eventLabel(e.event)}</span>
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

function eventLabel(event: string) {
  switch (event) {
    case 'proof_submitted': return 'Client said "I paid"'
    case 'confirmed': return 'You confirmed payment'
    case 'reminder_sent': return 'Reminder sent'
    case 'usdt_matched': return 'USDT payment matched'
    case 'voided': return 'Voided'
    default: return event
  }
}
