import { createClient } from '@/lib/supabase/server'
import { NewQuoteForm } from './NewQuoteForm'

export default async function NewQuotePage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: services } = await supabase
    .from('services')
    .select('title, title_ar, price, unit')
    .eq('profile_id', user!.id)
    .eq('active', true)
    .order('sort_order')

  // Prefill from a client request (Client requests inbox → "Turn into a quote").
  const sp = await searchParams
  const str = (v: string | string[] | undefined) => (Array.isArray(v) ? v[0] : v) ?? ''
  const prefill = {
    name: str(sp.name),
    phone: str(sp.phone),
    note: str(sp.note),
    service: str(sp.service),
  }

  return (
    <div>
      <h1 className="text-xl font-semibold">New quote</h1>
      {prefill.name && (
        <p className="mt-1 text-sm text-dash-muted">From a request by <span className="font-medium text-dash-ink">{prefill.name}</span>.</p>
      )}
      <NewQuoteForm services={services ?? []} prefill={prefill} />
    </div>
  )
}
