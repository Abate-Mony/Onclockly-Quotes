import type { Answers } from '../types'
import { getServiceLabel } from '../flow'
import { useCompany } from '../CompanyContext'
import type { IndustryConfig } from '../configs/types'

export function ReviewFields({ answers, industry, onEdit }: { answers: Answers; industry: IndustryConfig; onEdit: (step: string) => void }) {
  const company = useCompany()
  const svc = answers.serviceType
  const answersRecord = answers as unknown as Record<string, unknown>
  // A config without its own questions known upfront (the dynamic,
  // backend-driven config) supplies getReviewSections instead of this
  // hardcoded cleaning-field list.
  const reviewSections: { label: string; value: string }[] = industry.getReviewSections
    ? industry.getReviewSections(answersRecord)
    : ([
      { label: 'Service', value: getServiceLabel(svc) },
      answers.propertyType ? { label: 'Property type', value: answers.propertyType } : null,
      answers.bedrooms ? { label: 'Bedrooms', value: String(answers.bedrooms) } : null,
      answers.bathrooms ? { label: 'Bathrooms', value: String(answers.bathrooms) } : null,
      answers.propertySize ? { label: 'Property size', value: answers.propertySize } : null,
      answers.condition ? { label: 'Condition', value: answers.condition } : null,
      answers.frequency ? { label: 'Frequency', value: answers.frequency } : null,
      answers.eotExtras?.length ? { label: 'Extras', value: answers.eotExtras.join(', ') } : null,
      answers.extras?.length ? { label: 'Extras', value: answers.extras.join(', ') } : null,
      answers.postcode ? { label: 'Postcode', value: answers.postcode + (answers.address ? ` — ${answers.address}` : '') } : null,
      answers.preferredDate ? { label: 'Preferred date', value: new Date(answers.preferredDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) } : null,
      answers.timePreference ? { label: 'Time preference', value: answers.timePreference } : null,
      answers.access ? { label: 'Access', value: answers.access } : null,
      answers.fmDescription ? { label: 'Requirement', value: answers.fmDescription } : null,
    ].filter(Boolean) as { label: string; value: string }[])
  const contactStepKey = industry.getContactStepKey ? industry.getContactStepKey(answersRecord) : 'contact'

  return (
    <>
      <div className="mb-4 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your requirements</span>
          <button onClick={() => onEdit('service-type')} className="text-xs font-semibold text-primary hover:underline">Edit</button>
        </div>
        {reviewSections.map(({ label, value }) => (
          <div key={label} className="flex items-start justify-between border-b border-border/60 px-4 py-3 last:border-0">
            <span className="w-1/3 shrink-0 text-xs text-muted-foreground">{label}</span>
            <span className="ml-3 flex-1 text-right text-sm font-medium text-foreground">{value}</span>
          </div>
        ))}
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
        <div className="flex items-center justify-between border-b border-border px-4 py-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your details</span>
          <button onClick={() => onEdit(contactStepKey)} className="text-xs font-semibold text-primary hover:underline">Edit</button>
        </div>
        {[
          { label: 'Name', value: [answers.firstName, answers.lastName].filter(Boolean).join(' ') },
          answers.email ? { label: 'Email', value: answers.email } : null,
          answers.phone ? { label: 'Phone', value: answers.phone } : null,
        ].filter(Boolean).map(row => (
          <div key={row!.label} className="flex items-center justify-between border-b border-border/60 px-4 py-3 last:border-0">
            <span className="text-xs text-muted-foreground">{row!.label}</span>
            <span className="text-sm font-medium text-foreground">{row!.value}</span>
          </div>
        ))}
      </div>

      <p className="mt-4 text-center text-xs leading-relaxed text-muted-foreground">
        By continuing you agree to {company.name}&apos;s privacy policy. Your information will only be used to prepare and deliver your quote.
      </p>
    </>
  )
}
