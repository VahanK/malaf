import { createClient } from '@/lib/supabase/server'
import { EditorShell } from '@/components/dashboard/EditorShell'
import { ServicesEditor } from './ServicesEditor'

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [{ data: services }, { data: prof }] = await Promise.all([
    supabase.from('services').select('*').eq('profile_id', user!.id).order('sort_order'),
    supabase.from('profiles').select('handle, page_published').eq('id', user!.id).single(),
  ])

  return (
    <EditorShell
      title="Services"
      subtitle="What you offer and what it costs. Shown on your public page in this order."
      handle={prof?.handle ?? null}
      published={prof?.page_published ?? false}
    >
      <ServicesEditor initialServices={services ?? []} profileId={user!.id} />
    </EditorShell>
  )
}
