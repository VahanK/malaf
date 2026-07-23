'use client'

import { useState } from 'react'
import { motion, useMotionValue, useTransform } from 'motion/react'
import { useReducedMotion } from '../motion/gates'

interface GalleryImage {
  url: string
  alt?: string
}
interface SwipeCardsProps {
  images: GalleryImage[]
  accent: string
  isRtl?: boolean
  title?: string
}

// Tinder-style draggable photo deck. Drag is a TOUCH-native gesture, so this runs
// on phones (only gated off for reduced-motion → plain grid). Each card shows its
// caption (the image alt) overlaid on a scrim so text always reads. Swipe the
// front card past a threshold to send it to the back.
function FrontCard({ image, accent, onDismiss }: { image: GalleryImage; accent: string; onDismiss: () => void }) {
  const x = useMotionValue(0)
  const rotate = useTransform(x, [-200, 0, 200], [-16, 0, 16])
  const opacity = useTransform(x, [-220, -80, 0, 80, 220], [0, 1, 1, 1, 0])

  return (
    <motion.div
      className="absolute inset-0 cursor-grab touch-none overflow-hidden rounded-[var(--card-radius-lg)] bg-[var(--card-surface)] shadow-2xl active:cursor-grabbing"
      style={{ x, rotate, opacity, zIndex: 20 }}
      drag="x"
      dragElastic={0.7}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={(_, info) => { if (Math.abs(info.offset.x) > 90) onDismiss() }}
      whileTap={{ scale: 0.98 }}
    >
      {image.url
        // eslint-disable-next-line @next/next/no-img-element
        ? <img src={image.url} alt={image.alt || ''} draggable={false} className="pointer-events-none h-full w-full select-none object-cover" />
        : <div className="h-full w-full" style={{ background: accent }} />}
      {image.alt ? (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 to-transparent p-4 pt-10">
          <p className="text-[15px] font-bold text-white">{image.alt}</p>
        </div>
      ) : null}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1" style={{ background: accent }} />
    </motion.div>
  )
}

export function SwipeCards({ images, accent, isRtl, title }: SwipeCardsProps) {
  const items = (images || []).filter(i => i && i.url)
  const reduced = useReducedMotion()
  const [order, setOrder] = useState<number[]>(() => items.map((_, i) => i))
  if (items.length === 0) return null

  // Reduced motion → plain captioned grid, same content.
  if (reduced) {
    return (
      <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full px-6">
        {title ? <h3 className="mb-3 text-lg font-bold text-[var(--card-ink)]">{title}</h3> : null}
        <div className="grid max-w-full grid-cols-2 gap-3 sm:grid-cols-3">
          {items.map((img, i) => (
            <figure key={i} className="overflow-hidden rounded-[var(--card-radius-lg)] bg-[var(--card-surface)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img.url} alt={img.alt || ''} className="aspect-square w-full object-cover" />
              {img.alt ? <figcaption className="px-2 py-1.5 text-[12px] text-[var(--card-muted)]">{img.alt}</figcaption> : null}
            </figure>
          ))}
        </div>
      </div>
    )
  }

  const dismiss = () => setOrder(prev => (prev.length < 2 ? prev : [...prev.slice(1), prev[0]]))
  const dir = isRtl ? -1 : 1

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="flex w-full max-w-full flex-col items-center px-6">
      {title ? <h3 className="mb-4 text-lg font-bold text-[var(--card-ink)]">{title}</h3> : null}
      <div className="relative aspect-[4/5] w-full max-w-sm">
        {order.slice(0, 4).reverse().map((idx, revPos, arr) => {
          const depth = arr.length - 1 - revPos // 0 = front
          if (depth === 0) return <FrontCard key={idx} image={items[idx]} accent={accent} onDismiss={dismiss} />
          return (
            <div
              key={idx}
              className="absolute inset-0 overflow-hidden rounded-[var(--card-radius-lg)] bg-[var(--card-surface)] shadow-md"
              style={{ transform: `translateX(${depth * 10 * dir}px) translateY(${depth * 8}px) scale(${1 - depth * 0.05}) rotate(${depth * 2.5 * dir}deg)`, zIndex: 10 - depth }}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={items[idx].url} alt={items[idx].alt || ''} className="h-full w-full object-cover opacity-90" />
            </div>
          )
        })}
      </div>
      {items.length > 1 && (
        <p className="mt-4 text-center text-[12px] text-[var(--card-muted)]">
          {isRtl ? 'اسحب لرؤية المزيد ←' : '← Swipe to see more →'}
        </p>
      )}
    </div>
  )
}
