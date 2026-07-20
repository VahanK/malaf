# First Claude Code session in this folder — paste this

Read CLAUDE.md fully first — it is the plan of record; its red lines and scope rules outrank anything we come up with mid-session. Then read docs/khedme-reuse-audit.md (the reuse audit is already done — verdict: greenfield here, selective import from the khedme repo).

## Session 1 task: scaffold + the demo slice

1. **Scaffold the greenfield app** per CLAUDE.md: Next.js + Supabase + Tailwind, git init, Vercel-ready. Set up the schema foundations: profiles (single role), services (the one pricing schema with units), portfolio blocks (block-system architecture per CLAUDE.md §0), and the token-based zero-login client page pattern (port the concept from gjstylejewelry per the audit — RLS enabled, no policies, SECURITY DEFINER access functions).
2. **Import from Khedme** (public repo: github.com/VahanK/khedme — clone it adjacent, copy in, adapt): Supabase SSR auth setup + middleware, FileUpload + storage patterns + MIME allowlist, notifications system, UI kit, ProfileEditForm as the base of profile editing. Per the audit's DO-NOT-IMPORT list: no client accounts, no escrow, no messaging, no marketplace anything.
3. **Build the demo slice — one complete, beautiful example page:** malaf.work/rami with realistic content (photographer preset: image grid, before/after, testimonial, services with per-event pricing, voice-intro player, vCard + QR, request-a-quote button). Design bar and personal-card brief are in CLAUDE.md §1 — "بطاقة, not website." Reference mock: docs/card-visuals.html. This page is the validation-conversation demo material.
4. Deploy to Vercel, attach malaf.work.

## What is NOT in session 1 (per the gates)

The full v1 build (documents engine, payments ladder, chaser, USDT watcher) is gated on validation — 15 paid founder deals (see docs/validation-kit-lebanon.md §6). Session 1 delivers infrastructure + the demo slice that makes those conversations concrete. If we finish early, the next allowed work is the signup → preset → page-live onboarding flow (it converts conversation "yes"es into real pages on the spot) — not the money engine.

## Standing rules for every session in this repo

- CLAUDE.md red lines are absolute: no custody, no Meta APIs, no client logins, no marketplace features, subscriptions only
- Blocks + presets, never per-trade builds (CLAUDE.md §0)
- Portability rules (CLAUDE.md Stack section): logic in app layer, no vendor-exclusive features, media URLs behind one helper, ISR-cache public pages
- Language: English-first UI, one-tap Arabic page variant, per-client document language
- Anything tempting but out of scope → append to docs/parking-lot.md (create it), one line, move on
