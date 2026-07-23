'use client'

import { useState } from 'react'
import { POSTERS, SIZE } from '@/components/posts/posters'

// Marketing-post studio: a live gallery of every WorkWith social post, each
// downloadable as a 1080×1080 PNG rendered by /api/poster/[slug] (headless
// Chromium screenshot — same infra as the document renderer). Each card also
// links to the isolated /studio/posts/[slug] surface as a screenshot/print
// fallback for environments where the server renderer isn't wired up.

const THUMB = 300
const SCALE = THUMB / SIZE

function pngHref(slug: string) {
  return `/api/poster/${slug}?dl=1`
}

export default function PostsStudioPage() {
  const [busy, setBusy] = useState<string | null>(null)

  async function downloadAll() {
    for (const p of POSTERS) {
      setBusy(p.slug)
      const a = document.createElement('a')
      a.href = pngHref(p.slug)
      a.download = `workwith-${p.slug}.png`
      document.body.appendChild(a)
      a.click()
      a.remove()
      // stagger so the browser doesn't drop concurrent downloads / the render
      // function isn't hit by 12 cold-starts at once
      await new Promise(r => setTimeout(r, 1200))
    }
    setBusy(null)
  }

  return (
    <main style={{ background: '#0B0B0C', color: '#FAFAF7', minHeight: '100vh', fontFamily: 'var(--font-inter), system-ui, sans-serif' }}>
      <div style={{ maxWidth: 1160, margin: '0 auto', padding: '64px 24px 120px' }}>
        <header style={{ display: 'flex', flexWrap: 'wrap', gap: 24, alignItems: 'flex-end', justifyContent: 'space-between' }}>
          <div>
            <p style={{ fontSize: 13, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase', color: '#C9F73B', margin: 0 }}>
              Marketing studio
            </p>
            <h1 style={{ fontFamily: 'var(--font-serif), Georgia, serif', fontSize: 44, fontWeight: 600, letterSpacing: '-0.02em', margin: '10px 0 0' }}>
              Social posts
            </h1>
            <p style={{ fontSize: 16, color: 'rgba(250,250,247,0.62)', margin: '10px 0 0', maxWidth: 620, lineHeight: 1.5 }}>
              {POSTERS.length} ready-to-post 1080×1080 designs. Download the PNG, or open the raw surface to
              screenshot/print. Post organic first — only boost what already worked.
            </p>
          </div>
          <button
            onClick={downloadAll}
            disabled={!!busy}
            style={{
              background: '#C9F73B',
              color: '#0B0B0C',
              border: 'none',
              borderRadius: 12,
              padding: '14px 22px',
              fontSize: 15,
              fontWeight: 700,
              cursor: busy ? 'default' : 'pointer',
              opacity: busy ? 0.7 : 1,
            }}
          >
            {busy ? `Downloading ${busy}…` : 'Download all (PNG)'}
          </button>
        </header>

        <div
          style={{
            marginTop: 48,
            display: 'grid',
            gridTemplateColumns: `repeat(auto-fill, minmax(${THUMB}px, 1fr))`,
            gap: 28,
          }}
        >
          {POSTERS.map(({ slug, title, note, Component }) => (
            <div key={slug} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div
                style={{
                  width: '100%',
                  aspectRatio: '1 / 1',
                  borderRadius: 16,
                  overflow: 'hidden',
                  border: '1px solid rgba(250,250,247,0.1)',
                  position: 'relative',
                  background: '#141417',
                }}
              >
                {/* Live poster, scaled down. Rendered at true 1080 then transform-scaled
                    so the thumbnail is a pixel-honest preview of the export. */}
                <div
                  style={{
                    width: SIZE,
                    height: SIZE,
                    transform: `scale(${SCALE})`,
                    transformOrigin: 'top left',
                    position: 'absolute',
                    top: 0,
                    left: 0,
                  }}
                >
                  <Component />
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 8 }}>
                <span style={{ fontSize: 15, fontWeight: 600 }}>{title}</span>
                <span style={{ fontSize: 12, color: 'rgba(250,250,247,0.4)', fontFamily: 'ui-monospace, monospace' }}>{slug}</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(250,250,247,0.55)', margin: 0, lineHeight: 1.4, minHeight: 36 }}>{note}</p>

              <div style={{ display: 'flex', gap: 8 }}>
                <a
                  href={pngHref(slug)}
                  download={`workwith-${slug}.png`}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    background: '#C9F73B',
                    color: '#0B0B0C',
                    borderRadius: 10,
                    padding: '10px 12px',
                    fontSize: 14,
                    fontWeight: 700,
                    textDecoration: 'none',
                  }}
                >
                  Download PNG
                </a>
                <a
                  href={`/studio/posts/${slug}`}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textAlign: 'center',
                    background: 'rgba(250,250,247,0.06)',
                    color: '#FAFAF7',
                    border: '1px solid rgba(250,250,247,0.14)',
                    borderRadius: 10,
                    padding: '10px 14px',
                    fontSize: 14,
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Open
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}
