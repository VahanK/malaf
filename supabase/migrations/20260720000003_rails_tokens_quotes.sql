-- 003 · payment rails as CONFIG, audit log, zero-login token pattern, quote requests + rate limiting
-- Patterns per docs/SECURITY.md A1-A3, B1-B4 (gjstylejewelry lineage).

-- ---------- payment_methods — rails are rows, never integrations (CLAUDE.md) ----------
create table public.payment_methods (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  kind text not null check (kind in ('whish','omt','bob','cashunited','usdt','iban','cash','custom')),
  label text not null,
  label_ar text not null default '',
  details jsonb not null default '{}'::jsonb,  -- number/address/IBAN; masked in UI
  deep_link_template text,                     -- e.g. whish deep link; rendered, never called
  fresh_usd boolean not null default false,    -- "Fresh USD" flag (IBAN)
  sort_order integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index payment_methods_profile_idx on public.payment_methods (profile_id, sort_order);
create trigger payment_methods_updated_at before update on public.payment_methods
  for each row execute function public.set_updated_at();

alter table public.payment_methods enable row level security;
create policy "payment_methods_owner_all" on public.payment_methods
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

-- ---------- audit_log — append-only (SECURITY.md A3, B4) ----------
create table public.audit_log (
  id bigint generated always as identity primary key,
  profile_id uuid,
  actor text not null,           -- 'owner' | 'system' | 'anon'
  action text not null,          -- e.g. payment_method.updated
  subject_table text,
  subject_id text,
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index audit_log_profile_idx on public.audit_log (profile_id, created_at desc);
alter table public.audit_log enable row level security;
create policy "audit_owner_select" on public.audit_log
  for select using (auth.uid() = profile_id);
-- inserts happen in app layer with service role or via definer functions; no anon/user insert policy

-- payment-details changes are crown jewels: DB-level audit trigger (timestamps/counters-class, not workflow)
create or replace function public.log_payment_method_change()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into audit_log (profile_id, actor, action, subject_table, subject_id, detail)
  values (
    coalesce(new.profile_id, old.profile_id),
    'owner',
    'payment_method.' || lower(tg_op),
    'payment_methods',
    coalesce(new.id, old.id)::text,
    jsonb_build_object('kind', coalesce(new.kind, old.kind))
  );
  return coalesce(new, old);
end $$;
create trigger payment_methods_audit
  after insert or update or delete on public.payment_methods
  for each row execute function public.log_payment_method_change();

-- ---------- access_tokens — zero-login door (SECURITY.md A1/B1) ----------
-- RLS enabled, NO policies. The ONLY door is SECURITY DEFINER functions.
create table public.access_tokens (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  token text not null unique,                  -- nanoid 21+ generated app-side
  scope text not null check (scope in ('quote','invoice','receipt','pay')),
  subject_id uuid,                             -- the document this token unlocks (v1 documents come post-gate)
  revoked boolean not null default false,
  expires_at timestamptz,
  created_at timestamptz not null default now()
);
create index access_tokens_token_idx on public.access_tokens (token);
alter table public.access_tokens enable row level security;
-- no policies, by design

create or replace function public.resolve_access_token(p_token text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare t record;
begin
  select * into t from access_tokens
   where token = p_token and not revoked
     and (expires_at is null or expires_at > now());
  if not found then return null; end if;
  return jsonb_build_object('scope', t.scope, 'subject_id', t.subject_id, 'profile_id', t.profile_id);
end $$;
revoke all on function public.resolve_access_token(text) from public;
grant execute on function public.resolve_access_token(text) to anon, authenticated;

-- ---------- rate_limit_ledger (SECURITY.md A2) ----------
create table public.rate_limit_ledger (
  id bigint generated always as identity primary key,
  bucket text not null,             -- e.g. 'quote_request:203.0.113.5'
  created_at timestamptz not null default now()
);
create index rate_limit_bucket_idx on public.rate_limit_ledger (bucket, created_at desc);
alter table public.rate_limit_ledger enable row level security;
-- no policies: definer-only

create or replace function public.rate_limit_ok(p_bucket text, p_max int, p_window interval)
returns boolean
language plpgsql security definer set search_path = public as $$
declare n int;
begin
  select count(*) into n from rate_limit_ledger
   where bucket = p_bucket and created_at > now() - p_window;
  if n >= p_max then return false; end if;
  insert into rate_limit_ledger (bucket) values (p_bucket);
  return true;
end $$;
revoke all on function public.rate_limit_ok(text, int, interval) from public;
-- not granted to anon directly; called inside other definer functions

-- ---------- quote_requests — the public CTA writes here ----------
create table public.quote_requests (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid not null references public.profiles(id) on delete cascade,
  service_id uuid references public.services(id) on delete set null,
  client_name text not null,
  client_phone text not null default '',
  message text not null default '',
  status text not null default 'new' check (status in ('new','seen','replied')),
  created_at timestamptz not null default now()
);
create index quote_requests_profile_idx on public.quote_requests (profile_id, created_at desc);
alter table public.quote_requests enable row level security;
create policy "quotes_owner_select" on public.quote_requests
  for select using (auth.uid() = profile_id);
create policy "quotes_owner_update" on public.quote_requests
  for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
-- anon inserts ONLY via the definer function below (validated + rate-limited)

create or replace function public.request_quote(
  p_handle citext, p_client_name text, p_client_phone text,
  p_message text, p_service_id uuid default null, p_bucket text default ''
) returns boolean
language plpgsql security definer set search_path = public as $$
declare pid uuid;
begin
  if length(trim(p_client_name)) < 2 or length(p_message) > 2000
     or length(p_client_name) > 120 or length(p_client_phone) > 30 then
    return false;
  end if;
  select id into pid from profiles where handle = p_handle and page_published;
  if not found then return false; end if;
  if not rate_limit_ok('quote_request:' || coalesce(nullif(p_bucket,''), 'unknown'), 5, interval '1 hour') then
    return false;
  end if;
  insert into quote_requests (profile_id, service_id, client_name, client_phone, message)
  values (pid, p_service_id, trim(p_client_name), trim(p_client_phone), trim(p_message));
  return true;
end $$;
revoke all on function public.request_quote(citext, text, text, text, uuid, text) from public;
grant execute on function public.request_quote(citext, text, text, text, uuid, text) to anon, authenticated;
