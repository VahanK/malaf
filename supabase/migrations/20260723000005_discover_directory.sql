-- 033 · Discover directory: a public, zero-login list of PUBLISHED pages for
-- /discover. profiles is owner-only under RLS, so — exactly like get_public_page
-- (docs/SECURITY.md A1) — this is a SECURITY DEFINER door that returns ONLY
-- card-safe, published fields (handle/name/title/trade/area/image), never
-- contact or money. page_published is filtered in SQL (it is the publish gate),
-- so drafts never surface. No anon RLS policy is added to profiles.
create or replace function public.list_published_pages(p_limit int default 60, p_offset int default 0)
returns jsonb
language plpgsql
security definer
set search_path = public
as $function$
begin
  return coalesce((
    select jsonb_agg(jsonb_build_object(
      'handle', p.handle,
      'full_name', p.full_name,
      'title', p.title,
      'title_ar', p.title_ar,
      'avatar_url', p.avatar_url,
      'hero_image_url', p.hero_image_url,
      'accent_color', p.accent_color,
      'preset', p.preset,
      'card_template', p.card_template,
      'areas_served', p.areas_served
    ) order by p.updated_at desc)
    from (
      select * from profiles
      where page_published
      order by updated_at desc
      limit greatest(1, least(p_limit, 120))
      offset greatest(0, p_offset)
    ) p
  ), '[]'::jsonb);
end
$function$;

revoke all on function public.list_published_pages(int, int) from public;
grant execute on function public.list_published_pages(int, int) to anon, authenticated;
