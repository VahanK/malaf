import { createClient } from '@/lib/supabase/server'
import { NewQuoteForm } from './NewQuoteForm'

export default async function NewQuotePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: services } = await supabase
    .from('services')
    .select('title, title_ar, price, unit')
    .eq('profile_id', user!.id)
    .eq('active', true)
    .order('sort_order')

  return (
    <div>
      <h1 className="text-xl font-semibold">New quote</h1>
      <NewQuoteForm services={services ?? []} />
    </div>
  )
}
