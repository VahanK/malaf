// Registry of composable section types + their layout variants + editor hints.
// Single source of truth shared by the editor (what to offer) and drives the
// friendly labels. The renderer (components/card/sections/*) reads the same
// type/variant strings.

export interface SectionVariant {
  id: string
  label: string
  hint: string
}

export interface SectionDef {
  type: string
  label: string        // friendly name in the "add section" menu
  icon: string         // emoji glyph for the editor
  blurb: string        // one-line "what is this section"
  variants: SectionVariant[]
  /** Which trades this section is most useful for (editor can suggest). */
  bestFor?: string[]
}

// The Phase-1 section library. Legacy per-item blocks (stat_card, testimonial,
// before_after) are edited as before but grouped at render; the NEW composed
// sections (narrative, showcase, gallery) carry a title + variant.
export const SECTIONS: SectionDef[] = [
  {
    type: 'narrative',
    label: 'About / Statement',
    icon: '✍️',
    blurb: 'A bold statement about you — the thing that makes people trust you.',
    bestFor: ['developer', 'lawyer', 'consultant', 'coach', 'writer'],
    variants: [
      { id: 'split-statement', label: 'Side statement', hint: 'Small note on the left, big statement on the right.' },
      { id: 'stacked-lead', label: 'Bold band', hint: 'A huge statement on a dark full-width band.' },
    ],
  },
  {
    type: 'showcase',
    label: 'Work / Projects',
    icon: '💼',
    blurb: 'Your work as described cases — great even with no images (dev, consultant).',
    bestFor: ['developer', 'consultant', 'architect', 'marketer'],
    variants: [
      { id: 'case-stack', label: 'Case stack', hint: 'Big stacked rows, one per project.' },
      { id: 'card-grid', label: 'Card grid', hint: 'A grid of project cards.' },
      { id: 'numbered-list', label: 'Numbered list', hint: 'Big numbered rows — great for devs & lawyers, no images.' },
      { id: 'bento', label: 'Bento grid', hint: 'A playful mosaic of varied tiles — the no-photos answer.' },
      { id: 'logo-strip', label: 'Logo strip', hint: 'A row of client / brand logos.' },
    ],
  },
  {
    type: 'gallery',
    label: 'Photo gallery',
    icon: '🖼️',
    blurb: 'A wall of your images — for visual work.',
    bestFor: ['photographer', 'designer', 'makeup_artist', 'videographer'],
    variants: [
      { id: 'masonry', label: 'Masonry', hint: 'Edge-to-edge, varied heights.' },
      { id: 'grid-3', label: 'Even grid', hint: 'A clean 3-column grid.' },
      { id: 'offset-rows', label: 'Offset rows', hint: 'Numbered, offset editorial rows.' },
      { id: 'filmstrip', label: 'Filmstrip', hint: 'A full-width horizontal scroll of big frames.' },
    ],
  },
  {
    type: 'stat_card',
    label: 'A number',
    icon: '📊',
    blurb: 'A number that proves results (e.g. 500+ students). Add a few in a row.',
    variants: [],
  },
  {
    type: 'testimonial',
    label: 'Testimonial',
    icon: '💬',
    blurb: 'Something a happy client said.',
    variants: [],
  },
  {
    type: 'before_after',
    label: 'Before / after',
    icon: '🔀',
    blurb: 'A transformation, side by side.',
    bestFor: ['makeup_artist', 'trainer', 'designer'],
    variants: [],
  },
]

export function sectionDef(type: string): SectionDef | undefined {
  return SECTIONS.find(s => s.type === type)
}

// The fixed bones (hero, contact/footer) are also SWAPPABLE — the founder wants
// a change-layout control on every component, hero and footer included. These
// live on the profile (hero_variant / contact_variant), not portfolio_blocks,
// so the editor handles them separately, but they share the variant shape.
export const HERO_VARIANTS: SectionVariant[] = [
  { id: 'statement', label: 'Big name', hint: 'Huge name + statement on a color wash — no photo needed.' },
  { id: 'photo-bleed', label: 'Photo', hint: 'A full-bleed hero photo with your name over it.' },
  { id: 'cinematic', label: 'Cinematic', hint: 'Photo hero + a strip of your featured work.' },
  { id: 'split-portrait', label: 'Split', hint: 'Your words on one side, your portrait on the other.' },
]
export const CONTACT_VARIANTS: SectionVariant[] = [
  { id: 'cta-band', label: 'Centered', hint: 'A centered "let\'s work together" closer.' },
  { id: 'big-type', label: 'Big type', hint: 'Your name huge as the closing statement.' },
  { id: 'columns', label: 'Footer columns', hint: 'A real footer — links, socials, contact columns.' },
]

// ---- trade → composable starter page ----
// A new user should land on a GOOD, trade-appropriate composed page — not a
// blank builder. Each trade gets a hero style + an ordered set of starter
// sections (with sensible default variants), seeded ACTIVE so their page reads
// as a real website immediately; they just fill in the text.
export interface StarterSection {
  type: string
  variant: string
  title: string
}
export interface TradeStarter {
  hero: 'photo-bleed' | 'statement'
  sections: StarterSection[]
}

// Visual trades → photo hero + gallery. Text/credibility trades → statement
// hero + narrative + showcase (works with zero images).
const VISUAL = new Set(['photographer', 'designer', 'makeup_artist', 'videographer', 'event_planner', 'architect'])

const STARTERS: Record<string, TradeStarter> = {
  developer: {
    hero: 'statement',
    sections: [
      { type: 'narrative', variant: 'stacked-lead', title: 'About' },
      { type: 'showcase', variant: 'case-stack', title: 'Selected Work' },
      { type: 'stat_card', variant: '', title: '' },
      { type: 'testimonial', variant: '', title: 'Kind Words' },
    ],
  },
  lawyer: {
    hero: 'statement',
    sections: [
      { type: 'narrative', variant: 'split-statement', title: 'About' },
      { type: 'showcase', variant: 'case-stack', title: 'Areas of Practice' },
      { type: 'stat_card', variant: '', title: '' },
      { type: 'testimonial', variant: '', title: 'Client Words' },
    ],
  },
  writer: {
    hero: 'statement',
    sections: [
      { type: 'narrative', variant: 'stacked-lead', title: 'About' },
      { type: 'showcase', variant: 'card-grid', title: 'Selected Writing' },
      { type: 'testimonial', variant: '', title: 'Kind Words' },
    ],
  },
  consultant: {
    hero: 'statement',
    sections: [
      { type: 'narrative', variant: 'split-statement', title: 'About' },
      { type: 'stat_card', variant: '', title: '' },
      { type: 'showcase', variant: 'case-stack', title: 'How I Help' },
      { type: 'testimonial', variant: '', title: 'Client Words' },
    ],
  },
}

/** The starter page for a trade. Falls back to a good generic composed page. */
export function starterFor(preset: string): TradeStarter {
  if (STARTERS[preset]) return STARTERS[preset]
  if (VISUAL.has(preset)) {
    return {
      hero: 'photo-bleed',
      sections: [
        { type: 'narrative', variant: 'split-statement', title: 'About' },
        { type: 'gallery', variant: 'masonry', title: 'Selected Work' },
        { type: 'stat_card', variant: '', title: '' },
        { type: 'testimonial', variant: '', title: 'Kind Words' },
      ],
    }
  }
  // generic (coach, trainer, tutor, marketer, translator, event_planner…)
  return {
    hero: 'statement',
    sections: [
      { type: 'narrative', variant: 'split-statement', title: 'About' },
      { type: 'stat_card', variant: '', title: '' },
      { type: 'testimonial', variant: '', title: 'Kind Words' },
    ],
  }
}
