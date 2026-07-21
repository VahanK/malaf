Note: this document predates the Malaf → WorkWith rebrand (2026-07-22, work-withme.com). References to "Malaf" below refer to the same product.

# Malaf — Launch Plan
### What happens between "v1 is built" and "campus playbook ignites in September." Written after studying linkishop.com (2026-07-21) — same market, same WhatsApp-native model, already at 400+ stores.

## 0. The gap this fills

`docs/MASTER-PLAN.md` §3 covers content strategy (TikTok/Reels pillars) and `docs/campus-playbook.md` covers the September campus ignition. Neither covers the **weeks in between**, and neither covers **trust/proof mechanics** — the non-feature layer that makes a stranger believe a two-week-old product before they hand it a client relationship. That's what Linki visibly invested in, and it's the actual subject of this doc.

Nothing here overrides `docs/OPERATING-MANUAL.md`'s rhythm or `MASTER-PLAN.md`'s gates. This is what fills the "This week" and following weeks with, once v1 is live at malaf.work.

## 1. What Linki did that isn't a feature (the research)

Studied their live site + one real customer storefront (`linkishop.com/tworootscreative`) on 2026-07-21:

1. **WhatsApp as the sales/support channel, not just the product's transport.** Their homepage CTA is `wa.me` with a prefilled message — no contact form, no email-first support. The company's own funnel matches the product's own mechanic.
2. **"Personal setup help included" as a named, paid-tier line item** ($10/mo Pro), not a support afterthought. Converts hesitant non-technical sellers who'd bounce off pure self-serve.
3. **Real, clickable, named customer stores on the homepage** — not logos or quotes, actual live storefronts with real domains you can visit. Proof over promise, and the cheapest-to-build trust asset available pre-brand-recognition.
4. **One honest, small, plainly-stated metrics bar**: "400+ stores · 2,300+ products · 0% commission." Believable beats impressive when you have no reputation yet.
5. **A footer growth loop** — "Powered by Linki - Start selling" on every free storefront, seen by that seller's own customers.

Malaf already killed (5) deliberately (`CLAUDE.md` §1, 2026-07-20 — a paying freelancer's client shouldn't see an upsell on the page they're being sold on). That decision stands. This plan replaces it with mechanics that don't have that cost, plus adopts (1)–(4), which transfer cleanly.

## 2. Sequence — four phases, roughly 1 week each before campus (September)

### Phase 0 — Founder proof (this week, before anyone else touches it)

Goal: **you** are customer #1, twice over, before asking anyone else to trust it.

- [ ] Deploy malaf.work for real (task #7, already in progress) — DNS fixed, real TLS, no placeholder.
- [ ] Build your own real Malaf page (or a friend's, with permission) — real portfolio, real services, real payment rails wired to a real Whish/USDT/IBAN you control.
- [ ] Send one real quote → invoice → payment through the full funnel with an actual small real transaction (even $5, even to yourself from a second number). This is the same instinct as Linki showing real domains: if it isn't real yet, you can't ask anyone else to make it real first.
- [ ] Take the screenshots you'll need for everything below (public card, quote on WhatsApp, invoice, pay page, receipt) while the product is genuinely in daily use, not staged.

**Gate to leave Phase 0:** one full funnel cycle completed with real money, by you, start to finish.

### Phase 1 — First 10 (next 1–2 weeks)

Goal: ten real freelancers with a live page and at least one sent document — this is `MASTER-PLAN.md`'s post-launch tripwire (§8), not a new number.

- [ ] Hand-pick 10 from your own network — the same "access beats demographics" rule as the campus playbook (§1), just pre-campus. People you can WhatsApp directly, not cold outreach.
- [ ] Onboard each one **personally, on a call or in person** — this is Linki's "personal setup help," just given free to everyone at this stage because you have 10 people, not 400. Watch where they get confused; that list becomes your first docs/FAQ page and your first UX fixes (`OPERATING-MANUAL.md`'s "3× a question = fix it" rule starts counting now).
- [ ] Ask each one, once they have a live page: "who's a client you'd actually send this to?" — get them to send one real quote to one real client in the same sitting. Activation happens in the room, same as the campus workshop's "30 signups with activation done in-session."
- [ ] Every one of these 10 gets your personal WhatsApp number for support, full stop — this is deliberately more generous than the operating manual's eventual 3-tier support system, because right now the relationship IS the product's credibility.

**Gate to leave Phase 1:** 10 live pages, ≥10 real documents sent to real clients (tripwire met), and you've watched every one of them use it at least once.

### Phase 2 — Proof surfaces (build once Phase 1 gives you material, ~1 week of building)

Goal: turn the first 10 into the trust assets a stranger #11 will actually believe. This is the direct Linki-inspired build work.

- [ ] **Real-freelancer showcase on the malaf.work homepage** — 3–6 of the best Phase 1 pages, linked, with their real handle (`malaf.work/rami`), same pattern as Linki's "Live store" cards. Ask permission first; frame it as a favor to them too (more eyes on their page).
- [ ] **One honest metrics line** on the homepage once the numbers are real and not embarrassing — "X freelancers · Y quotes sent · Z% commission" (Malaf's version of Linki's "0% commission on orders" — it's a red-line feature, say it out loud, it's a real differentiator against Khedme-style marketplaces).
- [ ] **WhatsApp as the homepage's own primary CTA**, alongside/instead of a contact form — `wa.me` link with a prefilled "I want my own page" message, mirroring Linki's "Let's chat" link and the product's own soul.
- [ ] Screenshots and one short (60-second, Linki's own benchmark) walkthrough video using the *real* Phase 0/1 material, not mockups.

**Gate to leave Phase 2:** homepage shows real people, a real number, and a WhatsApp-first way in — no fabricated social proof anywhere (this is a hard line, not a style preference: fake logos or invented numbers cost more in trust than they buy in polish, and are explicitly against this project's other standing rules on brand-asset honesty).

### Phase 3 — The referral loop (build alongside Phase 2, closes the parking-lot gap)

Goal: replace the growth mechanic that was deliberately removed (`docs/parking-lot.md`'s open item), without putting an upsell back on the client-facing card page.

Pick **one** to start (don't build all three — that's scope creep against a v1.1 problem):

- **Document-footer mention, not card-footer**: a small, tasteful "sent via Malaf" line on quotes/invoices/receipts only (never the public card page) — these are transactional documents already being shared into WhatsApp by the freelancer themselves, not a stranger's first impression of the freelancer's brand. Lower cost than the card-footer we killed, same distribution surface (every document sent is an impression).
- **Referral credit**: a free month (or $ credit) for both sides when a freelancer's client asks "how did you make this page" and signs up as a freelancer themselves, attributed via a referral code in the signup flow. Needs a `referred_by` column and a redemption function — small, matches the app's existing SECURITY DEFINER pattern.
- **Word-of-mouth via the campus playbook**, arriving on schedule in September — already fully designed, needs no new build, just patience.

**Recommendation:** ship the document-footer mention now (cheapest, most consistent with the product's existing "documents are the shareable artifact" thesis), let the campus playbook carry the heavier lifting in September, and treat the referral-credit mechanic as a Phase 4/v1.1 candidate only if Phase 1's 10 freelancers organically ask for it (parking-lot's own ≥5-requests rule).

**Gate to leave Phase 3:** one loop mechanic live, logged in `payment_events`-style audit fashion so you can actually measure whether it's doing anything.

## 3. What does NOT change

- The gates in `MASTER-PLAN.md` §8 and the weekly four-numbers ritual in `OPERATING-MANUAL.md` remain the actual scoreboard. This plan is what you *do*; those documents are how you *know if it's working*.
- The campus playbook stays a September-specific ignition tactic — this plan is what happens in the weeks that make campus-ready material (real screenshots, real testimonials, a real product) instead of campus season starting on a cold product.
- Red lines (no custody, no Meta APIs, no client logins, no marketplace features) apply to every item above exactly as they apply everywhere else. Nothing in here requires touching any of them.
- No fabricated proof, ever — every showcase page, every number, every "real freelancer" reference must be a real one who said yes.

## 4. This week, concretely

1. Finish the malaf.work deploy (task #7).
2. Build your own real page and run one real transaction through the full funnel (Phase 0).
3. Message the first 3 people from your Phase 1 list of 10.
4. Report back with the weekly four numbers per `OPERATING-MANUAL.md`, plus how many of the 10 are live.
