'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

// Phone + OTP sign-in/signup, one flow (Supabase treats first-time phone
// verification as account creation automatically — no separate signup step).
// Requires Twilio Verify configured as Supabase Auth's SMS provider, SMS
// channel ONLY (docs/SECURITY.md 8) — never enable the WhatsApp channel
// checkbox in that same config screen; it routes through Meta's WhatsApp
// Business Platform, which the project's red lines ban outright.
export default function PhoneAuthPage() {
  const [step, setStep] = useState<'phone' | 'code'>('phone')
  const [phone, setPhone] = useState('')
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  const normalizedPhone = () => {
    const digits = phone.replace(/[^\d]/g, '')
    return digits.startsWith('961') ? `+${digits}` : `+961${digits.replace(/^0/, '')}`
  }

  const sendCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: otpError } = await supabase.auth.signInWithOtp({ phone: normalizedPhone() })
    setLoading(false)
    if (otpError) { setError(otpError.message); return }
    setStep('code')
  }

  const verifyCode = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    const { error: verifyError } = await supabase.auth.verifyOtp({
      phone: normalizedPhone(),
      token: code,
      type: 'sms',
    })
    setLoading(false)
    if (verifyError) { setError(verifyError.message); return }
    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-dash-bg px-6">
      <div className="w-full max-w-sm">
        <h1 className="text-2xl font-semibold text-dash-ink">WorkWith</h1>
        <p className="mt-1 text-sm text-dash-muted">
          {step === 'phone' ? 'Sign in with your WhatsApp number' : 'Enter the code we sent you'}
        </p>

        {error && (
          <p className="mt-4 rounded-lg bg-dash-danger/10 px-3 py-2 text-sm text-dash-danger">{error}</p>
        )}

        {step === 'phone' ? (
          <form onSubmit={sendCode} className="mt-6 space-y-3">
            <div className="flex items-center rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5">
              <span className="text-sm text-dash-muted">+961</span>
              <input
                type="tel"
                required
                autoFocus
                inputMode="numeric"
                placeholder="70 123 456"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="ml-2 flex-1 bg-transparent text-sm text-dash-ink outline-none placeholder:text-dash-muted"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-dash-accent py-2.5 text-sm font-semibold text-dash-accent-ink disabled:opacity-60"
            >
              {loading ? 'Sending…' : 'Send code'}
            </button>
          </form>
        ) : (
          <form onSubmit={verifyCode} className="mt-6 space-y-3">
            <input
              type="text"
              required
              autoFocus
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit code"
              value={code}
              onChange={e => setCode(e.target.value)}
              className="w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-center text-lg tracking-widest text-dash-ink outline-none focus:border-dash-accent"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-dash-accent py-2.5 text-sm font-semibold text-dash-accent-ink disabled:opacity-60"
            >
              {loading ? 'Verifying…' : 'Verify & continue'}
            </button>
            <button
              type="button"
              onClick={() => setStep('phone')}
              className="w-full text-center text-sm text-dash-muted underline"
            >
              Use a different number
            </button>
          </form>
        )}

        <p className="mt-6 text-center text-sm text-dash-muted">
          Prefer email?{' '}
          <Link href="/auth/signin" className="font-medium text-dash-ink underline">
            Sign in with email
          </Link>
        </p>
      </div>
    </main>
  )
}
