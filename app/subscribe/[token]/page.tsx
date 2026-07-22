import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { SubscribeView } from './SubscribeView'

// Pay-to-publish checkout: the freelancer pays WorkWith (the platform) to
// publish their page live. USDT auto-confirms via the watcher; other rails are
// a WhatsApp-to-founder manual arrangement. Status must be live per-viewer.
export const dynamic = 'force-dynamic'

export default async function SubscribePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()
  const { data } = await supabase.rpc('get_subscription_checkout_by_token', { p_token: token })
  if (!data) notFound()
  return <SubscribeView data={data} token={token} />
}
