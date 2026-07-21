-- 025 · Card template, decoupled from preset (Jul 21 founder feedback: the
-- dark card felt generic/repetitive, and a photographer shouldn't be forced
-- into the same look as a tutor just because they share a trade). `preset`
-- still drives starter content (sample services, block order, tagline) —
-- `card_template` drives the LOOK (surface, type pairing, shape language,
-- container strategy). Orthogonal on purpose: any trade can pick any template.
alter table public.profiles
  add column card_template text not null default 'editorial-dark'
  check (card_template in ('editorial-dark', 'minimal-light'));
