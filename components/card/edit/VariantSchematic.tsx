'use client'

// A small CSS schematic of each layout variant's SHAPE — shown in the swap
// picker so the user sees the structure of each option and chooses deliberately
// (vs. blind cycling). These are lightweight diagrams, not full section renders:
// reliable, instant, and legible even when the picker scales them down. Rendered
// on a neutral canvas; accent = a warm bar so structure reads.
const A = '#e8623d'
const bar = (w: string, h = 'h-3', extra = '') => (
  <div className={`${h} ${extra} rounded`} style={{ width: w, background: '#c9c6c0' }} />
)
const box = (extra = '') => <div className={`rounded bg-[#dedbd4] ${extra}`} />

function Frame({ children, dark = false }: { children: React.ReactNode; dark?: boolean }) {
  return (
    <div className={`flex h-full w-full flex-col gap-2 p-4 ${dark ? 'bg-neutral-900' : 'bg-white'}`}>{children}</div>
  )
}

// kind is a block type ('narrative'|'showcase'|'gallery'|...) or a fixed bone
// ('hero'|'contact'|'Footer'|label). variantId is the specific layout.
export function VariantSchematic({ kind, variantId }: { kind: string; variantId: string }) {
  const k = kind.toLowerCase()

  // ---- HERO ----
  if (k === 'hero') {
    if (variantId === 'photo-bleed' || variantId === 'cinematic') {
      return (
        <div className="relative h-full w-full overflow-hidden bg-neutral-800">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#5b5750,#2a2825)' }} />
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <div className="h-6 w-40 rounded bg-white/90" />
            <div className="h-3 w-24 rounded" style={{ background: A }} />
          </div>
          {variantId === 'cinematic' && (
            <div className="absolute bottom-2 right-3 flex gap-1.5">{[0, 1, 2].map(i => <div key={i} className="h-8 w-6 rounded bg-white/70" />)}</div>
          )}
        </div>
      )
    }
    if (variantId === 'split-portrait') {
      return (
        <div className="grid h-full w-full grid-cols-2">
          <Frame>
            <div className="mt-6 h-6 w-32 rounded bg-neutral-800" />
            <div className="h-3 w-20 rounded" style={{ background: A }} />
          </Frame>
          <div style={{ background: 'linear-gradient(180deg,#5b5750,#2a2825)' }} />
        </div>
      )
    }
    // statement (default)
    return (
      <Frame>
        <div className="mt-6 h-9 w-52 rounded bg-neutral-800" />
        <div className="h-3 w-28 rounded" style={{ background: A }} />
        {bar('60%')}
        <div className="mt-2 flex gap-2"><div className="h-6 w-20 rounded-full" style={{ background: A }} /><div className="h-6 w-20 rounded-full border border-neutral-300" /></div>
      </Frame>
    )
  }

  // ---- CONTACT / FOOTER ----
  if (k === 'contact' || k === 'footer') {
    if (variantId === 'big-type') {
      return <div className="flex h-full w-full items-center bg-neutral-900 p-4"><div className="h-12 w-56 rounded bg-white/90" /></div>
    }
    if (variantId === 'columns') {
      return (
        <div className="grid h-full w-full grid-cols-[1.3fr_0.7fr] gap-3 bg-neutral-900 p-4">
          <div className="flex flex-col gap-2"><div className="h-6 w-40 rounded bg-white/90" />{bar('70%')}</div>
          <div className="flex flex-col gap-1.5">{[0, 1, 2].map(i => <div key={i} className="h-2.5 w-16 rounded bg-white/40" />)}</div>
        </div>
      )
    }
    return <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-900 p-4"><div className="h-6 w-40 rounded bg-white/90" /><div className="h-8 w-56 rounded-xl bg-white/20" /></div>
  }

  // ---- NARRATIVE ----
  if (k === 'narrative') {
    if (variantId === 'stacked-lead') {
      return <div className="flex h-full w-full flex-col justify-center gap-2 bg-neutral-900 p-4"><div className="h-7 w-60 rounded bg-white/90" />{bar('50%', 'h-2.5', '!bg-white/30')}</div>
    }
    return (
      <Frame>
        <div className="grid grid-cols-[0.7fr_1.7fr] gap-3">
          <div className="flex flex-col gap-1.5">{bar('90%', 'h-2')}{bar('70%', 'h-2')}</div>
          <div className="h-9 w-full rounded bg-neutral-800" />
        </div>
      </Frame>
    )
  }

  // ---- SHOWCASE (work) ----
  if (k === 'showcase') {
    if (variantId === 'card-grid') {
      return <Frame><div className="grid grid-cols-3 gap-2">{[0, 1, 2].map(i => <div key={i} className="flex flex-col gap-1">{box('h-10')}{bar('80%', 'h-2')}</div>)}</div></Frame>
    }
    if (variantId === 'numbered-list') {
      return <Frame>{[0, 1, 2].map(i => <div key={i} className="flex items-center gap-2 border-b border-neutral-200 pb-2"><div className="h-5 w-5 rounded text-[10px]" style={{ background: A }} />{bar('70%', 'h-4')}</div>)}</Frame>
    }
    if (variantId === 'bento') {
      return <Frame><div className="grid grid-cols-4 grid-rows-2 gap-2">{box('col-span-2 row-span-1')}{box('row-span-2')}{box('')}{box('col-span-2')}{box('')}</div></Frame>
    }
    if (variantId === 'logo-strip') {
      return <Frame><div className="flex items-center justify-center gap-3 py-6">{[0, 1, 2, 3].map(i => <div key={i} className="h-5 w-10 rounded bg-neutral-300" />)}</div></Frame>
    }
    // case-stack
    return <Frame>{[0, 1].map(i => <div key={i} className="grid grid-cols-[1.2fr_1fr] gap-2 border-b border-neutral-200 pb-2"><div className="flex flex-col gap-1"><div className="h-4 w-24 rounded bg-neutral-800" />{bar('80%', 'h-2')}</div>{box('h-10')}</div>)}</Frame>
  }

  // ---- GALLERY ----
  if (k === 'gallery' || k === 'image_grid') {
    if (variantId === 'grid-3') {
      return <Frame><div className="grid grid-cols-3 gap-2">{Array.from({ length: 6 }).map((_, i) => box('aspect-square'))}</div></Frame>
    }
    if (variantId === 'offset-rows') {
      return <Frame><div className="grid grid-cols-12 items-end gap-2">{box('col-span-5 h-14')}{box('col-span-4 mt-4 h-10')}{box('col-span-3 h-8')}</div></Frame>
    }
    if (variantId === 'filmstrip') {
      return <div className="flex h-full items-center gap-2 bg-neutral-900 p-3">{[0, 1, 2, 3].map(i => <div key={i} className="h-24 w-16 shrink-0 rounded bg-neutral-600" />)}</div>
    }
    // masonry
    return <Frame><div className="columns-3 gap-2 [&>*]:mb-2">{['h-12', 'h-8', 'h-10', 'h-6', 'h-14', 'h-9'].map((h, i) => box(`w-full ${h}`))}</div></Frame>
  }

  // fallback: a generic block
  return <Frame>{bar('60%')}{bar('80%', 'h-2')}{box('h-10')}</Frame>
}
