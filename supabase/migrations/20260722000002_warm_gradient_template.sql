-- 028 · third card template — Warm Gradient (bright, soft, rounded; best
-- for consultants/coaches/tutors/event planners per docs/parking-lot.md).
alter table public.profiles drop constraint profiles_card_template_check;
alter table public.profiles
  add constraint profiles_card_template_check
  check (card_template in ('editorial-dark', 'minimal-light', 'warm-gradient'));
