# Demand analysis — "Wolf of Bey" Discord, #i-am-looking-for

**Source:** full channel export, 8,659 non-bot messages, Nov 2022 → Jul 2026 (raw CSV in `research/`, gitignored — contains names + phone numbers, must never be committed or shared).
**Method:** RFC4180 parse of the Discord export → request detection via phrase patterns ("looking for", "anyone recommend", "need a", Arabic/Franco equivalents) → keyword categorization (a message can hit multiple categories) → language + behavior signals. Heuristic, not hand-labeled; treat counts as ±10%, ordering as reliable.

## Headline numbers

- **8,659 messages from 1,678 unique people**; 3,812 are explicit service requests from **1,327 distinct requesters**.
- **426 people asked 3+ times** — demand is recurring, not one-shot.
- Volume is sustained: ~3.2k msgs in 2023, ~2k/yr in 2024–2025, and 2026 is pacing similar (1,074 by mid-July).
- Community profile: **e-commerce brand owners and aspiring entrepreneurs**, not consumers. They buy business services repeatedly.

## What they ask for (explicit requests only)

| Category | Requests |
|---|---|
| Web & app dev (Shopify/WordPress/sites) | 542 |
| Content & video editing (UGC, reels, editors) | 479 |
| Design (logo/graphic/branding/packaging) | 394 |
| Suppliers & product sourcing | 333 |
| Photography & videography | 285 |
| Influencers & UGC talent | 227 |
| Shipping / fulfillment / delivery | 225 |
| Ads & media buying (Meta/Google/TikTok) | 216 |
| Marketing / social media / SEO | 211 |
| Accounting / legal / registration | 44 |
| Printing & production | 43 |
| 3D / CAD / product design | 38 |

Freelancer-addressable demand (dev, content, design, photo, ads, marketing) dominates; suppliers/shipping (~560 requests) is company-directory demand, out of Malaf scope — parked.

## How deals actually happen (the Malaf thesis, confirmed)

- **1,671 messages contain a raw phone number** posted in public chat; **562 explicitly say WhatsApp**; **1,503 say "DM me"**. The deal flow is: public ask → phone number → WhatsApp → nothing persistent. No portfolio, no pricing page, no follow-up surface. This is exactly the hole Malaf's zero-login card + wa.me CTA fills — the behavior is already native, we're formalizing it.
- **460 requests are recommendation-seeking** ("anyone recommend…"). Reputation travels by word-of-mouth link-sharing — a shareable card is the right artifact for that loop.
- **610 messages mention price/budget**, with recurring "affordable", "decent price", "I don't have a big budget", "won't charge me a fortune". Buyers are price-sensitive; the freelancers serving them will be too → keep subscription pricing modest, lead with "look professional, win the job".
- Buyers frequently ask for **bundles** (logo + website + ads + social in one message) → the services block must comfortably hold multiple distinct services per freelancer, and cross-referrals between Malaf freelancers are a natural future loop (parked).

## Language

98.9% of messages are English, ~1.1% Franco-Arabic (arabizi), ~0.1% Arabic script. **English-first UI is strongly confirmed for this segment.** Caveat: this is a self-selected English-speaking e-com community — the Arabic variant still matters for the *client-facing pages* of freelancers whose end clients (wedding/event customers, local trades) live in Arabic. This dataset says nothing about those segments.

## Implications for the founder-15 hunt

Priority freelancer segments, by demonstrated demand volume:
1. **Web/Shopify freelancers** (542) — highest volume, portfolio = live sites, easy demo.
2. **Video editors / content creators / UGC** (479) — portfolio = reels; the before/after and grid blocks fit perfectly.
3. **Graphic/brand designers** (394) — classic portfolio case.
4. **Photographers** (285) — the chosen demo preset; validated, mid-pack volume but the most visual demo.
5. **Media buyers / marketers** (216 + 211) — portfolio = results screenshots + testimonials; testimonial block carries the weight.

The demo photographer page works on all five audiences (everyone understands a photographer's card instantly), but outreach lists should start with dev, content, and design freelancers — that's where the repeat demand is.

**Bonus:** this channel itself is a founder-deal hunting ground — the *suppliers* of these 3,812 requests are findable freelancers, and 426 repeat requesters are proof of recurring buyers to show them.

## Caveats

Single channel, single community, e-com skew; excludes offline trades (no plumber/tutor/tradesperson demand visible — absence here is not absence in market). Category regexes overlap and miss synonyms; request detection is heuristic. Good enough to rank segments and confirm behavior patterns; not a market-size estimate.
