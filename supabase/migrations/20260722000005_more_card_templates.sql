-- 026 · Widen card_template to accept the three new template ids
-- (glassmorphism, midnight, clean-gradient). The look is app-layer (a token +
-- layout registry in lib/card-templates.ts); this just lets the column store
-- the new ids. getCardTemplate() falls back safely on any unknown value.

alter table public.profiles drop constraint profiles_card_template_check;
alter table public.profiles add constraint profiles_card_template_check
  check (card_template = any (array[
    'editorial-dark','minimal-light','warm-gradient',
    'glassmorphism','midnight','clean-gradient'
  ]::text[]));
