# CLAUDE.md — Malaf (working name) · Khedme refit
### Plan of record. Read fully before any work. Decisions here outrank in-session ideas.

## What this project is

A **single-player freelancer front-office** for Lebanon (English-first UI, full Arabic supported — see Language policy below), refitted from the Khedme marketplace codebase. One freelancer + their own clients. It is explicitly **NOT a marketplace** — no bidding, no browsing projects, no two sides, no platform escrow. The marketplace (Khedme proper) is parked as a possible Phase-2 layer on top of an installed base of users. Do not rebuild it.

**The product in one funnel:** QR business card scanned → public page impresses (portfolio) → quote requested → approved → invoiced → politely chased → paid on local rails → receipted. WhatsApp is the transport; this app is the state and the artifacts.

**One-breath pitch:** "صفحة مهنية بثواني، وتحصيل بلا إحراج" — a professional page in seconds, and your money collected without the awkward.

## v1 scope — exactly this, nothing more

0. **Architecture rule — blocks + presets, never per-trade builds:** the portfolio is a block system (6 block types), and each freelancer type is a PRESET (JSON config: block order + pricing unit + prefilled labels). v1 blocks: image grid · before/after pair · stat card (number + label — the quantitative trades' hero: tutors/trainers/SMM) · video-as-link embed (no video uploads in v1) · text case card (title + excerpt — covers writers; PDF upload parked to v1.1) · WhatsApp-style testimonial. Services/pricing is ONE schema: {title, price, unit: project|session|hour|event|day|month, starting_from?, package_qty?, note} — quotes/invoices inherit the unit. Every block must answer a buyer-doubt (work quality / transformation / measurable result / vouching / cost); the page's job is converting viewers into quote requests, not hosting portfolios. New trade later = new preset, zero new code.

1. **Public page** at {domain}/{handle}: services, portfolio blocks (per §0), prices optional, request-a-quote button, save-contact vCard, WhatsApp button. ~~Page footer invites viewers to create their own (viral loop).~~ **REMOVED (vahan, 2026-07-20):** no "make your free card" footer on any page, free or paid — a freelancer whose clients are paying to see a professional page shouldn't have it undercut by a visible upsell banner. The viral-loop growth mechanic this footer was meant to carry is now unfilled — worth deciding a replacement (word-of-mouth, the campus playbook, referral incentive, etc.) before this becomes a real growth gap. Flagged in docs/parking-lot.md.
   **Design brief — "بطاقة, not website" (personal > polished):** the page is an identity card, not a site-builder output. Name huge, face first, accent color derived from their photos. **Voice intro** (20s audio, freelancer's own voice, play button at top) — flagship personal feature, culturally native (voice-note culture), and something no template tool has. Copy templates in dialect (how people talk, not corporate MSA). Testimonials rendered as WhatsApp-screenshot-style cards. Real availability status ("مشغول لآخر الشهر"). "Usually replies in ~Xh" from real data. Aliveness signals (recent work/delivery surfaced). Beautiful Arabic/RTL typography — premium feel via type, not decoration. Bar: must feel more personal than their Instagram, not just better-organized. Positioning of the free tier: "the personal card of Lebanese & Syrian freelancers" (national-identity slot Linktree can't occupy) — but the PAID story remains the money engine, never "a nicer link page."
2. **QR business card:** QR → public page; lockscreen-friendly; printable.
3. **Quotes → invoices → receipts:** bilingual AR/EN documents, link + image versions, one-tap share into WhatsApp.
4. **Approval:** client taps approve on the page OR freelancer taps "approved on WhatsApp" (record state + timestamp either way). Track truth; don't legislate client behavior.
5. **Tier-0 payments:** per-invoice pay page listing the freelancer's own rails — Whish (prefilled deep link/QR where possible), USDT (QR, exact amount, TRC-20 default), IBAN (tap-to-copy), cash. Client taps "I paid" (optional proof upload — reuse Khedme's proof-upload component) → freelancer one-tap confirms → receipt auto-sends, reminders stop.
6. **The money-chaser (headline feature):** polite, bilingual, escalating reminder messages the app WRITES and the freelancer SENDS via wa.me prefilled deep links. One tap. Never automated sending.
7. **Tier-1 (last sprint):** USDT auto-detection — unique reference per invoice, on-chain watcher marks invoice paid automatically + fires receipts.

**Free tier:** public page + 3 documents/month. **Paid ($29/yr founder · ~$4/mo later):** money-chaser, unlimited documents, own branding.

## Hard red lines (never violate, never "just prototype")

- **No custody:** money NEVER touches platform accounts. No escrow, no holding, no disbursing, no aggregation. (BDL money-transmitter cliff. Khedme's manual escrow is deleted, not dormant.)
- **No Meta APIs:** no WhatsApp Cloud API, no Instagram API, no Messenger. wa.me deep links and share sheets only. Nothing Meta can ban.
- **Clients never log in.** Zero-login client pages, always.
- **The ChatGPT test:** any feature whose value is generated text is not a selling point. Value = tracked state + client-facing hosted surfaces + payment collection.
- **No marketplace features:** no project browsing, no bidding, no freelancer discovery, no platform fees on transactions. Revenue = subscriptions only.

## Explicitly parked (do not build, do not suggest as "quick wins")

**Custom domains (paid add-on, v1.1 candidate):** technically cheap on Vercel (domain API + auto-SSL, standard multi-tenant pattern) but low demand in segment (few own domains), moves neither ruling number (CPFree, free→paid), and generates DNS support tickets — the worst support class at this price point. Build when ≥5 PAYING users ask. Also:

Marketplace/directory · client-side accounts · in-app messaging (WhatsApp won) · milestones · team accounts · reviews/ratings · Stripe/PayPal (not available in Lebanon; diaspora payments later via Paddle merchant-of-record for OUR subscription only) · ZATCA compliance claims · Gulf market (v1 kit exists for later) · card checkout integrations (Tier-2, earned at ~100 active freelancers via Whish Pay/OMT partnership).

## Khedme reuse direction (audit confirms specifics)

- **KEEP/REFIT:** auth + roles (collapse to single role: freelancer), freelancer_profiles + portfolio → public page, proposals → quotes (rate/timeline/cover letter fields map), payment-proof upload component → client "I paid" proof, files/storage, notifications, RLS patterns, triggers.
- **DELETE:** escrow system + admin verification/release, client accounts + client_profiles, bidding/proposal-acceptance marketplace flow, conversations/messages (WhatsApp is transport), deliverables/revisions (parked), admin panel beyond basic ops.
- **ADD:** i18n scaffolding — **Language policy:** UI defaults to English (urban Lebanese freelancers present in English); every public page has a one-tap full-Arabic/RTL variant chosen by the freelancer (fully-Arabic freelancers exist — tutors, home services, outside the Beirut bubble); documents (quotes/invoices/receipts) are per-CLIENT language, EN or AR — bilingual documents stay a flagship differentiator. Also add: public page + handle routing, vCard + QR, wa.me composer, document image-rendering for WhatsApp share, USDT watcher, dual-currency display (USD/LBP). **Syria: descoped (July 19)** — Syrian signups accepted passively, nothing built or marketed for Syria; expansion market = Gulf/diaspora (English-first product aligns with it; v1 Gulf kit exists).

## Stack

Next.js + Supabase (Khedme's stack — keep), Vercel deploy. Domain: **malaf.work** (bought; do not bikeshed the TLD — swap/upgrade is cheap later via redirect). RLS discipline as in Khedme/gjstylejewelry. Boring choices win; solo-maintainable at ~5 hrs/week after launch.

**Portability rules (keep the Supabase exit hatch cheap):**
1. Business logic lives in the Next.js app layer (server actions / API routes) — DB triggers only for timestamps/counters, NOT workflow (the jewelry system's trigger-heavy style is fine internally, wrong here).
2. Use the Supabase client as Postgres driver + auth only — no vendor-exclusive features (no Realtime, no exotic extensions) in v1.
3. Every media URL resolves through ONE helper — swapping storage host (e.g. to Cloudflare R2 if egress grows) must be a one-line change. Compress/resize/WebP all uploads at ingest; media (portfolio images + voice notes) is the real cost driver, not the DB.
4. Public pages are ISR/CDN-cached — reads should rarely touch the DB.
**Scale trigger (ignore stack questions until one fires):** Supabase bill > 5% of MRR, or p95 API latency > 500ms.

## Payment rails & Lebanese-feel (added Jul 19)

**Rails are CONFIG, not integrations:** `payment_methods` = rows the freelancer enables (label, details, optional deep-link/QR template). Day-one options: Whish (deep link) · OMT (reference/pickup) · BoB Finance · CashUnited · USDT (QR + watcher) · IBAN (tap-copy, "Fresh USD" flag) · cash. Adding a wallet later = adding a row template, zero code. No wallet API integrations ever in v1 (red lines intact) — the app renders instructions and tracks state.

**Localization details that make it feel Lebanese (cheap, high-signal):** "Fresh USD" label on amounts · dual currency USD/LBP with the FREELANCER setting their own rate (rates are personal here, never auto-only) · +961 phone masks · "areas served" chips for home-service trades (Ashrafieh, Jounieh, Tripoli...) · optional delivery/توصيل line item on invoices · pages light enough for bad 3G (performance IS localization in Lebanon) · seasonal templates on the local calendar (wedding season, Eid, Christmas, Mother's Day = March 21) · dialect microcopy throughout.

## Sequencing & gates (outrank enthusiasm)

- **GATE OVERRIDDEN (vahan, 2026-07-20):** the validation gate below (≥20 conversations + ≥15 paid founder deals before building v1) is explicitly waived by founder decision. v1 build (documents engine, payments ladder, chaser, USDT watcher) is authorized to start now, pre-validation. This was a deliberate, confirmed call — not an accidental scope creep — made mid-session after reviewing brand/ad creative. The risk being knowingly accepted: building the money-collection machinery before confirming anyone will pay for it. Record any consequences (build churn, wasted sprints, pivots) here or in project memory so future sessions have the full picture.
- ~~**Build v1 (3 weekend sprints target):** ONLY after the validation gate passes — ≥20 real conversations AND ≥15 paid founder deals ($29/yr via Whish/USDT). Kit-of-record: phase1-validation-kit-v2.md (Cowork session).~~ (superseded by override above)
- **Post-launch tripwire:** ≥10 founders send a real document to a real client in week one. Watch activation, not signups. (Still the metric to watch — now watched from week one instead of after a validation phase.)
- Weekly four numbers: conversations, founder deals, activation, MRR.

## Context (why these decisions — for the curious agent)

Khedme (95% built, Nov 2025) stalled because: two-sided cold start, custody-heavy manual escrow, English-first for an Arabic market, launch gated on fundraising. v2 removes the network, the custody, and the permission gate. Owner's own design law (from his jewelry ERP schema): "Conversation happens on WhatsApp; the artifact is the app." Full strategy and market rationale live in the Cowork session kit (phase1-validation-kit-v2.md).
