import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'malaf — how you get paid',
  description:
    'The page is free. The part you pay for is the machine that collects your money without the awkward conversation.',
}

// Fully static marketing walkthrough — every "open the real thing" link is a
// live token page backed by permanent demo documents (rami profile), so a
// prospect touches the actual product, not screenshots.
export const revalidate = 3600

const CHASER_BUBBLES = [
  {
    day: 'Day 1 overdue',
    text: 'Hi Rima, just a gentle reminder about the invoice for $450 — malaf.work/i/…. Thank you!',
    time: '10:12',
  },
  {
    day: 'Day 7',
    text: 'Hi Rima, following up again on the invoice for $450 — would appreciate it if you could settle it soon. Thanks!',
    time: '9:41',
  },
  {
    day: 'Day 14',
    text: "Hi Rima, this is a final reminder for the invoice for $450, which is now significantly overdue. Please let me know if there's an issue.",
    time: '11:05',
  },
]

function Beat({ n, title, children }: { n: number; title: string; children: React.ReactNode }) {
  return (
    <section className="mt-10">
      <div className="flex items-baseline gap-3">
        <span className="flex h-7 w-7 shrink-0 -translate-y-0.5 items-center justify-center rounded-full bg-[#e8623d] text-[13px] font-bold text-white">
          {n}
        </span>
        <h2 className="text-[19px] font-semibold tracking-tight">{title}</h2>
      </div>
      <div className="mt-3 ps-10">{children}</div>
    </section>
  )
}

function LiveLink({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-xl border border-[#171310]/15 bg-white px-4 py-2.5 text-[13.5px] font-semibold shadow-sm transition-colors hover:border-[#e8623d]"
    >
      <span className="h-2 w-2 rounded-full bg-[#1f9254]" />
      {label}
      <span className="text-[#5c574c]">↗</span>
    </a>
  )
}

export default function DemoPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#171310]">
      <div className="mx-auto max-w-md px-6 pb-20 pt-14">
        <Link href="/" className="text-xl font-semibold lowercase tracking-tight">malaf</Link>

        <h1 className="mt-8 text-[30px] font-semibold leading-[1.15] tracking-tight">
          The page is free.
          <br />
          <span className="text-[#e8623d]">Getting paid</span> is the product.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-[#5c574c]">
          Watch one job travel from &ldquo;interested&rdquo; to money in your account — every link
          below opens the real thing, exactly as your client would see it.
        </p>

        <Beat n={1} title="A client lands on your card">
          <p className="mb-3 text-[13.5px] leading-relaxed text-[#5c574c]">
            Portfolio, prices, voice intro — a page that sells you while you sleep. This part is
            free, forever.
          </p>
          <LiveLink href="/rami" label="Open Rami's live card" />
        </Beat>

        <Beat n={2} title="One tap, and they've approved the quote">
          <p className="mb-3 text-[13.5px] leading-relaxed text-[#5c574c]">
            No account, no app, no PDF attachments — a link that works on any phone, with a record
            of who approved what, and when.
          </p>
          <LiveLink href="/q/demoquote-rami-00001" label="See the approved quote" />
        </Beat>

        <Beat n={3} title="Then the part nobody else does for you">
          <p className="text-[15px] font-semibold leading-snug" dir="rtl" lang="ar">
            مين بيحكي عن المصاري؟ مش أنت.
          </p>
          <p className="mt-1.5 mb-4 text-[13.5px] leading-relaxed text-[#5c574c]">
            The invoice is 8 days overdue. malaf writes the reminder — polite, escalating, in your
            client&rsquo;s language — and you send it with one tap. You are never the one who has
            to bring up money.
          </p>

          {/* WhatsApp-style chaser preview */}
          <div className="space-y-4 rounded-2xl bg-[#0b141a] p-4">
            {CHASER_BUBBLES.map(b => (
              <div key={b.day}>
                <p className="mb-1.5 text-center text-[10px] font-semibold uppercase tracking-wider text-[#8696a0]">
                  {b.day}
                </p>
                <div className="ms-auto max-w-[88%]">
                  <div className="rounded-lg rounded-se-none bg-[#005c4b] px-3 py-2 shadow-[0_1px_1px_rgba(0,0,0,.35)]">
                    <p className="text-[13px] leading-relaxed text-[#e9edef]">{b.text}</p>
                    <p className="mt-1 text-end text-[10px] leading-none text-[#8696a0]">
                      {b.time} <span className="text-[#53bdeb]">✓✓</span>
                    </p>
                  </div>
                </div>
              </div>
            ))}
            <p className="pt-1 text-center text-[11px] text-[#8696a0]">
              …or in Arabic, if that&rsquo;s your client&rsquo;s language
            </p>
          </div>
          <p className="mt-2 text-[11.5px] text-[#5c574c]">
            You review and edit every message before it opens in WhatsApp. Nothing sends itself.
          </p>
        </Beat>

        <Beat n={4} title="They see exactly how to pay you">
          <p className="mb-3 text-[13.5px] leading-relaxed text-[#5c574c]">
            Whish, USDT, bank transfer, cash — your rails, your numbers, one page. USDT payments
            even confirm themselves automatically on the exact amount.
          </p>
          <LiveLink href="/p/demopay-rami-0000001" label="Open the live pay page" />
        </Beat>

        <Beat n={5} title="The receipt sends itself">
          <p className="mb-3 text-[13.5px] leading-relaxed text-[#5c574c]">
            You confirm the money arrived — the receipt exists instantly, ready to share. Your
            whole history of quotes, invoices, and payments stays in one place.
          </p>
          <LiveLink href="/r/demorcpt-rami-00001" label="See the receipt" />
        </Beat>

        {/* pricing */}
        <section className="mt-14">
          <div className="rounded-2xl border border-[#171310]/10 bg-white p-5 shadow-sm">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[15px] font-semibold">The card</h3>
              <span className="text-[22px] font-semibold">Free</span>
            </div>
            <p className="mt-1 text-[12.5px] text-[#5c574c]">
              Your page, portfolio, QR card, quote requests, 3 documents a month. No credit card,
              no strings.
            </p>
          </div>

          <div className="relative mt-4 rounded-2xl border-2 border-[#e8623d] bg-white p-5 shadow-sm">
            <span className="absolute -top-3 start-4 rounded-full bg-[#e8623d] px-3 py-0.5 text-[10.5px] font-bold uppercase tracking-wide text-white">
              Founder deal · first 100
            </span>
            <div className="flex items-baseline justify-between">
              <h3 className="text-[15px] font-semibold">The collector</h3>
              <div className="text-end">
                <span className="text-[22px] font-semibold text-[#e8623d]">$29</span>
                <span className="text-[12.5px] text-[#5c574c]"> /year</span>
              </div>
            </div>
            <p className="mt-1 text-[12.5px] text-[#5c574c]">
              Everything free has, plus the chaser, unlimited documents, automatic USDT detection,
              and your own branding. That&rsquo;s $2.4 a month — one chased invoice pays for it
              five times over.
            </p>
            <Link
              href="/auth/signup"
              className="mt-4 block rounded-xl bg-[#e8623d] py-3 text-center text-[14px] font-bold text-white"
            >
              Start free — upgrade when it pays for itself
            </Link>
            <p className="mt-2 text-center text-[11px] text-[#5c574c]">
              Pay by Whish or USDT · not happy? Money back within 30 days
            </p>
          </div>
        </section>
      </div>
    </main>
  )
}
