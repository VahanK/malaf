import { createClient } from '@/lib/supabase/server'
import { EditorShell } from '@/components/dashboard/EditorShell'
import { ProfileForm } from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  // Whether this freelancer is allowed to publish (paid, active subscription).
  // Read the owner's own subscription row directly (RLS-scoped); the DB trigger
  // is the real enforcement — this just drives the paywall UI.
  const { data: sub } = await supabase
    .from('subscriptions')
    .select('tier, status, period_end')
    .eq('profile_id', user!.id)
    .single()
  const canPublish =
    !!sub && sub.tier !== 'free' && sub.status === 'active' &&
    (sub.period_end == null || new Date(sub.period_end) > new Date())

  return (
    <EditorShell
      title="Profile"
      subtitle="What clients see on your public page."
      handle={profile?.handle ?? null}
      published={profile?.page_published ?? false}
    >
      <ProfileForm profile={profile} canPublish={!!canPublish} />
    </EditorShell>
  )
}
