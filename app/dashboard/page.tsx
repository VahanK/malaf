import { createClient } from '@/lib/supabase/server'

export default async function DashboardHome() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: profile } = await supabase
    .from('profiles')
    .select('handle, page_published')
    .eq('id', user!.id)
    .single()

  const { count: newQuoteRequests } = await supabase
    .from('quote_requests')
    .select('*', { count: 'exact', head: true })
    .eq('profile_id', user!.id)
    .eq('status', 'new')

  // Outstanding = sent/approved invoices not yet paid. Collected-this-month =
  // invoices marked paid since the 1st. Real numbers, not the old $0 literals.
  const monthStart = new Date()
  monthStart.setDate(1)
  monthStart.setHours(0, 0, 0, 0)

  const { data: outstandingRows } = await supabase
    .from('documents')
    .select('total')
    .eq('profile_id', user!.id)
    .eq('type', 'invoice')
    .in('status', ['sent', 'approved'])
  const outstanding = (outstandingRows ?? []).reduce((sum, r) => sum + Number(r.total ?? 0), 0)

  const { data: collectedRows } = await supabase
    .from('documents')
    .select('total')
    .eq('profile_id', user!.id)
    .eq('type', 'invoice')
    .eq('status', 'paid')
    .gte('paid_at', monthStart.toISOString())
  const collected = (collectedRows ?? []).reduce((sum, r) => sum + Number(r.total ?? 0), 0)

  const money = (n: number) => '$' + n.toLocaleString('en-US')

  return (
    <div>
      <h1 className="text-xl font-semibold">Overview</h1>

      {!profile?.page_published && (
        <p className="mt-3 rounded-lg border border-dash-warning/30 bg-dash-warning/10 px-4 py-3 text-sm text-dash-ink">
          Your page isn&apos;t live yet.{' '}
          <a href="/dashboard/profile" className="font-medium underline">
            Finish your profile
          </a>{' '}
          to publish it.
        </p>
      )}

      <div className="mt-6 grid grid-cols-3 gap-4">
        <div className="rounded-xl border border-dash-border bg-dash-surface p-5">
          <div className="text-2xl font-semibold">{money(outstanding)}</div>
          <div className="mt-1 text-sm text-dash-muted">Outstanding</div>
        </div>
        <div className="rounded-xl border border-dash-border bg-dash-surface p-5">
          <div className="text-2xl font-semibold">{money(collected)}</div>
          <div className="mt-1 text-sm text-dash-muted">Collected this month</div>
        </div>
        <div className="rounded-xl border border-dash-border bg-dash-surface p-5">
          <div className="text-2xl font-semibold">{newQuoteRequests ?? 0}</div>
          <div className="mt-1 text-sm text-dash-muted">New quote requests</div>
        </div>
      </div>

      {profile?.handle && (
        <p className="mt-6 text-sm text-dash-muted">
          Your page:{' '}
          <a href={`/${profile.handle}`} className="font-medium text-dash-ink underline">
            work-withme.com/{profile.handle}
          </a>
        </p>
      )}
    </div>
  )
}
