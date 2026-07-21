-- 016 · real bug found in testing: gen_random_bytes() lives in the
-- "extensions" schema (pgcrypto), but confirm_payment / convert_quote_to_invoice
-- / mint_document_token all set search_path = public only — every token mint
-- through these three functions was failing with "function gen_random_bytes
-- does not exist". Fix: include extensions in the search path.

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

  return jsonb_build_object('receipt_id', receipt_id, 'receipt_token', receipt_token);
end $$;

create or replace function public.convert_quote_to_invoice(p_document_id uuid, p_due_at timestamptz default null)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
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

create or replace function public.mint_document_token(p_document_id uuid, p_scope text)
returns text
language plpgsql security definer set search_path = public, extensions as $$
declare
  doc record;
  new_token text;
begin
  select * into doc from documents where id = p_document_id;
  if not found or doc.profile_id != auth.uid() then return null; end if;
  if p_scope not in ('quote','invoice','receipt','pay') then return null; end if;

  new_token := replace(replace(replace(encode(gen_random_bytes(16), 'base64'), '/', '_'), '+', '-'), '=', '');
  insert into access_tokens (profile_id, token, scope, subject_id)
  values (doc.profile_id, new_token, p_scope, p_document_id);

  return new_token;
end $$;
