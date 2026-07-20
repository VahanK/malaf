# Khedme → Malaf v1 Reuse Audit
**Audited:** VahanK/khedme @ main (shallow clone, July 18 2026) · 132 TS/TSX files · Next 16 / React 19 / Tailwind 4 / HeroUI / Supabase SSR

## Verdict up front: GREENFIELD REPO + SELECTIVE IMPORT — not refit-in-place

Three reasons, found in the code:

1. **v1's core object model doesn't exist in Khedme.** Malaf's "client" is a *contact* + zero-login tokenized links (quote/invoice/pay pages). Khedme's client is an *authenticated user* with a dashboard — client accounts, role-split routing (`dashboard/client/*` vs `dashboard/freelancer/*`), and dual-profile tables run through ~30 routes and most RLS policies. Deleting the client half safely costs more evenings than not importing it.
2. **Escrow is woven into the spine, not bolted on.** `projects` carries `escrow_status`, `payment_status`, `payment_received_at`; escrow columns are referenced by API routes, the payment callback, EscrowPanel, triggers, and a test-mode auto-fund migration. v1 has no projects table at all (documents + contacts instead), so the entanglement dies with the table — in a fresh repo, for free.
3. **Arabic/RTL-first touches every screen anyway.** Khedme is English-only with no i18n scaffolding. Since every imported surface gets reworked for AR/RTL, importing *components* into a clean AR-first shell beats retrofitting direction-sensitive layout into 20 existing pages.

**Honest reuse estimate: ~30–40% effort saving** (I said 40–60% before seeing the code — correcting that). The saving is real but it's in components, patterns, and muscle memory — not in architecture.

**Note:** the closest architectural ancestor for v1's client side is actually **gjstylejewelry**, not Khedme — its token-based client portal (RLS with no policies + SECURITY DEFINER session functions) is exactly the zero-login pattern Malaf's client pages need. Port that pattern from the jewelry repo.

## IMPORT AS-IS (small adaptations)

| Asset | From | To |
|---|---|---|
| Supabase SSR auth setup, middleware, session handling | `lib/supabase`, `middleware.ts` | identical, minus role-select step |
| `freelancer_profiles` schema shape + RLS + GIN skills index | `002_marketplace_schema.sql` | `profiles` (single role — drop client/admin split) |
| FileUpload + avatar upload route + storage patterns, MIME allowlist, size caps | `components/FileUpload.tsx`, `api/upload/*` | portfolio uploads, proof uploads |
| **PaymentProofUploader** (239 lines) | `components/escrow/` | client "I paid" proof on pay pages — the admin-verify step becomes freelancer-confirm |
| Notifications system (tables, triggers, bell, unread count) | `006_notifications_system.sql`, `components/notifications` | as-is, fewer event types |
| UI kit (10 components), Tailwind 4 + HeroUI config | `components/ui` | as-is; add RTL variants |
| ProfileEditForm (347 lines) | `components/freelancer` | profile editor, AR-first labels |
| Public profile page (251 lines) | `app/freelancer/[id]` | seed of the malaf public page — strip rating/availability/hire framing, add handle routing, vCard, QR, quote CTA |

## FIELD-MAP REFIT (schema concept survives, table is new)

- `proposals` → **quotes**: `proposed_budget`→amount, `estimated_duration`→timeline, `cover_letter`→scope notes, status enum pending/accepted→sent/approved(+"approved on WhatsApp"). Marketplace constraint (`UNIQUE(project_id, freelancer_id)`) dropped; quotes attach to *contacts*.
- `escrow_transactions` audit-trail pattern → **payment_events** on invoices (submitted proof / confirmed / reminded), same append-only discipline.
- NegotiationTimeline component → quote revision history (parked for v1.1, keep the file).

## DO NOT IMPORT

Client accounts + `client_profiles` + all `dashboard/client/*` and `api/client/*` · escrow custody flow (verify/release admin routes, EscrowPanel, payment callback with `session_id` — the hosted-checkout experiment dies with it) · projects table + bidding + browse · conversations/messages (2 tables, 5 policies, trigger — WhatsApp is transport) · deliverables/revisions (parked) · reviews + rating triggers (parked; marketplace-era) · seed_freelancers.sql · admin escrow dashboard.

## GAPS (build new — nothing in Khedme covers these)

| Gap | Est. |
|---|---|
| **Portfolio items** — Khedme has only `portfolio_url TEXT`; the README overstates. Needs table + grid + upload flow (reuses FileUpload) | 2 evenings |
| Handle routing (`/{handle}`), vCard generation, QR (lockscreen + print) | 2 evenings |
| Quote/invoice/receipt documents: bilingual AR/EN render + **image export for WhatsApp share** | 3–4 evenings |
| Zero-login tokenized client pages (port gjstylejewelry token pattern) | 2–3 evenings |
| Tier-0 pay page: rails display, Whish deep link/QR, USDT QR, IBAN copy, "I paid" → confirm → receipt | 2–3 evenings |
| wa.me composer + polite escalating reminder templates (AR/EN) | 1–2 evenings |
| AR/RTL i18n scaffolding + Arabic-first UI pass | 3 evenings |
| Dual currency display (USD/LBP; SYP behind flag) | 1 evening |
| USDT watcher (unique ref per invoice, chain polling, auto-mark-paid) | 2–3 evenings |

## Revised build plan (unchanged from kit: 3 weekend sprints, now with slack)

- **Sprint 1:** greenfield repo, auth import, profiles, handle routing, public page + portfolio + vCard/QR
- **Sprint 2:** quotes/invoices/receipts + image export + tokenized client pages + Tier-0 payments
- **Sprint 3:** money-chaser (wa.me), notifications, AR polish, USDT watcher, deploy

## Demo shortlist (allowed pre-gate, per CLAUDE.md)

1. One evening: restyle `app/freelancer/[id]/page.tsx` for ONE profile — Arabic strings hardcoded, malaf branding, portfolio images inline — screenshot/screen-record as conversation demo material.
2. Optional half-evening: mock quote + pay page as static screens for the same demo reel.

**Reminder that outranks this whole document:** none of this is evidence. The build is gated on 20 conversations and 15 founder deals. This audit's only job was to price the build honestly — it came out cheaper, not validated.
