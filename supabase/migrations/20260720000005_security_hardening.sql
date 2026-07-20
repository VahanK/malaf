-- 005 · advisor fixups: pin search_path, close internal functions to RPC, move citext out of public

alter function public.set_updated_at() set search_path = public;

-- internal-only functions: not doors, close them (advisors 0028/0029)
revoke execute on function public.rate_limit_ok(text, int, interval) from public, anon, authenticated;
revoke execute on function public.log_payment_method_change() from public, anon, authenticated;

-- extensions belong in the extensions schema (advisor 0014)
alter extension citext set schema extensions;
