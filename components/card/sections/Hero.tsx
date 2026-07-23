'use client'

import { VoicePlayer } from '../VoicePlayer'
import { collectImages, heroImage, mediaUrl } from '../layouts/shared'
import { normalizeAccent } from '@/lib/card-templates'
import { worldType, type World } from './shared'
import { Editable } from '../edit/Editable'
import { SectionFrame } from '../edit/SectionFrame'
import { EditImageButton } from '../edit/EditImageButton'
import { MotionTextEditor } from '../edit/MotionTextEditor'
import { useEdit } from '../edit/EditContext'
import { DotGridHero, Typewrite, SpinningBoxText, SplitFlapDisplay } from '../motion/registry'
import type { PublicPage } from '@/lib/public-page'

// Profile-level text (name/title/bio) is edited inline too — routed to the
// profile row via the sentinel blockId 'profile'.
const PROFILE = 'profile'

// HERO (fixed bone, many faces). The founder's #1 "everything looks the same"
// fix: the hero is the most-seen block, so it must vary by real levers — layout
// (variant) AND type (world). Variants:
//   - statement:      huge name + statement on an aurora wash (text-forward trades)
//   - photo-bleed:    full-bleed hero photo, name overlaid huge (visual trades)
//   - cinematic:      photo-bleed + an overlapping filmstrip of featured work (Creacy)
//   - split-portrait: two-column — copy left, portrait right (Anthony/Alona)
// The `world` prop drives the heading family/weight/case via worldType(), so the
// SAME variant reads visibly different across templates.
export function Hero({
  page,
  accent,
  variant,
  world,
  isRtl,
}: {
  page: PublicPage
  accent: string
  variant: string
  world?: World
  isRtl?: boolean
}) {
  const p = page.profile
  const { onProfileData } = useEdit()
  // On an Arabic page, prefer the Arabic role/title. full_name and bio have no
  // _ar column, so they render as-is.
  const roleText = isRtl && p.title_ar ? p.title_ar : p.title
  const hero = heroImage(page)
  const featured = collectImages(page)
  const wa = p.whatsapp_number ? `https://wa.me/${p.whatsapp_number.replace(/[^\d]/g, '')}` : null
  const a6 = normalizeAccent(accent)
  const wt = worldType(world)

  // An explicit hero image beats the auto-picked first gallery photo when set.
  const heroImg = (p.hero_image_url && mediaUrl(p.hero_image_url)) || hero.url
  const wantsPhoto = variant === 'photo-bleed' || variant === 'cinematic' || variant === 'split-portrait'
  const useStatement = variant === 'statement' || (!heroImg && wantsPhoto)

  // Edit-mode hero-photo control (absolute, top-left under the label chip).
  // Sets the explicit hero_image_url so photo variants have something to show.
  const heroPhotoBtn = (
    <EditImageButton
      hasImage={!!p.hero_image_url}
      onUploaded={path => onProfileData({ hero_image_url: path })}
      addLabel="Add hero photo"
      changeLabel="Change hero photo"
      className="absolute left-3 top-14"
    />
  )

  // Inline-editable name/title/bio — rendered AS the heading/p element itself
  // (no wrapper), so an empty optional field leaves nothing on the public page.
  const Name = ({ className, style }: { className: string; style?: React.CSSProperties }) => (
    <span className={className} style={style}>
      <Editable as="h1" blockId={PROFILE} field="full_name" value={p.full_name} placeholder="Your name" className="block" />
    </span>
  )
  const Title = ({ className, style }: { className: string; style?: React.CSSProperties }) => (
    <Editable as="p" blockId={PROFILE} field="title" value={roleText} placeholder="What you do" className={className} style={style} />
  )
  const Bio = ({ className }: { className: string }) => (
    <Editable as="p" blockId={PROFILE} field="bio" value={p.bio} placeholder="A line about you (optional)" multiline className={className} />
  )

  const availabilityPill = p.availability_status !== 'away' && (
    <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[12px] font-medium ${useStatement ? 'border border-[var(--card-border)] bg-[var(--card-surface)]' : 'border border-white/25 bg-black/30 text-white backdrop-blur'}`}>
      <span className="h-2 w-2 rounded-full" style={{ background: p.availability_status === 'busy' ? '#eda100' : '#3ddc84' }} />
      {p.availability_note || (p.availability_status === 'busy' ? 'Booked — join the waitlist' : 'Available for work')}
    </span>
  )

  const ctas = (onDark: boolean) => (
    <div className="mt-7 flex flex-wrap items-center gap-3">
      <a href="#contact" className="rounded-full px-6 py-3 text-[14px] font-black" style={{ background: a6, color: 'var(--card-accent-ink)' }}>
        Request a quote
      </a>
      {wa && (
        <a href={wa} target="_blank" rel="noopener noreferrer" className={`rounded-full px-6 py-3 text-[14px] font-bold ${onDark ? 'border border-white/30 text-white backdrop-blur' : 'border border-[var(--card-border)]'}`}>
          💬 WhatsApp
        </a>
      )}
    </div>
  )

  // ── split-portrait: copy column + portrait column (no full-bleed) ──
  if (variant === 'split-portrait' && heroImg) {
    return (
      <SectionFrame blockId={PROFILE} label="Hero" fixed="hero" currentVariant={variant}>
        {heroPhotoBtn}
        <section className="grid w-full md:min-h-[92vh] md:grid-cols-[1.1fr_0.9fr]" style={{ background: 'var(--card-bg)' }}>
          <div className="flex flex-col justify-center px-6 py-20 lg:px-14">
            {availabilityPill}
            <Title className="mt-6 text-[13px] uppercase tracking-[0.28em]" style={{ color: a6 }} />
            <span className="mt-4 h-px w-16" style={{ background: a6 }} />
            <Name className={`mt-5 max-w-xl ${wt.heading} leading-[1.02]`} style={{ fontSize: `clamp(40px,6vw,${Math.min(wt.heroMax, 84)}px)` }} />
            <Bio className="mt-5 max-w-md text-[16px] leading-relaxed text-[var(--card-muted)]" />
            {ctas(false)}
            {p.voice_intro_url && (
              <div className="mt-8 max-w-sm">
                <VoicePlayer src={mediaUrl(p.voice_intro_url)} label="Hear from me" accent={a6} radiusClass="rounded-[var(--card-radius-lg)]" />
              </div>
            )}
          </div>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={heroImg} alt={hero.alt} className="h-64 w-full object-cover object-top md:h-full" />
        </section>
      </SectionFrame>
    )
  }

  // ── statement: no photo — huge name on an aurora wash ──
  // ── Motion headline treatments (typewriter / word-cube / split-flap) ──
  // Statement-style chrome with the name/tagline rendered through a motion piece.
  // Words/phrases derive from real data (services + title) so they're personal.
  if (variant === 'typewriter' || variant === 'word-cube' || variant === 'split-flap') {
    const serviceTitles = (page.services ?? []).map(s => (isRtl && s.title_ar ? s.title_ar : s.title)).filter(Boolean) as string[]
    // Custom text (editable in the builder) wins; else derive from services/title.
    const flapText = p.hero_flap_text || p.full_name || p.handle
    const phrases = (p.hero_type_phrases?.length ? p.hero_type_phrases : (serviceTitles.length ? serviceTitles : [roleText].filter(Boolean) as string[]))
    // Word-cube wants SHORT words — long service phrases read badly rotating. Use
    // custom words if set; else the first word of each service; else split the role.
    const shortWord = (s: string) => s.trim().split(/[\s·,/–-]+/)[0]
    const words = (p.hero_cube_words?.length
      ? p.hero_cube_words
      : (serviceTitles.length
        ? Array.from(new Set(serviceTitles.map(shortWord).filter(w => w.length > 1))).slice(0, 4)
        : (roleText ? roleText.split(/[·,/]/).map(s => shortWord(s)).filter(Boolean).slice(0, 4) : [])))
    return (
      <SectionFrame blockId={PROFILE} label="Hero" fixed="hero" currentVariant={variant}>
        {heroPhotoBtn}
        <section
          className="relative w-full overflow-hidden px-6 py-24 lg:px-10 lg:py-32"
          style={{ background: `radial-gradient(80% 60% at 15% -10%, ${a6}22, transparent 55%), radial-gradient(70% 50% at 95% 10%, ${a6}14, transparent 50%), var(--card-bg)` }}
        >
          <DotGridHero accent={a6} isRtl={!!isRtl} className="opacity-[0.4]" />
          <div className="relative mx-auto max-w-5xl">
            {availabilityPill}
            {variant === 'split-flap' ? (
              <div className="mt-8">
                {/* accessible name for SEO / screen readers; the flap board is decorative */}
                <h1 className="sr-only">{p.full_name || p.handle}</h1>
                <SplitFlapDisplay text={flapText} accent={a6} isRtl={!!isRtl} />
                <MotionTextEditor variant="split-flap" value={p.hero_flap_text ?? ''} placeholder={p.full_name || 'Text to display'} onChange={v => onProfileData({ hero_flap_text: v || null })} />
                <Title className="mt-4 text-center text-[clamp(16px,2vw,22px)] font-bold" style={{ color: a6 }} />
              </div>
            ) : (
              <>
                <Name className={`mt-6 block max-w-4xl ${wt.heading} leading-[0.95]`} style={{ fontSize: `clamp(40px,8vw,${wt.heroMax}px)` }} />
                {variant === 'word-cube' && words.length > 0 && (
                  <div className="mt-4 flex items-baseline gap-3 text-[clamp(18px,3vw,32px)] font-black">
                    <span className="text-[var(--card-muted)]">I do</span>
                    <SpinningBoxText words={words} accent={a6} isRtl={!!isRtl} />
                  </div>
                )}
                {variant === 'word-cube' && (
                  <MotionTextEditor variant="word-cube" value={(p.hero_cube_words ?? []).join(', ')} placeholder="e.g. Design, Build, Ship, Grow" onChange={v => onProfileData({ hero_cube_words: v ? v.split(',').map(s => s.trim()).filter(Boolean) : null })} />
                )}
                {variant === 'typewriter' && phrases.length > 0 && (
                  <div className="mt-4 text-[clamp(16px,2.4vw,26px)] font-bold" style={{ color: a6 }}>
                    <Typewrite phrases={phrases} accent={a6} isRtl={!!isRtl} />
                  </div>
                )}
                {variant === 'typewriter' && (
                  <MotionTextEditor variant="typewriter" value={(p.hero_type_phrases ?? []).join(', ')} placeholder="Phrases to cycle, comma-separated" onChange={v => onProfileData({ hero_type_phrases: v ? v.split(',').map(s => s.trim()).filter(Boolean) : null })} />
                )}
              </>
            )}
            <Bio className="mt-5 max-w-xl text-[16px] leading-relaxed text-[var(--card-muted)]" />
            {ctas(false)}
            {p.voice_intro_url && (
              <div className="mt-8 max-w-sm">
                <VoicePlayer src={mediaUrl(p.voice_intro_url)} label="Hear from me" accent={a6} radiusClass="rounded-[var(--card-radius-lg)]" />
              </div>
            )}
          </div>
        </section>
      </SectionFrame>
    )
  }

  if (useStatement) {
    return (
      <SectionFrame blockId={PROFILE} label="Hero" fixed="hero" currentVariant={variant}>
        {heroPhotoBtn}
        <section
          className="relative w-full overflow-hidden px-6 py-24 lg:px-10 lg:py-32"
          style={{ background: `radial-gradient(80% 60% at 15% -10%, ${a6}22, transparent 55%), radial-gradient(70% 50% at 95% 10%, ${a6}14, transparent 50%), var(--card-bg)` }}
        >
          <DotGridHero accent={a6} isRtl={!!isRtl} className="opacity-[0.5]" />
          <div className="relative mx-auto max-w-5xl">
            {availabilityPill}
            <Name className={`mt-6 block max-w-4xl ${wt.heading} leading-[0.95]`} style={{ fontSize: `clamp(44px,9vw,${wt.heroMax}px)` }} />
            <Title className="mt-4 text-[clamp(16px,2vw,22px)] font-bold" style={{ color: a6 }} />
            <Bio className="mt-4 max-w-xl text-[16px] leading-relaxed text-[var(--card-muted)]" />
            {ctas(false)}
            {p.voice_intro_url && (
              <div className="mt-8 max-w-sm">
                <VoicePlayer src={mediaUrl(p.voice_intro_url)} label="Hear from me" accent={a6} radiusClass="rounded-[var(--card-radius-lg)]" />
              </div>
            )}
          </div>
        </section>
      </SectionFrame>
    )
  }

  // ── photo-bleed / cinematic: full-bleed photo, name overlaid ──
  const isCinematic = variant === 'cinematic' && featured.length > 1
  return (
    <SectionFrame blockId={PROFILE} label="Hero" fixed="hero" currentVariant={variant}>
      {heroPhotoBtn}
      <section className="relative flex min-h-[88vh] w-full items-end overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={heroImg ?? undefined} alt={hero.alt} className="absolute inset-0 h-full w-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-black/40" />
        <div className="relative mx-auto w-full max-w-5xl px-6 pb-14 lg:px-10 lg:pb-20">
          {availabilityPill}
          <Name className={`mt-5 block max-w-4xl ${wt.heading} leading-[0.9] text-white`} style={{ fontSize: `clamp(40px,13vw,${Math.min(wt.heroMax, 100)}px)` }} />
          <Title className="mt-4 text-[17px] font-semibold" style={{ color: a6 }} />
          <Bio className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/75" />
          {ctas(true)}
        </div>
      </section>
      {isCinematic && (
        <div className="relative z-10 -mt-12 px-6 pb-4 lg:px-10" style={{ background: 'var(--card-bg)' }}>
          <div className="mx-auto grid max-w-5xl grid-cols-2 gap-3 sm:grid-cols-4">
            {featured.slice(0, 4).map((im, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img key={i} src={im.url ?? undefined} alt={im.alt} className="aspect-[3/4] w-full rounded-[var(--card-radius-lg)] object-cover shadow-[var(--card-shadow)]" />
            ))}
          </div>
        </div>
      )}
    </SectionFrame>
  )
}
