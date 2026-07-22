'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { mediaUrl } from '@/lib/media'
import { notifyPageUpdated } from '@/lib/page-updated'

type BlockType = 'image_grid' | 'before_after' | 'stat_card' | 'video_link' | 'case_card' | 'testimonial'

interface Block {
  id: string
  type: BlockType
  position: number
  data: Record<string, unknown>
  active: boolean
}

const TYPE_LABEL: Record<BlockType, string> = {
  image_grid: 'Photo grid',
  before_after: 'Before / after',
  stat_card: 'Stat (number + label)',
  video_link: 'Video link',
  case_card: 'Case card (title + excerpt)',
  testimonial: 'Testimonial',
}

export function PortfolioEditor({ initialBlocks, profileId }: { initialBlocks: Block[]; profileId: string }) {
  const [blocks, setBlocks] = useState(initialBlocks)
  const supabase = createClient()

  const addBlock = async (type: BlockType) => {
    const nextPosition = blocks.length ? Math.max(...blocks.map(b => b.position)) + 1 : 0
    const { data, error } = await supabase
      .from('portfolio_blocks')
      .insert({ profile_id: profileId, type, position: nextPosition, data: {}, active: false })
      .select()
      .single()
    if (!error && data) setBlocks([...blocks, data])
  }

  const updateData = async (id: string, data: Record<string, unknown>) => {
    setBlocks(blocks.map(b => (b.id === id ? { ...b, data } : b)))
    await supabase.from('portfolio_blocks').update({ data }).eq('id', id)
    notifyPageUpdated()
  }

  const toggleActive = async (id: string, active: boolean) => {
    await supabase.from('portfolio_blocks').update({ active }).eq('id', id)
    setBlocks(blocks.map(b => (b.id === id ? { ...b, active } : b)))
    notifyPageUpdated()
  }

  const moveBlock = async (id: string, direction: -1 | 1) => {
    const sorted = [...blocks].sort((a, b) => a.position - b.position)
    const i = sorted.findIndex(b => b.id === id)
    const j = i + direction
    if (i < 0 || j < 0 || j >= sorted.length) return

    const a = sorted[i]
    const b = sorted[j]
    const swapped = sorted.map(block => {
      if (block.id === a.id) return { ...block, position: b.position }
      if (block.id === b.id) return { ...block, position: a.position }
      return block
    })
    setBlocks(swapped)

    await Promise.all([
      supabase.from('portfolio_blocks').update({ position: b.position }).eq('id', a.id),
      supabase.from('portfolio_blocks').update({ position: a.position }).eq('id', b.id),
    ])
    notifyPageUpdated()
  }

  const removeBlock = async (id: string) => {
    await supabase.from('portfolio_blocks').delete().eq('id', id)
    setBlocks(blocks.filter(b => b.id !== id))
    notifyPageUpdated()
  }

  const uploadImage = async (file: File): Promise<string | null> => {
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('/api/upload/portfolio', { method: 'POST', body: fd })
    const json = await res.json()
    return json.path ?? null
  }

  const ordered = [...blocks].sort((a, b) => a.position - b.position)

  return (
    <div className="mt-6 max-w-lg space-y-3">
      <p className="text-xs text-dash-muted">
        Order here is the order clients see on your page.
      </p>
      {ordered.map((block, i) => (
        <div key={block.id} className="rounded-lg border border-dash-border bg-dash-surface p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex flex-col">
                <button
                  onClick={() => moveBlock(block.id, -1)}
                  disabled={i === 0}
                  aria-label="Move up"
                  className="leading-none text-dash-muted disabled:opacity-30"
                >
                  ▲
                </button>
                <button
                  onClick={() => moveBlock(block.id, 1)}
                  disabled={i === ordered.length - 1}
                  aria-label="Move down"
                  className="leading-none text-dash-muted disabled:opacity-30"
                >
                  ▼
                </button>
              </div>
              <span className="text-sm font-medium text-dash-ink">{TYPE_LABEL[block.type]}</span>
            </div>
            <div className="flex items-center gap-3">
              <label className="flex items-center gap-1.5 text-xs text-dash-muted">
                <input type="checkbox" checked={block.active} onChange={e => toggleActive(block.id, e.target.checked)} />
                Live
              </label>
              <button onClick={() => removeBlock(block.id)} className="text-xs text-dash-danger">
                Remove
              </button>
            </div>
          </div>
          <div className="mt-3">
            <BlockFields block={block} onChange={data => updateData(block.id, data)} onUploadImage={uploadImage} />
          </div>
        </div>
      ))}

      <div className="flex flex-wrap gap-2">
        {(Object.keys(TYPE_LABEL) as BlockType[]).map(type => (
          <button
            key={type}
            onClick={() => addBlock(type)}
            className="rounded-lg border border-dashed border-dash-border px-3 py-1.5 text-xs text-dash-muted hover:border-dash-accent hover:text-dash-ink"
          >
            + {TYPE_LABEL[type]}
          </button>
        ))}
      </div>
    </div>
  )
}

function BlockFields({
  block,
  onChange,
  onUploadImage,
}: {
  block: Block
  onChange: (data: Record<string, unknown>) => void
  onUploadImage: (file: File) => Promise<string | null>
}) {
  const input = 'w-full rounded-lg border border-dash-border px-3 py-2 text-sm outline-none focus:border-dash-accent'

  switch (block.type) {
    case 'testimonial': {
      const d = block.data as { text?: string; attribution?: string; date_label?: string }
      return (
        <div className="space-y-2">
          <textarea
            rows={2}
            placeholder="What they said"
            defaultValue={d.text ?? ''}
            onBlur={e => onChange({ ...d, text: e.target.value })}
            className={input}
          />
          <input
            placeholder="Attribution (e.g. Bride's mom)"
            defaultValue={d.attribution ?? ''}
            onBlur={e => onChange({ ...d, attribution: e.target.value })}
            className={input}
          />
        </div>
      )
    }
    case 'stat_card': {
      const d = block.data as { value?: string; label?: string }
      return (
        <div className="flex gap-2">
          <input placeholder="500+" defaultValue={d.value ?? ''} onBlur={e => onChange({ ...d, value: e.target.value })} className={input} />
          <input placeholder="students taught" defaultValue={d.label ?? ''} onBlur={e => onChange({ ...d, label: e.target.value })} className={input} />
        </div>
      )
    }
    case 'case_card': {
      const d = block.data as { title?: string; excerpt?: string }
      return (
        <div className="space-y-2">
          <input placeholder="Title" defaultValue={d.title ?? ''} onBlur={e => onChange({ ...d, title: e.target.value })} className={input} />
          <textarea rows={2} placeholder="Excerpt" defaultValue={d.excerpt ?? ''} onBlur={e => onChange({ ...d, excerpt: e.target.value })} className={input} />
        </div>
      )
    }
    case 'video_link': {
      const d = block.data as { url?: string; title?: string }
      return (
        <div className="space-y-2">
          <input placeholder="https://…" defaultValue={d.url ?? ''} onBlur={e => onChange({ ...d, url: e.target.value })} className={input} />
          <input placeholder="Title" defaultValue={d.title ?? ''} onBlur={e => onChange({ ...d, title: e.target.value })} className={input} />
        </div>
      )
    }
    case 'image_grid': {
      const d = block.data as { images?: { url: string; alt?: string }[] }
      const images = d.images ?? []
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-4 gap-1.5">
            {images.map((img, i) => (
              <div key={i} className="aspect-square overflow-hidden rounded-md bg-dash-bg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={mediaUrl(img.url) ?? undefined} alt="" className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
          <label className="inline-block cursor-pointer rounded-lg border border-dash-border px-3 py-1.5 text-xs text-dash-muted hover:text-dash-ink">
            + Add photo
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp"
              className="hidden"
              onChange={async e => {
                const file = e.target.files?.[0]
                if (!file) return
                const path = await onUploadImage(file)
                if (path) onChange({ images: [...images, { url: path }] })
              }}
            />
          </label>
        </div>
      )
    }
    case 'before_after': {
      const d = block.data as { before?: { url: string }; after?: { url: string }; caption?: string }
      return (
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            {(['before', 'after'] as const).map(side => (
              <div key={side}>
                <label className="block cursor-pointer rounded-lg border border-dash-border p-2 text-center text-xs text-dash-muted">
                  {d[side]?.url ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={mediaUrl(d[side]!.url) ?? undefined} alt={side} className="mx-auto h-20 w-full rounded object-cover" />
                  ) : (
                    `Upload ${side}`
                  )}
                  <input
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="hidden"
                    onChange={async e => {
                      const file = e.target.files?.[0]
                      if (!file) return
                      const path = await onUploadImage(file)
                      if (path) onChange({ ...d, [side]: { url: path } })
                    }}
                  />
                </label>
              </div>
            ))}
          </div>
          <input placeholder="Caption" defaultValue={d.caption ?? ''} onBlur={e => onChange({ ...d, caption: e.target.value })} className={input} />
        </div>
      )
    }
    default:
      return null
  }
}
