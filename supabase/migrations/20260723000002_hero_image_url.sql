-- 030 · Explicit hero image for the composable Hero (founder ask: "let me put
-- image in hero"). Distinct from avatar_url and from auto-picked gallery photos
-- — when set, the hero (photo-bleed / cinematic / split-portrait variants) uses
-- THIS image. Nullable; existing rows keep auto-picking their first gallery photo.
alter table public.profiles
  add column if not exists hero_image_url text;

-- Redefine get_public_page to surface hero_image_url in the profile jsonb. Body
-- is the prior live definition plus the one new field.
create or replace function public.get_public_page(p_handle citext)
  returns jsonb
  language plpgsql
  security definer
  set search_path to 'public'
as $function$
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
      'hero_image_url', prof.hero_image_url,
      'voice_intro_url', prof.voice_intro_url,
      'accent_color', prof.accent_color,
      'preset', prof.preset,
      'card_template', prof.card_template,
      'availability_status', prof.availability_status,
      'availability_note', prof.availability_note,
      'whatsapp_number', prof.whatsapp_number,
      'areas_served', prof.areas_served,
      'page_language', prof.page_language,
      'noindex', prof.noindex,
      'reply_hours', prof.reply_hours,
      'hero_variant', prof.hero_variant,
      'contact_variant', prof.contact_variant,
      'composable', prof.composable
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
        'id', b.id, 'type', b.type, 'position', b.position, 'data', b.data,
        'title', b.title, 'title_ar', b.title_ar,
        'intro', b.intro, 'intro_ar', b.intro_ar, 'variant', b.variant
      ) order by b.position)
      from portfolio_blocks b where b.profile_id = prof.id and b.active
    ), '[]'::jsonb)
  ) into result;

  return result;
end $function$;
