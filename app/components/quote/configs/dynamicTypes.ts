// Mirrors time_sheet_server's quoteWorkflowModel.ts plain-data interfaces —
// what GET /public/quote-intake/:slug/workflow returns. See that file's
// module comment for the draft/published split and why pricing is
// additive-only (basePrice + sum(selectedOption.priceDelta), always
// recomputed server-side at submit time — client-side here is a preview).
export type DynamicStepType = 'choice' | 'multiselect' | 'number' | 'text' | 'textarea' | 'date' | 'contact'

export interface DynamicStepOption {
  label: string
  value: string
  priceDelta: number
  order: number
}

export interface DynamicNumberConfig {
  min: number
  max: number
  step: number
  pricePerUnit?: number
}

export interface DynamicStep {
  id: string
  type: DynamicStepType
  label: string
  subtitle?: string
  placeholder?: string
  helpText?: string
  required: boolean
  order: number
  active: boolean
  options?: DynamicStepOption[]
  numberConfig?: DynamicNumberConfig
}

export interface DynamicServiceType {
  key: string
  label: string
  description?: string
  icon?: string
  order: number
  active: boolean
  basePrice: number
  requiresManualQuote: boolean
  // How many of this service's questions the wizard shows per page — 1
  // means one question per screen; a higher number groups that many
  // consecutive active, non-contact steps (by order) onto one page. The
  // contact step is always its own final page regardless of this value.
  questionsPerPage: number
  steps: DynamicStep[]
}
