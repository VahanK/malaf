-- 012 · set_document_number is a trigger fn only, never a public RPC door
-- (same class of oversight as handle_new_user in migration 007).
revoke execute on function public.set_document_number() from public, anon, authenticated;
