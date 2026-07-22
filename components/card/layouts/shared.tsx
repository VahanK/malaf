'use client'

import { mediaUrl } from '@/lib/media'
import type { PublicPage } from '@/lib/public-page'

// Shared primitives for the three website-grade layouts. Each layout owns its
// own STRUCTURE (hero shape, section order, gallery grammar); these helpers
// only normalize the data every layout needs the same way.

export const STATUS_STYLES: Record<string, { dot: string; label: (note: string, status: string) => string }> = {
  available: { dot: '#3ddc84', label: (note) => note || 'Available for work' },
  busy: { dot: '#eda100', label: (note) => note || 'Booked — join the waitlist' },
  away: { dot: '#9aa0ae', label: (note, status) => note || status },
}

export interface HeroMedia {
  url: string | null
  alt: string
}

/** All portfolio images flattened out of the blocks, in page order — the raw
 *  material a real gallery section draws from, independent of block type. */
export function collectImages(page: PublicPage): HeroMedia[] {
  const out: HeroMedia[] = []
  for (const b of page.blocks) {
    if (b.type === 'image_grid') {
      const imgs = (b.data.images as { url?: string; alt?: string }[] | undefined) ?? []
      for (const im of imgs) if (im.url) out.push({ url: mediaUrl(im.url), alt: im.alt ?? '' })
    } else if (b.type === 'before_after') {
      const after = b.data.after as { url?: string } | undefined
      const before = b.data.before as { url?: string } | undefined
      if (after?.url) out.push({ url: mediaUrl(after.url), alt: 'After' })
      if (before?.url) out.push({ url: mediaUrl(before.url), alt: 'Before' })
    }
  }
  return out
}

/** The single best image to anchor a hero — first gallery photo, else avatar. */
export function heroImage(page: PublicPage): HeroMedia {
  const imgs = collectImages(page)
  if (imgs.length) return imgs[0]
  const av = mediaUrl(page.profile.avatar_url)
  return { url: av, alt: page.profile.full_name }
}

export function testimonials(page: PublicPage) {
  return page.blocks
    .filter(b => b.type === 'testimonial')
    .map(b => ({
      text: (b.data.text as string) ?? '',
      attribution: (b.data.attribution as string) ?? '',
      date_label: (b.data.date_label as string) ?? '',
    }))
    .filter(t => t.text)
}

export function stats(page: PublicPage) {
  return page.blocks
    .filter(b => b.type === 'stat_card')
    .map(b => ({ value: (b.data.value as string) ?? '', label: (b.data.label as string) ?? '' }))
    .filter(s => s.value)
}

export function beforeAfters(page: PublicPage) {
  return page.blocks
    .filter(b => b.type === 'before_after')
    .map(b => ({
      before: mediaUrl((b.data.before as { url?: string } | undefined)?.url),
      after: mediaUrl((b.data.after as { url?: string } | undefined)?.url),
      caption: (b.data.caption as string) ?? '',
    }))
}

export { mediaUrl }
