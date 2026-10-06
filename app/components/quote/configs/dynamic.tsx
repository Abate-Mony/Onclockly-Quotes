// Builds an IndustryConfig entirely from a company's own published Quote
// Workflow (fetched server-side in [slug]/layout.tsx, see app/lib/api.ts's
// fetchPublicQuoteWorkflow) — no hardcoded industry content anywhere in
// here. This is what makes a company that configured, say, a security
// patrol quote form see ONLY their own questions, never a cleaning
// fallback (see configs/index.ts for when this is used vs. emptyConfig).
import type { ComponentType, ReactElement } from 'react'
import { z, type ZodType } from 'zod'
import { Controller, type Control } from 'react-hook-form'
import { Home, Sparkles, ShieldCheck, UsersRound } from 'lucide-react'
import { ChoiceCard, QuestionHeading } from '../components/Primitives'
import { ContactFields } from '../steps/ContactStep'
import { contactSchema } from '../schemas'
import type { IndustryConfig, PriceLine, ReviewSection, StepConfig } from './types'
import type { DynamicServiceType, DynamicStep } from './dynamicTypes'
import {
    buildChoiceSchema, ChoiceFields,
    buildMultiselectSchema, MultiselectFields,
    buildNumberSchema, NumberFields,
    buildTextSchema, TextFields,
    buildTextareaSchema, TextareaFields,
    buildDateSchema, DateFields,
} from './dynamicFields'

// Matches the icon picker in work.wk's Quote Workflow builder
// (ServiceTypeModal) — the four ids an admin can choose from there.
const SERVICE_ICONS: Record<string, ComponentType<{ className?: string }>> = {
    home: Home,
    sparkles: Sparkles,
    shield: ShieldCheck,
    team: UsersRound,
}

// Service-type keys and step ids are only unique WITHIN a service type (the
// seed/builder lets two services both use a step id like "contact") — the
// registry key needs to be globally unique across all of a company's
// service types, so it's always serviceKey+stepId, never the bare id.
// "--" (not ":") because this key is used as a literal URL path segment —
// colons round-trip through Next's router as "%3A%3A" and never match the
// registry back. "--" is safe: slugify() collapses any run of non-alphanumeric
// characters to a single "-" and trims leading/trailing ones, so neither a
// service key nor a step id can ever contain "--" on its own.
const SEPARATOR = '--'
const stepRegistryKey = (serviceKey: string, stepId: string) => `${serviceKey}${SEPARATOR}${stepId}`
const splitStepRegistryKey = (key: string): [string, string] => {
    const index = key.indexOf(SEPARATOR)
    return index === -1 ? [key, ''] : [key.slice(0, index), key.slice(index + SEPARATOR.length)]
}

function activeSorted<T extends { active: boolean; order: number }>(items: T[]): T[] {
    return items.filter(i => i.active).sort((a, b) => a.order - b.order)
}

// Groups consecutive active, non-contact steps into pages of `size`
// questions each — the contact step is always its own final page,
// regardless of `size`, so "where do we send your quote" never gets
// buried alongside other questions.
function pageSteps(steps: DynamicStep[], size: number): DynamicStep[][] {
    const n = Math.max(1, size || 1)
    const nonContact = steps.filter(s => s.type !== 'contact')
    const contact = steps.filter(s => s.type === 'contact')
    const pages: DynamicStep[][] = []
    for (let i = 0; i < nonContact.length; i += n) pages.push(nonContact.slice(i, i + n))
    for (const c of contact) pages.push([c])
    return pages
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic across all step types, like StepConfig.Fields itself
const FIELD_BUILDERS: Record<Exclude<DynamicStep['type'], 'contact'>, { schema: (s: DynamicStep) => ZodType; Field: (step: DynamicStep, control: Control<any>) => ReactElement }> = {
    choice: { schema: buildChoiceSchema, Field: (step, control) => <ChoiceFields step={step} control={control} /> },
    multiselect: { schema: buildMultiselectSchema, Field: (step, control) => <MultiselectFields step={step} control={control} /> },
    number: { schema: buildNumberSchema, Field: (step, control) => <NumberFields step={step} control={control} /> },
    text: { schema: buildTextSchema, Field: (step, control) => <TextFields step={step} control={control} /> },
    textarea: { schema: buildTextareaSchema, Field: (step, control) => <TextareaFields step={step} control={control} /> },
    date: { schema: buildDateSchema, Field: (step, control) => <DateFields step={step} control={control} /> },
}

// `page` is one or more questions shown together on one screen (see
// pageSteps above). A lone contact step reuses the existing ContactStep
// component untouched; everything else is built generically per step.
// (The "Continue" button's label is computed generically in
// QuizStepRunner from industry.getNextScreen/getContactStepKey, not here —
// StepConfig.getNextLabel also bypasses React Hook Form's validity check,
// which would silently let a required question through unanswered.)
function buildStepConfig(page: DynamicStep[]): StepConfig {
    if (page.length === 1 && page[0].type === 'contact') {
        const step = page[0]
        return {
            schema: contactSchema,
            Fields: ContactFields as StepConfig['Fields'],
            title: step.label,
            subtitle: step.subtitle,
        }
    }

    if (page.length === 1) {
        const step = page[0]
        const builder = FIELD_BUILDERS[step.type as Exclude<DynamicStep['type'], 'contact'>]
        return {
            schema: z.object({ [step.id]: builder.schema(step) }),
            Fields: ({ control }) => builder.Field(step, control),
            title: step.label,
            subtitle: step.subtitle,
            required: step.required,
        }
    }

    // Multiple questions on one page — each gets its own heading and
    // "Question N of M" label inline (QuizStepRunner skips the top-level
    // heading when title is empty, see QuizStepRunner.tsx) since there's
    // no single question to title the page with.
    const shape: Record<string, ZodType> = {}
    for (const step of page) {
        const builder = FIELD_BUILDERS[step.type as Exclude<DynamicStep['type'], 'contact'>]
        shape[step.id] = builder.schema(step)
    }
    return {
        schema: z.object(shape),
        Fields: ({ control }) => (
            <div className="flex flex-col divide-y divide-border">
                {page.map((step, index) => (
                    <div key={step.id} className={index === 0 ? 'pb-8' : 'pt-8 pb-8 last:pb-0'}>
                        <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Question {index + 1} of {page.length}
                        </p>
                        <QuestionHeading title={step.label} subtitle={step.subtitle} required={step.required} />
                        {FIELD_BUILDERS[step.type as Exclude<DynamicStep['type'], 'contact'>].Field(step, control)}
                    </div>
                ))}
            </div>
        ),
        title: '',
    }
}

function formatAnswer(step: DynamicStep, value: unknown): string | null {
    if (value == null || value === '') return null
    if (step.type === 'choice') {
        const opt = step.options?.find(o => o.value === value)
        return opt?.label ?? String(value)
    }
    if (step.type === 'multiselect') {
        const values = Array.isArray(value) ? value : []
        if (!values.length) return null
        return values.map(v => step.options?.find(o => o.value === v)?.label ?? String(v)).join(', ')
    }
    if (step.type === 'date') {
        const d = new Date(String(value))
        return Number.isNaN(d.getTime()) ? String(value) : d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })
    }
    return String(value)
}

export function buildDynamicConfig(serviceTypes: DynamicServiceType[]): IndustryConfig {
    const services = activeSorted(serviceTypes)
    const serviceByKey = new Map(services.map(s => [s.key, s]))

    const stepRegistry: IndustryConfig['stepRegistry'] = {
        'service-type': {
            schema: z.object({ serviceType: z.string().min(1, 'Choose a service to continue.') }),
            Fields: (({ control }: { control: Control<Record<string, unknown>> }) => (
                <Controller
                    control={control}
                    name="serviceType"
                    render={({ field }) => (
                        <div className="flex flex-col gap-2">
                            {services.map(svc => {
                                const Icon = SERVICE_ICONS[svc.icon ?? ''] ?? Home
                                return (
                                    <ChoiceCard key={svc.key} label={svc.label} description={svc.description} icon={<Icon className="h-5 w-5" />} selected={field.value === svc.key} onClick={() => field.onChange(svc.key)} />
                                )
                            })}
                        </div>
                    )}
                />
            )) as StepConfig['Fields'],
            title: 'What can we help with?',
            subtitle: 'Choose a service to get started.',
            showBack: false,
        },
    }

    // A page's key is its first step's id — stable, and never collides
    // with another page in the same service since each step belongs to
    // exactly one page.
    const pagesFor = (serviceKey?: string): DynamicStep[][] => {
        const service = serviceByKey.get(serviceKey ?? '')
        if (!service) return []
        return pageSteps(activeSorted(service.steps), service.questionsPerPage)
    }
    const pageRegistryKey = (serviceKey: string, page: DynamicStep[]) => stepRegistryKey(serviceKey, page[0].id)

    for (const service of services) {
        for (const page of pagesFor(service.key)) {
            stepRegistry[pageRegistryKey(service.key, page)] = buildStepConfig(page)
        }
    }

    return {
        key: 'dynamic',
        initialStep: 'service-type',
        stepRegistry,

        getNextScreen: (current, answers) => {
            // Shared tail, same as every other config (see flow.ts) — not
            // part of any service's own step list.
            if (current === 'review') return 'calculating'
            if (current === 'calculating') {
                const requiresManual = Boolean(serviceByKey.get(String(answers.serviceType ?? ''))?.requiresManualQuote)
                return requiresManual ? 'quote-manual' : 'quote-instant'
            }

            const serviceKey = String(answers.serviceType ?? '')
            if (current === 'service-type') {
                const pages = pagesFor(serviceKey)
                return pages.length ? pageRegistryKey(serviceKey, pages[0]) : 'review'
            }
            const [currentServiceKey, currentFirstStepId] = splitStepRegistryKey(current)
            const pages = pagesFor(currentServiceKey)
            const index = pages.findIndex(p => p[0].id === currentFirstStepId)
            const next = index >= 0 ? pages[index + 1] : undefined
            return next ? pageRegistryKey(currentServiceKey, next) : 'review'
        },

        getProgress: (screen, answers) => {
            if (screen === 'service-type') return null
            const serviceKey = String(answers.serviceType ?? '')
            const pages = pagesFor(serviceKey)
            // +1 for the service-type screen itself, +1 for review/contact tail.
            const total = pages.length + 1
            if (screen === 'review') return { current: total, total }
            const [, firstStepId] = splitStepRegistryKey(screen)
            const index = pages.findIndex(p => p[0].id === firstStepId)
            return { current: index >= 0 ? index + 2 : 1, total }
        },

        getServiceLabel: (serviceType) => serviceByKey.get(serviceType ?? '')?.label ?? (serviceType ?? ''),

        requiresManualQuote: (answers) => Boolean(serviceByKey.get(String(answers.serviceType ?? ''))?.requiresManualQuote),

        estimatePrice: (answers) => {
            const service = serviceByKey.get(String(answers.serviceType ?? ''))
            if (!service) return []
            const lines: PriceLine[] = [{ line: service.label, price: service.basePrice }]
            for (const step of activeSorted(service.steps)) {
                const value = answers[step.id]
                if (value == null) continue
                if (step.type === 'choice') {
                    const opt = step.options?.find(o => o.value === value)
                    if (opt?.priceDelta) lines.push({ line: opt.label, price: opt.priceDelta })
                } else if (step.type === 'multiselect' && Array.isArray(value)) {
                    for (const v of value) {
                        const opt = step.options?.find(o => o.value === v)
                        if (opt?.priceDelta) lines.push({ line: opt.label, price: opt.priceDelta })
                    }
                } else if (step.type === 'number' && step.numberConfig?.pricePerUnit) {
                    const amount = Number(value) * step.numberConfig.pricePerUnit
                    if (amount) lines.push({ line: step.label, price: amount })
                }
            }
            return lines
        },

        getReviewSections: (answers) => {
            const service = serviceByKey.get(String(answers.serviceType ?? ''))
            if (!service) return []
            const sections: ReviewSection[] = [{ label: 'Service', value: service.label }]
            for (const step of activeSorted(service.steps)) {
                const formatted = formatAnswer(step, answers[step.id])
                if (formatted) sections.push({ label: step.label, value: formatted })
            }
            return sections
        },

        getContactStepKey: (answers) => {
            const serviceKey = String(answers.serviceType ?? '')
            const contactPage = pagesFor(serviceKey).find(p => p.length === 1 && p[0].type === 'contact')
            return contactPage ? pageRegistryKey(serviceKey, contactPage) : 'service-type'
        },
    }
}
