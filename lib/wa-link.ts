// Plain URL construction — no server round-trip, no secrets, no DB.
// This is the entire "chaser" mechanic: the app writes the text, the
// freelancer's own tap opens WhatsApp with it prefilled. WorkWith never calls
// a WhatsApp API and never sees delivery/read state (CLAUDE.md red line:
// no Meta APIs, one tap, never automated).
export function buildWaLink(phone: string, message: string): string {
  const digits = phone.replace(/[^\d]/g, '')
  return `https://wa.me/${digits}?text=${encodeURIComponent(message)}`
}

export function fillTemplate(body: string, vars: Record<string, string>): string {
  return body.replace(/\{\{(\w+)\}\}/g, (_, key) => vars[key] ?? '')
}
