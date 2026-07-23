import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NotificationBell } from '@/components/dashboard/NotificationBell'

const NAV = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/inbox', label: 'Client requests' },
  { href: '/dashboard/quotes', label: 'Quotes' },
  { href: '/dashboard/invoices', label: 'Invoices' },
  { href: '/dashboard/services', label: 'Services' },
  { href: '/dashboard/portfolio', label: 'Your page' },
  { href: '/dashboard/payment-methods', label: 'Payment methods' },
  { href: '/dashboard/profile', label: 'Profile' },
  { href: '/dashboard/requests', label: 'Request a feature' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  const { data: me } = await supabase.from('profiles').select('is_founder, handle').eq('id', user.id).single()
  // No handle yet = never finished onboarding — send them through the launch flow first.
  if (me && !me.handle) redirect('/onboarding')
  const nav = me?.is_founder ? [...NAV, { href: '/dashboard/founder', label: 'Founder' }] : NAV

  return (
    <div className="min-h-screen bg-dash-bg text-dash-ink">
      {/* Mobile top bar: brand + bell, then a horizontal-scroll nav. */}
      <div className="sticky top-0 z-20 border-b border-dash-border bg-dash-bg/90 backdrop-blur lg:hidden">
        <div className="flex items-center justify-between px-4 py-3">
          <span className="text-lg font-semibold">WorkWith</span>
          <NotificationBell />
        </div>
        <nav className="flex gap-1 overflow-x-auto px-3 pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="shrink-0 whitespace-nowrap rounded-lg px-3 py-1.5 text-[13px] font-medium text-dash-muted hover:bg-dash-surface hover:text-dash-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="mx-auto flex max-w-6xl gap-8 px-4 py-6 sm:px-6 lg:py-8">
        {/* Desktop sidebar */}
        <nav className="hidden w-44 shrink-0 space-y-1 lg:block">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-lg font-semibold">WorkWith</span>
            <NotificationBell />
          </div>
          {nav.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-dash-muted hover:bg-dash-surface hover:text-dash-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="min-w-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
