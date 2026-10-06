import { CheckCircle2 } from 'lucide-react'
import type { Answers } from '../types'
import { ResultHeader } from '../components/Layout'
import { useCompany } from '../CompanyContext'
import type { IndustryConfig } from '../configs/types'

export function QuoteManualScreen({ answers, industry, onRestart }: { answers: Answers; industry: IndustryConfig; onRestart: () => void }) {
  const company = useCompany()
  const svc = answers.serviceType
  const isFM = svc === 'facilities'

  const rows = ([
    { label: 'Service', value: industry.getServiceLabel(svc) },
    answers.postcode && { label: 'Location', value: answers.postcode },
    answers.preferredDate && { label: 'Preferred date', value: new Date(answers.preferredDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
    { label: 'Contact', value: [answers.firstName, answers.lastName].filter(Boolean).join(' ') },
    answers.email && { label: 'Email', value: answers.email },
  ].filter(Boolean) as { label: string; value: string }[])

  return (
    <div className="min-h-screen bg-background">
      <ResultHeader />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-bg">
            <CheckCircle2 className="h-7 w-7 text-success" strokeWidth={2} />
          </div>
          <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground">
            {isFM ? "Thanks — we'll review your requirements" : 'Thanks — we have your details'}
          </h1>
          <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
            {isFM
              ? `A member of the ${company.name} team will contact you to discuss your site and prepare an appropriate proposal.`
              : "This service needs a quick review before we can confirm pricing. We'll prepare your quote using the information you've provided and be in touch shortly."}
          </p>
        </div>

        <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          <div className="border-b border-border px-5 py-4">
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enquiry summary</div>
          </div>
          {rows.map(row => (
            <div key={row.label} className="flex items-center justify-between border-b border-border/60 px-5 py-3 last:border-0">
              <span className="text-xs text-muted-foreground">{row.label}</span>
              <span className="text-sm font-medium text-foreground">{row.value}</span>
            </div>
          ))}
        </div>

        <div className="mb-6 rounded-xl border border-warning-border bg-warning-bg px-4 py-3 text-xs leading-relaxed text-warning">
          <strong>What happens next?</strong> A member of our team will review your requirements and contact you within 1 business day to discuss next steps.
        </div>

        <button
          onClick={onRestart}
          className="mb-3 w-full rounded-xl bg-primary py-4 font-semibold text-primary-foreground shadow-soft-lg transition-all hover:bg-primary-hover"
        >
          Back to {company.name}
        </button>
        <button className="w-full rounded-xl border border-border bg-card py-3.5 font-semibold text-label shadow-soft transition-all hover:border-border-strong">
          Request a call back
        </button>

        {company.phone && (
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Questions? Call <a href={`tel:${company.phone.replace(/\s+/g, '')}`} className="font-medium text-primary">{company.phone}</a>
          </p>
        )}
      </main>
    </div>
  )
}
