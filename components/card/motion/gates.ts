'use client'

import { useEffect, useState } from 'react'

// Shared gates for the premium-motion library. Every heavy/scroll/cursor effect
// must degrade gracefully — Lebanon's "performance IS localization" rule +
// accessibility. These hooks let a variant decide at runtime whether to run its
// full motion, a lighter version, or a static fallback.

// True when the user asked for reduced motion (OS setting). Effects should show
// a static final state instead of animating.
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setReduced(mq.matches)
    const on = () => setReduced(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return reduced
}

// True on a pointer:fine + wide viewport — i.e. a desktop with a mouse. Cursor-
// following effects (magnetic nav, dock-magnify, mouse blobs) should only run
// here and fall back to a plain layout on touch / small screens.
export function useIsDesktopPointer(): boolean {
  const [ok, setOk] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine) and (min-width: 1024px)')
    setOk(mq.matches)
    const on = () => setOk(mq.matches)
    mq.addEventListener('change', on)
    return () => mq.removeEventListener('change', on)
  }, [])
  return ok
}

// Convenience: run the fancy path only when motion is allowed AND (if the effect
// is cursor-based) we're on a desktop pointer.
export function useMotionAllowed(requiresPointer = false): boolean {
  const reduced = useReducedMotion()
  const desktop = useIsDesktopPointer()
  if (reduced) return false
  if (requiresPointer && !desktop) return false
  return true
}
