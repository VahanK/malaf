'use client'

import { useRef, useState } from 'react'
import { CardImage } from '../CardImage'
import { useEdit } from './EditContext'
import { uploadImageWithProgress } from '@/lib/upload-with-progress'
import { CropUploadModal } from './CropUploadModal'

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
  const { editing } = useEdit()
  const inputRef = useRef<HTMLInputElement>(null)
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState(0)
  const [cropFile, setCropFile] = useState<File | null>(null)

  if (!editing) {
    return <CardImage src={src} alt={alt} aspect={aspect} rounded={rounded} accent={accent} className={className} />
  }

  const pick = () => inputRef.current?.click()
  // Picking a file opens the crop modal; confirming there uploads the cropped result.
  const handleFile = (file: File | undefined) => { if (file) setCropFile(file) }
  const doUpload = async (file: File) => {
    setCropFile(null)
    setBusy(true)
    setProgress(0)
    const path = await uploadImageWithProgress(file, setProgress)
    setBusy(false)
    if (path) onChange(path)
  }
  const pct = Math.round(progress * 100)

  return (
    <div className={`group/img relative ${className}`}>
      <button type="button" onClick={pick} className="block w-full text-left" aria-label={src ? 'Change photo' : label}>
        <CardImage src={src} alt={alt} aspect={aspect} rounded={rounded} accent={accent} label={src ? undefined : label} />
        {/* hover prompt (hidden while uploading) */}
        {!busy && (
          <span className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-[inherit] bg-black/0 opacity-0 transition group-hover/img:bg-black/35 group-hover/img:opacity-100">
            <span className="rounded-full bg-white px-3 py-1.5 text-[12px] font-bold text-black shadow-lg">
              {src ? '↻ Change photo' : '＋ Add photo'}
            </span>
          </span>
        )}
        {/* real upload progress */}
        {busy && (
          <span className="absolute inset-0 flex flex-col items-center justify-center gap-2 rounded-[inherit] bg-black/55 px-6">
            <span className="text-[12px] font-bold text-white">{pct < 100 ? `Uploading… ${pct}%` : 'Finishing…'}</span>
            <span className="h-1.5 w-full max-w-[160px] overflow-hidden rounded-full bg-white/25">
              <span className="block h-full rounded-full bg-white transition-[width] duration-150" style={{ width: `${pct}%` }} />
            </span>
          </span>
        )}
      </button>
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={e => { handleFile(e.target.files?.[0]); e.target.value = '' }}
      />
      {cropFile && (
        <CropUploadModal file={cropFile} onCancel={() => setCropFile(null)} onConfirm={doUpload} />
      )}
    </div>
  )
}
