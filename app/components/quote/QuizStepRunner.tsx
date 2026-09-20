'use client'

import { useEffect, useId, useMemo, useSyncExternalStore } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm, useWatch, type FieldValues, type Resolver } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import type { Screen } from './types'
import { getNextScreen, getProgress } from './flow'
import {
  subscribeAnswers, getAnswersSnapshot, getServerAnswersSnapshot, parseAnswers, saveAnswers,
} from './storage'
import { stepRegistry, type StepConfig } from './registry'
import type { RoutedFormStep } from './schemas'
import { QuizLayout } from './components/Layout'
import { QuestionHeading } from './components/Primitives'
import { ReviewFields } from './steps/ReviewStep'
import { CalculatingScreen } from './steps/CalculatingStep'
import { QuoteInstantScreen } from './steps/QuoteInstantStep'

const EMPTY_SCHEMA = z.object({})

function isFormStep(step: string): step is RoutedFormStep {
  return step in stepRegistry
}

export function QuizStepRunner({ step }: { step: string }) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const debug = searchParams.get('debug')
  const quoteRef = useId().replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()

  const answersJson = useSyncExternalStore(subscribeAnswers, getAnswersSnapshot, getServerAnswersSnapshot)
  const answers = useMemo(() => parseAnswers(answersJson), [answersJson])

  const config: StepConfig | undefined = isFormStep(step) ? stepRegistry[step] : undefined

  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- registry erases each step's distinct schema type
  const schemaForResolver = (config?.schema ?? EMPTY_SCHEMA) as any
  const form = useForm<FieldValues>({
    resolver: zodResolver(schemaForResolver) as Resolver<FieldValues>,
    mode: 'onChange',
    defaultValues: {},
  })
  const values = useWatch({ control: form.control })

  useEffect(() => {
    if (config) form.reset(answers as never)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- resync RHF defaults whenever the step or stored answers change
  }, [step, answersJson])

  const goTo = (next: Screen | string) => router.push(`/quote/${next}`)

  // ---- Non-form screens ----
  if (step === 'calculating') {
    return <CalculatingScreen onDone={() => goTo(getNextScreen('calculating', answers))} />
  }

  if (step === 'quote-instant' || step === 'quote-manual') {
    return <QuoteInstantScreen answers={answers} quoteRef={quoteRef} />
  }

  if (step === 'review') {
    return (
      <QuizLayout
        onBack={() => router.back()}
        onNext={() => goTo(getNextScreen('review', answers))}
        canNext
        nextLabel="Get my quote →"
        progress={getProgress('review', answers)}
      >
        <QuestionHeading title="Review your details" subtitle="Check everything looks right before we prepare your quote." />
        <ReviewFields answers={answers} onEdit={goTo} />
      </QuizLayout>
    )
  }

  // ---- Not (yet) implemented in the routed prototype ----
  if (!config) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-sm rounded-2xl border border-border bg-card p-6 text-center shadow-soft">
          <p className="mb-2 font-serif text-lg font-semibold text-foreground">Step not built yet</p>
          <p className="mb-4 text-sm text-muted-foreground">
            &ldquo;{step}&rdquo; isn&apos;t part of this routed prototype — only the Home Cleaning branch is wired up so far.
            The full quiz is still available at the original single-page experience.
          </p>
          <button onClick={() => goTo('service-type')} className="text-sm font-semibold text-primary hover:underline">
            Back to service type
          </button>
        </div>
      </div>
    )
  }

  // ---- Form step ----
  const nextLabel = config.getNextLabel ? config.getNextLabel(values) : 'Continue'
  const Fields = config.Fields

  const onSubmit = form.handleSubmit((data) => {
    const merged = { ...answers, ...data }
    saveAnswers(merged)
    goTo(getNextScreen(step as Screen, merged))
  })

  return (
    <QuizLayout
      onBack={() => router.back()}
      onNext={onSubmit}
      canNext={config.getNextLabel ? true : form.formState.isValid}
      nextLabel={nextLabel}
      showBack={config.showBack ?? true}
      progress={getProgress(step as Screen, answers)}
    >
      <QuestionHeading title={config.title} subtitle={config.subtitle} />
      {/* eslint-disable-next-line @typescript-eslint/no-explicit-any -- registry erases each step's distinct field-shape generic */}
      <Fields control={form.control as any} />

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
