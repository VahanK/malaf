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

export interface PublicBlock {
  id: string
  type: 'image_grid' | 'before_after' | 'stat_card' | 'video_link' | 'case_card' | 'testimonial'
  position: number
  data: Record<string, unknown>
}

export interface PublicProfile {
  handle: string
  full_name: string
  title: string
  title_ar: string
  bio: string
  avatar_url: string | null
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

