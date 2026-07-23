'use client'

import dynamic from 'next/dynamic'

// Lazy registry for the premium-motion variants. Every heavy effect is loaded
// via next/dynamic so a page only ships the code for the variants IT picks —
// the non-negotiable architecture from the motion plan (nobody pays for effects
// they didn't choose). ssr:false keeps scroll/cursor/canvas work client-only.
// Each entry is keyed by the variant id used in the section registry + renderer.

const opts = { ssr: false }

// ── Showcase (work) motion variants ──
export const OppoScroll = dynamic(() => import('./OppoScroll').then(m => m.OppoScroll), opts)
export const GridCards = dynamic(() => import('./GridCards').then(m => m.GridCards), opts)
export const CardCarousel = dynamic(() => import('./CardCarousel').then(m => m.CardCarousel), opts)
export const SpringCards = dynamic(() => import('./SpringCards').then(m => m.SpringCards), opts)
export const StickyCards = dynamic(() => import('./StickyCards').then(m => m.StickyCards), opts)
export const ScrollFadeFeatures = dynamic(() => import('./ScrollFadeFeatures').then(m => m.ScrollFadeFeatures), opts)
export const TextParallax = dynamic(() => import('./TextParallax').then(m => m.TextParallax), opts)

// ── Gallery motion variants ──
export const HorizontalScrollGallery = dynamic(() => import('./HorizontalScrollGallery').then(m => m.HorizontalScrollGallery), opts)
export const SwipeCards = dynamic(() => import('./SwipeCards').then(m => m.SwipeCards), opts)

// ── Stats motion variants ──
export const CountUpStats = dynamic(() => import('./CountUpStats').then(m => m.CountUpStats), opts)
export const InteractiveStatGrid = dynamic(() => import('./InteractiveStatGrid').then(m => m.InteractiveStatGrid), opts)

// ── Testimonial motion variants ──
export const StaggerTestimonials = dynamic(() => import('./StaggerTestimonials').then(m => m.StaggerTestimonials), opts)
export const StackedAutoTestimonials = dynamic(() => import('./StackedAutoTestimonials').then(m => m.StackedAutoTestimonials), opts)

// ── Hero / flourish variants ──
export const Typewrite = dynamic(() => import('./Typewrite').then(m => m.Typewrite), opts)
export const SpinningBoxText = dynamic(() => import('./SpinningBoxText').then(m => m.SpinningBoxText), opts)
export const SplitFlapDisplay = dynamic(() => import('./SplitFlapDisplay').then(m => m.SplitFlapDisplay), opts)
export const DotGridHero = dynamic(() => import('./DotGridHero').then(m => m.DotGridHero), opts)

// ── Form flourish ──
export const BeamInput = dynamic(() => import('./BeamInput').then(m => m.BeamInput), opts)
