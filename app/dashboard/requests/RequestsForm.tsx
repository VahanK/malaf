'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export function RequestsForm() {
  const router = useRouter()
  const supabase = createClient()
  const [body, setBody] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [sent, setSent] = useState(false)

  const submit = async () => {
    if (!body.trim()) return
    setBusy(true)
    setError(null)
    const { data: { user } } = await supabase.auth.getUser()
    const { error: insertError } = await supabase
      .from('feature_requests')
      .insert({ profile_id: user!.id, body: body.trim() })
    setBusy(false)
    if (insertError) {
      setError("Couldn't send — try again shortly.")
      return
    }
    setBody('')
    setSent(true)
    setTimeout(() => setSent(false), 3000)
    router.refresh()
  }

  return (
    <div className="mt-4 rounded-lg border border-dash-border bg-dash-surface p-4">
      <textarea
        rows={3}
        placeholder="e.g. I need a way to add a deposit / booking fee before the full invoice"
        value={body}
        onChange={e => setBody(e.target.value)}
        className="w-full resize-none rounded-lg border border-dash-border bg-dash-bg px-3 py-2 text-sm outline-none placeholder:text-dash-muted focus:border-dash-accent"
      />
      {error && <p className="mt-2 text-xs text-dash-danger">{error}</p>}
      <div className="mt-2 flex items-center gap-3">
        <button
          onClick={submit}
          disabled={busy || !body.trim()}
          className="rounded-lg bg-dash-accent px-4 py-2 text-sm font-semibold text-dash-accent-ink disabled:opacity-60"
        >
          {busy ? 'Sending…' : 'Send request'}
        </button>
        {sent && <span className="text-xs text-dash-success">Sent — thanks!</span>}
      </div>
    </div>
  )
}
