import { createClient } from '@/lib/supabase/server'
import { InboxView } from './InboxView'

// Client requests inbox: where the zero-login "request a quote" submissions
// from the freelancer's public page land. The freelancer sees each one and
// turns it into a real quote — the client-initiated → managed-transaction
// bridge, no client account required.
export default async function InboxPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: requests } = await supabase
    .from('quote_requests')
    .select('id, client_name, client_phone, message, status, service_id, created_at, services(title)')
    .eq('profile_id', user!.id)
    .order('created_at', { ascending: false })

  // Leads from the multi-step contact form on the public page.
  const { data: leads } = await supabase
    .from('leads')
    .select('id, name, contact, service, budget, message, status, created_at')
    .eq('profile_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div>
      <h1 className="text-xl font-semibold">Client requests</h1>
      <p className="mt-1 text-sm text-dash-muted">
        People who reached out from your page. Message them or turn a request into a quote.
      </p>

      {leads && leads.length > 0 && (
        <div className="mt-6 space-y-2">
          <h2 className="text-[13px] font-bold uppercase tracking-wide text-dash-muted">New leads</h2>
          {leads.map(l => (
            <div key={l.id} className="rounded-xl border border-dash-border bg-dash-surface p-4">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="font-semibold text-dash-ink">{l.name || 'Someone'} {l.budget && <span className="ml-2 rounded-full bg-dash-accent/10 px-2 py-0.5 text-[11px] font-bold text-dash-accent">{l.budget}</span>}</p>
                  {l.service && <p className="mt-0.5 text-[13.5px] text-dash-ink">Needs: {l.service}</p>}
                  {l.message && <p className="mt-1 text-[13px] text-dash-muted">{l.message}</p>}
                </div>
                <span className="shrink-0 text-[11px] text-dash-muted">{new Date(l.created_at).toLocaleDateString()}</span>
              </div>
              {l.contact && (
                <div className="mt-3 flex items-center gap-3 text-[13px]">
                  <span className="text-dash-muted">Reach at:</span>
                  <span className="font-semibold text-dash-ink">{l.contact}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <div className="mt-6">
        <h2 className="mb-2 text-[13px] font-bold uppercase tracking-wide text-dash-muted">Quote requests</h2>
        <InboxView requests={requests ?? []} />
      </div>
    </div>
  )
}
