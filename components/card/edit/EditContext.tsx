'use client'

import { createContext, useContext } from 'react'

// The inline-edit bridge. The SAME section components render the public page
// (no provider → everything static) and the dashboard builder (wrapped in an
// EditProvider → text becomes click-to-edit, sections get a swap/move/remove
// toolbar). This keeps the public page pristine and guarantees "what you edit
// is exactly what your client sees" — the whole point of editing on the page.

export interface EditApi {
  editing: boolean
  /** Save an edited text field on a block's data (or its title). */
  onText: (blockId: string, field: string, value: string) => void
  /** Merge a partial data object into a block's data (images, list items…). */
  onBlockData: (blockId: string, data: Record<string, unknown>) => void
  /** Merge a partial patch into the PROFILE (hero image, avatar…). */
  onProfileData: (data: Record<string, unknown>) => void
  /** Cycle a block's layout variant (legacy quick-swap). */
  onSwap: (blockId: string) => void
  /** Set a block's layout variant directly (from the picker). */
  setVariant: (blockId: string, variantId: string) => void
  onMove: (blockId: string, dir: -1 | 1) => void
  onRemove: (blockId: string) => void
  /** Fixed bones (hero/contact) live on the profile, keyed by these ids. */
  onSwapFixed: (which: 'hero' | 'contact') => void
  /** Set a fixed bone's variant directly (from the picker). */
  setFixedVariant: (which: 'hero' | 'contact', variantId: string) => void
  /** Upload an image, return its stored path. */
  onUpload: (file: File) => Promise<string | null>
  /** The block currently first/last (for disabling move arrows). */
  firstId?: string
  lastId?: string
}

// Default (public page): editing off, all ops no-op.
const noop = () => {}
const EditContext = createContext<EditApi>({
  editing: false,
  onText: noop,
  onBlockData: noop,
  onProfileData: noop,
  onSwap: noop,
  setVariant: noop,
  onMove: noop,
  onRemove: noop,
  onSwapFixed: noop,
  setFixedVariant: noop,
  onUpload: async () => null,
})

export function EditProvider({ value, children }: { value: EditApi; children: React.ReactNode }) {
  return <EditContext.Provider value={value}>{children}</EditContext.Provider>
}

export function useEdit(): EditApi {
  return useContext(EditContext)
}
