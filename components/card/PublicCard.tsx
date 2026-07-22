import { type PublicPage } from '@/lib/public-page'
import { getCardTemplate } from '@/lib/card-templates'
import { EditorialLayout } from './layouts/EditorialLayout'
import { MinimalLayout } from './layouts/MinimalLayout'
import { GradientLayout } from './layouts/GradientLayout'
import type { LayoutProps } from './layouts/types'

// Thin router: resolve the template + its CSS-variable tokens once, then hand
// the shared PublicPage data to whichever website-grade LAYOUT the freelancer
// picked. Each layout is a genuinely different page structure (hero shape,
// section rhythm, gallery grammar) — not one column reskinned.
export function PublicCard({ page }: { page: PublicPage }) {
  const accent = page.profile.accent_color ?? '#c9a45c'
  const tpl = getCardTemplate(page.profile.card_template)
  const vars = tpl.vars(accent) as React.CSSProperties

  // Pass only the plain template fields — never the whole object, whose
  // vars() function can't cross the server→client boundary.
  const props: LayoutProps = {
    page,
    accent,
    vars,
    tpl: { layout: tpl.layout, corner: tpl.corner, motion: tpl.motion, headingFont: tpl.headingFont },
  }

  switch (tpl.layout) {
    case 'minimal': return <MinimalLayout {...props} />
    case 'gradient': return <GradientLayout {...props} />
    case 'editorial':
    default: return <EditorialLayout {...props} />
  }
}
