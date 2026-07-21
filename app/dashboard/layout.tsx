import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import { NotificationBell } from '@/components/dashboard/NotificationBell'

const NAV = [
  { href: '/dashboard', label: 'Overview' },
  { href: '/dashboard/quotes', label: 'Quotes' },
  { href: '/dashboard/invoices', label: 'Invoices' },
  { href: '/dashboard/services', label: 'Services' },
  { href: '/dashboard/portfolio', label: 'Portfolio' },
  { href: '/dashboard/payment-methods', label: 'Payment methods' },
  { href: '/dashboard/profile', label: 'Profile' },
]

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/auth/signin')

  return (
    <div className="min-h-screen bg-dash-bg text-dash-ink">
      <div className="mx-auto flex max-w-5xl gap-8 px-6 py-8">
        <nav className="w-44 shrink-0 space-y-1">
          <div className="mb-6 flex items-center justify-between">
            <span className="text-lg font-semibold lowercase">malaf</span>
            <NotificationBell />
          </div>
          {NAV.map(item => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-lg px-3 py-2 text-sm text-dash-muted hover:bg-dash-surface hover:text-dash-ink"
            >
              {item.label}
            </Link>
          ))}
        </nav>
        <main className="flex-1">{children}</main>
      </div>
    </div>
  )
}
