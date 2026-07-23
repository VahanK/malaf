'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { computeTotals, formatMoney, type LineItem } from '@/lib/documents'

interface ServiceOption {
  title: string
  title_ar: string
  price: number
  unit: LineItem['unit']
}

interface Prefill { name: string; phone: string; note: string; service: string }

export function NewQuoteForm({ services, prefill }: { services: ServiceOption[]; prefill?: Prefill }) {
  const [clientName, setClientName] = useState(prefill?.name ?? '')
  const [clientPhone, setClientPhone] = useState(prefill?.phone ?? '')
  const [language, setLanguage] = useState<'en' | 'ar'>('en')
  const [currency, setCurrency] = useState<'USD' | 'LBP'>('USD')
  // Seed the first line item from the request: the service they asked for if it
  // matches, else a blank line titled with what they wrote.
  const [items, setItems] = useState<LineItem[]>(() => {
    if (!prefill) return []
    const matched = prefill.service ? services.find(s => s.title === prefill.service) : undefined
    if (matched) return [{ title: matched.title, title_ar: matched.title_ar, qty: 1, unit_price: matched.price, unit: matched.unit }]
    if (prefill.note || prefill.service) return [{ title: prefill.service || prefill.note.slice(0, 60), qty: 1, unit_price: 0, unit: 'project' }]
    return []
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const addFromService = (s: ServiceOption) => {
    setItems([...items, { title: s.title, title_ar: s.title_ar, qty: 1, unit_price: s.price, unit: s.unit }])
  }

  const addBlank = () => {
    setItems([...items, { title: '', qty: 1, unit_price: 0, unit: 'project' }])
  }

  const updateItem = (i: number, patch: Partial<LineItem>) => {
    setItems(items.map((item, idx) => (idx === i ? { ...item, ...patch } : item)))
  }

  const removeItem = (i: number) => setItems(items.filter((_, idx) => idx !== i))

  const { subtotal, total } = computeTotals(items, 0)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await fetch('/api/documents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_name: clientName,
        client_phone: clientPhone,
        language,
        currency,
        line_items: items,
      }),
    })
    const json = await res.json()
    setLoading(false)
    if (!json.ok) { setError(json.error ?? 'Something went wrong'); return }
    router.push(`/dashboard/quotes/${json.document.id}`)
  }

  return (
    <form onSubmit={submit} className="mt-6 max-w-lg space-y-5">
      <div className="grid grid-cols-2 gap-3">
        <input
          required
          placeholder="Client name"
          value={clientName}
          onChange={e => setClientName(e.target.value)}
          className="rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
        />
        <input
          placeholder="WhatsApp number"
          value={clientPhone}
          onChange={e => setClientPhone(e.target.value)}
          className="rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <select
          value={language}
          onChange={e => setLanguage(e.target.value as 'en' | 'ar')}
          className="rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
        >
          <option value="en">Document in English</option>
          <option value="ar">Document in Arabic</option>
        </select>
        <select
          value={currency}
          onChange={e => setCurrency(e.target.value as 'USD' | 'LBP')}
          className="rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
        >
          <option value="USD">USD</option>
          <option value="LBP">LBP</option>
        </select>
      </div>

      <div>
        <label className="text-sm font-medium text-dash-ink">Line items</label>
        <div className="mt-2 space-y-2">
          {items.map((item, i) => (
            <div key={i} className="flex items-center gap-2 rounded-lg border border-dash-border bg-dash-surface p-2">
              <input
                placeholder="Title"
                value={item.title}
                onChange={e => updateItem(i, { title: e.target.value })}
                className="flex-1 rounded border border-dash-border px-2 py-1.5 text-sm outline-none focus:border-dash-accent"
              />
              <input
                type="number"
                min={0}
                placeholder="Price"
                value={item.unit_price || ''}
                onChange={e => updateItem(i, { unit_price: Number(e.target.value) })}
                className="w-20 rounded border border-dash-border px-2 py-1.5 text-sm outline-none focus:border-dash-accent"
              />
              <input
                type="number"
                min={1}
                value={item.qty}
                onChange={e => updateItem(i, { qty: Number(e.target.value) || 1 })}
                className="w-14 rounded border border-dash-border px-2 py-1.5 text-sm outline-none focus:border-dash-accent"
              />
              <button type="button" onClick={() => removeItem(i)} className="text-xs text-dash-danger">
                ✕
              </button>
            </div>
          ))}
        </div>

        {services.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {services.map((s, i) => (
              <button
                key={i}
                type="button"
                onClick={() => addFromService(s)}
                className="rounded-lg border border-dashed border-dash-border px-2.5 py-1 text-xs text-dash-muted hover:border-dash-accent hover:text-dash-ink"
              >
                + {s.title}
              </button>
            ))}
          </div>
        )}
        <button
          type="button"
          onClick={addBlank}
          className="mt-2 rounded-lg border border-dashed border-dash-border px-2.5 py-1 text-xs text-dash-muted hover:border-dash-accent hover:text-dash-ink"
        >
          + Custom line
        </button>
      </div>

      {items.length > 0 && (
        <div className="rounded-lg bg-dash-surface p-3 text-sm">
          <div className="flex justify-between text-dash-muted">
            <span>Subtotal</span>
            <span>{formatMoney(subtotal, currency)}</span>
          </div>
          <div className="mt-1 flex justify-between font-semibold text-dash-ink">
            <span>Total</span>
            <span>{formatMoney(total, currency)}</span>
          </div>
        </div>
      )}

      {error && <p className="rounded-lg bg-dash-danger/10 px-3 py-2 text-sm text-dash-danger">{error}</p>}

      <button
        type="submit"
        disabled={loading || items.length === 0}
        className="rounded-lg bg-dash-accent px-5 py-2.5 text-sm font-semibold text-dash-accent-ink disabled:opacity-40"
      >
        {loading ? 'Creating…' : 'Create quote (draft)'}
      </button>
    </form>
  )
}
