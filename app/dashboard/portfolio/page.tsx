import { createClient } from '@/lib/supabase/server'
import { PortfolioEditor } from './PortfolioEditor'

export default async function PortfolioPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { data: blocks } = await supabase
    .from('portfolio_blocks')
    .select('*')
    .eq('profile_id', user!.id)
    .order('position')

  return (
    <div>
      <h1 className="text-xl font-semibold">Portfolio</h1>
      <p className="mt-1 text-sm text-dash-muted">
        The proof behind your prices — shown on your public page.
      </p>
      <PortfolioEditor initialBlocks={blocks ?? []} profileId={user!.id} />
    </div>
  )
}
