import { notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { unitLabel } from '@/lib/public-page'
import { DOC_COPY } from '@/lib/i18n-docs'

export const dynamic = 'force-dynamic'

interface LineItem {
  title: string
  qty: number
  unit_price: number
  unit: 'project' | 'session' | 'hour' | 'event' | 'day' | 'month'
}

export default async function InvoiceTokenPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = await createClient()
  const { data } = await supabase.rpc('get_document_by_token', { p_token: token })
  if (!data) notFound()

  const doc = data.document
  const profile = data.profile
  const accent = profile.accent_color ?? '#c9a45c'
  const isRtl = doc.language === 'ar'
  const t = DOC_COPY[doc.language as 'en' | 'ar']
  const money = (n: number) => (doc.currency === 'USD' ? '$' : 'LBP ') + n.toLocaleString('en-US')

  // The invoice-view token and pay token are deliberately separate tokens
  // (plan §0: pay-ability revocable independently of view-ability) —
  // get_document_by_token now also returns the sibling pay token so this
  // route can link correctly without ever touching access_tokens directly
  // (that table has RLS enabled with zero policies; only definer functions
  // may read it).
  const payToken: string | null = doc.status !== 'paid' ? (data.pay_token ?? null) : null

  return (
    <main dir={isRtl ? 'rtl' : 'ltr'} className="min-h-screen bg-[#0e0f13] text-[#f4f2ec]">
      <div className="mx-auto max-w-md px-5 py-8">
        <p className="text-xs text-[#9aa0ae]">{t.invoiceFrom}</p>
        <h1 className="text-xl font-black">{profile.full_name}</h1>

        <div className="mt-5 rounded-2xl border border-[#262a35] bg-[#16181f] p-4">
          {(doc.line_items as LineItem[]).map((item, i) => (
            <div key={i} className="flex justify-between border-b border-dashed border-[#262a35] py-2.5 text-[14px] last:border-0">
              <div>
                <div>{item.title}</div>
                <div className="text-[11px] text-[#6b7284]">
                  {item.qty} × {unitLabel(item.unit, doc.language)}
                </div>
              </div>
              <span className="font-black" style={{ color: accent }}>{money(item.qty * item.unit_price)}</span>
            </div>
          ))}
          <div className="mt-2.5 flex justify-between text-[15px] font-black">
            <span>{t.total}</span>
            <span style={{ color: accent }}>{money(doc.total)}</span>
          </div>
        </div>

        <div className="mt-5">
          {doc.status === 'paid' ? (
            <div className="rounded-2xl border border-[#1b3a2b] bg-[#0d1f17] px-4 py-4 text-center">
              <p className="text-[14px] font-bold text-[#3ddc84]">{t.paidThanks}</p>
            </div>
          ) : payToken ? (
            <a
              href={`/p/${payToken}`}
              className="block w-full rounded-2xl py-[15px] text-center text-base font-black text-[#141414]"
              style={{ background: accent }}
            >
              {t.payButton}
            </a>
          ) : null}
        </div>
      </div>
    </main>
  )
}
