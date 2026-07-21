-- 011 · SECURITY DEFINER functions for the documents engine, mirroring
-- get_public_page / request_quote / resolve_access_token exactly:
-- validate -> resolve -> rate-limit (where anon) -> act -> return, never throw.

-- ---------- get_document_by_token — tokenized read, scope in (quote,invoice,receipt) ----------
create or replace function public.get_document_by_token(p_token text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  t record;
  doc record;
  prof record;
  result jsonb;
begin
  select * into t from access_tokens
   where token = p_token and not revoked
     and (expires_at is null or expires_at > now());
  if not found or t.scope not in ('quote','invoice','receipt') then return null; end if;

  select * into doc from documents where id = t.subject_id;
  if not found then return null; end if;

  select * into prof from profiles where id = doc.profile_id;

  select jsonb_build_object(
    'document', jsonb_build_object(
      'id', doc.id, 'type', doc.type, 'doc_number', doc.doc_number, 'status', doc.status,
      'client_name', doc.client_name, 'language', doc.language, 'currency', doc.currency,
      'line_items', doc.line_items, 'subtotal', doc.subtotal, 'discount', doc.discount,
      'total', doc.total, 'notes', case when doc.language = 'ar' then doc.notes_ar else doc.notes end,
      'due_at', doc.due_at, 'approved_at', doc.approved_at, 'approved_via', doc.approved_via,
      'paid_at', doc.paid_at, 'created_at', doc.created_at
    ),
    'profile', jsonb_build_object(
      'handle', prof.handle, 'full_name', prof.full_name, 'accent_color', prof.accent_color,
      'whatsapp_number', prof.whatsapp_number, 'avatar_url', prof.avatar_url
    ),
    'events', coalesce((
      select jsonb_agg(jsonb_build_object('event', e.event, 'created_at', e.created_at) order by e.created_at)
      from payment_events e
      where e.document_id = doc.id and e.event in ('proof_submitted','confirmed')
    ), '[]'::jsonb)
  ) into result;

  return result;
end $$;
revoke all on function public.get_document_by_token(text) from public;
grant execute on function public.get_document_by_token(text) to anon, authenticated;

-- ---------- get_pay_page_by_token — tokenized read, scope=pay ----------
create or replace function public.get_pay_page_by_token(p_token text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  t record;
  doc record;
  prof record;
  result jsonb;
begin
  select * into t from access_tokens
   where token = p_token and not revoked
     and (expires_at is null or expires_at > now());
  if not found or t.scope != 'pay' then return null; end if;

  select * into doc from documents where id = t.subject_id and type = 'invoice';
  if not found then return null; end if;

  select * into prof from profiles where id = doc.profile_id;

  select jsonb_build_object(
    'document', jsonb_build_object(
      'id', doc.id, 'doc_number', doc.doc_number, 'status', doc.status,
      'client_name', doc.client_name, 'language', doc.language, 'currency', doc.currency,
      'total', doc.total, 'usdt_reference', doc.usdt_reference
    ),
    'profile', jsonb_build_object(
      'handle', prof.handle, 'full_name', prof.full_name, 'accent_color', prof.accent_color
    ),
    'payment_methods', coalesce((
      select jsonb_agg(jsonb_build_object(
        'kind', m.kind, 'label', m.label, 'label_ar', m.label_ar,
        'details', m.details, 'deep_link_template', m.deep_link_template, 'fresh_usd', m.fresh_usd
      ) order by m.sort_order)
      from payment_methods m
      where m.profile_id = doc.profile_id and m.active
    ), '[]'::jsonb)
  ) into result;

  return result;
end $$;
revoke all on function public.get_pay_page_by_token(text) from public;
grant execute on function public.get_pay_page_by_token(text) to anon, authenticated;

-- ---------- approve_document_by_token — anon-callable, rate-limited write ----------
create or replace function public.approve_document_by_token(p_token text, p_bucket text default '')
returns boolean
language plpgsql security definer set search_path = public as $$
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

  return true;
end $$;
revoke all on function public.approve_document_by_token(text, text) from public;
grant execute on function public.approve_document_by_token(text, text) to anon, authenticated;

-- ---------- submit_payment_claim — anon-callable, rate-limited; NEVER marks paid ----------
create or replace function public.submit_payment_claim(p_token text, p_proof_path text default null, p_note text default '', p_bucket text default '')
returns boolean
language plpgsql security definer set search_path = public as $$
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

  return true;
end $$;
revoke all on function public.submit_payment_claim(text, text, text, text) from public;
grant execute on function public.submit_payment_claim(text, text, text, text) to anon, authenticated;

-- ---------- confirm_payment — owner-authenticated, atomically mints the receipt ----------
create or replace function public.confirm_payment(p_document_id uuid)
returns jsonb
language plpgsql security definer set search_path = public as $$
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

  return jsonb_build_object('receipt_id', receipt_id, 'receipt_token', receipt_token);
end $$;
revoke all on function public.confirm_payment(uuid) from public, anon;
grant execute on function public.confirm_payment(uuid) to authenticated;

-- ---------- convert_quote_to_invoice — owner-authenticated ----------
create or replace function public.convert_quote_to_invoice(p_document_id uuid, p_due_at timestamptz default null)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  quote_doc record;
  invoice_id uuid;
  invoice_token text;
  pay_token text;
begin
  select * into quote_doc from documents where id = p_document_id;
  if not found or quote_doc.profile_id != auth.uid() or quote_doc.type != 'quote' or quote_doc.status != 'approved' then
    return null;
  end if;

  insert into documents (
    profile_id, type, parent_document_id, status, client_name, client_phone, client_email,
    language, currency, line_items, subtotal, discount, total, notes, notes_ar, due_at
  ) values (
    quote_doc.profile_id, 'invoice', quote_doc.id, 'draft', quote_doc.client_name, quote_doc.client_phone,
    quote_doc.client_email, quote_doc.language, quote_doc.currency, quote_doc.line_items, quote_doc.subtotal,
    quote_doc.discount, quote_doc.total, quote_doc.notes, quote_doc.notes_ar,
    coalesce(p_due_at, now() + interval '7 days')
  ) returning id into invoice_id;

  invoice_token := replace(replace(replace(encode(gen_random_bytes(16), 'base64'), '/', '_'), '+', '-'), '=', '');
  pay_token := replace(replace(replace(encode(gen_random_bytes(16), 'base64'), '/', '_'), '+', '-'), '=', '');

  insert into access_tokens (profile_id, token, scope, subject_id) values
    (quote_doc.profile_id, invoice_token, 'invoice', invoice_id),
    (quote_doc.profile_id, pay_token, 'pay', invoice_id);

  return jsonb_build_object('invoice_id', invoice_id, 'invoice_token', invoice_token, 'pay_token', pay_token);
end $$;
revoke all on function public.convert_quote_to_invoice(uuid, timestamptz) from public, anon;
grant execute on function public.convert_quote_to_invoice(uuid, timestamptz) to authenticated;

-- ---------- void_document — owner-authenticated, minimal correction path ----------
create or replace function public.void_document(p_document_id uuid, p_reason text default '')
returns boolean
language plpgsql security definer set search_path = public as $$
declare doc record;
begin
  select * into doc from documents where id = p_document_id;
  if not found or doc.profile_id != auth.uid() or doc.status = 'void' then return false; end if;

  update documents set status = 'void', void_at = now(), void_reason = p_reason where id = doc.id;

  insert into payment_events (profile_id, document_id, actor, event, detail)
  values (doc.profile_id, doc.id, 'owner', 'voided', jsonb_build_object('reason', p_reason));

  return true;
end $$;
revoke all on function public.void_document(uuid, text) from public, anon;
grant execute on function public.void_document(uuid, text) to authenticated;
