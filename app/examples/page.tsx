import type { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'

export const metadata: Metadata = {
  title: 'Real pages made with WorkWith',
  description:
    'Example WorkWith pages across trades — a brand designer, a photographer, a developer. This is what your own page could look like.',
}

// A gallery of example pages. These are real, published WorkWith pages we built
// as examples (labeled as such) so a visitor can see the range and quality
// before signing up — not one basic card.
export const revalidate = 3600

const EXAMPLES = [
  {
    handle: 'maya',
    name: 'Maya Fakhoury',
    trade: 'Brand & Identity Designer',
    template: 'Frosted Glass',
    cover: '/demo/designer/w1.jpg',
    accent: '#c9622e',
  },
  {
    handle: 'layla',
    name: 'Layla Rahme',
    trade: 'Wedding & Portrait Photographer',
    template: 'Clean Gradient',
    cover: '/demo/photographer/w1.jpg',
    accent: '#b06a4f',
  },
  {
    handle: 'omar',
    name: 'Omar Nassar',
    trade: 'Full-Stack Developer',
    template: 'Midnight',
    cover: '/demo/developer/w1.jpg',
    accent: '#6d8bff',
  },
]

export default function ExamplesPage() {
  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#171310]">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
        <Link href="/" className="font-serif text-[20px] font-semibold tracking-tight">
          WorkWith<span className="text-[#e8623d]">.</span>
        </Link>

        <div className="mt-10 max-w-2xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e8623d]">Real pages</p>
          <h1 className="mt-3 font-serif text-[clamp(32px,5vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            This is what your page could look like.
          </h1>
          <p className="mt-4 text-[17px] leading-[1.55] text-[#5c574c]">
            Three real WorkWith pages, across different trades. We built these as examples — open any of
            them to see exactly what your own clients would see.
          </p>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {EXAMPLES.map(ex => (
            <Link
              key={ex.handle}
              href={`/${ex.handle}`}
              target="_blank"
              className="group overflow-hidden rounded-2xl border border-[#171310]/10 bg-white shadow-sm transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(23,19,16,.25)]"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                  src={ex.cover}
                  alt={`${ex.name} — ${ex.trade}`}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <span
                  className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white"
                  style={{ background: ex.accent }}
                >
                  {ex.template}
                </span>
              </div>
              <div className="p-5">
                <p className="font-serif text-[18px] font-semibold">{ex.name}</p>
                <p className="mt-0.5 text-[14px] text-[#5c574c]">{ex.trade}</p>
                <p className="mt-3 inline-flex items-center gap-1 text-[13px] font-semibold text-[#e8623d]">
                  Open the page ↗
                </p>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 rounded-2xl border border-[#e8623d]/20 bg-white p-8 text-center shadow-sm">
          <h2 className="font-serif text-[24px] font-semibold">Yours takes minutes to build.</h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-[#5c574c]">
            Pick a look, add your work, and preview it free. Publish it live at your own link when you&apos;re ready.
          </p>
          <Link
            href="/auth/signup"
            className="mt-5 inline-block rounded-xl bg-[#e8623d] px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#d4512f]"
          >
            Start building — free
          </Link>
        </div>
      </div>
    </main>
  )
}
