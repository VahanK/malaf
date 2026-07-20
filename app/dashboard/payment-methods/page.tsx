import { createClient } from '@/lib/supabase/server'
import { PaymentMethodsEditor } from './PaymentMethodsEditor'

export default async function PaymentMethodsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: methods } = await supabase
    .from('payment_methods')
    .select('*')
    .eq('profile_id', user!.id)
    .order('sort_order')

  return (
    <div>
      <h1 className="text-xl font-semibold">Payment methods</h1>
      <p className="mt-1 text-sm text-dash-muted">
        Your own rails — shown on invoices so clients can pay you directly. Malaf never touches this money.
      </p>
      <PaymentMethodsEditor initialMethods={methods ?? []} profileId={user!.id} />
    </div>
  )
}
