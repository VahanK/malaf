'use client'

import { twMerge } from 'tailwind-merge'
import { FiArrowUpRight } from 'react-icons/fi'
import { useReducedMotion } from '../motion/gates'

interface ShowcaseItem {
  image?: string
  title?: string
  blurb?: string
  tags?: string[]
  link?: string
}

interface GridCardsProps {
  items: ShowcaseItem[]
  accent: string
  isRtl: boolean
  title?: string
}

// 8 corner-bracket segments: 2 per corner (one on each edge meeting there).
const BRACKETS = [
  'top-0 left-0 h-px w-5 origin-left',
  'top-0 left-0 w-px h-5 origin-top',
  'top-0 right-0 h-px w-5 origin-right',
  'top-0 right-0 w-px h-5 origin-top',
  'bottom-0 left-0 h-px w-5 origin-left',
  'bottom-0 left-0 w-px h-5 origin-bottom',
  'bottom-0 right-0 h-px w-5 origin-right',
  'bottom-0 right-0 w-px h-5 origin-bottom',
]

export function GridCards({ items, accent, isRtl, title }: GridCardsProps) {
  const reduced = useReducedMotion()
  const list = (items || []).filter(Boolean).slice(0, 8)
  if (!list.length) return null

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full max-w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 border-t border-l"
      style={{ borderColor: 'var(--card-border)' }}
    >
      {title ? (
        <div
          className="group relative flex flex-col justify-between gap-6 border-b border-r p-5 min-h-[11rem]"
          style={{ borderColor: 'var(--card-border)', background: 'var(--card-surface)' }}
        >
          <span className="text-[0.7rem] uppercase tracking-[0.2em]" style={{ color: 'var(--card-muted)' }}>
            {isRtl ? 'أعمال مختارة' : 'Selected work'}
          </span>
          <h2 className="text-xl font-semibold leading-tight" style={{ color: 'var(--card-ink)' }}>
            {title}
          </h2>
          <FiArrowUpRight
            className={twMerge('h-5 w-5 transition-transform', isRtl ? 'self-start -scale-x-100' : 'self-end')}
            style={{ color: accent }}
          />
        </div>
      ) : null}

      {list.map((item, i) => (
        <a
          key={i}
          href={item.link || undefined}
          target={item.link ? '_blank' : undefined}
          rel={item.link ? 'noreferrer' : undefined}
          className="group relative block overflow-hidden border-b border-r p-5 min-h-[11rem]"
          style={{ borderColor: 'var(--card-border)', background: 'var(--card-bg)' }}
        >
          {/* Blurred grayscale bg image: 10% -> 30%, unblur on hover */}
          {item.image ? (
            <span
              aria-hidden
              className={twMerge(
                'pointer-events-none absolute inset-0 bg-cover bg-center grayscale opacity-10 transition-all duration-500',
                !reduced && 'blur-md group-hover:opacity-30 group-hover:blur-0 group-hover:grayscale-0',
              )}
              style={{ backgroundImage: `url("${item.image}")` }}
            />
          ) : null}

          {/* 8 corner brackets scale 0 -> 1 on hover (emerald -> accent) */}
          {BRACKETS.map((cls, b) => (
            <span
              key={b}
              aria-hidden
              className={twMerge(
                'absolute z-10 scale-0 transition-transform duration-300 group-hover:scale-100',
                cls,
              )}
              style={{ backgroundColor: accent, boxShadow: `0 0 0 0.5px ${accent}` }}
            />
          ))}

          <div className="relative z-10 flex h-full flex-col justify-end gap-2">
            <h3
              className={twMerge(
                'text-base font-semibold leading-snug transition-transform duration-300',
                !reduced && 'group-hover:-translate-y-1',
              )}
              style={{ color: 'var(--card-ink)' }}
            >
              {item.title || (isRtl ? 'مشروع' : 'Project')}
            </h3>
            {item.blurb ? (
              <p className="line-clamp-2 text-sm" style={{ color: 'var(--card-muted)' }}>
                {item.blurb}
              </p>
            ) : null}
            {item.tags?.length ? (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {item.tags.slice(0, 3).map((t, k) => (
                  <span
                    key={k}
                    className="rounded-full border px-2 py-0.5 text-[0.7rem]"
                    style={{ borderColor: 'var(--card-border)', color: 'var(--card-muted)' }}
                  >
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </a>
      ))}
    </div>
  )
}
