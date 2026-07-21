-- 021 · USDT reference generation (Sprint 3 Task 24, plan §0). TRC-20 has no
-- universal memo field, so exact-amount matching is the mechanism: a 2-digit
-- reference (00-99) is generated at invoice-creation time and added as cents
-- to the requested amount (e.g. $50 invoice -> pay exactly $50.07). This is
-- the coarsest precision a human can actually type into a wallet app by hand,
-- so it stays usable for manual sends, not just the watcher.
--
-- Collision handling: uniqueness is scoped to invoices where usdt_reference
-- is still "live" (unpaid, not void) — a reference is freed once its invoice
-- is paid or voided, since the amount-window (see get_pay_page_by_token
-- below) then no longer risks confusion with a new pending invoice.

create or replace function public.generate_usdt_reference(p_profile_id uuid)
returns text
language plpgsql security definer set search_path = public as $$
declare
  candidate text;
  tries int := 0;
begin
  loop
    candidate := lpad((floor(random() * 100))::int::text, 2, '0');
    tries := tries + 1;
    exit when not exists (
      select 1 from documents
      where profile_id = p_profile_id and type = 'invoice'
        and usdt_reference = candidate and status not in ('paid', 'void')
    ) or tries > 50;
  end loop;
  return candidate;
end $$;
revoke all on function public.generate_usdt_reference(uuid) from public, anon, authenticated;

-- convert_quote_to_invoice now stamps usdt_reference on every new invoice
-- (cheap — only used if the freelancer has a usdt payment_methods row active;
-- unused references are harmless).
create or replace function public.convert_quote_to_invoice(p_document_id uuid, p_due_at timestamptz default null)
returns jsonb
language plpgsql security definer set search_path = public, extensions as $$
declare
  quote_doc record;
  invoice_id uuid;
  invoice_token text;
  pay_token text;
  ref text;
begin
  select * into quote_doc from documents where id = p_document_id;
  if not found or quote_doc.profile_id != auth.uid() or quote_doc.type != 'quote' or quote_doc.status != 'approved' then
    return null;
  end if;

  ref := generate_usdt_reference(quote_doc.profile_id);

  insert into documents (
    profile_id, type, parent_document_id, status, client_name, client_phone, client_email,
    language, currency, line_items, subtotal, discount, total, notes, notes_ar, due_at, usdt_reference
  ) values (
    quote_doc.profile_id, 'invoice', quote_doc.id, 'draft', quote_doc.client_name, quote_doc.client_phone,
    quote_doc.client_email, quote_doc.language, quote_doc.currency, quote_doc.line_items, quote_doc.subtotal,
    quote_doc.discount, quote_doc.total, quote_doc.notes, quote_doc.notes_ar,
    coalesce(p_due_at, now() + interval '7 days'), ref
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

-- get_pay_page_by_token: expose the USDT-adjusted amount + the freelancer's
-- own usdt address (from payment_methods.details) so the pay page can render
-- the exact amount to send and the watcher's matching target lines up.
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
      'total', doc.total, 'usdt_reference', doc.usdt_reference,
      'usdt_amount', case when doc.usdt_reference is not null
        then doc.total + (doc.usdt_reference::numeric / 100) else null end
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
