// Talks to time_sheet_server's public, unauthenticated quote-intake
// endpoints (publicQuoteIntakeController.ts) — never anything authenticated.
import type { DynamicServiceType } from '../components/quote/configs/dynamicTypes'

const API_BASE = process.env.NEXT_PUBLIC_API_URL ?? ''

export interface PublicCompany {
  name: string
  logo: string | null
  phone: string | null
}

export async function fetchPublicCompany(slug: string): Promise<PublicCompany | null> {
  if (!API_BASE) return null
  try {
    const res = await fetch(`${API_BASE}/public/quote-intake/${encodeURIComponent(slug)}`, { cache: 'no-store' })
    if (!res.ok) return null
    const data = await res.json()
    return data.company as PublicCompany
  } catch {
    return null
  }
}

// GET .../:slug/workflow — the company's published Quote Workflow, what
// their public wizard is actually built from (see quoteWorkflowController.ts's
// getPublicQuoteWorkflow). Never published yet → { serviceTypes: [] }, not a
// 404 — the link is still valid, there's just nothing configured.
export async function fetchPublicQuoteWorkflow(slug: string): Promise<DynamicServiceType[]> {
  if (!API_BASE) return []
  try {
    const res = await fetch(`${API_BASE}/public/quote-intake/${encodeURIComponent(slug)}/workflow`, { cache: 'no-store' })
    if (!res.ok) return []
    const data = await res.json()
    return (data.serviceTypes ?? []) as DynamicServiceType[]
  } catch {
    return []
  }
}

export interface QuoteIntakeEstimate {
  lines: { label: string; price: number }[]
  total: number
  requiresManualQuote: boolean
}

export interface QuoteIntakePayload {
  serviceType: string
  answers: Record<string, unknown>
  firstName: string
  lastName?: string
  email: string
  phone?: string
  postcode?: string
  address?: string
  marketingConsent?: boolean
  estimate?: QuoteIntakeEstimate
}

export async function submitPublicQuoteIntake(slug: string, payload: QuoteIntakePayload): Promise<boolean> {
  if (!API_BASE) return false
  try {
    const res = await fetch(`${API_BASE}/public/quote-intake/${encodeURIComponent(slug)}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })
    return res.ok
  } catch {
    return false
  }
}
