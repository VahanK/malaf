'use client'

import { useState } from 'react'

export interface FaqItem {
  q: string
  a: string
}

export function FaqAccordion({ items }: { items: FaqItem[] }) {
  // independent-toggle: any number of rows may be open at once
  const [open, setOpen] = useState<Record<number, boolean>>({})

  return (
    <div className="mt-12 divide-y divide-[#171310]/10 border-y border-[#171310]/10">
      {items.map((item, i) => {
        const isOpen = !!open[i]
        return (
          <div key={i}>
            <button
              onClick={() => setOpen(prev => ({ ...prev, [i]: !prev[i] }))}
              aria-expanded={isOpen}
              className="flex w-full items-center justify-between gap-4 py-5 text-left"
            >
              <span className="text-[17px] font-semibold text-[#171310]">{item.q}</span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#e8623d"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`shrink-0 transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}
              >
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <div
              className={`grid transition-all duration-300 ease-out ${
                isOpen ? 'grid-rows-[1fr] pb-5 opacity-100' : 'grid-rows-[0fr] opacity-0'
              }`}
            >
              <div className="overflow-hidden">
                <p className="max-w-2xl text-[15px] leading-relaxed text-[#5c574c]">{item.a}</p>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
