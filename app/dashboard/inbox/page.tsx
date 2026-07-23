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

  return (
    <div>
      <h1 className="text-xl font-semibold">Client requests</h1>
      <p className="mt-1 text-sm text-dash-muted">
        People who asked to work with you from your page. Turn any one into a quote.
      </p>
      <InboxView requests={requests ?? []} />
    </div>
  )
}
