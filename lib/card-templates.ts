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

export type CardTemplateId =
  | 'editorial-dark' | 'minimal-light' | 'warm-gradient'
  | 'glassmorphism' | 'midnight' | 'clean-gradient'
  | 'brutalist' | 'bento'

/** Normalize any stored accent to a safe 6-digit hex. accent_color is a free
 *  string; 3-digit/8-digit/rgb()/named values would make every `${accent}NN`
 *  alpha-suffix invalid and silently drop gradients. Callers that compose alpha
 *  hex MUST use this, not the raw accent. */
export function normalizeAccent(hex: string, fallback = '#6366f1'): string {
  return /^#[0-9a-fA-F]{6}$/.test(hex) ? hex : fallback
}

/** Choose legible ink (near-black vs white) for text placed ON a solid accent
 *  fill (CTA buttons). Luminance-based so pale accents get dark ink. */
export function inkOn(hex: string): string {
  const h = normalizeAccent(hex).replace('#', '')
  const r = parseInt(h.slice(0, 2), 16)
  const g = parseInt(h.slice(2, 4), 16)
  const b = parseInt(h.slice(4, 6), 16)
  const L = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255
  return L > 0.6 ? '#0d1220' : '#ffffff'
}

export interface CardTemplate {
  id: CardTemplateId
  label: string
  description: string
  /** The visual "world" — consumed by sections (as the World type) to pick
   *  per-world type. 1:1 with `id`. */
  world: CardTemplateId
  /** Preview swatch shown in the template picker. */
  swatch: { bg: string; surface: string; ink: string; accentFallback: string }
  /** CSS custom properties applied at the card root — every component reads these, never raw hex. */
  vars: (accent: string) => Record<string, string>
  /** Which website structure renders this template — each is a distinct
   *  page layout (hero shape, section rhythm, gallery grammar), not one
   *  shared column reskinned. See components/card/layouts/*. */
  layout: 'editorial' | 'minimal' | 'gradient' | 'glass'
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
  world: 'editorial-dark',
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
    '--card-accent-2': `color-mix(in oklch, ${normalizeAccent(accent)} 42%, white)`,
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
  world: 'minimal-light',
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
    '--card-accent-2': `color-mix(in oklch, ${normalizeAccent(accent)} 42%, white)`,
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
  world: 'warm-gradient',
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
    '--card-accent-2': `color-mix(in oklch, ${normalizeAccent(accent)} 42%, white)`,
    '--card-accent-ink': '#ffffff',
    '--card-radius-lg': '1.5rem',
    '--card-radius-md': '1rem',
    '--card-radius-full': '9999px',
    '--card-heading-weight': '800',
    '--card-heading-tracking': '-0.02em',
    '--card-shadow': '0 12px 40px rgba(226,112,58,.14)',
  }),
}

const GLASSMORPHISM: CardTemplate = {
  id: 'glassmorphism',
  world: 'glassmorphism',
  label: 'Frosted Glass',
  description: 'Frosted, floating panels over a soft wash of your color — modern and premium. Best for designers, agencies, tech, and photographers who want an Apple-clean feel.',
  swatch: { bg: '#eef1f8', surface: '#dfe4f2', ink: '#1a1c25', accentFallback: '#6366f1' },
  layout: 'glass',
  container: 'wide',
  headingFont: 'sans',
  corner: 'soft',
  motion: 'full',
  wash: true,
  vars: accent => ({
    '--card-bg': '#eef1f8',
    '--card-surface': 'rgba(255,255,255,0.55)',
    '--card-surface-soft': 'rgba(255,255,255,0.35)',
    '--card-ink': '#1a1c25',
    '--card-muted': '#565a6b',
    '--card-muted-2': '#7f8496',
    '--card-border': 'rgba(255,255,255,0.60)',
    '--card-border-soft': 'rgba(255,255,255,0.35)',
    '--card-accent': accent,
    '--card-accent-2': `color-mix(in oklch, ${normalizeAccent(accent)} 42%, white)`,
    '--card-accent-ink': inkOn(accent),
    '--card-radius-lg': '1.5rem',
    '--card-radius-md': '1rem',
    '--card-radius-full': '9999px',
    '--card-heading-weight': '800',
    '--card-heading-tracking': '-0.02em',
    '--card-shadow': '0 16px 50px rgba(31,38,79,0.16)',
  }),
}

const MIDNIGHT: CardTemplate = {
  id: 'midnight',
  world: 'midnight',
  label: 'Midnight',
  description: 'Deep indigo, aurora-lit, premium — a night-mode card that feels like a product. Best for developers, designers, agencies, and anyone selling modern or technical work.',
  swatch: { bg: '#0b1020', surface: '#141a2e', ink: '#eef1fb', accentFallback: '#6d8bff' },
  layout: 'editorial',
  container: 'phone',
  headingFont: 'sans',
  corner: 'soft',
  motion: 'full',
  wash: true,
  vars: accent => ({
    '--card-bg': '#0b1020',
    '--card-surface': '#141a2e',
    '--card-surface-soft': '#0f1526',
    '--card-ink': '#eef1fb',
    '--card-muted': '#9aa3c4',
    '--card-muted-2': '#6b7398',
    '--card-border': '#242c47',
    '--card-border-soft': '#1b2238',
    '--card-accent': accent,
    '--card-accent-2': `color-mix(in oklch, ${normalizeAccent(accent)} 42%, white)`,
    '--card-accent-ink': '#f5f7ff',
    '--card-radius-lg': '1rem',
    '--card-radius-md': '0.75rem',
    '--card-radius-full': '9999px',
    '--card-heading-weight': '800',
    '--card-heading-tracking': '-0.025em',
    '--card-shadow': 'inset 0 1px 0 rgba(255,255,255,.06), 0 24px 70px rgba(3,6,20,.65)',
  }),
}

const CLEAN_GRADIENT: CardTemplate = {
  id: 'clean-gradient',
  world: 'clean-gradient',
  label: 'Clean Gradient',
  description: 'Crisp and modern — a vibrant color gradient behind a bright, white card layout. Best for tech, digital, and creative freelancers who want a contemporary, polished feel.',
  swatch: { bg: '#f4f7fb', surface: '#ffffff', ink: '#0d1220', accentFallback: '#4f46e5' },
  layout: 'gradient',
  container: 'wide',
  headingFont: 'sans',
  corner: 'soft',
  motion: 'full',
  wash: true,
  vars: accent => ({
    '--card-bg': '#f4f7fb',
    '--card-surface': '#ffffff',
    '--card-surface-soft': '#eef2f9',
    '--card-ink': '#0d1220',
    '--card-muted': '#5a6478',
    '--card-muted-2': '#8b95a8',
    '--card-border': '#e2e8f2',
    '--card-border-soft': '#eef2f8',
    '--card-accent': accent,
    '--card-accent-2': `color-mix(in oklch, ${normalizeAccent(accent)} 42%, white)`,
    '--card-accent-ink': inkOn(accent),
    '--card-radius-lg': '1.25rem',
    '--card-radius-md': '0.75rem',
    '--card-radius-full': '9999px',
    '--card-heading-weight': '800',
    '--card-heading-tracking': '-0.025em',
    '--card-shadow': '0 10px 30px -8px rgba(13,18,32,.12), 0 4px 12px -6px rgba(13,18,32,.08)',
  }),
}

const BRUTALIST: CardTemplate = {
  id: 'brutalist',
  world: 'brutalist',
  label: 'Brutalist',
  description: 'Loud, oversized black type on stark white with scrolling marquees — a page that reads as design itself. Best for developers, studios, and anyone who wants to look bold and modern with zero photos.',
  swatch: { bg: '#ffffff', surface: '#f2f2f0', ink: '#0a0a0a', accentFallback: '#5b3df5' },
  layout: 'editorial',
  container: 'wide',
  headingFont: 'sans',
  corner: 'sharp',
  motion: 'full',
  wash: false,
  vars: accent => ({
    '--card-bg': '#ffffff',
    '--card-surface': '#f4f4f2',
    '--card-surface-soft': '#eaeae7',
    '--card-ink': '#0a0a0a',
    '--card-muted': '#4a4a48',
    '--card-muted-2': '#7a7a76',
    '--card-border': '#0a0a0a',
    '--card-border-soft': '#d8d8d4',
    '--card-accent': accent,
    '--card-accent-2': `color-mix(in oklch, ${normalizeAccent(accent)} 42%, white)`,
    '--card-accent-ink': inkOn(accent),
    '--card-radius-lg': '0rem',
    '--card-radius-md': '0rem',
    '--card-radius-full': '9999px',
    '--card-heading-weight': '900',
    '--card-heading-tracking': '-0.04em',
    '--card-shadow': '6px 6px 0 #0a0a0a',
  }),
}

const BENTO: CardTemplate = {
  id: 'bento',
  world: 'bento',
  label: 'Soft Bento',
  description: 'Rounded panels in a playful bento grid over a warm neutral — friendly, organized, product-like. Best for developers and makers who have no photo wall but plenty of skills, links, and highlights to arrange.',
  swatch: { bg: '#f6f5f1', surface: '#ffffff', ink: '#1b1a17', accentFallback: '#e8623d' },
  layout: 'minimal',
  container: 'wide',
  headingFont: 'display',
  corner: 'soft',
  motion: 'subtle',
  wash: false,
  vars: accent => ({
    '--card-bg': '#f6f5f1',
    '--card-surface': '#ffffff',
    '--card-surface-soft': '#efede7',
    '--card-ink': '#1b1a17',
    '--card-muted': '#6b6760',
    '--card-muted-2': '#938f86',
    '--card-border': '#e6e2d8',
    '--card-border-soft': '#ece8dd',
    '--card-accent': accent,
    '--card-accent-2': `color-mix(in oklch, ${normalizeAccent(accent)} 42%, white)`,
    '--card-accent-ink': inkOn(accent),
    '--card-radius-lg': '1.5rem',
    '--card-radius-md': '1rem',
    '--card-radius-full': '9999px',
    '--card-heading-weight': '700',
    '--card-heading-tracking': '-0.01em',
    '--card-shadow': '0 8px 30px rgba(27,26,23,.08)',
  }),
}

export const CARD_TEMPLATES: Record<CardTemplateId, CardTemplate> = {
  'editorial-dark': EDITORIAL_DARK,
  'minimal-light': MINIMAL_LIGHT,
  'warm-gradient': WARM_GRADIENT,
  'glassmorphism': GLASSMORPHISM,
  'midnight': MIDNIGHT,
  'clean-gradient': CLEAN_GRADIENT,
  'brutalist': BRUTALIST,
  'bento': BENTO,
}

export function getCardTemplate(id: string | null | undefined): CardTemplate {
  return CARD_TEMPLATES[(id as CardTemplateId) ?? 'editorial-dark'] ?? EDITORIAL_DARK
}
