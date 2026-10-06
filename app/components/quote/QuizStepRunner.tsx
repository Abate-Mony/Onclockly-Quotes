'use client'

import { useEffect, useId, useMemo, useState, useSyncExternalStore } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, useWatch, type FieldValues, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { subscribeAnswers, getAnswersSnapshot, getServerAnswersSnapshot, parseAnswers, saveAnswers, clearAnswers } from './storage'
import { getConfigForCompany, hasActiveServices } from './configs'
import { QuizLayout } from './components/Layout'
import { QuestionHeading } from './components/Primitives'
import { NotConfiguredScreen } from './components/NotConfigured'
import { useCompany } from './CompanyContext'
import { ReviewFields } from './steps/ReviewStep'
import { CalculatingScreen } from './steps/CalculatingStep'
import { QuoteInstantScreen } from './steps/QuoteInstantStep'
import { QuoteManualScreen } from './steps/QuoteManualStep'
import { submitPublicQuoteIntake } from '../../lib/api'

const EMPTY_SCHEMA = z.object({})

export function QuizStepRunner({ slug, step }: { slug: string; step: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const debug = searchParams.get('debug')
  const quoteRef = useId().replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()
  const [submitFailed, setSubmitFailed] = useState(false)
  const company = useCompany()
  // Built from this company's own published Quote Workflow — never a
  // hardcoded industry template (see configs/dynamic.ts).
  const industry = getConfigForCompany(company.serviceTypes)

  const answersJson = useSyncExternalStore(subscribeAnswers, getAnswersSnapshot, getServerAnswersSnapshot)
  const answers = useMemo(() => parseAnswers(answersJson), [answersJson])
  // IndustryConfig's methods take a generic Record (so a future non-cleaning
  // config isn't forced to know about Answers' cleaning-specific fields) —
  // Answers itself has no index signature, so the boundary needs a cast.
  const answersRecord = answers as unknown as Record<string, unknown>

  const stepConfig = industry.stepRegistry[step]

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- registry erases each step's distinct schema type
  const schemaForResolver = (stepConfig?.schema ?? EMPTY_SCHEMA) as any
  const form = useForm<FieldValues>({
    resolver: zodResolver(schemaForResolver) as Resolver<FieldValues>,
    mode: 'onChange',
    defaultValues: {},
  })
  const values = useWatch({ control: form.control })

  useEffect(() => {
    if (stepConfig) form.reset(answers as never)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resync RHF defaults whenever the step or stored answers change
  }, [step, answersJson])

  const goTo = (next: string) => router.push(`/${slug}/quote/${next}`)

  // A valid company with no published Quote Workflow — never fall back to
  // a hardcoded industry's questions (see components/NotConfigured.tsx).
  if (!hasActiveServices(company.serviceTypes)) return <NotConfiguredScreen />

  // ---- Non-form screens ----
  if (step === 'calculating') {
    return (
      <CalculatingScreen
        onDone={async () => {
          setSubmitFailed(false)
          const lines = industry.estimatePrice(answersRecord)
          const ok = await submitPublicQuoteIntake(slug, {
            serviceType: String(answers.serviceType ?? ''),
            answers: answersRecord,
            firstName: String(answers.firstName ?? ''),
            lastName: answers.lastName,
            email: String(answers.email ?? ''),
            phone: answers.phone,
            postcode: answers.postcode,
            address: answers.address,
            marketingConsent: answers.marketingConsent,
            estimate: {
              lines: lines.map(l => ({ label: l.line, price: l.price })),
              total: lines.reduce((s, l) => s + l.price, 0),
              requiresManualQuote: industry.requiresManualQuote(answersRecord),
            },
          })
          if (ok) {
            goTo(industry.getNextScreen('calculating', answersRecord))
          } else {
            setSubmitFailed(true)
          }
        }}
      />
    )
  }

  if (submitFailed) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
          <p className="mb-2 font-serif text-lg font-semibold text-foreground">We couldn&apos;t send that</p>
          <p className="mb-4 text-sm text-muted-foreground">
            Something went wrong submitting your details. Your answers are still saved — please try again.
          </p>
          <button onClick={() => goTo('calculating')} className="text-sm font-semibold text-primary hover:underline">
            Try again
          </button>
        </div>
      </div>
    )
  }

  if (step === 'quote-instant') {
    return <QuoteInstantScreen answers={answers} industry={industry} quoteRef={quoteRef} />
  }

  if (step === 'quote-manual') {
    return <QuoteManualScreen answers={answers} industry={industry} onRestart={() => { clearAnswers(); router.push(`/${slug}/quote/service-type`) }} />
  }

  if (step === 'review') {
    return (
      <QuizLayout
        onBack={() => router.back()}
        onNext={() => goTo(industry.getNextScreen('review', answersRecord))}
        canNext
        nextLabel="Get my quote →"
        progress={industry.getProgress('review', answersRecord)}
      >
        <QuestionHeading title="Review your details" subtitle="Check everything looks right before we prepare your quote." />
        <ReviewFields answers={answers} industry={industry} onEdit={goTo} />
      </QuizLayout>
    )
  }

  // ---- Not a step in this industry's config ----
  if (!stepConfig) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
          <p className="mb-2 font-serif text-lg font-semibold text-foreground">Page not found</p>
          <p className="mb-4 text-sm text-muted-foreground">
            &ldquo;{step}&rdquo; isn&apos;t a step in the quote wizard.
          </p>
          <button onClick={() => goTo(industry.initialStep)} className="text-sm font-semibold text-primary hover:underline">
            Back to start
          </button>
        </div>
      </div>
    )
  }

  // ---- Form step ----
  // Computed from saved answers (not this page's in-progress values) —
  // sequencing never depends on the current page's own fields, only on
  // answers.serviceType, which is already saved by the time any question
  // page is reached.
  const nextKey = industry.getNextScreen(step, answersRecord)
  const isContactStep = industry.getContactStepKey ? industry.getContactStepKey(answersRecord) === step : step === 'contact'
  const isNextContact = industry.getContactStepKey ? industry.getContactStepKey(answersRecord) === nextKey : nextKey === 'contact'
  const nextLabel = stepConfig.getNextLabel
    ? stepConfig.getNextLabel(values)
    : isContactStep ? 'Review your answers →' : isNextContact ? 'Continue to your details →' : 'Continue'
  const Fields = stepConfig.Fields

  // A running total from saved answers plus whatever's filled in on this
  // page so far — informational only (see estimate's own comment at
  // submit time below); never shown for a manual-quote service, where
  // there's no meaningful running price to show.
  const liveAnswers = { ...answersRecord, ...values }
  const showPriceHint = Boolean(answers.serviceType) && !isContactStep && !industry.requiresManualQuote(liveAnswers)
  const liveTotal = showPriceHint ? industry.estimatePrice(liveAnswers).reduce((s, l) => s + l.price, 0) : 0

  const onSubmit = form.handleSubmit((data) => {
    const merged = { ...answers, ...data }
    saveAnswers(merged)
    goTo(industry.getNextScreen(step, merged as unknown as Record<string, unknown>))
  })

  return (
    <QuizLayout
      onBack={() => router.back()}
      onNext={onSubmit}
      canNext={stepConfig.getNextLabel ? true : form.formState.isValid}
      nextLabel={nextLabel}
      showBack={stepConfig.showBack ?? true}
      progress={industry.getProgress(step, answersRecord)}
    >
      {/* A grouped page (see configs/dynamic.ts) has no single title — each
          question renders its own heading inline instead. */}
      {stepConfig.title && <QuestionHeading title={stepConfig.title} subtitle={stepConfig.subtitle} required={stepConfig.required} />}
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- registry erases each step's distinct field-shape generic */}
      <Fields control={form.control as any} />

      {showPriceHint && (
        <div className="mt-6 flex items-center justify-between rounded-xl border border-border bg-muted/40 px-4 py-3 text-sm">
          <span className="text-muted-foreground">Estimated so far</span>
          <span className="font-semibold text-foreground">£{liveTotal}</span>
        </div>
      )}

      {debug && (
        <div className="mt-8 rounded-xl border border-dashed border-border-strong bg-muted/40 p-3 text-xs">
          <p className="mb-1 font-semibold text-muted-foreground">Debug — step: {step}</p>
          <pre className="max-h-64 overflow-auto whitespace-pre-wrap text-muted-foreground">
            {JSON.stringify({ formValues: values, storedAnswers: answers }, null, 2)}
          </pre>
        </div>
      )}
    </QuizLayout>
  )
}
