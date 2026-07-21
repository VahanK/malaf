-- 024 · Services without a fixed price (founder feedback, Jul 21):
-- price NULL = "quote on request / let's talk". The card renders it as a
-- conversation-starter chip instead of a number — an unpriced service is
-- exactly what the quote-request funnel exists for.
alter table public.services alter column price drop not null;
