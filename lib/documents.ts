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
