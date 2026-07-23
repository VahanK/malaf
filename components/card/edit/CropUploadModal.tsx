'use client'

import { useEffect, useRef, useState } from 'react'

// Crop-and-confirm step shown after the user picks an image, before upload
// (founder: "let me crop image and give me the dimensions on uploading … so it's
// easier and not confusing"). Shows the image, its real WxH + file size, aspect
// presets, and a draggable crop rectangle. On confirm it renders the crop to a
// canvas and hands back a File to the caller (which compresses + uploads).
// Pure canvas, no dependency.

type Aspect = { label: string; ratio: number | null } // null = freeform / original
const ASPECTS: Aspect[] = [
  { label: 'Original', ratio: null },
  { label: 'Square', ratio: 1 },
  { label: '4:3', ratio: 4 / 3 },
  { label: '3:4', ratio: 3 / 4 },
  { label: '16:9', ratio: 16 / 9 },
]

interface Crop { x: number; y: number; w: number; h: number } // in natural px

export function CropUploadModal({
  file,
  lockAspect,
  onCancel,
  onConfirm,
}: {
  file: File
  /** When set, the crop is LOCKED to this ratio (w/h) and presets are hidden —
   *  the slot needs exactly this shape (e.g. a square avatar). */
  lockAspect?: number
  onCancel: () => void
  onConfirm: (cropped: File) => void
}) {
  const [img, setImg] = useState<HTMLImageElement | null>(null)
  const [nat, setNat] = useState<{ w: number; h: number } | null>(null)
  const [aspect, setAspect] = useState<Aspect>(lockAspect ? { label: 'Locked', ratio: lockAspect } : ASPECTS[0])
  const [crop, setCrop] = useState<Crop | null>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const drag = useRef<{ mode: 'move' | 'new'; sx: number; sy: number; start: Crop } | null>(null)

  // Load the picked file into an <img> to read its natural dimensions.
  useEffect(() => {
    const url = URL.createObjectURL(file)
    const im = new Image()
    im.onload = () => {
      setImg(im)
      setNat({ w: im.naturalWidth, h: im.naturalHeight })
      if (lockAspect) {
        // Center the largest rect of the locked ratio.
        let w = im.naturalWidth, h = w / lockAspect
        if (h > im.naturalHeight) { h = im.naturalHeight; w = h * lockAspect }
        setCrop({ x: (im.naturalWidth - w) / 2, y: (im.naturalHeight - h) / 2, w, h })
      } else {
        setCrop({ x: 0, y: 0, w: im.naturalWidth, h: im.naturalHeight })
      }
    }
    im.src = url
    return () => URL.revokeObjectURL(url)
  }, [file])

  // Apply an aspect preset by centering the largest matching rect.
  const applyAspect = (a: Aspect) => {
    setAspect(a)
    if (!nat) return
    if (a.ratio == null) { setCrop({ x: 0, y: 0, w: nat.w, h: nat.h }); return }
    let w = nat.w, h = w / a.ratio
    if (h > nat.h) { h = nat.h; w = h * a.ratio }
    setCrop({ x: (nat.w - w) / 2, y: (nat.h - h) / 2, w, h })
  }

  // Map a pointer event to natural-px coords inside the displayed image.
  const toNat = (e: React.PointerEvent) => {
    const r = wrapRef.current!.getBoundingClientRect()
    const px = (e.clientX - r.left) / r.width
    const py = (e.clientY - r.top) / r.height
    return { x: Math.max(0, Math.min(1, px)) * nat!.w, y: Math.max(0, Math.min(1, py)) * nat!.h }
  }

  const onDown = (e: React.PointerEvent) => {
    if (!nat || !crop) return
    e.currentTarget.setPointerCapture(e.pointerId)
    const p = toNat(e)
    const inside = p.x >= crop.x && p.x <= crop.x + crop.w && p.y >= crop.y && p.y <= crop.y + crop.h
    drag.current = { mode: inside ? 'move' : 'new', sx: p.x, sy: p.y, start: crop }
    if (!inside) setCrop({ x: p.x, y: p.y, w: 1, h: 1 })
  }
  const onMove = (e: React.PointerEvent) => {
    if (!drag.current || !nat) return
    const p = toNat(e)
    const d = drag.current
    if (d.mode === 'move') {
      let x = d.start.x + (p.x - d.sx), y = d.start.y + (p.y - d.sy)
      x = Math.max(0, Math.min(nat.w - d.start.w, x))
      y = Math.max(0, Math.min(nat.h - d.start.h, y))
      setCrop({ ...d.start, x, y })
    } else {
      let w = Math.abs(p.x - d.sx), h = Math.abs(p.y - d.sy)
      if (aspect.ratio) h = w / aspect.ratio
      const x = Math.min(d.sx, p.x), y = Math.min(d.sy, p.y)
      setCrop({ x, y, w: Math.max(8, w), h: Math.max(8, h) })
    }
  }
  const onUp = () => { drag.current = null }

  const confirm = () => {
    if (!img || !crop || !nat) return
    const canvas = document.createElement('canvas')
    canvas.width = Math.round(crop.w)
    canvas.height = Math.round(crop.h)
    const ctx = canvas.getContext('2d')!
    ctx.drawImage(img, crop.x, crop.y, crop.w, crop.h, 0, 0, crop.w, crop.h)
    canvas.toBlob(blob => {
      if (!blob) { onConfirm(file); return }
      const name = file.name.replace(/\.[^.]+$/, '') + '.webp'
      onConfirm(new File([blob], name, { type: 'image/webp', lastModified: file.lastModified }))
    }, 'image/webp', 0.92)
  }

  const url = img?.src
  const sizeKb = Math.round(file.size / 1024)
  const cropDims = crop ? `${Math.round(crop.w)} × ${Math.round(crop.h)}` : ''

  return (
    <div className="fixed inset-0 z-[70] flex items-end justify-center bg-black/60 p-3 sm:items-center" onClick={onCancel}>
      <div className="w-full max-w-lg rounded-2xl bg-white p-4 shadow-2xl" onClick={e => e.stopPropagation()}>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="text-[15px] font-bold text-neutral-900">Crop your photo</h3>
          <button onClick={onCancel} className="rounded-full px-2 py-1 text-[13px] text-neutral-500 hover:bg-neutral-100">Cancel</button>
        </div>

        {/* dimensions readout */}
        <p className="mb-2 text-[12px] text-neutral-500">
          {nat ? <>Original <b className="text-neutral-800">{nat.w} × {nat.h}px</b> · {sizeKb} KB{crop && <> · cropping to <b className="text-neutral-800">{cropDims}px</b></>}</> : 'Reading image…'}
        </p>

        {/* crop stage */}
        {url && nat && crop && (
          <div
            ref={wrapRef}
            className="relative w-full touch-none select-none overflow-hidden rounded-xl bg-neutral-100"
            style={{ aspectRatio: `${nat.w} / ${nat.h}` }}
            onPointerDown={onDown}
            onPointerMove={onMove}
            onPointerUp={onUp}
          >
            {/* dimmed full image underneath */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-contain opacity-40" />
            {/* bright crop window: the same image, revealed only inside the crop rect */}
            <div
              className="pointer-events-none absolute overflow-hidden ring-2 ring-white"
              style={{
                left: `${(crop.x / nat.w) * 100}%`,
                top: `${(crop.y / nat.h) * 100}%`,
                width: `${(crop.w / nat.w) * 100}%`,
                height: `${(crop.h / nat.h) * 100}%`,
              }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={url}
                alt=""
                className="absolute max-w-none object-contain"
                style={{
                  width: `${(nat.w / crop.w) * 100}%`,
                  height: `${(nat.h / crop.h) * 100}%`,
                  left: `${-(crop.x / crop.w) * 100}%`,
                  top: `${-(crop.y / crop.h) * 100}%`,
                }}
              />
            </div>
          </div>
        )}

        {/* aspect presets — hidden when the slot locks the ratio */}
        {!lockAspect && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {ASPECTS.map(a => (
              <button
                key={a.label}
                onClick={() => applyAspect(a)}
                className={`rounded-full px-3 py-1.5 text-[12px] font-bold transition ${aspect.label === a.label ? 'bg-neutral-900 text-white' : 'bg-neutral-100 text-neutral-700 hover:bg-neutral-200'}`}
              >
                {a.label}
              </button>
            ))}
          </div>
        )}

        <div className="mt-4 flex items-center justify-between gap-2">
          <p className="text-[11.5px] text-neutral-400">Drag inside to move · drag outside to draw a new crop</p>
          <button onClick={confirm} className="rounded-full bg-[#e8623d] px-5 py-2.5 text-[13px] font-bold text-white hover:bg-[#d4512f]">
            Use photo →
          </button>
        </div>
      </div>
    </div>
  )
}
