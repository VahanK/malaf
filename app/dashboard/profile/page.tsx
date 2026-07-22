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

  return (
    <EditorShell
      title="Profile"
      subtitle="What clients see on your public page."
      handle={profile?.handle ?? null}
      published={profile?.page_published ?? false}
    >
      <ProfileForm profile={profile} />
    </EditorShell>
  )
}
