import { createClient } from '@/lib/supabase/server'
import { ServicesEditor } from './ServicesEditor'

export default async function ServicesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: services } = await supabase
    .from('services')
    .select('*')
    .eq('profile_id', user!.id)
    .order('sort_order')

  return (
    <div>
      <h1 className="text-xl font-semibold">Services</h1>
      <p className="mt-1 text-sm text-dash-muted">
        What you offer and what it costs. Shown on your public page in this order.
      </p>
      <ServicesEditor initialServices={services ?? []} profileId={user!.id} />
    </div>
  )
}
