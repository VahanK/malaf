'use client'

import { useMemo, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { PublicCard } from '@/components/card/PublicCard'
import { EditProvider, type EditApi } from '@/components/card/edit/EditContext'
import { sectionDef, HERO_VARIANTS, CONTACT_VARIANTS, SECTIONS } from '@/lib/sections'
import { FOUNDER_PHONE } from '@/lib/founder'
import type { PublicPage, PublicBlock } from '@/lib/public-page'

// The inline builder: the freelancer's REAL page, editable in place. Click text
// to edit it; hover a section for a swap/move/remove toolbar. No form panel —
// what you edit is exactly what your client sees. Replaces the grey-form
// SectionBuilder with "edit on the page."
const helpWa = `https://wa.me/${FOUNDER_PHONE}?text=${encodeURIComponent("Hi! I'd like help building my WorkWith page.")}`

export function InlineEditor({ page: initialPage, profileId }: { page: PublicPage; profileId: string }) {
  const [page, setPage] = useState<PublicPage>(initialPage)
  const [addOpen, setAddOpen] = useState(false)
  const supabase = useMemo(() => createClient(), [])

  const blocks = page.blocks
  const ordered = [...blocks].sort((a, b) => a.position - b.position)
  const firstId = ordered[0]?.id
  const lastId = ordered[ordered.length - 1]?.id

  // ---- local state helpers (optimistic; DB write in the background) ----
  const setProfile = (patch: Partial<PublicPage['profile']>) =>
    setPage(pg => ({ ...pg, profile: { ...pg.profile, ...patch } }))
  const setBlock = (id: string, patch: Partial<PublicBlock>) =>
    setPage(pg => ({ ...pg, blocks: pg.blocks.map(b => (b.id === id ? { ...b, ...patch } : b)) }))

  // ---- edits ----
  const onText: EditApi['onText'] = (blockId, field, value) => {
    if (blockId === 'profile') {
      setProfile({ [field]: value } as Partial<PublicPage['profile']>)
      supabase.from('profiles').update({ [field]: value }).eq('id', profileId)
      return
    }
    // block data field (e.g. narrative.bold_line, or a nested path handled by caller)
    const b = blocks.find(x => x.id === blockId)
    if (!b) return
    if (field === 'title') {
      setBlock(blockId, { title: value })
      supabase.from('portfolio_blocks').update({ title: value }).eq('id', blockId)
    } else {
      const data = { ...b.data, [field]: value }
      setBlock(blockId, { data })
      supabase.from('portfolio_blocks').update({ data }).eq('id', blockId)
    }
  }

  const cycleVariant = (variants: { id: string }[], current: string) => {
    const i = Math.max(0, variants.findIndex(v => v.id === current))
    return variants[(i + 1) % variants.length].id
  }

  const onSwap: EditApi['onSwap'] = blockId => {
    const b = blocks.find(x => x.id === blockId)
    if (!b) return
    const def = sectionDef(b.type)
    if (!def || def.variants.length < 2) return
    const next = cycleVariant(def.variants, b.variant)
    setBlock(blockId, { variant: next })
    supabase.from('portfolio_blocks').update({ variant: next }).eq('id', blockId)
  }

  const onSwapFixed: EditApi['onSwapFixed'] = which => {
    if (which === 'hero') {
      const next = cycleVariant(HERO_VARIANTS, page.profile.hero_variant || 'statement')
      setProfile({ hero_variant: next })
      supabase.from('profiles').update({ hero_variant: next }).eq('id', profileId)
    } else {
      const next = cycleVariant(CONTACT_VARIANTS, page.profile.contact_variant || 'cta-band')
      setProfile({ contact_variant: next })
      supabase.from('profiles').update({ contact_variant: next }).eq('id', profileId)
    }
  }

  const onMove: EditApi['onMove'] = (blockId, dir) => {
    const i = ordered.findIndex(b => b.id === blockId)
    const j = i + dir
    if (i < 0 || j < 0 || j >= ordered.length) return
    const a = ordered[i], b = ordered[j]
    setPage(pg => ({
      ...pg,
      blocks: pg.blocks.map(bl => (bl.id === a.id ? { ...bl, position: b.position } : bl.id === b.id ? { ...bl, position: a.position } : bl)),
    }))
    supabase.from('portfolio_blocks').update({ position: b.position }).eq('id', a.id)
    supabase.from('portfolio_blocks').update({ position: a.position }).eq('id', b.id)
  }

  const onRemove: EditApi['onRemove'] = blockId => {
    setPage(pg => ({ ...pg, blocks: pg.blocks.filter(b => b.id !== blockId) }))
    supabase.from('portfolio_blocks').delete().eq('id', blockId)
  }

  const onUpload: EditApi['onUpload'] = async file => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload/portfolio', { method: 'POST', body: fd })
    const json = await res.json()
    return json.path ?? null
  }

  const addSection = async (type: string) => {
    const def = sectionDef(type)
    const nextPosition = blocks.length ? Math.max(...blocks.map(b => b.position)) + 1 : 0
    const variant = def?.variants[0]?.id ?? ''
    const { data, error } = await supabase
      .from('portfolio_blocks')
      .insert({ profile_id: profileId, type, position: nextPosition, data: {}, active: true, variant })
      .select('id, type, position, data, active, title, title_ar, intro, intro_ar, variant')
      .single()
    if (!error && data) {
      await supabase.from('profiles').update({ composable: true }).eq('id', profileId)
      setPage(pg => ({ ...pg, blocks: [...pg.blocks, { ...(data as unknown as PublicBlock) }] }))
      setAddOpen(false)
    }
  }

  const api: EditApi = { editing: true, onText, onSwap, onSwapFixed, onMove, onRemove, onUpload, firstId, lastId }

  return (
    <div>
      {/* the real page, editable in place */}
      <div className="overflow-hidden rounded-2xl border border-dash-border bg-white shadow-sm">
        <EditProvider value={api}>
          <PublicCard page={page} />
        </EditProvider>
      </div>

      {/* add a section */}
      <div className="mt-4">
        {addOpen ? (
          <div className="rounded-xl border border-dash-border bg-dash-surface p-4">
            <div className="mb-3 flex items-center justify-between">
              <p className="text-sm font-semibold text-dash-ink">Add a section</p>
              <button onClick={() => setAddOpen(false)} className="text-xs text-dash-muted">Cancel</button>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {SECTIONS.map(s => (
                <button key={s.type} onClick={() => addSection(s.type)} className="flex items-start gap-3 rounded-lg border border-dash-border p-3 text-left hover:border-dash-accent">
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
          <button onClick={() => setAddOpen(true)} className="w-full rounded-xl border-2 border-dashed border-dash-border py-3 text-sm font-semibold text-dash-muted hover:border-dash-accent hover:text-dash-ink">
            + Add a section
          </button>
        )}
      </div>

      {/* help escape hatch */}
      <a href={helpWa} target="_blank" rel="noopener noreferrer" className="mt-3 flex items-center justify-center gap-2 rounded-xl bg-dash-ink/5 py-3 text-[13px] font-medium text-dash-muted hover:text-dash-ink">
        💬 Want it set up for you? Message me and I&apos;ll build it with you.
      </a>
    </div>
  )
}
