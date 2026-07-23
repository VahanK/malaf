'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { mediaUrl } from '@/lib/media'
import { CARD_TEMPLATES, type CardTemplateId } from '@/lib/card-templates'
import { notifyPageUpdated } from '@/lib/page-updated'

interface Profile {
  id: string
  handle: string | null
  full_name: string
  title: string
  title_ar: string
  bio: string
  avatar_url: string | null
  voice_intro_url: string | null
  whatsapp_number: string | null
  areas_served: string[]
  availability_status: 'available' | 'busy' | 'away'
  availability_note: string
  page_language: 'en' | 'ar'
  page_published: boolean
  accent_color: string | null
  card_template: string | null
}

export function ProfileForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({
    full_name: profile.full_name ?? '',
    title: profile.title ?? '',
    title_ar: profile.title_ar ?? '',
    bio: profile.bio ?? '',
    whatsapp_number: profile.whatsapp_number ?? '',
    areas_served: (profile.areas_served ?? []).join(', '),
    availability_status: profile.availability_status ?? 'available',
    availability_note: profile.availability_note ?? '',
    page_language: profile.page_language ?? 'en',
    page_published: profile.page_published ?? false,
    card_template: (profile.card_template ?? 'editorial-dark') as CardTemplateId,
  })
  const [avatarUrl, setAvatarUrl] = useState(profile.avatar_url)
  const [voiceUrl, setVoiceUrl] = useState(profile.voice_intro_url)
  // The handle IS their public URL (work-withme.com/handle) — editable here, with
  // a live availability check so they always know + can change their link.
  const [handle, setHandle] = useState(profile.handle ?? '')
  const [handleStatus, setHandleStatus] = useState<'idle' | 'checking' | 'available' | 'taken' | 'invalid'>('idle')
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle')
  const [error, setError] = useState<string | null>(null)
  const avatarInput = useRef<HTMLInputElement>(null)
  const voiceInput = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const uploadAvatar = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload/avatar', { method: 'POST', body: fd })
    const json = await res.json()
    if (json.url) setAvatarUrl(json.url)
  }

  const uploadVoice = async (file: File) => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload/voice', { method: 'POST', body: fd })
    const json = await res.json()
    if (json.path) setVoiceUrl(json.path)
  }

  // Normalize + check the handle as they type (skip if unchanged).
  const normalizeHandle = (v: string) => v.toLowerCase().replace(/[^a-z0-9-]/g, '').slice(0, 40)
  const onHandleChange = (v: string) => {
    const h = normalizeHandle(v)
    setHandle(h)
    if (h === (profile.handle ?? '')) { setHandleStatus('idle'); return }
    if (h.length < 3) { setHandleStatus('invalid'); return }
    setHandleStatus('checking')
  }
  useEffect(() => {
    if (handleStatus !== 'checking') return
    const t = setTimeout(async () => {
      const { data } = await supabase.rpc('is_handle_available', { candidate: handle })
      setHandleStatus(data ? 'available' : 'taken')
    }, 400)
    return () => clearTimeout(t)
  }, [handle, handleStatus, supabase])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (handleStatus === 'taken' || handleStatus === 'invalid') {
      setError('Please choose an available link (3+ letters/numbers).')
      return
    }
    setStatus('saving')
    setError(null)

    const patch: Record<string, unknown> = {
      ...form,
      areas_served: form.areas_served.split(',').map(s => s.trim()).filter(Boolean),
      avatar_url: avatarUrl,
      voice_intro_url: voiceUrl,
    }
    // Only send handle if they changed it to a valid, available one.
    if (handle && handle !== (profile.handle ?? '') && handleStatus === 'available') {
      patch.handle = handle
    }
    const { error: updateError } = await supabase
      .from('profiles')
      .update(patch)
      .eq('id', profile.id)

    if (updateError) {
      setError(updateError.message)
      setStatus('error')
      return
    }
    setStatus('saved')
    notifyPageUpdated()
    setTimeout(() => setStatus('idle'), 2000)
  }

  const handleHint =
    handleStatus === 'checking' ? '…' :
    handleStatus === 'available' ? '✓ available' :
    handleStatus === 'taken' ? '✕ taken' :
    handleStatus === 'invalid' ? '3+ letters/numbers' : ''
  const handleHintColor =
    handleStatus === 'available' ? 'text-green-600' :
    handleStatus === 'taken' || handleStatus === 'invalid' ? 'text-red-600' : 'text-dash-muted'

  return (
    <form onSubmit={submit} className="mt-6 max-w-lg space-y-5">
      {/* YOUR LINK — the public URL, always visible + editable. This is what they share. */}
      <div className="rounded-xl border border-dash-accent/30 bg-dash-accent/5 p-4">
        <label className="text-[13px] font-bold text-dash-ink">Your link</label>
        <p className="mb-2 text-[12px] text-dash-muted">This is the page you share. Clients open it — no app, no login.</p>
        <div className="flex items-center overflow-hidden rounded-lg border border-dash-border bg-white">
          <span className="shrink-0 py-2.5 pl-3 text-[13px] text-dash-muted">work-withme.com/</span>
          <input
            value={handle}
            onChange={e => onHandleChange(e.target.value)}
            placeholder="yourname"
            className="min-w-0 flex-1 bg-transparent py-2.5 pr-3 text-[14px] font-semibold text-dash-ink outline-none"
          />
          {handleHint && <span className={`shrink-0 pr-3 text-[12px] font-semibold ${handleHintColor}`}>{handleHint}</span>}
        </div>
        {profile.handle && (
          <a href={`/${profile.handle}`} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block text-[12px] font-semibold text-dash-accent">
            Open your live page ↗
          </a>
        )}
      </div>

      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => avatarInput.current?.click()}
          className="h-16 w-16 shrink-0 overflow-hidden rounded-full border border-dash-border bg-dash-surface"
        >
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={mediaUrl(avatarUrl) ?? undefined} alt="" className="h-full w-full object-cover" />
          ) : (
            <span className="flex h-full items-center justify-center text-xs text-dash-muted">Photo</span>
          )}
        </button>
        <input
          ref={avatarInput}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          className="hidden"
          onChange={e => e.target.files?.[0] && uploadAvatar(e.target.files[0])}
        />
        <div className="text-sm text-dash-muted">Tap to change photo</div>
      </div>

      <Field label="Full name">
        <input
          required
          value={form.full_name}
          onChange={e => setForm({ ...form, full_name: e.target.value })}
          className="w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Title (English)">
          <input
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
          />
        </Field>
        <Field label="Title (Arabic)">
          <input
            dir="rtl"
            value={form.title_ar}
            onChange={e => setForm({ ...form, title_ar: e.target.value })}
            className="w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
          />
        </Field>
      </div>

      <Field label="Bio">
        <textarea
          rows={3}
          value={form.bio}
          onChange={e => setForm({ ...form, bio: e.target.value })}
          className="w-full resize-none rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
        />
      </Field>

      <Field label="WhatsApp number">
        <input
          placeholder="+961 xx xxx xxx"
          value={form.whatsapp_number}
          onChange={e => setForm({ ...form, whatsapp_number: e.target.value })}
          className="w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
        />
      </Field>

      <Field label="Areas served (comma-separated)">
        <input
          placeholder="Beirut, Jounieh, Tripoli"
          value={form.areas_served}
          onChange={e => setForm({ ...form, areas_served: e.target.value })}
          className="w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
        />
      </Field>

      <div className="grid grid-cols-2 gap-3">
        <Field label="Availability">
          <select
            value={form.availability_status}
            onChange={e => setForm({ ...form, availability_status: e.target.value as Profile['availability_status'] })}
            className="w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
          >
            <option value="available">Available</option>
            <option value="busy">Busy</option>
            <option value="away">Away</option>
          </select>
        </Field>
        <Field label="Page language">
          <select
            value={form.page_language}
            onChange={e => setForm({ ...form, page_language: e.target.value as Profile['page_language'] })}
            className="w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
          >
            <option value="en">English</option>
            <option value="ar">Arabic</option>
          </select>
        </Field>
      </div>

      <Field label="Availability note (e.g. 'Booking for Sept')">
        <input
          value={form.availability_note}
          onChange={e => setForm({ ...form, availability_note: e.target.value })}
          className="w-full rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2.5 text-sm outline-none focus:border-dash-accent"
        />
      </Field>

      <div>
        <label className="text-sm font-medium text-dash-ink">Voice intro</label>
        <div className="mt-2 flex items-center gap-3">
          <button
            type="button"
            onClick={() => voiceInput.current?.click()}
            className="rounded-lg border border-dash-border bg-dash-surface px-3.5 py-2 text-sm"
          >
            {voiceUrl ? 'Replace recording' : 'Upload recording'}
          </button>
          {voiceUrl && <span className="text-xs text-dash-muted">Saved</span>}
        </div>
        <input
          ref={voiceInput}
          type="file"
          accept="audio/mpeg,audio/mp4,audio/webm,audio/ogg"
          className="hidden"
          onChange={e => e.target.files?.[0] && uploadVoice(e.target.files[0])}
        />
      </div>

      <div>
        <label className="text-sm font-medium text-dash-ink">Card look</label>
        <p className="mt-0.5 text-xs text-dash-muted">
          Your trade sets your starter content — this sets how your page looks. Switch anytime.
        </p>
        <div className="mt-2 grid grid-cols-2 gap-3">
          {Object.values(CARD_TEMPLATES).map(t => {
            const accent = profile.accent_color ?? t.swatch.accentFallback
            const selected = form.card_template === t.id
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setForm({ ...form, card_template: t.id })}
                className={`overflow-hidden rounded-xl border-2 text-left transition-all ${
                  selected ? 'border-dash-accent shadow-sm' : 'border-dash-border hover:border-dash-muted'
                }`}
              >
                <div className="p-3" style={{ background: t.swatch.bg, color: t.swatch.ink }}>
                  <div className="flex items-center gap-2">
                    <span
                      className="flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-black"
                      style={{ background: accent, color: t.swatch.bg === '#ffffff' ? '#fff' : '#141414' }}
                    >
                      {(form.full_name || 'Y').charAt(0).toUpperCase()}
                    </span>
                    <div
                      className="h-2 flex-1 rounded-full"
                      style={{ background: t.swatch.surface }}
                    />
                  </div>
                  <div
                    className="mt-2 h-6 rounded-md text-center text-[10px] font-bold leading-6"
                    style={{ background: accent, color: t.swatch.bg === '#ffffff' ? '#fff' : '#141414' }}
                  >
                    Request a quote
                  </div>
                </div>
                <div className="border-t border-dash-border bg-dash-surface px-3 py-2">
                  <p className="text-xs font-semibold text-dash-ink">{t.label}</p>
                  <p className="mt-0.5 text-[11px] leading-snug text-dash-muted">{t.description}</p>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Publishing is free — flip the page live at your public link. */}
      <label className="flex items-start gap-2.5 rounded-xl border border-dash-border bg-dash-surface p-4 text-sm text-dash-ink">
        <input
          type="checkbox"
          checked={form.page_published}
          onChange={e => setForm({ ...form, page_published: e.target.checked })}
          className="mt-0.5"
        />
        <span>
          <span className="font-semibold">Publish my page</span> — make it live at your public link, free.
          <span className="mt-0.5 block text-[13px] text-dash-muted">Share it anywhere; clients open it with no app and no login.</span>
        </span>
      </label>

      {error && <p className="rounded-lg bg-dash-danger/10 px-3 py-2 text-sm text-dash-danger">{error}</p>}

      <button
        type="submit"
        disabled={status === 'saving'}
        className="rounded-lg bg-dash-accent px-5 py-2.5 text-sm font-semibold text-dash-accent-ink disabled:opacity-60"
      >
        {status === 'saving' ? 'Saving…' : status === 'saved' ? 'Saved ✓' : 'Save changes'}
      </button>
    </form>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-medium text-dash-ink">{label}</label>
      <div className="mt-1.5">{children}</div>
    </div>
  )
}
