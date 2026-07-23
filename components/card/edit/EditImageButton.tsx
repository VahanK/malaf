'use client'

import { useRef, useState } from 'react'
import { useEdit } from './EditContext'
import { uploadImageWithProgress } from '@/lib/upload-with-progress'

// A floating "add/change photo" pill for image slots where an inline EditImage
// doesn't fit — e.g. the hero, whose photo is a full-bleed background rendered
// differently per variant. Shows real upload progress. Renders nothing on the
// public page (only when editing).
export function EditImageButton({
  hasImage,
  onUploaded,
  className = '',
  addLabel = 'Add photo',
  changeLabel = 'Change photo',
}: {
  hasImage: boolean
  onUploaded: (path: string) => void
  className?: string
  addLabel?: string
  changeLabel?: string
}) {
  const { editing } = useEdit()
  const inputRef = useRef<HTMLInputElement>(null)
  const [pct, setPct] = useState<number | null>(null)
  if (!editing) return null

  const handle = async (file: File | undefined) => {
    if (!file) return
    setPct(0)
    const path = await uploadImageWithProgress(file, f => setPct(Math.round(f * 100)))
    setPct(null)
    if (path) onUploaded(path)
  }

  return (
    <div className={`z-30 ${className}`}>
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="flex items-center gap-2 rounded-full bg-white px-3.5 py-2 text-[12px] font-bold text-black shadow-lg ring-1 ring-black/10 hover:bg-neutral-100"
      >
        {pct !== null ? (
          <>
            <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-black/25 border-t-black" />
            {pct < 100 ? `${pct}%` : 'Finishing…'}
          </>
        ) : (
          <>📷 {hasImage ? changeLabel : addLabel}</>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => handle(e.target.files?.[0])}
      />
    </div>
  )
}
