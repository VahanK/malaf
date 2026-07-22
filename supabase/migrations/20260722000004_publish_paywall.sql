-- 025 · Pay-to-publish paywall. The page is the product: a freelancer builds and
-- previews for free, but making it LIVE at /{handle} requires a paid subscription.
--
-- CRITICAL: page_published is toggled by a direct client-side RLS UPDATE
-- (app/dashboard/profile/ProfileForm.tsx), so a UI-only paywall is trivially
-- bypassable from the browser console. The gate MUST live in the DB. A
-- BEFORE UPDATE trigger on profiles rejects page_published going true unless
-- the owner has an active non-free subscription. This is the whole enforcement.
--
-- Payment is self-serve for USDT (auto-confirmed by the existing on-chain
-- watcher, pointed at the FOUNDER's address) and manual for the rest (founder
-- confirms in the admin). No custody: the freelancer pays the founder directly
-- on-chain / by rail; WorkWith only observes and flips a flag.

-- ---------- founder's own collection address (subscription target) ----------
-- Singleton, like usdt_watcher_state. Only the founder/service-role touches it.
create table public.platform_config (
  id                 int primary key default 1 check (id = 1),
  subscription_usd   numeric(10,2) not null default 29,
  usdt_address       text not null default '',        -- founder's TRC-20 address; where subscription USDT lands
  updated_at         timestamptz not null default now()
);
insert into public.platform_config (id) values (1) on conflict (id) do nothing;
alter table public.platform_config enable row level security;
-- Public-read the price + address only (needed to render the checkout page);
-- never writable by anon/authenticated (service-role / founder via SQL only).
create policy "platform_config_public_read" on public.platform_config
  for select using (true);

create trigger platform_config_updated_at before update on public.platform_config
  for each row execute function public.set_updated_at();

-- ---------- subscription_payments — one row per checkout attempt ----------
create table public.subscription_payments (
  id             uuid primary key default gen_random_uuid(),
  profile_id     uuid not null references public.profiles(id) on delete cascade,
  status         text not null default 'pending' check (status in ('pending', 'paid', 'expired', 'cancelled')),
  amount_usd     numeric(10,2) not null,
  usdt_reference text,                                -- 2-digit cents suffix, same mechanism as invoices
  usdt_amount    numeric(10,2),                       -- amount_usd + usdt_reference/100 (the exact-match target)
  paid_via       text,                                -- 'usdt' | 'whish' | 'iban' | 'cash'
  paid_at        timestamptz,
  usdt_tx_hash   text,
  proof_path     text,                                -- manual-claim proof screenshot (payment-proofs bucket)
  claim_note     text not null default '',
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);
create index subscription_payments_profile_idx on public.subscription_payments (profile_id, status);
create index subscription_payments_pending_ref_idx on public.subscription_payments (usdt_reference) where status = 'pending';

create trigger subscription_payments_updated_at before update on public.subscription_payments
  for each row execute function public.set_updated_at();

alter table public.subscription_payments enable row level security;
-- Owner reads own; founder reads/writes all. No owner write (mutations go through
-- the definer RPCs / founder), matching the subscriptions table's discipline.
create policy "subscription_payments_owner_select" on public.subscription_payments
  for select using (auth.uid() = profile_id);
create policy "subscription_payments_founder_all" on public.subscription_payments
  for all using (
    exists (select 1 from public.profiles where id = auth.uid() and is_founder)
  ) with check (
    exists (select 1 from public.profiles where id = auth.uid() and is_founder)
  );

-- ---------- access_tokens gains a 'subscription' scope ----------
alter table public.access_tokens drop constraint access_tokens_scope_check;
alter table public.access_tokens add constraint access_tokens_scope_check
  check (scope in ('quote', 'invoice', 'receipt', 'pay', 'subscription'));

-- ---------- the gate: can this profile publish? ----------
create or replace function public.can_publish(p_profile_id uuid)
returns boolean
language sql stable security definer set search_path = public as $$
  select exists (
    select 1 from subscriptions
    where profile_id = p_profile_id
      and tier <> 'free'
      and status = 'active'
      and (period_end is null or period_end > now())
  );
$$;
-- internal helper (trigger + checkout RPC use it) — not a public endpoint
revoke all on function public.can_publish(uuid) from public, anon, authenticated;

-- BEFORE UPDATE trigger — the real enforcement. Only fires cost when
-- page_published actually transitions false->true; a paid page can be
-- unpublished or re-saved freely, and an already-live page is never yanked
-- mid-update (only the transition INTO published is gated).
create or replace function public.enforce_publish_paywall()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if new.page_published and not coalesce(old.page_published, false) then
    if not can_publish(new.id) then
      raise exception 'publish_requires_subscription'
        using hint = 'Publishing your page requires an active subscription.';
    end if;
  end if;
  return new;
end $$;

-- trigger function must never be RPC-callable
revoke all on function public.enforce_publish_paywall() from public, anon, authenticated;

create trigger profiles_enforce_publish_paywall
  before update on public.profiles
  for each row execute function public.enforce_publish_paywall();

-- ---------- start_subscription_checkout — owner mints a pending payment ----------
-- Reuses an existing pending payment if one is live (idempotent-ish: no pile-up
-- of stale references). Generates a USDT reference unique among this profile's
-- pending payments. Returns the checkout token + amounts + founder address.
create or replace function public.start_subscription_checkout()
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  uid uuid := auth.uid();
  cfg record;
  existing record;
  ref text;
  tries int := 0;
  pay_id uuid;
  tok text;
begin
  if uid is null then return null; end if;

  -- Already paid? nothing to do.
  if can_publish(uid) then
    return jsonb_build_object('already_active', true);
  end if;

  select * into cfg from platform_config where id = 1;

  -- Reuse a still-pending payment for this profile if present (return its token).
  select sp.*, at.token as tok into existing
  from subscription_payments sp
  join access_tokens at on at.subject_id = sp.id and at.scope = 'subscription' and not at.revoked
  where sp.profile_id = uid and sp.status = 'pending'
  order by sp.created_at desc limit 1;
  if found then
    return jsonb_build_object(
      'token', existing.tok, 'amount_usd', existing.amount_usd,
      'usdt_amount', existing.usdt_amount, 'usdt_reference', existing.usdt_reference,
      'usdt_address', cfg.usdt_address
    );
  end if;

  -- Fresh reference, unique among this profile's pending subscription payments.
  loop
    ref := lpad((floor(random() * 100))::int::text, 2, '0');
    tries := tries + 1;
    exit when not exists (
      select 1 from subscription_payments
      where profile_id = uid and usdt_reference = ref and status = 'pending'
    ) or tries > 50;
  end loop;

  insert into subscription_payments (profile_id, status, amount_usd, usdt_reference, usdt_amount)
  values (uid, 'pending', cfg.subscription_usd, ref, cfg.subscription_usd + (ref::numeric / 100))
  returning id into pay_id;

  tok := replace(replace(replace(encode(gen_random_bytes(16), 'base64'), '/', '_'), '+', '-'), '=', '');
  insert into access_tokens (profile_id, token, scope, subject_id)
  values (uid, tok, 'subscription', pay_id);

  return jsonb_build_object(
    'token', tok, 'amount_usd', cfg.subscription_usd,
    'usdt_amount', cfg.subscription_usd + (ref::numeric / 100), 'usdt_reference', ref,
    'usdt_address', cfg.usdt_address
  );
end $$;
revoke all on function public.start_subscription_checkout() from public, anon;
grant execute on function public.start_subscription_checkout() to authenticated;

-- ---------- get_subscription_checkout_by_token — render the checkout page ----------
create or replace function public.get_subscription_checkout_by_token(p_token text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  t record; sp record; prof record; cfg record;
begin
  select * into t from access_tokens
   where token = p_token and not revoked and (expires_at is null or expires_at > now());
  if not found or t.scope <> 'subscription' then return null; end if;

  select * into sp from subscription_payments where id = t.subject_id;
  if not found then return null; end if;
  select * into prof from profiles where id = sp.profile_id;
  select * into cfg from platform_config where id = 1;

  return jsonb_build_object(
    'payment', jsonb_build_object(
      'id', sp.id, 'status', sp.status, 'amount_usd', sp.amount_usd,
      'usdt_reference', sp.usdt_reference, 'usdt_amount', sp.usdt_amount
    ),
    'profile', jsonb_build_object('handle', prof.handle, 'full_name', prof.full_name),
    'usdt_address', cfg.usdt_address
  );
end $$;
revoke all on function public.get_subscription_checkout_by_token(text) from public;
grant execute on function public.get_subscription_checkout_by_token(text) to anon, authenticated;

-- ---------- activate a subscription (shared by both confirm paths) ----------
-- Marks the payment paid, flips the profile's subscription to 'paid'/active with
-- a 1-year period, and notifies the freelancer their page can go live.
create or replace function public.activate_subscription(p_payment_id uuid, p_via text, p_tx_hash text default null)
returns void
language plpgsql security definer set search_path = public as $$
declare sp record;
begin
  select * into sp from subscription_payments where id = p_payment_id and status = 'pending';
  if not found then return; end if;

  update subscription_payments
    set status = 'paid', paid_via = p_via, paid_at = now(), usdt_tx_hash = p_tx_hash
    where id = sp.id;

  update subscriptions
    set tier = 'paid', status = 'active', amount_usd = sp.amount_usd, paid_via = p_via,
        period_end = coalesce(greatest(period_end, now()), now()) + interval '1 year'
    where profile_id = sp.profile_id;

  insert into notifications (profile_id, type, title, message, link)
  values (
    sp.profile_id, 'payment_confirmed',
    'Subscription active — publish your page',
    'Your $' || sp.amount_usd || ' subscription is active. You can now publish your page live.',
    '/dashboard/profile'
  );
end $$;
revoke all on function public.activate_subscription(uuid, text, text) from public, anon, authenticated;

-- ---------- confirm_subscription_payment_system — the USDT watcher's entry ----------
create or replace function public.confirm_subscription_payment_system(p_payment_id uuid, p_usdt_tx_hash text)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  perform activate_subscription(p_payment_id, 'usdt', p_usdt_tx_hash);
  return true;
end $$;
revoke all on function public.confirm_subscription_payment_system(uuid, text) from public, anon, authenticated;
-- service-role only (cron watcher), like confirm_payment_system.

-- ---------- confirm_subscription_payment_founder — manual confirm in admin ----------
create or replace function public.confirm_subscription_payment_founder(p_payment_id uuid, p_via text)
returns boolean
language plpgsql security definer set search_path = public as $$
begin
  if not exists (select 1 from profiles where id = auth.uid() and is_founder) then
    return false;
  end if;
  perform activate_subscription(p_payment_id, p_via, null);
  return true;
end $$;
revoke all on function public.confirm_subscription_payment_founder(uuid, text) from public, anon;
grant execute on function public.confirm_subscription_payment_founder(uuid, text) to authenticated;

-- ---------- submit_subscription_claim — freelancer flags a manual payment ----------
-- Records a note on the pending payment (Whish/bank/cash) for the founder to
-- confirm. Does NOT mark paid. The subscription token carries the payment id.
create or replace function public.submit_subscription_claim(p_token text, p_note text default '')
returns boolean
language plpgsql security definer set search_path = public as $$
declare t record;
begin
  select * into t from access_tokens
   where token = p_token and not revoked and (expires_at is null or expires_at > now());
  if not found or t.scope <> 'subscription' then return false; end if;
  update subscription_payments
    set claim_note = left(p_note, 300)
    where id = t.subject_id and status = 'pending';
  return true;
end $$;
revoke all on function public.submit_subscription_claim(text, text) from public, anon;
grant execute on function public.submit_subscription_claim(text, text) to authenticated;
-- (notifications.type already allows 'payment_confirmed' — see 20260721000001_notifications.sql)
