-- 009 · documents engine: quotes -> invoices -> receipts as one table with
-- a type discriminant + parent_document_id chaining (plan §0). Immutable
-- lifecycle history: a quote converts to an invoice via a new INSERT, never
-- an in-place UPDATE.

create table public.documents (
  id                 uuid primary key default gen_random_uuid(),
  profile_id         uuid not null references public.profiles(id) on delete cascade,
  type               text not null check (type in ('quote','invoice','receipt')),
  parent_document_id uuid references public.documents(id) on delete set null,
  quote_request_id   uuid references public.quote_requests(id) on delete set null,
  doc_number         integer not null,
  status             text not null default 'draft' check (status in ('draft','sent','approved','declined','paid','void')),
  client_name        text not null,
  client_phone       text not null default '',
  client_email       text not null default '',
  language           text not null check (language in ('en','ar')) default 'en',
  currency           text not null check (currency in ('USD','LBP')) default 'USD',
  line_items         jsonb not null default '[]'::jsonb,
  subtotal           numeric(12,2) not null default 0,
  discount           numeric(12,2) not null default 0,
  total              numeric(12,2) not null default 0,
  notes              text not null default '',
  notes_ar           text not null default '',
  due_at             timestamptz,
  approved_at        timestamptz,
  approved_via       text check (approved_via in ('client_tap','whatsapp_manual')),
  paid_at            timestamptz,
  paid_via           text check (paid_via in ('freelancer_confirm','usdt_watcher')),
  usdt_reference     text unique,
  void_at            timestamptz,
  void_reason        text not null default '',
  created_at         timestamptz not null default now(),
  updated_at         timestamptz not null default now()
);

create index documents_profile_type_status_idx on public.documents (profile_id, type, status);
create unique index documents_profile_type_number_idx on public.documents (profile_id, type, doc_number);
create index documents_parent_idx on public.documents (parent_document_id);

create trigger documents_updated_at before update on public.documents
  for each row execute function public.set_updated_at();

-- doc_number sequencing: a counter, not workflow (portability rule 1 permits this class of trigger).
create or replace function public.set_document_number()
returns trigger
language plpgsql security definer set search_path = public as $$
declare next_number integer;
begin
  select coalesce(max(doc_number), 0) + 1 into next_number
    from public.documents
   where profile_id = new.profile_id and type = new.type;
  new.doc_number := next_number;
  return new;
end $$;

create trigger documents_set_number before insert on public.documents
  for each row execute function public.set_document_number();

alter table public.documents enable row level security;
create policy "documents_owner_all" on public.documents
  for all using (auth.uid() = profile_id) with check (auth.uid() = profile_id);
-- anon/token access ONLY through SECURITY DEFINER functions (migration 010)

-- ---------- payment_events — append-only, mirrors audit_log exactly ----------
create table public.payment_events (
  id bigint generated always as identity primary key,
  profile_id uuid not null,
  document_id uuid not null references public.documents(id) on delete cascade,
  actor text not null check (actor in ('client','owner','system')),
  event text not null check (event in ('proof_submitted','confirmed','reminder_sent','usdt_matched','voided')),
  detail jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);
create index payment_events_document_idx on public.payment_events (document_id, created_at desc);
create index payment_events_profile_idx on public.payment_events (profile_id, created_at desc);

alter table public.payment_events enable row level security;
create policy "payment_events_owner_select" on public.payment_events
  for select using (auth.uid() = profile_id);
-- inserts ONLY via SECURITY DEFINER functions / service-role cron — no anon/authenticated insert policy

-- ---------- message_templates — DB-stored bilingual copy, presets-shaped ----------
create table public.message_templates (
  id         uuid primary key default gen_random_uuid(),
  profile_id uuid references public.profiles(id) on delete cascade,
  kind       text not null check (kind in ('reminder_tier1','reminder_tier2','reminder_tier3','quote_share','invoice_share','receipt_share')),
  language   text not null check (language in ('en','ar')),
  body       text not null,
  created_at timestamptz not null default now()
);
alter table public.message_templates enable row level security;
create policy "message_templates_public_read" on public.message_templates
  for select using (profile_id is null or profile_id = auth.uid());

insert into public.message_templates (profile_id, kind, language, body) values
  (null, 'quote_share', 'en', 'Hi {{client_name}}, here''s the quote we discussed: {{doc_link}}'),
  (null, 'quote_share', 'ar', 'مرحبا {{client_name}}، هذا هو العرض الذي تحدثنا عنه: {{doc_link}}'),
  (null, 'invoice_share', 'en', 'Hi {{client_name}}, here''s your invoice for {{amount}}: {{doc_link}}'),
  (null, 'invoice_share', 'ar', 'مرحبا {{client_name}}، هذه فاتورتك بقيمة {{amount}}: {{doc_link}}'),
  (null, 'receipt_share', 'en', 'Thank you {{client_name}}! Here''s your receipt: {{doc_link}}'),
  (null, 'receipt_share', 'ar', 'شكرا {{client_name}}! هذا إيصالك: {{doc_link}}'),
  (null, 'reminder_tier1', 'en', 'Hi {{client_name}}, just a gentle reminder about the invoice for {{amount}} — {{doc_link}}. Thank you!'),
  (null, 'reminder_tier1', 'ar', 'مرحبا {{client_name}}، تذكير لطيف بخصوص الفاتورة بقيمة {{amount}} — {{doc_link}}. شكرا لك!'),
  (null, 'reminder_tier2', 'en', 'Hi {{client_name}}, following up again on the invoice for {{amount}} ({{doc_link}}) — would appreciate it if you could settle it soon. Thanks!'),
  (null, 'reminder_tier2', 'ar', 'مرحبا {{client_name}}، أتابع معك بخصوص الفاتورة بقيمة {{amount}} ({{doc_link}}) — يسعدني إذا أمكن تسويتها قريبا. شكرا!'),
  (null, 'reminder_tier3', 'en', 'Hi {{client_name}}, this is a final reminder for the invoice for {{amount}} ({{doc_link}}), which is now significantly overdue. Please let me know if there''s an issue.'),
  (null, 'reminder_tier3', 'ar', 'مرحبا {{client_name}}، هذا تذكير أخير بخصوص الفاتورة بقيمة {{amount}} ({{doc_link}})، والتي تأخرت كثيرا. الرجاء إخباري إذا كان هناك أي مشكلة.');

-- ---------- usdt_watcher_state — singleton cron cursor (Tier-1, unused until Sprint 3) ----------
create table public.usdt_watcher_state (
  id int primary key default 1 check (id = 1),
  last_checked_block bigint not null default 0,
  updated_at timestamptz not null default now()
);
alter table public.usdt_watcher_state enable row level security;
-- no policies: touched only by the service-role cron
insert into public.usdt_watcher_state (id) values (1);
