import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// The freelancer flags a manual subscription payment (Whish/bank/cash) for the
// founder to confirm. Authenticated (the freelancer's own session); records a
// note only — never marks paid. USDT is auto-confirmed by the watcher instead.
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const formData = await request.formData().catch(() => null)
  const note = (formData?.get('note') as string) ?? ''

  const supabase = await createClient()
  const { data: ok, error } = await supabase.rpc('submit_subscription_claim', {
    p_token: token,
    p_note: note,
  })

  if (error || !ok) {
    return NextResponse.json({ ok: false, error: 'Could not submit — try again shortly' }, { status: 400 })
  }
  return NextResponse.json({ ok: true })
}
