# Malaf — Operating Manual (how you run this, solo, 15–20 hrs/week)

## The rhythm

**Daily (10 min, coffee-length):**
- Glance: Sentry errors, uptime, yesterday's signups
- Support inbox: read, don't answer (answers happen in the evening batch)

**Evening batch (30–45 min, once a day):**
- Answer support (24h SLA, stated in-product, always kept)
- One-tap confirms/refunds if any payment disputes
- Rule: any question asked 3× total → becomes a docs page or a UX fix that deletes the ticket type forever

**Weekly (the ritual that keeps this alive — non-negotiable):**
- Report the four numbers (to the Cowork session): validation phase = conversations · founder deals · activation · cash collected. Live phase = CPFree · free→paid · churn · MRR
- Ads: kill anything >2× target CPFree after $15 spend; scale winners +20%; ship 5 new creative variants (batch-produced)
- Post 3–4 content pieces (from the weekend batch)
- New ideas → parking-lot file. Never evaluated mid-week.

**Monthly (one evening):**
- Feature triage: parking lot + support log → anything with ≥5 paying-user requests gets built; everything else waits
- Costs review (Supabase/Vercel/domain vs the 5%-of-MRR trigger)
- Churn look: who cancelled, ask them why (one WhatsApp message each)
- In-app changelog updated — users see the product is alive

**Quarterly:** one big rock maximum (e.g., Tier-2 Whish Pay partnership, Gulf expansion, directory).

## The update system (how features ship)

1. Request arrives (support, conversation, your own idea) → parking-lot file, one line each
2. Monthly triage → clusters of ≥5 paying users become the build list
3. Build on a branch → Vercel preview deploy → self-test on the preview URL
4. DB changes via Supabase migration files only (never dashboard-clicking schema changes — migrations are your undo button)
5. Merge → Vercel auto-deploys → changelog entry → if the feature answers known requests, WhatsApp the users who asked (they become your loudest advocates)
6. Rollback = Vercel instant rollback + Supabase PITR if data was touched. Practice both once before launch.

## Support system (runs mostly without you)

- Line 1: short, screenshot-heavy docs (EN/AR) + docs-trained chatbot in-app
- Line 2: WhatsApp Business with quick-reply FAQs
- Line 3: you, in the evening batch, within 24h
- Refunds: 30-day money-back, no argument, ever — cheaper than one bad review in a market this small

## Incident runbook (procedures, not emergencies)

- **Site down:** check Vercel status → instant rollback to last deploy → then diagnose
- **DB problem:** Supabase dashboard → logs → PITR restore if data damaged
- **Payment confusion (user says paid, not marked):** check the payment_events ledger → manual confirm with note → receipt fires
- **Ad account banned:** switch to warmed backup account same day; appeal in parallel; email list keeps acquiring meanwhile
- **USDT watcher stuck:** cron logs → restart → manually reconcile pending invoices against the chain

## The rules that outrank your moods

- Gates decide, not feelings: 20 conversations + 15 founder deals → build v1. Loop math (LTV ≥ 3× CAC) → scale spend. $2k MRR or month 12 → Phase 2 unlocks.
- The carousel stays closed mid-run. New business ideas → parking lot, evaluated only at a gate.
- The two ruling numbers (CPFree <$1, free→paid >5%) are the weekly headline. Everything else is commentary.
- What only you can do, forever: the weekly numbers, the founder relationships, the community voice. Everything else gets automated or deleted.

## Escalation to the HQ (the Cowork session)

Come back weekly with the four numbers, or immediately when: a gate resolves (pass or fail) · a ruling number moves >30% · an incident repeats twice · you're about to break a red line (custody, Meta API, marketplace features) — that last one especially.
