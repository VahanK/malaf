-- 007 · handle_new_user is a trigger fn only, never a public RPC door.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
