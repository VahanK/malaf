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
  const railsIn = Array.isArray(body?.rails) ? body.rails : []
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

  // Payment rails picked in onboarding. kind + label are server-controlled
  // (never trusted from the client); only the freelancer's own detail string
  // (Whish number, USDT address, IBAN) comes through, and only for rails
  // that actually work in-market. Blocked rails (PayPal/Stripe/Wise) are
  // never offered by the client and rejected here if injected.
  const RAIL_META: Record<string, { label: string; field: string }> = {
    whish: { label: 'Whish', field: 'number' },
    usdt: { label: 'USDT (TRC-20)', field: 'address' },
    omt: { label: 'OMT', field: 'reference' },
    iban: { label: 'Bank transfer', field: 'iban' },
    cash: { label: 'Cash', field: '' },
  }
  type RailRow = { profile_id: string; kind: string; label: string; details: Record<string, string>; sort_order: number; active: boolean }
  const railRows: RailRow[] = []
  ;(railsIn as { kind?: string; value?: string }[]).forEach((r, i) => {
    const kind = r.kind ?? ''
    const meta = RAIL_META[kind]
    if (!meta) return
    const value = (r.value ?? '').trim()
    // cash needs no detail; every other rail requires a non-empty value
    if (meta.field && !value) return
    railRows.push({
      profile_id: user.id,
      kind,
      label: meta.label,
      details: meta.field ? { [meta.field]: value } : {},
      sort_order: i,
      active: true,
    })
  })

  if (railRows.length) {
    await supabase.from('payment_methods').insert(railRows)
  }

  return NextResponse.json({ ok: true })
}
