import Link from 'next/link'
import Image from 'next/image'
import { FaWhatsapp } from 'react-icons/fa'
import { Nav, FOUNDER_WA } from '@/components/home/Nav'
import { buildFounderWa } from '@/lib/founder'
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion'
import { HeroPageCycler } from '@/components/home/HeroPageCycler'

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
    a: "It's a free, professional page for your freelance work — the kind that makes clients take you seriously. You pick a look, add your work, and publish it live at your own link in minutes. Clients open it on any phone, see your work, and message you straight on WhatsApp. No app, no login for them.",
  },
  {
    q: 'How is this different from Carrd or Linktree?',
    a: "Those give you a link — a list of buttons. WorkWith gives you a real page: big type, your work up front, a face, an accent, an Arabic version. The difference is looking like a hobby versus looking like a studio. A link says 'here's my stuff.' A WorkWith page says 'this person is the real deal.'",
  },
  {
    q: "Is it really free?",
    a: "Yes. Build it, publish it live at your own link, and share it — no card, ever, and it stays yours. Later there'll be optional upgrades for people who want more (your own domain, removing the WorkWith mark, custom design work), but the page itself is free.",
  },
  {
    q: 'Do I need a website or any tech skills?',
    a: "No. You pick a look, add your work, and you're live in minutes. Nothing to install, no code — if you can post to Instagram, you can build this.",
  },
  {
    q: 'Do my clients need to download an app or make an account?',
    a: "Never. They just open your link on any phone — see your work, message you on WhatsApp — all on a normal web page, no login, no app. That's a rule we don't break.",
  },
  {
    q: 'Can my page be in Arabic?',
    a: 'Yes — one tap flips your whole page to a full Arabic, right-to-left version. And it stays light and fast so it opens instantly, even on a weak connection.',
  },
  {
    q: "I'm just starting out — is this only for big names?",
    a: "Not at all. WorkWith is new, and you can be one of the first on it. A clean, confident page makes you look established from day one — whether you've shot two weddings or two hundred.",
  },
  {
    q: 'Can I see real pages before I sign up?',
    a: "Yes — see real example pages before you sign up. That's exactly what your own page can look like.",
  },
]

function Check({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#C9F73B" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
}

function Eyebrow({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-[12px] font-semibold uppercase tracking-[0.14em] text-[#C9F73B] ${className}`}>{children}</p>
}

export default function Home() {
  return (
    <div className="bg-[#0B0B0C] text-[#FAFAF7]">
      <Nav />

      {/* ================= HERO — the product IS the pitch ================= */}
      <section className="mx-auto grid max-w-6xl items-center gap-12 px-6 pt-16 pb-28 lg:grid-cols-2 lg:px-10">
        {/* left — identity + transformation, not a feature list */}
        <div className="text-center lg:text-left">
          <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-[12px] font-medium text-[rgba(250,250,247,0.72)]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9F73B]" />
            The page every Lebanese freelancer deserves
          </span>

          <h1 className="mt-6 font-serif text-[clamp(40px,6vw,66px)] font-semibold leading-[1.02] tracking-[-0.02em] mx-auto max-w-[16ch] lg:mx-0">
            Your work is world-class.{' '}
            <span className="text-[#C9F73B]">Make your page look like it.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-[17px] leading-[1.55] text-[rgba(250,250,247,0.72)] lg:mx-0">
            Right now clients judge you by your Instagram grid or a screenshot of prices. In one tap,
            WorkWith turns your work into a real page — the kind that makes a client think “okay, these
            people are serious.” Free, in Arabic or English, live in minutes.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-[#C9F73B] px-6 py-3.5 text-[15px] font-bold text-[#0B0B0C] transition-colors hover:bg-[#A6D820] active:translate-y-px"
            >
              Build mine free →
            </Link>
            <Link
              href="/examples"
              className="rounded-xl border border-white/20 bg-white/5 px-6 py-3.5 text-[15px] font-semibold text-[#FAFAF7] transition-colors hover:bg-white/10"
            >
              See real pages ↗
            </Link>
          </div>
          <p className="mt-3 max-w-md text-[13px] text-[rgba(250,250,247,0.5)] mx-auto lg:mx-0">
            Free to build and publish — no card, ever. It’s yours.
          </p>
        </div>

        {/* right — a phone cycling through real freelancer pages (show, don't tell) */}
        <div className="relative flex justify-center lg:justify-end">
          <HeroPageCycler />
        </div>
      </section>

      {/* ================= WHY IT'S DIFFERENT ================= */}
      <section className="bg-[#141417] py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center">
            <Eyebrow>Not a link. A presence.</Eyebrow>
            <h2 className="mx-auto mt-3 max-w-3xl font-serif text-[clamp(28px,3.6vw,38px)] font-semibold tracking-[-0.015em]">
              Everyone can make a link. Almost no one looks like they mean it.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {[
              {
                icon: GlobeIcon,
                title: 'Looks like a studio',
                body: 'Real page design — big type, your work front and centre, a face and an accent that feel like you. The kind of page that makes a client assume you charge more, and treat you like it.',
              },
              {
                icon: ChatIcon,
                title: 'Built for here',
                body: 'One tap to a full Arabic, right-to-left version. Light enough to open instantly on any phone, on any connection. A “message me” button that lands straight in WhatsApp — where your clients already are.',
              },
              {
                icon: WalletIcon,
                title: 'Live in minutes, yours forever',
                body: 'Pick your trade, add your work, publish at your own link — free, no card, no code. If you can post to Instagram, you can build this. And it stays yours.',
              },
            ].map(card => (
              <div key={card.title} className="rounded-2xl border border-white/10 bg-[#141417] p-6">
                <card.icon />
                <h3 className="mt-4 font-serif text-[19px] font-semibold leading-snug">{card.title}</h3>
                <p className="mt-2 text-[14px] leading-relaxed text-[rgba(250,250,247,0.72)]">{card.body}</p>
              </div>
            ))}
          </div>

          <p className="mx-auto mt-12 max-w-2xl text-center text-[18px] leading-[1.5] text-[#FAFAF7]">
            Carrd and Linktree give you a link. WorkWith gives you a page people take seriously — the
            difference between “here’s my stuff” and “this person is the real deal.”
          </p>
        </div>
      </section>

      {/* ================= SHOWCASE / PROOF ================= */}
      <section id="showcase" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <Eyebrow>What yours can look like</Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(30px,4vw,40px)] font-semibold tracking-[-0.015em]">
              This is the page clients will see.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-[1.55] text-[rgba(250,250,247,0.72)]">
              Big type, your work up front, your face, your accent — a page that looks like a real studio.
              This is one example; every trade gets its own look.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-4xl overflow-hidden rounded-2xl border border-[#FAFAF7]/10 bg-white shadow-[0_20px_50px_-20px_rgba(23,19,16,.25)]">
            <div className="flex items-center gap-2 border-b border-[#FAFAF7]/10 bg-[#141417] px-4 py-3">
              <span className="h-3 w-3 rounded-full bg-[#C9F73B]/60" />
              <span className="h-3 w-3 rounded-full bg-[#C9F73B]/60" />
              <span className="h-3 w-3 rounded-full bg-[#C9F73B]/50" />
              <span className="ms-3 rounded-md bg-white/10 px-3 py-1 font-mono text-[12px] text-[rgba(250,250,247,0.72)]">work-withme.com/you</span>
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

          <div className="mx-auto mt-8 flex max-w-2xl flex-wrap justify-center gap-x-6 gap-y-2 text-[14px] text-[rgba(250,250,247,0.72)]">
            <span className="inline-flex items-center gap-1.5"><Check /> Their real availability</span>
            <span className="inline-flex items-center gap-1.5"><Check /> Prices, if they want to show them</span>
            <span className="inline-flex items-center gap-1.5"><Check /> WhatsApp-style testimonials</span>
          </div>

          <div className="mt-10 text-center">
            <Link
              href="/examples"
              className="inline-block rounded-xl border border-white/20 bg-white/5 px-6 py-3 text-[14px] font-semibold text-[#FAFAF7] transition-colors hover:bg-white/10"
            >
              Browse real pages ↗
            </Link>
            <p className="mx-auto mt-4 max-w-md text-[14px] text-[rgba(250,250,247,0.5)]">
              WorkWith is brand new — be one of the first Lebanese freelancers with a page like this.
            </p>
          </div>
        </div>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="scroll-mt-20 bg-[#141417] py-28">
        <div className="mx-auto max-w-3xl px-6 lg:px-10">
          <div className="text-center">
            <Eyebrow>Pricing</Eyebrow>
            <h2 className="mt-3 font-serif text-[clamp(28px,3.6vw,38px)] font-semibold tracking-[-0.015em]">
              Free. Your page, live, today.
            </h2>
            <p className="mt-3 text-[16px] text-[rgba(250,250,247,0.72)]">
              No card, no catch. Build it and publish it live at your own link — free. We never take a
              cut of what you earn.
            </p>
          </div>

          <div className="mx-auto mt-12 max-w-md">
            <div className="relative rounded-2xl border-2 border-[#C9F73B] bg-[#141417] p-8 shadow-[0_20px_50px_-40px_rgba(201,247,59,.5)]">
              <span className="absolute -top-3 start-6 rounded-full bg-[#C9F73B] px-3 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-[#0B0B0C]">
                Free · everything
              </span>
              <h3 className="text-[15px] font-semibold text-[rgba(250,250,247,0.5)]">Your own link, live</h3>
              {/* The URL is the headline value — you GET work-withme.com/yourname. */}
              <p className="mt-1.5 flex flex-wrap items-baseline gap-x-1 font-serif text-[clamp(20px,3vw,26px)] font-semibold tracking-tight">
                <span className="text-[#FAFAF7]">work-withme.com/</span>
                <span className="text-[#C9F73B]">yourname</span>
              </p>
              <p className="mt-3">
                <span className="text-[36px] font-semibold text-[#C9F73B]">$0</span>
                <span className="text-[14px] text-[rgba(250,250,247,0.72)]"> — always yours</span>
              </p>
              <ul className="mt-5 space-y-2.5">
                {[
                  'Your page LIVE at work-withme.com/you',
                  'Pick a look, add your work & prices',
                  'One-tap full Arabic & English',
                  'A “message me” button straight to WhatsApp',
                  'Your own QR card to share',
                  'Clients open it — no app, no login',
                ].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] text-[#FAFAF7]"><Check className="mt-0.5" /> {f}</li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="mt-6 block rounded-xl bg-[#C9F73B] py-3 text-center text-[14px] font-bold text-[#0B0B0C] transition-colors hover:bg-[#A6D820]"
              >
                Make your page — free
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-[13px] text-[rgba(250,250,247,0.5)]">
            Paid upgrades are coming later (your own domain, remove the WorkWith mark). The page itself
            stays free — WorkWith never takes a cut of what you earn from clients.
          </p>
        </div>
      </section>

      {/* ============ QUIET AGENCY SECOND ACT ============ */}
      {/* Low on the page, for people who've seen the free tool and want more. Subtle,
          "we elevate serious brands" — not a hard sell. The free tool is the taste. */}
      <section className="py-20">
        <div className="mx-auto max-w-3xl px-6 text-center lg:px-10">
          <p className="text-[12px] font-semibold uppercase tracking-[0.16em] text-[rgba(250,250,247,0.5)]">Running something bigger?</p>
          <h2 className="mx-auto mt-3 max-w-2xl font-serif text-[clamp(24px,3.2vw,34px)] font-semibold tracking-[-0.015em]">
            The free page makes you look established. We make brands look <span className="text-[#C9F73B]">untouchable.</span>
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-[15px] leading-relaxed text-[rgba(250,250,247,0.72)]">
            Beyond the free tool, we design custom, elevated online presences for the studios, brands,
            and businesses that want more than a great page. Same team behind WorkWith.
          </p>
          <a
            href={buildFounderWa("Hi — I saw WorkWith and I'd like to talk about a custom / elevated presence for my brand.")}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-6 inline-flex items-center gap-2 text-[14px] font-bold text-[#FAFAF7] underline decoration-[#C9F73B] decoration-2 underline-offset-4 hover:text-[#C9F73B]"
          >
            Talk about elevating your brand →
          </a>
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
      <section className="border-t border-[#C9F73B]/40 bg-[#0B0B0C] py-28 text-center text-[#FAFAF7]">
        <div className="mx-auto max-w-2xl px-6">
          <h2 className="font-serif text-[clamp(32px,4.5vw,46px)] font-semibold tracking-[-0.015em] text-[#FAFAF7]">
            Your work deserves a page that respects it.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[16px] leading-[1.55] text-white/70">
            Claim your link, add your work, and be live in minutes — <span className="text-[#C9F73B]">work-withme.com/yourname</span>.
            Free, and it stays yours.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-[#C9F73B] px-6 py-3 text-[14px] font-bold text-[#0B0B0C] transition-colors hover:bg-[#A6D820]"
            >
              Start building — free
            </Link>
            <a
              href={buildFounderWa("Hi — I'd like to talk about a custom / elevated presence.")}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-xl border border-white/20 px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-white/5"
            >
              Message us for a custom ↗
            </a>
          </div>
          <p className="mt-6 text-[13px] text-white/50">Free to build and publish · your own link · we elevate brands that want more</p>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="bg-[#141417] py-16">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="grid gap-8 md:grid-cols-[1.5fr_1fr_1fr]">
            <div>
              <span className="font-serif text-[20px] font-semibold text-[#FAFAF7]">
                WorkWith<span className="text-[#C9F73B]">.</span>
              </span>
              <p className="mt-2 max-w-xs text-[14px] text-[rgba(250,250,247,0.72)]">
                Run your freelance business — from the first “how much?” to paid. Made in Beirut, for Lebanon.
              </p>
              <a
                href={FOUNDER_WA}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-flex items-center gap-1.5 text-[14px] text-[rgba(250,250,247,0.72)] transition-colors hover:text-[#C9F73B]"
              >
                <FaWhatsapp /> Let&apos;s talk
              </a>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[rgba(250,250,247,0.5)]">Product</p>
              <ul className="mt-3 space-y-2 text-[14px] text-[rgba(250,250,247,0.72)]">
                <li><Link href="/auth/signup" className="hover:text-[#FAFAF7]">Make your page</Link></li>
                <li><a href="#showcase" className="hover:text-[#FAFAF7]">The showcase</a></li>
                <li><a href="#pricing" className="hover:text-[#FAFAF7]">Pricing</a></li>
              </ul>
            </div>
            <div>
              <p className="text-[12px] font-semibold uppercase tracking-wider text-[rgba(250,250,247,0.5)]">Company</p>
              <ul className="mt-3 space-y-2 text-[14px] text-[rgba(250,250,247,0.72)]">
                <li><a href="#faq" className="hover:text-[#FAFAF7]">FAQ</a></li>
                <li><Link href="/auth/signin" className="hover:text-[#FAFAF7]">Log in</Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-10 flex flex-col justify-between gap-2 border-t border-[#FAFAF7]/10 pt-6 text-[13px] text-[rgba(250,250,247,0.5)] sm:flex-row">
            <span>© 2026 WorkWith · work-withme.com</span>
            <span className="rounded-full border border-[#FAFAF7]/10 px-2.5 py-0.5">EN · العربية</span>
          </div>
        </div>
      </footer>
    </div>
  )
}

// Single-stroke coral glyphs for the Why-Lebanon cards — no brand/payment logos.
function WalletIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C9F73B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h13a1 1 0 0 1 1 1v2" />
      <path d="M3 7v10a2 2 0 0 0 2 2h14a1 1 0 0 0 1-1v-3" />
      <path d="M21 12h-4a2 2 0 0 0 0 4h4a1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1Z" />
    </svg>
  )
}

function ChatIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C9F73B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 11.5a8.38 8.38 0 0 1-8.5 8.5 8.5 8.5 0 0 1-3.8-.9L3 21l1.9-5.7A8.38 8.38 0 0 1 4 11.5 8.5 8.5 0 0 1 12.5 3 8.38 8.38 0 0 1 21 11.5Z" />
    </svg>
  )
}

function GlobeIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#C9F73B" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18" />
      <path d="M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18Z" />
    </svg>
  )
}
