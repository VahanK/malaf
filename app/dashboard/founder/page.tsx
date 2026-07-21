import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { FounderView } from './FounderView'

// Founder is a flag on your own profile row, not a new role (CLAUDE.md:
// single role, freelancer) — RLS already restricts subscriptions/
// feature_requests writes to is_founder rows, this route just hides the
// page from everyone else's nav too.
export default async function FounderPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: me } = await supabase.from('profiles').select('is_founder').eq('id', user!.id).single()
  if (!me?.is_founder) notFound()

  const { data: freelancers } = await supabase
    .from('profiles')
    .select('id, handle, full_name, created_at, subscriptions(tier, status, amount_usd, paid_via, note)')
    .order('created_at', { ascending: false })

  const { data: requests } = await supabase
    .from('feature_requests')
    .select('id, profile_id, body, status, founder_note, created_at, profiles(handle, full_name)')
    .order('created_at', { ascending: false })

  return <FounderView freelancers={freelancers ?? []} requests={requests ?? []} />
}
