'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { buildFounderWa } from '@/lib/founder'

interface SampleService { title: string; price: number | null; unit: string; starting_from?: boolean }
interface Preset {
  key: string
  label: string
  accent_color: string
  config: { sample_services?: SampleService[] } | null
}

const slugify = (name: string) =>
  name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9]+/g, '')
    .slice(0, 24)

// Onboarding as a product demo: three short steps, and the freelancer's own
// card visibly assembles itself in the preview while they type — the first
// impression IS the pitch (pattern studied from linkishop.com's flow).
export default function OnboardingPage() {
  const [step, setStep] = useState(0)
  const [fullName, setFullName] = useState('')
  const [handle, setHandle] = useState('')
  const [handleTouched, setHandleTouched] = useState(false)
  const [handleStatus, setHandleStatus] = useState<'idle' | 'checking' | 'available' | 'taken'>('idle')
  const [presets, setPresets] = useState<Preset[]>([])
  const [presetKey, setPresetKey] = useState('')
  const [title, setTitle] = useState('')
  const [whatsapp, setWhatsapp] = useState('')
  // Payment rails — Lebanon's working rails only (Can-I-Get-Paid data,
  // Jul 22): Whish + USDT are the "✅ WORKS" pair, IBAN/cash optional.
  // Blocked rails (PayPal/Stripe/Wise/Payoneer) are deliberately never shown.
  const [whishNumber, setWhishNumber] = useState('')
  const [usdtAddress, setUsdtAddress] = useState('')
  const [ibanValue, setIbanValue] = useState('')
  const [cashOn, setCashOn] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  useEffect(() => {
    supabase
      .from('presets')
      .select('key, label, accent_color, config')
      .then(({ data }) => setPresets((data as Preset[]) ?? []))
  }, [supabase])

  // handle follows the name until the freelancer edits it themselves
  useEffect(() => {
    if (!handleTouched) setHandle(slugify(fullName))
  }, [fullName, handleTouched])

  useEffect(() => {
    if (handle.length < 3) { setHandleStatus('idle'); return }
    setHandleStatus('checking')
    const t = setTimeout(async () => {
      const { data } = await supabase.rpc('is_handle_available', { candidate: handle })
      setHandleStatus(data ? 'available' : 'taken')
    }, 400)
    return () => clearTimeout(t)
  }, [handle, supabase])

  const preset = useMemo(() => presets.find(p => p.key === presetKey) ?? null, [presets, presetKey])
  const accent = preset?.accent_color ?? '#c9a45c'
  const sampleServices = preset?.config?.sample_services?.slice(0, 3) ?? []

  const launch = async () => {
    setError(null)
    setLoading(true)
    const rails = [
      whishNumber.trim() && { kind: 'whish', value: whishNumber.trim() },
      usdtAddress.trim() && { kind: 'usdt', value: usdtAddress.trim() },
      ibanValue.trim() && { kind: 'iban', value: ibanValue.trim() },
      cashOn && { kind: 'cash', value: '' },
    ].filter(Boolean)
    const res = await fetch('/api/onboarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        handle,
        preset: presetKey,
        full_name: fullName,
        title,
        whatsapp_number: whatsapp,
        rails,
      }),
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

  const step0Done = fullName.trim().length >= 2 && handleStatus === 'available'
  const step1Done = !!presetKey
  // The concierge escape hatch — a link to the founder's own WhatsApp for
  // anyone who'd rather have their page set up for them (vahan, Jul 22).
  // Uses the single FOUNDER_PHONE source of truth (lib/founder.ts).
  const conciergeWa = buildFounderWa("Hi! I'd like help setting up my WorkWith page.")

  return (
    <main className="min-h-screen bg-dash-bg px-6 py-10 text-dash-ink">
      <div className="mx-auto max-w-4xl">
        {/* progress dots */}
        <div className="flex items-center justify-center gap-1.5">
          {[0, 1, 2, 3].map(i => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === step ? 'w-6 bg-dash-accent' : 'w-1.5 bg-dash-border'
              }`}
            />
          ))}
        </div>

        <div className="mx-auto mt-6 w-fit rounded-full border border-dash-border bg-dash-surface px-4 py-1.5 text-center text-xs font-medium text-dash-muted">
          Free · no credit card · no strings
        </div>

        <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px]">
          {/* form column */}
          <div className="mx-auto w-full max-w-md">
            {step === 0 && (
              <div className="card-reveal">
                <p className="text-xs font-bold text-dash-accent">Takes about 2 minutes.</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">Claim your card</h1>
                <p className="mt-1.5 text-sm text-dash-muted">
                  Your name, your link. We&apos;ll suggest the link automatically — short ones go fast.
                </p>

                <label className="mt-6 block text-sm font-medium">Your name</label>
                <input
                  autoFocus
                  value={fullName}
                  onChange={e => setFullName(e.target.value)}
                  maxLength={80}
                  placeholder="e.g. Rami Haddad"
                  className="mt-2 w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
                />

                <label className="mt-4 block text-sm font-medium">Your link</label>
                <div className="mt-2 flex items-center rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5">
                  <span className="text-sm text-dash-muted">work-withme.com/</span>
                  <input
                    value={handle}
                    onChange={e => { setHandleTouched(true); setHandle(slugify(e.target.value)) }}
                    placeholder="yourname"
                    className="flex-1 bg-transparent text-sm outline-none"
                  />
                  {handleStatus === 'available' && <span className="text-xs text-dash-success">✓ yours</span>}
                  {handleStatus === 'taken' && <span className="text-xs text-dash-danger">taken</span>}
                  {handleStatus === 'checking' && <span className="text-xs text-dash-muted">…</span>}
                </div>

                <button
                  onClick={() => setStep(1)}
                  disabled={!step0Done}
                  className="mt-6 w-full rounded-xl bg-dash-accent py-3 text-sm font-bold text-dash-accent-ink transition-transform active:scale-[0.99] disabled:opacity-40"
                >
                  Continue
                </button>
              </div>
            )}

            {step === 1 && (
              <div className="card-reveal">
                <h1 className="text-2xl font-semibold tracking-tight">What do you do?</h1>
                <p className="mt-1.5 text-sm text-dash-muted">
                  We&apos;ll set your card up with the right blocks and starter prices — you can change
                  everything later.
                </p>

                <div className="mt-6 grid grid-cols-2 gap-2">
                  {presets.map(p => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setPresetKey(p.key)}
                      className={`rounded-xl border px-3 py-3 text-left text-sm transition-all ${
                        presetKey === p.key
                          ? 'border-dash-accent bg-dash-accent/10 shadow-sm'
                          : 'border-dash-border bg-dash-surface hover:border-dash-muted'
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

                <label className="mt-5 block text-sm font-medium">
                  Your title <span className="font-normal text-dash-muted">(optional, shows under your name)</span>
                </label>
                <input
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  maxLength={120}
                  placeholder="e.g. Wedding & Events Photographer · Beirut"
                  className="mt-2 w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
                />

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setStep(0)}
                    className="rounded-xl border border-dash-border px-5 py-3 text-sm font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(2)}
                    disabled={!step1Done}
                    className="flex-1 rounded-xl bg-dash-accent py-3 text-sm font-bold text-dash-accent-ink transition-transform active:scale-[0.99] disabled:opacity-40"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="card-reveal">
                <h1 className="text-2xl font-semibold tracking-tight">How do you get paid?</h1>
                <p className="mt-1.5 text-sm text-dash-muted">
                  These show on your invoices and pay page. Add what you use — you can change or add
                  more later. Everything&apos;s optional.
                </p>

                <label className="mt-6 block text-sm font-medium">Whish number</label>
                <input
                  value={whishNumber}
                  onChange={e => setWhishNumber(e.target.value)}
                  maxLength={30}
                  inputMode="tel"
                  placeholder="+961 …"
                  className="mt-2 w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
                />

                <label className="mt-4 block text-sm font-medium">
                  USDT wallet <span className="font-normal text-dash-muted">(TRC-20 — foreign clients pay you directly)</span>
                </label>
                <input
                  value={usdtAddress}
                  onChange={e => setUsdtAddress(e.target.value)}
                  maxLength={80}
                  placeholder="T…"
                  className="mt-2 w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
                />

                <label className="mt-4 block text-sm font-medium">
                  Bank IBAN <span className="font-normal text-dash-muted">(optional)</span>
                </label>
                <input
                  value={ibanValue}
                  onChange={e => setIbanValue(e.target.value)}
                  maxLength={40}
                  placeholder="LB.."
                  className="mt-2 w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
                />

                <label className="mt-4 flex items-center gap-2 text-sm">
                  <input type="checkbox" checked={cashOn} onChange={e => setCashOn(e.target.checked)} />
                  I also take cash
                </label>

                <p className="mt-4 rounded-lg bg-dash-surface px-3 py-2 text-xs text-dash-muted">
                  💡 In Lebanon, Whish (local clients) + USDT (everyone else) covers almost everyone —
                  no PayPal/Stripe needed.
                </p>

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setStep(1)}
                    className="rounded-xl border border-dash-border px-5 py-3 text-sm font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={() => setStep(3)}
                    className="flex-1 rounded-xl bg-dash-accent py-3 text-sm font-bold text-dash-accent-ink transition-transform active:scale-[0.99]"
                  >
                    Continue
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div className="card-reveal">
                <p className="text-xs font-bold uppercase tracking-wide text-dash-accent">Final step</p>
                <h1 className="mt-1 text-2xl font-semibold tracking-tight">Connect your WhatsApp</h1>
                <p className="mt-1.5 text-sm text-dash-muted">
                  Quote requests and client messages land here — it&apos;s where your business already
                  lives.
                </p>

                <label className="mt-6 block text-sm font-medium">WhatsApp number</label>
                <input
                  autoFocus
                  value={whatsapp}
                  onChange={e => setWhatsapp(e.target.value)}
                  maxLength={20}
                  inputMode="tel"
                  placeholder="+961 70 123 456"
                  className="mt-2 w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
                />
                <p className="mt-1.5 text-xs text-dash-muted">Include the country code (e.g. +961)</p>

                {error && (
                  <p className="mt-4 rounded-lg bg-dash-danger/10 px-3 py-2 text-sm text-dash-danger">{error}</p>
                )}

                <div className="mt-6 flex gap-2">
                  <button
                    onClick={() => setStep(2)}
                    className="rounded-xl border border-dash-border px-5 py-3 text-sm font-medium"
                  >
                    Back
                  </button>
                  <button
                    onClick={launch}
                    disabled={loading || whatsapp.trim().length < 8}
                    className="flex-1 rounded-xl bg-dash-accent py-3 text-sm font-bold text-dash-accent-ink transition-transform active:scale-[0.99] disabled:opacity-40"
                  >
                    {loading ? 'Launching…' : 'Launch my card 🚀'}
                  </button>
                </div>

                <p className="mt-5 text-center text-xs text-dash-muted">
                  Rather have us set it up for you?{' '}
                  <a href={conciergeWa} target="_blank" rel="noopener noreferrer" className="font-medium text-dash-accent">
                    Talk to us on WhatsApp
                  </a>
                </p>
              </div>
            )}
          </div>

          {/* live card preview — the product selling itself while they type */}
          <div className="mx-auto w-full max-w-[360px] lg:sticky lg:top-10 lg:self-start">
            <p className="mb-2.5 text-[10.5px] font-bold uppercase tracking-[0.18em] text-dash-muted">
              Card preview
            </p>
            <div
              className="overflow-hidden rounded-3xl border border-black/40 shadow-2xl"
              style={{
                background: `radial-gradient(360px 240px at 50% -60px, ${accent}30, transparent 70%), #0e0f13`,
              }}
            >
              <div className="px-5 pb-6 pt-7 text-[#f4f2ec]">
                <div className="flex items-center gap-3">
                  <div className="relative shrink-0">
                    <span
                      aria-hidden
                      className="glow-breathe absolute inset-0 rounded-full blur-lg"
                      style={{ background: accent }}
                    />
                    <div
                      className="relative flex h-16 w-16 items-center justify-center rounded-full border-[3px] text-2xl font-black text-[#141414]"
                      style={{
                        borderColor: accent,
                        background: `radial-gradient(circle at 30% 25%, #e8cf9a, #b5883f 70%)`,
                      }}
                    >
                      {(fullName.trim() || 'Y').charAt(0).toUpperCase()}
                    </div>
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-[22px] font-black leading-tight tracking-tight">
                      {fullName.trim() || 'Your Name'}
                    </p>
                    <p className="mt-0.5 truncate text-[11.5px] font-bold" style={{ color: accent }}>
                      {title.trim() || preset?.label || 'What you do'}
                    </p>
                  </div>
                </div>

                <span className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-[#3ddc84]/35 bg-[#3ddc84]/10 px-2.5 py-[3px] text-[10px] text-[#3ddc84]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#3ddc84]" /> Available
                </span>

                {sampleServices.length > 0 && (
                  <div className="mt-4 rounded-xl border border-[#20242e] bg-[#12141a]/70 px-3.5 py-0.5">
                    {sampleServices.map((s, i) => (
                      <div
                        key={i}
                        className="flex items-center justify-between border-b border-dashed border-[#262a35] py-2 text-[12px] last:border-0"
                      >
                        <span className="truncate pe-2 font-bold">{s.title}</span>
                        <span className="shrink-0 font-black" style={{ color: accent }}>
                          {s.price == null ? "let's talk" : `$${s.price}${s.starting_from ? '+' : ''}`}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                <div
                  className="mt-4 rounded-xl py-2.5 text-center text-[13px] font-black text-[#141414]"
                  style={{ background: accent }}
                >
                  Request a quote
                </div>
              </div>
              <div className="border-t border-white/5 bg-black/30 py-2.5 text-center text-[11px] text-[#6b7284]">
                work-withme.com/{handle || 'yourname'}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
