-- 008 · phone-based signups: prefill whatsapp_number from the verified phone,
-- since that's the same number the freelancer will use with clients anyway.

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name, whatsapp_number)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', ''),
    new.phone  -- null for email signups, the verified E.164 number for phone signups
  )
  on conflict (id) do nothing;
  return new;
end $$;
