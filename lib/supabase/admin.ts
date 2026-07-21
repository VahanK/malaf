import { createClient as createSupabaseClient } from '@supabase/supabase-js'

// Service-role client — SERVER ONLY, bypasses RLS. Never import this from a
// 'use client' component or anything that ends up in the browser bundle
// (docs/SECURITY.md B6). Used only where the actor is genuinely anonymous
// and has no auth.uid() to scope an RLS policy to (e.g. the anonymous
// payment-proof upload) — everything else should go through the normal
// server/browser clients or a SECURITY DEFINER function instead.
export function createAdminClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } }
  )
}
