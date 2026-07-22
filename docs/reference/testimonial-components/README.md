# Testimonial component reference (NOT wired in)

Four animated testimonial components vahan shared (Jul 22), saved for when a
surface actually needs one. **These are reference only — not imported anywhere,
not shipped.** They're from a Tailwind + motion component kit (Hover.dev-style),
so treat them as inspiration to adapt, not original WorkWith code.

## Before any of these can go live, they need:
1. **Import fix** — they `import { motion } from "motion/react"`; this repo has
   `framer-motion` (^12), so it's `import { motion } from "framer-motion"`.
   `react-icons` (^5.5.0) is already installed. No new dependency.
2. **Real data** — every file uses hardcoded placeholder arrays (`TESTIMONIAL_DATA`,
   "COMPANY", "Founder of XYZ", Unsplash stock faces). WorkWith testimonials are
   real `testimonial` portfolio_blocks from the DB. Must be fed real data.
3. **Token theming** — they hardcode indigo/slate/black. Must use the card token
   system (`var(--card-*)`) so they match whichever template renders them.
4. **A chosen surface** (the real open question — see below).

## Which fits where
- **StaggerTestimonials / ScrollingTestimonials** — designed for VOLUME (12-18
  items, infinite scroll walls). Only make sense on a **marketing homepage**
  ("what freelancers say about WorkWith"). ⚠️ BLOCKED by the launch-plan's
  no-fabricated-proof rule until real WorkWith users exist — shipping them now
  means Lorem-ipsum placeholders, which is explicitly forbidden.
- **ShuffleCards** — works with ~3 cards. The only one that fits a **solo
  freelancer's public page**, where there are realistically 1-3 real
  testimonials. Best candidate if/when we upgrade the freelancer-page
  testimonial rendering beyond the current WhatsApp-bubble style.
- **StackedCardTestimonials** — company-logo carousel; homepage-only, same
  no-fake-proof caveat.

## Decision (vahan, Jul 22): save for later, pick placement when relevant.
Do NOT build until a surface is chosen. When chosen, adaptation is ~30-60 min
(import fix + real-data wiring + token theming), not a from-scratch build.
