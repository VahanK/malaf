-- 031 · The card-template registry gained two worlds (brutalist, bento). Widen
-- the profiles CHECK so the template picker / AI curator can persist them.
alter table public.profiles drop constraint profiles_card_template_check;
alter table public.profiles add constraint profiles_card_template_check
  check (card_template = any (array[
    'editorial-dark','minimal-light','warm-gradient',
    'glassmorphism','midnight','clean-gradient','brutalist','bento'
  ]));
