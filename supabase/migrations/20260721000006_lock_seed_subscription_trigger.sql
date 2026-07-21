-- 023 · seed_free_subscription is trigger-only, same class of bug as
-- handle_new_user/set_document_number (migrations 001, 012) — revoke direct
-- RPC callability, found via get_advisors after migration 022.
revoke execute on function public.seed_free_subscription() from public, anon, authenticated;
