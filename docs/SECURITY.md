# SECURITY.md — Malaf security & engineering best practices
### Read alongside CLAUDE.md. Applies to every session. Review this checklist at the end of each sprint.

## A. Ported from gjstylejewelry (proven patterns — reuse, don't reinvent)

1. **Zero-login access = SECURITY DEFINER only:** sensitive tables (client page tokens, payment events) get RLS enabled with NO policies; the ONLY door is SECURITY DEFINER functions (gjstyle's client_sessions pattern, migration 026 style). Direct anon/authenticated access must be impossible.
2. **Rate-limit ledger:** gjstyle's login_attempts pattern, applied to: signups, quote requests, "I paid" claims, voice/file uploads. DB-ledger throttle is enough at this scale; move to edge middleware if abuse grows.
3. **Append-only event logs:** audit_log / payment_events style — every state change (quote sent, approved, paid-claimed, confirmed, reminded) is an immutable row. This is also the dispute-resolution system.
4. **RLS on every table, no exceptions** — freelancers see only their own rows; verified in tests, not assumed.

## B. New for Malaf's threat model (public product, anonymous traffic, money adjacency)

1. **Tokens for zero-login pages:** unguessable IDs only (nanoid 21+ / 128-bit), scoped per document, revocable by the freelancer, regenerable. Never expose sequential/DB ids in URLs.
2. **Impersonation & phishing (the big one):** reserved-handle blocklist at signup (whish, omt, bob, malaf, admin, support, bank names, ministries); a report button on every public page; manual review queue; new accounts' pages noindex until profile is complete. A fake "support" page collecting payments is the nightmare scenario — make it hard on day one.
3. **"I paid" is untrusted input:** a claim NEVER auto-marks paid. Paths to paid: freelancer confirm (manual) or USDT watcher (on-chain, ≥19 TRC-20 confirmations, exact amount + per-invoice reference match). Proof images are untrusted files like any other.
4. **Payment-details changes are the crown jewels:** changing IBAN/wallet/Whish number requires password re-entry, fires an email notification, and lands in the audit log. Masked display in UI. (Account takeover → swap payout details → intercept client payments = the worst possible incident.)
5. **Uploads:** MIME allowlist (from Khedme) + size caps + **re-encode every image at ingest** (kills embedded payloads AND does the WebP/resize compression in one step) + strip EXIF (portfolio photos carry GPS — privacy leak) + no SVG uploads (XSS vector). Voice notes: transcode to a fixed format, cap 60s.
6. **API hygiene:** zod-validate every input at the boundary; service-role key server-only, NEVER in client bundles (the classic Supabase kill-shot — grep the build output once per sprint); all secrets in env, none in repo.
7. **Headers:** CSP (no unsafe-inline where avoidable), X-Frame-Options on dashboard routes (public pages may allow embedding — decide explicitly), HSTS via Vercel.
8. **Auth:** Supabase auth, email verification required before page goes public, sane password minimums. 2FA → parking lot (build at first paying-user request or first incident).
9. **Privacy posture:** clients never have accounts but their names/numbers live in freelancers' books — that's PII you host. Minimal collection, deletion on request, PITR backups, and a simple export-my-data path (v1.1). No analytics scripts on client-facing pages beyond first-party counts.

## C. Performance & scaling (extends CLAUDE.md portability rules)

1. Public pages: ISR + stale-while-revalidate; budget **<100KB JS, LCP <2.5s on throttled 3G** — "performance is localization" is a hard budget, tested in CI, not a vibe.
2. Images: next/image + ingest-time resize; media behind the one-URL-helper (R2 swap stays one line).
3. DB: indexes on handle, document token, freelancer_id FKs from migration 001; use Supabase's connection pooler for serverless routes; no N+1 (joined selects, verified in review).
4. Typed everything: `supabase gen types` in CI; drift fails the build.
5. Load-test the public page route once before launch (simple k6, 100 rps for 5 min) — cheap insurance before ads send strangers.

## D. Process rules

- Migrations only for schema (never dashboard-clicked) — migrations are the undo button.
- Staging = Vercel preview + Supabase branch DB; nothing merges untested.
- Sentry on day one; error spike = stop features, fix first.
- Dependency updates: npm audit in CI + monthly renovate pass.
- **Drills before launch:** one Vercel rollback, one PITR restore, one token-revocation. Incidents should be rehearsed procedures (see docs/OPERATING-MANUAL.md runbook), not first-time experiences.
- End of every sprint: walk this file top to bottom, check what the sprint touched.
