'use client'

import { useEffect, useRef, useState } from 'react'
import { useEdit } from './EditContext'

// Builder-only control to edit what a motion hero displays (founder: "I need to
// be able to modify what's being written" on split-flap / typewriter / word-cube).
// The motion pieces themselves are canvas/animation, so we can't click-edit their
// glyphs — instead this shows a small labeled input right below them in the
// builder. Renders nothing on the public page.
export function MotionTextEditor({
  variant,
  value,
  placeholder,
  onChange,
}: {
  variant: 'split-flap' | 'typewriter' | 'word-cube'
  value: string
  placeholder?: string
  onChange: (value: string) => void
}) {
  const { editing } = useEdit()
  const [local, setLocal] = useState(value)
  const t = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => { setLocal(value) }, [value])
  if (!editing) return null

  const commit = (v: string) => {
    setLocal(v)
    if (t.current) clearTimeout(t.current)
    // Debounce so the animation doesn't restart on every keystroke.
    t.current = setTimeout(() => onChange(v), 450)
  }

  const label =
    variant === 'split-flap' ? 'Board text' : variant === 'word-cube' ? 'Rotating words' : 'Typed phrases'
  const isList = variant !== 'split-flap'

  return (
    <div className="mt-3 flex max-w-md items-center gap-2 rounded-xl border border-dashed border-[var(--card-border)] bg-[var(--card-surface)]/80 px-3 py-2">
      <span className="shrink-0 text-[11px] font-bold uppercase tracking-wide text-[var(--card-muted)]">{label}</span>
      <input
        value={local}
        onChange={e => commit(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent text-[13px] font-medium text-[var(--card-ink)] outline-none placeholder:text-[var(--card-muted)]/60"
      />
      {isList && <span className="shrink-0 text-[10px] text-[var(--card-muted)]/70">comma-separated</span>}
    </div>
  )
}
