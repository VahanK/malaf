-- 004 · the public page door (one SECURITY DEFINER read) + storage buckets

-- ---------- get_public_page — the ONLY public read path for pages ----------
-- Public pages are ISR-cached (portability rule 4), so this rarely runs per view.
create or replace function public.get_public_page(p_handle citext)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  prof record;
  result jsonb;
begin
  select * into prof from profiles
   where handle = p_handle and page_published;
  if not found then return null; end if;

  select jsonb_build_object(
    'profile', jsonb_build_object(
      'handle', prof.handle,
      'full_name', prof.full_name,
      'title', prof.title,
      'title_ar', prof.title_ar,
      'bio', prof.bio,
      'avatar_url', prof.avatar_url,
      'voice_intro_url', prof.voice_intro_url,
      'accent_color', prof.accent_color,
      'preset', prof.preset,
      'availability_status', prof.availability_status,
      'availability_note', prof.availability_note,
      'whatsapp_number', prof.whatsapp_number,
      'areas_served', prof.areas_served,
      'page_language', prof.page_language,
      'noindex', prof.noindex,
      'reply_hours', prof.reply_hours
    ),
    'services', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', s.id, 'title', s.title, 'title_ar', s.title_ar,
        'price', s.price, 'currency', s.currency, 'unit', s.unit,
        'starting_from', s.starting_from, 'package_qty', s.package_qty, 'note', s.note
      ) order by s.sort_order)
      from services s where s.profile_id = prof.id and s.active
    ), '[]'::jsonb),
    'blocks', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', b.id, 'type', b.type, 'position', b.position, 'data', b.data
      ) order by b.position)
      from portfolio_blocks b where b.profile_id = prof.id and b.active
    ), '[]'::jsonb)
  ) into result;

  return result;
end $$;
revoke all on function public.get_public_page(citext) from public;
grant execute on function public.get_public_page(citext) to anon, authenticated;

-- ---------- storage buckets ----------
-- Public-read media; uploads owner-scoped by path prefix (= auth.uid()).
-- Ingest pipeline (re-encode, EXIF strip, WebP, caps) lives in the app layer per SECURITY.md B5.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types) values
  ('avatars', 'avatars', true, 5242880, array['image/jpeg','image/png','image/webp']),
  ('portfolio', 'portfolio', true, 10485760, array['image/jpeg','image/png','image/webp']),
  ('voice', 'voice', true, 2097152, array['audio/mpeg','audio/mp4','audio/webm','audio/ogg'])
on conflict (id) do nothing;

create policy "avatars_owner_write" on storage.objects
  for insert with check (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_owner_update" on storage.objects
  for update using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "avatars_owner_delete" on storage.objects
  for delete using (bucket_id = 'avatars' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "portfolio_owner_write" on storage.objects
  for insert with check (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "portfolio_owner_update" on storage.objects
  for update using (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "portfolio_owner_delete" on storage.objects
  for delete using (bucket_id = 'portfolio' and (storage.foldername(name))[1] = auth.uid()::text);

create policy "voice_owner_write" on storage.objects
  for insert with check (bucket_id = 'voice' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "voice_owner_update" on storage.objects
  for update using (bucket_id = 'voice' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "voice_owner_delete" on storage.objects
  for delete using (bucket_id = 'voice' and (storage.foldername(name))[1] = auth.uid()::text);
