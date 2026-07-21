-- 015 · fixes a real bug: app/api/documents/route.ts was inserting into
-- access_tokens directly from an authenticated client — but that table has
-- RLS enabled with ZERO policies, which blocks INSERT just as much as
-- SELECT. Every quote creation was silently failing to mint its token.
-- Owner-authenticated token minting needs the same SECURITY DEFINER door as
-- every other access_tokens write.

create or replace function public.mint_document_token(p_document_id uuid, p_scope text)
returns text
language plpgsql security definer set search_path = public as $$
declare
  doc record;
  new_token text;
begin
  select * into doc from documents where id = p_document_id;
  if not found or doc.profile_id != auth.uid() then return null; end if;
  if p_scope not in ('quote','invoice','receipt','pay') then return null; end if;

  new_token := replace(replace(replace(encode(gen_random_bytes(16), 'base64'), '/', '_'), '+', '-'), '=', '');
  insert into access_tokens (profile_id, token, scope, subject_id)
  values (doc.profile_id, new_token, p_scope, p_document_id);

  return new_token;
end $$;
revoke all on function public.mint_document_token(uuid, text) from public, anon;
grant execute on function public.mint_document_token(uuid, text) to authenticated;
