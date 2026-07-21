import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { NextResponse } from 'next/server'

const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp']
const MAX_SIZE = 10 * 1024 * 1024

// Anonymous upload — the client has no auth.uid(), so this goes through the
// service-role client server-side rather than a storage RLS policy (plan §2).
// Validated + rate-limited (via submit_payment_claim's own rate limit) before
// touching storage, per SECURITY.md B5.
export async function POST(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const formData = await request.formData().catch(() => null)
  const file = formData?.get('file') as File | null
  const note = (formData?.get('note') as string) ?? ''

  const supabase = await createClient()
  const { data: resolved } = await supabase.rpc('resolve_access_token', { p_token: token })
  if (!resolved || resolved.scope !== 'pay') {
    return NextResponse.json({ ok: false, error: 'Invalid or expired link' }, { status: 400 })
  }

  let proofPath: string | null = null

  if (file) {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ ok: false, error: 'Invalid file type' }, { status: 400 })
    }
    if (file.size > MAX_SIZE) {
      return NextResponse.json({ ok: false, error: 'File too large' }, { status: 400 })
    }

    const admin = createAdminClient()
    const ext = file.name.split('.').pop() || 'jpg'
    const path = `${resolved.profile_id}/${resolved.subject_id}/${crypto.randomUUID()}.${ext}`
    const { error: uploadError } = await admin.storage.from('payment-proofs').upload(path, file, {
      contentType: file.type,
    })
    if (uploadError) {
      return NextResponse.json({ ok: false, error: uploadError.message }, { status: 500 })
    }
    proofPath = path
  }

  const { data: claimed, error } = await supabase.rpc('submit_payment_claim', {
    p_token: token,
    p_proof_path: proofPath,
    p_note: note,
    p_bucket: request.headers.get('x-forwarded-for')?.split(',')[0].trim() ?? 'unknown',
  })

  if (error || !claimed) {
    return NextResponse.json({ ok: false, error: 'Could not submit — try again shortly' }, { status: 429 })
  }

  return NextResponse.json({ ok: true })
}
