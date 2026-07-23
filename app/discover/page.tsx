import type { Metadata } from 'next'
import Link from 'next/link'
import { listPublishedPages, type DiscoverCard } from '@/lib/public-page'
import { mediaUrl } from '@/lib/media'
import { normalizeAccent } from '@/lib/card-templates'

export const metadata: Metadata = {
  title: 'Discover freelancers on WorkWith',
  description:
    'Browse real freelancers in Lebanon — photographers, developers, designers, tutors and more. Open any page and reach out directly, no app and no login.',
}

// The public directory: a browsable wall of every PUBLISHED WorkWith page. This
// is the DISCOVERY half of a marketplace — zero client login, no custody, links
// straight out to each freelancer's /{handle}. It is NOT "post a job / get bids"
// (that's the cold-start trap); it's "find a freelancer." ISR-cached to keep the
// list off the DB hot path.
export const revalidate = 300

// A readable trade chip from the preset key (falls back to the key itself).
const TRADE_LABEL: Record<string, string> = {
  developer: 'Developer',
  designer: 'Designer',
  photographer: 'Photographer',
  videographer: 'Videographer',
  makeup_artist: 'Makeup artist',
  writer: 'Writer',
  lawyer: 'Lawyer',
  consultant: 'Consultant',
  coach: 'Coach',
  trainer: 'Trainer',
  tutor: 'Tutor',
  architect: 'Architect',
  event_planner: 'Event planner',
  marketer: 'Marketer',
  translator: 'Translator',
}
const tradeLabel = (preset: string | null) =>
  (preset && (TRADE_LABEL[preset] ?? preset.replace(/_/g, ' '))) || 'Freelancer'

function Card({ c }: { c: DiscoverCard }) {
  const accent = normalizeAccent(c.accent_color ?? '#e8623d')
  const img = mediaUrl(c.hero_image_url ?? c.avatar_url)
  const area = c.areas_served?.[0]
  return (
    <Link
      href={`/${c.handle}`}
      target="_blank"
      className="group overflow-hidden rounded-2xl border border-[#171310]/10 bg-white shadow-sm transition-shadow hover:shadow-[0_20px_50px_-20px_rgba(23,19,16,.25)]"
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {img ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={img}
            alt={`${c.full_name} — ${tradeLabel(c.preset)}`}
            loading="lazy"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          // no photo → a warm accent gradient with the initial, never a broken image
          <div
            className="flex h-full w-full items-center justify-center"
            style={{ background: `linear-gradient(135deg, ${accent}, ${accent}22)` }}
          >
            <span className="font-serif text-[56px] font-semibold text-white/90">{c.full_name.charAt(0)}</span>
          </div>
        )}
        <span className="absolute left-3 top-3 rounded-full px-2.5 py-1 text-[11px] font-semibold text-white" style={{ background: accent }}>
          {tradeLabel(c.preset)}
        </span>
      </div>
      <div className="p-5">
        <p className="font-serif text-[18px] font-semibold">{c.full_name}</p>
        <p className="mt-0.5 line-clamp-1 text-[14px] text-[#5c574c]">{c.title || tradeLabel(c.preset)}</p>
        <p className="mt-3 flex items-center justify-between text-[13px]">
          <span className="font-semibold text-[#e8623d]">Open the page ↗</span>
          {area && <span className="text-[#8a8477]">{area}</span>}
        </p>
      </div>
    </Link>
  )
}

export default async function DiscoverPage() {
  const cards = await listPublishedPages()

  return (
    <main className="min-h-screen bg-[#f7f3ec] text-[#171310]">
      <div className="mx-auto max-w-6xl px-6 py-16 lg:px-10 lg:py-24">
        <Link href="/" className="font-serif text-[20px] font-semibold tracking-tight">
          WorkWith<span className="text-[#e8623d]">.</span>
        </Link>

        <div className="mt-10 max-w-2xl">
          <p className="text-[12px] font-semibold uppercase tracking-[0.14em] text-[#e8623d]">Discover</p>
          <h1 className="mt-3 font-serif text-[clamp(32px,5vw,52px)] font-semibold leading-[1.05] tracking-[-0.02em]">
            Freelancers building with WorkWith.
          </h1>
          <p className="mt-4 text-[17px] leading-[1.55] text-[#5c574c]">
            Real people, real pages. Open any one to see their work and reach out directly — no app,
            no login.
          </p>
        </div>

        {cards.length > 0 ? (
          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map(c => <Card key={c.handle} c={c} />)}
          </div>
        ) : (
          <div className="mt-14 rounded-2xl border border-[#171310]/10 bg-white p-10 text-center text-[#5c574c]">
            No pages published yet — be the first.
          </div>
        )}

        <div className="mt-16 rounded-2xl border border-[#e8623d]/20 bg-white p-8 text-center shadow-sm">
          <h2 className="font-serif text-[24px] font-semibold">Want your own page here?</h2>
          <p className="mx-auto mt-2 max-w-md text-[15px] text-[#5c574c]">
            Pick a look, add your work, publish it live at your own link — free, in minutes.
          </p>
          <Link
            href="/auth/signup"
            className="mt-5 inline-block rounded-xl bg-[#e8623d] px-6 py-3 text-[14px] font-bold text-white transition-colors hover:bg-[#d4512f]"
          >
            Make your page — free
          </Link>
        </div>
      </div>
    </main>
  )
}
