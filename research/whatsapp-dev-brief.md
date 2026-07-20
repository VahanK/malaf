# Dev segment brief — "Dev Discussion" WhatsApp group

**Source:** WhatsApp export, 3,310 messages from 281 Lebanese devs, Nov 2025 → Jul 2026 (raw chat in research/whatsapp/, gitignored). **Method:** 4 chronological sample readers + 1 hunter over all 156 work/hiring/rates messages, synthesized. Quotes redacted.

# Dev Discussion (Lebanese devs WhatsApp group) — synthesis brief
**Dataset:** 3,310 messages, 281 participants, Nov 2025 – Jul 2026. Four chunk readers (400-msg samples each) + one work-theme hunter who saw **all 156 work/hiring/rates messages** — hunter findings weighted highest throughout.

## 1. Group identity

- A general Lebanese-dev community that skews **job-seeker first, freelancer second**: employment aspiration dominates (Murex as the local benchmark employer, Gulf remote roles, internship pay debates, CV/ATS optimization). Freelancing appears as a **side-gig motion** — selling websites, e-commerce, and apps to non-tech Lebanese SMBs (barber scheduling site ~$1k, trainer portfolio sites, Odoo/Shopify advisory).
- The same people flip between employee mode (CV, referrals, "better to have someone inside") and freelancer mode (client quotes, launching a business). Malaf's dev segment here is a **hybrid job-seeker/side-gig persona**, not a full-time freelancer.
- A meaningful minority is **SaaS-founder-shaped** (CV-audit SaaS, $29 monetization audits, PayPal-proxy service, paid workshops) and uses the group as a storefront with long unstructured pitch paragraphs.
- Low moderation, spam-tolerant: forex/crypto ads, job-group invite links, gray-market ChatGPT resale ($10/mo) circulate freely. WhatsApp groups are treated as legitimate **distribution channels for work** (one member explicitly asks for "WhatsApp groups who offer job ads promotions").
- Platform distrust is ambient and earned: LinkedIn accounts restricted without explanation, Stripe account closures, Hostinger blocking Lebanese ISPs, Hetzner dropping Lebanon-friendly payment options, a war-related regional AWS/Mongo outage in which a dev "lost 120k user database." An **owned, Lebanon-resilient artifact** is a real selling angle.

## 2. How dev work moves on WhatsApp (hunter: all 156 work messages)

Two exchange modes, both terminating in DMs with no visible resolution in-group:

1. **Formal hire broadcasts** (~10 over 8 months: freelance Flutter senior, Unity, robotics, MS Access support, full-stack Zgharta, Dubai UI/UX): the requested artifact is **always a CV sent to a phone number** (i.e., WhatsApp) or occasionally email. Never a portfolio, live site, or GitHub — not once in 8 months.
2. **Informal gig asks** (~8: app "like toters," delivery software, Shopify expert, React/Laravel hosting "paid for sure," WordPress e-commerce with Whish, thesis+SPSS): one-to-three-line **budget-less briefs** resolved by "DM me" / "contact me on private." Supply side answers with a bare "I can help, message me." The first DM *is* the pitch.

Around these: referrals via dropped contact cards and tagging ("best mobile developer"), self-promo link-drops asking for feedback/amplification, and the group functioning as a **rate-discovery forum** — members ask peers what to charge *before* quoting clients. No bidding, no escrow, no contracts, no quote documents observed. **Nothing structured exists between a vague ask and a WhatsApp chat** — exactly the slot a card + quote-request front office fills, on the transport they already use.

## 3. Rates & payments reality

**Rate anchors** (hunter-verified): full-stack salaried Lebanon ~$1,000/mo; internships ~$300 typical (Murex ~$700 gross, CME ~$600); websites **$50–$5,000 by positioning** (one member quotes $5,000–$7,000; a WordPress payment feature "max $200"; simple mobile app $700–$1,000); ongoing sites priced per-modification with no benchmark; one senior claims $100k+ lifetime freelance. Pricing uncertainty is **chronic and public** — "what should I charge" threads recur every chunk and get vague answers.

**Payment rails** — the single loudest theme in the dataset:
- PayPal unavailable from Lebanon; a member openly runs a **Whish-settled PayPal proxy** ("You pay locally via Whish Money, I complete the payment"). Stripe closes Lebanese-resident accounts without notice and holds funds 4+ months. Whish is domestic wallet-to-wallet only; its API is effectively inaccessible officially (an unofficial doc circulates). USDT on/off-ramps from Whish/Neo/Byblos at ~2% fee are advertised in-group.
- Card gateways are punishing: $50–150 setup, $30–35/mo, 2.5–3.5% + minimum charges; devs pay real money for plumbing (US LLC ~$50 + $35/mo, mou2assase registration $500–$1,300).
- Banks question transactions above ~$1–2k and "the most they ask for is the invoice" — the **invoice is the compliance artifact** for informal freelancers. Explicit cash preference: "Cash a7san shi, mafi de3i ya3rfu."
- Trust-badge effect stated verbatim: in Lebanon the word **"Whish"** (abroad, "Powered by PayPal") helps "break the trust barrier."
- Meta WA Business API: $0.027–$0.0392 per business-initiated message, template-approval pain, "integrating directly with cloud API sucks dealing with facebook."

**Terms culture:** the only process talk in 3,310 messages is one commercial member's "100% in advance... I got burned before" and one raw line: "payment upfront u need a contract before starting if someone stole me ill steal his code." No chaser tooling, no deposits discussion, no contract templates.

## 4. Portfolio / credibility habits

- **CV-to-WhatsApp is the only incumbent credibility artifact.** CVs are PDF, iterated per application ("I make a new cv every time I apply"), peer-reviewed in-group. GitHub is cited as self-education proof ("do the projects, put on github"), never requested by hirers. A card link that can be DM'd where a CV is expected has **zero incumbent** — it's an open slot, not a displacement fight.
- Counter-signals exist: one senior lists "just the projects" not degrees; one dev maintains a personal .info domain; two members shared launched sites for feedback. But no one ever exchanged a portfolio link *for work*.
- Devs can build a portfolio site themselves (they hand-deploy on Hetzner/DigitalOcean, use Lovable/V0 to spin up client sites) and see one-page sites as a commodity — **Malaf's value must be the front-office workflow (structured quotes, rails display, testimonials, invoice artifact), not the page itself.**
- One member **organically invented the adjacent product**: portfolio sites for personal trainers "with client reviews + client database," debating $150 one-off + $20/update vs $35/mo subscription (peer advised $19/mo, one template for all) — the group's own instinct prices a subscription card product at **$19–35/mo**, though tooling comps ($6/mo VPS, $10/mo resold ChatGPT, $25 Google Play, $100/yr Apple) suggest the safe zone is **$5–15/mo**.

## 5. Marketplace attitudes

- The default local founder instinct is the **connector/marketplace** (syncbyte.dev "platform that connects developers," waitlist stage) — the framing Malaf deliberately avoids. The group itself already *is* the marketplace-of-last-resort, with zero structure and no complaints about that absence — devs don't ask for escrow or bidding; they ask for **pricing benchmarks and payment routes**.
- Devs pay for workflow knowledge: $15 for a 2-hour session teaching exactly Malaf's jobs-to-be-done (find opportunities, present yourself, send convincing proposals, price work, receive money cheaply), a $120 "PayPal from Lebanon" course floated.
- Devs also act as **payment advisors for their clients** (areeba vs MontyPay vs Bank of Beirut comparisons) — rails-selection is part of their delivery work, so a rails-display card is a tool they'd recognize professionally.

## 6. Implications for Malaf

**Dev preset:** seed services-with-unit-pricing from observed anchors (website tiers $500/$1.5k/$5k framing, mobile app $700–1,000, feature add-on ~$200, per-modification maintenance retainer); blocks for GitHub/live-project links (complement the CV, don't fight it); terms display (deposit %, "100% upfront" option); rails display Whish/OMT/USDT/IBAN/cash with the Whish name doing trust-badge work; a quote that can double as the **invoice banks ask for**. Position the card as "the freelance-facing complement to your CV" — the thing you drop where a CV is expected but a CV undersells you.

**Founder-15 targeting:** recruit hybrid side-gig devs selling to SMBs, in-group self-promoters (CV-audit/workshop/proxy sellers who re-paste pitch paragraphs and would rather drop one link), the trainer-portfolio builder archetype, and payment-advisor devs. Funnel via develeb.org events, hackathons, free workshops — the stated entry points for "how do I start freelancing" newcomers. Pitch the anti-fragility angle (platform bans, outages) and the positioning thesis in their own words: presentation, not code, sets the price between $50 and $5,000.

**Chaser relevance — caution:** the chase/admin pain is **unarticulated, not confirmed**. Zero invoicing/chasing discussion in 3,310 messages; only "I got burned" scar tissue and 100%-upfront workarounds. Validation interviews must probe it directly ("tell me about the last client who paid late") rather than lead with it. The demonstrated wedge order is: **(1) quote/pricing structure, (2) rails display + invoice artifact, (3) credibility page — chasers fourth, as discovery.**

**Pricing:** price-sensitive segment with modest incomes; the group's own $19–35/mo instinct is for a product *they resell to clients*; for a tool they buy themselves, anchor low single digits to ~$15/mo max.

## 7. Best redacted quotes

- "Hello — anyone here shopify expert if yes dm for paid task" — the entire gig-exchange protocol in one line
- "please send your CV at [phone]" — freelance senior Flutter role; CV via WhatsApp is the default artifact
- "Enta w your positioning bel soue2 fik tbi3 website be $50 w $5000" (with your positioning in the market you can sell a website for $50 or $5,000)
- "3nde client bdo website + admin panel + mobile application… ade momkn e5od meno 3la hek sh8el?" (I have a client... how much can I charge for this work?)
- "بلبنان، كلمة Whish وبرات لبنان Powered by PayPal مفعولن سحر... They help break the trust barrier."
- "Henne stripe sakarouli 7sebi... they close your account without any notice and hold money (holding mine for minimum of 4 months)"
- "If project, 100% in advance. Yes, I got burned before."
- "payment upfront u need a contract before starting if someone stole me ill steal his code and re work it"
- "You pay locally via Whish Money. I complete the payment and send you the confirmation." — the in-group PayPal proxy service
- "Cash a7san shi, mafi de3i ya3rfu" (cash is best, no one needs to know)

## Top citable facts

- Across 8 months and ~10 formal hire posts in the group, the only credibility artifact ever requested was a CV sent to a phone number or email — never a portfolio link, personal site, or GitHub.
- Freelance gig asks are one-to-three-line budget-less briefs resolved by 'DM me,' with no quote, invoice, or portfolio artifact between the ask and the WhatsApp chat.
- Website pricing in the group spans $50–$5,000 depending purely on positioning ('Enta w your positioning bel soue2 fik tbi3 website be $50 w $5000'), and devs routinely ask peers what to charge before quoting clients.
- A member selling portfolio sites to personal trainers priced them at $150 one-off + $20/update or a $19–35/mo subscription — the group's own instinct for a subscription card-page product.
- PayPal is unavailable from Lebanon and Stripe closes Lebanese-resident accounts while holding funds 4+ months; the working stack is Whish domestically, USDT bridges at ~2% fee, and an in-group Whish-settled PayPal proxy service.
- A member stated that in Lebanon the word 'Whish' (and abroad 'Powered by PayPal') works like magic to 'help break the trust barrier' — direct validation of payment rails as display config.
- Banks question transfers above roughly $1–2k and 'the most they ask for is the invoice,' making an invoice/quote artifact the de facto compliance document for informal freelancers.
- Meta's WhatsApp Business API costs $0.027–$0.0392 per business-initiated message and devs describe integrating it as painful, matching Malaf's wa.me-deep-links-only red line.
- No invoicing, contract, or client-chasing tooling was discussed anywhere in 3,310 messages; the only payment-terms talk was '100% in advance... I got burned before' — chaser pain is unarticulated and must be probed in interviews.
- Rate anchors: full-stack salaried ~$1,000/mo, internships ~$300 typical, simple mobile app builds $700–$1,000, and tooling comps ($6/mo VPS, $10/mo resold ChatGPT) cap plausible Malaf subscription pricing at roughly $5–15/mo.
