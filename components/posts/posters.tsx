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
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {/* This is the BRAND account talking, so the footer is the brand's
              own domain — not a personal handle, which would read as "this
              account belongs to that person". */}
          <span style={{ width: 12, height: 12, borderRadius: 999, background: s.accent }} />
          <span style={{ fontSize: 27, fontWeight: 600, letterSpacing: '-0.01em', color: s.mute }}>
            {SITE}
          </span>
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

// The phone with a small "example" caption, so the freelancer page inside it
// reads as an illustration of what YOUR page looks like — never as this
// account's own identity.
// A rendered mock of a WorkWith page — NOT a real person's screenshot. The name
// is a lime "Your Name" placeholder so it reads as a template of what YOUR page
// looks like. Everything scales off the phone width (u = width/330).
function PhoneMock({ width = 330, tilt = 0 }: { width?: number; tilt?: number }) {
  const h = Math.round(width * 2.06)
  const u = width / 330
  const CARD_BG = '#0e0f13'
  const CARD_PANEL = '#191c23'
  const CARD_MUTED = '#9aa0ae'
  return (
    <div
      style={{
        width,
        height: h,
        borderRadius: width * 0.13,
        background: '#000',
        padding: width * 0.03,
        boxShadow: '0 50px 90px -40px rgba(0,0,0,0.6)',
        transform: tilt ? `rotate(${tilt}deg)` : undefined,
        flexShrink: 0,
      }}
    >
      <div style={{ position: 'relative', width: '100%', height: '100%', borderRadius: width * 0.1, overflow: 'hidden', background: CARD_BG, display: 'flex', flexDirection: 'column' }}>
        {/* hero */}
        <div
          style={{
            height: '54%',
            padding: 22 * u,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-end',
            background: 'radial-gradient(120% 80% at 25% 15%, rgba(201,247,59,0.16), transparent 55%), linear-gradient(160deg, #23262f, #0e0f13)',
          }}
        >
          <div style={{ width: 66 * u, height: 66 * u, borderRadius: 999, marginBottom: 14 * u, background: 'linear-gradient(135deg,#2c303b,#15171d)', border: `${2 * u}px solid rgba(255,255,255,0.16)`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width={30 * u} height={30 * u} viewBox="0 0 24 24" fill={CARD_MUTED}><path d="M12 12a5 5 0 100-10 5 5 0 000 10zm0 2c-4 0-8 2-8 6v2h16v-2c0-4-4-6-8-6z" /></svg>
          </div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 * u, alignSelf: 'flex-start', background: 'rgba(0,0,0,0.45)', borderRadius: 999, padding: `${5 * u}px ${12 * u}px`, fontSize: 12 * u, color: '#f4f2ec', marginBottom: 12 * u }}>
            <span style={{ width: 7 * u, height: 7 * u, borderRadius: 999, background: GREEN }} /> Available this month
          </div>
          <div style={{ fontFamily: SANS, fontWeight: 800, fontSize: 36 * u, lineHeight: 1, color: LIME }}>Your Name</div>
          <div style={{ marginTop: 7 * u, fontSize: 15 * u, color: GOLD, fontWeight: 600 }}>Your craft · Your city</div>
        </div>
        {/* body */}
        <div style={{ flex: 1, padding: 22 * u, display: 'flex', flexDirection: 'column', gap: 13 * u }}>
          <div style={{ fontSize: 14 * u, lineHeight: 1.4, color: CARD_MUTED }}>A line about what you do — and who you do it for.</div>
          <div style={{ display: 'flex', gap: 10 * u }}>
            <div style={{ flex: 1, textAlign: 'center', background: LIME, color: INK, borderRadius: 999, padding: `${12 * u}px 0`, fontSize: 14 * u, fontWeight: 700 }}>Request a quote</div>
            <div style={{ flex: 1, textAlign: 'center', background: 'transparent', color: '#f4f2ec', border: `${1.5 * u}px solid rgba(255,255,255,0.2)`, borderRadius: 999, padding: `${12 * u}px 0`, fontSize: 14 * u, fontWeight: 700 }}>WhatsApp</div>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8 * u, marginTop: 2 * u }}>
            {[0, 1, 2, 3, 4, 5].map(i => (
              <div key={i} style={{ aspectRatio: '1 / 1', borderRadius: 10 * u, background: `linear-gradient(150deg, ${CARD_PANEL}, #0e0f13)` }} />
            ))}
          </div>
        </div>
        {/* notch */}
        <div style={{ position: 'absolute', top: width * 0.045, left: '50%', transform: 'translateX(-50%)', width: width * 0.34, height: width * 0.055, borderRadius: 999, background: '#000' }} />
      </div>
    </div>
  )
}

// The mock phone captioned with the personal link the scroller would OWN —
// the whole pitch is "a link + page that belong to you", so we show it.
function PhoneExample({ width = 330, tilt = 0, on = 'ink' as Variant }: { width?: number; tilt?: number; on?: Variant }) {
  const s = SURFACES[on]
  return (
    <div style={{ width, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16, flexShrink: 0 }}>
      <PhoneMock width={width} tilt={tilt} />
      <div style={{ textAlign: 'center', lineHeight: 1.3, whiteSpace: 'nowrap' }}>
        <div style={{ fontSize: 18, fontWeight: 600, letterSpacing: '0.02em', color: s.mute }}>your own link</div>
        <div style={{ fontSize: 21, fontWeight: 700 }}>
          <span style={{ color: s.mute }}>work-withme.com/</span>
          <span style={{ color: s.accent }}>yourname</span>
        </div>
      </div>
    </div>
  )
}

// --- inline icons (replace emoji in the art; emoji lives only in the bio) ----
function ArrowUpIcon({ size = 26, color = INK }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19V5M6 11l6-6 6 6" />
    </svg>
  )
}
function LinkIcon({ size = 40, color = INK }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M10 13a5 5 0 007 0l3-3a5 5 0 00-7-7l-1 1" />
      <path d="M14 11a5 5 0 00-7 0l-3 3a5 5 0 007 7l1-1" />
    </svg>
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
          Your own page, at your own link — the professional home for freelancers in Lebanon.
        </p>
      </div>
    </Frame>
  )
}

// 2. Hook — the category-defining line.
function Hook() {
  return (
    <Frame variant="ink" tag="For freelancers in Lebanon">
      <h1 style={{ fontFamily: SERIF, fontSize: 96, lineHeight: 1.04, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
        Your work is studio-level.
        <br />
        <span style={{ color: LIME }}>Is your link?</span>
      </h1>
      <p style={{ marginTop: 44, fontSize: 34, lineHeight: 1.45, color: MUTE_D, maxWidth: 820 }}>
        One page with your work, your prices, and a way to book — the moment a client taps.
      </p>
    </Frame>
  )
}

// 3. What it is — feature list + phone.
function WhatItIs() {
  const items = ['Your work, up front', 'Prices — only if you want', 'Your own accent color', 'One-tap Arabic version']
  return (
    <Frame variant="panel" tag="Your page, free">
      <div style={{ display: 'flex', alignItems: 'center', gap: 70 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: SERIF, fontSize: 70, lineHeight: 1.06, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
            Your own page.
            <br />
            <span style={{ color: LIME }}>Your own link.</span>
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
        <PhoneExample width={330} tilt={2} on="panel" />
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
    ['02', 'Add your work', 'Photos, prices, your availability.'],
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
          <div style={{ marginTop: 28, display: 'inline-flex', alignItems: 'center', gap: 12, background: PAPER, border: '1px solid rgba(11,11,12,0.1)', borderRadius: 999, padding: '14px 24px', fontSize: 27, fontWeight: 700 }}>
            <span style={{ color: MUTE_L }}>work-withme.com/</span>
            <span style={{ color: LIME_DK, marginLeft: -6 }}>yourname</span>
          </div>
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
          <span style={{ opacity: 0.5, display: 'inline-flex' }}><LinkIcon size={44} color={PAPER} /></span>
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
        “What do you teach? What’s your rate? Which days?” <span style={{ color: LIME }}>Every parent.</span>
      </>
    ),
    fix: 'Put your subjects, rates and free slots on one link — send it once, to every parent.',
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

// A CTA pill whose wording matches what's actually tappable on the surface:
// a story gets a real link sticker → "tap the link"; a feed post can't link,
// so it points to the bio. Free is said once, here.
function CtaPill({ format, variant }: { format: Format; variant: Variant }) {
  const onLight = variant === 'lime' || variant === 'cream'
  const fg = onLight ? LIME : INK
  const story = format === 'story'
  return (
    <span
      style={{
        alignSelf: 'flex-start',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 14,
        background: onLight ? INK : LIME,
        color: fg,
        fontSize: story ? 36 : 30,
        fontWeight: 700,
        padding: story ? '22px 40px' : '18px 34px',
        borderRadius: 999,
      }}
    >
      {story ? <LinkIcon size={34} color={fg} /> : <ArrowUpIcon size={28} color={fg} />}
      {story ? 'Tap the link — it’s free' : 'Free — link in bio'}
    </span>
  )
}

// One per-trade card, rendered as either a tall story or a square feed post.
function CategoryCard({ tag, pain, fix, variant, format }: Omit<Category, 'slug'> & { format: Format }) {
  const s = SURFACES[variant]
  const story = format === 'story'
  return (
    <Frame variant={variant} format={format} tag={tag} pad={story ? 96 : 84}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: story ? 46 : 30 }}>
        <div style={{ fontFamily: SERIF, fontSize: story ? 200 : 130, lineHeight: 0.3, height: story ? 90 : 58, color: s.accent }}>“</div>
        <h1 style={{ fontFamily: SERIF, fontSize: story ? 100 : 66, lineHeight: 1.1, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
          {pain}
        </h1>
        <div style={{ height: 3, width: story ? 240 : 180, background: s.accent, opacity: 0.7 }} />
        <p style={{ fontSize: story ? 46 : 30, lineHeight: 1.4, fontWeight: 500, color: s.mute, margin: 0, maxWidth: 880 }}>
          <span style={{ color: s.accent, fontWeight: 700 }}>Your page fixes it. </span>
          {fix}
        </p>
        <CtaPill format={format} variant={variant} />
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
          {/* The action, in Instagram's terms: a feed post can't carry a tap-
              able link, so send them to the one place that can — the bio. */}
          <div
            style={{
              marginTop: 44,
              display: 'inline-flex',
              alignItems: 'center',
              gap: 16,
              background: LIME,
              color: INK,
              fontSize: 34,
              fontWeight: 700,
              padding: '22px 44px',
              borderRadius: 999,
            }}
          >
            <ArrowUpIcon size={30} color={INK} /> Link in bio
          </div>
          <p style={{ marginTop: 22, fontSize: 26, color: MUTE_D }}>{SITE}</p>
        </div>
        <PhoneExample width={330} tilt={-2} />
      </div>
    </Frame>
  )
}

// ---------------------------------------------------------------------------
// Brand assets — logo for the profile picture + a wordmark lockup.
// ---------------------------------------------------------------------------
function LogoAvatar() {
  // Profile-pic monogram: reads inside Instagram's circular crop at any size.
  return (
    <Frame variant="ink" footer={false} pad={0}>
      <div style={{ margin: 'auto' }}>
        <span style={{ fontFamily: SERIF, fontSize: 460, fontWeight: 600, letterSpacing: '-0.04em', color: PAPER }}>
          W<span style={{ color: LIME }}>.</span>
        </span>
      </div>
    </Frame>
  )
}

function LogoWordmark() {
  return (
    <Frame variant="cream" footer={false} pad={0}>
      <div style={{ margin: 'auto' }}>
        <span style={{ fontFamily: SERIF, fontSize: 150, fontWeight: 600, letterSpacing: '-0.03em', color: INK }}>
          WorkWith<span style={{ color: LIME_DK }}>.</span>
        </span>
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

// Brand assets — download these for the profile pic / wordmark.
const LOGOS: PosterMeta[] = [
  { slug: 'logo', title: 'Logo — profile pic', note: 'Square monogram for the IG avatar', format: 'square', Component: LogoAvatar },
  { slug: 'logo-wordmark', title: 'Logo — wordmark', note: 'Full WorkWith. lockup', format: 'square', Component: LogoWordmark },
]

// Per-trade posts — each trade in BOTH a square feed post and a tall story, so
// the audience meets "their" post in the grid and in stories.
const CAT_LABEL = (c: Category) => c.tag.replace(/^For /, '')
const STORIES: PosterMeta[] = CATEGORIES.map(c => ({
  slug: c.slug,
  title: `${CAT_LABEL(c)} — story`,
  note: `Story (1080×1920) · pain a page solves for ${CAT_LABEL(c).toLowerCase()}`,
  format: 'story' as const,
  Component: () => <CategoryCard tag={c.tag} pain={c.pain} fix={c.fix} variant={c.variant} format="story" />,
}))
const CAT_POSTS: PosterMeta[] = CATEGORIES.map(c => ({
  slug: `${c.slug}-post`,
  title: `${CAT_LABEL(c)} — post`,
  note: `Feed post (1080×1080) · pain a page solves for ${CAT_LABEL(c).toLowerCase()}`,
  format: 'square' as const,
  Component: () => <CategoryCard tag={c.tag} pain={c.pain} fix={c.fix} variant={c.variant} format="square" />,
}))

export const POSTERS: PosterMeta[] = [...LOGOS, ...FEED, ...CAT_POSTS, ...STORIES]

export function getPoster(slug: string): PosterMeta | undefined {
  return POSTERS.find(p => p.slug === slug)
}
