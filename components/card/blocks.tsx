import { mediaUrl } from '@/lib/media'
import type { PublicBlock } from '@/lib/public-page'

// Gradient stand-ins keep the card beautiful before real photos are uploaded.
const GRADIENTS = [
  'linear-gradient(135deg,#42351d,#8a6f39)',
  'linear-gradient(160deg,#232733,#3d4152)',
  'linear-gradient(135deg,#1f2b26,#3c5a4c)',
  'linear-gradient(150deg,#33222b,#5e3c4e)',
  'linear-gradient(140deg,#20242e,#49506b)',
  'linear-gradient(150deg,#3d2f1c,#77602f)',
]

function Img({ url, alt, index, className }: { url?: string; alt?: string; index: number; className: string }) {
  const src = mediaUrl(url)
  if (src && !src.startsWith('/demo/')) {
    // real uploaded media
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt ?? ''} className={`${className} object-cover`} loading="lazy" />
  }
  return (
    <div
      role="img"
      aria-label={alt ?? ''}
      title={alt ?? ''}
      className={className}
      style={{ background: GRADIENTS[index % GRADIENTS.length] }}
    />
  )
}

export function ImageGrid({ data }: { data: Record<string, unknown> }) {
  const images = (data.images as { url?: string; alt?: string }[] | undefined) ?? []
  if (!images.length) return null
  return (
    <div className="grid grid-cols-3 gap-1.5">
      {images.slice(0, 9).map((img, i) => (
        <Img key={i} url={img.url} alt={img.alt} index={i} className="aspect-square rounded-[10px] w-full" />
      ))}
    </div>
  )
}

export function BeforeAfter({ data }: { data: Record<string, unknown> }) {
  const before = data.before as { url?: string } | undefined
  const after = data.after as { url?: string } | undefined
  const caption = (data.caption as string) ?? ''
  return (
    <div>
      <div className="grid grid-cols-2 gap-1.5">
        <div className="relative">
          <Img url={before?.url} alt="Before" index={1} className="aspect-[4/5] rounded-[10px] w-full" />
          <span className="absolute top-2 start-2 text-[10px] font-bold uppercase tracking-wider bg-black/50 text-white/90 rounded-full px-2 py-0.5">Before</span>
        </div>
        <div className="relative">
          <Img url={after?.url} alt="After" index={5} className="aspect-[4/5] rounded-[10px] w-full" />
          <span className="absolute top-2 start-2 text-[10px] font-bold uppercase tracking-wider bg-[#c9a45c] text-[#141414] rounded-full px-2 py-0.5">After</span>
        </div>
      </div>
      {caption ? <p className="mt-1.5 text-xs text-[#9aa0ae]">{caption}</p> : null}
    </div>
  )
}

export function Testimonial({ data }: { data: Record<string, unknown> }) {
  const text = (data.text as string) ?? ''
  const attribution = (data.attribution as string) ?? ''
  const dateLabel = (data.date_label as string) ?? ''
  if (!text) return null
  return (
    <div className="relative rounded-[14px] border border-[#1b3a2b] bg-[#0d1f17] px-4 py-3">
      <p className="text-[13.5px] leading-relaxed">{text}</p>
      <small className="mt-1.5 block text-[11px] text-[#7fae95]">
        {attribution}
        {dateLabel ? `, ${dateLabel}` : ''}
      </small>
      <span aria-hidden className="absolute bottom-2 end-3 text-[10px] text-[#53bdeb]">✓✓</span>
    </div>
  )
}

export function StatCard({ data }: { data: Record<string, unknown> }) {
  const value = (data.value as string) ?? ''
  const label = (data.label as string) ?? ''
  if (!value) return null
  return (
    <div className="rounded-[14px] border border-[#262a35] bg-[#16181f] px-4 py-5 text-center">
      <div className="text-3xl font-black text-[#c9a45c]">{value}</div>
      <div className="mt-1 text-[12.5px] text-[#9aa0ae]">{label}</div>
    </div>
  )
}

export function VideoLink({ data }: { data: Record<string, unknown> }) {
  const url = (data.url as string) ?? ''
  const title = (data.title as string) ?? 'Watch'
  if (!url) return null
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-3 rounded-[14px] border border-[#262a35] bg-[#16181f] px-4 py-3 hover:border-[#c9a45c]/50 transition-colors"
    >
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#c9a45c] text-sm text-[#141414]">▶</span>
      <span className="text-[13.5px] font-semibold">{title}</span>
    </a>
  )
}

export function CaseCard({ data }: { data: Record<string, unknown> }) {
  const title = (data.title as string) ?? ''
  const excerpt = (data.excerpt as string) ?? ''
  if (!title) return null
  return (
    <div className="rounded-[14px] border border-[#262a35] bg-[#16181f] px-4 py-3">
      <h3 className="text-[14px] font-bold">{title}</h3>
      {excerpt ? <p className="mt-1 text-[12.5px] leading-relaxed text-[#9aa0ae]">{excerpt}</p> : null}
    </div>
  )
}

export function Block({ block }: { block: PublicBlock }) {
  switch (block.type) {
    case 'image_grid': return <ImageGrid data={block.data} />
    case 'before_after': return <BeforeAfter data={block.data} />
    case 'testimonial': return <Testimonial data={block.data} />
    case 'stat_card': return <StatCard data={block.data} />
    case 'video_link': return <VideoLink data={block.data} />
    case 'case_card': return <CaseCard data={block.data} />
    default: return null
  }
}
