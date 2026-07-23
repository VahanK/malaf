-- 032 · Farm-users pivot (2026-07-23): publishing is now FREE. Override
-- can_publish() to always allow — this neuters the enforce_publish_paywall
-- trigger WITHOUT dropping the trigger, the subscription tables, or the
-- checkout/activate/confirm RPCs, all of which stay for future PAID upgrades
-- (remove-branding, custom domain, the money tools…).
--
-- The paywall lived in the DB (page_published is a client-side RLS UPDATE, so a
-- UI-only change would be bypassable) — so this is the load-bearing change.
-- Already-published users are unaffected; the trigger only ever gated the
-- false→true transition. Free tier stays 'free' (kept for gating OTHER features
-- later, never publish).
create or replace function public.can_publish(p_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select true;
$$;

revoke all on function public.can_publish(uuid) from public, anon, authenticated;
