import { createClient } from '@/lib/supabase/server'
import { EditorShell } from '@/components/dashboard/EditorShell'
import { PortfolioEditor } from './PortfolioEditor'

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const [{ data: blocks }, { data: prof }] = await Promise.all([
    supabase.from('portfolio_blocks').select('*').eq('profile_id', user!.id).order('position'),
    supabase.from('profiles').select('handle, page_published').eq('id', user!.id).single(),
  ])

  return (
    <EditorShell
      title="Portfolio"
      subtitle="The proof behind your prices — shown on your public page."
      handle={prof?.handle ?? null}
      published={prof?.page_published ?? false}
    >
      <PortfolioEditor initialBlocks={blocks ?? []} profileId={user!.id} />
    </EditorShell>
  )
}
