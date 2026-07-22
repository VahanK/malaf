import type { PublicPage } from '@/lib/public-page'
import type { CardTemplate } from '@/lib/card-templates'

// Only the plain (serializable) template fields the layouts actually read.
// The `vars` FUNCTION never crosses into the client components — PublicCard
// resolves it to a plain style object first (functions can't be passed to
// Client Components across the RSC boundary).
export type LayoutTemplate = Pick<CardTemplate, 'layout' | 'corner' | 'motion' | 'headingFont'>

export interface LayoutProps {
  page: PublicPage
  accent: string
  tpl: LayoutTemplate
  vars: React.CSSProperties
}
