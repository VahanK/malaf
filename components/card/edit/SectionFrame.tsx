'use client'

import { useState } from 'react'
import { useEdit } from './EditContext'
import { SwapPicker, variantsFor } from './SwapPicker'
import { VariantSchematic } from './VariantSchematic'

// Wraps a section on the page. Public render: passthrough, nothing added. In the
// builder: on hover (desktop) or tap (mobile) it reveals a floating toolbar with
// the load-bearing control — SWAP LAYOUT — plus move + remove. Swap opens a
// visual picker (VariantSchematic previews) so the user CHOOSES a layout rather
// than blindly cycling.
export function SectionFrame({
  blockId,
  blockType,
  currentVariant,
  label,
  swappable = true,
  removable = true,
  movable = true,
  fixed,
  children,
}: {
  blockId: string
  /** The section's block type — resolves its variant list for the picker. */
  blockType?: string
  currentVariant?: string
  label: string
  swappable?: boolean
  removable?: boolean
  movable?: boolean
  /** For hero/contact bones that live on the profile, not portfolio_blocks. */
  fixed?: 'hero' | 'contact' | 'nav'
  children: React.ReactNode
}) {
  const { editing, setVariant, setFixedVariant, onSwap, onSwapFixed, onMove, onRemove, firstId, lastId } = useEdit()
  const [picking, setPicking] = useState(false)
  if (!editing) return <>{children}</>

  const variants = variantsFor({ fixed, blockType })
  const canPick = swappable && variants.length > 1
  const applyVariant = (id: string) => (fixed ? setFixedVariant(fixed, id) : setVariant(blockId, id))
  // Fallback quick-cycle if we somehow have no variant metadata but swap exists.
  const quickSwap = () => (fixed ? onSwapFixed(fixed) : onSwap(blockId))

  return (
    <div className="ww-section group/edit relative">
      {children}

      <span className="ww-chip pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white opacity-0 transition-opacity group-hover/edit:opacity-100">
        {label}
      </span>

      <div className="ww-toolbar absolute right-3 top-3 z-20 flex items-center gap-1.5 opacity-0 transition-opacity group-hover/edit:opacity-100">
        {swappable && (
          <button
            onClick={() => (canPick ? setPicking(true) : quickSwap())}
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-black shadow-lg ring-1 ring-black/10 hover:bg-neutral-100"
            title="Choose a different layout"
          >
            <SwapIcon /> Change layout
          </button>
        )}
        {movable && !fixed && (
          <>
            <button onClick={() => onMove(blockId, -1)} disabled={blockId === firstId} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg ring-1 ring-black/10 hover:bg-neutral-100 disabled:opacity-30" title="Move up">↑</button>
            <button onClick={() => onMove(blockId, 1)} disabled={blockId === lastId} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black shadow-lg ring-1 ring-black/10 hover:bg-neutral-100 disabled:opacity-30" title="Move down">↓</button>
          </>
        )}
        {removable && !fixed && (
          <button onClick={() => onRemove(blockId)} className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-red-600 shadow-lg ring-1 ring-black/10 hover:bg-red-50" title="Remove section">✕</button>
        )}
      </div>

      {picking && (
        <SwapPicker
          variants={variants}
          current={fixed ? (currentVariant ?? variants[0].id) : (currentVariant ?? '')}
          title={`Choose a ${label.toLowerCase()} layout`}
          onPick={applyVariant}
          onClose={() => setPicking(false)}
          renderMini={id => <VariantSchematic kind={blockType ?? fixed ?? label} variantId={id} />}
        />
      )}
    </div>
  )
}

function SwapIcon() {
  return (
    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
      <path d="M16 3l4 4-4 4" /><path d="M20 7H8a4 4 0 0 0-4 4" />
      <path d="M8 21l-4-4 4-4" /><path d="M4 17h12a4 4 0 0 0 4-4" />
    </svg>
  )
}
