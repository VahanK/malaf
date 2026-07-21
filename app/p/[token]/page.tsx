import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { PayView } from './PayView'

// Cannot be ISR'd — status must be live per-viewer.
export const dynamic = 'force-dynamic'

export default async function PayTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()
  const { data } = await supabase.rpc('get_pay_page_by_token', { p_token: token })
  if (!data) notFound()
  return <PayView data={data} token={token} />
}
