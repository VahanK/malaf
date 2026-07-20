import { createClient } from '@/lib/supabase/server'
import { ProfileForm } from './ProfileForm'

export default async function ProfilePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user!.id)
    .single()

  return (
    <div>
      <h1 className="text-xl font-semibold">Profile</h1>
      <p className="mt-1 text-sm text-dash-muted">
        What clients see on your public page.
      </p>
      <ProfileForm profile={profile} />
    </div>
  )
}
