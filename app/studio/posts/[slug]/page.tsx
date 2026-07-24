import { notFound } from 'next/navigation'
import { getPoster, POSTERS, FORMATS } from '@/components/posts/posters'

// Isolated render surface for ONE poster at exactly SIZE×SIZE. This is the URL
// the PNG screenshotter (app/api/poster/[slug]) navigates to, and it's also
// directly viewable/printable. No app chrome, no scrollbars — just the poster
// pinned top-left inside a `#poster` box the screenshotter clips to.
export const dynamic = 'force-static'
export const metadata = { robots: { index: false, follow: false } }

export function generateStaticParams() {
  return POSTERS.map(p => ({ slug: p.slug }))
}

export default async function PosterRenderPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const poster = getPoster(slug)
  if (!poster) notFound()
  const { Component } = poster
  const dim = FORMATS[poster.format]
  return (
    <main
      style={{
        margin: 0,
        background: '#1a1a1a',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'flex-start',
        minHeight: '100vh',
      }}
    >
      <div id="poster" style={{ width: dim.w, height: dim.h }}>
        <Component />
      </div>
    </main>
  )
}
