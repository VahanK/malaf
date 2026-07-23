'use client'

// A small CSS schematic of each layout variant's SHAPE — shown in the swap
// picker so the user sees the structure of each option and chooses deliberately
// (vs. blind cycling). Lightweight diagrams, not full section renders: reliable,
// instant, and legible even when the picker scales them down.
const ACCENT = '#e8623d'

function Bar({ w, h = 'h-3', extra = '' }: { w: string; h?: string; extra?: string }) {
  return <div className={`${h} ${extra} rounded`} style={{ width: w, background: '#c9c6c0' }} />
}
function Box({ extra = '' }: { extra?: string }) {
  return <div className={`rounded bg-[#dedbd4] ${extra}`} />
}
function Frame({ children }: { children: React.ReactNode }) {
  return <div className="flex h-full w-full flex-col gap-2 bg-white p-4">{children}</div>
}

// kind is a block type ('narrative'|'showcase'|'gallery'|...) or a fixed bone
// ('hero'|'contact'|'footer'|label). variantId is the specific layout.
export function VariantSchematic({ kind, variantId }: { kind: string; variantId: string }) {
  const k = kind.toLowerCase()

  // ---- NAV / NAVBAR ----
  if (k === 'nav' || k === 'navbar') {
    if (variantId === 'none') {
      return <Frame><div className="mt-6 h-8 w-40 rounded bg-neutral-800" /><Bar w="55%" /></Frame>
    }
    if (variantId === 'simple-floating') {
      return <div className="flex h-full w-full flex-col items-center bg-white p-4"><div className="flex items-center gap-2 rounded-full border border-neutral-200 px-3 py-1.5 shadow-sm"><div className="h-3 w-12 rounded bg-neutral-800" />{[0, 1, 2].map(i => <div key={i} className="h-2 w-8 rounded bg-neutral-300" />)}<div className="h-4 w-12 rounded-full" style={{ background: ACCENT }} /></div></div>
    }
    if (variantId === 'flyout-sticky') {
      return <div className="flex h-full w-full flex-col bg-white"><div className="flex items-center justify-between bg-neutral-950 px-4 py-2.5"><div className="h-3 w-14 rounded bg-white/90" /><div className="flex gap-2">{[0, 1, 2].map(i => <div key={i} className="h-2 w-8 rounded bg-white/50" />)}<div className="h-4 w-12 rounded-full" style={{ background: ACCENT }} /></div></div></div>
    }
    if (variantId === 'hamburger-overlay') {
      return <div className="flex h-full w-full items-start justify-between bg-neutral-950 p-4"><div className="h-3 w-14 rounded bg-white/90" /><div className="flex flex-col gap-1">{[0, 1, 2].map(i => <div key={i} className="h-0.5 w-5 rounded bg-white" />)}</div></div>
    }
    if (variantId === 'glass-magnetic') {
      return <div className="flex h-full w-full flex-col items-center bg-gradient-to-br from-neutral-200 to-neutral-400 p-4"><div className="flex items-center gap-2 rounded-full border border-white/40 bg-white/25 px-3 py-1.5 backdrop-blur"><div className="h-3 w-12 rounded bg-neutral-800" />{[0, 1].map(i => <div key={i} className="h-2 w-8 rounded bg-neutral-600" />)}<div className="h-4 w-10 rounded-full" style={{ background: ACCENT }} /></div></div>
    }
    if (variantId === 'side-stagger') {
      return <div className="relative h-full w-full bg-white p-4"><div className="absolute right-3 top-1/2 flex -translate-y-1/2 flex-col items-end gap-1.5">{[24, 16, 32, 12, 20, 28, 14].map((w, i) => <div key={i} className="h-1 rounded-full" style={{ width: w, background: i % 2 ? ACCENT : '#c9c6c0' }} />)}</div></div>
    }
    return <Frame><Bar w="40%" /></Frame>
  }

  // ---- HERO ----
  if (k === 'hero') {
    if (variantId === 'photo-bleed' || variantId === 'cinematic') {
      return (
        <div className="relative h-full w-full overflow-hidden bg-neutral-800">
          <div className="absolute inset-0" style={{ background: 'linear-gradient(180deg,#5b5750,#2a2825)' }} />
          <div className="absolute bottom-4 left-4 flex flex-col gap-2">
            <div className="h-6 w-40 rounded bg-white/90" />
            <div className="h-3 w-24 rounded" style={{ background: ACCENT }} />
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
            <div className="h-3 w-20 rounded" style={{ background: ACCENT }} />
          </Frame>
          <div style={{ background: 'linear-gradient(180deg,#5b5750,#2a2825)' }} />
        </div>
      )
    }
    if (variantId === 'typewriter') {
      return <Frame><div className="mt-6 h-8 w-44 rounded bg-neutral-800" /><div className="mt-2 flex items-center gap-1"><div className="h-4 w-28 rounded" style={{ background: ACCENT }} /><div className="h-4 w-1.5 animate-pulse rounded-sm bg-neutral-800" /></div></Frame>
    }
    if (variantId === 'word-cube') {
      return <Frame><div className="mt-6 h-8 w-40 rounded bg-neutral-800" /><div className="mt-3 flex items-center gap-2"><span className="h-4 w-10 rounded bg-neutral-300" /><div className="h-8 w-28 rounded shadow-lg" style={{ background: ACCENT }} /></div></Frame>
    }
    if (variantId === 'split-flap') {
      return <Frame><div className="mt-8 flex justify-center gap-1">{[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="relative h-8 w-6 rounded bg-neutral-900" style={{ borderBottom: `2px solid ${ACCENT}` }}><span className="absolute inset-x-0 top-1/2 h-px bg-black/40" /></div>)}</div></Frame>
    }
    return (
      <Frame>
        <div className="mt-6 h-9 w-52 rounded bg-neutral-800" />
        <div className="h-3 w-28 rounded" style={{ background: ACCENT }} />
        <Bar w="60%" />
        <div className="mt-2 flex gap-2">
          <div className="h-6 w-20 rounded-full" style={{ background: ACCENT }} />
          <div className="h-6 w-20 rounded-full border border-neutral-300" />
        </div>
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
          <div className="flex flex-col gap-2"><div className="h-6 w-40 rounded bg-white/90" /><Bar w="70%" /></div>
          <div className="flex flex-col gap-1.5">{[0, 1, 2].map(i => <div key={i} className="h-2.5 w-16 rounded bg-white/40" />)}</div>
        </div>
      )
    }
    return <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-neutral-900 p-4"><div className="h-6 w-40 rounded bg-white/90" /><div className="h-8 w-56 rounded-xl bg-white/20" /></div>
  }

  // ---- NARRATIVE ----
  if (k === 'narrative') {
    if (variantId === 'stacked-lead') {
      return <div className="flex h-full w-full flex-col justify-center gap-2 bg-neutral-900 p-4"><div className="h-7 w-60 rounded bg-white/90" /><div className="h-2.5 w-1/2 rounded bg-white/30" /></div>
    }
    return (
      <Frame>
        <div className="grid grid-cols-[0.7fr_1.7fr] gap-3">
          <div className="flex flex-col gap-1.5"><Bar w="90%" h="h-2" /><Bar w="70%" h="h-2" /></div>
          <div className="h-9 w-full rounded bg-neutral-800" />
        </div>
      </Frame>
    )
  }

  // ---- SHOWCASE (work) ----
  if (k === 'showcase') {
    if (variantId === 'card-grid') {
      return <Frame><div className="grid grid-cols-3 gap-2">{[0, 1, 2].map(i => <div key={i} className="flex flex-col gap-1"><Box extra="h-10" /><Bar w="80%" h="h-2" /></div>)}</div></Frame>
    }
    if (variantId === 'numbered-list') {
      return <Frame>{[0, 1, 2].map(i => <div key={i} className="flex items-center gap-2 border-b border-neutral-200 pb-2"><div className="h-5 w-5 rounded" style={{ background: ACCENT }} /><Bar w="70%" h="h-4" /></div>)}</Frame>
    }
    if (variantId === 'bento') {
      return <Frame><div className="grid grid-cols-4 grid-rows-2 gap-2"><Box extra="col-span-2" /><Box extra="row-span-2" /><Box /><Box extra="col-span-2" /><Box /></div></Frame>
    }
    if (variantId === 'logo-strip') {
      return <Frame><div className="flex items-center justify-center gap-3 py-6">{[0, 1, 2, 3].map(i => <div key={i} className="h-5 w-10 rounded bg-neutral-300" />)}</div></Frame>
    }
    if (variantId === 'grid-cards') {
      return <Frame><div className="grid grid-cols-3 gap-1.5">{[0, 1, 2, 3, 4, 5].map(i => <div key={i} className="relative"><Box extra="h-9" /><span className="absolute left-0 top-0 h-2 w-2 border-l-2 border-t-2" style={{ borderColor: ACCENT }} /><span className="absolute bottom-0 right-0 h-2 w-2 border-b-2 border-r-2" style={{ borderColor: ACCENT }} /></div>)}</div></Frame>
    }
    if (variantId === 'card-carousel') {
      return <Frame><div className="flex items-center gap-2"><div className="h-5 w-5 rounded-full bg-neutral-300" /><div className="flex flex-1 gap-2 overflow-hidden">{[0, 1, 2].map(i => <Box key={i} extra="h-16 w-1/3 shrink-0" />)}</div><div className="h-5 w-5 rounded-full" style={{ background: ACCENT }} /></div></Frame>
    }
    if (variantId === 'spring-cards') {
      return <Frame><div className="grid grid-cols-2 gap-3">{[0, 1, 2, 3].map(i => <div key={i} className="relative"><div className="absolute -right-1 -top-1 h-full w-full rounded border-2 border-neutral-800" /><div className="relative rounded border-2 border-neutral-800 bg-white p-2"><Bar w="70%" h="h-2" /></div></div>)}</div></Frame>
    }
    if (variantId === 'sticky-stack') {
      return <Frame><div className="flex flex-col gap-1">{[0, 1, 2].map(i => <div key={i} className={`rounded p-2 ${i % 2 ? 'bg-white border border-neutral-300' : 'bg-neutral-900'}`}><Bar w="60%" h={i % 2 ? 'h-2' : 'h-2 !bg-white/40'} /></div>)}</div></Frame>
    }
    if (variantId === 'scroll-fade') {
      return <Frame><div className="grid grid-cols-[0.9fr_1.1fr] gap-3"><div className="flex flex-col gap-1"><div className="h-4 w-20 rounded bg-neutral-800" /></div><div className="flex flex-col gap-1.5"><Box extra="h-8 opacity-100" /><Box extra="h-8 opacity-60" /><Box extra="h-8 opacity-30" /></div></div></Frame>
    }
    if (variantId === 'text-parallax') {
      return <div className="relative h-full w-full overflow-hidden bg-neutral-800"><div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${ACCENT}44, #2a2825)` }} /><div className="absolute inset-0 flex items-center justify-center"><div className="h-6 w-40 rounded bg-white/90" /></div></div>
    }
    if (variantId === 'oppo-scroll') {
      return <div className="grid h-full w-full grid-cols-2"><div className="flex flex-col"><div className="flex-1 bg-neutral-900 p-2"><Bar w="70%" h="h-2 !bg-white/40" /></div><div className="flex-1 bg-white p-2"><Bar w="70%" h="h-2" /></div></div><div className="bg-neutral-400" /></div>
    }
    return <Frame>{[0, 1].map(i => <div key={i} className="grid grid-cols-[1.2fr_1fr] gap-2 border-b border-neutral-200 pb-2"><div className="flex flex-col gap-1"><div className="h-4 w-24 rounded bg-neutral-800" /><Bar w="80%" h="h-2" /></div><Box extra="h-10" /></div>)}</Frame>
  }

  // ---- GALLERY ----
  if (k === 'gallery' || k === 'image_grid') {
    if (variantId === 'grid-3') {
      return <Frame><div className="grid grid-cols-3 gap-2">{[0, 1, 2, 3, 4, 5].map(i => <Box key={i} extra="aspect-square" />)}</div></Frame>
    }
    if (variantId === 'offset-rows') {
      return <Frame><div className="grid grid-cols-12 items-end gap-2"><Box extra="col-span-5 h-14" /><Box extra="col-span-4 mt-4 h-10" /><Box extra="col-span-3 h-8" /></div></Frame>
    }
    if (variantId === 'filmstrip') {
      return <div className="flex h-full items-center gap-2 bg-neutral-900 p-3">{[0, 1, 2, 3].map(i => <div key={i} className="h-24 w-16 shrink-0 rounded bg-neutral-600" />)}</div>
    }
    if (variantId === 'horizontal-scroll') {
      return <div className="flex h-full items-center gap-2 overflow-hidden bg-neutral-900 px-3">{[0, 1, 2, 3, 4].map(i => <div key={i} className="h-20 w-28 shrink-0 rounded bg-neutral-600" />)}</div>
    }
    if (variantId === 'swipe-deck') {
      return <div className="relative flex h-full items-center justify-center"><div className="absolute h-24 w-32 rotate-6 rounded bg-neutral-300" /><div className="absolute h-24 w-32 -rotate-3 rounded bg-neutral-400" /><div className="relative h-24 w-32 rounded" style={{ background: ACCENT, opacity: 0.5 }} /></div>
    }
    return <Frame><div className="columns-3 gap-2 [&>*]:mb-2">{['h-12', 'h-8', 'h-10', 'h-6', 'h-14', 'h-9'].map((h, i) => <Box key={i} extra={`w-full ${h}`} />)}</div></Frame>
  }

  // ---- STAT / NUMBERS ----
  if (k === 'stat_card') {
    if (variantId === 'count-up') {
      return <Frame><div className="grid grid-cols-3 gap-2 pt-4">{['12', '340', '98'].map((n, i) => <div key={i} className="text-center"><div className="text-2xl font-black" style={{ color: ACCENT }}>{n}</div><Bar w="80%" h="h-1.5" extra="mx-auto mt-1" /></div>)}</div></Frame>
    }
    if (variantId === 'interactive-grid') {
      return <Frame><div className="grid grid-cols-3 gap-1.5">{[0, 1, 2].map(i => <div key={i} className={`rounded p-2 text-center ${i === 1 ? '' : 'opacity-40'}`} style={i === 1 ? { borderBottom: `2px solid ${ACCENT}` } : undefined}><div className="text-lg font-black" style={{ color: i === 1 ? ACCENT : '#888' }}>#{i + 1}</div></div>)}</div></Frame>
    }
    return <Frame><div className="grid grid-cols-3 divide-x divide-neutral-200">{[0, 1, 2].map(i => <div key={i} className="px-2"><div className="text-2xl font-black" style={{ color: ACCENT }}>9</div><Bar w="70%" h="h-1.5" extra="mt-1" /></div>)}</div></Frame>
  }

  // ---- TESTIMONIAL ----
  if (k === 'testimonial') {
    if (variantId === 'stagger-deck') {
      return <div className="relative flex h-full items-center justify-center"><div className="absolute h-20 w-40 -rotate-3 rounded-lg bg-neutral-200" /><div className="absolute h-20 w-40 rotate-3 rounded-lg bg-neutral-300" /><div className="relative h-20 w-40 rounded-lg p-2" style={{ background: ACCENT, opacity: 0.85 }}><Bar w="80%" h="h-1.5 !bg-white/60" /><Bar w="50%" h="h-1.5 !bg-white/60" extra="mt-1" /></div></div>
    }
    if (variantId === 'stacked-auto') {
      return <Frame><div className="grid grid-cols-[0.8fr_1.2fr] gap-3"><div className="flex flex-col gap-1.5">{[0, 1, 2].map(i => <div key={i} className="h-1.5 rounded-full" style={{ background: i === 0 ? ACCENT : '#ddd' }} />)}</div><Box extra="h-16" /></div></Frame>
    }
    return <Frame><div className="grid grid-cols-2 gap-2">{[0, 1].map(i => <div key={i} className="rounded border border-neutral-200 p-2"><Bar w="90%" h="h-1.5" /><Bar w="60%" h="h-1.5" extra="mt-1" /></div>)}</div></Frame>
  }

  return <Frame><Bar w="60%" /><Bar w="80%" h="h-2" /><Box extra="h-10" /></Frame>
}
