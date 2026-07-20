-- 001 · core: helpers, profiles, reserved handles
-- Rules: RLS on every table (SECURITY.md A4); triggers only for timestamps (CLAUDE.md portability).

create extension if not exists citext;

-- updated_at helper (timestamps only — workflow logic stays in the app layer)
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ---------- profiles (single role: freelancer) ----------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  handle citext unique,
  full_name text not null default '',
  title text not null default '',
  title_ar text not null default '',
  bio text not null default '',
  avatar_url text,
  voice_intro_url text,             -- 20s voice intro (CLAUDE.md §1 flagship)
  accent_color text,                -- derived from photos; hex
  preset text,                      -- preset key at signup (photographer, ...)
  availability_status text not null default 'available',  -- available | busy | away
  availability_note text not null default '',             -- "مشغول لآخر الشهر"
  whatsapp_number text,             -- +961 mask in UI
  areas_served text[] not null default '{}',
  page_language text not null default 'en' check (page_language in ('en','ar')),
  page_published boolean not null default false,
  noindex boolean not null default true,   -- SECURITY.md B2: noindex until profile complete
  reply_hours numeric,              -- "usually replies in ~Xh" (computed later from real data)
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint handle_format check (
    handle is null or (length(handle) between 3 and 30 and handle ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$')
  )
);

create index profiles_handle_idx on public.profiles (handle);
create trigger profiles_updated_at before update on public.profiles
  for each row execute function public.set_updated_at();

alter table public.profiles enable row level security;

-- owner-only; public reads go through the SECURITY DEFINER page function only
create policy "profiles_owner_select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_owner_insert" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_owner_update" on public.profiles
  for update using (auth.uid() = id) with check (auth.uid() = id);

-- ---------- reserved handles (SECURITY.md B2: impersonation blocklist) ----------
create table public.reserved_handles (
  handle citext primary key,
  reason text not null default 'reserved'
);
alter table public.reserved_handles enable row level security;
-- no policies: consulted only by SECURITY DEFINER functions

insert into public.reserved_handles (handle, reason) values
  ('malaf','brand'),('admin','brand'),('support','brand'),('help','brand'),('team','brand'),
  ('api','infra'),('app','infra'),('www','infra'),('mail','infra'),('pay','infra'),('payments','infra'),
  ('whish','payment-brand'),('omt','payment-brand'),('bob','payment-brand'),('bobfinance','payment-brand'),
  ('cashunited','payment-brand'),('usdt','payment-brand'),('binance','payment-brand'),('wish','payment-brand'),
  ('bdl','institution'),('bankaudi','bank'),('blombank','bank'),('byblosbank','bank'),('fransabank','bank'),
  ('ministry','institution'),('gov','institution'),('government','institution'),('police','institution'),
  ('security','institution'),('official','institution'),('verify','phishing'),('verification','phishing'),
  ('billing','phishing'),('invoice','phishing'),('refund','phishing');

-- handle availability check, callable by anon during signup (definer: reads both tables)
create or replace function public.is_handle_available(candidate citext)
returns boolean
language sql security definer set search_path = public as $$
  select length(candidate) between 3 and 30
     and candidate ~ '^[a-z0-9][a-z0-9-]*[a-z0-9]$'
     and not exists (select 1 from reserved_handles r where r.handle = candidate)
     and not exists (select 1 from profiles p where p.handle = candidate);
$$;
revoke all on function public.is_handle_available(citext) from public;
grant execute on function public.is_handle_available(citext) to anon, authenticated;
