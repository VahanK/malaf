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
