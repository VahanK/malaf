'use client'

import { useState } from 'react'
import { PagePreview } from './PagePreview'

// Split builder view: editor controls on the left, a live preview of the
// freelancer's real page on the right. On small screens the preview collapses
// behind a toggle so the editor stays usable. Shared by the profile,
// services, and portfolio pages — the three surfaces that change the page.
export function EditorShell({
  title,
  subtitle,
  handle,
  published,
  children,
}: {
  title: string
  subtitle: string
  handle: string | null
  published: boolean
  children: React.ReactNode
}) {
  const [showPreviewMobile, setShowPreviewMobile] = useState(false)

  return (
    <div>
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold">{title}</h1>
          <p className="mt-1 text-sm text-dash-muted">{subtitle}</p>
        </div>
        <button
          onClick={() => setShowPreviewMobile(v => !v)}
          className="shrink-0 rounded-lg border border-dash-border px-3 py-1.5 text-xs font-medium text-dash-muted lg:hidden"
        >
          {showPreviewMobile ? 'Hide preview' : '👁 Preview'}
        </button>
      </div>

      {/* Editor on the left (capped so fields stay readable), a LARGE live preview
          on the right that grows with the screen — the preview is the point, so it
          gets the extra width, not empty margin. */}
      <div className="mt-4 grid gap-8 lg:grid-cols-[minmax(0,560px)_minmax(0,1fr)]">
        <div className={showPreviewMobile ? 'hidden lg:block' : ''}>{children}</div>
        <div className={`${showPreviewMobile ? '' : 'hidden'} lg:sticky lg:top-8 lg:block lg:h-[calc(100vh-6rem)]`}>
          <PagePreview handle={handle} published={published} />
        </div>
      </div>
    </div>
  )
}
