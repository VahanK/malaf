'use client'

import { useEffect, useRef, useState } from 'react'
import { animate, useInView } from 'motion/react'
import { useReducedMotion } from '../motion/gates'

// Stat shape (from contract).
type Stat = { value: string; label: string }

type CountUpStatsProps = {
  stats: Stat[]
  accent: string
  isRtl: boolean
  title?: string
}

// Split "500+" -> { prefix:'', num:500, suffix:'+', decimals:0 },
// "12 yr" -> { prefix:'', num:12, suffix:' yr' }, "$1.2M" -> prefix '$'.
function parseStat(value: string) {
  const s = String(value ?? '').trim()
  const m = s.match(/-?\d[\d,]*\.?\d*/)
  if (!m) return { prefix: s, num: null as number | null, suffix: '', decimals: 0 }
  const raw = m[0]
  const clean = raw.replace(/,/g, '')
  const num = parseFloat(clean)
  const dot = clean.indexOf('.')
  const decimals = dot >= 0 ? clean.length - dot - 1 : 0
  return {
    prefix: s.slice(0, m.index),
    num: Number.isFinite(num) ? num : null,
    suffix: s.slice((m.index ?? 0) + raw.length),
    decimals,
  }
}

function StatNumber({
  value,
  start,
  reduced,
  accent,
}: {
  value: string
  start: boolean
  reduced: boolean
  accent: string
}) {
  const parsed = parseStat(value)
  const [display, setDisplay] = useState<string>(
    reduced || parsed.num === null ? value : `${parsed.prefix}0${parsed.suffix}`,
  )

  useEffect(() => {
    if (reduced || parsed.num === null || !start) return
    setDisplay(`${parsed.prefix}${(0).toFixed(parsed.decimals)}${parsed.suffix}`)
    const controls = animate(0, parsed.num, {
      duration: 2.5,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => {
        const shown = parsed.decimals ? v.toFixed(parsed.decimals) : Math.round(v).toLocaleString()
        setDisplay(`${parsed.prefix}${shown}${parsed.suffix}`)
      },
    })
    return () => controls.stop()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [start, reduced, value])

  return (
    <span
      className="block font-bold leading-none tracking-tight tabular-nums"
      style={{ fontSize: 'clamp(2.25rem, 8vw, 3.5rem)', color: accent }}
    >
      {reduced ? value : display}
    </span>
  )
}

export function CountUpStats({ stats, accent, isRtl, title }: CountUpStatsProps) {
  const reduced = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const inView = useInView(ref, { once: true, amount: 0.4 })
  const items = Array.isArray(stats) ? stats.filter((s) => s && (s.value || s.label)) : []

  if (items.length === 0) return null

  return (
    <div
      ref={ref}
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full max-w-full"
    >
      {title ? (
        <h3
          className="mb-5 text-sm font-semibold uppercase tracking-widest"
          style={{ color: 'var(--card-muted)' }}
        >
          {title}
        </h3>
      ) : null}
      <div className="grid grid-cols-1 gap-px overflow-hidden rounded-[var(--card-radius-lg)] sm:grid-cols-3"
        style={{ background: 'var(--card-border)' }}
      >
        {items.map((stat, i) => (
          <div
            key={i}
            className="flex flex-col gap-2 px-5 py-7"
            style={{ background: 'var(--card-surface)' }}
          >
            <StatNumber value={stat.value} start={inView} reduced={reduced} accent={accent} />
            <span
              className="text-sm font-medium leading-snug"
              style={{ color: 'var(--card-muted)' }}
            >
              {stat.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
