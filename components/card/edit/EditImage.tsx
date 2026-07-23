'use client'

import { useRef, useState } from 'react'
import { CardImage } from '../CardImage'
import { useEdit } from './EditContext'

// Inline image editing — the image counterpart to <Editable>. On the public page
// (no EditProvider) it's just a <CardImage> (robust any-dimension render +
// placeholder). In the builder it becomes a click-to-upload target IN the exact
// spot the image appears: click → file picker → uploads via useEdit().onUpload →
// calls onChange with the stored path → fills in place, no forms.
export function EditImage({
  src,
  onChange,
  alt = '',
  aspect = 'aspect-[4/3]',
  rounded = 'rounded-[var(--card-radius-md)]',
  accent = '#c9a45c',
  className = '',
  label = 'Add a photo',
}: {
  src?: string | null
  onChange: (path: string) => void
  alt?: string
  aspect?: string
  rounded?: string
  accent?: string
  className?: string
  label?: string
}) {
  const { editing, onUpload } = useEdit()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)

  if (!editing) {
    return <CardImage src={src} alt={alt} aspect={aspect} rounded={rounded} accent={accent} className={className} />
  }

  const pick = () => inputRef.current?.click()
  const handleFile = async (file: File | undefined) => {
    if (!file) return
    setBusy(true)
    const path = await onUpload(file)
    setBusy(false)
    if (path) onChange(path)
  }

  return (
    <div className={`group/img relative ${className}`}>
      <button type="button" onClick={pick} className="block w-full text-left" aria-label={src ? 'Change photo' : label}>
        <CardImage src={src} alt={alt} aspect={aspect} rounded={rounded} accent={accent} label={src ? undefined : label} />
        {/* hover/upload overlay */}
        <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit] bg-black/0 opacity-0 transition group-hover/img:bg-black/35 group-hover/img:opacity-100">
          <span className="rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-black shadow-lg">
            {busy ? 'Uploading…' : src ? '↻ Change photo' : '＋ Add photo'}
          </span>
        </span>
        {busy && (
          <span className="absolute inset-0 flex items-center justify-center rounded-[inherit] bg-black/40 text-[12px] font-bold text-white">
            Uploading…
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => handleFile(e.target.files?.[0])}
      />
    </div>
  )
}
