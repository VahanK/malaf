-- 036 · Posts / updates — the freelancer's own traction engine (founder: "there
-- are posts we let the user post to get traction from their side; no need to
-- market ourselves, only link"). A freelancer posts an update (text + optional
-- image, or an availability/offer), shares its link on their socials → traffic
-- flows to their WorkWith page, and the viral footer does the rest. Under
-- farm-dots, every shared post is a new dot for free.

create table if not exists public.posts (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  kind        text not null default 'update' check (kind in ('update', 'offer')),
  body        text not null,
  image_url   text,
  -- offer posts can carry a short label ("3 slots left", "-20% for Eid")
  offer_label text,
  published   boolean not null default true,
  created_at  timestamptz not null default now()
);

create index if not exists posts_profile_created_idx on public.posts (profile_id, created_at desc);

alter table public.posts enable row level security;

-- Owner can do everything with their own posts.
drop policy if exists posts_owner_all on public.posts;
create policy posts_owner_all on public.posts
  for all using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- Anyone can READ published posts of a PUBLISHED page (zero-login public feed).
drop policy if exists posts_public_read on public.posts;
create policy posts_public_read on public.posts
  for select using (
    published and exists (
      select 1 from public.profiles p
      where p.id = posts.profile_id and p.page_published
    )
  );

-- Public feed for a handle (card-safe fields only), newest first. SECURITY
-- DEFINER + explicit published filters — same door discipline as get_public_page.
create or replace function public.list_posts(p_handle citext, p_limit int default 30)
  returns jsonb
  language plpgsql
  security definer
  set search_path to 'public'
as $function$
declare
  prof record;
  result jsonb;
begin
  select id, handle from profiles into prof
   where handle = p_handle and page_published;
  if not found then return '[]'::jsonb; end if;

  select coalesce(jsonb_agg(jsonb_build_object(
    'id', po.id,
    'kind', po.kind,
    'body', po.body,
    'image_url', po.image_url,
    'offer_label', po.offer_label,
    'created_at', po.created_at
  ) order by po.created_at desc), '[]'::jsonb)
  into result
  from posts po
  where po.profile_id = prof.id and po.published
  limit p_limit;

  return result;
end $function$;

-- A single post + its author (for the shareable /{handle}/p/{id} page + OG tags).
create or replace function public.get_post(p_id uuid)
  returns jsonb
  language plpgsql
  security definer
  set search_path to 'public'
as $function$
declare
  result jsonb;
begin
  select jsonb_build_object(
    'id', po.id,
    'kind', po.kind,
    'body', po.body,
    'image_url', po.image_url,
    'offer_label', po.offer_label,
    'created_at', po.created_at,
    'handle', p.handle,
    'full_name', p.full_name,
    'title', p.title,
    'avatar_url', p.avatar_url,
    'accent_color', p.accent_color
  ) into result
  from posts po join profiles p on p.id = po.profile_id
  where po.id = p_id and po.published and p.page_published;

  return result; -- null if not found / not public
end $function$;

grant execute on function public.list_posts(citext, int) to anon, authenticated;
grant execute on function public.get_post(uuid) to anon, authenticated;
