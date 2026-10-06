import { buildDynamicConfig } from './dynamic'
import type { DynamicServiceType } from './dynamicTypes'
import type { IndustryConfig } from './types'

// Every company's wizard is built from their own published Quote Workflow
// (Settings → Quote Workflow in work.wk) — never a shared hardcoded
// industry template. See components/NotConfigured.tsx for what a company
// with no published workflow sees instead of this.
export function getConfigForCompany(serviceTypes: DynamicServiceType[]): IndustryConfig {
    return buildDynamicConfig(serviceTypes)
}

export function hasActiveServices(serviceTypes: DynamicServiceType[]): boolean {
    return serviceTypes.some(s => s.active)
}

export type { IndustryConfig, StepConfig } from './types'
export type { DynamicServiceType } from './dynamicTypes'
