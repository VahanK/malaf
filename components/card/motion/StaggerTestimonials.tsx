'use client'

import { useState } from 'react'
import { motion } from 'motion/react'
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi'
import { useReducedMotion } from '../motion/gates'

interface Quote {
  text: string
  attribution: string
  date_label?: string
}

interface StaggerTestimonialsProps {
  quotes: Quote[]
  accent: string
  isRtl: boolean
  title?: string
}

const NOTCH =
  'polygon(0 14px, 14px 0, 100% 0, 100% calc(100% - 14px), calc(100% - 14px) 100%, 0 100%)'

function Card({ q, accent }: { q: Quote; accent: string }) {
  return (
    <div
      className="flex h-full w-full flex-col justify-between gap-4 p-5 sm:p-6"
      style={{ clipPath: NOTCH }}
    >
      <p className="text-[15px] leading-relaxed" style={{ color: 'var(--card-ink)' }}>
        “{q.text}”
      </p>
      <div className="flex items-baseline justify-between gap-3">
        <span className="text-sm font-semibold" style={{ color: accent }}>
          {q.attribution}
        </span>
        {q.date_label && (
          <span className="text-xs" style={{ color: 'var(--card-muted)' }}>
            {q.date_label}
          </span>
        )}
      </div>
    </div>
  )
}

export function StaggerTestimonials({ quotes, accent, isRtl, title }: StaggerTestimonialsProps) {
  const reduced = useReducedMotion()
  const items = (quotes || []).filter((q) => q?.text)
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i))

  if (items.length === 0) return null

  const dir = isRtl ? -1 : 1

  const rotate = (back: boolean) => {
    setOrder((o) => {
      const n = [...o]
      if (back) n.unshift(n.pop() as number)
      else n.push(n.shift() as number)
      return n
    })
  }

  if (reduced) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full">
        {title && (
          <h3 className="mb-4 text-lg font-bold" style={{ color: 'var(--card-ink)' }}>
            {title}
          </h3>
        )}
        <div className="grid gap-3 sm:grid-cols-2">
          {items.map((q, i) => (
            <div
              key={i}
              className="border"
              style={{
                clipPath: NOTCH,
                background: 'var(--card-surface)',
                borderColor: 'var(--card-border)',
              }}
            >
              <Card q={q} accent={accent} />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full">
      {title && (
        <h3 className="mb-4 text-lg font-bold" style={{ color: 'var(--card-ink)' }}>
          {title}
        </h3>
      )}
      <div className="relative mx-auto h-64 w-full max-w-md" style={{ perspective: 1000 }}>
        {order.map((idx, pos) => {
          const depth = pos
          const active = pos === 0
          const tilt = ((depth % 2 === 0 ? 1 : -1) * 2.5 * dir) * (active ? 0 : 1)
          const offset = depth * 10 * dir
          return (
            <motion.button
              key={idx}
              type="button"
              onClick={() => (active ? rotate(false) : setOrder((o) => [...o.slice(pos), ...o.slice(0, pos)]))}
              className="absolute inset-0 mx-auto w-full text-start"
              initial={false}
              animate={{
                x: offset,
                y: depth * 6,
                rotate: tilt,
                scale: active ? 1 : 1 - depth * 0.04,
                zIndex: items.length - depth,
                opacity: depth > 3 ? 0 : 1,
              }}
              transition={{ type: 'spring', stiffness: 320, damping: 30 }}
              style={{
                clipPath: NOTCH,
                background: active ? `color-mix(in srgb, ${accent} 12%, var(--card-surface))` : 'var(--card-surface)',
                border: `1px solid ${active ? accent : 'var(--card-border)'}`,
                boxShadow: active ? `10px 10px 0 -2px ${accent}` : '4px 4px 0 -1px var(--card-border)',
                pointerEvents: depth > 3 ? 'none' : 'auto',
                cursor: 'pointer',
              }}
            >
              <Card q={items[idx]} accent={accent} />
            </motion.button>
          )
        })}
      </div>
      <div className="mt-5 flex items-center justify-center gap-3">
        <button
          type="button"
          onClick={() => rotate(true)}
          aria-label="previous"
          className="grid h-10 w-10 place-items-center rounded-full border transition-transform active:scale-90"
          style={{ borderColor: 'var(--card-border)', color: 'var(--card-ink)' }}
        >
          {isRtl ? <FiChevronRight /> : <FiChevronLeft />}
        </button>
        <button
          type="button"
          onClick={() => rotate(false)}
          aria-label="next"
          className="grid h-10 w-10 place-items-center rounded-full border transition-transform active:scale-90"
          style={{ background: accent, borderColor: accent, color: 'var(--card-bg)' }}
        >
          {isRtl ? <FiChevronLeft /> : <FiChevronRight />}
        </button>
      </div>
    </div>
  )
}
