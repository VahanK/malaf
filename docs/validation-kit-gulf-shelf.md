Note: this document predates the Malaf → WorkWith rebrand (2026-07-22, work-withme.com). References to "Malaf" below refer to the same product.

# Phase 1 Validation Kit — Arabic-First Freelancer Front-Office

**Owner:** Vahan · **Budget for this test:** ≤ $150 · **Duration:** 30 days · **Hours:** 15–20/week

---

## 1. Competitor scan verdict: PROCEED, with repositioning

**What the scan found (July 2026):**

| Layer | Players | Threat to you |
|---|---|---|
| Heavy accounting / ZATCA suites (KSA) | Daftra, Qoyod, Wafeq, fatoorah.sa, e-fatoora, fatora.cloud | Low — company accounting software, complex, not freelancer-shaped. Not your lane. |
| Simple invoice generators | fatoora.app (free), Zoho Invoice (free, has Arabic/UAE VAT), generic "فواتير وعروض أسعار" mobile apps | **High for invoice-PDF-only products.** Invoice generation alone is commoditized and free. |
| Freelancer front-office (proposals + contracts + client portal + payments) | Propel (aipropel.app — English/global). No visible Arabic-first owner. | **This is the gap.** |
| Freelance marketplaces | Mostaql, Khamsat, Nafae, Jobbers | Irrelevant — different business (and their WhatsApp leakage feeds you). |

**Conclusion:** "Arabic invoicing app" is dead on arrival — free tools own it. The open position is the **client-facing layer**: no Arabic-first product owns the moment where a freelancer's client receives a branded link, views the quote, approves, and pays. That moment is the product.

---

## 2. Positioning

**One-liner (EN):** Send your client one link — quote, approval, invoice, payment. In Arabic and English. Look like a company, stay a freelancer.

**One-liner (AR):** رابط واحد لعميلك: عرض السعر، الموافقة، الفاتورة، والدفع — بالعربية والإنجليزية. مظهر شركة، وأنت مستقل.

**The design rule (every feature must pass):** *Could the buyer's ChatGPT do this?*
- AI-generated proposal text → FAILS → never a selling point
- Hosted branded client portal → PASSES
- Tracked state (who owes what, since when, auto-reminders) → PASSES
- Payment collection links → PASSES

**vs Zoho free tier (the real competitor):** Zoho is SMB accounting software wearing a free hat — clunky, English-first UX, no freelancer-branded client experience. You win on: 5-minute setup, bilingual AR/EN documents side-by-side, a client portal that makes a solo freelancer look like an agency, and Gulf-native tone. You do NOT compete on accounting features. Ever.

**Price:** $12/mo or $99/yr. Founder preorder during validation: $9 (see §6).

**Target:** Gulf-based freelancers (KSA, UAE first) — designers, photographers, videographers, marketers, tutors, consultants. NOT developers (they self-build), NOT companies (Daftra's problem).

---

## 3. Name candidates

Check trademark + domain before falling in love. My shortlist:

1. **Wasl / وصل** — means both "receipt" and "connection." Beautiful fit. ⚠️ "wasl" is a giant Dubai real-estate brand — check trademark class carefully.
2. **Malaf / ملف** — "file / portfolio." The client's malaf is the portal. Clean, short, ownable.
3. **Maktabi / مكتبي** — "my office." Says exactly what it is.
4. **Fawtar / فوتر** — verb-y spin on فاتورة (invoice). ⚠️ anchors you to invoicing, which we're positioning away from.
5. **Wakeel / وكيل** — "agent/representative" — the tool that represents you professionally.

My pick: **Malaf** (or Wasl if trademark-clear).

---

## 4. Landing page copy

### English

**Hero:** One link. Your whole business.
**Sub:** Quotes your clients approve in one tap. Invoices that collect themselves. A client portal with your name on it — in Arabic and English.

**Benefit blocks:**
- **Look like an agency.** Your client opens a branded page — not a WhatsApp PDF. Quote → approve → invoice → pay, all in one place.
- **Never chase money awkwardly again.** See who owes what since when. Automatic, polite payment reminders — in the client's language.
- **Five minutes to your first quote.** Pick your profession, get ready-made bilingual templates. No accounting degree required.

**CTA:** Join the founding list → first 100 get lifetime founder pricing.

### العربية

**العنوان:** رابط واحد… شغلك كله.
**الوصف:** عروض أسعار يوافق عليها عميلك بضغطة، فواتير تُحصَّل بنفسها، وبوابة عملاء تحمل اسمك — بالعربية والإنجليزية.

**المزايا:**
- **مظهر وكالة، وأنت مستقل.** عميلك يفتح صفحة أنيقة باسمك — لا ملف PDF على واتساب. عرض السعر ← الموافقة ← الفاتورة ← الدفع، في مكان واحد.
- **لا إحراج بعد اليوم في المطالبة بحقك.** اعرف من عليه دفعة ومنذ متى، مع تذكيرات دفع مهذّبة تلقائية بلغة عميلك.
- **خمس دقائق لأول عرض سعر.** اختر مهنتك واحصل على قوالب جاهزة بلغتين. بدون تعقيد برامج المحاسبة.

**زر:** انضم لقائمة التأسيس ← أول ١٠٠ مشترك يحصلون على سعر المؤسسين مدى الحياة.

---

## 5. Three ad scripts (15-second vertical, AR voiceover + EN captions)

**Ad 1 — "The WhatsApp PDF" (pain):**
Screen recording. A freelancer sends a blurry PDF invoice on WhatsApp, client leaves it on read. Cut: client opens a clean branded portal link, taps Approve, pays. VO: "عميلك ما يرد على الفاتورة؟ جرّب ترسلها بشكل يحترم شغلك." (Client ignoring your invoice? Try sending it in a form that respects your work.) End card: logo + "رابط واحد. شغلك كله."

**Ad 2 — "Who owes me?" (state):**
POV: freelancer scrolling a dashboard — "3 invoices unpaid · 12 days · reminder sent." VO: "مين دافع؟ مين ناسي؟ التطبيق يتذكّر ويطالب عنك — بأدب." (Who paid? Who forgot? The app remembers and follows up for you — politely.)

**Ad 3 — "5 minutes" (speed):**
Timer on screen. Sign up → choose "photographer" → bilingual quote template appears → send → client approves. VO: "من التسجيل لأول عرض سعر: خمس دقائق. جرّبها." (From signup to first quote: five minutes. Try it.)

Production: build in your stack as a clickable mock, screen-record, AI voiceover (Gulf-neutral MSA), captions both languages. All three producible in one weekend with tools you already have.

---

## 6. 30-day schedule and gates

**Week 1 (build the test, ~12h):**
- Landing page on your stack (one evening), bilingual, RTL-correct
- Waitlist email capture PLUS a **$9 founder preorder** button (Paddle/Lemon Squeezy checkout) — emails are curiosity, preorders are evidence
- TikTok + Instagram accounts, 3 ads produced
- Setup item: confirm your card works for TikTok/Meta ad billing (fresh-USD card; sort this week 1, not week 3)

**Weeks 2–3 (run the test, ~$100–150):**
- Ads live, KSA + UAE, freelancer interest targeting, ~$7/day
- One creative iteration per week based on CTR
- Post the ads organically too (TikTok/Reels are free distribution in MENA)

**Gates (written before launch, judged at day 30):**
- **GO:** ≥300 visitors AND ≥8% email conversion AND ≥5 preorders → build v1 in 3 weekend sprints (portal + quotes + invoices + Paddle), refund preorders into founder accounts
- **ITERATE (once, max 2 weeks):** 4–8% email conversion, 1–4 preorders → reposition or switch lead creative, re-run
- **KILL:** <4% after iteration → refund preorders, write down what the market said, keep the funnel skill (it transfers to the next product), pick the next candidate from the same formula — proven category × Arabic gap × client-facing state

**Not before day 30:** no new business ideas get evaluated. The carousel is closed.

---

## 7. Known risks (eyes open)

- **ZATCA (KSA e-invoicing):** VAT-registered Saudi freelancers may need compliant invoices. v1 positions on client experience, not tax compliance — do NOT claim ZATCA compliance until actually built (phase 2, and it's a moat when you do). UAE e-invoicing rollout is also coming — same posture.
- **Zoho free tier:** the price-anchor. Your answer is UX + bilingual portal, never feature war.
- **Ad account from Lebanon:** billing hiccups are common — if TikTok/Meta billing fights you, that's a week-1 problem to solve, not a sign from the universe.
- **Payout rail:** Paddle/Lemon Squeezy payouts → Payoneer/Wise/foreign account. Confirm your receiving rail in week 1.

---

## 8. Phase 2 — parked, with trigger

The visible Lebanese swing (the GoPark/Tick'it/Waytrix-class brand play) unlocks at **$2k MRR or month 12, whichever comes first.** It gets built with Phase 1's cash flow, Phase 1's ad-buying skill, and Phase 1's credibility. Until the trigger: it stays parked. Written here so future-you can't renegotiate quietly.
