'use client'

import { mediaUrl } from '@/lib/media'
import { normalizeAccent } from '@/lib/card-templates'

// One image primitive for every card slot. Solves two things at once:
//  1) ANY dimension looks right — a fixed-aspect container + object-cover + a
//     neutral ground, so portrait/landscape/square/tiny never stretch or gap.
//  2) EMPTY looks DESIGNED, not broken — when there's no image we render a
//     tasteful accent gradient placeholder (never a broken-image icon), so a new
//     or asset-light page still looks intentional.
export function CardImage({
  src,
  alt = '',
  aspect = 'aspect-[4/3]',
  rounded = 'rounded-[var(--card-radius-md)]',
  accent = '#c9a45c',
  className = '',
  label,
}: {
  src?: string | null
  alt?: string
  /** Tailwind aspect class — the container's shape is fixed regardless of the
   *  image's real dimensions. */
  aspect?: string
  rounded?: string
  accent?: string
  className?: string
  /** Optional caption shown centered on the placeholder (e.g. "Add a photo"). */
  label?: string
}) {
  const url = mediaUrl(src)
  const a6 = normalizeAccent(accent)
  return (
    <div className={`relative w-full overflow-hidden bg-[var(--card-surface-soft)] ${aspect} ${rounded} ${className}`}>
      {url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={url} alt={alt} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center"
          style={{ background: `linear-gradient(135deg, ${a6}26, ${a6}0d 60%, transparent), var(--card-surface-soft)` }}
        >
          <div className="flex flex-col items-center gap-2 text-center" style={{ color: a6 }}>
            <PhotoGlyph />
            {label && <span className="text-[12px] font-semibold opacity-80">{label}</span>}
          </div>
        </div>
      )}
    </div>
  )
}

function PhotoGlyph() {
  return (
    <svg width="34" height="34" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="opacity-55">
      <rect x="3" y="3" width="18" height="18" rx="3" />
      <circle cx="8.5" cy="8.5" r="1.6" />
      <path d="M21 15l-5-5L5 21" />
    </svg>
  )
}
