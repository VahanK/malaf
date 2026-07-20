-- 006 · auto-create the profiles row on auth.users insert.
-- Session 1's client-side "insert profile after signUp()" approach fails RLS
-- whenever email confirmation is required (no session exists yet at that point).
-- A trigger on auth.users is the correct place for this — it runs with definer
-- privileges regardless of session state, and "ensure the 1:1 row exists" is
-- bookkeeping, not workflow, so it stays consistent with portability rule 1.

create or replace function public.handle_new_user()
returns trigger
language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''))
  on conflict (id) do nothing;
  return new;
end $$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
