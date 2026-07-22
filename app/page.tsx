import Link from 'next/link'
import Image from 'next/image'
import { FaWhatsapp } from 'react-icons/fa'
import { Nav, FOUNDER_WA } from '@/components/home/Nav'
import { FaqAccordion, type FaqItem } from '@/components/home/FaqAccordion'
import { HeroFloat, FloatPill } from '@/components/home/HeroFloat'

// ---------------------------------------------------------------------------
// WorkWith homepage — builder-first. The page (free) is the hook; getting paid
// through it is the paid upgrade. Proof is ONE real page (/rami), shown honestly
// and labeled as an example. No fabricated stats/testimonials, Lebanon only.
// ---------------------------------------------------------------------------

const FAQ: FaqItem[] = [
  {
    q: 'Do I need a website or any tech skills?',
    a: "No. You pick a look, add your work, and you're live in minutes. There's nothing to install and no code — if you can post to Instagram, you can build this.",
  },
  {
    q: 'Do my clients need to download an app or make an account?',
    a: "Never. They just open your link — on any phone, even on bad 3G. Seeing your work, requesting a quote, paying — all on a normal web page, no login, no app. That's a rule, not a feature we might change.",
  },
  {
    q: 'How do clients pay me? Does WorkWith take a cut?',
    a: 'However you already get paid — Whish, USDT, bank transfer, or cash. You set up your own rails and WorkWith shows your client exactly how to pay you, then tracks what’s paid. The money goes straight to you; it never passes through us, and we never take a percentage.',
  },
  {
    q: 'Will it send messages for me automatically?',
    a: "No — and that's on purpose. WorkWith writes the polite reminder in your client's language; you tap once and it opens in WhatsApp ready to send. You're always the one who hits send.",
  },
  {
    q: 'Can my page be in Arabic?',
    a: 'Yes. Your page has a one-tap full Arabic, right-to-left version, and your quotes, invoices, and receipts can go out in Arabic or English per client. The microcopy is written how people actually talk, not stiff formal Arabic.',
  },
  {
    q: "What's the voice intro?",
    a: "A 20-second clip in your own voice with a play button at the top of your page. It's the fastest way to feel personal — something no link-in-bio tool gives you.",
  },
  {
    q: "I'm just starting out — is this only for big names?",
    a: 'Not at all. WorkWith is new, and you can be one of the first freelancers on it. A clean page makes you look established from day one, whether you’ve shot two weddings or two hundred.',
  },
  {
    q: 'Can I see a real page before I sign up?',
    a: "Yes — open Rami's live page. It's a real WorkWith page, exactly what your own clients would see.",
  },
]

function Check({ className = '' }: { className?: string }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#e8623d" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" className={`shrink-0 ${className}`}>
      <path d="M20 6L9 17l-5-5" />
    </svg>
  )
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
            Made in Beirut · for Lebanese freelancers
          </span>

          <h1 className="mt-6 font-serif text-[clamp(40px,6vw,64px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            A page that looks better than your Instagram —{' '}
            <span className="text-[#e8623d]">in minutes.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-md text-[18px] leading-[1.55] text-[#5c574c] lg:mx-0">
            Your work, your prices, even a voice note in your own voice — one beautiful link you put
            on your bio, your QR card, anywhere. No website builder. No code. Free to start.
          </p>

          <div className="mt-8 flex flex-col items-center gap-3 sm:flex-row lg:items-start">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-[#e8623d] px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#d4512f] active:translate-y-px"
            >
              Make your page — free
            </Link>
            <Link
              href="/rami"
              className="rounded-xl border border-[#171310]/10 bg-white px-6 py-3 text-[14px] font-semibold shadow-sm transition-colors hover:bg-[#faf8f3]"
            >
              See Rami&apos;s page ↗
            </Link>
          </div>
          <p className="mt-3 text-[13px] text-[#8a8477]">
            Free forever. Upgrade only when you want to get paid through it.
          </p>

          <div className="mt-8 flex flex-wrap justify-center gap-x-5 gap-y-2 text-[13px] text-[#5c574c] lg:justify-start">
            {['Voice intro in your own voice', 'One-tap Arabic & English', 'Your own QR business card', 'Clients need no app'].map(c => (
              <span key={c} className="inline-flex items-center gap-1.5">
                <Check /> {c}
              </span>
            ))}
          </div>
        </div>

        {/* right — the phone mockup (real /rami screenshot) */}
        <div className="relative flex justify-center lg:justify-end">
          {/* faint coral glow behind the frame */}
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

            {/* floating callout pills (desktop only — kept subtle) */}
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

      {/* ================= SHOWCASE / PROOF ================= */}
      <section id="showcase" className="scroll-mt-20 bg-[#f2ede3] py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e8623d]">A real WorkWith page</p>
            <h2 className="mt-3 font-serif text-[clamp(30px,4vw,40px)] font-semibold tracking-[-0.015em]">
              This is what your clients will see.
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-[16px] leading-[1.55] text-[#5c574c]">
              Rami is a Beirut wedding photographer. This is his actual WorkWith page — the same one
              you&apos;ll build for your work.
            </p>
            <p className="mt-2 text-[13px] text-[#8a8477]">
              An example page we built to show what yours could feel like — not customer data.
            </p>
          </div>

          {/* browser-chrome frame around the real /rami desktop screenshot */}
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

          {/* honest feature callouts (plain list — no fabricated overlays) */}
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
              WorkWith is brand new — be one of the first Lebanese freelancers with a page like this.
            </p>
          </div>
        </div>
      </section>

      {/* ================= HOW IT WORKS ================= */}
      <section id="how" className="scroll-mt-20 py-24">
        <div className="mx-auto max-w-6xl px-6 lg:px-10">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e8623d]">How it works</p>
            <h2 className="mt-3 font-serif text-[clamp(30px,4vw,40px)] font-semibold tracking-[-0.015em]">
              Live in three steps.
            </h2>
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-3">
            {[
              {
                n: '01',
                title: 'Pick your look',
                body: 'Choose a template that fits your trade — editorial, minimal, or warm. Your accent color is pulled from your own photos, so it already feels like you.',
              },
              {
                n: '02',
                title: 'Add your work & your voice',
                body: 'Drop in photos, prices, a testimonial, and a 20-second voice intro in your own voice. Write in Arabic, English, or both.',
              },
              {
                n: '03',
                title: 'Share one link',
                body: "Get your work-withme.com/yourname link and a printable QR card. Put it in your bio, your WhatsApp, on a sticker — you're live.",
              },
            ].map(step => (
              <div key={step.n} className="rounded-2xl border border-[#171310]/8 bg-white p-6 shadow-sm">
                <div className="font-serif text-[44px] font-semibold leading-none text-[#e8623d]">{step.n}</div>
                <h3 className="mt-4 font-serif text-[20px] font-semibold">{step.title}</h3>
                <p className="mt-2 text-[15px] leading-relaxed text-[#5c574c]">{step.body}</p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/auth/signup"
              className="inline-block rounded-xl bg-[#e8623d] px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#d4512f]"
            >
              Make your page — free
            </Link>
            <p className="mt-3 text-[13px] text-[#8a8477]">No credit card. Free forever.</p>
          </div>
        </div>
      </section>

      {/* ================= PAYMENTS (dark band, the paid upgrade) ================= */}
      <section id="getpaid" className="scroll-mt-20 bg-[#171310] py-28 text-[#f4f2ec]">
        <div className="mx-auto grid max-w-6xl items-center gap-14 px-6 lg:grid-cols-2 lg:px-10">
          {/* left — WhatsApp-style visual */}
          <div className="order-2 lg:order-1">
            <div className="mx-auto max-w-sm space-y-3 rounded-2xl bg-[#0b141a] p-4">
              {/* invoice mini-card (outgoing) */}
              <div className="ms-auto max-w-[90%]">
                <div className="rounded-lg rounded-se-none bg-[#005c4b] p-3 shadow-[0_1px_1px_rgba(0,0,0,.35)]">
                  <div className="rounded-md bg-black/20 p-3">
                    <p className="text-[11px] uppercase tracking-wider text-[#8fd9c6]">Invoice #1042</p>
                    <p className="mt-1 text-[15px] font-bold text-white">$600 · Wedding coverage</p>
                    <div className="mt-2 rounded-md bg-[#e8623d] py-1.5 text-center text-[12px] font-bold text-white">Pay</div>
                  </div>
                  <p className="mt-1 text-end text-[10px] text-[#8696a0]">10:12 <span className="text-[#53bdeb]">✓✓</span></p>
                </div>
              </div>
              {/* drafted reminder (outgoing) */}
              <div className="ms-auto max-w-[90%]">
                <div className="rounded-lg rounded-se-none bg-[#005c4b] px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,.35)]">
                  <p className="text-[13px] leading-relaxed text-[#e9edef]">
                    Hi Mia! Just a gentle reminder about invoice #1042 — $600 for the wedding coverage 🙏 Whenever it&apos;s easy for you. Yeslmo!
                  </p>
                  <p className="mt-1 text-end text-[10px] text-[#8696a0]">9:41</p>
                </div>
                <p className="mt-1.5 text-end">
                  <span className="rounded-full bg-[#e8623d]/15 px-2 py-0.5 text-[11px] font-semibold text-[#e8623d]">
                    Draft — you tap to send
                  </span>
                </p>
              </div>
              {/* rail chips */}
              <div className="flex justify-center gap-2 pt-1">
                {['Whish', 'USDT', 'Bank'].map(r => (
                  <span key={r} className="rounded-full border border-white/15 px-3 py-1 text-[11px] text-[#c8c2b6]">{r}</span>
                ))}
              </div>
              <p className="pt-1 text-center text-[11px] text-[#8696a0]">
                You always tap send. Nothing is ever sent automatically.
              </p>
            </div>
          </div>

          {/* right — copy */}
          <div className="order-1 lg:order-2">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e8623d]">The paid upgrade</p>
            <h2 className="mt-3 font-serif text-[clamp(30px,4vw,40px)] font-semibold leading-tight tracking-[-0.015em] text-[#f4f2ec]">
              Stop chasing clients over WhatsApp. Let the app{' '}
              <span className="text-[#e8623d]">write the awkward message.</span>
            </h2>
            <p className="mt-4 max-w-md text-[16px] leading-[1.55] text-[#c8c2b6]">
              Send a quote, turn it into an invoice, and let WorkWith write the polite, escalating
              reminder when it&apos;s overdue. You tap once and it opens in WhatsApp, ready to send.
              Your client pays on the rails they already use.
            </p>

            <div className="mt-5" dir="rtl" lang="ar">
              <p className="text-[18px] font-semibold text-[#f4f2ec]">مين بيحكي عن المصاري؟ مش إنت.</p>
            </div>
            <p className="mt-1 text-[13px] italic text-[#8a8477]">&ldquo;Who has to bring up the money? Not you.&rdquo;</p>

            <ul className="mt-6 space-y-2.5">
              {[
                'Quotes → invoices → receipts, in Arabic or English',
                'Polite, escalating reminders the app writes — you send them with one tap',
                'Your rails: Whish, USDT, bank transfer, cash — set up once',
                'Automatic USDT detection marks invoices paid for you',
              ].map(f => (
                <li key={f} className="flex items-start gap-2.5 text-[15px] text-[#e9e4d8]">
                  <Check className="mt-1" /> {f}
                </li>
              ))}
            </ul>

            <p className="mt-6 text-[13px] text-[#8a8477]">
              WorkWith never touches your money and never sends a message on its own. You review and send everything.
            </p>
            <Link href="/demo" className="mt-4 inline-block text-[14px] font-semibold text-[#e8623d] hover:underline">
              See the whole flow, live ↗
            </Link>
          </div>
        </div>
        <p className="mt-14 text-center text-[13px] text-[#8a8477]">WorkWith never takes a cut of what you earn.</p>
      </section>

      {/* ================= PRICING ================= */}
      <section id="pricing" className="scroll-mt-20 py-28">
        <div className="mx-auto max-w-4xl px-6 lg:px-10">
          <div className="text-center">
            <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e8623d]">Pricing</p>
            <h2 className="mt-3 font-serif text-[clamp(30px,4vw,40px)] font-semibold tracking-[-0.015em]">
              Free to build. Cheap to get paid.
            </h2>
            <p className="mt-3 text-[16px] text-[#5c574c]">No credit card to start. The page is free forever.</p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {/* Free */}
            <div className="order-2 rounded-2xl border border-[#171310]/10 bg-white p-7 shadow-sm md:order-1">
              <h3 className="text-[17px] font-semibold">The page</h3>
              <p className="mt-2">
                <span className="text-[32px] font-semibold">$0</span>
                <span className="text-[14px] text-[#5c574c]"> / forever</span>
              </p>
              <p className="mt-2 text-[14px] text-[#5c574c]">Everything you need to have a page you&apos;re proud of.</p>
              <ul className="mt-5 space-y-2.5">
                {['Your public page + custom link', 'Portfolio blocks, voice intro, availability', 'QR business card + save-contact', 'Arabic & English', '3 documents / month'].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] text-[#171310]"><Check className="mt-0.5" /> {f}</li>
                ))}
              </ul>
              <Link
                href="/auth/signup"
                className="mt-6 block rounded-xl border border-[#171310]/10 bg-white py-3 text-center text-[14px] font-semibold shadow-sm transition-colors hover:bg-[#faf8f3]"
              >
                Make your page — free
              </Link>
            </div>

            {/* Pro / founder */}
            <div className="relative order-1 rounded-2xl border-2 border-[#e8623d] bg-white p-7 shadow-[0_20px_50px_-20px_rgba(232,98,61,.35)] md:order-2">
              <span className="absolute -top-3 start-6 rounded-full bg-[#e8623d] px-3 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-white">
                Founder price · first 100
              </span>
              <h3 className="text-[17px] font-semibold">The collector</h3>
              <p className="mt-2">
                <span className="text-[32px] font-semibold text-[#e8623d]">$29</span>
                <span className="text-[14px] text-[#5c574c]"> / year</span>
              </p>
              <p className="mt-1 text-[13px] text-[#8a8477]">≈ $2.40/mo — locked while you stay a founder.</p>
              <p className="mt-2 text-[14px] text-[#5c574c]">For when the page starts bringing in work.</p>
              <p className="mt-5 text-[13px] font-semibold text-[#171310]">Everything in Free, plus:</p>
              <ul className="mt-2.5 space-y-2.5">
                {['The WhatsApp money-chaser', 'Unlimited quotes, invoices & receipts', 'Automatic USDT detection', 'Your own branding, no WorkWith mark'].map(f => (
                  <li key={f} className="flex items-start gap-2.5 text-[14px] text-[#171310]"><Check className="mt-0.5" /> {f}</li>
                ))}
              </ul>
              <p className="mt-4 text-[13px] text-[#8a8477]">One chased invoice pays for it many times over.</p>
              <Link
                href="/auth/signup?plan=pro"
                className="mt-4 block rounded-xl bg-[#e8623d] py-3 text-center text-[14px] font-bold text-white transition-colors hover:bg-[#d4512f]"
              >
                Start free — upgrade when it pays off
              </Link>
            </div>
          </div>

          <p className="mt-8 text-center text-[13px] text-[#8a8477]">
            No card required to start. Subscriptions only — WorkWith never takes a cut of what you earn.
          </p>
        </div>
      </section>

      {/* ================= FAQ ================= */}
      <section id="faq" className="scroll-mt-20 bg-[#f2ede3] py-24">
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
          <p className="font-[family-name:var(--font-tajawal)] text-[15px] text-[#e8623d]" dir="rtl" lang="ar">صفحة مهنية بثواني</p>
          <h2 className="mt-3 font-serif text-[clamp(30px,4vw,40px)] font-semibold tracking-[-0.015em] text-[#f4f2ec]">
            Your clients are one link away.
          </h2>
          <p className="mx-auto mt-4 max-w-md text-[16px] leading-[1.55] text-white/70">
            Build a page you&apos;re proud to send, share it once, and let your work do the talking.
            Free to start — upgrade the day it starts paying off.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/auth/signup"
              className="rounded-xl bg-[#e8623d] px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#d4512f]"
            >
              Make your page — free
            </Link>
            <Link
              href="/rami"
              className="rounded-xl border border-white/20 px-6 py-3 text-[14px] font-semibold text-white transition-colors hover:bg-white/5"
            >
              See Rami&apos;s page ↗
            </Link>
          </div>
          <p className="mt-6 text-[13px] text-white/50">Free forever · no credit card · ready in minutes</p>
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
                A professional page for Lebanese freelancers. Made in Beirut.
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
                <li><Link href="/rami" className="hover:text-[#171310]">See a live page</Link></li>
                <li><a href="#how" className="hover:text-[#171310]">How it works</a></li>
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
