import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'
import { getPoster, FORMATS } from '@/components/posts/posters'

export const maxDuration = 30 // cold Chromium boot + render budget

// Screenshots a single /studio/posts/[slug] surface into a crisp 1080×1080 PNG
// for download — the "export" half of the marketing-post studio. Same headless
// approach as app/api/render/[token] (the document renderer): @sparticuz's
// Lambda-optimized Chromium on Vercel, a locally-installed Chrome otherwise
// (set CHROME_EXECUTABLE_PATH if it's not at the default Windows path).
//
// deviceScaleFactor: 2 → the 1080px poster element is captured at 2160px, so
// the PNG stays sharp when Instagram re-encodes and on retina screens.
async function getBrowser() {
  if (process.env.VERCEL) {
    return puppeteer.launch({
      args: chromium.args,
      executablePath: await chromium.executablePath(),
      headless: true,
    })
  }
  const localPath =
    process.env.CHROME_EXECUTABLE_PATH ?? 'C:/Program Files/Google/Chrome/Application/chrome.exe'
  return puppeteer.launch({ executablePath: localPath, headless: true })
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const poster = getPoster(slug)
  if (!poster) {
    return NextResponse.json({ error: 'Unknown poster' }, { status: 404 })
  }
  const dim = FORMATS[poster.format]

  const { searchParams } = new URL(request.url)
  const download = searchParams.get('dl') === '1'

  const origin = process.env.VERCEL
    ? process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin
    : new URL(request.url).origin
  const targetUrl = `${origin}/studio/posts/${slug}`

  let browser
  try {
    browser = await getBrowser()
    const page = await browser.newPage()
    await page.setViewport({ width: dim.w, height: dim.h, deviceScaleFactor: 2 })
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 20000 })
    // Web fonts (Fraunces / Inter / Tajawal) must be laid out before the shot,
    // or the serif headlines fall back to Georgia in the export.
    await page.evaluate(() => (document as unknown as { fonts: { ready: Promise<unknown> } }).fonts.ready)

    const el = await page.$('#poster')
    const box = await el?.boundingBox()
    const screenshot = await page.screenshot({
      type: 'png',
      clip: box ? { x: box.x, y: box.y, width: box.width, height: box.height } : undefined,
    })

    return new NextResponse(Buffer.from(screenshot), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'public, max-age=3600',
        ...(download ? { 'Content-Disposition': `attachment; filename="workwith-${slug}.png"` } : {}),
      },
    })
  } catch (err) {
    console.error('Poster render failed:', err)
    return NextResponse.json({ error: 'Could not render poster' }, { status: 500 })
  } finally {
    await browser?.close()
  }
}
