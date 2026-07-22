# Launch Blockers — work-withme.com must show the real app
### Verified state as of 2026-07-22. Ordered: nothing below this line matters until the ones above it are done.

## The one-sentence situation
All the code is safe on GitHub (`VahanK/malaf`, up to date), but **work-withme.com shows a GoDaddy "Launching Soon" parking page**, and even the Vercel project itself (`malaf.vercel.app`) is serving a **stale build from before this week's work**. Two connections are broken: domain→Vercel, and Vercel→(latest GitHub). Fix those two and the real app appears.

---

## BLOCKER 1 — Vercel is not building the latest code  ⚠️ highest priority
**Evidence:** `malaf.vercel.app` returns 200, but `malaf.vercel.app/laylafares` → 404. That page (and the 3 layouts, presets, live-preview editor, payment-rails onboarding) all exist on GitHub `main` at commit `e774792`. So the live Vercel build predates them.

**Likely cause:** the Vercel `malaf` project isn't connected to the GitHub repo, or is connected to the wrong branch, so `git push` doesn't trigger a deploy.

**You must do (I can't — the Vercel MCP connector can't see this project):**
1. Vercel dashboard → `malaf` project → **Settings → Git**.
2. If no repo is connected: **Connect Git Repository** → `VahanK/malaf`, production branch = `main`.
3. If already connected: check the production branch is `main`, then **Deployments → Redeploy** (or push any commit) and confirm a *new* build runs.
4. **Verify success:** after the build, `https://malaf.vercel.app/laylafares` must return 200 and show Layla's dark editorial page. If it does, Blocker 1 is cleared.

---

## BLOCKER 2 — Domain is parked, not pointed at Vercel
**Evidence:** work-withme.com resolves to `76.223.105.230` / `13.248.243.5` (GoDaddy/AWS parking). Vercel apex is `76.76.21.21`. The "how you get paid / Launching Soon" page you saw is GoDaddy's placeholder, NOT the app.

**You must do:**
1. Vercel `malaf` project → **Settings → Domains → Add** `work-withme.com` (and `www.work-withme.com`).
2. Vercel shows the exact DNS records. Typically:
   - apex `work-withme.com` → **A record** → `76.76.21.21`
   - `www` → **CNAME** → `cname.vercel-dns.com`
3. At **GoDaddy → DNS management** for work-withme.com: delete the existing parking A-record(s), add Vercel's records exactly as shown.
4. **Paste those records to me and I'll sanity-check them before you save.**
5. Wait for DNS propagation (minutes to a couple hours) + Vercel's auto-SSL to issue.
6. **Verify:** `https://work-withme.com/laylafares` returns 200 and shows the app. Domain done.

> Do Blocker 1 first. If you connect the domain while Vercel is still serving the stale build, work-withme.com will just show the *old* app — which looks like "it didn't work."

---

## BLOCKER 3 — Signup silently fails under load (real, will bite on launch day)
**Evidence (this session):** rapid signups hit Supabase's default auth/email rate limit; the signup form still showed "check your email" as if it succeeded. On launch, a burst of real signups → some silently fail, users think they signed up but got no email.

**You must do:**
1. Supabase → Auth → **set up a real SMTP provider** (Resend/Postmark/SES) — the built-in email sender is rate-capped and not for production traffic.
2. **I should fix:** the signup form's false-success — it must surface the actual error instead of always showing "check your email." (Flag me to do this; ~20 min.)

---

## BLOCKER 4 — Homepage still leads with the OLD positioning
**Evidence:** homepage copy is "the price and the proof / quote requests straight to WhatsApp" — the payments-first framing you moved AWAY from when you chose builder-first (parking-lot, Jul 22).

**I fix this** (code, ready when you want it): rewrite the hero to lead with "make your professional page in minutes," demote payments/chaser to a supporting section (it's the paid upgrade, not the lead). ~20 min + verify.

---

## Config to confirm before launch (fast checks, mostly you)
- **Env vars on Vercel** (Settings → Environment Variables) must include: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_SITE_URL=https://work-withme.com`, `CRON_SECRET`, `TRONGRID_API_KEY`. (`.env.local` has them for dev; Vercel needs its own copy.)
- **Concierge + notification WhatsApp number** is a placeholder (`+96176112233`) hardcoded in two files. Swap for your real number — worth making an env var (flag me).
- **Supabase project** is currently on the shared gjstyle account (per memory) — fine for launch, but know it's there.
- **USDT watcher cron** (`vercel.json`) fires `/api/cron/usdt-watch` every 5 min — only works once `CRON_SECRET` is set on Vercel.

---

## What is NOT a blocker (already done / safe)
- All app code is on GitHub `main`, up to date, typechecks clean.
- DB schema/migrations are applied to the live Supabase project.
- The 3 website layouts, 10 presets, live-preview builder, payment-rails onboarding all work locally and are committed.

## Launch-day smoke test (run against work-withme.com once Blockers 1–2 clear)
1. `/` loads with the right (builder-first) homepage.
2. Sign up a brand-new account → email arrives → confirm → land in onboarding.
3. Complete all 4 onboarding steps incl. payment rails → dashboard.
4. `/{yourhandle}` shows your live page.
5. Send yourself a test quote → approve → invoice → pay page shows your rails.
