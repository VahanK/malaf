'use client'

import { useState } from 'react'
import { sectionDef, HERO_VARIANTS, CONTACT_VARIANTS, NAV_VARIANTS, type SectionVariant } from '@/lib/sections'

// The live-mini-preview swap picker. Instead of blindly cycling variants, the
// swap control opens a panel showing each layout option as a small LIVE render
// of the user's own section, so they choose deliberately (founder: "show a
// visual of the component instead of random swapping, let me choose").
//
// `renderMini` renders the real section at a given variant, scaled down inside a
// fixed box — so the previews are the actual components with the user's real
// data, not mockups.
export function SwapPicker({
  variants,
  current,
  onPick,
  onClose,
  renderMini,
  title = 'Choose a layout',
}: {
  variants: SectionVariant[]
  current: string
  onPick: (id: string) => void
  onClose: () => void
  renderMini: (variantId: string) => React.ReactNode
  title?: string
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-end justify-center bg-black/50 p-3 sm:items-center" onClick={onClose}>
      <div
        className="max-h-[85vh] w-full max-w-4xl overflow-y-auto rounded-2xl bg-white p-5 shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-neutral-900">{title}</h3>
          <button onClick={onClose} className="rounded-full px-2 py-1 text-[13px] text-neutral-500 hover:bg-neutral-100">Done</button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {variants.map(v => {
            const active = current === v.id || (!current && v.id === variants[0].id)
            return (
              <button
                key={v.id}
                onClick={() => { onPick(v.id); onClose() }}
                className={`group overflow-hidden rounded-xl border-2 text-left transition ${active ? 'border-[var(--card-accent,#e8623d)]' : 'border-neutral-200 hover:border-neutral-400'}`}
              >
                {/* schematic preview — fills the card at its real proportions */}
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-neutral-100">
                  <div className="pointer-events-none absolute inset-0 [&>*]:h-full [&>*]:w-full">
                    {renderMini(v.id)}
                  </div>
                  {active && (
                    <span className="absolute right-2 top-2 rounded-full bg-[var(--card-accent,#e8623d)] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow">
                      Current
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-[13px] font-bold text-neutral-900">{v.label}</p>
                  {v.hint && <p className="mt-0.5 line-clamp-2 text-[11.5px] leading-snug text-neutral-500">{v.hint}</p>}
                </div>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Resolve the variant list for a swap target: a fixed bone (hero/contact) or a
// block type (via the SECTIONS registry).
export function variantsFor(target: { fixed?: 'hero' | 'contact' | 'nav'; blockType?: string }): SectionVariant[] {
  if (target.fixed === 'hero') return HERO_VARIANTS
  if (target.fixed === 'contact') return CONTACT_VARIANTS
  if (target.fixed === 'nav') return NAV_VARIANTS
  if (target.blockType) return sectionDef(target.blockType)?.variants ?? []
  return []
}

// Convenience hook-free open/close state holder for a section's picker.
export function useSwapPicker() {
  const [open, setOpen] = useState(false)
  return { open, openPicker: () => setOpen(true), closePicker: () => setOpen(false) }
}
