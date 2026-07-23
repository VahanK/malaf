'use client'

import { useRef } from 'react'
import { motion, useScroll, useTransform } from 'motion/react'
import { twMerge } from 'tailwind-merge'
import { useMotionAllowed, useIsDesktopPointer } from '../motion/gates'

interface ShowcaseItem {
  image?: string
  title?: string
  blurb?: string
}

interface OppoScrollProps {
  items: ShowcaseItem[]
  accent: string
  isRtl: boolean
  title?: string
}

// Opposing sticky-image scroll: left column of alternating black/white content
// panels scrolls normally; the right column pins an image stack that slides the
// OPPOSITE direction as you scroll, so text and image cross past each other.
export function OppoScroll({ items, accent, isRtl, title }: OppoScrollProps) {
  const list = (items || []).filter((it) => it && (it.image || it.title || it.blurb))
  const targetRef = useRef<HTMLDivElement>(null)
  const allowed = useMotionAllowed()
  const desktop = useIsDesktopPointer()
  const fancy = allowed && desktop

  const { scrollYProgress } = useScroll({ target: targetRef })
  const n = Math.max(list.length, 1)
  // Images are stacked bottom-up (reversed). Slide from showing the last image to
  // the first, opposite the downward text scroll.
  const y = useTransform(scrollYProgress, [0, 1], ['-' + (n - 1) * 100 + 'vh', '0vh'])

  if (list.length === 0) return null

  // Reduced-motion / touch fallback: plain stacked rows, same content.
  if (!fancy) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full flex flex-col gap-0">
        {title ? (
          <h2 className="px-6 pt-8 pb-4 text-2xl font-bold" style={{ color: 'var(--card-ink)' }}>
            {title}
          </h2>
        ) : null}
        {list.map((it, i) => (
          <div
            key={i}
            className={twMerge(
              'w-full max-w-full flex flex-col gap-4 px-6 py-8',
              i % 2 === 0 ? 'bg-black text-white' : 'bg-white text-black',
            )}
          >
            {it.image ? (
              <img
                src={it.image}
                alt={it.title || ''}
                className="w-full max-w-full aspect-[4/3] object-cover rounded-[var(--card-radius-lg)]"
              />
            ) : null}
            {it.title ? (
              <h3 className="text-xl font-bold" style={{ color: accent }}>
                {it.title}
              </h3>
            ) : null}
            {it.blurb ? <p className="text-sm opacity-80 leading-relaxed">{it.blurb}</p> : null}
          </div>
        ))}
      </div>
    )
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} ref={targetRef} className="relative w-full max-w-full">
      <div className="grid grid-cols-2 w-full max-w-full">
        {/* Left: full-height alternating content panels */}
        <div className="flex flex-col">
          {title ? (
            <div className="flex h-[40vh] items-end px-8 pb-6 bg-black text-white">
              <h2 className="text-3xl font-bold" style={{ color: accent }}>
                {title}
              </h2>
            </div>
          ) : null}
          {list.map((it, i) => (
            <div
              key={i}
              className={twMerge(
                'flex h-screen flex-col justify-center gap-4 px-8',
                i % 2 === 0 ? 'bg-black text-white' : 'bg-white text-black',
              )}
            >
              {it.title ? (
                <h3 className="text-3xl font-bold leading-tight" style={{ color: accent }}>
                  {it.title}
                </h3>
              ) : null}
              {it.blurb ? (
                <p className="max-w-md text-base leading-relaxed opacity-80">{it.blurb}</p>
              ) : null}
            </div>
          ))}
        </div>

        {/* Right: sticky viewport with an over-tall stack sliding the opposite way */}
        <div className="sticky top-0 h-screen overflow-hidden">
          <motion.div style={{ y }} className="flex flex-col-reverse">
            {list.map((it, i) => (
              <div key={i} className="relative h-screen w-full">
                {it.image ? (
                  <img
                    src={it.image}
                    alt={it.title || ''}
                    className="h-screen w-full object-cover"
                  />
                ) : (
                  <div className="h-screen w-full" style={{ backgroundColor: accent, opacity: 0.15 }} />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
