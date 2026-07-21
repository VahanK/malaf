import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { unitLabel } from '@/lib/public-page'

// Receipts are immutable once created — safe to ISR, unlike q/i/p.
export const revalidate = 3600

interface LineItem {
  title: string
  qty: number
  unit_price: number
  unit: 'project' | 'session' | 'hour' | 'event' | 'day' | 'month'
}

export default async function ReceiptTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()
  const { data } = await supabase.rpc('get_document_by_token', { p_token: token })
  if (!data) notFound()

  const doc = data.document
  const profile = data.profile
  const accent = profile.accent_color ?? '#c9a45c'
  const isRtl = doc.language === 'ar'
  const money = (n: number) => (doc.currency === 'USD' ? '$' : 'LBP ') + n.toLocaleString('en-US')

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#0e0f13] text-[#f4f2ec]">
      <div className="mx-auto max-w-md px-5 py-8">
        <div className="text-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-[#1b3a2b] bg-[#0d1f17] px-3 py-1 text-[11px] font-bold text-[#3ddc84]">
            ✓ Paid
          </span>
        </div>
        <h1 className="mt-3 text-center text-xl font-black">Receipt from {profile.full_name}</h1>
        <p className="mt-1 text-center text-xs text-[#9aa0ae]">
          {doc.paid_at ? new Date(doc.paid_at).toLocaleDateString() : ''}
        </p>

        <div className="mt-5 rounded-2xl border border-[#262a35] bg-[#16181f] p-4">
          {(doc.line_items as LineItem[]).map((item, i) => (
            <div key={i} className="flex justify-between border-b border-dashed border-[#262a35] py-2.5 text-[14px] last:border-0">
              <div>
                <div>{item.title}</div>
                <div className="text-[11px] text-[#6b7284]">
                  {item.qty} × {unitLabel(item.unit, doc.language)}
                </div>
              </div>
              <span>{money(item.qty * item.unit_price)}</span>
            </div>
          ))}
          <div className="mt-2.5 flex justify-between text-[15px] font-black">
            <span>Total paid</span>
            <span style={{ color: accent }}>{money(doc.total)}</span>
          </div>
        </div>
      </div>
    </main>
  )
}
