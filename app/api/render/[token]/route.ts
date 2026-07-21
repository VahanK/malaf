import { NextResponse } from 'next/server'
import puppeteer from 'puppeteer-core'
import chromium from '@sparticuz/chromium'

export const maxDuration = 30 // Vercel: cold Chromium boot + render can take a few seconds

// Screenshots the actual /q, /i, or /r token page and returns it as a PNG —
// the "image version" of a document for one-tap WhatsApp share (a picture
// attaches far more reliably than a link in the culture this app targets).
//
// Infra note (plan §8 risk #1): on Vercel this needs @sparticuz/chromium's
// Lambda-optimized binary + puppeteer-core, not full Puppeteer (which would
// blow the function size/cold-start budget). Locally there's no such binary,
// so this falls back to a real installed Chrome — set CHROME_EXECUTABLE_PATH
// in .env.local if it's not at Chrome's default Windows install path.
async function getBrowser() {
  const isVercel = !!process.env.VERCEL
  if (isVercel) {
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

export async function GET(request: Request, { params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const { searchParams } = new URL(request.url)
  const type = searchParams.get('type') // 'q' | 'i' | 'r'
  if (!type || !['q', 'i', 'r'].includes(type)) {
    return NextResponse.json({ error: 'Missing or invalid type' }, { status: 400 })
  }

  // The headless browser needs an origin it can actually reach — in
  // production that's the public site URL, but in local dev
  // NEXT_PUBLIC_SITE_URL is work-withme.com (doesn't resolve locally), so this
  // must prefer the request's own origin whenever running off Vercel.
  const origin = process.env.VERCEL
    ? process.env.NEXT_PUBLIC_SITE_URL ?? new URL(request.url).origin
    : new URL(request.url).origin
  const targetUrl = `${origin}/${type}/${token}`

  let browser
  try {
    browser = await getBrowser()
    const page = await browser.newPage()
    await page.setViewport({ width: 480, height: 800, deviceScaleFactor: 2 })
    await page.goto(targetUrl, { waitUntil: 'networkidle0', timeout: 15000 })

    // Full-page screenshot of the card, not the viewport crop.
    const bodyHandle = await page.$('main')
    const box = await bodyHandle?.boundingBox()
    const screenshot = await page.screenshot({
      type: 'png',
      clip: box ? { x: 0, y: 0, width: box.width, height: box.height } : undefined,
    })

    return new NextResponse(Buffer.from(screenshot), {
      headers: {
        'Content-Type': 'image/png',
        'Cache-Control': 'private, max-age=60',
      },
    })
  } catch (err) {
    console.error('Render failed:', err)
    return NextResponse.json({ error: 'Could not render image' }, { status: 500 })
  } finally {
    await browser?.close()
  }
}
