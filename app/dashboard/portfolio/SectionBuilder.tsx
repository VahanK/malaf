'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { mediaUrl } from '@/lib/media'
import { notifyPageUpdated } from '@/lib/page-updated'
import { SECTIONS, sectionDef } from '@/lib/sections'
import { FOUNDER_PHONE } from '@/lib/founder'

interface Block {
  id: string
  type: string
  position: number
  data: Record<string, unknown>
  active: boolean
  title: string
  variant: string
}

const helpWa = `https://wa.me/${FOUNDER_PHONE}?text=${encodeURIComponent("Hi! I'd like help building my WorkWith page.")}`

// The real builder: friendly section cards, live variant switching, easy
// text/image/video, add/reorder/remove — phone-friendly, syncs the live
// preview instantly. NOT a WordPress form.
export function SectionBuilder({ initialBlocks, profileId }: { initialBlocks: Block[]; profileId: string }) {
  const [blocks, setBlocks] = useState(initialBlocks)
  const [adding, setAdding] = useState(false)
  const supabase = createClient()

  const patch = (id: string, next: Partial<Block>) =>
    setBlocks(bs => bs.map(b => (b.id === id ? { ...b, ...next } : b)))

  const addSection = async (type: string) => {
    const def = sectionDef(type)
    const nextPosition = blocks.length ? Math.max(...blocks.map(b => b.position)) + 1 : 0
    const variant = def?.variants[0]?.id ?? ''
    const { data, error } = await supabase
      .from('portfolio_blocks')
      .insert({ profile_id: profileId, type, position: nextPosition, data: {}, active: true, variant })
      .select('id, type, position, data, active, title, variant')
      .single()
    if (!error && data) {
      setBlocks([...blocks, data as Block])
      setAdding(false)
      // Building with the section builder means this page is a composed page —
      // flip the flag so the preview + live page render the real-website layout.
      await supabase.from('profiles').update({ composable: true }).eq('id', profileId)
      notifyPageUpdated()
    }
  }

  const saveData = async (id: string, data: Record<string, unknown>) => {
    patch(id, { data })
    await supabase.from('portfolio_blocks').update({ data }).eq('id', id)
    notifyPageUpdated()
  }
  const saveTitle = async (id: string, title: string) => {
    patch(id, { title })
    await supabase.from('portfolio_blocks').update({ title }).eq('id', id)
    notifyPageUpdated()
  }
  const setVariant = async (id: string, variant: string) => {
    patch(id, { variant })
    await supabase.from('portfolio_blocks').update({ variant }).eq('id', id)
    notifyPageUpdated()
  }
  const toggleActive = async (id: string, active: boolean) => {
    patch(id, { active })
    await supabase.from('portfolio_blocks').update({ active }).eq('id', id)
    notifyPageUpdated()
  }
  const move = async (id: string, dir: -1 | 1) => {
    const sorted = [...blocks].sort((a, b) => a.position - b.position)
    const i = sorted.findIndex(b => b.id === id)
    const j = i + dir
    if (i < 0 || j < 0 || j >= sorted.length) return
    const a = sorted[i], b = sorted[j]
    setBlocks(bs => bs.map(bl => (bl.id === a.id ? { ...bl, position: b.position } : bl.id === b.id ? { ...bl, position: a.position } : bl)))
    await Promise.all([
      supabase.from('portfolio_blocks').update({ position: b.position }).eq('id', a.id),
      supabase.from('portfolio_blocks').update({ position: a.position }).eq('id', b.id),
    ])
    notifyPageUpdated()
  }
  const remove = async (id: string) => {
    await supabase.from('portfolio_blocks').delete().eq('id', id)
    setBlocks(bs => bs.filter(b => b.id !== id))
    notifyPageUpdated()
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload/portfolio', { method: 'POST', body: fd })
    const json = await res.json()
    return json.path ?? null
  }

  const ordered = [...blocks].sort((a, b) => a.position - b.position)

  return (
    <div className="mt-4 space-y-4">
      <p className="text-[13px] text-dash-muted">
        Build your page section by section. Everything updates in the preview as you go.
      </p>

      {ordered.map((block, i) => (
        <SectionCard
          key={block.id}
          block={block}
          first={i === 0}
          last={i === ordered.length - 1}
          onMove={dir => move(block.id, dir)}
          onRemove={() => remove(block.id)}
          onToggle={active => toggleActive(block.id, active)}
          onTitle={t => saveTitle(block.id, t)}
          onVariant={v => setVariant(block.id, v)}
          onData={d => saveData(block.id, d)}
          onUpload={uploadImage}
        />
      ))}

      {/* Add a section */}
      {adding ? (
        <div className="rounded-xl border border-dash-border bg-dash-surface p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-semibold text-dash-ink">Add a section</p>
            <button onClick={() => setAdding(false)} className="text-xs text-dash-muted">Cancel</button>
          </div>
          <div className="grid gap-2 sm:grid-cols-2">
            {SECTIONS.map(s => (
              <button
                key={s.type}
                onClick={() => addSection(s.type)}
                className="flex items-start gap-3 rounded-lg border border-dash-border p-3 text-left hover:border-dash-accent"
              >
                <span className="text-[20px] leading-none">{s.icon}</span>
                <span>
                  <span className="block text-[13.5px] font-semibold text-dash-ink">{s.label}</span>
                  <span className="mt-0.5 block text-[11.5px] leading-snug text-dash-muted">{s.blurb}</span>
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <button
          onClick={() => setAdding(true)}
          className="w-full rounded-xl border-2 border-dashed border-dash-border py-3 text-sm font-semibold text-dash-muted hover:border-dash-accent hover:text-dash-ink"
        >
          + Add a section
        </button>
      )}

      {/* Help escape hatch */}
      <a
        href={helpWa}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center justify-center gap-2 rounded-xl bg-dash-ink/5 py-3 text-[13px] font-medium text-dash-muted hover:text-dash-ink"
      >
        💬 Want it set up for you? Message me and I&apos;ll build it with you.
      </a>
    </div>
  )
}

// ---------- one section card ----------
function SectionCard({
  block, first, last, onMove, onRemove, onToggle, onTitle, onVariant, onData, onUpload,
}: {
  block: Block
  first: boolean
  last: boolean
  onMove: (dir: -1 | 1) => void
  onRemove: () => void
  onToggle: (active: boolean) => void
  onTitle: (t: string) => void
  onVariant: (v: string) => void
  onData: (d: Record<string, unknown>) => void
  onUpload: (file: File) => Promise<string | null>
}) {
  const def = sectionDef(block.type)
  const input = 'w-full rounded-lg border border-dash-border px-3 py-2.5 text-sm outline-none focus:border-dash-accent'

  return (
    <div className={`rounded-xl border bg-dash-surface p-4 ${block.active ? 'border-dash-border' : 'border-dashed border-dash-border opacity-70'}`}>
      {/* header */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-[18px] leading-none">{def?.icon ?? '▫️'}</span>
          <span className="text-sm font-semibold text-dash-ink">{def?.label ?? block.type}</span>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => onMove(-1)} disabled={first} aria-label="Move up" className="flex h-8 w-8 items-center justify-center rounded-md text-dash-muted hover:bg-dash-bg disabled:opacity-30">↑</button>
          <button onClick={() => onMove(1)} disabled={last} aria-label="Move down" className="flex h-8 w-8 items-center justify-center rounded-md text-dash-muted hover:bg-dash-bg disabled:opacity-30">↓</button>
          <button onClick={onRemove} aria-label="Remove" className="flex h-8 w-8 items-center justify-center rounded-md text-dash-danger hover:bg-dash-danger/10">✕</button>
        </div>
      </div>

      {/* section title (composed sections only) */}
      {def && def.variants.length > 0 && (
        <input
          placeholder={`Section heading (e.g. ${def.label})`}
          defaultValue={block.title}
          onBlur={e => onTitle(e.target.value)}
          className={`${input} mt-3 font-medium`}
        />
      )}

      {/* variant switcher — the "switchable component" ask */}
      {def && def.variants.length > 1 && (
        <div className="mt-3">
          <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-dash-muted">Layout</p>
          <div className="flex flex-wrap gap-2">
            {def.variants.map(v => {
              const on = (block.variant || def.variants[0].id) === v.id
              return (
                <button
                  key={v.id}
                  onClick={() => onVariant(v.id)}
                  title={v.hint}
                  className={`rounded-lg border px-3 py-1.5 text-[12.5px] font-medium transition-colors ${on ? 'border-dash-accent bg-dash-accent/10 text-dash-ink' : 'border-dash-border text-dash-muted hover:border-dash-muted'}`}
                >
                  {v.label}
                </button>
              )
            })}
          </div>
        </div>
      )}

      {/* content fields */}
      <div className="mt-3">
        <SectionFields block={block} onData={onData} onUpload={onUpload} input={input} />
      </div>

      {/* live toggle */}
      <label className="mt-3 flex items-center gap-2 text-[12px] text-dash-muted">
        <input type="checkbox" checked={block.active} onChange={e => onToggle(e.target.checked)} />
        Show on my page
      </label>
    </div>
  )
}

// ---------- per-type content fields ----------
function SectionFields({
  block, onData, onUpload, input,
}: {
  block: Block
  onData: (d: Record<string, unknown>) => void
  onUpload: (file: File) => Promise<string | null>
  input: string
}) {
  const d = block.data as Record<string, unknown>

  if (block.type === 'narrative') {
    const n = d as { bold_line?: string; body?: string; chips?: string[] }
    return (
      <div className="space-y-2">
        <textarea rows={2} placeholder="Your bold statement (e.g. I ship products, not tickets.)" defaultValue={n.bold_line ?? ''} onBlur={e => onData({ ...n, bold_line: e.target.value })} className={input} />
        <textarea rows={2} placeholder="A supporting line or two (optional)" defaultValue={n.body ?? ''} onBlur={e => onData({ ...n, body: e.target.value })} className={input} />
        <input placeholder="Tags, comma-separated (e.g. ex-Murex, Next.js, Beirut)" defaultValue={(n.chips ?? []).join(', ')} onBlur={e => onData({ ...n, chips: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className={input} />
      </div>
    )
  }

  if (block.type === 'showcase') {
    const s = d as { items?: { title?: string; blurb?: string; tags?: string[]; image?: string; link?: string }[] }
    const items = s.items ?? []
    const setItem = (i: number, next: Record<string, unknown>) => onData({ items: items.map((it, j) => (j === i ? { ...it, ...next } : it)) })
    return (
      <div className="space-y-3">
        {items.map((it, i) => (
          <div key={i} className="rounded-lg border border-dash-border p-3">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-dash-muted">Project {i + 1}</span>
              <button onClick={() => onData({ items: items.filter((_, j) => j !== i) })} className="text-[11px] text-dash-danger">Remove</button>
            </div>
            <input placeholder="Project title" defaultValue={it.title ?? ''} onBlur={e => setItem(i, { title: e.target.value })} className={`${input} mt-2`} />
            <textarea rows={2} placeholder="What it was / what you did" defaultValue={it.blurb ?? ''} onBlur={e => setItem(i, { blurb: e.target.value })} className={`${input} mt-2`} />
            <input placeholder="Tags (comma-separated)" defaultValue={(it.tags ?? []).join(', ')} onBlur={e => setItem(i, { tags: e.target.value.split(',').map(s => s.trim()).filter(Boolean) })} className={`${input} mt-2`} />
            <div className="mt-2 flex items-center gap-2">
              {it.image && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl(it.image) ?? undefined} alt="" className="h-12 w-16 rounded object-cover" />
              )}
              <label className="cursor-pointer rounded-lg border border-dash-border px-3 py-1.5 text-[12px] text-dash-muted hover:text-dash-ink">
                {it.image ? 'Change image' : '+ Image (optional)'}
                <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; const p = await onUpload(f); if (p) setItem(i, { image: p }) }} />
              </label>
            </div>
          </div>
        ))}
        <button onClick={() => onData({ items: [...items, {}] })} className="w-full rounded-lg border border-dashed border-dash-border py-2 text-[12.5px] font-medium text-dash-muted hover:border-dash-accent hover:text-dash-ink">+ Add a project</button>
      </div>
    )
  }

  if (block.type === 'gallery' || block.type === 'image_grid') {
    const g = d as { images?: { url: string; alt?: string }[] }
    const images = g.images ?? []
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-4 gap-1.5">
          {images.map((img, i) => (
            <div key={i} className="group relative aspect-square overflow-hidden rounded-md bg-dash-bg">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={mediaUrl(img.url) ?? undefined} alt="" className="h-full w-full object-cover" />
              <button onClick={() => onData({ images: images.filter((_, j) => j !== i) })} className="absolute right-0.5 top-0.5 hidden h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[11px] text-white group-hover:flex">✕</button>
            </div>
          ))}
        </div>
        <label className="inline-block cursor-pointer rounded-lg border border-dash-border px-3 py-2 text-[12.5px] font-medium text-dash-muted hover:text-dash-ink">
          + Add photos
          <input type="file" accept="image/jpeg,image/png,image/webp" multiple className="hidden" onChange={async e => {
            const files = Array.from(e.target.files ?? [])
            const uploaded: { url: string }[] = []
            for (const f of files) { const p = await onUpload(f); if (p) uploaded.push({ url: p }) }
            if (uploaded.length) onData({ images: [...images, ...uploaded] })
          }} />
        </label>
      </div>
    )
  }

  if (block.type === 'stat_card') {
    const s = d as { value?: string; label?: string }
    return (
      <div className="flex gap-2">
        <input placeholder="500+" defaultValue={s.value ?? ''} onBlur={e => onData({ ...s, value: e.target.value })} className={input} />
        <input placeholder="students taught" defaultValue={s.label ?? ''} onBlur={e => onData({ ...s, label: e.target.value })} className={input} />
      </div>
    )
  }

  if (block.type === 'testimonial') {
    const t = d as { text?: string; attribution?: string }
    return (
      <div className="space-y-2">
        <textarea rows={2} placeholder="What they said" defaultValue={t.text ?? ''} onBlur={e => onData({ ...t, text: e.target.value })} className={input} />
        <input placeholder="Who said it (e.g. Nour & Karim)" defaultValue={t.attribution ?? ''} onBlur={e => onData({ ...t, attribution: e.target.value })} className={input} />
      </div>
    )
  }

  if (block.type === 'before_after') {
    const ba = d as { before?: { url: string }; after?: { url: string }; caption?: string }
    return (
      <div className="space-y-2">
        <div className="grid grid-cols-2 gap-2">
          {(['before', 'after'] as const).map(side => (
            <label key={side} className="block cursor-pointer rounded-lg border border-dash-border p-2 text-center text-[12px] text-dash-muted">
              {ba[side]?.url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={mediaUrl(ba[side]!.url) ?? undefined} alt={side} className="mx-auto h-20 w-full rounded object-cover" />
              ) : `Upload ${side}`}
              <input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" onChange={async e => { const f = e.target.files?.[0]; if (!f) return; const p = await onUpload(f); if (p) onData({ ...ba, [side]: { url: p } }) }} />
            </label>
          ))}
        </div>
        <input placeholder="Caption" defaultValue={ba.caption ?? ''} onBlur={e => onData({ ...ba, caption: e.target.value })} className={input} />
      </div>
    )
  }

  return null
}
