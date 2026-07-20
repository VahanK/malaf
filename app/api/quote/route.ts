import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Public quote request: validated + rate-limited inside the SECURITY DEFINER
// function (docs/SECURITY.md A2); the IP only feeds the rate-limit bucket.
export async function POST(request: Request) {
  let body: { handle?: string; name?: string; phone?: string; message?: string; serviceId?: string | null }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const handle = (body.handle ?? '').trim().toLowerCase()
  const name = (body.name ?? '').trim()
  if (!handle || name.length < 2) {
    return NextResponse.json({ ok: false }, { status: 400 })
  }

  const ip = (request.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim()

  const supabase = await createClient()
  const { data, error } = await supabase.rpc('request_quote', {
    p_handle: handle,
    p_client_name: name,
    p_client_phone: (body.phone ?? '').trim(),
    p_message: (body.message ?? '').trim(),
    p_service_id: body.serviceId || undefined,
    p_bucket: ip,
  })

  if (error || !data) {
    return NextResponse.json({ ok: false }, { status: 429 })
  }
  return NextResponse.json({ ok: true })
}
