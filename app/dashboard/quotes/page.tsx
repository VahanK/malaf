import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { formatMoney, docPrefix, STATUS_LABEL, type DocumentRow } from '@/lib/documents'

export default async function QuotesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: quotes } = await supabase
    .from('documents')
    .select('*')
    .eq('profile_id', user!.id)
    .eq('type', 'quote')
    .order('created_at', { ascending: false })

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold">Quotes</h1>
        <Link href="/dashboard/quotes/new" className="rounded-lg bg-dash-accent px-4 py-2 text-sm font-semibold text-dash-accent-ink">
          New quote
        </Link>
      </div>

      <div className="mt-6 max-w-lg space-y-2">
        {!quotes?.length && <p className="text-sm text-dash-muted">No quotes yet.</p>}
        {(quotes as DocumentRow[] | null)?.map(q => (
          <Link
            key={q.id}
            href={`/dashboard/quotes/${q.id}`}
            className="flex items-center justify-between rounded-lg border border-dash-border bg-dash-surface px-4 py-3"
          >
            <div>
              <div className="text-sm font-medium text-dash-ink">
                {docPrefix('quote')}-{q.doc_number} · {q.client_name}
              </div>
              <div className="text-xs text-dash-muted">{formatMoney(q.total, q.currency)}</div>
            </div>
            <span className="text-xs font-medium text-dash-muted">{STATUS_LABEL[q.status]}</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
