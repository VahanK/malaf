// Client-side image compression — runs in the browser before upload so a 20MB
// phone photo becomes a ~1-2MB WebP at high quality. Two wins: far faster upload
// on Lebanon's bad 3G (performance IS localization), and less storage cost
// (media is the real cost driver — CLAUDE.md portability rule 3). No dependency:
// uses canvas, so swapping the storage host stays a one-line change.

export interface CompressOptions {
  /** Longest edge in px; larger images are downscaled to this. Default 2000. */
  maxEdge?: number
  /** WebP quality 0–1. Default 0.82 — visually lossless for photos at this scale. */
  quality?: number
  /** Skip compression for files already under this size (bytes). Default 200KB. */
  skipUnder?: number
}

const DEFAULTS: Required<CompressOptions> = {
  maxEdge: 2000,
  quality: 0.82,
  skipUnder: 200 * 1024,
}

// Returns a new File (WebP) or the original if compression isn't worthwhile /
// not possible (e.g. SVG, GIF, or the browser lacks canvas.toBlob). Never throws
// — on any failure it falls back to the original file so uploads still work.
export async function compressImage(file: File, opts: CompressOptions = {}): Promise<File> {
  const { maxEdge, quality, skipUnder } = { ...DEFAULTS, ...opts }

  // Leave non-raster / animated / tiny files alone.
  if (!file.type.startsWith('image/')) return file
  if (file.type === 'image/gif' || file.type === 'image/svg+xml') return file
  if (file.size <= skipUnder) return file
  if (typeof document === 'undefined') return file

  try {
    const bitmap = await loadBitmap(file)
    const { width, height } = fit(bitmap.width, bitmap.height, maxEdge)

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    const ctx = canvas.getContext('2d')
    if (!ctx) return file
    ctx.drawImage(bitmap, 0, 0, width, height)
    if ('close' in bitmap && typeof bitmap.close === 'function') bitmap.close()

    const blob = await toBlob(canvas, 'image/webp', quality)
    if (!blob || blob.size >= file.size) return file // compression didn't help

    const name = file.name.replace(/\.[^.]+$/, '') + '.webp'
    return new File([blob], name, { type: 'image/webp', lastModified: file.lastModified })
  } catch {
    return file
  }
}

function fit(w: number, h: number, maxEdge: number): { width: number; height: number } {
  const longest = Math.max(w, h)
  if (longest <= maxEdge) return { width: w, height: h }
  const scale = maxEdge / longest
  return { width: Math.round(w * scale), height: Math.round(h * scale) }
}

async function loadBitmap(file: File): Promise<ImageBitmap | HTMLImageElement> {
  if ('createImageBitmap' in window) {
    try {
      return await createImageBitmap(file)
    } catch {
      // fall through to <img> decode
    }
  }
  const url = URL.createObjectURL(file)
  try {
    const img = new Image()
    img.decoding = 'async'
    img.src = url
    await img.decode()
    return img
  } finally {
    URL.revokeObjectURL(url)
  }
}

function toBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise(resolve => canvas.toBlob(resolve, type, quality))
}
