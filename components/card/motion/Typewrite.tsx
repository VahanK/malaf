'use client'

import { useEffect, useRef, useState } from 'react'
import { motion } from 'motion/react'
import { useMotionAllowed } from '../motion/gates'

type TypewriteProps = {
  phrases: string[]
  accent: string
  isRtl: boolean
  title?: string
}

const LETTER_MS = 55
const HOLD_MS = 2600
const ERASE_MS = 30

export function Typewrite({ phrases, accent, isRtl, title }: TypewriteProps) {
  const allowed = useMotionAllowed()
  const list = phrases && phrases.length ? phrases : ['']
  const [text, setText] = useState('')
  const [idx, setIdx] = useState(0)
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)

  useEffect(() => {
    if (!allowed) return
    let i = 0
    let phrase = 0
    let erasing = false
    const step = () => {
      const full = list[phrase % list.length]
      if (!erasing) {
        i++
        setText(full.slice(0, i))
        setIdx(phrase % list.length)
        if (i >= full.length) {
          erasing = true
          timer.current = setTimeout(step, HOLD_MS)
          return
        }
        timer.current = setTimeout(step, LETTER_MS)
      } else {
        i--
        setText(full.slice(0, Math.max(0, i)))
        if (i <= 0) {
          erasing = false
          phrase++
          timer.current = setTimeout(step, LETTER_MS * 4)
          return
        }
        timer.current = setTimeout(step, ERASE_MS)
      }
    }
    timer.current = setTimeout(step, LETTER_MS)
    return () => {
      if (timer.current) clearTimeout(timer.current)
    }
  }, [allowed, list])

  // Reduced motion / SSR-safe: static first phrase, no cursor loop.
  const shown = allowed ? text : list[0]
  const showCursor = allowed

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="max-w-full"
      style={{ color: 'var(--card-ink)' }}
    >
      {title ? (
        <div
          className="mb-1 text-xs font-medium uppercase tracking-wide"
          style={{ color: 'var(--card-muted)' }}
        >
          {title}
        </div>
      ) : null}
      <p
        className="flex flex-wrap items-center gap-0 text-lg font-medium leading-snug sm:text-xl"
        aria-live="polite"
      >
        <span className="whitespace-pre-wrap break-words">{shown}</span>
        {showCursor ? (
          <motion.span
            aria-hidden
            className="ml-0.5 inline-block h-[1.05em] w-[0.5ch] translate-y-[0.12em] rounded-[1px]"
            style={{ backgroundColor: accent, marginInlineStart: '0.1em' }}
            animate={{ opacity: [1, 1, 0, 0] }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear', times: [0, 0.5, 0.5, 1] }}
          />
        ) : null}
        <span className="sr-only">{list[idx]}</span>
      </p>
    </div>
  )
}
