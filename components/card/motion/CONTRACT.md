# Motion component contract (read before building any variant)

Every component in `components/card/motion/` is a self-contained, lazy-loadable
premium-motion variant for a card section. Follow this EXACTLY so it wires in.

## Rules
1. `'use client'` at top. Import motion from `'motion/react'` (NOT 'framer-motion').
2. Import degradation gates from `'../motion/gates'`:
   `useReducedMotion()`, `useIsDesktopPointer()`, `useMotionAllowed(requiresPointer?)`.
   - prefers-reduced-motion → render a STATIC final state (no animation loop).
   - cursor/pointer/drag effects → gate with useIsDesktopPointer(); on touch render a
     simple non-cursor fallback (a plain grid/row), never nothing for content sections.
3. RTL: accept `isRtl: boolean`. Mirror horizontal direction / edges for Arabic.
   Wrap the root in `dir={isRtl ? 'rtl' : 'ltr'}` when direction matters.
4. Accent: accept `accent: string` (already normalized hex). Use for highlights.
5. NO new npm deps. Available: motion@12 (motion/react), tailwind-merge (twMerge),
   react-icons (import specific icons), animejs. NOT three/r3f (WebGL cube is out).
6. Images: use the existing `mediaUrl` via already-resolved `url` strings passed in
   props — DON'T re-import storage helpers; props carry final URLs.
7. Tailwind only for styles (project uses Tailwind v4 + CSS vars like
   var(--card-bg), var(--card-ink), var(--card-muted), var(--card-border),
   var(--card-surface), var(--card-radius-lg)). Prefer these tokens.
8. Export ONE named component matching the filename (e.g. `export function OppoScroll(...)`).
9. Lazy: the file must be safe to `next/dynamic(() => import(...), { ssr: false })`.
   Keep all browser-only work (window, matchMedia, scroll) inside effects/hooks.
10. Keep it ~120 lines. Mobile-safe (no fixed pixel widths that overflow; use max-w-full).

## Prop shapes (already normalized — components receive these, not raw blocks)
- ShowcaseItem: { image?: string; title?: string; blurb?: string; tags?: string[];
    link?: string; repo_url?: string; live_url?: string; tech?: string[] }
- GalleryImage: { url: string; alt?: string }
- Stat: { value: string; label: string }   // value like "500+", "12 yr", "200ms"
- Quote: { text: string; attribution: string; date_label?: string }

Common props every component takes: { accent: string; isRtl: boolean } plus its data
array (items / images / stats / quotes) and optional { title?: string }.

## Reduced-motion fallback is MANDATORY and must render the same CONTENT
Never hide content behind motion. If reduced/!desktop, show the items/images/quotes
in a plain grid or row. The animation is an enhancement, not the content.
