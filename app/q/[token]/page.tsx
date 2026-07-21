import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { QuoteView } from './QuoteView'

// Cannot be ISR'd — approval status must be live per-viewer (a client should
// never see a stale "not yet approved" right after tapping approve).
export const dynamic = 'force-dynamic'

export default async function QuoteTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()
  const { data } = await supabase.rpc('get_document_by_token', { p_token: token })
  if (!data) notFound()
  return <QuoteView data={data} token={token} />
}
