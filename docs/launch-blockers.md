# Launch Blockers — WorkWith (work-withme.com)
### Verified state as of 2026-07-23 (post farm-dots pivot + builder/motion work). Ordered: top matters first.

## One-sentence situation
Under the **farm-dots pivot** (free live pages, monetize later), the product is a **beautiful free page builder** — no paywall, no payment machinery needed to launch. All code is on GitHub `main`, typechecks clean, `next build` green. **The only thing between here and live is DEPLOYMENT** (Vercel build + domain), which only you can do.

---

## BLOCKER 1 — Deploy the latest code to Vercel  ⚠️ the real launch step
The Vercel `malaf` project must build the current `main`. The MCP connector can't see this project, so **you** do it:
1. Vercel dashboard → `malaf` project → **Settings → Git**. Ensure `VahanK/malaf`, production branch = `main`.
2. **Deployments → Redeploy** (or push any commit) and confirm a NEW build runs on the latest commit.
3. **Verify:** `https://malaf.vercel.app/layla` returns 200 and shows Layla's page with the new bold section headings, nav, motion variants.
4. **Env vars** (Settings → Environment Variables) must include: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL=https://work-withme.com`. (Payment env vars `CRON_SECRET`/`TRONGRID_API_KEY` are Phase-2 — not needed for the free-page launch.)

## BLOCKER 2 — Point the domain at Vercel
work-withme.com is still a GoDaddy parking page. You:
1. Vercel `malaf` → **Settings → Domains → Add** `work-withme.com` + `www.work-withme.com`.
2. At **GoDaddy → DNS**: apex A → `76.76.21.21`; `www` CNAME → `cname.vercel-dns.com` (use exactly what Vercel shows). Delete parking records. Paste them to me to sanity-check first.
3. Wait for propagation + auto-SSL. **Verify:** `https://work-withme.com/layla` → 200.
> Do Blocker 1 first, or the domain will show the old build.

## Config to confirm (you)
- Supabase **SMTP provider** (Resend/Postmark/SES) — the built-in sender is rate-capped; a signup burst will silently drop emails without it.
- Supabase project is on the shared gjstyle account (per memory) — fine for launch, know it's there.

---

## NOT blockers — already done (code side is launch-ready)
- **Free publishing** — paywall dropped (farm-dots); every freelancer goes live free.
- **Homepage** — leads builder-first ("Run your freelance business"), payments demoted.
- **Signup error handling** — surfaces rate-limit / existing-account / silent-repeat instead of false "check your email."
- **Arabic/RTL** on public pages; **viral footer**; **/discover** directory.
- **The builder** — inline text edit, image upload (compress + progress + crop-when-needed), swap picker with previews, drag-reorder galleries, editable section titles, whole-page palette + shuffle, nav bone + 6 variants, 22 pickable motion variants, bold section headings.
- All migrations applied to live Supabase; tsc clean; `next build` green (26/26).

## DEFERRED to Phase-2 (farm-dots — NOT launch work)
Payment verification, Whish Collect, USDT watcher block-cursor, receipt auto-delivery, the money-chaser, document image-share hardening. These monetize an installed base later; they are not needed to launch free pages.

## Launch-day smoke test (against work-withme.com once Blockers 1–2 clear)
1. `/` loads (builder-first homepage). 2. Sign up new account → email → confirm → onboarding. 3. Land in dashboard, build a page in the inline builder. 4. `/{handle}` shows the live page. 5. `/discover` lists it.
