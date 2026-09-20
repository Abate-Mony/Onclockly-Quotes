import { CheckCircle2 } from 'lucide-react'
import type { Answers } from '../types'
import { getServiceLabel, estimatePrice } from '../flow'
import { XeniaPureLogo } from '../components/Primitives'

export function QuoteInstantScreen({ answers, quoteRef }: { answers: Answers; quoteRef: string }) {
  const lines = estimatePrice(answers)
  const total = lines.reduce((s, l) => s + l.price, 0)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card px-4 py-4">
        <div className="mx-auto max-w-2xl">
          <XeniaPureLogo size="sm" />
        </div>
      </header>
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <CheckCircle2 className="h-7 w-7 text-primary" strokeWidth={2} />
          </div>
          <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground">Your estimated quote</h1>
          <p className="text-sm text-muted-foreground">{getServiceLabel(answers.serviceType)} · {answers.postcode}</p>
        </div>

        <div className="mb-4 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
          {lines.map(({ line, price }) => (
            <div key={line} className="flex items-center justify-between border-b border-border/60 px-5 py-4 last:border-0">
              <span className="text-sm text-label">{line}</span>
              <span className="text-sm font-semibold text-foreground">£{price}</span>
            </div>
          ))}
          <div className="flex items-center justify-between bg-muted/60 px-5 py-4">
            <span className="font-semibold text-foreground">Estimated total</span>
            <span className="text-xl font-bold text-primary">£{total}</span>
          </div>
        </div>

        <div className="mb-6 rounded-xl border border-primary/15 bg-secondary/60 px-4 py-3 text-xs leading-relaxed text-secondary-foreground">
          This is an estimated price based on the information provided. Final pricing will be confirmed before any work begins.
        </div>

        <button className="mb-3 w-full rounded-xl bg-primary py-4 font-semibold text-primary-foreground shadow-soft-lg transition-all hover:bg-primary-hover">
          Send me this quote by email
        </button>
        <button className="w-full rounded-xl border border-border bg-card py-3.5 font-semibold text-label shadow-soft transition-all hover:border-border-strong">
          Book a call to discuss
        </button>

        <div className="mt-8 text-center">
          <p className="text-xs text-muted-foreground">Quote reference: QT-{quoteRef}</p>
          <p className="mt-1 text-xs text-muted-foreground">Questions? Call <a href="tel:01249796848" className="font-medium text-primary">01249 796848</a></p>
        </div>
      </main>
    </div>
  )
}
