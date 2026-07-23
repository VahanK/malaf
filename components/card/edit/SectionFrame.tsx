'use client'

import { useEdit } from './EditContext'

// Wraps a section on the page. Public render: passthrough, nothing added. In the
// builder: on hover (desktop) or tap (mobile) it reveals a floating toolbar with
// the load-bearing control — SWAP LAYOUT — plus move + remove. This is the
// founder's "a change-layout icon on every component, make it easy."
export function SectionFrame({
  blockId,
  label,
  swappable = true,
  removable = true,
  movable = true,
  fixed,
  children,
}: {
  blockId: string
  label: string
  swappable?: boolean
  removable?: boolean
  movable?: boolean
  /** For hero/contact bones that live on the profile, not portfolio_blocks. */
  fixed?: 'hero' | 'contact'
  children: React.ReactNode
}) {
  const { editing, onSwap, onSwapFixed, onMove, onRemove, firstId, lastId } = useEdit()
  if (!editing) return <>{children}</>

  const swap = () => (fixed ? onSwapFixed(fixed) : onSwap(blockId))

  return (
    <div className="ww-section group/edit relative">
      {children}

      {/* label chip — top-left, always visible in edit mode so the page reads as
          a set of editable blocks */}
      <span className="ww-chip pointer-events-none absolute left-3 top-3 z-20 rounded-full bg-black/70 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-white opacity-0 transition-opacity group-hover/edit:opacity-100">
        {label}
      </span>

      {/* toolbar — top-right, reveals on hover/tap */}
      <div className="ww-toolbar absolute right-3 top-3 z-20 flex items-center gap-1.5 opacity-0 transition-opacity group-hover/edit:opacity-100">
        {swappable && (
          <button
            onClick={swap}
            className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-black shadow-lg ring-1 ring-black/10 hover:bg-neutral-100"
            title="Switch to a different layout"
          >
            <SwapIcon /> Swap layout
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
