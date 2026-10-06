import type { ReactNode } from 'react'
import { ChevronLeft, Lock, Phone, Star, Trophy } from 'lucide-react'
import { BrandLogo, ProgressBar } from './Primitives'
import { useCompany } from '../CompanyContext'

interface LayoutProps {
  children: ReactNode
  onBack?: () => void
  onNext?: () => void
  canNext?: boolean
  nextLabel?: string
  progress?: { current: number; total: number } | null
  showBack?: boolean
  showNext?: boolean
  nextVariant?: 'primary' | 'ghost'
}

const TRUST_ITEMS = [
  { icon: Trophy, label: 'Trusted local service', sub: null },
  { icon: Lock, label: 'Secure & confidential', sub: 'Your details are safe with us' },
  { icon: Star, label: 'Highly rated', sub: 'Reviewed by hundreds of clients' },
]

export function QuizLayout({
  children,
  onBack,
  onNext,
  canNext = true,
  nextLabel = 'Continue',
  progress,
  showBack = true,
  showNext = true,
  nextVariant = 'primary',
}: LayoutProps) {
  const company = useCompany()
  const telHref = company.phone ? `tel:${company.phone.replace(/\s+/g, '')}` : undefined

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">

      {/* ── Desktop sidebar ── */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-80 lg:shrink-0 lg:flex-col xl:w-96 bg-sidebar px-8 py-10">
        <BrandLogo name={company.name} logoUrl={company.logo} size="md" onDark />
        <div className="mb-auto mt-auto pt-16">
          <h2 className="mb-3 font-serif text-2xl font-semibold leading-snug text-white">
            Get your free quote
          </h2>
          <p className="mb-8 text-sm leading-relaxed text-sidebar-muted">
            Answer a few simple questions and we&rsquo;ll prepare an accurate quote for your property — usually in minutes.
          </p>
          {progress && (
            <div className="mb-8">
              <div className="mb-2 flex justify-between text-xs text-sidebar-muted-2">
                <span>Step {progress.current} of {progress.total}</span>
                <span>{Math.round((progress.current / progress.total) * 100)}%</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-sidebar-border">
                <div
                  className="h-full rounded-full bg-primary transition-all duration-500"
                  style={{ width: `${Math.round((progress.current / progress.total) * 100)}%` }}
                />
              </div>
            </div>
          )}
        </div>
        <div className="mt-auto space-y-4">
          {TRUST_ITEMS.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-start gap-3">
              <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 text-sidebar-accent">
                <Icon className="h-4 w-4" strokeWidth={2} />
              </span>
              <div>
                <div className="text-sm font-medium text-white">{label}</div>
                {sub && <div className="text-xs text-sidebar-muted-2">{sub}</div>}
              </div>
            </div>
          ))}
          {telHref && (
            <div className="border-t border-sidebar-border pt-4">
              <a href={telHref} className="flex items-center gap-2 text-xs text-sidebar-muted-2 transition-colors hover:text-white">
                <Phone className="h-3 w-3" />
                {company.phone}
              </a>
            </div>
          )}
        </div>
      </aside>

      {/* ── Main column ── */}
      <div className="flex flex-1 flex-col lg:ml-80 xl:ml-96">

        {/* Mobile header only */}
        <header className="sticky top-0 z-10 border-b border-border bg-background/90 backdrop-blur-sm lg:hidden">
          <div className="px-4 pb-3 pt-4">
            <BrandLogo name={company.name} logoUrl={company.logo} size="sm" />
            {progress && (
              <div className="mt-3">
                <ProgressBar current={progress.current} total={progress.total} />
              </div>
            )}
          </div>
        </header>

        {/* Desktop top bar (no logo — it's in sidebar) */}
        {progress && (
          <div className="hidden px-8 pb-0 pt-8 lg:block xl:px-12">
            <ProgressBar current={progress.current} total={progress.total} />
          </div>
        )}

        {/* Content */}
        <main className="flex-1 px-4 py-8 lg:px-8 lg:py-10 xl:px-12">
          <div className="max-w-xl">
            {children}
          </div>
        </main>

        {/* Footer nav */}
        {(showBack || showNext) && (
          <div className="sticky bottom-0 border-t border-border bg-card/95 px-4 py-4 backdrop-blur-sm lg:px-8 xl:px-12">
            <div className="flex max-w-xl items-center gap-3">
              {showBack && onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center gap-1.5 rounded-xl px-4 py-3 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <ChevronLeft className="h-4 w-4" strokeWidth={2.5} />
                  Back
                </button>
              )}
              {showNext && onNext && (
                <button
                  onClick={onNext}
                  disabled={!canNext}
                  className={`flex-1 rounded-xl py-3.5 text-sm font-semibold transition-all duration-150
                    ${canNext
                      ? nextVariant === 'primary'
                        ? 'bg-primary text-primary-foreground shadow-soft-lg hover:bg-primary-hover active:scale-[0.98]'
                        : 'bg-secondary text-secondary-foreground hover:bg-secondary-hover'
                      : 'cursor-not-allowed bg-muted text-muted-foreground/70'
                    }`}
                >
                  {nextLabel}
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Phone CTA for welcome screen
export function PhoneCTA() {
  const company = useCompany()
  if (!company.phone) return null
  return (
    <a
      href={`tel:${company.phone.replace(/\s+/g, '')}`}
      className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground transition-colors hover:text-primary"
    >
      <Phone className="h-3.5 w-3.5" />
      Need help? Call {company.phone}
    </a>
  )
}

export function ResultHeader() {
  const company = useCompany()
  return (
    <header className="border-b border-border bg-card px-4 py-4">
      <div className="mx-auto flex max-w-2xl items-center justify-between">
        <BrandLogo name={company.name} logoUrl={company.logo} size="sm" />
        {company.phone && (
          <a href={`tel:${company.phone.replace(/\s+/g, '')}`} className="hidden text-sm text-muted-foreground transition-colors hover:text-primary sm:block">
            {company.phone}
          </a>
        )}
      </div>
    </header>
  )
}
