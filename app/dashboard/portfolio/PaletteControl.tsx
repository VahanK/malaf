'use client'

import { useState } from 'react'
import { ACCENTS, shuffleAccent } from '@/lib/palettes'

// One-tap color-palette swap for the builder (founder: "make color palette
// swapping easy and randomized"). A row of curated accent swatches + a Shuffle
// button that rolls a tasteful color. Every choice recolors the live preview
// instantly (onPick updates profile.accent_color → the whole page re-derives
// its CSS vars). Curated pool = never an ugly random hex.
export function PaletteControl({ current, onPick }: { current?: string; onPick: (hex: string) => void }) {
  const [open, setOpen] = useState(false)

  const shuffle = () => onPick(shuffleAccent(current, Math.random()).hex)

  return (
    <div className="relative">
      <div className="flex items-center gap-1.5">
        <button
          onClick={() => setOpen(o => !o)}
          className="flex items-center gap-2 rounded-full border border-dash-border bg-white px-3 py-2 text-[13px] font-bold text-dash-ink shadow-sm hover:border-dash-accent"
          title="Change your page color"
        >
          <span className="h-4 w-4 rounded-full ring-1 ring-black/10" style={{ background: current || '#e8623d' }} />
          Color
        </button>
        <button
          onClick={shuffle}
          className="flex items-center gap-1.5 rounded-full border border-dash-border bg-white px-3 py-2 text-[13px] font-bold text-dash-ink shadow-sm hover:border-dash-accent"
          title="Roll a new color"
        >
          🎲 Shuffle
        </button>
      </div>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-2 w-64 rounded-2xl border border-dash-border bg-white p-3 shadow-2xl">
            <div className="mb-2 flex items-center justify-between">
              <p className="text-[12px] font-bold text-dash-muted">Your page color</p>
              <button onClick={() => { shuffle(); }} className="text-[12px] font-bold text-dash-accent">🎲 Surprise me</button>
            </div>
            <p className="mb-2 text-[11px] text-dash-muted">Recolors your whole page.</p>
            <div className="grid grid-cols-8 gap-1.5">
              {ACCENTS.map(a => {
                const active = a.hex.toLowerCase() === (current ?? '').toLowerCase()
                return (
                  <button
                    key={a.hex}
                    onClick={() => onPick(a.hex)}
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
