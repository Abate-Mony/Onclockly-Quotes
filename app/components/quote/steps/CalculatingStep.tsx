'use client'

import { useEffect, useState } from 'react'
import { Loader2 } from 'lucide-react'
import { ResultHeader } from '../components/Layout'

const STEPS = ['Reviewing your requirements…', 'Checking service area…', 'Calculating your quote…', 'Preparing your estimate…']

export function CalculatingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    STEPS.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i), i * 700))
    })
    timers.push(setTimeout(onDone, STEPS.length * 700 + 600))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount to drive the fixed timer sequence
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <ResultHeader />
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Loader2 className="h-7 w-7 animate-spin text-primary" strokeWidth={2.5} />
          </div>
          <h2 className="mb-3 font-serif text-2xl font-semibold text-foreground">One moment…</h2>
          <div className="space-y-2">
            {STEPS.map((s, i) => (
              <div key={s} className={`text-sm transition-all duration-300 ${i <= step ? 'font-medium text-foreground' : 'text-border-strong'}`}>
                {i < step ? '✓ ' : i === step ? '→ ' : '  '}{s}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
