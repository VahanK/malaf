'use client'

import { normalizeAccent } from '@/lib/card-templates'
import { useEdit } from './edit/EditContext'

// The viral loop: a thin "Made with WorkWith · make yours free" bar below the
// freelancer's own footer on every published page. Each page a freelancer shares
// quietly recruits the next signup — the free growth engine (farm-users pivot).
//
// Themed through the card CSS vars so it reads correctly on both dark and light
// templates. Hidden inside the builder (no "make yours free" on your own editor).
// Seam for later: a paid "remove branding" upgrade would hide this on live pages
// (gate on a profile.remove_branding derived from subscriptions.tier != 'free');
// not built yet — the mark shows on all published pages for now.
export function ViralMark({ accent }: { accent: string }) {
  const { editing } = useEdit()
  const a6 = normalizeAccent(accent)
  if (editing) return null
  return (
    <div className="border-t border-[var(--card-border)] px-6 py-4 text-center text-[12px] text-[var(--card-muted)]">
      <a href="/auth/signup" className="font-semibold text-[var(--card-ink)] transition-opacity hover:opacity-80">
        Made with <span style={{ color: a6 }}>WorkWith</span> · make yours free →
      </a>
    </div>
  )
}
