'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useMotionTemplate, animate } from 'motion/react'
import { FiArrowRight } from 'react-icons/fi'
import { useMotionAllowed } from '../motion/gates'

type BeamInputProps = {
  placeholder?: string
  ctaLabel?: string
  waHref?: string
  accent: string
  isRtl: boolean
  title?: string
}

export function BeamInput({ placeholder, ctaLabel, waHref, accent, isRtl, title }: BeamInputProps) {
  const allowed = useMotionAllowed()
  const turn = useMotionValue(0)
  const [value, setValue] = useState('')
  const [hover, setHover] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  // Conic beam that sweeps around the pill border. The double linear-gradient +
  // mask-composite:exclude carves out the interior so only a 2px ring shows.
  const beam = useMotionTemplate`conic-gradient(from ${turn}turn at 50% 50%, transparent 0deg, ${accent} 40deg, transparent 120deg)`

  useEffect(() => {
    if (!allowed) return
    const controls = animate(turn, 1, {
      duration: 4,
      ease: 'linear',
      repeat: Infinity,
    })
    return () => controls.stop()
  }, [allowed, turn])

  function submit(e: React.FormEvent) {
    e.preventDefault()
    if (waHref) {
      const q = value.trim()
      const url = q
        ? waHref + (waHref.includes('?') ? '&' : '?') + 'text=' + encodeURIComponent(q)
        : waHref
      window.open(url, '_blank', 'noopener,noreferrer')
    }
  }

  const cta = ctaLabel || (isRtl ? 'ابعت' : 'Send')
  const ph = placeholder || (isRtl ? 'رقمك أو إيميلك…' : 'Your number or email…')

  return (
    <div dir={isRtl ? 'rtl' : 'ltr'} className="w-full max-w-full">
      {title ? (
        <p className="mb-3 text-sm font-medium" style={{ color: 'var(--card-muted)' }}>
          {title}
        </p>
      ) : null}
      <form onSubmit={submit} className="relative w-full max-w-full">
        {/* Beam ring layer — sits behind, masked to a thin border. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-full"
          style={{
            padding: 2,
            background: allowed ? undefined : accent,
            WebkitMask:
              'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            WebkitMaskComposite: 'xor',
            mask: 'linear-gradient(#fff 0 0) padding-box, linear-gradient(#fff 0 0)',
            maskComposite: 'exclude',
          }}
        >
          <motion.div
            className="h-full w-full rounded-full"
            style={{ background: allowed ? beam : accent }}
          />
        </div>

        <div
          className="relative flex items-center gap-2 rounded-full py-1.5 ps-4 pe-1.5"
          style={{
            background: 'var(--card-surface)',
            border: '1px solid var(--card-border)',
          }}
        >
          <input
            ref={inputRef}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={ph}
            aria-label={ph}
            className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:opacity-60"
            style={{ color: 'var(--card-ink)' }}
          />
          <button
            type="submit"
            onMouseEnter={() => setHover(true)}
            onMouseLeave={() => setHover(false)}
            onFocus={() => setHover(true)}
            onBlur={() => setHover(false)}
            className="group flex shrink-0 items-center gap-1.5 overflow-hidden rounded-full px-4 py-2 text-sm font-semibold text-white transition-transform active:scale-95"
            style={{ background: accent }}
          >
            <span className="whitespace-nowrap">{cta}</span>
            <motion.span
              className="flex items-center"
              initial={false}
              animate={
                allowed
                  ? { width: hover ? 16 : 0, opacity: hover ? 1 : 0 }
                  : { width: 16, opacity: 1 }
              }
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              style={{ overflow: 'hidden' }}
            >
              <FiArrowRight
                size={16}
                style={{ transform: isRtl ? 'scaleX(-1)' : undefined }}
              />
            </motion.span>
          </button>
        </div>
      </form>
    </div>
  )
}
