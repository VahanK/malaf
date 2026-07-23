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

export const SIZE = 1080 // Instagram feed square, physical px

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
  tag,
  footer = true,
  pad = 84,
  children,
  style,
}: {
  variant?: Variant
  tag?: string
  footer?: boolean
  pad?: number
  children: ReactNode
  style?: CSSProperties
}) {
  const s = SURFACES[variant]
  return (
    <div
      style={{
        position: 'relative',
        width: SIZE,
        height: SIZE,
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

function WaBubble({ children, mute }: { children: ReactNode; mute: string }) {
  return (
    <div
      style={{
        alignSelf: 'flex-start',
        maxWidth: '86%',
        background: '#fff',
        color: INK,
        borderRadius: 26,
        borderTopLeftRadius: 8,
        padding: '26px 30px',
        fontSize: 32,
        lineHeight: 1.42,
        boxShadow: '0 10px 30px -18px rgba(0,0,0,0.5)',
        position: 'relative',
      }}
    >
      {children}
      <span style={{ display: 'block', marginTop: 12, fontSize: 20, color: mute, textAlign: 'right' }}>11:42 ✓✓</span>
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
        <span style={{ color: LIME }}>you can run your whole freelance business.</span>
      </h1>
      <p style={{ marginTop: 44, fontSize: 34, lineHeight: 1.45, color: MUTE_D, maxWidth: 820 }}>
        A page that makes clients take you seriously — and quotes, invoices &amp; getting paid, all behind it.
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

// 4. How it works — numbered steps.
function HowItWorks() {
  const steps = [
    ['01', 'Pick a look', 'Choose a style — no design skills, no code.'],
    ['02', 'Add your work', 'Photos, prices, a voice intro. Minutes, not days.'],
    ['03', 'Share your link', 'Put it in your bio. Clients open it on any phone.'],
    ['04', 'Get paid', 'Quote → invoice → paid on Whish, USDT or cash.'],
  ]
  return (
    <Frame variant="cream" tag="How it works">
      <h1 style={{ fontFamily: SERIF, fontSize: 76, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 44px' }}>
        Four taps to open.
      </h1>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 30 }}>
        {steps.map(([n, t, d]) => (
          <div key={n} style={{ background: PAPER, borderRadius: 32, padding: 40, border: '1px solid rgba(11,11,12,0.06)' }}>
            <div style={{ fontFamily: SERIF, fontSize: 54, fontWeight: 600, color: LIME_DK }}>{n}</div>
            <div style={{ marginTop: 12, fontSize: 36, fontWeight: 700 }}>{t}</div>
            <div style={{ marginTop: 10, fontSize: 26, lineHeight: 1.4, color: MUTE_L }}>{d}</div>
          </div>
        ))}
      </div>
    </Frame>
  )
}

// 5. Money-chaser — the flagship paid feature. WhatsApp-style chat.
function MoneyChaser() {
  return (
    <Frame variant="ink" tag="The money-chaser">
      <div style={{ display: 'flex', alignItems: 'center', gap: 64 }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontFamily: SERIF, fontSize: 76, lineHeight: 1.06, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
            The app writes the
            <br />
            reminder. <span style={{ color: LIME }}>You just send it.</span>
          </h1>
          <p style={{ marginTop: 36, fontSize: 32, lineHeight: 1.45, color: MUTE_D, maxWidth: 560 }}>
            Polite, bilingual, one tap into WhatsApp. No more &quot;how do I ask for my money&quot; — ever.
          </p>
        </div>
        <div
          style={{
            width: 420,
            flexShrink: 0,
            background: '#0b141a',
            borderRadius: 40,
            padding: 34,
            display: 'flex',
            flexDirection: 'column',
            gap: 22,
            border: '1px solid rgba(255,255,255,0.06)',
          }}
        >
          <WaBubble mute="#7a8a99">Hi Nour — hope the shoot turned out great! Just a gentle note that invoice #204 ($150) is due. No rush at all 🙏</WaBubble>
          <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 14, background: LIME, color: INK, fontSize: 28, fontWeight: 700, padding: '18px 30px', borderRadius: 999 }}>
              <WaGlyph /> Send reminder
            </span>
          </div>
        </div>
      </div>
    </Frame>
  )
}

function WaGlyph({ size = 30, color = INK }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color}>
      <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.25-1.38c1.45.79 3.08 1.21 4.79 1.21 5.46 0 9.91-4.45 9.91-9.91C21.95 6.45 17.5 2 12.04 2zm5.8 14.01c-.24.68-1.42 1.3-1.95 1.35-.5.05-1.14.07-1.84-.12-.42-.13-.97-.31-1.67-.61-2.94-1.27-4.86-4.23-5.01-4.42-.15-.2-1.2-1.59-1.2-3.03s.76-2.15 1.03-2.44c.27-.29.59-.37.79-.37.2 0 .39.002.56.01.18.008.42-.068.66.5.24.58.82 2 .89 2.14.07.15.12.32.02.51-.09.2-.14.32-.28.49-.14.17-.29.38-.42.51-.14.14-.28.29-.12.57.16.29.71 1.17 1.53 1.9 1.05.94 1.94 1.23 2.22 1.37.28.14.44.12.6-.07.16-.2.69-.8.87-1.08.18-.28.36-.23.61-.14.25.09 1.6.76 1.87.9.28.14.46.21.53.32.07.12.07.66-.17 1.34z" />
    </svg>
  )
}

// 6. Get paid — payment rails.
function GetPaid() {
  const rails = [
    ['Whish', 'Deep link'],
    ['USDT', 'QR · TRC-20'],
    ['IBAN', 'Tap to copy'],
    ['OMT', 'Reference'],
    ['CashUnited', 'Pickup'],
    ['Cash', 'On delivery'],
  ]
  return (
    <Frame variant="panel" tag="Get paid">
      <h1 style={{ fontFamily: SERIF, fontSize: 74, lineHeight: 1.06, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 12px' }}>
        On the rails Lebanon
        <br />
        <span style={{ color: LIME }}>actually uses.</span>
      </h1>
      <p style={{ fontSize: 30, color: MUTE_D, margin: '0 0 40px' }}>No custody, no middleman. Straight to you.</p>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 24 }}>
        {rails.map(([t, d]) => (
          <div key={t} style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 26, padding: '30px 32px' }}>
            <div style={{ fontSize: 40, fontWeight: 800, letterSpacing: '-0.01em' }}>{t}</div>
            <div style={{ marginTop: 8, fontSize: 24, color: MUTE_D }}>{d}</div>
          </div>
        ))}
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

// 8. Founder offer — a real offer used in place of a fabricated usage stat.
function Founder() {
  return (
    <Frame variant="lime" tag="Founder offer">
      <div style={{ textAlign: 'center', margin: 'auto' }}>
        <div style={{ fontSize: 30, fontWeight: 700, letterSpacing: '0.14em', textTransform: 'uppercase', color: 'rgba(11,11,12,0.55)' }}>
          First 50 founders
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 260, lineHeight: 0.92, fontWeight: 600, letterSpacing: '-0.03em', margin: '18px 0 6px' }}>
          $29
        </div>
        <div style={{ fontFamily: SERIF, fontSize: 52, fontWeight: 600 }}>a year — locked for life.</div>
        <div style={{ marginTop: 26, fontSize: 30, color: 'rgba(11,11,12,0.62)', fontWeight: 500 }}>
          Money-chaser · unlimited documents · your own branding.
        </div>
      </div>
    </Frame>
  )
}

// 9. Arabic-forward poster (RTL, Tajawal).
function Arabic() {
  return (
    <Frame variant="ink" footer tag="نسخة عربية بضغطة">
      <div dir="rtl" style={{ fontFamily: ARABIC, textAlign: 'right' }}>
        <h1 style={{ fontSize: 104, lineHeight: 1.12, fontWeight: 900, margin: 0 }}>
          صفحتك المهنية
          <br />
          <span style={{ color: LIME }}>بثواني.</span>
        </h1>
        <p style={{ marginTop: 40, fontSize: 40, lineHeight: 1.5, color: MUTE_D, fontWeight: 500, maxWidth: 820 }}>
          شغلك، أسعارك، وعرض السعر — برابط واحد. وتحصيل بلا إحراج.
        </p>
      </div>
    </Frame>
  )
}

// 10. Voice intro — the personal flagship.
function Voice() {
  return (
    <Frame variant="panel" tag="Voice intro">
      <div style={{ margin: 'auto', textAlign: 'center', maxWidth: 820 }}>
        <div
          style={{
            width: 200,
            height: 200,
            borderRadius: 999,
            margin: '0 auto 48px',
            background: LIME,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 0 24px rgba(201,247,59,0.12)',
          }}
        >
          <svg width="70" height="70" viewBox="0 0 24 24" fill={INK}>
            <path d="M8 5v14l11-7z" />
          </svg>
        </div>
        <h1 style={{ fontFamily: SERIF, fontSize: 84, lineHeight: 1.08, fontWeight: 600, letterSpacing: '-0.02em', margin: 0 }}>
          Your page, in <span style={{ color: LIME }}>your own voice.</span>
        </h1>
        <p style={{ marginTop: 36, fontSize: 34, lineHeight: 1.45, color: MUTE_D }}>
          A 20-second voice note at the top of your page. Something no template tool can copy.
        </p>
      </div>
    </Frame>
  )
}

// 11. Who it's for — trades.
function ForWho() {
  const trades = ['Photographers', 'Tutors', 'Designers', 'Trainers', 'Makeup artists', 'Videographers', 'Nail techs', 'Social managers', 'Home services']
  return (
    <Frame variant="cream" tag="Made for">
      <h1 style={{ fontFamily: SERIF, fontSize: 78, lineHeight: 1.06, fontWeight: 600, letterSpacing: '-0.02em', margin: '0 0 44px' }}>
        Built for the way <span style={{ color: LIME_DK }}>you</span> work.
      </h1>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20 }}>
        {trades.map(t => (
          <span
            key={t}
            style={{
              fontSize: 36,
              fontWeight: 600,
              padding: '20px 34px',
              borderRadius: 999,
              background: PAPER,
              border: '1px solid rgba(11,11,12,0.08)',
            }}
          >
            {t}
          </span>
        ))}
      </div>
    </Frame>
  )
}

// 12. CTA end-card — closes every set (brand-consistency end-card).
function Cta() {
  return (
    <Frame variant="ink" footer={false}>
      <div style={{ margin: 'auto', textAlign: 'center' }}>
        <Wordmark size={44} on="ink" />
        <h1 style={{ fontFamily: SERIF, fontSize: 108, lineHeight: 1.04, fontWeight: 600, letterSpacing: '-0.02em', margin: '40px 0 0' }}>
          Make your page.
          <br />
          <span style={{ color: LIME }}>It&apos;s free.</span>
        </h1>
        <div
          style={{
            marginTop: 56,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 16,
            background: LIME,
            color: INK,
            fontSize: 40,
            fontWeight: 700,
            padding: '26px 52px',
            borderRadius: 999,
          }}
        >
          {SITE}
        </div>
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
  Component: () => ReactNode
}

export const POSTERS: PosterMeta[] = [
  { slug: 'brand', title: 'Brand cover', note: 'Grid cover — the wordmark tile', Component: Brand },
  { slug: 'hook', title: 'The hook', note: 'Category line — post on Instagram → run your business', Component: Hook },
  { slug: 'what-it-is', title: 'What it is', note: 'A professional page, free — feature list + phone', Component: WhatItIs },
  { slug: 'how-it-works', title: 'How it works', note: 'Four numbered steps', Component: HowItWorks },
  { slug: 'money-chaser', title: 'Money-chaser', note: 'Flagship paid feature — WhatsApp reminder', Component: MoneyChaser },
  { slug: 'get-paid', title: 'Get paid', note: 'Payment rails grid', Component: GetPaid },
  { slug: 'vs-linktree', title: 'Not just a link', note: 'Positioning vs Linktree/Carrd', Component: VsLink },
  { slug: 'founder', title: 'Founder offer', note: '$29/yr milestone card (real offer, not a fake stat)', Component: Founder },
  { slug: 'arabic', title: 'Arabic', note: 'RTL Arabic-forward variant', Component: Arabic },
  { slug: 'voice', title: 'Voice intro', note: 'Personal flagship — your own voice', Component: Voice },
  { slug: 'for-who', title: 'Who it’s for', note: 'Trades grid', Component: ForWho },
  { slug: 'cta', title: 'CTA end-card', note: 'Closes every set', Component: Cta },
]

export function getPoster(slug: string): PosterMeta | undefined {
  return POSTERS.find(p => p.slug === slug)
}
