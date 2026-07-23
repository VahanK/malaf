'use client'

import dynamic from 'next/dynamic'

// Lazy registry for the premium-motion variants. Every heavy effect is loaded
// via next/dynamic so a page only ships the code for the variants IT picks —
// the non-negotiable architecture from the motion plan (nobody pays for effects
// they didn't choose). ssr:false keeps scroll/cursor/canvas work client-only.
// NOTE: Turbopack requires the options arg to be an INLINE object literal (not a
// shared const), so { ssr: false } is repeated per entry on purpose.

// ── Showcase (work) motion variants ──
export const OppoScroll = dynamic(() => import('./OppoScroll').then(m => m.OppoScroll), { ssr: false })
export const GridCards = dynamic(() => import('./GridCards').then(m => m.GridCards), { ssr: false })
export const CardCarousel = dynamic(() => import('./CardCarousel').then(m => m.CardCarousel), { ssr: false })
export const SpringCards = dynamic(() => import('./SpringCards').then(m => m.SpringCards), { ssr: false })
export const StickyCards = dynamic(() => import('./StickyCards').then(m => m.StickyCards), { ssr: false })
export const ScrollFadeFeatures = dynamic(() => import('./ScrollFadeFeatures').then(m => m.ScrollFadeFeatures), { ssr: false })
export const TextParallax = dynamic(() => import('./TextParallax').then(m => m.TextParallax), { ssr: false })

// ── Gallery motion variants ──
export const HorizontalScrollGallery = dynamic(() => import('./HorizontalScrollGallery').then(m => m.HorizontalScrollGallery), { ssr: false })
export const SwipeCards = dynamic(() => import('./SwipeCards').then(m => m.SwipeCards), { ssr: false })

// ── Stats motion variants ──
export const CountUpStats = dynamic(() => import('./CountUpStats').then(m => m.CountUpStats), { ssr: false })
export const InteractiveStatGrid = dynamic(() => import('./InteractiveStatGrid').then(m => m.InteractiveStatGrid), { ssr: false })

// ── Testimonial motion variants ──
export const StaggerTestimonials = dynamic(() => import('./StaggerTestimonials').then(m => m.StaggerTestimonials), { ssr: false })
export const StackedAutoTestimonials = dynamic(() => import('./StackedAutoTestimonials').then(m => m.StackedAutoTestimonials), { ssr: false })

// ── Hero / flourish variants ──
export const Typewrite = dynamic(() => import('./Typewrite').then(m => m.Typewrite), { ssr: false })
export const SpinningBoxText = dynamic(() => import('./SpinningBoxText').then(m => m.SpinningBoxText), { ssr: false })
export const SplitFlapDisplay = dynamic(() => import('./SplitFlapDisplay').then(m => m.SplitFlapDisplay), { ssr: false })
export const DotGridHero = dynamic(() => import('./DotGridHero').then(m => m.DotGridHero), { ssr: false })

// ── Form flourish ──
export const BeamInput = dynamic(() => import('./BeamInput').then(m => m.BeamInput), { ssr: false })
