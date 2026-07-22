import { createClient } from '@/lib/supabase/server'
import { EditorShell } from '@/components/dashboard/EditorShell'
import { SectionBuilder } from './SectionBuilder'

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [{ data: blocks }, { data: prof }] = await Promise.all([
    supabase.from('portfolio_blocks').select('id, type, position, data, active, title, variant').eq('profile_id', user!.id).order('position'),
    supabase.from('profiles').select('handle, page_published').eq('id', user!.id).single(),
  ])

  return (
    <EditorShell
      title="Your page"
      subtitle="Build it section by section — it updates in the preview as you go."
      handle={prof?.handle ?? null}
      published={prof?.page_published ?? false}
    >
      <SectionBuilder
        initialBlocks={(blocks ?? []).map(b => ({ ...b, title: b.title ?? '', variant: b.variant ?? '' }))}
        profileId={user!.id}
      />
    </EditorShell>
  )
}
