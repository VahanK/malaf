'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function SignUpPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [fullName, setFullName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    if (signUpError) {
      setError(signUpError.message)
      setLoading(false)
      return
    }

    // The profiles row is created server-side by a DB trigger on auth.users
    // insert (migration 006) — not here, since no session exists yet when
    // email confirmation is required, and an RLS insert policy needs auth.uid().

    // Email verification required before a page goes public (SECURITY.md D8)
    if (!data.session) {
      setSent(true)
      setLoading(false)
      return
    }

    router.push('/onboarding')
  }

  if (sent) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-dash-bg px-6">
        <div className="max-w-sm text-center">
          <h1 className="text-xl font-semibold text-dash-ink">Check your email</h1>
          <p className="mt-2 text-sm text-dash-muted">
            We sent a confirmation link to {email}. Confirm it to finish setting up your page.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-dash-bg px-6">
      <form onSubmit={handleSubmit} className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-dash-ink lowercase">malaf</h1>
        <p className="mt-1 text-sm text-dash-muted">Create your account</p>

        {error && (
          <p className="mt-4 rounded-lg bg-dash-danger/10 px-3 py-2 text-sm text-dash-danger">
            {error}
          </p>
        )}

        <div className="mt-6 space-y-3">
          <input
            type="text"
            required
            placeholder="Your name"
            value={fullName}
            onChange={e => setFullName(e.target.value)}
            className="w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm text-dash-ink outline-none placeholder:text-dash-muted focus:border-dash-accent"
          />
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
            minLength={8}
            placeholder="Password (8+ characters)"
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
          {loading ? 'Creating account…' : 'Create account'}
        </button>

        <p className="mt-4 text-center text-sm text-dash-muted">
          Already have an account?{' '}
          <Link href="/auth/signin" className="font-medium text-dash-ink underline">
            Sign in
          </Link>
        </p>
      </form>
    </main>
  )
}
