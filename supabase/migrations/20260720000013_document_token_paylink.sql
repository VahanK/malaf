-- 013 · get_document_by_token now also returns the sibling pay token for
-- invoices, so /i/[token] can link to /p/[token] without ever touching
-- access_tokens directly from app code (it has RLS enabled with zero
-- policies — this function is the only door, per SECURITY.md A1).

create or replace function public.get_document_by_token(p_token text)
returns jsonb
language plpgsql security definer set search_path = public as $$
declare
  t record;
  doc record;
  prof record;
  pay_token text;
  result jsonb;
begin
  select * into t from access_tokens
   where token = p_token and not revoked
     and (expires_at is null or expires_at > now());
  if not found or t.scope not in ('quote','invoice','receipt') then return null; end if;

  select * into doc from documents where id = t.subject_id;
  if not found then return null; end if;

  select * into prof from profiles where id = doc.profile_id;

  if doc.type = 'invoice' and doc.status != 'paid' then
    select token into pay_token from access_tokens
     where subject_id = doc.id and scope = 'pay' and not revoked
     limit 1;
  end if;

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
    'pay_token', pay_token,
    'events', coalesce((
      select jsonb_agg(jsonb_build_object('event', e.event, 'created_at', e.created_at) order by e.created_at)
      from payment_events e
      where e.document_id = doc.id and e.event in ('proof_submitted','confirmed')
    ), '[]'::jsonb)
  ) into result;

  return result;
end $$;
