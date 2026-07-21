-- 029 · reserve the new brand handle after the Malaf -> WorkWith rebrand
-- (2026-07-22, work-withme.com). 'malaf' stays reserved too, so nobody
-- squats on the old name.
insert into public.reserved_handles (handle) values ('workwith') on conflict (handle) do nothing;
