// Curated accent palette for the one-tap color swap + shuffle (founder: "make
// color palette swapping easy and randomized"). Shuffle picks from THIS list, so
// every roll is a hand-picked, tasteful color — never an ugly random hex. Each
// is a saturated-but-legible accent that works on both light and dark templates
// (paired with inkOn() for contrast-safe text).
export interface Accent {
  name: string
  hex: string
}

export const ACCENTS: Accent[] = [
  { name: 'Ember', hex: '#e8623d' },      // the WorkWith default warm
  { name: 'Terracotta', hex: '#c65f3f' },
  { name: 'Saffron', hex: '#e0a13c' },
  { name: 'Olive', hex: '#7d8c4e' },
  { name: 'Pine', hex: '#2f6f5e' },
  { name: 'Teal', hex: '#1f9e8f' },
  { name: 'Ocean', hex: '#2f74c0' },
  { name: 'Indigo', hex: '#4b56d2' },
  { name: 'Violet', hex: '#7c4dd6' },
  { name: 'Plum', hex: '#9b4a8f' },
  { name: 'Rose', hex: '#d6577f' },
  { name: 'Crimson', hex: '#c0392b' },
  { name: 'Cedar', hex: '#8a5a3c' },
  { name: 'Slate', hex: '#4a5568' },
  { name: 'Gold', hex: '#c9a45c' },       // the brand gold
  { name: 'Emerald', hex: '#1f8a4c' },
]

// A tasteful random accent — different from the current one so a shuffle always
// visibly changes something. Deterministic-input free (caller supplies the seed
// via Math.random at the call site; kept out of here so it's SSR-safe to import).
export function shuffleAccent(current: string | undefined, rnd: number): Accent {
  const pool = ACCENTS.filter(a => a.hex.toLowerCase() !== (current ?? '').toLowerCase())
  const list = pool.length ? pool : ACCENTS
  return list[Math.floor(rnd * list.length) % list.length]
}

// A FULL palette = a template (background/ink/surface mood) + a matching accent.
// Shuffle rolls one of these so the WHOLE look changes — background included —
// not just the accent color (founder: "I want the whole palette to change").
// Each pairing is hand-picked to look good together.
export interface Palette {
  name: string
  template: string // CardTemplateId
  accent: string
}

export const PALETTES: Palette[] = [
  { name: 'Ink & Ember', template: 'editorial-dark', accent: '#e8623d' },
  { name: 'Paper', template: 'minimal-light', accent: '#c65f3f' },
  { name: 'Sunset', template: 'warm-gradient', accent: '#e0a13c' },
  { name: 'Glass Teal', template: 'glassmorphism', accent: '#1f9e8f' },
  { name: 'Midnight Violet', template: 'midnight', accent: '#7c4dd6' },
  { name: 'Clean Ocean', template: 'clean-gradient', accent: '#2f74c0' },
  { name: 'Brutalist Rose', template: 'brutalist', accent: '#d6577f' },
  { name: 'Bento Pine', template: 'bento', accent: '#2f6f5e' },
  { name: 'Ink & Gold', template: 'editorial-dark', accent: '#c9a45c' },
  { name: 'Paper Indigo', template: 'minimal-light', accent: '#4b56d2' },
  { name: 'Midnight Teal', template: 'midnight', accent: '#1f9e8f' },
  { name: 'Clean Plum', template: 'clean-gradient', accent: '#9b4a8f' },
  { name: 'Brutalist Emerald', template: 'brutalist', accent: '#1f8a4c' },
  { name: 'Glass Ocean', template: 'glassmorphism', accent: '#2f74c0' },
]

// Roll a full palette different from the current (template, accent) pair.
export function shufflePalette(currentTemplate: string | undefined, currentAccent: string | undefined, rnd: number): Palette {
  const pool = PALETTES.filter(p => !(p.template === currentTemplate && p.accent.toLowerCase() === (currentAccent ?? '').toLowerCase()))
  const list = pool.length ? pool : PALETTES
  return list[Math.floor(rnd * list.length) % list.length]
}
