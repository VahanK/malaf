'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { twMerge } from 'tailwind-merge'
import { useMotionAllowed } from '../motion/gates'

// Full-height cards that stick to the top and slide UP over each other as you
// scroll — each card's scroll progress drives a small scale/overlap so the next
// card visibly stacks on top. Alternating black/white with a hard neubrutalist
// shadow. reduced-motion / touch → plain stacked sections (same content).

type ShowcaseItem = {
  image?: string
  title?: string
  blurb?: string
  tags?: string[]
}

type StickyCardsProps = {
  items: ShowcaseItem[]
  accent: string
  isRtl: boolean
  title?: string
}

function Panel({ item, i, total, accent, isRtl, animate }: {
  item: ShowcaseItem; i: number; total: number; accent: string; isRtl: boolean; animate: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start start', 'end start'],
  })
  // Outgoing card shrinks slightly as the next slides over it.
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.92])
  const dark = i % 2 === 0
  const isLast = i === total - 1

  const shadow = dark
    ? '8px 8px 0 0 var(--card-ink)'
    : `8px 8px 0 0 ${accent}`

  return (
    <div
      ref={ref}
      className={twMerge('sticky top-0 flex min-h-[100svh] items-center justify-center px-4 py-8')}
      style={animate ? { top: `${i * 14}px` } : undefined}
    >
      <motion.article
        style={{
          scale: animate && !isLast ? scale : 1,
          background: dark ? 'var(--card-ink)' : 'var(--card-bg)',
          color: dark ? 'var(--card-bg)' : 'var(--card-ink)',
          boxShadow: shadow,
          borderColor: dark ? accent : 'var(--card-ink)',
        }}
        className="flex w-full max-w-3xl flex-col gap-4 rounded-[var(--card-radius-lg)] border-2 p-6 sm:p-9"
      >
        <div className="flex items-center gap-3" dir={isRtl ? 'rtl' : 'ltr'}>
          <span
            className="grid h-8 w-8 flex-none place-items-center rounded-full text-[13px] font-black"
            style={{ background: accent, color: 'var(--card-ink)' }}
          >
            {String(i + 1).padStart(2, '0')}
          </span>
          {item.tags?.[0] && (
            <span className="truncate text-[11px] font-bold uppercase tracking-[0.18em] opacity-60">
              {item.tags[0]}
            </span>
          )}
        </div>

        {item.title && (
          <h3 className="max-w-full break-words text-3xl font-black leading-[1.05] tracking-tight sm:text-5xl">
            {item.title}
          </h3>
        )}
        {item.blurb && (
          <p className="max-w-full text-[15px] leading-relaxed opacity-80 sm:text-base">
            {item.blurb}
          </p>
        )}

        {item.image && (
          <div className="mt-1 overflow-hidden rounded-2xl border-2" style={{ borderColor: 'currentColor' }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={item.title || ''}
              className="h-48 w-full max-w-full object-cover sm:h-72"
              loading="lazy"
            />
          </div>
        )}
      </motion.article>
    </div>
  )
}

export function StickyCards({ items, accent, isRtl, title }: StickyCardsProps) {
  const animate = useMotionAllowed()
  const list = items?.filter(Boolean) ?? []
  if (list.length === 0) return null

  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full">
      {title && (
        <h2 className="mb-4 px-4 text-2xl font-black tracking-tight text-[var(--card-ink)] sm:text-3xl">
          {title}
        </h2>
      )}
      {list.map((item, i) => (
        <Panel
          key={i}
          item={item}
          i={i}
          total={list.length}
          accent={accent}
          isRtl={isRtl}
          animate={animate}
        />
      ))}
    </section>
  )
}
