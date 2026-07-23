// Text-legibility guarantee (founder: "make it impossible for text to not be
// readable because of its bg colour or an image behind it").
//
// Two tools:
//  1) readableInk(bg) — given a background hex, return black or white for the
//     text, whichever has better contrast. Use wherever text sits on an
//     accent/derived color (not a fixed token).
//  2) SCRIM classes — a gradient overlay to drop behind text that sits over a
//     photo, so the copy always reads regardless of the image.

// Relative luminance (WCAG) of a hex color, 0 (black) … 1 (white).
export function luminance(hex: string): number {
  const h = hex.replace('#', '')
  const full = h.length === 3 ? h.split('').map(c => c + c).join('') : h
  const r = parseInt(full.slice(0, 2), 16) / 255
  const g = parseInt(full.slice(2, 4), 16) / 255
  const b = parseInt(full.slice(4, 6), 16) / 255
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4))
  return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)
}

// Best-contrast ink for a given background. Threshold ~0.42 tuned so mid-tone
// accents (which are common) lean to the side that actually reads.
export function readableInk(bgHex: string, opts?: { light?: string; dark?: string }): string {
  const light = opts?.light ?? '#ffffff'
  const dark = opts?.dark ?? '#171310'
  try {
    return luminance(bgHex) > 0.42 ? dark : light
  } catch {
    return light
  }
}

// True when a color is light enough that white text on it would be hard to read.
export function isLightColor(hex: string): boolean {
  try {
    return luminance(hex) > 0.6
  } catch {
    return false
  }
}

// A scrim gradient to place UNDER text that overlays an image, so the copy stays
// legible over any photo. Direction picks where the text sits.
export const SCRIM = {
  bottom: 'bg-gradient-to-t from-black/75 via-black/35 to-transparent',
  top: 'bg-gradient-to-b from-black/70 via-black/25 to-transparent',
  full: 'bg-black/45',
  left: 'bg-gradient-to-r from-black/70 via-black/30 to-transparent',
} as const
