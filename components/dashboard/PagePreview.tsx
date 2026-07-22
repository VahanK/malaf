'use client'

import { useEffect, useRef, useState } from 'react'

// Live preview of the freelancer's REAL public page, in an iframe — never a
// mock, so what they see is exactly what a client sees. Editors dispatch a
// `workwith:page-updated` window event after a successful save; this listens
// and reloads the iframe. Also offers a manual refresh + open-in-new-tab.
//
// Builder-first (parking-lot, Jul 22): the split "edit left / see your page
// right" is what makes this feel like a website builder instead of a settings
// form.
export function PagePreview({
  handle,
  published,
}: {
  handle: string | null
  published: boolean
}) {
  const [device, setDevice] = useState<'phone' | 'desktop'>('phone')
  const [nonce, setNonce] = useState(0)
  const iframeRef = useRef<HTMLIFrameElement | null>(null)

  useEffect(() => {
    const onUpdate = () => setNonce(n => n + 1)
    window.addEventListener('workwith:page-updated', onUpdate)
    return () => window.removeEventListener('workwith:page-updated', onUpdate)
  }, [])

  if (!handle) {
    return (
      <div className="flex h-full items-center justify-center rounded-2xl border border-dash-border bg-dash-surface p-6 text-center text-sm text-dash-muted">
        Finish onboarding to get your page link.
      </div>
    )
  }

  // Preview points at the owner-only /preview route (renders drafts, no
  // publish gate); "View live" points at the real public page.
  const src = `/preview?v=${nonce}`
  const liveUrl = `/${handle}`

  return (
    <div className="flex h-full flex-col">
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1 rounded-lg border border-dash-border bg-dash-surface p-0.5 text-xs">
          <button
            onClick={() => setDevice('phone')}
            className={`rounded-md px-2.5 py-1 ${device === 'phone' ? 'bg-dash-accent text-dash-accent-ink' : 'text-dash-muted'}`}
          >
            Phone
          </button>
          <button
            onClick={() => setDevice('desktop')}
            className={`rounded-md px-2.5 py-1 ${device === 'desktop' ? 'bg-dash-accent text-dash-accent-ink' : 'text-dash-muted'}`}
          >
            Desktop
          </button>
        </div>
        <div className="flex items-center gap-3 text-xs">
          <button onClick={() => setNonce(n => n + 1)} className="text-dash-muted hover:text-dash-ink">
            ↻ Refresh
          </button>
          <a href={liveUrl} target="_blank" rel="noopener noreferrer" className="font-medium text-dash-accent">
            View live ↗
          </a>
        </div>
      </div>

      {!published && (
        <p className="mb-2 rounded-lg bg-dash-warning/10 px-3 py-1.5 text-[11px] text-dash-warning">
          Draft — not visible to clients until you publish in Profile.
        </p>
      )}

      <div className="flex flex-1 items-start justify-center overflow-hidden rounded-2xl border border-dash-border bg-dash-bg p-3">
        <iframe
          ref={iframeRef}
          key={nonce}
          src={src}
          title="Your page preview"
          className={`h-full rounded-xl border border-dash-border bg-white transition-all ${
            device === 'phone' ? 'w-[375px] max-w-full' : 'w-full'
          }`}
          style={{ minHeight: 520 }}
        />
      </div>
    </div>
  )
}
