import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPublicPage } from '@/lib/public-page'
import { PublicCard } from '@/components/card/PublicCard'

// ISR: public pages are CDN-cached and rarely touch the DB (CLAUDE.md portability rule 4)
export const revalidate = 300

interface Props {
  params: Promise<{ handle: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const page = await getPublicPage(handle)
  if (!page) return { title: 'Malaf ملف' }
  const p = page.profile
  return {
    title: `${p.full_name} — ${p.title} · Malaf`,
    description: p.bio || `${p.full_name} on Malaf — see the work, get a quote.`,
    robots: p.noindex ? { index: false, follow: false } : undefined,
  }
}

export default async function HandlePage({ params }: Props) {
  const { handle } = await params
  const page = await getPublicPage(handle)
  if (!page) notFound()
  return <PublicCard page={page} />
}
