import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Owner-authenticated, one-shot: claims a handle + preset, seeds starter
// services/blocks from the preset config. Not anonymous, so no rate limit
// or SECURITY DEFINER wrapper needed (matches services/payment_methods'
// plain-RLS convention — the actor is always the authenticated owner).
export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ ok: false, error: 'unauthorized' }, { status: 401 })

  const body = await request.json().catch(() => null)
  const handle = (body?.handle ?? '').trim().toLowerCase()
  const presetKey = body?.preset ?? ''
  const fullName = (body?.full_name ?? '').trim()
  const title = (body?.title ?? '').trim()
  const whatsapp = (body?.whatsapp_number ?? '').trim()
  if (!handle || !presetKey || fullName.length < 2) {
    return NextResponse.json({ ok: false, error: 'missing handle, preset, or name' }, { status: 400 })
  }

  const { data: available } = await supabase.rpc('is_handle_available', { candidate: handle })
  if (!available) {
    return NextResponse.json({ ok: false, error: 'handle taken or invalid' }, { status: 400 })
  }

  const { data: preset } = await supabase
    .from('presets')
    .select('key, label, accent_color, config')
    .eq('key', presetKey)
    .single()
  if (!preset) return NextResponse.json({ ok: false, error: 'unknown preset' }, { status: 400 })

  const { error: profileError } = await supabase
    .from('profiles')
    .update({
      handle,
      preset: preset.key,
      accent_color: preset.accent_color,
      full_name: fullName,
      title: title || preset.label,
      whatsapp_number: whatsapp,
    })
    .eq('id', user.id)
  if (profileError) return NextResponse.json({ ok: false, error: profileError.message }, { status: 400 })

  const config = preset.config as {
    sample_services?: { title: string; title_ar?: string; price: number; unit: string; starting_from?: boolean; package_qty?: number }[]
    block_order?: string[]
  }

  if (config.sample_services?.length) {
    await supabase.from('services').insert(
      config.sample_services.map((s, i) => ({
        profile_id: user.id,
        title: s.title,
        title_ar: s.title_ar ?? '',
        price: s.price,
        unit: s.unit,
        starting_from: s.starting_from ?? false,
        package_qty: s.package_qty ?? null,
        sort_order: i,
      }))
    )
  }

  if (config.block_order?.length) {
    await supabase.from('portfolio_blocks').insert(
      config.block_order.map((type, i) => ({
        profile_id: user.id,
        type,
        position: i,
        data: {},
        active: false, // empty starter blocks stay hidden until the freelancer fills them in
      }))
    )
  }

  return NextResponse.json({ ok: true })
}
