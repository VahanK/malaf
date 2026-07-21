import { getPublicPage } from '@/lib/public-page'

// vCard download — "save contact" (CLAUDE.md v1 §2)
export async function GET(
  _request: Request,
  { params }: { params: Promise<{ handle: string }> }
) {
  const { handle } = await params
  const page = await getPublicPage(handle)
  if (!page) return new Response('Not found', { status: 404 })

  const p = page.profile
  const site = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://work-withme.com'
  const lines = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${p.full_name}`,
    `TITLE:${p.title}`,
    p.whatsapp_number ? `TEL;TYPE=CELL:${p.whatsapp_number}` : null,
    `URL:${site}/${p.handle}`,
    `NOTE:${p.title}${p.title_ar ? ` · ${p.title_ar}` : ''} — via WorkWith`,
    'END:VCARD',
  ].filter(Boolean)

  return new Response(lines.join('\r\n'), {
    headers: {
      'Content-Type': 'text/vcard; charset=utf-8',
      'Content-Disposition': `attachment; filename="${p.handle}.vcf"`,
    },
  })
}
