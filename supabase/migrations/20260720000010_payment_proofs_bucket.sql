-- 010 · payment-proofs bucket: PRIVATE (deviation from avatars/portfolio/voice's
-- public-bucket convention, deliberate — proof screenshots often show banking-app
-- UI and are genuinely sensitive per SECURITY.md's "untrusted files" framing).
-- Uploaded server-side only (app/api/pay/[token]/proof/route.ts, service-role
-- client) since the uploader is anonymous and has no auth.uid() to scope a
-- storage policy to. Owner reads go through a signed URL, not a public path.

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('payment-proofs', 'payment-proofs', false, 10485760, array['image/jpeg','image/png','image/webp'])
on conflict (id) do nothing;

-- No storage.objects policies: the service-role client bypasses RLS for the
-- upload, and owner reads happen via createSignedUrl (server-side, verifies
-- auth.uid() = profile_id itself in the route handler) — not a public/anon path.
