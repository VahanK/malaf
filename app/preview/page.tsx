import { redirect } from 'next/navigation'
import { getOwnPagePreview } from '@/lib/public-page'
import { PublicCard } from '@/components/card/PublicCard'

// Owner-only draft preview of the freelancer's OWN page, rendered exactly as
// the public /{handle} route would but WITHOUT the publish gate — this is what
// the builder's live-preview iframe points at. Dynamic (never cached) and
// noindex; unauthenticated visitors are bounced to sign-in.
export const dynamic = 'force-dynamic'

export const metadata = { robots: { index: false, follow: false } }

export default async function PreviewPage() {
  const page = await getOwnPagePreview()
  if (!page) redirect('/auth/signin')
  return <PublicCard page={page} />
}
