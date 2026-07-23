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

## The set (12)
`brand` · `hook` · `what-it-is` · `how-it-works` · `money-chaser` · `get-paid`
· `vs-linktree` · `founder` · `arabic` · `voice` · `for-who` · `cta`

The money-chaser is the paid-engine post; the free page is the hook. Per the
homepage rules there are **no fabricated usage stats or testimonials** — the
"milestone" tile is the real `$29/yr founder offer`, not an invented count.

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
