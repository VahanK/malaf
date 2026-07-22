-- 029 · Composable page sections (Phase 1). The page stops being one fixed
-- skeleton reskinned — it becomes a composed stack of typed sections, each with
-- its own distinct shape (full-bleed bands, numbered kickers, asymmetric splits,
-- no-card lists). This migration is the SUBSTRATE only; render/editor come in
-- the app layer. Every existing row stays valid (all new cols DEFAULT '').
--
-- Gated by profiles.composable — off = today's 4 layouts render byte-identical.

-- portfolio_blocks gains a universal section envelope: a per-instance title +
-- intro (the section heading/kicker the user authors), and a layout variant.
alter table public.portfolio_blocks
  add column title    text not null default '',
  add column title_ar text not null default '',
  add column intro    text not null default '',
  add column intro_ar text not null default '',
  add column variant  text not null default '';

-- Widen the type CHECK: keep all 6 legacy types verbatim; add ONLY the 3
-- Phase-1 section types (skills/list/process come in slice 2).
alter table public.portfolio_blocks drop constraint portfolio_blocks_type_check;
alter table public.portfolio_blocks add constraint portfolio_blocks_type_check
  check (type in (
    'image_grid','before_after','stat_card','video_link','case_card','testimonial',
    'narrative','showcase','gallery'
  ));

-- Fixed-bone shape choices + the feature flag live on the profile.
alter table public.profiles
  add column hero_variant    text not null default '',
  add column contact_variant text not null default '',
  add column composable      boolean not null default false;
