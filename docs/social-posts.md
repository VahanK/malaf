# WorkWith — downloadable social posts

A studio for the Instagram/WhatsApp marketing grid: ready-to-post **1080×1080**
designs in WorkWith's own visual language. Same post *style* as the category
reference (bold branded tiles, phone mockups, a milestone card, how-it-works,
feature callouts) but a deliberately different *typographic* identity — the
editorial **Fraunces** serif (the homepage H1 face) over Inter, on the brand's
ink / lime / cream palette. No rounded geometric sans, no yellow.

## Where
- **Studio gallery:** `/studio/posts` — live previews + one-tap PNG download
  (and "Download all"). Owner-facing, `noindex`.
- **Single poster surface:** `/studio/posts/[slug]` — the isolated 1080×1080
  render used by the screenshotter; also directly viewable / printable as a
  fallback where the server renderer isn't wired up.
- **PNG export API:** `/api/poster/[slug]` — headless-Chromium screenshot at
  `deviceScaleFactor: 2` (→ a crisp 2160px file). Add `?dl=1` for a download
  disposition. Same infra as the document renderer (`/api/render/[token]`):
  `@sparticuz/chromium` on Vercel, a local Chrome otherwise
  (`CHROME_EXECUTABLE_PATH`).

## Two formats
- **Square feed posts** (1080×1080) — the grid.
- **Story posts** (1080×1920) — the per-trade series, sized for Stories/Reels.

Each poster declares its `format` in the registry; the render surface, export
API and gallery all size to it. Content sits in the middle band so Story UI
(profile row on top, reply bar on the bottom) never covers it.

## The set
**Brand assets:** `logo` (profile-pic monogram) · `logo-wordmark` — also saved
to `public/brand/*.png`.

**Feed (square):** `brand` · `hook` · `what-it-is` · `how-it-works` ·
`found-booked` · `qr` · `vs-linktree` · `founder` · `arabic` · `cta`

**Per-trade:** photographer · makeup · tutor · designer · videographer ·
trainer · nail tech · SMM — each in **both** a feed post (`cat-*-post`) and a
story (`cat-*`). Each opens on a real pain that trade lives (from
`docs/ad-templates.md`) and resolves with "Your page fixes it." + a CTA whose
wording matches the surface (story → "Tap the link"; feed → "Link in bio").
See `docs/START-HERE-instagram.md` for the account-launch playbook.

The offer post (`founder`) sells **exposure** — the first 50 get featured —
not a discount. Nothing advertises features that aren't live (no payments, no
money-chaser). Per the homepage rules there are **no fabricated usage stats or
testimonials**.

## Adding / editing a poster
Everything lives in `components/posts/posters.tsx`:
1. Write a pure component (no client hooks) using the shared `Frame`, `Phone`,
   `Wordmark`, `Tick`, `WaBubble` primitives and inline styles (Tailwind
   utilities are avoided so the screenshot is pixel-exact and purge-proof).
2. Append it to the `POSTERS` registry with a `slug`, `title`, `note`.
That's it — the gallery, the render surface, `generateStaticParams`, and the
export API all pick it up automatically.

## Notes
- Copy is English-first with dialect-Arabic accents; the Arabic poster is full
  RTL in Tajawal.
- Post organic first — only ever boost what already worked (see
  `docs/ad-templates.md` for the video-ad companion playbook).
