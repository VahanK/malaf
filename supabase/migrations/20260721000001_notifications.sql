-- 018 · Notifications, rebuilt against real events (Sprint 3 plan §Task 23).
-- Reuses the shell/poll pattern from components/_khedme-staging/notifications
-- (table shape + 30s-poll bell), but every trigger is a real Malaf event:
-- quote_approved, payment_claimed, payment_confirmed, usdt_matched, reminder_due.
-- The staging migration's new_project/new_message types don't apply — those
-- tables don't exist in Malaf.
--
-- Portability rule 1 (CLAUDE.md): business logic lives in the app layer, not
-- DB triggers. Notifications are inserted by the same SECURITY DEFINER
-- functions that already record the underlying event (approve_document_by_token,
-- submit_payment_claim, confirm_payment) — one extra insert each, not a
-- separate trigger watching payment_events/documents.

create table if not exists notifications (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid not null references profiles(id) on delete cascade,
  type       text not null check (type in ('quote_approved','payment_claimed','payment_confirmed','usdt_matched')),
  document_id uuid references documents(id) on delete cascade,
  title      text not null,
  message    text not null,
  link       text,
  is_read    boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists notifications_profile_unread_idx
  on notifications (profile_id, is_read, created_at desc);

alter table notifications enable row level security;

create policy "notifications_owner_select" on notifications
  for select using (auth.uid() = profile_id);

create policy "notifications_owner_update" on notifications
  for update using (auth.uid() = profile_id) with check (auth.uid() = profile_id);

create policy "notifications_owner_delete" on notifications
  for delete using (auth.uid() = profile_id);

-- No insert policy for anyone, including the owner — matches audit_log/
-- payment_events (append-only ledgers, writes only via SECURITY DEFINER
-- functions or the service-role cron).

revoke all on notifications from anon;
grant select, update, delete on notifications to authenticated;
