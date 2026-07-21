import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { signedProofUrl } from '@/lib/media'
import { InvoiceDetail } from './InvoiceDetail'

export default async function InvoiceDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  const { data: doc } = await supabase
    .from('documents')
    .select('*')
    .eq('id', id)
    .eq('profile_id', user!.id)
    .eq('type', 'invoice')
    .single()

  if (!doc) notFound()

  // access_tokens has RLS enabled with zero policies (the zero-login door
  // table) — even the owner can't select it directly, so this goes through
  // a SECURITY DEFINER function that verifies ownership internally.
  const { data: tokens } = await supabase.rpc('get_document_tokens', { p_document_id: doc.id })

  const { data: events } = await supabase
    .from('payment_events')
    .select('*')
    .eq('document_id', doc.id)
    .order('created_at', { ascending: false })

  const eventsWithUrls = await Promise.all(
    (events ?? []).map(async e => ({
      ...e,
      proof_url: e.detail?.proof_path ? await signedProofUrl(supabase, e.detail.proof_path) : null,
    }))
  )

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user!.id)
    .single()

  const invoiceToken = tokens?.invoice ?? null
  const payToken = tokens?.pay ?? null

  const { data: template } = await supabase
    .from('message_templates')
    .select('body')
    .is('profile_id', null)
    .eq('kind', 'invoice_share')
    .eq('language', doc.language)
    .single()

  return (
    <InvoiceDetail
      doc={doc}
      invoiceToken={invoiceToken}
      payToken={payToken}
      events={eventsWithUrls}
      freelancerName={profile?.full_name ?? ''}
      shareTemplate={template?.body ?? "Hi {{client_name}}, here's your invoice for {{amount}}: {{doc_link}}"}
    />
  )
}
