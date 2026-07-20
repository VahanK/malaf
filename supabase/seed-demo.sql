-- Demo seed (data, not schema — run via execute_sql, never as a migration)
-- Creates the /rami demo page: demo auth user, profile, services, blocks, payment rails.
-- Content per docs/card-visuals.html + MASTER-PLAN §2 persona; product-shoot service added
-- per research/chill-zone-brief.md (recurring paid demand is product/content shoots).
-- Applied to prod 2026-07-20. Idempotent via fixed demo uuid + on conflict do nothing.

do $$
declare demo_id uuid := '5eed0000-0000-4000-8000-000000000001';
begin
  insert into auth.users (
    instance_id, id, aud, role, email, encrypted_password,
    email_confirmed_at, created_at, updated_at,
    raw_app_meta_data, raw_user_meta_data,
    confirmation_token, recovery_token, email_change, email_change_token_new
  ) values (
    '00000000-0000-0000-0000-000000000000', demo_id, 'authenticated', 'authenticated',
    'demo-rami@malaf.work', extensions.crypt(gen_random_uuid()::text, extensions.gen_salt('bf')),
    now(), now(), now(),
    '{"provider":"email","providers":["email"]}'::jsonb, '{"demo":true}'::jsonb,
    '', '', '', ''
  ) on conflict (id) do nothing;

  insert into public.profiles (
    id, handle, full_name, title, title_ar, bio, accent_color, preset,
    availability_status, availability_note, whatsapp_number, areas_served,
    page_language, page_published, noindex, reply_hours
  ) values (
    demo_id, 'rami', 'Rami Haddad',
    'Wedding & Events Photographer · Beirut', 'مصوّر أعراس ومناسبات · بيروت',
    'Ten years behind the camera at Lebanese weddings. I shoot the moments people frame.',
    '#c9a45c', 'photographer',
    'available', 'Booking for Sept', '+96170000000',
    array['Beirut','Jounieh','Batroun'],
    'en', true, true, 2
  ) on conflict (id) do nothing;

  insert into public.services (profile_id, title, title_ar, price, unit, starting_from, sort_order) values
    (demo_id, 'Full wedding coverage', 'تغطية عرس كاملة', 600, 'event', true, 1),
    (demo_id, 'Engagement session', 'جلسة خطوبة', 150, 'session', false, 2),
    (demo_id, 'Events', 'مناسبات', 250, 'event', false, 3),
    (demo_id, 'Product & content shoot', 'تصوير منتجات ومحتوى', 300, 'day', true, 4);

  insert into public.portfolio_blocks (profile_id, type, position, data) values
    (demo_id, 'image_grid', 1, '{"images":[
      {"url":"/demo/rami/w1.jpg","alt":"First dance, Ottoman-house wedding, Batroun"},
      {"url":"/demo/rami/w2.jpg","alt":"Golden-hour couple portrait, Jounieh bay"},
      {"url":"/demo/rami/w3.jpg","alt":"Zaffe entrance, drummers and sparklers"},
      {"url":"/demo/rami/w4.jpg","alt":"Bride getting ready, window light"},
      {"url":"/demo/rami/w5.jpg","alt":"Table setting detail, mountain venue"},
      {"url":"/demo/rami/w6.jpg","alt":"Confetti exit, night"}]}'::jsonb),
    (demo_id, 'before_after', 2, '{"before":{"url":"/demo/rami/ba-before.jpg"},"after":{"url":"/demo/rami/ba-after.jpg"},"caption":"Raw frame → delivered edit"}'::jsonb),
    (demo_id, 'testimonial', 3, '{"text":"The photos are UNREAL 😍 yeslamo Rami, everyone''s asking who shot it!!","attribution":"Bride''s mom — Mia & Jad''s wedding","date_label":"June 2026"}'::jsonb);

  insert into public.payment_methods (profile_id, kind, label, label_ar, details, fresh_usd, sort_order) values
    (demo_id, 'whish', 'Whish', 'ويش', '{"number":"+961 70 000 000"}'::jsonb, false, 1),
    (demo_id, 'usdt', 'USDT (TRC-20)', 'يو إس دي تي', '{"address":"TDemoAddressXXXXXXXXXXXXXXXXXXXXXX"}'::jsonb, false, 2),
    (demo_id, 'iban', 'Bank transfer', 'تحويل بنكي', '{"iban":"LB00 0000 0000 0000 0000 0000 0000"}'::jsonb, true, 3),
    (demo_id, 'cash', 'Cash', 'كاش', '{}'::jsonb, false, 4);
end $$;
