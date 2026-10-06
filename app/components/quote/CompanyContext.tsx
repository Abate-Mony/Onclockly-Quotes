'use client'

import { createContext, useContext, type ReactNode } from 'react'
import type { PublicCompany } from '../../lib/api'
import type { DynamicServiceType } from './configs/dynamicTypes'

interface CompanyValue extends PublicCompany {
  slug: string
  // The company's own published Quote Workflow — see configs/dynamic.ts.
  // Empty means "valid company, nothing published yet" (see
  // components/NotConfigured.tsx), never a hardcoded fallback.
  serviceTypes: DynamicServiceType[]
}

const CompanyContext = createContext<CompanyValue | null>(null)

export function CompanyProvider({ value, children }: { value: CompanyValue; children: ReactNode }) {
  return <CompanyContext.Provider value={value}>{children}</CompanyContext.Provider>
}

// Every consumer is always rendered inside CompanyProvider (the [slug]
// layout 404s before rendering children otherwise) — throwing here catches
// a missing provider as a loud bug rather than silently rendering
// undefined company details.
export function useCompany(): CompanyValue {
  const ctx = useContext(CompanyContext)
  if (!ctx) throw new Error('useCompany() called outside CompanyProvider')
  return ctx
}
