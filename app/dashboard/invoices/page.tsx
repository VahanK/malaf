import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatMoney, docPrefix, STATUS_LABEL, type DocumentRow } from '@/lib/documents'

export default async function InvoicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: invoices } = await supabase
    .from('documents')
    .select('*')
    .eq('profile_id', user!.id)
    .eq('type', 'invoice')
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-xl font-semibold">Invoices</h1>
      <p className="mt-1 text-sm text-dash-muted">Created from approved quotes.</p>

      <div className="mt-6 max-w-lg space-y-2">
        {!invoices?.length && <p className="text-sm text-dash-muted">No invoices yet.</p>}
        {(invoices as DocumentRow[] | null)?.map(inv => (
          <Link
            key={inv.id}
            href={`/dashboard/invoices/${inv.id}`}
            className="flex items-center justify-between rounded-lg border border-dash-border bg-dash-surface px-4 py-3"
          >
            <div>
              <div className="text-sm font-medium text-dash-ink">
                {docPrefix('invoice')}-{inv.doc_number} · {inv.client_name}
              </div>
              <div className="text-xs text-dash-muted">{formatMoney(inv.total, inv.currency)}</div>
            </div>
            <span className="text-xs font-medium text-dash-muted">{STATUS_LABEL[inv.status]}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
