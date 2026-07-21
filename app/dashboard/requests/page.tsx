import { createClient } from '@/lib/supabase/server'
import { RequestsForm } from './RequestsForm'

const STATUS_LABEL: Record<string, string> = {
  new: 'Sent',
  seen: 'Seen',
  planned: "We're building it",
  done: 'Done',
  declined: "Won't build",
}

export default async function RequestsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: requests } = await supabase
    .from('feature_requests')
    .select('id, body, status, founder_note, created_at')
    .eq('profile_id', user!.id)
    .order('created_at', { ascending: false })

  return (
    <div className="max-w-lg">
      <h1 className="text-xl font-semibold">Request something</h1>
      <p className="mt-1 text-sm text-dash-muted">
        Not everything's built yet. If your page or documents need something custom, tell us here —
        we read every one.
      </p>

      <RequestsForm />

      {requests && requests.length > 0 && (
        <div className="mt-8">
          <h2 className="text-sm font-medium text-dash-ink">Your requests</h2>
          <div className="mt-2 space-y-2">
            {requests.map(r => (
              <div key={r.id} className="rounded-lg border border-dash-border bg-dash-surface px-3 py-2.5 text-sm">
                <div className="flex items-start justify-between gap-2">
                  <p className="text-dash-ink">{r.body}</p>
                  <span className="shrink-0 rounded-full bg-dash-bg px-2 py-0.5 text-[11px] font-medium text-dash-muted">
                    {STATUS_LABEL[r.status] ?? r.status}
                  </span>
                </div>
                {r.founder_note && (
                  <p className="mt-1.5 text-xs text-dash-muted">{r.founder_note}</p>
                )}
                <p className="mt-1 text-[11px] text-dash-muted">
                  {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
