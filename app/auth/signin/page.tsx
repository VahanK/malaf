'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })

    if (signInError) {
      setError(signInError.message)
      setLoading(false)
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-dash-bg px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-dash-ink lowercase">malaf</h1>
        <p className="mt-1 text-sm text-dash-muted">Sign in to your dashboard</p>

        {error && (
          <p className="mt-4 rounded-lg bg-dash-danger/10 px-3 py-2 text-sm text-dash-danger">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-3">
          <input
            type="email"
            required
            placeholder="you@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            className="w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm text-dash-ink outline-none placeholder:text-dash-muted focus:border-dash-accent"
          />
          <input
            type="password"
            required
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm text-dash-ink outline-none placeholder:text-dash-muted focus:border-dash-accent"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-5 w-full rounded-lg bg-dash-accent py-2.5 text-sm font-semibold text-dash-accent-ink disabled:opacity-60"
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </button>

        <p className="mt-4 text-center text-sm text-dash-muted">
          New here?{' '}
          <Link href="/auth/signup" className="font-medium text-dash-ink underline">
            Create an account
          </Link>
        </p>
        <p className="mt-2 text-center text-sm text-dash-muted">
          Prefer your phone?{' '}
          <Link href="/auth/phone" className="font-medium text-dash-ink underline">
            Sign in with WhatsApp number
          </Link>
        </p>
      </form>
    </main>
  )
}
