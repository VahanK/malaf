// Single source of truth for the founder's concierge WhatsApp — the
// "talk to me to set up your page" / "arrange payment" channel used on the
// homepage nav + footer, the onboarding concierge link, and the subscription
// checkout's manual-payment button.
//
// ⚠️ PLACEHOLDER — set FOUNDER_PHONE to the real +961 number (digits only, no
// spaces or +) before launch. This is the ONLY place to change it.
export const FOUNDER_PHONE = '961XXXXXXXX'

/** Build a wa.me deep link to the founder with a prefilled message. */
export function buildFounderWa(message: string): string {
  return `https://wa.me/${FOUNDER_PHONE}?text=${encodeURIComponent(message)}`
}

/** The default homepage/footer concierge link. */
export const FOUNDER_WA = buildFounderWa("Hi! I'd like help setting up my WorkWith page.")
