# Phase 1 Validation Kit v2 — Levant-First Freelancer Front-Office
### (supersedes v1's Gulf-ads plan · product core unchanged · market, rails, channels, gates updated)

**Owner:** Vahan · **Cash budget:** ~$0 (no paid ads in v2) · **Duration:** 30 days · **Hours:** 15–20/week

---

## 1. What changed and why

v1 targeted Gulf freelancers via paid ads. v2 targets **Lebanon first, Syria opportunistically** because: (a) you pass the four-blanks test at home today; (b) competition ≈ zero — no global tool will ever build for Whish/OMT/USDT/cash rails; (c) Syria is reconnecting to global finance *right now* (Caesar Act repealed Dec 2025, OFAC program archived, Visa/Mastercard back as of May 2026) — a 20M-person market with no incumbent SaaS; (d) validation at home is free (communities, not ads) and collecting founder payments through local rails tests the hardest assumption — *can money actually reach you here* — inside the validation itself.

**Unchanged:** the product is the client-facing front-office (quote → approve → invoice → pay → receipt, bilingual AR/EN), the ChatGPT design rule (state + client-facing surfaces + payment collection = product; generated text ≠ product), and the Gulf as a *later* expansion (v1 kit stays on the shelf, ready).

**The trade accepted:** local pricing ($3–6/mo) means ~500 users to reach $2k MRR instead of ~170. In exchange: near-zero CAC, native moat, and the identity + money ambitions merge into one build.

---

## 2. Positioning — the face and the engine

**The door (acquisition, free, catchy):** "Your professional page in 30 seconds" — malaf.me/name with services, work samples, and a request-a-quote button. Shareable in IG bios and WhatsApp Business profiles. Public by design: every page footer invites the viewer to make their own (the Linki/Booklee-proven viral shape, applied to freelancers).

**The headline feature (the hook you advertise):** "Get paid without the awkward" — auto-reminders that ask for your money politely, in the client's language, gently escalating, relentless. You never write that cringe reminder message again. AR: **"مين بيحكي عن المصاري؟ مش أنت."**

**The engine (retention, mostly invisible in marketing):** quote → approve → invoice → track → receipt, bilingual AR/EN, with the payments ladder underneath (§3). USDT auto-confirm = the "woah" moment in onboarding and the Syria wedge — not the billboard.

**The card + portfolio (added):** QR business card (lockscreen/printed) → page opens with save-contact vCard + WhatsApp button + portfolio grid (uploads only — no IG API) + request-a-quote. Design bar: the page must look better than the freelancer's own Instagram grid. Full funnel in one object: QR scanned → portfolio impresses → quote requested → approved → invoiced → politely chased → paid → receipted. v1 scope is exactly this + Tier-0 payments; everything else parks.

**WhatsApp-as-transport (added — the design law, quoted from vahan's own jewelry schema: "conversation happens on WhatsApp; the artifact is the app"):**
- Quotes/invoices/receipts = shareable artifacts (link + image version) with one-tap share into the existing WhatsApp chat
- Client side = zero login, always — clients never sign up
- Approval = tap on the page OR freelancer taps "approved on WhatsApp" (state + timestamp recorded either way; track truth, don't legislate behavior)
- Reminders = app writes the polite escalating message, one-tap opens WhatsApp prefilled via wa.me deep link, freelancer hits send — permissionless, no Cloud API, no Meta verification, nothing bannable
- Pitch line: "بيكتبلك رسالة المطالبة — إنت بس ابعتها"

**One-breath pitch (test this in every conversation):** "صفحة مهنية بثواني، وتحصيل بلا إحراج" — a professional page in seconds, and your money collected without the awkward.

**Free tier:** public page + 3 documents/month. **Founder $29/yr:** money-chaser, unlimited documents, own branding.

**The native moat (say it in every pitch):** "Zoho doesn't know what Whish is. Bonsai has never heard of OMT. This is built for how money actually moves here — USD, LBP, SYP, wallets, crypto, and cash — with a professional face on top."

---

## 3. Seamless payments — the ladder (no bank approvals, ever)

**The architecture rule that keeps you legal and unblocked:** the freelancer brings their own rails; you are the ledger and the professional surface. **Funds never touch your accounts.** No custody, no aggregation, no disbursement — that's the BDL money-transmitter cliff, and you never go near it. "Seamless" is built as UX and automation, not as you becoming a bank.

**Tier 0 — day one (permissionless, ships in v1):**
- Every invoice gets a branded **pay page**: amount, currency (USD/LBP/SYP), and the freelancer's enabled methods
- **Smart handoff per method:** Whish → prefilled deep link/QR to the recipient number; USDT → QR with exact amount + address (TRC-20 default for fees); bank → IBAN with one-tap copy; cash → "mark as agreed, collect on delivery"
- Client taps **"I paid"** → freelancer gets one-tap confirm → receipt auto-sends to both sides, invoice state updates, reminders stop
- Feels seamless: nobody types numbers, nobody screenshots, nobody asks "did you get it?"

**Tier 1 — weeks 2–3 of build (permissionless, the wow feature):**
- **USDT auto-detection:** unique payment reference per invoice + an on-chain watcher → the moment the transfer lands, the invoice marks itself PAID and receipts fire automatically. Zero human taps. Zero permission needed from anyone — watching a blockchain is free.
- This is the demo-closer, and it's *especially* potent for Syrian users, where USDT is the working rail today while banks rebuild.

**Tier 2 — earned partnerships (trigger: ~100 active freelancers):**
- **Whish Pay / OMT Pay in-flow checkout**, connect-model: each freelancer's own merchant identity, your UI. Whish Pay demonstrably exists as an e-commerce checkout (it integrates with Shopify stores), so the door is real. You don't ask permission to start — you show up to that meeting with aggregated distribution: "I bring you hundreds of freelancer merchants." Traction is the approval process.
- Card checkout (areeba/NetCommerce per-merchant, Syrian bank cards as issuance matures) rides the same connect model, later.

---

## 4. Pricing — and how it's PRESENTED (deal culture rules)

- **Lebanon/Syria:** $4/mo (the decoy) or annual — **list $49/yr, founder ~~$49~~ $29/yr, first 100 only, price locked for life** — collected via Whish / USDT / cash; collecting through local rails IS part of the test
- **Presentation spec (stingy-market optimized):** big number on page = **$2.4/شهر** (billed yearly, honest but secondary) · value framed in their money ("أول فاتورة متأخرة بيجمعها — دفع حالو ٥ مرات") · USD only, never show LBP equivalents · lifetime price lock stated ("سعرك ما بيتغيّر — أبداً") · 30-day money-back line as trust signal · free tier always visible (pressure release); upgrade prompt appears ONLY at value moments (invoice overdue), never as nags
- **Diaspora/Gulf users (later):** $12/mo via Paddle (v1 kit's MoR setup unchanged)
- Annual-first on purpose: freelancer income is lumpy; annual kills slow-month churn. If founder conversations flinch at 29 but bite at 19, that's data — adjust at the gate, not before it.

---

## 5. Channels (all free)

1. **20 direct conversations, week 1** — your own network first (the five names), then Instagram DMs to Lebanese freelancers with active client work (photographers, designers, videographers, tutors, makeup artists, marketers)
2. **Communities:** Lebanese freelancer/creator Facebook + WhatsApp groups; Syrian freelancer Telegram groups (large and underserved); university alumni circles
3. **Organic short video:** the three v1 ad scripts work unpaid — Arabic voiceover reels/TikToks showing the client's payment experience (the Whish handoff + auto-receipt is inherently filmable)
4. **AMENDED July 19 — ads are the MAIN engine (vahan's call), organic is the multiplier.** Operating system:
   - **Platform:** Meta (IG Reels placements) primary — Lebanon CPCs run ~$0.15–0.60, Reels 15–30s is the proven format. TikTok: verify self-serve availability + billing from Lebanon during setup week; add if clean.
   - **Budget ladder:** $50 learning test NOW (parallel to hand-selling — buys creative learnings, not validation); post-gate $10/day baseline → scale winning creatives to $30/day; Gulf/diaspora expansion opens when Lebanon frequency saturates (small pool — expect months, not years).
   - **The two numbers that rule everything:** cost per free signup (target <$1 — creative quality is the lever) and free→paid within 90 days (target >5% — activation + the chaser moment are the levers). CPFree $1 × 5% = $20 per paid customer vs $29 yr-1 revenue + renewals = alive. CPFree $3 × 3% = $100 per paid = dead. Every week's report = these two numbers.
   - **Creative supply is the real bottleneck:** ads fatigue in 1–2 weeks; winning = 5 new variants/week from the 8 type-templates, founders as UGC cast; kill any creative at >2× target CPFree after ~$15 spend; never scale a loser, never starve a winner.
   - **Tracking:** UTM per creative + server-side events (CAPI via the app — iOS killed pixel-only); watch CPFree, free→paid, CPP, payback monthly.
   - **Insurance:** second ad account warmed up + email capture on every landing from day one (account bans are a when, not an if).
   - Organic (communities, campus, footers, SEO pages) is not the alternative — it's what divides paid CAC by the viral factor. Ads land on a product that shares itself, or ads-main math doesn't close.

---

## 6. 30-day schedule and gates

**Week 1:** 5 conversations from your own list + landing live (AR/EN, founder deal buyable via Whish/USDT) + four-blanks documented per conversation
**Week 2:** 15 more conversations + community posts + first reels + Tier-0 pay-page clickable demo
**Weeks 3–4:** close founder deals, iterate pitch weekly

**Gates (judged day 30):**
- **GO:** ≥20 real conversations AND **≥15 paid founder deals** ($29, collected via local rails) → build v1 in 3 weekend sprints (portal + quotes/invoices + Tier-0 payments + reminders), Tier-1 USDT watcher in sprint 3
- **ITERATE (once, 2 weeks):** 5–14 founder deals → fix the pitch or the segment, not the life plan
- **KILL:** <5 deals after iteration → refund everyone via the same rails, write down what the Levant said, revert to v1 (Gulf kit, ads path) with the product thesis intact
- **Activation tripwire (post-build):** ≥10 of the founders send a real document to a real client in week one of v1 — signups that don't activate are Family-A death, caught early

**Carousel stays closed until day 30.** New ideas → parking-lot file, not evaluation.

---

## 7. Market scope — AMENDED July 19

- **Lebanon only.** Syria descoped by decision: Syrian signups accepted passively (product works, USDT rails exist) but nothing is built, localized, or marketed for Syria. The legal analysis from the earlier version stands on record if this ever reopens.
- **Language:** English-first UI and marketing (how urban Lebanese freelancers actually present themselves); every page has a one-tap full-Arabic variant (fully-Arabic freelancers exist and are part of the market — tutors, home services, beyond the Beirut bubble); documents per-client in EN or AR.
- **Expansion valve (replaces Syria):** Gulf + Lebanese diaspora — the English-first product already fits it, and the original v1 Gulf kit is on the shelf. Trigger to open it: Lebanon farm slowing (free-page growth <10%/mo) or $1k MRR, whichever first.

---

## 8. Risks (v2 refresh)

- **Tiny wallets / churn:** annual-first pricing; $29 founder cohort locked for a year
- **USDT optics:** you never custody — you watch public chains and update ledgers; still, keep the accountant informed once registered (Lebanon has no clear crypto framework; your exposure is bookkeeping-level, keep it that way)
- **Whish/OMT partnership may stall:** Tier 0+1 deliver seamless-enough without them; Tier 2 is upside, not dependency
- **Syria platform-policy lag:** expected; local rails make it moot for v1
- **Founder abandonment (still #1):** weekly four-number check-in stands — conversations, deals, activation, MRR

---

## 9. Phase 2 trigger (unchanged in spirit)

The bigger visible swing stays parked behind **$2k MRR or month 12**. Note: v2 already *is* a local-brand play — by the trigger date you'll have a name Lebanese freelancers know, which makes Phase 2 a widening, not a restart.

---

## 10. Your week-1 checklist

1. Reply with the **five freelancers you personally know** (professions are enough) — they're conversations 1–5
2. Pick the name (Malaf / Wasl / Maktabi / Fawtar / Wakeel) so the landing and pay pages have an identity
3. Landing page live with the $29 founder deal payable via Whish/USDT
4. First 5 conversations booked
5. Confirm your own receiving rails (Whish account for the business income; USDT wallet)
