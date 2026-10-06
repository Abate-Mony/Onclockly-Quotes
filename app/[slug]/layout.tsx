import type { ReactNode } from 'react'
import { notFound } from 'next/navigation'
import { fetchPublicCompany, fetchPublicQuoteWorkflow } from '../lib/api'
import { CompanyProvider } from '../components/quote/CompanyContext'

export default async function CompanyLayout({
  children,
  params,
}: {
  children: ReactNode
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const [company, serviceTypes] = await Promise.all([
    fetchPublicCompany(slug),
    fetchPublicQuoteWorkflow(slug),
  ])

  // No company behind this slug (wrong link, revoked/rotated, or
  // NEXT_PUBLIC_API_URL isn't configured) — a 404 here, not a broken
  // wizard three steps in. An empty serviceTypes list is a different,
  // valid state (company exists, hasn't published a workflow yet) — see
  // components/NotConfigured.tsx, not handled here.
  if (!company) notFound()

  return <CompanyProvider value={{ ...company, slug, serviceTypes }}>{children}</CompanyProvider>
}
