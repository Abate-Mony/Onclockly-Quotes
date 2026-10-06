import type { ComponentType } from 'react'
import type { Control } from 'react-hook-form'
import type { ZodType } from 'zod'

// What QuizStepRunner needs to drive ANY industry's wizard — same shape
// registry.tsx/flow.ts already had, just named and exported as a unit
// instead of being the only implementation QuizStepRunner could import.
// A second industry (e.g. security, facilities-only) is a second file
// implementing this same interface, not a change to the shell.
export interface StepConfig {
  schema: ZodType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- erased on purpose: each step's field shape is distinct, the runner is generic over all of them
  Fields: ComponentType<{ control: Control<any> }>
  title: string
  subtitle?: string
  // Drives QuestionHeading's "*"/"(optional)" indicator for a single-question
  // page. Omitted (e.g. the 'contact' step, grouped pages which render their
  // own per-question headings instead) shows neither.
  required?: boolean
  showBack?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNextLabel?: (values: any) => string
}

export interface PriceLine {
  line: string
  price: number
}

export interface ReviewSection {
  label: string
  value: string
}

export interface IndustryConfig {
  key: string
  // First screen after 'welcome' — where the "Get started" CTA sends the visitor.
  initialStep: string
  stepRegistry: Record<string, StepConfig>
  getNextScreen: (current: string, answers: Record<string, unknown>) => string
  getProgress: (screen: string, answers: Record<string, unknown>) => { current: number; total: number } | null
  getServiceLabel: (serviceType?: string) => string
  requiresManualQuote: (answers: Record<string, unknown>) => boolean
  estimatePrice: (answers: Record<string, unknown>) => PriceLine[]
  // Optional — when omitted, ReviewStep/QuoteManualStep fall back to their
  // own hardcoded cleaning-field list (today's behaviour, unchanged). A
  // config whose questions aren't known upfront (e.g. the dynamic,
  // backend-driven config) provides this instead of that fallback ever
  // needing to know its fields.
  getReviewSections?: (answers: Record<string, unknown>) => ReviewSection[]
  // Where ReviewFields' "Edit" link for the contact section should go.
  // Omitted configs (cleaning) use the fixed 'contact' screen key; the
  // dynamic config's contact step key varies per service type, so it
  // resolves the right one here instead.
  getContactStepKey?: (answers: Record<string, unknown>) => string
}
