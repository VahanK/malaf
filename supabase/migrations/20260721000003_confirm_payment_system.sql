-- 020 · System-actor payment confirmation, for the Tier-1 USDT watcher
-- (Sprint 3 Task 24). Mirrors confirm_payment exactly but is callable only by
-- the service-role client (no authenticated/anon grant) since there is no
-- owner session during a cron run, and it records paid_via='usdt_watcher' +
-- actor='system' + a payment_confirmed/usdt_matched notification pair —
-- the one case where a notification is genuinely needed, since the owner
-- didn't take the confirming action themselves.

create or replace function public.confirm_payment_system(p_document_id uuid, p_usdt_tx_hash text)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  doc record;
  receipt_id uuid;
  receipt_token text;
begin
  select * into doc from documents where id = p_document_id;
  if not found or doc.type != 'invoice' or doc.status not in ('sent','approved') then
    return null;
  end if;

  update documents set paid_at = now(), paid_via = 'usdt_watcher', status = 'paid'
   where id = doc.id;

  insert into payment_events (profile_id, document_id, actor, event, detail)
  values (doc.profile_id, doc.id, 'system', 'usdt_matched', jsonb_build_object('tx_hash', p_usdt_tx_hash));

  insert into documents (
    profile_id, type, parent_document_id, status, client_name, client_phone, client_email,
    language, currency, line_items, subtotal, discount, total, notes, notes_ar, paid_at, paid_via
  ) values (
    doc.profile_id, 'receipt', doc.id, 'paid', doc.client_name, doc.client_phone, doc.client_email,
    doc.language, doc.currency, doc.line_items, doc.subtotal, doc.discount, doc.total, doc.notes, doc.notes_ar,
    now(), 'usdt_watcher'
  ) returning id into receipt_id;

  receipt_token := encode(gen_random_bytes(16), 'base64');
  receipt_token := replace(replace(replace(receipt_token, '/', '_'), '+', '-'), '=', '');
  insert into access_tokens (profile_id, token, scope, subject_id)
  values (doc.profile_id, receipt_token, 'receipt', receipt_id);

  insert into notifications (profile_id, type, document_id, title, message, link)
  values (
    doc.profile_id, 'usdt_matched', doc.id,
    'USDT payment matched automatically',
    'Invoice #' || doc.doc_number || ' from ' || doc.client_name || ' was paid in USDT and marked paid',
    '/dashboard/invoices/' || doc.id
  );

  return jsonb_build_object('receipt_id', receipt_id, 'receipt_token', receipt_token);
end $$;
revoke all on function public.confirm_payment_system(uuid, text) from public, anon, authenticated;
-- Deliberately no grant to authenticated/anon — service-role only (the cron
-- route uses lib/supabase/admin.ts, which bypasses grants as service_role).
