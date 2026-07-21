import type { SupabaseClient } from '@supabase/supabase-js'

// The ONE media URL helper (CLAUDE.md portability rule 3).
// Swapping storage hosts (e.g. Supabase → R2) must stay a one-line change here.
const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http') || path.startsWith('/')) return path // absolute or local /public asset
  return `${STORAGE_BASE}/${path}`
}

// payment-proofs is the one PRIVATE bucket (plan §2) — proof screenshots are
// sensitive, so the owner reads them via a short-lived signed URL instead of
// a public path. Caller (a route/server component) must already have
// verified the requester owns the document before calling this.
export async function signedProofUrl(
  supabase: SupabaseClient,
  path: string | null | undefined,
  expiresInSeconds = 300
): Promise<string | null> {
  if (!path) return null
  const { data, error } = await supabase.storage.from('payment-proofs').createSignedUrl(path, expiresInSeconds)
  if (error || !data) return null
  return data.signedUrl
}
