'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { formatMoney, docPrefix, STATUS_LABEL, type DocumentRow } from '@/lib/documents'
import { buildWaLink, fillTemplate } from '@/lib/wa-link'

export function QuoteDetail({
  doc,
  token,
  freelancerName,
  shareTemplate,
}: {
  doc: DocumentRow
  token: string | null
  freelancerName: string
  shareTemplate: string
}) {
  const [status, setStatus] = useState(doc.status)
  const [busy, setBusy] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const supabase = createClient()

  const docLink = token ? `${window.location.origin}/q/${token}` : ''

  const send = async () => {
    setBusy('send')
    const res = await fetch(`/api/documents/${doc.id}/send`, { method: 'POST' })
    const json = await res.json()
    setBusy(null)
    if (json.ok) setStatus('sent')
    else setError(json.error ?? 'Could not send')
  }

  const markApprovedOnWhatsapp = async () => {
    setBusy('approve')
    const { error: updateError } = await supabase
      .from('documents')
      .update({ approved_at: new Date().toISOString(), approved_via: 'whatsapp_manual', status: 'approved' })
      .eq('id', doc.id)
    setBusy(null)
    if (!updateError) setStatus('approved')
    else setError(updateError.message)
  }

  const convertToInvoice = async () => {
    setBusy('convert')
    const { data, error: rpcError } = await supabase.rpc('convert_quote_to_invoice', { p_document_id: doc.id })
    setBusy(null)
    if (rpcError || !data) { setError(rpcError?.message ?? 'Could not convert'); return }
    router.push(`/dashboard/invoices/${data.invoice_id}`)
  }

  const voidQuote = async () => {
    setBusy('void')
    const { data, error: rpcError } = await supabase.rpc('void_document', { p_document_id: doc.id, p_reason: '' })
    setBusy(null)
    if (data) setStatus('void')
    else setError(rpcError?.message ?? 'Could not void')
  }

  const shareLink = docLink
    ? buildWaLink(doc.client_phone, fillTemplate(shareTemplate, {
        client_name: doc.client_name,
        doc_link: docLink,
        freelancer_name: freelancerName,
      }))
    : null

  return (
    <div className="max-w-lg">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">
          {docPrefix('quote')}-{doc.doc_number} · {doc.client_name}
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

      <div className="mt-4 flex flex-wrap gap-2">
        {status === 'draft' && (
          <button onClick={send} disabled={!!busy} className="rounded-lg bg-dash-accent px-4 py-2 text-sm font-semibold text-dash-accent-ink">
            {busy === 'send' ? 'Sending…' : 'Send'}
          </button>
        )}
        {status === 'sent' && shareLink && (
          <a href={shareLink} target="_blank" rel="noopener noreferrer" className="rounded-lg bg-dash-accent px-4 py-2 text-sm font-semibold text-dash-accent-ink">
            Share on WhatsApp
          </a>
        )}
        {token && status === 'sent' && (
          <a
            href={`/api/render/${token}?type=q`}
            download={`quote-${doc.doc_number}.png`}
            className="rounded-lg border border-dash-border px-4 py-2 text-sm"
          >
            Download as image
          </a>
        )}
        {status === 'sent' && (
          <button onClick={markApprovedOnWhatsapp} disabled={!!busy} className="rounded-lg border border-dash-border px-4 py-2 text-sm">
            {busy === 'approve' ? 'Marking…' : 'Approved on WhatsApp'}
          </button>
        )}
        {status === 'approved' && (
          <button onClick={convertToInvoice} disabled={!!busy} className="rounded-lg bg-dash-accent px-4 py-2 text-sm font-semibold text-dash-accent-ink">
            {busy === 'convert' ? 'Converting…' : 'Convert to invoice'}
          </button>
        )}
        {!['void', 'paid'].includes(status) && (
          <button onClick={voidQuote} disabled={!!busy} className="rounded-lg border border-dash-border px-4 py-2 text-sm text-dash-danger">
            Void
          </button>
        )}
      </div>

      {docLink && (
        <p className="mt-3 text-xs text-dash-muted">
          Client link: <span className="text-dash-ink">{docLink}</span>
        </p>
      )}
    </div>
  )
}
