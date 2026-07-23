'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { twMerge } from 'tailwind-merge'
import { useReducedMotion } from '../motion/gates'

interface ShowcaseItem {
  image?: string
  title?: string
  blurb?: string
  tags?: string[]
  link?: string
  live_url?: string
}

interface TextParallaxProps {
  items: ShowcaseItem[]
  accent: string
  isRtl: boolean
  title?: string
}

function ParallaxBlock({
  item,
  accent,
  isRtl,
  animate,
}: {
  item: ShowcaseItem
  accent: string
  isRtl: boolean
  animate: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })

  const y = useTransform(scrollYProgress, [0, 1], [250, -250])
  const opacity = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 1, 1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.5, 1], [1.15, 1.05, 1.15])
  const dark = useTransform(scrollYProgress, [0, 0.5, 1], [0.35, 0.6, 0.35])

  const heading = item.title || 'Featured work'
  const hasImage = Boolean(item.image)
  const gradient = `linear-gradient(135deg, ${accent} 0%, var(--card-surface) 100%)`

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="max-w-full">
      <div
        ref={ref}
        className="relative w-full max-w-full overflow-hidden rounded-[var(--card-radius-lg)]"
        style={{ height: 'min(70vh, 460px)' }}
      >
        {hasImage ? (
          <motion.img
            src={item.image}
            alt={heading}
            style={animate ? { scale } : undefined}
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <motion.div
            style={animate ? { scale, background: gradient } : { background: gradient }}
            className="absolute inset-0 h-full w-full"
          />
        )}

        <motion.div
          aria-hidden
          className="absolute inset-0 bg-black"
          style={animate ? { opacity: dark } : { opacity: 0.45 }}
        />

        <div className="absolute inset-0 flex items-center justify-center p-4">
          <motion.h2
            style={animate ? { y, opacity } : undefined}
            className="text-center text-4xl font-black leading-tight tracking-tight text-white drop-shadow-lg sm:text-6xl"
          >
            {heading}
          </motion.h2>
        </div>
      </div>

      {(item.blurb || item.tags?.length) && (
        <div className={twMerge('mt-5 px-1', isRtl ? 'text-right' : 'text-left')}>
          {item.blurb && (
            <p className="max-w-2xl text-base leading-relaxed text-[var(--card-muted)]">
              {item.blurb}
            </p>
          )}
          {item.tags?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {item.tags.slice(0, 6).map((t, i) => (
                <span
                  key={i}
                  className="rounded-full border border-[var(--card-border)] px-3 py-1 text-xs font-medium"
                  style={{ color: accent }}
                >
                  {t}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export function TextParallax({ items, accent, isRtl, title }: TextParallaxProps) {
  const reduced = useReducedMotion()
  const animate = !reduced
  const flagship = (items || []).filter((i) => i && (i.image || i.title || i.blurb)).slice(0, 2)

  if (flagship.length === 0) return null

  return (
    <section dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full">
      {title && (
        <h3
          className={twMerge(
            'mb-6 text-sm font-semibold uppercase tracking-widest text-[var(--card-muted)]',
            isRtl ? 'text-right' : 'text-left'
          )}
        >
          {title}
        </h3>
      )}
      <div className="flex flex-col gap-16">
        {flagship.map((item, i) => (
          <ParallaxBlock key={i} item={item} accent={accent} isRtl={isRtl} animate={animate} />
        ))}
      </div>
    </section>
  )
}
