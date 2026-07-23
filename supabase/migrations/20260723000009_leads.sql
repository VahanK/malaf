-- 037 · Leads — the multi-step contact form that replaces the boring "request a
-- quote" on every page (founder: "Typeform-level form … actually generate a lead
-- … we see every deal, 0 commissions for now"). A client fills it → the lead is
-- saved (the freelancer's lead AND platform-visible traction data) → the client
-- gets a one-tap wa.me to the freelancer. No Meta API, no auto-send: red-line
-- safe. Later the official WhatsApp Cloud API can layer on top for auto-messaging.

create table if not exists public.leads (
  id           uuid primary key default gen_random_uuid(),
  profile_id   uuid not null references public.profiles(id) on delete cascade,
  -- what the client answered in the multi-step form
  name         text,
  contact      text,             -- phone or email they gave
  service      text,             -- which service / need
  budget       text,             -- rough budget band (optional)
  message      text,             -- free-text detail
  -- lifecycle for the freelancer's inbox
  status       text not null default 'new' check (status in ('new', 'contacted', 'won', 'lost')),
  created_at   timestamptz not null default now()
);

create index if not exists leads_profile_created_idx on public.leads (profile_id, created_at desc);

alter table public.leads enable row level security;

-- The freelancer owns their leads (read + update status). No client login exists,
-- so INSERT is done server-side via a SECURITY DEFINER RPC (below), not client RLS.
drop policy if exists leads_owner_rw on public.leads;
create policy leads_owner_rw on public.leads
  for select using (profile_id = auth.uid());
drop policy if exists leads_owner_update on public.leads;
create policy leads_owner_update on public.leads
  for update using (profile_id = auth.uid()) with check (profile_id = auth.uid());

-- Zero-login public submit: anyone can create a lead for a PUBLISHED page. Runs
-- as definer so no client-side INSERT policy is needed (clients never log in).
create or replace function public.submit_lead(
  p_handle citext,
  p_name text,
  p_contact text,
  p_service text,
  p_budget text,
  p_message text
) returns uuid
  language plpgsql
  security definer
  set search_path to 'public'
as $function$
declare
  v_profile uuid;
  v_id uuid;
begin
  select id into v_profile from profiles
   where handle = p_handle and page_published;
  if v_profile is null then
    raise exception 'page not found';
  end if;

  insert into leads (profile_id, name, contact, service, budget, message)
  values (v_profile, nullif(trim(p_name), ''), nullif(trim(p_contact), ''),
          nullif(trim(p_service), ''), nullif(trim(p_budget), ''), nullif(trim(p_message), ''))
  returning id into v_id;

  return v_id;
end $function$;

grant execute on function public.submit_lead(citext, text, text, text, text, text) to anon, authenticated;

-- Founder-wide view of ALL leads (platform traction). Gated to founders in the
-- app layer; here it's a plain view the founder dashboard queries with the
-- service role. (No anon grant.)
create or replace view public.founder_leads as
  select l.id, l.created_at, l.status, l.name, l.contact, l.service, l.budget,
         p.handle, p.full_name
  from leads l join profiles p on p.id = l.profile_id;
