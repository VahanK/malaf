// The ONE media URL helper (CLAUDE.md portability rule 3).
// Swapping storage hosts (e.g. Supabase → R2) must stay a one-line change here.
const STORAGE_BASE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public`

export function mediaUrl(path: string | null | undefined): string | null {
  if (!path) return null
  if (path.startsWith('http') || path.startsWith('/')) return path // absolute or local /public asset
  return `${STORAGE_BASE}/${path}`
}
