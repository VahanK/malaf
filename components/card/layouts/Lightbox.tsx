'use client'

import { useEffect, useState } from 'react'
import { createPortal } from 'react-dom'
import type { HeroMedia } from './shared'

// Full-screen image viewer, portaled to <body> so it escapes any layout
// stacking context. Shared by all three website layouts.
export function Lightbox({ images, start, onClose }: { images: HeroMedia[]; start: number; onClose: () => void }) {
  const [at, setAt] = useState(start)
  const img = images[at]

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowRight') setAt(a => Math.min(a + 1, images.length - 1))
      if (e.key === 'ArrowLeft') setAt(a => Math.max(a - 1, 0))
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [images.length, onClose])

  if (!img) return null

  return createPortal(
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/95 p-4" onClick={onClose} role="dialog" aria-modal="true">
      <div className="relative max-h-[80vh] w-full max-w-3xl" onClick={e => e.stopPropagation()}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={img.url ?? undefined} alt={img.alt} className="max-h-[80vh] w-full rounded-xl object-contain" />
      </div>
      {img.alt && <p className="mt-3 max-w-lg text-center text-[12.5px] text-[#9aa0ae]">{img.alt}</p>}
      <div className="mt-3 flex items-center gap-5" onClick={e => e.stopPropagation()}>
        <button onClick={() => setAt(a => Math.max(a - 1, 0))} disabled={at === 0} aria-label="Previous" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30">‹</button>
        <span className="text-[11px] text-[#9aa0ae]">{at + 1} / {images.length}</span>
        <button onClick={() => setAt(a => Math.min(a + 1, images.length - 1))} disabled={at === images.length - 1} aria-label="Next" className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-white disabled:opacity-30">›</button>
      </div>
      <button onClick={onClose} aria-label="Close" className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 text-lg text-white">✕</button>
    </div>,
    document.body
  )
}
