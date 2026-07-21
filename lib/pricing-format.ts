// Pure formatting helpers, safe to import from client OR server components.
// Split out of lib/public-page.ts because that file also exports
// getPublicPage(), which transitively imports the server-only Supabase
// client (next/headers) — any client component importing formatPrice/
// unitLabel from the same file would pull that server-only code into the
// browser bundle and fail to build.

export type PriceUnit = 'project' | 'session' | 'hour' | 'event' | 'day' | 'month'

export interface PricedItem {
  price: number
  currency: 'USD' | 'LBP'
  starting_from: boolean
}

export function formatPrice(s: PricedItem): string {
  const symbol = s.currency === 'USD' ? '$' : 'LBP '
  const amount = s.price.toLocaleString('en-US')
  return `${symbol}${amount}${s.starting_from ? '+' : ''}`
}

export function unitLabel(unit: PriceUnit, lang: 'en' | 'ar'): string {
  const en: Record<string, string> = {
    project: 'per project', session: 'per session', hour: 'per hour',
    event: 'per event', day: 'per day', month: 'per month',
  }
  const ar: Record<string, string> = {
    project: 'للمشروع', session: 'للجلسة', hour: 'بالساعة',
    event: 'للمناسبة', day: 'باليوم', month: 'بالشهر',
  }
  return (lang === 'ar' ? ar : en)[unit]
}
