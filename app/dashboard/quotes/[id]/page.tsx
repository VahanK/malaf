import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { QuoteDetail } from './QuoteDetail'

export default async function QuoteDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: doc } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .eq('profile_id', user!.id)
    .eq('type', 'quote')
    .single()

  if (!doc) notFound()

  // access_tokens has RLS enabled with zero policies (the zero-login door
  // table) — even the owner can't select it directly, so this goes through
  // a SECURITY DEFINER function that verifies ownership internally.
  const { data: tokens } = await supabase.rpc('get_document_tokens', { p_document_id: doc.id })

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name, page_language')
    .eq('id', user!.id)
    .single()

  const { data: template } = await supabase
    .from('message_templates')
    .select('body')
    .is('profile_id', null)
    .eq('kind', 'quote_share')
    .eq('language', doc.language)
    .single()

  return (
    <QuoteDetail
      doc={doc}
      token={tokens?.quote ?? null}
      freelancerName={profile?.full_name ?? ''}
      shareTemplate={template?.body ?? "Hi {{client_name}}, here's the quote we discussed: {{doc_link}}"}
    />
  )
}
