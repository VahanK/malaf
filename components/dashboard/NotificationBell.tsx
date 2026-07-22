'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { buildWaLink } from '@/lib/wa-link'

interface NotificationRow {
  id: string
  type: 'quote_approved' | 'payment_claimed' | 'payment_confirmed' | 'usdt_matched'
  title: string
  message: string
  link: string | null
  is_read: boolean
  created_at: string
}

const ICON: Record<NotificationRow['type'], string> = {
  quote_approved: '✅',
  payment_claimed: '💵',
  payment_confirmed: '✅',
  usdt_matched: '🪙',
}

function formatTime(timestamp: string) {
  const diff = Date.now() - new Date(timestamp).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export function NotificationBell() {
  const router = useRouter()
  const supabase = createClient()
  const [items, setItems] = useState<NotificationRow[]>([])
  const [open, setOpen] = useState(false)
  const [loaded, setLoaded] = useState(false)
  const [ownWhatsapp, setOwnWhatsapp] = useState<string | null>(null)

  const unreadCount = items.filter(n => !n.is_read).length

  const fetchItems = async () => {
    const { data } = await supabase
      .from('notifications')
      .select('id, type, title, message, link, is_read, created_at')
      .order('created_at', { ascending: false })
      .limit(20)
    if (data) setItems(data as NotificationRow[])
    setLoaded(true)
  }

  useEffect(() => {
    fetchItems()
    const interval = setInterval(fetchItems, 30000)
    return () => clearInterval(interval)
  }, [])

  // Own WhatsApp number, fetched once — the bridge back to the app: a
  // freelancer who found a lead via their card link and went straight back
  // to WhatsApp never opens the dashboard to see this. "Send to my
  // WhatsApp" puts the same notification where they'll actually see it,
  // via the one-tap wa.me pattern already used for the chaser (no Meta
  // API, no automated send — CLAUDE.md red line intact).
  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      const { data } = await supabase.from('profiles').select('whatsapp_number').eq('id', user.id).single()
      if (data?.whatsapp_number) setOwnWhatsapp(data.whatsapp_number)
    })
  }, [])

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (!(e.target as HTMLElement).closest('[data-notif-root]')) setOpen(false)
    }
    document.addEventListener('click', onClick)
    return () => document.removeEventListener('click', onClick)
  }, [open])

  const markRead = async (id: string) => {
    setItems(prev => prev.map(n => (n.id === id ? { ...n, is_read: true } : n)))
    await supabase.from('notifications').update({ is_read: true }).eq('id', id)
  }

  const markAllRead = async () => {
    const unreadIds = items.filter(n => !n.is_read).map(n => n.id)
    if (!unreadIds.length) return
    setItems(prev => prev.map(n => ({ ...n, is_read: true })))
    await supabase.from('notifications').update({ is_read: true }).in('id', unreadIds)
  }

  const handleClick = (n: NotificationRow) => {
    if (!n.is_read) markRead(n.id)
    setOpen(false)
    if (n.link) router.push(n.link)
  }

  const sendToWhatsapp = (e: React.MouseEvent, n: NotificationRow) => {
    e.stopPropagation()
    if (!ownWhatsapp) return
    if (!n.is_read) markRead(n.id)
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    const text = `${n.title} — ${n.message}${n.link ? `\n${origin}${n.link}` : ''}`
    window.open(buildWaLink(ownWhatsapp, text), '_blank')
  }

  return (
    <div className="relative" data-notif-root>
      <button
        onClick={() => setOpen(v => !v)}
        className="relative flex h-9 w-9 items-center justify-center rounded-lg text-dash-muted hover:bg-dash-surface hover:text-dash-ink"
        aria-label="Notifications"
      >
        <BellIcon />
        {loaded && unreadCount > 0 && (
          <span className="absolute -right-1 -top-1 flex h-4 min-w-[16px] items-center justify-center rounded-full bg-dash-danger px-1 text-[10px] font-bold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute left-0 z-20 mt-2 w-80 rounded-lg border border-dash-border bg-dash-surface shadow-lg">
          <div className="flex items-center justify-between border-b border-dash-border px-3 py-2">
            <span className="text-xs font-semibold text-dash-ink">Notifications</span>
            {unreadCount > 0 && (
              <button onClick={markAllRead} className="text-xs font-medium text-dash-accent">
                Mark all read
              </button>
            )}
          </div>
          <div className="max-h-96 overflow-y-auto">
            {items.length === 0 ? (
              <p className="px-3 py-6 text-center text-xs text-dash-muted">No notifications yet</p>
            ) : (
              items.map(n => (
                <div
                  key={n.id}
                  onClick={() => handleClick(n)}
                  className={`w-full cursor-pointer border-b border-dash-border px-3 py-2.5 text-left last:border-0 hover:bg-dash-bg ${!n.is_read ? 'bg-dash-accent/5' : ''}`}
                >
                  <div className="flex items-start gap-2">
                    <span className="text-base leading-none">{ICON[n.type]}</span>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-semibold text-dash-ink">{n.title}</p>
                      <p className="mt-0.5 line-clamp-2 text-xs text-dash-muted">{n.message}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <p className="text-[10px] text-dash-muted">{formatTime(n.created_at)}</p>
                        {ownWhatsapp && (
                          <button
                            onClick={e => sendToWhatsapp(e, n)}
                            className="ml-auto flex items-center gap-1 rounded-full border border-dash-border px-2 py-0.5 text-[10px] font-medium text-dash-muted hover:border-dash-accent hover:text-dash-accent"
                          >
                            💬 Send to my WhatsApp
                          </button>
                        )}
                      </div>
                    </div>
                    {!n.is_read && <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-dash-accent" />}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}

function BellIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
