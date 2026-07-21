-- 019 · Wire notification inserts into the existing event-recording functions.
-- One extra insert per function, same transaction as the event it announces —
-- no new trigger, per the app-layer-logic portability rule.

create or replace function public.approve_document_by_token(p_token text, p_bucket text default '')
returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare t record; doc record;
begin
  select * into t from access_tokens
   where token = p_token and not revoked
     and (expires_at is null or expires_at > now());
  if not found or t.scope != 'quote' then return false; end if;

  if not rate_limit_ok('approve:' || p_token, 10, interval '1 hour') then return false; end if;

  select * into doc from documents where id = t.subject_id and type = 'quote' and status = 'sent';
  if not found then return false; end if;

  update documents set approved_at = now(), approved_via = 'client_tap', status = 'approved'
   where id = doc.id;

  insert into notifications (profile_id, type, document_id, title, message, link)
  values (
    doc.profile_id, 'quote_approved', doc.id,
    'Quote approved',
    doc.client_name || ' approved quote #' || doc.doc_number,
    '/dashboard/quotes/' || doc.id
  );

  return true;
end $$;
revoke all on function public.approve_document_by_token(text, text) from public;
grant execute on function public.approve_document_by_token(text, text) to anon, authenticated;

create or replace function public.submit_payment_claim(p_token text, p_proof_path text default null, p_note text default '', p_bucket text default '')
returns boolean
language plpgsql security definer set search_path = public, extensions as $$
declare t record; doc record;
begin
  select * into t from access_tokens
   where token = p_token and not revoked
     and (expires_at is null or expires_at > now());
  if not found or t.scope != 'pay' then return false; end if;

  if not rate_limit_ok('i_paid:' || p_token, 5, interval '1 hour') then return false; end if;

  select * into doc from documents where id = t.subject_id and type = 'invoice' and status = 'sent';
  if not found then return false; end if;

  -- SECURITY.md B3: a claim NEVER auto-marks paid — only inserts the event.
  insert into payment_events (profile_id, document_id, actor, event, detail)
  values (doc.profile_id, doc.id, 'client', 'proof_submitted',
          jsonb_build_object('proof_path', p_proof_path, 'note', p_note));

  insert into notifications (profile_id, type, document_id, title, message, link)
  values (
    doc.profile_id, 'payment_claimed', doc.id,
    'Client says they paid',
    doc.client_name || ' marked invoice #' || doc.doc_number || ' as paid — confirm to close it out',
    '/dashboard/invoices/' || doc.id
  );

  return true;
end $$;
revoke all on function public.submit_payment_claim(text, text, text, text) from public;
grant execute on function public.submit_payment_claim(text, text, text, text) to anon, authenticated;

create or replace function public.confirm_payment(p_document_id uuid)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  doc record;
  receipt_id uuid;
  receipt_token text;
begin
  select * into doc from documents where id = p_document_id;
  if not found or doc.profile_id != auth.uid() or doc.type != 'invoice' or doc.status not in ('sent','approved') then
    return null;
  end if;

  update documents set paid_at = now(), paid_via = 'freelancer_confirm', status = 'paid'
   where id = doc.id;

  insert into payment_events (profile_id, document_id, actor, event)
  values (doc.profile_id, doc.id, 'owner', 'confirmed');

  insert into documents (
    profile_id, type, parent_document_id, status, client_name, client_phone, client_email,
    language, currency, line_items, subtotal, discount, total, notes, notes_ar, paid_at, paid_via
  ) values (
    doc.profile_id, 'receipt', doc.id, 'paid', doc.client_name, doc.client_phone, doc.client_email,
    doc.language, doc.currency, doc.line_items, doc.subtotal, doc.discount, doc.total, doc.notes, doc.notes_ar,
    now(), 'freelancer_confirm'
  ) returning id into receipt_id;

  receipt_token := encode(gen_random_bytes(16), 'base64');
  receipt_token := replace(replace(replace(receipt_token, '/', '_'), '+', '-'), '=', '');
  insert into access_tokens (profile_id, token, scope, subject_id)
  values (doc.profile_id, receipt_token, 'receipt', receipt_id);

  -- Owner's own action confirming payment — no notification (they already
  -- know); this path only announces payment_confirmed when the USDT watcher
  -- (system actor) does it instead, see confirm_payment_from_watcher below.

  return jsonb_build_object('receipt_id', receipt_id, 'receipt_token', receipt_token);
end $$;
revoke all on function public.confirm_payment(uuid) from public, anon;
grant execute on function public.confirm_payment(uuid) to authenticated;
