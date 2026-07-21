# MALAF — The Master Plan
### Everything from yesterday, consolidated into one document you can judge.
**For:** Vahan · **Written:** July 19, 2026 · **Companion docs:** `phase1-validation-kit-v2.md` (validation detail) · `AUDIT.md` (build detail) · `CLAUDE.md` (build rules)

---

## 0. How to judge "worth it" — read this first

A document cannot tell you if this is worth it. Documents are hallucination-grade evidence — your words, yesterday. What this document CAN do is show you that the bet is structured so the *market* answers the question in 30 days for almost nothing:

- **Downside, fully realized:** ~30 days of side-project hours, <$300 cash, and a public "no" from a market you'll pitch again with something else. Every asset built (landing, content skill, audience, code) survives and transfers.
- **Upside, base case:** a self-running product at $1–2k MRR within 12 months, owned 100% by you, that doubles as the launchpad (audience + brand + rails) for every bigger swing after it — including Khedme-the-marketplace, properly sequenced this time.
- **The mechanism that decides:** the gates in §8. Not your mood in week 3, not a competitor appearing, not a new idea. If the gates pass, it was worth it. If they fail, it was worth it *cheaply* — you bought the answer for the price of a night out.

"We saw a lot of stuff yesterday and this was just one of them" — correct, and §9 lists the others and why this one won. The rule that makes any of this work: alternatives get re-considered only at a gate failure, never mid-run.

---

## 1. What the product really is

**Malaf (ملف — working name):** a single-player front-office for freelancers in Lebanon and Syria. One freelancer, their own clients. Not a marketplace — no bidding, no browsing, no platform sitting between the two sides, no escrow.

One sentence: **a professional public page that turns into quotes, invoices, polite payment-chasing, and receipts — over WhatsApp and local payment rails.**

The whole product is one funnel, one object:

> QR card scanned → public page impresses (portfolio) → quote requested → approved (tap or "approved on WhatsApp") → invoice sent → chased politely → paid (Whish / OMT / USDT / IBAN / cash) → receipt closes it.

**The three moats** (each one deliberately fails the "couldn't ChatGPT do this?" test):
1. **State over time** — who owes what, since when, what got approved, what got reminded. A chatbot doesn't hold your ledger.
2. **Client-facing hosted surfaces** — the client interacts with a branded page, not with the freelancer's AI subscription. Third-party-facing tools can't be replaced by the buyer's chatbot, structurally.
3. **Local rails literacy** — "mark as paid via Whish," dual currency (USD/LBP, SYP behind a flag), cash tracking. No global tool (Zoho, Bonsai, HoneyBook) will ever build this. Ever.

**What it is NOT (the red lines, from CLAUDE.md):** no money through your accounts (BDL money-transmitter cliff), no Meta APIs (wa.me deep links only — nothing bannable), no client logins ever, no marketplace features, subscription revenue only.

---

## 2. How each end sees it

### The freelancer's side — Rami, wedding photographer, Beirut

**Day 0 (5 minutes):** Signs up → picks "photographer" → gets a prefilled bilingual page: services, sample pricing blocks, portfolio grid. Uploads 8 photos from his phone. His page is live at `malaf.me/rami` with a QR he saves to his lockscreen. Nothing to configure, nothing to learn.

**Daily life:** A bride's mother DMs him on Instagram. Instead of voice-noting prices, he sends his page. She hits "request a quote." He opens Malaf on his phone, taps his "Full wedding package" template, adjusts the amount, taps share — the quote lands in their existing WhatsApp chat as a clean branded card. She opens it (no login), taps approve — or just says "eh tmem," and Rami taps *approved on WhatsApp*. After the wedding, one tap turns the quote into an invoice with his rails on it: Whish number, USDT address, IBAN. Ten days pass, no payment. The part he used to hate: he taps **remind** — the app has already written the polite escalating message in her language — WhatsApp opens prefilled, he hits send. She pays by Whish, taps "I paid," he confirms, receipts fire to both sides automatically.

**What he sees on his dashboard:** three numbers that matter to him — outstanding (who owes, how old), this month collected, page visits. Not analytics theater; his money.

**Why he pays $29/year:** the page made him look like a studio; the chaser saved him the awkward call he'd been postponing for two weeks. He knows exactly which feature he's paying for. And why he *stays*: his last 40 quotes, client list, and payment history live there — leaving means going back to chaos.

### The client's side — Rima, restaurant owner who hired Rami

She never signs up, never downloads anything, never hears the word "Malaf" spoken. Her entire experience: a link in WhatsApp that opens instantly → a clean branded page with the quote → one tap to approve → later, an invoice page with big obvious payment options in her language → she pays how she already pays for everything (Whish) → taps "I paid" → gets a receipt that makes the whole transaction feel official. Her takeaway: *Rami runs a tight operation.* Her second takeaway, in the page footer: *"صمّم صفحتك المهنية مجاناً" — make your own professional page, free.* Rima's cousin is a makeup artist. That footer is the growth engine.

**Both-ends summary:** the freelancer experiences a back office; the client experiences the freelancer's professionalism. The product is invisible to one side and indispensable to the other — which is exactly the shape that spreads.

---

## 3. Marketing — the full machine

**Status note (2026-07-21):** the validation gate below was overridden and v1 is built (see CLAUDE.md's "Sequencing & gates" and `docs/launch-plan.md`'s §0). `docs/launch-plan.md` is now the operative week-by-week sequence for getting from "v1 is built" to campus ignition — it supersedes §10's "This week" list and fills the gap this section's content pillars don't cover (proof/trust mechanics, informed by studying linkishop.com). This section's positioning and content-pillar strategy still stand.

### Positioning
One breath: **"صفحة مهنية بثواني، وتحصيل بلا إحراج"** — a professional page in seconds, and your money collected without the awkward. The headline feature in all marketing is the money-chaser ("مين بيحكي عن المصاري؟ مش أنت"), because it names the deepest cultural pain: chasing your own money feels shameful, and everyone has a story about it. The page/QR/portfolio is the door; the chaser is the hook; the ledger is why they stay.

### Phase A — Validation (days 1–30, budget $0, this is now)
Not marketing — *selling by hand*, on purpose. 20 direct conversations (your 5 names first, then IG DMs to freelancers with active client work), founder deal $29/yr collected via Whish/USDT. The script: show the demo page → "if this were yours, in Arabic, with a QR card, and it chased your money politely — would you pay $29 a year?" → collect the money or collect the objection. Both are gold. Full detail in the kit.

### Phase B — Launch (months 2–3, budget $0, ~6 hrs/week)
Three content pillars, batch-produced on weekends, 3–4 posts/week on TikTok + IG Reels:
1. **The awkward-money skits** (comedy, shareable): a freelancer drafting and deleting "بدي حكيك بخصوص الدفعة..." for the fifth time → cut to the app's clean prefilled reminder. Comedy about shared shame is the most shareable format in Lebanese/Syrian internet culture.
2. **Page glow-ups** (before/after): a real freelancer's messy IG-DM pricing vs their Malaf page. Tag them; they repost — their audience is your audience.
3. **Freelancer money education** (trust): 30-second clips — how to quote, when to ask for a deposit, how to price in dual currency. Positions Malaf as the freelancer's-side brand.

Plus **community seeding** (give value first, product second, in Lebanese freelancer FB/WhatsApp groups and Syrian freelancer Telegram groups — these are large, tight, and nobody markets to them properly) and the **built-in loops** already in the product: every public page footer, every receipt footer, every QR card handed across a table at a wedding.

### Phase C — Compounding (month 4+, budget: small and only if loop math works)
- **Programmatic SEO for free:** every public Malaf page is an indexable page. When someone googles a freelancer's name — which clients do — Malaf ranks. A thousand users = a thousand landing pages you didn't write.
- **Arabic-language SEO:** "كيف تكتب عرض سعر" / "how to invoice as a freelancer in Lebanon" — near-zero competition keywords, evergreen, feeds signups forever.
- **Referral mechanic:** give a month, get a month (cheap at these prices, and freelancers travel in packs).
- **Founder-influencers:** your 15 founders get lifetime pricing; the ones with audiences get free years for honest shoutouts. In a market this small, 10 respected freelancers vouching IS the market.
- **Partnerships:** coworking spaces, bootcamp alumni networks, university career offices, photography/design communities — places freelancers are minted.
- **Paid ads:** only after organic proves the funnel, only as a multiplier on creative that already worked organically, per the loop-math rule (LTV ≥ 3× CAC before scaling spend).

### Syria specifically
Same product, same Arabic, from day one — Syrian signups accepted, USDT-collected, treated as discovery. The formal Syria push (localized content, SYP display, Syrian communities) fires on a written trigger: usable card/payment APIs at scale OR 50 organic Syrian signups. The market is reopening (sanctions repealed, Visa/Mastercard returning) — being the default *before* the rails finish is the asymmetric play, but we don't spend attention there until the trigger.

---

## 4. "The software runs itself" — the honest version

Fully self-running is a myth at 0→50 users and a design goal from 50 onward. Here's the architecture of minimal-you:

**Onboarding runs itself:** profession templates (page + document templates prefilled per trade), demo data, one metric watched — minutes to first sent quote (target <5). If activation needs a human, the onboarding failed; fix the flow, not the user.

**Support runs mostly itself:** searchable AR/EN docs (short, screenshot-heavy) + a docs-trained chatbot in-app + WhatsApp Business quick-reply FAQs. Human support is *batched* — one evening slot daily, 24h SLA stated in-product. At $29/yr price point, users accept async support; what they don't accept is silence, so the SLA is promised and kept. Every support question is logged; three of the same question = a docs page or a UX fix, permanently deleting that ticket type.

**Operations run themselves:** Vercel + Supabase (no servers), Sentry alerts to your phone, uptime monitor, Supabase PITR backups, the USDT watcher as a cron. Monthly cash cost at launch: **~$50–75** (Supabase Pro $25, domain, email ~$10, the rest free tiers). A runbook (one page: what to do when X breaks) means incidents are procedures, not emergencies.

**Features run on a pipeline, not on inspiration:** every request → parking lot → monthly triage → build only clusters (≥5 users asking) → in-app changelog. One big rock per quarter maximum. The roadmap is dictated by paying users' clustered requests — you never invent features in a vacuum again.

**Your hours, honestly (15–20/week):**

| Phase | Selling/Content | Building | Support+Ops | Numbers |
|---|---|---|---|---|
| Validation (now) | 12h | 4h (demo only) | — | 1h |
| Build sprints | 4h | 14h | — | 1h |
| Post-launch steady state | 6h | 6h (features) | 4h | 1h |

What can never be automated: the first 50 customers' trust, your voice in the community, and the weekly look at four numbers. That's the irreducible founder job, and it fits in the table above.

---

## 5. The money — worth-it math

Assumptions: $29/yr founder → blending toward ~$40/yr average (monthly $4 users + later Gulf/diaspora at $12/mo via Paddle). Costs ~$75/mo. All revenue via local rails (Lebanon/Syria) + Paddle (abroad).

| Scenario | Paying users @ m6 | @ m12 | MRR @ m12 | Your profit/mo | Verdict |
|---|---|---|---|---|---|
| **Kill at gate** | 0 | — | — | −$300 total, once | Cheapest "no" in business |
| **Conservative** | 60 | 150 | ~$500 | ~$425 | Real money in Lebanon; keep or sell-ish |
| **Base** | 120 | 400 | ~$1,300 | ~$1,200 | Salary-class side income, Phase-2 trigger in sight |
| **Good** | 250 | 700+ | ~$2,300+ | ~$2,200 | Phase-2 triggered, funded, with an audience |

**The honest comparator (opportunity cost):** your 15–20 hrs/week freelancing at $25–40/hr earns $1,500–3,000/mo *starting next week*, with zero compounding, zero asset, zero option value. Malaf pays worse for 6 months and better after — IF the gates pass — and additionally pays in assets freelancing never does: an audience, a brand, distribution skill, and the installed base that makes Khedme-the-marketplace (Phase 2) possible with liquidity pre-solved. That's the real trade: **wages now vs. equity in your own compounding loop.** You chose "money first, identity later" — this is the rare play that pays both, in that order.

**Not worth it if:** you won't do the 20 conversations (the only untested skill in the plan is you selling), or you'd abandon it at month 4 boredom (Family C — see §7). The math above only exists on the other side of those two behaviors.

---

## 6. Features — v1 and the pipeline after

**v1 (3 weekend sprints, per AUDIT.md — ~30–40% imported from Khedme + the token-portal pattern from gjstylejewelry):** public page + portfolio + handle + vCard/QR · quotes/invoices/receipts, bilingual, image-export for WhatsApp · zero-login client pages · Tier-0 payments (Whish deep link/QR, USDT QR, IBAN copy, cash) with "I paid"+proof → confirm → auto-receipt · the money-chaser (prefilled wa.me, escalating templates) · USDT auto-detection watcher · free tier (page + 3 docs/mo) vs paid.

**v1.1 candidates (build only on clustered demand):** quote revision history (NegotiationTimeline exists in Khedme) · deposit requests ("50% to book") · expense tracking-lite · client list import from phone contacts · PDF export · Gulf/diaspora Paddle checkout.

**Tier-2 (earned at ~100 active users):** Whish Pay / OMT in-flow checkout per freelancer (their merchant identity, your UI) — walk in with aggregated volume; traction is the approval process.

**Phase 2 (parked behind $2k MRR or month 12):** the directory — public pages become a browsable "hire a freelancer" layer, and Khedme's marketplace dream returns on top of an installed base, with the cold-start problem already solved and no custody ever.

---

## 7. How it dies (compressed risk register + tripwires)

- **Family A — market says no:** activation death (signups, no sent documents — watch minutes-to-first-quote and week-1 activation), churn death (>8–10%/mo — counter: annual-first pricing), scale death (CAC rises as cheap audience exhausts — counter: creative refresh, SEO base). Honorable deaths; gates catch them cheap.
- **Family B — infrastructure betrays you:** ad/social account bans (counter: email list + multiple channels from day one), rails friction (counter: multiple payout paths, clean paperwork, Lemon Squeezy as backup MoR for diaspora), incumbent/funded-clone entry (counter: niche depth + local rails they won't build; survives comfortably at $2–5k MRR below their floor).
- **Family C — the founder leaves (highest probability, named without mercy):** month-4 boredom + a shiny new idea. Defenses: gates written down, carousel closed mid-run, Phase 2 parked with a trigger, weekly four-number check-in with me (conversations/deals → later visitors/activation/churn/MRR), and a parking-lot file for every new idea. Boredom is the tax on compounding.

**Legal (settled yesterday):** the business is legal at every layer — building/selling from Lebanon, MoR for foreign payments, local rails for local revenue, no custody. One obligation triggers with real revenue: MOF self-employed registration + an accountant (one meeting, cheap). Syria: sanctions repealed, serve users lawfully via local rails; re-verify platform policies at the formal push.

---

## 8. The gates (the actual worth-it detector)

- **Now → day 30:** ≥20 real conversations AND ≥15 paid founder deals ($29 via Whish/USDT). **GO** → build v1 (3 sprints). **5–14 deals** → one repositioning iteration, 2 weeks, re-judge. **<5** → refund everyone, write down what the market said, keep the assets, pick the next candidate from §9 with the same machine.
- **Post-launch tripwire:** ≥10 founders send a real document to a real client in week 1. Activation, not signups.
- **Loop gate (month 4–6):** $1 of any paid channel returns ≥$3 LTV before scaling spend.
- **Phase-2 trigger:** $2k MRR or month 12, whichever first.

---

## 9. What else we saw, and why this won

Yesterday's tour, for the record — each with the reason it lost *for now*, not forever: **jewelry vertical SaaS** (your strongest asset, vetoed as "not mine" — remains the best fallback and the source of the token-portal pattern) · **Gulf-first freelancer tool** (demand-rich but you're a stranger there; parked as the expansion market, kit written) · **NGO data systems** (real budgets, public RFPs — failed your four-blanks test: zero witnessed instances; revisit only with an insider contact) · **3D printing** (hardware veto; the test protocol survives it) · **WhatsApp SMB automation** (Meta-API veto — correct, from experience) · **freelance marketplace/Khedme** (structurally unlaunchable solo: cold start + custody; resequenced as Phase 2 on top of Malaf) · **autonomous AI money agents** (the video's money was the video; the real lesson — AI as a solo builder's force multiplier — is embedded in every part of this plan).

Malaf won because it's the only candidate that passes *every* filter you set: yours, clean, no hardware, no Meta, no custody, no cold start, testable for ~$0, income-bearing in weeks, native moat, and a straight line to both of your ambitions — quiet money now, visible brand later.

---

## 10. This week (nothing else)

1. The **five names** (still owed from yesterday).
2. One evening: restyle the Khedme public profile page into the **demo** (AUDIT.md §Demo shortlist).
3. Landing live with the $29 founder deal payable via Whish/USDT.
4. First 5 conversations booked.
5. Report back with the first of the weekly four numbers.

The document ends here on purpose. Everything after this line is conversations, not planning.
