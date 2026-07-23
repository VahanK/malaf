import { createClient } from '@/lib/supabase/server'
export { formatPrice, unitLabel } from '@/lib/pricing-format'

export interface PublicService {
  id: string
  title: string
  title_ar: string
  price: number | null
  currency: 'USD' | 'LBP'
  unit: 'project' | 'session' | 'hour' | 'event' | 'day' | 'month'
  starting_from: boolean
  package_qty: number | null
  note: string
}

export type BlockType =
  | 'image_grid' | 'before_after' | 'stat_card' | 'video_link' | 'case_card' | 'testimonial'
  | 'narrative' | 'showcase' | 'gallery'

export interface PublicBlock {
  id: string
  type: BlockType
  position: number
  data: Record<string, unknown>
  // Composable envelope (Phase 1) — per-section heading/kicker + layout variant.
  title: string
  title_ar: string
  intro: string
  intro_ar: string
  variant: string
  // Optional explicit band tone. When unset, the layout's stateful cadence
  // decides. Not yet a DB column — reads as undefined until one is added, so no
  // RPC change is required for the foundation.
  tone?: 'base' | 'soft' | 'dark'
}

export interface PublicProfile {
  handle: string
  full_name: string
  title: string
  title_ar: string
  bio: string
  avatar_url: string | null
  hero_image_url: string | null
  voice_intro_url: string | null
  accent_color: string | null
  preset: string | null
  card_template: string
  availability_status: 'available' | 'busy' | 'away'
  availability_note: string
  whatsapp_number: string | null
  areas_served: string[]
  page_language: 'en' | 'ar'
  noindex: boolean
  reply_hours: number | null
  // Composable bones + feature flag (Phase 1).
  hero_variant: string
  contact_variant: string
  composable: boolean
}

export interface PublicPage {
  profile: PublicProfile
  services: PublicService[]
  blocks: PublicBlock[]
}

// The only public read path: the SECURITY DEFINER door (docs/SECURITY.md A1).
// Pages are ISR-cached, so this rarely runs per view (portability rule 4).
export async function getPublicPage(handle: string): Promise<PublicPage | null> {
  const supabase = await createClient()
  const { data, error } = await supabase.rpc('get_public_page', { p_handle: handle })
  if (error || !data) return null
  return data as unknown as PublicPage
}

// Owner draft preview: assembles the SAME PublicPage shape from the signed-in
// owner's OWN rows, via plain RLS (which already restricts every table to
// auth.uid()) — NOT the public SECURITY DEFINER door. This deliberately
// ignores page_published so the builder's live preview shows drafts. Only
// ever renders the caller's own page; returns null if unauthenticated or no
// profile. Never used for the public /{handle} route.
export async function getOwnPagePreview(): Promise<PublicPage | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: prof } = await supabase
    .from('profiles')
    .select('handle, full_name, title, title_ar, bio, avatar_url, hero_image_url, voice_intro_url, accent_color, preset, card_template, availability_status, availability_note, whatsapp_number, areas_served, page_language, noindex, reply_hours, hero_variant, contact_variant, composable')
    .eq('id', user.id)
    .single()
  if (!prof) return null

  const [{ data: services }, { data: blocks }] = await Promise.all([
    supabase.from('services').select('id, title, title_ar, price, currency, unit, starting_from, package_qty, note').eq('profile_id', user.id).eq('active', true).order('sort_order'),
    supabase.from('portfolio_blocks').select('id, type, position, data, title, title_ar, intro, intro_ar, variant').eq('profile_id', user.id).eq('active', true).order('position'),
  ])

  return {
    profile: prof as unknown as PublicProfile,
    services: (services ?? []) as unknown as PublicService[],
    blocks: (blocks ?? []) as unknown as PublicBlock[],
  }
}

