'use client'

import { useState } from 'react'
import { ACCENTS, PALETTES, shufflePalette } from '@/lib/palettes'
import { getCardTemplate } from '@/lib/card-templates'

// Whole-page palette control for the builder (founder: "make color palette
// swapping easy and randomized … I want the WHOLE palette to change, background
// included, not just the text color"). The page background/ink/surface come from
// the TEMPLATE and the highlight from the ACCENT — so to change the whole look we
// change BOTH. Shuffle rolls a curated (template + accent) pairing; the mood row
// lets you pick a full look; the accent row fine-tunes the highlight color.
export function PaletteControl({
  template,
  accent,
  onPalette,
  onAccent,
}: {
  template?: string
  accent?: string
  onPalette: (template: string, accent: string) => void
  onAccent: (hex: string) => void
}) {
  const [open, setOpen] = useState(false)

  const shuffle = () => {
    const p = shufflePalette(template, accent, Math.random())
    onPalette(p.template, p.accent)
  }

  // Swatch = the template's real background + its accent, so the user sees the look.
  const moodSwatch = (tplId: string, acc: string) => {
    const vars = getCardTemplate(tplId).vars(acc)
    return { background: vars['--card-bg'] as string, accent: acc, ink: (vars['--card-ink'] as string) || '#000' }
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 rounded-full border border-dash-border bg-white px-3 py-2 text-[13px] font-bold text-dash-ink shadow-sm hover:border-dash-accent"
          title="Change your whole page palette"
        >
          <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: accent || '#e8623d' }} />
          Palette
        </button>
        <button
          onClick={shuffle}
          className="flex items-center gap-1.5 rounded-full border border-dash-border bg-white px-3 py-2 text-[13px] font-bold text-dash-ink shadow-sm hover:border-dash-accent"
          title="Roll a whole new look (background + color)"
        >
          🎲 Shuffle
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-72 rounded-2xl border border-dash-border bg-white p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[12px] font-bold text-dash-muted">Whole-page look</p>
              <button onClick={shuffle} className="text-[12px] font-bold text-dash-accent">🎲 Surprise me</button>
            </div>
            {/* mood row: full palettes (background + accent) */}
            <div className="grid grid-cols-7 gap-1.5">
              {PALETTES.map(p => {
                const s = moodSwatch(p.template, p.accent)
                const active = p.template === template && p.accent.toLowerCase() === (accent ?? '').toLowerCase()
                return (
                  <button
                    key={p.name}
                    onClick={() => onPalette(p.template, p.accent)}
                    title={p.name}
                    className={`relative aspect-square overflow-hidden rounded-lg ring-2 transition ${active ? 'ring-dash-ink' : 'ring-black/10 hover:ring-black/30'}`}
                    style={{ background: s.background }}
                  >
                    <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full ring-1 ring-white/40" style={{ background: s.accent }} />
                  </button>
                )
              })}
            </div>

            <p className="mb-1.5 mt-3 text-[11px] font-bold text-dash-muted">Just the accent</p>
            <div className="grid grid-cols-8 gap-1.5">
              {ACCENTS.map(a => {
                const active = a.hex.toLowerCase() === (accent ?? '').toLowerCase()
                return (
                  <button
                    key={a.hex}
                    onClick={() => onAccent(a.hex)}
                    title={a.name}
                    className={`aspect-square rounded-full ring-2 transition ${active ? 'ring-dash-ink ring-offset-1' : 'ring-transparent hover:ring-black/20'}`}
                    style={{ background: a.hex }}
                  />
                )
              })}
            </div>
          </div>
        </>
      )}
    </div>
  )
}
