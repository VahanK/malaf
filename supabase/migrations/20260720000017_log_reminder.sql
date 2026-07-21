-- 017 · owner-authenticated reminder logging. payment_events has RLS
-- enabled with only an owner-SELECT policy (mirrors audit_log) — no insert
-- policy for anyone, owner included, so logging "I opened the WhatsApp
-- composer" needs the same SECURITY DEFINER door as every other
-- payment_events write.

create or replace function public.log_reminder_sent(p_document_id uuid, p_tier int, p_language text)
returns boolean
language plpgsql security definer set search_path = public as $$
declare doc record;
begin
  select * into doc from documents where id = p_document_id;
  if not found or doc.profile_id != auth.uid() then return false; end if;
  if p_tier not in (1,2,3) then return false; end if;

  insert into payment_events (profile_id, document_id, actor, event, detail)
  values (doc.profile_id, doc.id, 'owner', 'reminder_sent',
          jsonb_build_object('tier', p_tier, 'days_overdue',
            case when doc.due_at is null then 0
                 else floor(extract(epoch from (now() - doc.due_at)) / 86400) end,
            'channel', 'wa.me', 'language', p_language));

  return true;
end $$;
revoke all on function public.log_reminder_sent(uuid, int, text) from public, anon;
grant execute on function public.log_reminder_sent(uuid, int, text) to authenticated;
