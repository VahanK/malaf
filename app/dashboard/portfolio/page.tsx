import { createClient } from '@/lib/supabase/server'
import { getOwnPagePreview } from '@/lib/public-page'
import { InlineEditor } from './InlineEditor'

// The builder IS the page. We load the freelancer's real page (owner preview,
// which bypasses the publish gate so drafts render) and hand it to the inline
// editor — click text to edit, hover a section to swap its layout. No form.
export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const page = await getOwnPagePreview()

  if (!page) {
    return (
      <div className="rounded-2xl border border-dash-border bg-dash-surface p-6 text-sm text-dash-muted">
        Finish onboarding to start building your page.
      </div>
    )
  }

  return (
    <div>
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">Your page</h1>
          <p className="mt-1 text-sm text-dash-muted">
            Click any text to edit it. Hover a section for the swap-layout, move, and remove controls.
          </p>
        </div>
        {page.profile.handle && (
          <a href={`/${page.profile.handle}`} target="_blank" rel="noopener noreferrer" className="shrink-0 rounded-lg border border-dash-border px-3 py-1.5 text-xs font-semibold text-dash-accent">
            View live ↗
          </a>
        )}
      </div>
      <InlineEditor page={page} profileId={user!.id} />
    </div>
  )
}
