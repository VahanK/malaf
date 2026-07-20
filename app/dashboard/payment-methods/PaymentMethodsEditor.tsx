'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

type Kind = 'whish' | 'omt' | 'bob' | 'cashunited' | 'usdt' | 'iban' | 'cash' | 'custom'

interface Method {
  id: string
  kind: Kind
  label: string
  details: Record<string, string>
  fresh_usd: boolean
  active: boolean
}

const KIND_META: Record<Kind, { label: string; field: string; placeholder: string }> = {
  whish: { label: 'Whish', field: 'number', placeholder: '+961 xx xxx xxx' },
  omt: { label: 'OMT', field: 'reference', placeholder: 'Reference / pickup code' },
  bob: { label: 'BOB Finance', field: 'number', placeholder: 'Account number' },
  cashunited: { label: 'CashUnited', field: 'number', placeholder: 'Account number' },
  usdt: { label: 'USDT (TRC-20)', field: 'address', placeholder: 'T… wallet address' },
  iban: { label: 'Bank transfer', field: 'iban', placeholder: 'LB00 0000 0000 0000 0000 0000 0000' },
  cash: { label: 'Cash', field: '', placeholder: '' },
  custom: { label: 'Custom', field: 'note', placeholder: 'Instructions' },
}

export function PaymentMethodsEditor({ initialMethods, profileId }: { initialMethods: Method[]; profileId: string }) {
  const [methods, setMethods] = useState(initialMethods)
  const [kind, setKind] = useState<Kind | ''>('')
  const [value, setValue] = useState('')
  const [freshUsd, setFreshUsd] = useState(false)
  const supabase = createClient()

  const addMethod = async () => {
    if (!kind) return
    const meta = KIND_META[kind]
    const details = meta.field ? { [meta.field]: value } : {}
    const { data, error } = await supabase
      .from('payment_methods')
      .insert({
        profile_id: profileId,
        kind,
        label: meta.label,
        details,
        fresh_usd: kind === 'iban' ? freshUsd : false,
        sort_order: methods.length,
      })
      .select()
      .single()
    if (!error && data) {
      setMethods([...methods, data])
      setKind('')
      setValue('')
      setFreshUsd(false)
    }
  }

  const removeMethod = async (id: string) => {
    await supabase.from('payment_methods').delete().eq('id', id)
    setMethods(methods.filter(m => m.id !== id))
  }

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('payment_methods').update({ active }).eq('id', id)
    setMethods(methods.map(m => (m.id === id ? { ...m, active } : m)))
  }

  return (
    <div className="mt-6 max-w-lg space-y-2">
      {methods.map(m => {
        const meta = KIND_META[m.kind]
        const detail = meta.field ? m.details[meta.field] : ''
        return (
          <div key={m.id} className="flex items-center justify-between rounded-lg border border-dash-border bg-dash-surface px-4 py-3">
            <div>
              <div className="text-sm font-medium text-dash-ink">{m.label}</div>
              {detail && <div className="text-xs text-dash-muted">{maskValue(detail)}</div>}
              {m.fresh_usd && <span className="text-xs text-dash-info">Fresh USD</span>}
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-dash-muted">
                <input type="checkbox" checked={m.active} onChange={e => toggleActive(m.id, e.target.checked)} />
                Live
              </label>
              <button onClick={() => removeMethod(m.id)} className="text-xs text-dash-danger">
                Remove
              </button>
            </div>
          </div>
        )
      })}

      <div className="space-y-2 rounded-lg border border-dashed border-dash-border p-4">
        <select
          value={kind}
          onChange={e => setKind(e.target.value as Kind)}
          className="w-full rounded-lg border border-dash-border px-3 py-2 text-sm outline-none focus:border-dash-accent"
        >
          <option value="">Add a payment method…</option>
          {Object.entries(KIND_META).map(([k, v]) => (
            <option key={k} value={k}>{v.label}</option>
          ))}
        </select>
        {kind && KIND_META[kind].field && (
          <input
            placeholder={KIND_META[kind].placeholder}
            value={value}
            onChange={e => setValue(e.target.value)}
            className="w-full rounded-lg border border-dash-border px-3 py-2 text-sm outline-none focus:border-dash-accent"
          />
        )}
        {kind === 'iban' && (
          <label className="flex items-center gap-1.5 text-xs text-dash-muted">
            <input type="checkbox" checked={freshUsd} onChange={e => setFreshUsd(e.target.checked)} />
            This is a Fresh USD account
          </label>
        )}
        {kind && (
          <button onClick={addMethod} className="rounded-lg bg-dash-accent px-4 py-1.5 text-sm font-medium text-dash-accent-ink">
            Add
          </button>
        )}
      </div>
    </div>
  )
}

function maskValue(v: string) {
  if (v.length <= 4) return v
  return `${'•'.repeat(Math.max(v.length - 4, 4))}${v.slice(-4)}`
}
