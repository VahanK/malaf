// ---------------------------------------------------------------------------
// WorkWith — social post design system (downloadable 1080×1080 marketing posts)
//
// Why this exists: we need a grid of Instagram/WhatsApp marketing posts in the
// SAME format family as the category reference (bold branded tiles, phone
// mockups, milestone card, how-it-works, feature callouts) but in WorkWith's
// OWN visual language — the opposite typographic choice from the reference's
// rounded geometric sans. Here the display face is Fraunces (editorial serif,
// already the homepage H1 face) over Inter, on the brand's ink / lime / cream
// palette. Same post STYLE, deliberately different identity.
//
// These are PURE presentational components (no client hooks) so they render
// identically in the gallery preview and inside the headless-Chromium PNG
// screenshotter (app/api/poster/[slug]). Every poster is authored at exactly
// SIZE×SIZE physical pixels with inline styles (not Tailwind utilities) so the
// screenshot is pixel-exact and immune to any class purging.
//
// Copy rules (from CLAUDE.md + homepage): English-first with dialect Arabic
// accents; the free page is the hook, the money-chaser is the paid engine;
// NO fabricated usage stats or testimonials — the "milestone" tile is a real
// founder offer, not an invented count.
// ---------------------------------------------------------------------------

import type { CSSProperties, ReactNode } from 'react'
import QRCode from 'react-qr-code'

export const SIZE = 1080 // Instagram feed square width, physical px

// Two post shapes: the square feed tile and the tall story/reel canvas. The
// per-trade posts are authored as stories (that's how they get rolled out);
// everything else is a square feed post. Each poster declares its format so the
// render surface, the export API and the gallery all size to it.
export const FORMATS = {
  square: { w: 1080, h: 1080 },
  story: { w: 1080, h: 1920 },
} as const
export type Format = keyof typeof FORMATS

// --- brand tokens (mirrors the homepage / Nav) ----------------------------
const INK = '#0B0B0C'
const PANEL = '#141417'
const PAPER = '#FAFAF7'
const CREAM = '#F4F2EC'
const LIME = '#C9F73B'
const LIME_DK = '#A6D820'
const GOLD = '#C9A45C'
const GREEN = '#3DDC84'
const MUTE_D = 'rgba(250,250,247,0.62)' // muted on dark
const MUTE_L = 'rgba(11,11,12,0.60)' // muted on light

const SERIF = 'var(--font-serif), Georgia, serif'
const SANS = 'var(--font-inter), system-ui, sans-serif'
const ARABIC = 'var(--font-tajawal), sans-serif'

const SITE = 'work-withme.com'

type Variant = 'ink' | 'lime' | 'cream' | 'panel'

const SURFACES: Record<Variant, { bg: string; ink: string; mute: string; accent: string }> = {
  ink: { bg: INK, ink: PAPER, mute: MUTE_D, accent: LIME },
  panel: { bg: PANEL, ink: PAPER, mute: MUTE_D, accent: LIME },
  cream: { bg: CREAM, ink: INK, mute: MUTE_L, accent: LIME_DK },
  lime: { bg: LIME, ink: INK, mute: 'rgba(11,11,12,0.62)', accent: INK },
}

// ---------------------------------------------------------------------------
// Frame — the shared 1080×1080 canvas: padding, optional top "pin" tag, and
// the standing WorkWith footer watermark that keeps the grid recognisable.
// ---------------------------------------------------------------------------
function Frame({
  variant = 'ink',
  format = 'square',
  tag,
  footer = true,
  pad = 84,
  children,
  style,
}: {
  variant?: Variant
  format?: Format
  tag?: string
  footer?: boolean
  pad?: number
  children: ReactNode
  style?: CSSProperties
}) {
  const s = SURFACES[variant]
  const dim = FORMATS[format]
  return (
    <div
      style={{
        position: 'relative',
        width: dim.w,
        height: dim.h,
        background: s.bg,
        color: s.ink,
        fontFamily: SANS,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        padding: pad,
        boxSizing: 'border-box',
        ...style,
      }}
    >
      {tag && (
        <div style={{ display: 'flex' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 10,
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
              color: variant === 'lime' ? INK : s.accent,
              border: `1.5px solid ${variant === 'lime' ? 'rgba(11,11,12,0.28)' : 'rgba(255,255,255,0.18)'}`,
              borderRadius: 999,
              padding: '12px 22px',
              background: variant === 'lime' ? 'rgba(11,11,12,0.05)' : 'rgba(255,255,255,0.04)',
            }}
          >
            <span style={{ width: 10, height: 10, borderRadius: 999, background: s.accent }} />
            {tag}
          </span>
        </div>
      )}

      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: 0 }}>
        {children}
      </div>

      {footer && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Wordmark size={30} on={variant} />
          <span style={{ fontSize: 24, color: s.mute, fontWeight: 500 }}>{SITE}</span>
        </div>
      )}
    </div>
  )
}

function Wordmark({ size = 30, on = 'ink' }: { size?: number; on?: Variant }) {
  const s = SURFACES[on]
  return (
    <span style={{ fontFamily: SERIF, fontSize: size, fontWeight: 600, letterSpacing: '-0.02em', color: s.ink }}>
      WorkWith<span style={{ color: on === 'lime' ? INK : LIME }}>.</span>
    </span>
  )
}

// A portrait phone showing a real product screenshot. Uses a plain <img> (not
// next/image) so the fixed-size poster layout is exact under the screenshotter.
function Phone({
  src,
  width = 360,
  tilt = 0,
  shadow = true,
}: {
  src: string
  width?: number
  tilt?: number
  shadow?: boolean
}) {
  const h = Math.round(width * 2.06)
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: width * 0.13,
        background: '#000',
        padding: width * 0.03,
        boxShadow: shadow ? '0 50px 90px -40px rgba(0,0,0,0.6)' : 'none',
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        flexShrink: 0,
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: width * 0.1, overflow: 'hidden', background: '#111' }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
        {/* notch */}
        <div
          style={{
            position: 'absolute',
            top: width * 0.045,
            left: '50%',
            transform: 'translateX(-50%)',
            width: width * 0.34,
            height: width * 0.055,
            borderRadius: 999,
            background: '#000',
          }}
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// The posters. Each is a pure component consuming no props.
// ---------------------------------------------------------------------------

// 1. Brand tile — the "cover" of the grid.
function Brand() {
  return (
    <Frame variant="cream" footer={false}>
      <div style={{ margin: 'auto', textAlign: 'center' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: 520,
            height: 520,
            borderRadius: 96,
            background: PAPER,
            boxShadow: '0 40px 90px -50px rgba(0,0,0,0.35)',
            border: '1px solid rgba(11,11,12,0.06)',
          }}
        >
          <span style={{ fontFamily: SERIF, fontSize: 108, fontWeight: 600, letterSpacing: '-0.03em', color: INK }}>
            WorkWith<span style={{ color: LIME_DK }}>.</span>
          </span>
        </div>
        <p style={{ margin: '56px auto 0', maxWidth: 760, fontSize: 34, lineHeight: 1.4, color: MUTE_L, fontWeight: 500 }}>
          The freelancer&apos;s front office. Your page, your quotes, your money — from one link.
        </p>
      </div>
    </Frame>
  )
}

// 2. Hook — the category-defining line.
function Hook() {
  return (
    <Frame variant="ink" tag="For freelancers in Lebanon">
      <h1 style={{ fontFamily: SERIF, fontSize: 92, lineHeight: 1.04, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
        If you can post on Instagram,
        <br />
        <span style={{ color: LIME }}>you can build the page that gets you booked.</span>
      </h1>
      <p style={{ marginTop: 44, fontSize: 34, lineHeight: 1.45, color: MUTE_D, maxWidth: 820 }}>
        Your work, up front, at your own link — the page that makes clients take you seriously.
      </p>
    </Frame>
  )
}

// 3. What it is — feature list + phone.
function WhatItIs() {
  const items = ['Your work, up front', 'Prices — only if you want', 'A face, a voice, an accent color', 'One-tap Arabic version']
  return (
    <Frame variant="panel" tag="Your page, free">
      <div style={{ display: 'flex', alignItems: 'center', gap: 70 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: SERIF, fontSize: 68, lineHeight: 1.08, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
            A professional page.
            <br />
            <span style={{ color: LIME }}>Live at your own link.</span>
          </h1>
          <div style={{ marginTop: 44, display: 'flex', flexDirection: 'column', gap: 26 }}>
            {items.map(t => (
              <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 20, fontSize: 32, fontWeight: 500 }}>
                <Tick />
                {t}
              </div>
            ))}
          </div>
        </div>
        <Phone src="/mockups/rami-hero.webp" width={330} tilt={2} />
      </div>
    </Frame>
  )
}

function Tick() {
  return (
    <span style={{ width: 44, height: 44, borderRadius: 999, background: LIME, display: 'inline-flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke={INK} strokeWidth="3.2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20 6L9 17l-5-5" />
      </svg>
    </span>
  )
}

// 4. How it works — editorial vertical rail (not the generic card grid).
function HowItWorks() {
  const steps = [
    ['01', 'Pick a look', 'A real design — no builder, no code.'],
    ['02', 'Add your work', 'Photos, a voice intro, prices if you want.'],
    ['03', 'Share your link', 'Bio, QR, or straight into a chat.'],
    ['04', 'Get booked', 'Clients open it and message you on WhatsApp.'],
  ]
  return (
    <Frame variant="cream" tag="How it works">
      <h1 style={{ fontFamily: SERIF, fontSize: 78, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 20px' }}>
        From link to <span style={{ color: LIME_DK }}>booked.</span>
      </h1>
      <div style={{ position: 'relative', marginTop: 8 }}>
        {/* running rail behind the numerals */}
        <div style={{ position: 'absolute', left: 47, top: 40, bottom: 40, width: 3, background: 'rgba(11,11,12,0.12)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: 30 }}>
          {steps.map(([n, t, d]) => (
            <div key={n} style={{ display: 'flex', alignItems: 'center', gap: 40 }}>
              <div
                style={{
                  position: 'relative',
                  zIndex: 1,
                  width: 96,
                  flexShrink: 0,
                  textAlign: 'center',
                  fontFamily: SERIF,
                  fontSize: 64,
                  fontWeight: 600,
                  color: INK,
                }}
              >
                <span style={{ background: CREAM, padding: '0 6px' }}>{n}</span>
              </div>
              <div>
                <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: '-0.01em' }}>{t}</div>
                <div style={{ marginTop: 6, fontSize: 28, lineHeight: 1.35, color: MUTE_L }}>{d}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Frame>
  )
}

// 5. Found vs booked — the exposure → conversion line.
function FoundBooked() {
  return (
    <Frame variant="ink" tag="Why it matters">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 44 }}>
        <p style={{ fontFamily: SERIF, fontSize: 72, lineHeight: 1.12, fontWeight: 500, color: MUTE_D, margin: 0 }}>
          Instagram is where they <span style={{ color: PAPER }}>find</span> you.
        </p>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.12)', width: 300 }} />
        <p style={{ fontFamily: SERIF, fontSize: 84, lineHeight: 1.08, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
          Your page is why they <span style={{ color: LIME }}>book</span> you.
        </p>
      </div>
    </Frame>
  )
}

// 6. QR business card — a real, live feature; the get-found / share angle.
function Qr() {
  return (
    <Frame variant="cream" tag="Your business card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 72 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: SERIF, fontSize: 82, lineHeight: 1.04, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
            One scan.
            <br />
            <span style={{ color: LIME_DK }}>Your whole page.</span>
          </h1>
          <p style={{ marginTop: 34, fontSize: 32, lineHeight: 1.45, color: MUTE_L, maxWidth: 480 }}>
            Print it, post it, put it on the counter. Anyone who scans lands on your work — no app, no typing.
          </p>
        </div>
        <div
          style={{
            width: 380,
            height: 380,
            flexShrink: 0,
            background: PAPER,
            borderRadius: 40,
            padding: 44,
            boxShadow: '0 40px 90px -50px rgba(0,0,0,0.4)',
            border: '1px solid rgba(11,11,12,0.06)',
          }}
        >
          <QRCode value="https://work-withme.com" size={292} fgColor={INK} bgColor={PAPER} style={{ width: '100%', height: '100%' }} />
        </div>
      </div>
    </Frame>
  )
}

// 7. vs Linktree — the positioning line.
function VsLink() {
  return (
    <Frame variant="ink" tag="Not just a link">
      <div style={{ display: 'flex', flexDirection: 'column', gap: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
          <span style={{ fontSize: 40, opacity: 0.5 }}>🔗</span>
          <p style={{ fontFamily: SERIF, fontSize: 56, fontWeight: 500, color: MUTE_D, margin: 0, textDecoration: 'line-through', textDecorationColor: 'rgba(255,255,255,0.25)' }}>
            &quot;Here&apos;s my stuff.&quot;
          </p>
        </div>
        <div style={{ height: 2, background: 'rgba(255,255,255,0.1)', width: 260 }} />
        <p style={{ fontFamily: SERIF, fontSize: 72, lineHeight: 1.12, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
          A WorkWith page says: <span style={{ color: LIME }}>this person is the real deal.</span>
        </p>
      </div>
    </Frame>
  )
}

// 8. Founder offer — exposure, not a discount. First 50 get featured.
function Founder() {
  return (
    <Frame variant="lime" tag="Founding freelancers">
      <div style={{ margin: 'auto', textAlign: 'center' }}>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(11,11,12,0.55)' }}>
          The first 50
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 128, lineHeight: 1.0, fontWeight: 600, letterSpacing: '-0.03em', margin: '20px 0 0' }}>
          Get featured.
        </h1>
        <p style={{ margin: '30px auto 0', maxWidth: 780, fontSize: 34, lineHeight: 1.45, color: 'rgba(11,11,12,0.68)', fontWeight: 500 }}>
          We build your page with you — and put your work in front of everyone we bring in at launch.
        </p>
        <div
          style={{
            marginTop: 44,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 14,
            background: INK,
            color: LIME,
            fontSize: 32,
            fontWeight: 700,
            padding: '20px 40px',
            borderRadius: 999,
          }}
        >
          Free — and yours to keep
        </div>
      </div>
    </Frame>
  )
}

// 9. Arabic-forward poster (RTL, Tajawal).
function Arabic() {
  return (
    <Frame variant="ink" footer tag="نسخة عربية بكبسة">
      <div dir="rtl" style={{ fontFamily: ARABIC, textAlign: 'right' }}>
        <h1 style={{ fontSize: 104, lineHeight: 1.12, fontWeight: 900, margin: 0 }}>
          صفحتك المهنية
          <br />
          <span style={{ color: LIME }}>بثواني.</span>
        </h1>
        <p style={{ marginTop: 40, fontSize: 40, lineHeight: 1.5, color: MUTE_D, fontWeight: 500, maxWidth: 820 }}>
          شغلك، أسعارك، وعرض السعر — برابط واحد.
        </p>
      </div>
    </Frame>
  )
}

// Per-trade STORY series (1080×1920). One post per audience, each opening on a
// real, specific pain that freelancer lives — the kind a portfolio page
// actually solves — so they see "their" post in a story and feel seen. Pains
// are drawn from the trade hooks in docs/ad-templates.md, not invented.
type Category = {
  slug: string
  tag: string
  pain: ReactNode
  fix: string
  variant: Variant
}

const CATEGORIES: Category[] = [
  {
    slug: 'cat-photographer',
    tag: 'For photographers',
    pain: (
      <>
        “Stunning shots. So… <span style={{ color: LIME }}>how much?</span>”
      </>
    ),
    fix: 'Your rates should sit next to your work — not disappear into your DMs.',
    variant: 'ink',
  },
  {
    slug: 'cat-makeup',
    tag: 'For makeup artists',
    pain: (
      <>
        The bride shouldn’t scroll <span style={{ color: LIME_DK }}>40 stories</span> to book you.
      </>
    ),
    fix: 'Your looks, your packages, your open dates — on one page she opens once.',
    variant: 'cream',
  },
  {
    slug: 'cat-tutor',
    tag: 'For tutors',
    pain: (
      <>
        “Which subjects? What’s the rate? What times?” <span style={{ color: LIME }}>Every parent.</span>
      </>
    ),
    fix: 'Answer it once. Send the same link to every parent who asks.',
    variant: 'panel',
  },
  {
    slug: 'cat-designer',
    tag: 'For designers',
    pain: (
      <>
        The <span style={{ color: LIME }}>40 MB portfolio PDF</span> that never opened.
      </>
    ),
    fix: 'Your work opens in a second, on any phone — one link, no download.',
    variant: 'ink',
  },
  {
    slug: 'cat-videographer',
    tag: 'For videographers',
    pain: (
      <>
        You made everyone else go viral. <span style={{ color: LIME_DK }}>Where’s your page?</span>
      </>
    ),
    fix: 'Your reels, your rates, your bookings — finally in your own bio.',
    variant: 'cream',
  },
  {
    slug: 'cat-trainer',
    tag: 'For trainers',
    pain: (
      <>
        “How much is the subscription?” — <span style={{ color: LIME }}>for the tenth time today.</span>
      </>
    ),
    fix: 'Programs, prices and real transformations — one link answers it while you train.',
    variant: 'panel',
  },
  {
    slug: 'cat-nailtech',
    tag: 'For nail techs',
    pain: (
      <>
        Your work beats the salons. Your prices are a <span style={{ color: LIME }}>secret.</span>
      </>
    ),
    fix: 'Show the work and the price list — a salon look, straight from home.',
    variant: 'ink',
  },
  {
    slug: 'cat-smm',
    tag: 'For social media managers',
    pain: (
      <>
        You run six accounts. Your own bio is <span style={{ color: LIME_DK }}>empty.</span>
      </>
    ),
    fix: 'Your packages and results, on the page — before the client even asks.',
    variant: 'cream',
  },
]

function CategoryStory({ tag, pain, fix, variant }: Omit<Category, 'slug'>) {
  const s = SURFACES[variant]
  return (
    <Frame variant={variant} format="story" tag={tag} pad={96}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 52 }}>
        <div style={{ fontFamily: SERIF, fontSize: 200, lineHeight: 0.3, height: 90, color: s.accent }}>“</div>
        <h1 style={{ fontFamily: SERIF, fontSize: 100, lineHeight: 1.1, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
          {pain}
        </h1>
        <div style={{ height: 3, width: 240, background: variant === 'lime' || variant === 'cream' ? 'rgba(11,11,12,0.15)' : 'rgba(255,255,255,0.16)' }} />
        <p style={{ fontSize: 46, lineHeight: 1.4, fontWeight: 500, color: s.mute, margin: 0, maxWidth: 880 }}>
          <span style={{ color: s.accent, fontWeight: 700 }}>Your page fixes it. </span>
          {fix}
        </p>
      </div>
    </Frame>
  )
}

// 12. CTA end-card — closes every set. Product as the visual, "free" said once.
function Cta() {
  return (
    <Frame variant="ink" footer={false}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 64 }}>
        <div style={{ flex: 1 }}>
          <Wordmark size={40} on="ink" />
          <h1 style={{ fontFamily: SERIF, fontSize: 88, lineHeight: 1.02, fontWeight: 600, letterSpacing: '-0.02em', margin: '30px 0 0' }}>
            Your page is
            <br />
            <span style={{ color: LIME }}>waiting.</span>
          </h1>
          <p style={{ marginTop: 26, fontSize: 30, color: MUTE_D, fontWeight: 500 }}>
            Free to build · live in minutes · yours to keep.
          </p>
          <div
            style={{
              marginTop: 44,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              background: LIME,
              color: INK,
              fontSize: 36,
              fontWeight: 700,
              padding: '22px 44px',
              borderRadius: 999,
            }}
          >
            {SITE}
          </div>
        </div>
        <Phone src="/mockups/rami-hero.webp" width={330} tilt={-2} />
      </div>
    </Frame>
  )
}

// ---------------------------------------------------------------------------
// Registry
// ---------------------------------------------------------------------------
export type PosterMeta = {
  slug: string
  title: string
  note: string
  format: Format
  Component: () => ReactNode
}

// Square feed posts (1080×1080) — the grid.
const FEED: PosterMeta[] = [
  { slug: 'brand', title: 'Brand cover', note: 'Grid cover — the wordmark tile', format: 'square', Component: Brand },
  { slug: 'hook', title: 'The hook', note: 'Post on Instagram → build the page that gets you booked', format: 'square', Component: Hook },
  { slug: 'what-it-is', title: 'What it is', note: 'A professional page, free — feature list + phone', format: 'square', Component: WhatItIs },
  { slug: 'how-it-works', title: 'How it works', note: 'From link to booked — editorial steps', format: 'square', Component: HowItWorks },
  { slug: 'found-booked', title: 'Found → booked', note: 'Exposure → conversion line', format: 'square', Component: FoundBooked },
  { slug: 'qr', title: 'QR business card', note: 'One scan → your whole page (live feature)', format: 'square', Component: Qr },
  { slug: 'vs-linktree', title: 'Not just a link', note: 'Positioning vs Linktree/Carrd', format: 'square', Component: VsLink },
  { slug: 'founder', title: 'Founders get featured', note: 'First 50 featured — exposure, not a discount', format: 'square', Component: Founder },
  { slug: 'arabic', title: 'Arabic', note: 'RTL Arabic-forward variant', format: 'square', Component: Arabic },
  { slug: 'cta', title: 'CTA end-card', note: 'Closes every set — product visual + link', format: 'square', Component: Cta },
]

// Per-trade STORY posts (1080×1920) — the "each audience sees their own" series.
const STORIES: PosterMeta[] = CATEGORIES.map(c => ({
  slug: c.slug,
  title: c.tag.replace(/^For /, ''),
  note: `Story · real pain a page solves for ${c.tag.replace(/^For /, '').toLowerCase()}`,
  format: 'story' as const,
  Component: () => <CategoryStory tag={c.tag} pain={c.pain} fix={c.fix} variant={c.variant} />,
}))

export const POSTERS: PosterMeta[] = [...FEED, ...STORIES]

export function getPoster(slug: string): PosterMeta | undefined {
  return POSTERS.find(p => p.slug === slug)
}
