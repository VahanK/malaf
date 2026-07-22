// Card template registry. A template is a LOOK — surface, type pairing,
// shape language, container behavior — decoupled from `preset` (trade),
// which only drives starter content. Any freelancer can pick any template
// regardless of trade (founder feedback, Jul 21: one dark card forced on
// every trade read as generic; the fix is a real system, not a new color).
//
// Each template exports CSS custom properties (consumed via var(--card-*)
// in components, never hardcoded hex) plus a few structural flags that
// can't be pure CSS: container strategy, corner radius scale, whether
// headings use a display serif or the body sans.

export type CardTemplateId = 'editorial-dark' | 'minimal-light' | 'warm-gradient'

export interface CardTemplate {
  id: CardTemplateId
  label: string
  description: string
  /** Preview swatch shown in the template picker. */
  swatch: { bg: string; surface: string; ink: string; accentFallback: string }
  /** CSS custom properties applied at the card root — every component reads these, never raw hex. */
  vars: (accent: string) => Record<string, string>
  /** Which website structure renders this template — each is a distinct
   *  page layout (hero shape, section rhythm, gallery grammar), not one
   *  shared column reskinned. See components/card/layouts/*. */
  layout: 'editorial' | 'minimal' | 'gradient'
  /** Structural choices CSS variables can't express. */
  container: 'phone' | 'wide'
  headingFont: 'display' | 'sans'
  corner: 'soft' | 'sharp'
  motion: 'full' | 'subtle'
  /** Ambient radial accent wash behind the page — off for flat/neutral templates. */
  wash: boolean
}

const EDITORIAL_DARK: CardTemplate = {
  id: 'editorial-dark',
  label: 'Editorial Dark',
  description: 'Moody, gallery-like — the original WorkWith card. Best for visual portfolios: photo, film, design.',
  swatch: { bg: '#0e0f13', surface: '#16181f', ink: '#f4f2ec', accentFallback: '#c9a45c' },
  layout: 'editorial',
  container: 'phone',
  headingFont: 'sans',
  corner: 'soft',
  motion: 'full',
  wash: true,
  vars: accent => ({
    '--card-bg': '#0e0f13',
    '--card-surface': '#16181f',
    '--card-surface-soft': '#12141a',
    '--card-ink': '#f4f2ec',
    '--card-muted': '#9aa0ae',
    '--card-muted-2': '#6b7284',
    '--card-border': '#262a35',
    '--card-border-soft': '#20242e',
    '--card-accent': accent,
    '--card-accent-ink': '#141414',
    '--card-radius-lg': '1.25rem',
    '--card-radius-md': '0.875rem',
    '--card-radius-full': '9999px',
    '--card-heading-weight': '900',
    '--card-heading-tracking': '-0.02em',
    '--card-shadow': '0 20px 60px rgba(0,0,0,.5)',
  }),
}

const MINIMAL_LIGHT: CardTemplate = {
  id: 'minimal-light',
  label: 'Minimal Light',
  description: 'Bright, quiet, confident — sharp corners and a serif name. Best for tutors, consultants, trainers.',
  swatch: { bg: '#faf9f6', surface: '#ffffff', ink: '#17171a', accentFallback: '#c9622e' },
  layout: 'minimal',
  container: 'wide',
  headingFont: 'display',
  corner: 'sharp',
  motion: 'subtle',
  wash: false,
  vars: accent => ({
    '--card-bg': '#faf9f6',
    '--card-surface': '#ffffff',
    '--card-surface-soft': '#f4f2ec',
    '--card-ink': '#17171a',
    '--card-muted': '#68655d',
    '--card-muted-2': '#8c8880',
    '--card-border': '#e6e2d8',
    '--card-border-soft': '#ece8dd',
    '--card-accent': accent,
    '--card-accent-ink': '#ffffff',
    '--card-radius-lg': '0.25rem',
    '--card-radius-md': '0.125rem',
    '--card-radius-full': '9999px',
    '--card-heading-weight': '600',
    '--card-heading-tracking': '-0.01em',
    '--card-shadow': '0 1px 2px rgba(23,23,26,.06)',
  }),
}

const WARM_GRADIENT: CardTemplate = {
  id: 'warm-gradient',
  label: 'Warm Gradient',
  description: 'Bright, soft, confident — a warm wash behind everything and rounded cards. Best for consultants, coaches, tutors, event planners.',
  swatch: { bg: '#fff7ef', surface: '#ffffff', ink: '#231b12', accentFallback: '#e2703a' },
  layout: 'gradient',
  container: 'wide',
  headingFont: 'sans',
  corner: 'soft',
  motion: 'subtle',
  wash: true,
  vars: accent => ({
    '--card-bg': '#fff7ef',
    '--card-surface': '#ffffff',
    '--card-surface-soft': '#fdf1e4',
    '--card-ink': '#231b12',
    '--card-muted': '#7a6d5c',
    '--card-muted-2': '#9c9080',
    '--card-border': '#f0e0cc',
    '--card-border-soft': '#f6e9d8',
    '--card-accent': accent,
    '--card-accent-ink': '#ffffff',
    '--card-radius-lg': '1.5rem',
    '--card-radius-md': '1rem',
    '--card-radius-full': '9999px',
    '--card-heading-weight': '800',
    '--card-heading-tracking': '-0.02em',
    '--card-shadow': '0 12px 40px rgba(226,112,58,.14)',
  }),
}

export const CARD_TEMPLATES: Record<CardTemplateId, CardTemplate> = {
  'editorial-dark': EDITORIAL_DARK,
  'minimal-light': MINIMAL_LIGHT,
  'warm-gradient': WARM_GRADIENT,
}

export function getCardTemplate(id: string | null | undefined): CardTemplate {
  return CARD_TEMPLATES[(id as CardTemplateId) ?? 'editorial-dark'] ?? EDITORIAL_DARK
}
