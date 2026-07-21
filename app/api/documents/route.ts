import { createClient } from '@/lib/supabase/server'
import { computeTotals, type LineItem } from '@/lib/documents'
import { NextResponse } from 'next/server'

// Owner-authenticated document creation — plain RLS handles this (the actor
// is always the authenticated owner, matching services/payment_methods'
// existing "for all" policy convention), no SECURITY DEFINER wrapper needed.
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })

  const body = await request.json().catch(() => null)
  const clientName = (body?.client_name ?? '').trim()
  const lineItems: LineItem[] = Array.isArray(body?.line_items) ? body.line_items : []
  if (!clientName || lineItems.length === 0) {
    return NextResponse.json({ ok: false, error: 'Missing client name or line items' }, { status: 400 })
  }

  const discount = Number(body?.discount) || 0
  const { subtotal, total } = computeTotals(lineItems, discount)

  const { data: doc, error } = await supabase
    .from('documents')
    .insert({
      profile_id: user.id,
      type: 'quote',
      client_name: clientName,
      client_phone: (body?.client_phone ?? '').trim(),
      client_email: (body?.client_email ?? '').trim(),
      language: body?.language === 'ar' ? 'ar' : 'en',
      currency: body?.currency === 'LBP' ? 'LBP' : 'USD',
      line_items: lineItems,
      subtotal,
      discount,
      total,
      notes: body?.notes ?? '',
      notes_ar: body?.notes_ar ?? '',
    })
    .select()
    .single()

  if (error || !doc) {
    return NextResponse.json({ ok: false, error: error?.message }, { status: 400 })
  }

  // access_tokens has RLS enabled with zero policies (the zero-login door
  // table) — a direct insert from an authenticated client is blocked just
  // like a direct select, so minting goes through a SECURITY DEFINER
  // function that verifies ownership internally.
  const { data: token, error: tokenError } = await supabase.rpc('mint_document_token', {
    p_document_id: doc.id,
    p_scope: 'quote',
  })

  if (tokenError || !token) {
    return NextResponse.json({ ok: false, error: tokenError?.message ?? 'Could not create share link' }, { status: 400 })
  }

  return NextResponse.json({ ok: true, document: doc, token })
}
