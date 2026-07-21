import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

// Tier-1 USDT watcher (plan §0/§7). Reads the freelancer's OWN address via
// TronGrid's public chain-read API — Malaf never holds a key or moves funds,
// it only observes a public ledger and calls confirm_payment_system when a
// transfer matches. No custody, no wallet API integration (CLAUDE.md red lines).

const USDT_TRC20_CONTRACT = 'TR7NHqjeKQxGTCi8q8ZY4pL8otSzgjLj6t'
const TRONGRID_BASE = 'https://api.trongrid.io'
// TronGrid amounts are integer strings in the token's smallest unit; USDT-TRC20 has 6 decimals.
const USDT_DECIMALS = 6
// Loose float-safe match window — invoice amounts are 2-decimal USD, chain amounts are exact.
const MATCH_EPSILON = 0.005

interface Trc20Transfer {
  transaction_id: string
  token_info: { address: string }
  from: string
  to: string
  value: string
  type: string
}

export async function GET(request: Request) {
  const authHeader = request.headers.get('authorization')
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()

  // Pending invoices with a live USDT reference — these are the only ones
  // that can possibly be matched this run.
  const { data: pending, error: pendingError } = await admin
    .from('documents')
    .select('id, profile_id, total, usdt_reference, doc_number')
    .eq('type', 'invoice')
    .in('status', ['sent', 'approved'])
    .not('usdt_reference', 'is', null)

  if (pendingError) {
    return NextResponse.json({ ok: false, error: pendingError.message }, { status: 500 })
  }
  if (!pending?.length) {
    return NextResponse.json({ ok: true, checked: 0, matched: 0 })
  }

  // Group by profile so each freelancer's USDT address is fetched once,
  // not once per invoice.
  const profileIds = [...new Set(pending.map(d => d.profile_id))]
  const { data: methods } = await admin
    .from('payment_methods')
    .select('profile_id, details')
    .eq('kind', 'usdt')
    .eq('active', true)
    .in('profile_id', profileIds)

  const addressByProfile = new Map<string, string>()
  for (const m of methods ?? []) {
    const address = (m.details as Record<string, string>)?.address
    if (address) addressByProfile.set(m.profile_id, address)
  }

  let matched = 0
  const errors: string[] = []

  for (const profileId of profileIds) {
    const address = addressByProfile.get(profileId)
    if (!address) continue

    const invoicesForProfile = pending.filter(d => d.profile_id === profileId)

    let transfers: Trc20Transfer[]
    try {
      transfers = await fetchRecentTransfers(address)
    } catch (err) {
      errors.push(`${profileId}: ${err instanceof Error ? err.message : 'fetch failed'}`)
      continue
    }

    for (const invoice of invoicesForProfile) {
      const targetAmount = invoice.total + Number(invoice.usdt_reference) / 100
      const hit = transfers.find(tx =>
        tx.to === address &&
        tx.token_info.address === USDT_TRC20_CONTRACT &&
        Math.abs(Number(tx.value) / 10 ** USDT_DECIMALS - targetAmount) < MATCH_EPSILON
      )
      if (!hit) continue

      const { data: confirmed, error: confirmError } = await admin.rpc('confirm_payment_system', {
        p_document_id: invoice.id,
        p_usdt_tx_hash: hit.transaction_id,
      })
      if (confirmError || !confirmed) {
        errors.push(`invoice ${invoice.id}: confirm failed — ${confirmError?.message ?? 'no result'}`)
        continue
      }
      matched++
    }
  }

  await admin
    .from('usdt_watcher_state')
    .update({ last_checked_block: 0, updated_at: new Date().toISOString() })
    .eq('id', 1)

  return NextResponse.json({ ok: true, checked: pending.length, matched, errors: errors.length ? errors : undefined })
}

async function fetchRecentTransfers(address: string): Promise<Trc20Transfer[]> {
  const url = `${TRONGRID_BASE}/v1/accounts/${address}/transactions/trc20?limit=50&only_to=true&contract_address=${USDT_TRC20_CONTRACT}`
  const headers: Record<string, string> = {}
  if (process.env.TRONGRID_API_KEY) headers['TRON-PRO-API-KEY'] = process.env.TRONGRID_API_KEY

  const res = await fetch(url, { headers })
  if (!res.ok) throw new Error(`TronGrid ${res.status}`)
  const json = await res.json()
  return (json.data ?? []) as Trc20Transfer[]
}
