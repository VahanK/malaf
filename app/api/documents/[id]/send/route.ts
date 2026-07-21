import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Owner-authenticated: draft -> sent. Kept as an explicit step (not implicit
// on creation) so the freelancer gets a review beat before a client can see
// anything — matches MASTER-PLAN's "taps template, adjusts amount, taps
// share" flow.
export async function POST(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false }, { status: 401 })

  const { data, error } = await supabase
    .from('documents')
    .update({ status: 'sent' })
    .eq('id', id)
    .eq('profile_id', user.id)
    .eq('status', 'draft')
    .select()
    .single()

  if (error || !data) {
    return NextResponse.json({ ok: false, error: error?.message ?? 'Not found or already sent' }, { status: 400 })
  }

  return NextResponse.json({ ok: true, document: data })
}
