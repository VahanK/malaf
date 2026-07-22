import Link from 'next/link'
import Image from 'next/image'
import { FaWhatsapp } from 'react-icons/fa'
import { Nav, FOUNDER_WA } from '@/components/home/Nav'
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion'
import { HeroFloat, FloatPill } from '@/components/home/HeroFloat'

// ---------------------------------------------------------------------------
// WorkWith homepage — positioned as the way Lebanese freelancers RUN their
// business (not a website builder). The page is the front door; the tracked
// job flow (quote → invoice → paid → archived) is why they stay. Proof is ONE
// real page (/rami), labeled as an example. No fabricated stats, Lebanon only.
// Copy vetted against the category test + the ChatGPT test (sell tracked state,
// never "we write your texts").
// ---------------------------------------------------------------------------

const FAQ: FaqItem[] = [
  {
    q: 'What is WorkWith, exactly?',
    a: "It's where you run your freelance work from first message to paid. You get a page clients open with no app and no login — and behind it, the whole job is tracked: quote requested, quote sent, accepted, invoiced, paid, archived. The page gets clients in the door; the tracking is why you stay.",
  },
  {
    q: 'How is this different from Carrd or Linktree?',
    a: "Those give you a link. WorkWith runs the job. A link tool stops at 'here's my work' — then you're back in WhatsApp typing out prices, chasing the deposit, and trying to remember who paid. WorkWith carries it the whole way: the client requests a quote from your page, you send it, they accept, it becomes an invoice, and you always know what's paid and what's still owed. A page is the front door. This is the business behind it.",
  },
  {
    q: "What's free and what costs money?",
    a: "Building your page is free — pick a template, add your work and prices, and preview exactly what clients will see, no card needed. You pay $29/year (about $2.40/month) only when you're ready to publish it live at your own link and share it. That's when it becomes real: your public page, your QR card, and the whole quote-to-paid flow behind it. Pay by USDT (confirms instantly) or Whish, bank, or cash.",
  },
  {
    q: 'Do I need a website or any tech skills?',
    a: "No. You pick a look, add your work, and you're live in minutes. Nothing to install, no code — if you can post to Instagram, you can build this.",
  },
  {
    q: 'Do my clients need to download an app or make an account?',
    a: "Never. They just open your link on any phone. Seeing your work, requesting a quote, paying — all on a normal web page, no login, no app. That's a rule we don't break, not a feature we might change.",
  },
  {
    q: 'How do clients pay me? Does WorkWith take a cut?',
    a: "However you already get paid — Whish, USDT, bank transfer, or cash. Your invoice shows the client exactly how to pay, and WorkWith tracks it: you can see at a glance what's paid, what's pending, and what's overdue. The money goes straight to you — it never passes through us, and we never take a percentage. We make money on the subscription, nothing else.",
  },
  {
    q: 'What happens when an invoice goes overdue?',
    a: "WorkWith marks it overdue and keeps it in front of you, so a late payment is never something you forgot — it's something you can see. When you're ready to follow up, it's one tap into WhatsApp — you send it yourself, on your terms. Once you mark the invoice paid, it moves to archived and the follow-ups stop. You're tracking who owes you, not living in your chat history.",
  },
  {
    q: 'Can my page be in Arabic?',
    a: 'Yes. Your page has a one-tap full Arabic, right-to-left version, and your quotes, invoices, and receipts go out in Arabic or English per client. The wording is how people actually talk, not stiff formal Arabic.',
  },
  {
    q: "What's the voice intro?",
    a: "A 20-second clip in your own voice with a play button at the top of your page. It's the fastest way to feel personal — something no link-in-bio tool gives you.",
  },
  {
    q: "I'm just starting out — is this only for big names?",
    a: "Not at all. WorkWith is new, and you can be one of the first freelancers on it. A clean page and an organized way of working make you look established from day one, whether you've shot two weddings or two hundred.",
  },
  {
    q: 'Can I see a real page before I sign up?',
    a: "Yes — open Rami's live page. It's a real WorkWith page we built as an example, exactly what your own clients would see.",
  },
]

function Check({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8623d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e8623d] ${className}`}>{children}</p>
}

export default function Home() {
  return (
    <div className="bg-[#f7f3ec] text-[#171310]">
      <Nav />

      {/* ================= HERO ================= */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-24 lg:grid-cols-2 lg:px-10">
        {/* left — copy */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-[#171310]/10 bg-white px-3 py-1 text-[12px] font-medium text-[#5c574c]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#e8623d]" />
            Run your freelance business — from one link
          </span>

          <h1 className="mt-6 max-w-[15ch] font-serif text-[clamp(38px,5.5vw,60px)] font-semibold leading-[1.06] tracking-[-0.02em] mx-auto lg:mx-0">
            Your work gets you the client. WorkWith runs{' '}
            <span className="text-[#e8623d]">everything after “how much?”</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-[17px] leading-[1.55] text-[#5c574c] lg:mx-0">
            Right now it all lives in your DMs — the “how much?”, the quote you retype every time, the
            deposit you&apos;re shy to ask for, the client who went quiet. WorkWith puts it in one
            place: your page brings them in, then quote, invoice, and getting paid all happen — and
            stay — where you can see them.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-[#e8623d] px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#d4512f] active:translate-y-px"
            >
              Start free — your page in minutes
            </Link>
            <Link
              href="/examples"
              className="rounded-xl border border-[#171310]/10 bg-white px-6 py-3 text-[14px] font-semibold shadow-sm transition-colors hover:bg-[#faf8f3]"
            >
              See real pages ↗
            </Link>
          </div>
          <p className="mt-3 max-w-md text-[13px] text-[#8a8477] mx-auto lg:mx-0">
            Free to build and preview. Publish it live at your own link for $29/year — no card needed
            to start, and we never take a cut of what you earn.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] text-[#5c574c] lg:justify-start">
            {['Quotes, invoices & receipts', 'Whish, USDT, bank & cash', 'One-tap Arabic & English', 'Clients never sign in'].map(c => (
              <span key={c} className="inline-flex items-center gap-1.5">
                <Check /> {c}
              </span>
            ))}
          </div>
        </div>

        {/* right — the phone mockup (real /rami screenshot) */}
        <div className="relative flex justify-center lg:justify-end">
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 -z-10"
            style={{ background: 'radial-gradient(circle at 60% 40%, rgba(232,98,61,.08), transparent 70%)' }}
          />
          <div className="relative">
            <HeroFloat>
              <div className="w-[260px] overflow-hidden rounded-[2.5rem] border-8 border-[#171310] bg-[#0e0f13] shadow-[0_20px_50px_-20px_rgba(23,19,16,.35)] sm:w-[300px]">
                <Image
                  src="/mockups/rami-hero.webp"
                  alt="A real WorkWith page — Rami Haddad, a Beirut wedding photographer"
                  width={390}
                  height={730}
                  priority
                  className="h-auto w-full"
                />
              </div>
            </HeroFloat>

            <div className="hidden lg:block">
              <FloatPill className="-right-6 top-10" delay={0}>
                <span className="h-2 w-2 rounded-full bg-[#1f9254]" /> New quote request
              </FloatPill>
              <FloatPill className="-left-8 bottom-16" delay={1.2}>
                <span className="h-2 w-2 rounded-full bg-[#e8623d]" /> work-withme.com/rami
              </FloatPill>
            </div>
          </div>
        </div>
      </section>

      {/* ================= WHY LEBANON ================= */}
      <section className="bg-[#f2ede3] py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center">
            <Eyebrow>Built in Beirut — and it shows</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-3xl font-serif text-[clamp(28px,3.6vw,38px)] font-semibold tracking-[-0.015em]">
              Your business runs on WhatsApp, Whish, and Arabic. So does WorkWith.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: WalletIcon,
                title: 'The ways you already get paid, built in',
                body: 'Whish, USDT, bank transfer, cash — your client sees exactly how to pay you and taps “I paid.” A tool built somewhere else assumes a credit card your client doesn’t use. Here, money goes straight to you.',
              },
              {
                icon: ChatIcon,
                title: 'WhatsApp is already your office',
                body: 'The quote, the “did you get it?”, the reminder — it all happens on WhatsApp anyway. WorkWith keeps every job in one place so you always know where each one stands: quoted, approved, invoiced, overdue, paid. Your client just taps a link. No app, no login.',
              },
              {
                icon: GlobeIcon,
                title: "In your client's language — and your own voice",
                body: 'Send each client their quote and invoice in Arabic or English. Flip your whole page to Arabic with one tap. And greet visitors with a voice note in your own voice — the way you’d send it anyway.',
              },
            ].map(card => (
              <div key={card.title} className="rounded-2xl border border-[#171310]/8 bg-white p-6 shadow-sm">
                <card.icon />
                <h3 className="mt-4 font-serif text-[19px] font-semibold leading-snug">{card.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[#5c574c]">{card.body}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-2xl text-center text-[18px] leading-[1.5] text-[#171310]">
            Carrd gives you a page. But your page doesn&apos;t take Whish, doesn&apos;t live where your
            clients already talk, and doesn&apos;t speak Arabic. That&apos;s the difference between a
            page and a business.
          </p>
        </div>
      </section>

      {/* ================= SHOWCASE / PROOF ================= */}
      <section id="showcase" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>A real WorkWith page</Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(30px,4vw,40px)] font-semibold tracking-[-0.015em]">
              This is what your clients will see.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-[1.55] text-[#5c574c]">
              This is a real WorkWith page — Rami&apos;s, built as an example. The page is what clients
              see; everything behind it is what you run.
            </p>
            <p className="mt-2 text-[13px] text-[#8a8477]">
              An example page we built to show what yours could feel like — not customer data.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-[#171310]/10 bg-white shadow-[0_20px_50px_-20px_rgba(23,19,16,.25)]">
            <div className="flex items-center gap-2 border-b border-[#171310]/10 bg-[#f2ede3] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#e8623d]/60" />
              <span className="h-3 w-3 rounded-full bg-[#c9a45c]/60" />
              <span className="h-3 w-3 rounded-full bg-[#1f9254]/50" />
              <span className="ms-3 rounded-md bg-white px-3 py-1 text-[12px] text-[#5c574c]">work-withme.com/rami</span>
            </div>
            <Image
              src="/mockups/rami-showcase.webp"
              alt="Rami's WorkWith page — a gallery wall of real wedding photography"
              width={1280}
              height={1040}
              loading="lazy"
              className="h-auto w-full"
            />
          </div>

          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-[#5c574c]">
            <span className="inline-flex items-center gap-1.5"><Check /> Their real availability</span>
            <span className="inline-flex items-center gap-1.5"><Check /> Prices, if they want to show them</span>
            <span className="inline-flex items-center gap-1.5"><Check /> WhatsApp-style testimonials</span>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/rami"
              target="_blank"
              className="inline-block rounded-xl border border-[#171310]/10 bg-white px-6 py-3 text-[14px] font-semibold shadow-sm transition-colors hover:bg-[#faf8f3]"
            >
              Open Rami&apos;s page ↗
            </Link>
            <p className="mx-auto mt-4 max-w-md text-[14px] text-[#8a8477]">
              WorkWith is brand new — be one of the first Lebanese freelancers running their work this way.
            </p>
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="scroll-mt-20 bg-[#f2ede3] py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <div className="text-center">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(28px,3.6vw,38px)] font-semibold tracking-[-0.015em]">
              Build for free. Go live for $29 a year.
            </h2>
            <p className="mt-3 text-[16px] text-[#5c574c]">
              No card to start. Build your whole page and see it first — pay only when you&apos;re ready to share it.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Build — free */}
            <div className="order-2 rounded-2xl border border-[#171310]/10 bg-white p-7 shadow-sm md:order-1">
              <h3 className="text-[17px] font-semibold">Build</h3>
              <p className="mt-2">
                <span className="text-[32px] font-semibold">$0</span>
                <span className="text-[14px] text-[#5c574c]"> to try</span>
              </p>
              <p className="mt-2 text-[14px] text-[#5c574c]">
                Make your whole page and preview exactly what clients will see. No card, no rush.
              </p>
              <ul className="mt-5 space-y-2.5">
                {['Pick a template, add your work & prices', 'Voice intro, availability, Arabic & English', 'A private preview of your live page', 'Set up quotes, invoices & your rails', 'Publish anytime for $29/year'].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] text-[#171310]"><Check className="mt-0.5" /> {f}</li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="mt-6 block rounded-xl border border-[#171310]/10 bg-white py-3 text-center text-[14px] font-semibold shadow-sm transition-colors hover:bg-[#faf8f3]"
              >
                Start building — free
              </Link>
            </div>

            {/* Publish — $29 founder */}
            <div className="relative order-1 rounded-2xl border-2 border-[#e8623d] bg-white p-7 shadow-[0_20px_50px_-20px_rgba(232,98,61,.35)] md:order-2">
              <span className="absolute -top-3 start-6 rounded-full bg-[#e8623d] px-3 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-white">
                Founder price · first 100
              </span>
              <h3 className="text-[17px] font-semibold">Publish</h3>
              <p className="mt-2">
                <span className="text-[32px] font-semibold text-[#e8623d]">$29</span>
                <span className="text-[14px] text-[#5c574c]"> / year</span>
              </p>
              <p className="mt-1 text-[13px] text-[#8a8477]">≈ $2.40/mo — locked while you stay a founder.</p>
              <p className="mt-2 text-[14px] text-[#5c574c]">Your page goes live at your own link — and the whole business runs behind it.</p>
              <p className="mt-5 text-[13px] font-semibold text-[#171310]">Everything in Build, plus:</p>
              <ul className="mt-2.5 space-y-2.5">
                {['Your page LIVE at work-withme.com/you', 'Your own QR business card, ready to share', 'Unlimited quotes, invoices & receipts', 'Automatic USDT payment detection', 'Your own branding, no WorkWith mark'].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] text-[#171310]"><Check className="mt-0.5" /> {f}</li>
                ))}
              </ul>
              <p className="mt-4 text-[13px] text-[#8a8477]">Pay by USDT (instant) or Whish, bank &amp; cash. Money goes straight to us — never a cut of yours.</p>
              <Link
                href="/auth/signup"
                className="mt-4 block rounded-xl bg-[#e8623d] py-3 text-center text-[14px] font-bold text-white transition-colors hover:bg-[#d4512f]"
              >
                Start free — publish when you&apos;re ready
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-[13px] text-[#8a8477]">
            No card required to start building. WorkWith never takes a cut of what you earn from clients.
          </p>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <h2 className="text-center font-serif text-[clamp(30px,4vw,40px)] font-semibold tracking-[-0.015em]">
            Questions, answered.
          </h2>
          <FaqAccordion items={FAQ} />
        </div>
      </section>

      {/* ================= FINAL CTA (dark) ================= */}
      <section className="border-t border-[#c9a45c]/40 bg-[#0e0f13] py-28 text-center text-[#f4f2ec]">
        <div className="mx-auto max-w-2xl px-6">
          <p className="font-[family-name:var(--font-tajawal)] text-[15px] text-[#e8623d]" dir="rtl" lang="ar">شغلك مرتّب، وحقّك بلا إحراج</p>
          <h2 className="mt-3 font-serif text-[clamp(30px,4vw,40px)] font-semibold tracking-[-0.015em] text-[#f4f2ec]">
            Stop running your business in your DMs.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[16px] leading-[1.55] text-white/70">
            The page brings clients in. WorkWith carries the job from first message to paid — quote,
            invoice, reminder, done — all in one place, so nothing lives in your chat history anymore.
            Free to start.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-[#e8623d] px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#d4512f]"
            >
              Start building — free
            </Link>
            <Link
              href="/examples"
              className="rounded-xl border border-white/20 px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-white/5"
            >
              See real pages ↗
            </Link>
          </div>
          <p className="mt-6 text-[13px] text-white/50">Free to build · $29/year to go live · be one of the first 100 founders</p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#f2ede3] py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <span className="font-serif text-[20px] font-semibold text-[#171310]">
                WorkWith<span className="text-[#e8623d]">.</span>
              </span>
              <p className="mt-2 max-w-xs text-[14px] text-[#5c574c]">
                Run your freelance business — from the first “how much?” to paid. Made in Beirut, for Lebanon.
              </p>
              <a
                href={FOUNDER_WA}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[14px] text-[#5c574c] transition-colors hover:text-[#e8623d]"
              >
                <FaWhatsapp /> Let&apos;s talk
              </a>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8a8477]">Product</p>
              <ul className="mt-3 space-y-2 text-[14px] text-[#5c574c]">
                <li><Link href="/auth/signup" className="hover:text-[#171310]">Make your page</Link></li>
                <li><Link href="/examples" className="hover:text-[#171310]">See real pages</Link></li>
                <li><a href="#showcase" className="hover:text-[#171310]">The showcase</a></li>
                <li><a href="#pricing" className="hover:text-[#171310]">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[#8a8477]">Company</p>
              <ul className="mt-3 space-y-2 text-[14px] text-[#5c574c]">
                <li><a href="#faq" className="hover:text-[#171310]">FAQ</a></li>
                <li><Link href="/auth/signin" className="hover:text-[#171310]">Log in</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col justify-between gap-2 border-t border-[#171310]/10 pt-6 text-[13px] text-[#8a8477] sm:flex-row">
            <span>© 2026 WorkWith · work-withme.com</span>
            <span className="rounded-full border border-[#171310]/10 px-2.5 py-0.5">EN · العربية</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Single-stroke coral glyphs for the Why-Lebanon cards — no brand/payment logos.
function WalletIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e8623d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" />
      <path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3" />
      <path d="M21 12h-4a2 2 0 0 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e8623d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#e8623d" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  )
}
