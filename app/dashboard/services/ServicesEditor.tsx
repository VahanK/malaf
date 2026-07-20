'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface Service {
  id: string
  title: string
  title_ar: string
  price: number
  currency: 'USD' | 'LBP'
  unit: 'project' | 'session' | 'hour' | 'event' | 'day' | 'month'
  starting_from: boolean
  active: boolean
  sort_order: number
}

const UNITS: Service['unit'][] = ['project', 'session', 'hour', 'event', 'day', 'month']
const EMPTY: Omit<Service, 'id' | 'sort_order'> = {
  title: '', title_ar: '', price: 0, currency: 'USD', unit: 'project', starting_from: false, active: true,
}

export function ServicesEditor({ initialServices, profileId }: { initialServices: Service[]; profileId: string }) {
  const [services, setServices] = useState(initialServices)
  const [draft, setDraft] = useState<typeof EMPTY | null>(null)
  const supabase = createClient()

  const addService = async () => {
    if (!draft || !draft.title || draft.price <= 0) return
    const { data, error } = await supabase
      .from('services')
      .insert({ ...draft, profile_id: profileId, sort_order: services.length })
      .select()
      .single()
    if (!error && data) {
      setServices([...services, data])
      setDraft(null)
    }
  }

  const removeService = async (id: string) => {
    await supabase.from('services').delete().eq('id', id)
    setServices(services.filter(s => s.id !== id))
  }

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('services').update({ active }).eq('id', id)
    setServices(services.map(s => (s.id === id ? { ...s, active } : s)))
  }

  return (
    <div className="mt-6 max-w-lg space-y-2">
      {services.map(s => (
        <div key={s.id} className="flex items-center justify-between rounded-lg border border-dash-border bg-dash-surface px-4 py-3">
          <div>
            <div className="text-sm font-medium text-dash-ink">{s.title}</div>
            <div className="text-xs text-dash-muted">
              {s.currency === 'USD' ? '$' : 'LBP '}{s.price.toLocaleString()}{s.starting_from ? '+' : ''} · {s.unit}
            </div>
          </div>
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-1.5 text-xs text-dash-muted">
              <input type="checkbox" checked={s.active} onChange={e => toggleActive(s.id, e.target.checked)} />
              Live
            </label>
            <button onClick={() => removeService(s.id)} className="text-xs text-dash-danger">
              Remove
            </button>
          </div>
        </div>
      ))}

      {draft ? (
        <div className="space-y-2 rounded-lg border border-dash-accent bg-dash-surface p-4">
          <input
            autoFocus
            placeholder="Service title"
            value={draft.title}
            onChange={e => setDraft({ ...draft, title: e.target.value })}
            className="w-full rounded-lg border border-dash-border px-3 py-2 text-sm outline-none focus:border-dash-accent"
          />
          <div className="flex gap-2">
            <input
              type="number"
              min={0}
              placeholder="Price"
              value={draft.price || ''}
              onChange={e => setDraft({ ...draft, price: Number(e.target.value) })}
              className="w-24 rounded-lg border border-dash-border px-3 py-2 text-sm outline-none focus:border-dash-accent"
            />
            <select
              value={draft.unit}
              onChange={e => setDraft({ ...draft, unit: e.target.value as Service['unit'] })}
              className="flex-1 rounded-lg border border-dash-border px-3 py-2 text-sm outline-none focus:border-dash-accent"
            >
              {UNITS.map(u => <option key={u} value={u}>per {u}</option>)}
            </select>
          </div>
          <label className="flex items-center gap-1.5 text-xs text-dash-muted">
            <input
              type="checkbox"
              checked={draft.starting_from}
              onChange={e => setDraft({ ...draft, starting_from: e.target.checked })}
            />
            Starting from (show as &quot;+&quot;)
          </label>
          <div className="flex gap-2">
            <button onClick={addService} className="rounded-lg bg-dash-accent px-4 py-1.5 text-sm font-medium text-dash-accent-ink">
              Add
            </button>
            <button onClick={() => setDraft(null)} className="rounded-lg border border-dash-border px-4 py-1.5 text-sm">
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setDraft(EMPTY)}
          className="w-full rounded-lg border border-dashed border-dash-border py-2.5 text-sm text-dash-muted hover:border-dash-accent hover:text-dash-ink"
        >
          + Add a service
        </button>
      )}
    </div>
  )
}
