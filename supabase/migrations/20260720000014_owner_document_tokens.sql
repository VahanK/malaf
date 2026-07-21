-- 014 · access_tokens has RLS enabled with ZERO policies by design (the
-- zero-login door table) — but that also means the OWNER can't read their
-- own documents' tokens via a plain select, which the dashboard needs to
-- build share/download links. Fixes a real bug: quotes/invoices detail pages
-- were querying access_tokens directly and always getting nothing back.

create or replace function public.get_document_tokens(p_document_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  doc record;
  result jsonb;
begin
  select * into doc from documents where id = p_document_id;
  if not found or doc.profile_id != auth.uid() then return null; end if;

  select jsonb_object_agg(scope, token) into result
  from access_tokens
  where subject_id = p_document_id and not revoked;

  return coalesce(result, '{}'::jsonb);
end $$;
revoke all on function public.get_document_tokens(uuid) from public, anon;
grant execute on function public.get_document_tokens(uuid) to authenticated;
