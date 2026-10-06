'use client'

import { useRouter } from 'next/navigation'
import type { ComponentType } from 'react'
import { Lock, Phone, Sparkles, Trophy, Zap } from 'lucide-react'
import { BrandLogo } from '../components/quote/components/Primitives'
import { PhoneCTA } from '../components/quote/components/Layout'
import { NotConfiguredScreen } from '../components/quote/components/NotConfigured'
import { useCompany } from '../components/quote/CompanyContext'
import { getConfigForCompany, hasActiveServices } from '../components/quote/configs'

export default function CompanyWelcomePage() {
  const router = useRouter()
  const company = useCompany()

  if (!hasActiveServices(company.serviceTypes)) return <NotConfiguredScreen />

  const industry = getConfigForCompany(company.serviceTypes)

  return (
    <div className="flex min-h-screen flex-col bg-background lg:flex-row">
      {/* Desktop left panel */}
      <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 lg:flex lg:w-1/2 xl:w-3/5 xl:p-16">
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #1d4ed8 0%, transparent 60%), radial-gradient(circle at 80% 20%, #0ea5e9 0%, transparent 50%)' }}
        />
        <BrandLogo name={company.name} logoUrl={company.logo} size="lg" onDark />
        <div className="relative z-10">
          <h1 className="mb-6 font-serif text-5xl font-semibold leading-tight text-white xl:text-6xl">
            Professional service,<br />
            <span className="text-sidebar-accent">tailored to you.</span>
          </h1>
          <p className="mb-10 max-w-md text-lg leading-relaxed text-sidebar-muted">
            Answer a few simple questions and get an accurate, no-obligation quote — usually in under 3 minutes.
          </p>
          <div className="space-y-4">
            {([
              [Sparkles, 'Free & no obligation'],
              [Zap, 'Instant quote for most services'],
              [Lock, 'Secure — your details are safe'],
              [Phone, 'Support at every step'],
            ] as [ComponentType<{ className?: string }>, string][]).map(([Icon, text]) => (
              <div key={text} className="flex items-center gap-3 text-sm text-white/80">
                <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white/5 text-sidebar-accent">
                  <Icon className="h-3.5 w-3.5" />
                </span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="relative z-10 text-xs text-white/35">
          © {company.name}{company.phone ? ` · ${company.phone}` : ''}
        </div>
      </div>

      {/* Right / mobile panel */}
      <div className="flex flex-1 flex-col">
        <header className="border-b border-border bg-card px-4 py-4 lg:hidden">
          <BrandLogo name={company.name} logoUrl={company.logo} />
        </header>
        <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12 xl:px-16">
          <div className="w-full max-w-sm text-center lg:max-w-md lg:text-left">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary">
              <Sparkles className="h-3.5 w-3.5" /> Free · No obligation · 3 minutes
            </div>
            <h2 className="mb-4 font-serif text-3xl font-semibold leading-tight text-foreground lg:text-4xl">
              Get your quote<br className="hidden lg:block" /> from {company.name}
            </h2>
            <p className="mb-8 text-base leading-relaxed text-muted-foreground">
              Tell us about your property and what you need. We&rsquo;ll put together an accurate quote for you.
            </p>
            <button
              onClick={() => router.push(`/${company.slug}/quote/${industry.initialStep}`)}
              className="w-full rounded-xl bg-primary py-4 text-base font-semibold text-primary-foreground shadow-soft-lg transition-all duration-150 hover:bg-primary-hover active:scale-[0.98]"
            >
              Get started →
            </button>
            <PhoneCTA />

            <div className="mt-10 grid grid-cols-1 gap-3 text-center sm:grid-cols-3">
              {([
                [Trophy, 'Trusted local service'],
                [Zap, 'Instant quotes'],
                [Lock, 'Secure & confidential'],
              ] as [ComponentType<{ className?: string }>, string][]).map(([Icon, label]) => (
                <div key={label} className="rounded-2xl border border-border bg-card p-4 shadow-soft">
                  <span className="mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-secondary text-primary">
                    <Icon className="h-4 w-4" />
                  </span>
                  <div className="text-xs font-medium leading-snug text-muted-foreground">{label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
