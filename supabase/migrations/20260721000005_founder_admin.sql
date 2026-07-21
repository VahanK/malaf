-- 022 · Founder admin surface: subscriptions (manual billing, per
-- MASTER-PLAN Phase A — you collect $29 by hand via Whish/USDT and confirm it
-- yourself, no payment processor integration) + feature_requests (the
-- "let me know if you need something custom" channel, feeding
-- OPERATING-MANUAL's monthly triage rule: ≥5 requests -> build it).
--
-- No new role system (CLAUDE.md: collapse to single role, freelancer).
-- "Founder" is just profiles.is_founder = true on your own row — a flag,
-- not a role, so the rest of the product's mental model stays untouched.

alter table public.profiles add column is_founder boolean not null default false;

create table public.subscriptions (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null unique references public.profiles(id) on delete cascade,
  tier        text not null default 'free' check (tier in ('free', 'founder', 'paid')),
  status      text not null default 'active' check (status in ('active', 'past_due', 'cancelled')),
  amount_usd  numeric(10,2),
  paid_via    text,            -- 'whish' | 'usdt' | 'iban' | 'cash' — same vocabulary as payment_methods.kind
  period_end  timestamptz,     -- null = no expiry tracked yet (founder lifetime deals)
  note        text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger subscriptions_updated_at before update on public.subscriptions
  for each row execute function public.set_updated_at();

alter table public.subscriptions enable row level security;

-- Owner can read their own tier (so the dashboard can show it) but never
-- write it themselves — only the founder confirms payment.
create policy "subscriptions_owner_select" on public.subscriptions
  for select using (auth.uid() = profile_id);

-- Founder can read/write every row. EXISTS-subquery-on-profiles pattern,
-- same shape as other owner-scoped policies in this schema.
create policy "subscriptions_founder_all" on public.subscriptions
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_founder)
  ) with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_founder)
  );

-- Every profile starts on the free tier — a trigger, not app logic, because
-- it's a pure default/counter concern (portability rule 1's permitted class),
-- exactly like handle_new_user's profile-row creation.
create or replace function public.seed_free_subscription()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into subscriptions (profile_id, tier) values (new.id, 'free');
  return new;
end $$;

create trigger profiles_seed_subscription
  after insert on public.profiles
  for each row execute function public.seed_free_subscription();

-- ---------- feature_requests — "let me know if you need something custom" ----------
create table public.feature_requests (
  id          uuid primary key default gen_random_uuid(),
  profile_id  uuid not null references public.profiles(id) on delete cascade,
  body        text not null,
  status      text not null default 'new' check (status in ('new', 'seen', 'planned', 'done', 'declined')),
  founder_note text not null default '',
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

create trigger feature_requests_updated_at before update on public.feature_requests
  for each row execute function public.set_updated_at();

alter table public.feature_requests enable row level security;

-- Freelancers can submit and read their own requests, but can't edit status
-- or founder_note (that's the founder's triage column, per OPERATING-MANUAL).
create policy "feature_requests_owner_select" on public.feature_requests
  for select using (auth.uid() = profile_id);

create policy "feature_requests_owner_insert" on public.feature_requests
  for insert with check (auth.uid() = profile_id);

create policy "feature_requests_founder_all" on public.feature_requests
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_founder)
  ) with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_founder)
  );
