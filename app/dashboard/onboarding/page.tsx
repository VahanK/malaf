'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface Preset {
  key: string
  label: string
  accent_color: string
}

export default function OnboardingPage() {
  const [presets, setPresets] = useState<Preset[]>([])
  const [preset, setPreset] = useState('')
  const [handle, setHandle] = useState('')
  const [handleStatus, setHandleStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('presets')
      .select('key, label, accent_color')
      .then(({ data }) => setPresets(data ?? []))
  }, [supabase])

  useEffect(() => {
    if (handle.length < 3) { setHandleStatus('idle'); return }
    setHandleStatus('checking')
    const t = setTimeout(async () => {
      const { data } = await supabase.rpc('is_handle_available', { candidate: handle.toLowerCase() })
      setHandleStatus(data ? 'available' : 'taken')
    }, 400)
    return () => clearTimeout(t)
  }, [handle, supabase])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ handle, preset }),
    })
    const json = await res.json()
    if (!json.ok) {
      setError(json.error ?? 'Something went wrong')
      setLoading(false)
      return
    }
    router.push('/dashboard')
    router.refresh()
  }

  const canSubmit = preset && handleStatus === 'available' && !loading

  return (
    <main className="min-h-screen bg-dash-bg px-6 py-12">
      <form onSubmit={submit} className="mx-auto max-w-md">
        <h1 className="text-xl font-semibold text-dash-ink">Set up your page</h1>
        <p className="mt-1 text-sm text-dash-muted">Two things, then you&apos;re live.</p>

        <div className="mt-6">
          <label className="text-sm font-medium text-dash-ink">What do you do?</label>
          <div className="mt-2 grid grid-cols-2 gap-2">
            {presets.map(p => (
              <button
                key={p.key}
                type="button"
                onClick={() => setPreset(p.key)}
                className={`rounded-lg border px-3 py-2.5 text-left text-sm ${
                  preset === p.key ? 'border-dash-accent bg-dash-accent/10' : 'border-dash-border bg-dash-surface'
                }`}
              >
                <span
                  className="mr-2 inline-block h-2.5 w-2.5 rounded-full"
                  style={{ background: p.accent_color }}
                />
                {p.label}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-6">
          <label className="text-sm font-medium text-dash-ink">Pick your handle</label>
          <div className="mt-2 flex items-center rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5">
            <span className="text-sm text-dash-muted">malaf.work/</span>
            <input
              value={handle}
              onChange={e => setHandle(e.target.value.toLowerCase())}
              placeholder="yourname"
              className="flex-1 bg-transparent text-sm text-dash-ink outline-none"
            />
          </div>
          {handleStatus === 'taken' && <p className="mt-1 text-xs text-dash-danger">Already taken or invalid.</p>}
          {handleStatus === 'available' && <p className="mt-1 text-xs text-dash-success">Available.</p>}
        </div>

        {error && (
          <p className="mt-4 rounded-lg bg-dash-danger/10 px-3 py-2 text-sm text-dash-danger">{error}</p>
        )}

        <button
          type="submit"
          disabled={!canSubmit}
          className="mt-6 w-full rounded-lg bg-dash-accent py-2.5 text-sm font-semibold text-dash-accent-ink disabled:opacity-40"
        >
          {loading ? 'Setting up…' : 'Create my page'}
        </button>
      </form>
    </main>
  )
}
