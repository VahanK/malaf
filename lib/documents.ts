export interface LineItem {
  title: string
  title_ar?: string
  qty: number
  unit_price: number
  unit: 'project' | 'session' | 'hour' | 'event' | 'day' | 'month'
  note?: string
}

export type DocumentType = 'quote' | 'invoice' | 'receipt'
export type DocumentStatus = 'draft' | 'sent' | 'approved' | 'declined' | 'paid' | 'void'

export interface DocumentRow {
  id: string
  profile_id: string
  type: DocumentType
  parent_document_id: string | null
  doc_number: number
  status: DocumentStatus
  client_name: string
  client_phone: string
  client_email: string
  language: 'en' | 'ar'
  currency: 'USD' | 'LBP'
  line_items: LineItem[]
  subtotal: number
  discount: number
  total: number
  notes: string
  notes_ar: string
  due_at: string | null
  approved_at: string | null
  approved_via: 'client_tap' | 'whatsapp_manual' | null
  paid_at: string | null
  paid_via: 'freelancer_confirm' | 'usdt_watcher' | null
  usdt_reference: string | null
  void_at: string | null
  void_reason: string
  created_at: string
}

export function computeTotals(items: LineItem[], discount: number) {
  const subtotal = items.reduce((sum, i) => sum + i.qty * i.unit_price, 0)
  const total = Math.max(0, subtotal - discount)
  return { subtotal, total }
}

export function formatMoney(amount: number, currency: 'USD' | 'LBP') {
  const symbol = currency === 'USD' ? '$' : 'LBP '
  return `${symbol}${amount.toLocaleString('en-US')}`
}

export function docPrefix(type: DocumentType) {
  return type === 'quote' ? 'Q' : type === 'invoice' ? 'INV' : 'R'
}

export const STATUS_LABEL: Record<DocumentStatus, string> = {
  draft: 'Draft',
  sent: 'Sent',
  approved: 'Approved',
  declined: 'Declined',
  paid: 'Paid',
  void: 'Void',
}

// Escalation cadence (plan §0/§4): tier 1 as soon as overdue, tier 2 at
// 7+ days, tier 3 at 14+ days. Thresholds are a placeholder default from
// MASTER-PLAN's own framing — the actual tone/copy per tier needs founder
// review before real sends (see message_templates reminder_tier1-3 rows).
export interface ReminderEvent {
  event: string
  detail: { tier?: number } | null
  created_at: string
}

export function daysOverdue(dueAt: string | null): number {
  if (!dueAt) return 0
  const ms = Date.now() - new Date(dueAt).getTime()
  return Math.floor(ms / (1000 * 60 * 60 * 24))
}

export function currentReminderTier(dueAt: string | null): 0 | 1 | 2 | 3 {
  const days = daysOverdue(dueAt)
  if (days >= 14) return 3
  if (days >= 7) return 2
  if (days >= 0) return 1
  return 0 // not yet due
}

export function lastSentTier(events: ReminderEvent[]): number {
  const sent = events
    .filter(e => e.event === 'reminder_sent')
    .map(e => e.detail?.tier ?? 0)
  return sent.length ? Math.max(...sent) : 0
}
