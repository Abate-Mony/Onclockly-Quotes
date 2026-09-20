'use client'

import { useState, useEffect, useId, useRef, type ComponentType } from 'react'
import { useRouter } from 'next/navigation'
import {
  Home, KeyRound, Sparkles, BedDouble, Sofa, Flame, HardHat, Building2,
  Wrench, MessageCircle, Zap, Lock, Phone, CheckCircle2, Lightbulb, Loader2, Trophy,
} from 'lucide-react'
import type { Screen, Answers, ServiceType } from './types'
import { getNextScreen, getProgress, getServiceLabel, estimatePrice } from './flow'
import { QuizLayout, PhoneCTA } from './components/Layout'
import {
  XeniaPureLogo, ChoiceCard, MultiSelectCard, NumberPicker,
  TextInput, TextArea, QuestionHeading, SectionLabel,
} from './components/Primitives'

// ---- helpers ----
function toggle(arr: string[] | undefined, val: string): string[] {
  const a = arr ?? []
  return a.includes(val) ? a.filter(x => x !== val) : [...a, val]
}

const SERVICE_ICONS: Record<ServiceType, ComponentType<{ className?: string }>> = {
  'home-cleaning': Home,
  'end-of-tenancy': KeyRound,
  'deep-cleaning': Sparkles,
  'airbnb': BedDouble,
  'carpet': Sofa,
  'oven': Flame,
  'after-build': HardHat,
  'commercial': Building2,
  'facilities': Wrench,
  'other': MessageCircle,
}

export default function QuoteApp() {
  const router = useRouter()
  const [screen, setScreen] = useState<Screen>('welcome')
  const [answers, setAnswers] = useState<Answers>({})
  const [history, setHistory] = useState<Screen[]>([])
  const topRef = useRef<HTMLDivElement>(null)
  const quoteRef = useId().replace(/[^a-zA-Z0-9]/g, '').slice(-6).toUpperCase()

  useEffect(() => {
    topRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [screen])

  const update = <K extends keyof Answers>(key: K, val: Answers[K]) =>
    setAnswers(a => ({ ...a, [key]: val }))

  const navigate = (next: Screen) => {
    setHistory(h => [...h, screen])
    setScreen(next)
  }

  const goBack = () => {
    const prev = history[history.length - 1]
    if (prev) {
      setHistory(h => h.slice(0, -1))
      setScreen(prev)
    }
  }

  const goNext = () => navigate(getNextScreen(screen, answers))

  const progress = getProgress(screen, answers)

  // ---- Shared props ----
  const layoutProps = { onBack: goBack, onNext: goNext, progress }

  // ---- Render ----
  const ref = <div ref={topRef} className="scroll-mt-0" />

  switch (screen) {

    // ══════════════════════════════════════
    //  WELCOME
    // ══════════════════════════════════════
    case 'welcome': return (
      <div className="flex min-h-screen flex-col bg-background lg:flex-row">
        {/* Desktop left panel */}
        <div className="relative hidden flex-col justify-between overflow-hidden bg-sidebar p-12 lg:flex lg:w-1/2 xl:w-3/5 xl:p-16">
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, #1d4ed8 0%, transparent 60%), radial-gradient(circle at 80% 20%, #0ea5e9 0%, transparent 50%)' }}
          />
          <XeniaPureLogo size="lg" onDark />
          <div className="relative z-10">
            <h1 className="mb-6 font-serif text-5xl font-semibold leading-tight text-white xl:text-6xl">
              Professional cleaning,<br />
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
            © XeniaPure Ltd · 01249 796848 · Chippenham, Wiltshire
          </div>
        </div>

        {/* Right / mobile panel */}
        <div className="flex flex-1 flex-col">
          <header className="border-b border-border bg-card px-4 py-4 lg:hidden">
            <XeniaPureLogo />
          </header>
          <div className="flex flex-1 items-center justify-center px-6 py-12 lg:px-12 xl:px-16">
            <div className="w-full max-w-sm text-center lg:max-w-md lg:text-left">
              <div className="mb-6 inline-flex items-center gap-2 rounded-full bg-secondary px-3 py-1.5 text-xs font-semibold text-primary">
                <Sparkles className="h-3.5 w-3.5" /> Free · No obligation · 3 minutes
              </div>
              <h2 className="mb-4 font-serif text-3xl font-semibold leading-tight text-foreground lg:text-4xl">
                Get your cleaning<br className="hidden lg:block" /> quote today
              </h2>
              <p className="mb-8 text-base leading-relaxed text-muted-foreground">
                Tell us about your property and what you need. We&rsquo;ll put together an accurate quote for you.
              </p>
              <button
                onClick={() => router.push('/quote/service-type')}
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

    // ══════════════════════════════════════
    //  SERVICE TYPE
    // ══════════════════════════════════════
    case 'service-type': return (
      <QuizLayout {...layoutProps} showBack={false} canNext={!!answers.serviceType} progress={progress}>
        {ref}
        <QuestionHeading
          title="What do you need help with?"
          subtitle="Choose the service that best describes what you're looking for."
        />
        <div className="flex flex-col gap-2">
          {([
            ['home-cleaning', 'Home cleaning', 'Regular domestic cleaning'],
            ['end-of-tenancy', 'End of tenancy', 'Full clean for moving in or out'],
            ['deep-cleaning', 'Deep cleaning', 'Thorough, intensive clean'],
            ['airbnb', 'Airbnb / Holiday let', 'Turnover cleans for guests'],
            ['carpet', 'Carpet or upholstery', 'Carpets, rugs, sofas & more'],
            ['oven', 'Oven cleaning', 'Professional oven deep clean'],
            ['after-build', 'After-build cleaning', 'Post-construction clean'],
            ['commercial', 'Office / Commercial', 'Business premises cleaning'],
            ['facilities', 'Facilities / Maintenance', 'FM support & maintenance'],
            ['other', 'Something else', 'Tell us what you need'],
          ] as [ServiceType, string, string][]).map(([val, label, desc]) => {
            const Icon = SERVICE_ICONS[val]
            return (
              <ChoiceCard
                key={val}
                label={label}
                description={desc}
                icon={<Icon className="h-5 w-5" />}
                selected={answers.serviceType === val}
                onClick={() => { update('serviceType', val); }}
              />
            )
          })}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  PROPERTY TYPE
    // ══════════════════════════════════════
    case 'property-type': return (
      <QuizLayout {...layoutProps} canNext={!!answers.propertyType} progress={progress}>
        {ref}
        <QuestionHeading title="What type of property is it?" />
        <div className="flex flex-col gap-2">
          {['Flat / Apartment', 'Terraced house', 'Semi-detached house', 'Detached house', 'Bungalow', 'House of multiple occupation (HMO)', 'Other'].map(opt => (
            <ChoiceCard key={opt} label={opt} selected={answers.propertyType === opt} onClick={() => update('propertyType', opt)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  BEDROOMS
    // ══════════════════════════════════════
    case 'bedrooms': return (
      <QuizLayout {...layoutProps} canNext={!!answers.bedrooms} progress={progress}>
        {ref}
        <QuestionHeading title="How many bedrooms?" />
        <NumberPicker options={[1, 2, 3, 4, 5, '6+']} value={answers.bedrooms} onChange={v => update('bedrooms', v as number)} />
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  BATHROOMS
    // ══════════════════════════════════════
    case 'bathrooms': return (
      <QuizLayout {...layoutProps} canNext={!!answers.bathrooms} progress={progress}>
        {ref}
        <QuestionHeading title="How many bathrooms?" subtitle="Include any en-suites or shower rooms." />
        <NumberPicker options={[1, 2, 3, '4+']} value={answers.bathrooms} onChange={v => update('bathrooms', v as number)} />
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  PROPERTY SIZE
    // ══════════════════════════════════════
    case 'property-size': return (
      <QuizLayout {...layoutProps} canNext={!!answers.propertySize} progress={progress}>
        {ref}
        <QuestionHeading
          title="Approximately how large is the property?"
          subtitle="A rough estimate is fine — choose 'I'm not sure' if you prefer."
        />
        <div className="flex flex-col gap-2">
          {['Under 750 sq ft', '750–1,250 sq ft', '1,250–2,000 sq ft', '2,000–3,000 sq ft', 'Over 3,000 sq ft', "I'm not sure"].map(opt => (
            <ChoiceCard key={opt} label={opt} selected={answers.propertySize === opt} onClick={() => update('propertySize', opt)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  CONDITION
    // ══════════════════════════════════════
    case 'condition': return (
      <QuizLayout {...layoutProps} canNext={!!answers.condition} progress={progress}>
        {ref}
        <QuestionHeading
          title="How would you describe the current condition?"
          subtitle="This helps us estimate the time needed."
        />
        <div className="flex flex-col gap-2">
          {[
            ['Lightly used / already fairly clean', 'Light general tidying needed'],
            ['Normal lived-in condition', 'Regular day-to-day use'],
            ['Needs a thorough clean', 'Has been used heavily'],
            ['Heavy dirt / grease / limescale', 'Significant build-up in areas'],
            ['Very heavy cleaning required', 'Multiple areas need intensive attention'],
          ].map(([label, desc]) => (
            <ChoiceCard key={label} label={label} description={desc} selected={answers.condition === label} onClick={() => update('condition', label)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  OCCUPANCY
    // ══════════════════════════════════════
    case 'occupancy': return (
      <QuizLayout {...layoutProps} canNext={!!answers.occupancy} progress={progress}>
        {ref}
        <QuestionHeading
          title={answers.serviceType === 'end-of-tenancy' ? 'Is the property currently empty?' : 'Will the property be occupied during the clean?'}
        />
        <div className="flex flex-col gap-2">
          {answers.serviceType === 'end-of-tenancy'
            ? ['Yes — property is empty', 'No — still occupied'].map(opt => (
                <ChoiceCard key={opt} label={opt} selected={answers.occupancy === opt} onClick={() => update('occupancy', opt)} />
              ))
            : ['Yes', 'No', 'Moving in', 'Moving out'].map(opt => (
                <ChoiceCard key={opt} label={opt} selected={answers.occupancy === opt} onClick={() => update('occupancy', opt)} />
              ))
          }
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  FREQUENCY (home cleaning only)
    // ══════════════════════════════════════
    case 'frequency': return (
      <QuizLayout {...layoutProps} canNext={!!answers.frequency} progress={progress}>
        {ref}
        <QuestionHeading title="How often would you like cleaning?" />
        <div className="flex flex-col gap-2">
          {[
            ['One-off', 'A single clean on one date'],
            ['Weekly', 'Every week on a regular day'],
            ['Every 2 weeks', 'Fortnightly visits'],
            ['Every 4 weeks', 'Monthly visits'],
            ['Not sure yet', "We'll work it out together"],
          ].map(([label, desc]) => (
            <ChoiceCard key={label} label={label} description={desc} selected={answers.frequency === label} onClick={() => update('frequency', label)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  AREAS
    // ══════════════════════════════════════
    case 'areas': {
      const defaults = ['Kitchen', 'Bathrooms', 'Bedrooms', 'Living room', 'Hallways / stairs']
      const optional = ['Utility room', 'Conservatory', 'Garage', 'Other']
      const sel = answers.areas ?? defaults
      return (
        <QuizLayout {...layoutProps} canNext={sel.length > 0} progress={progress}>
          {ref}
          <QuestionHeading title="Which areas should we clean?" subtitle="Select all that apply." />
          <SectionLabel>Main areas</SectionLabel>
          <div className="mb-2 flex flex-col gap-2">
            {defaults.map(a => (
              <MultiSelectCard key={a} label={a} checked={sel.includes(a)} onChange={() => update('areas', toggle(sel, a))} />
            ))}
          </div>
          <SectionLabel>Additional areas</SectionLabel>
          <div className="flex flex-col gap-2">
            {optional.map(a => (
              <MultiSelectCard key={a} label={a} checked={sel.includes(a)} onChange={() => update('areas', toggle(sel, a))} />
            ))}
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  EXTRAS
    // ══════════════════════════════════════
    case 'extras': {
      const sel = answers.extras ?? []
      const extraItems = [
        ['Oven cleaning', 'Professional oven deep clean'],
        ['Fridge interior', 'Inside the fridge & freezer'],
        ['Inside kitchen cupboards', 'Shelves, drawers & interiors'],
        ['Interior windows', 'Inside window surfaces'],
        ['Carpet cleaning', 'Deep extraction clean'],
        ['Upholstery cleaning', 'Sofas & fabric furniture'],
        ['Deep bathroom descaling', 'Limescale & grout treatment'],
        ['Appliance cleaning', 'Microwave, dishwasher, washing machine'],
      ]
      return (
        <QuizLayout {...layoutProps} canNext progress={progress} nextLabel={sel.length === 0 ? 'Skip' : 'Continue'}>
          {ref}
          <QuestionHeading
            title="Would you like any extras?"
            subtitle="Optional add-ons — choose as many as you like."
          />
          <div className="flex flex-col gap-2">
            {extraItems.map(([label, desc]) => (
              <MultiSelectCard key={label} label={label} description={desc} checked={sel.includes(label)} onChange={() => update('extras', toggle(sel, label))} />
            ))}
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  SPECIAL CONSIDERATIONS
    // ══════════════════════════════════════
    case 'special': {
      const sel = answers.special ?? []
      const items = [
        ['Pets in the property', 'Pet hair, odour considerations'],
        ['Allergy-sensitive household', 'We use appropriate products'],
        ['Fragile / delicate surfaces', 'Extra care around valuables'],
        ['Heavy limescale', 'Particularly in bathrooms'],
        ['Mould / specialist concern', 'May need specialist treatment'],
        ['Access restrictions', 'e.g. no parking, key safe only'],
        ['None of these', ''],
      ]
      return (
        <QuizLayout {...layoutProps} canNext progress={progress} nextLabel={sel.length === 0 ? 'Skip' : 'Continue'}>
          {ref}
          <QuestionHeading
            title="Anything we should know before arriving?"
            subtitle="This helps us prepare appropriately."
          />
          <div className="flex flex-col gap-2">
            {items.map(([label, desc]) => (
              <MultiSelectCard
                key={label}
                label={label}
                description={desc || undefined}
                checked={sel.includes(label)}
                onChange={() => {
                  if (label === 'None of these') update('special', ['None of these'])
                  else update('special', toggle(sel.filter(s => s !== 'None of these'), label))
                }}
              />
            ))}
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  EOT: FURNISHED
    // ══════════════════════════════════════
    case 'eot-furnished': return (
      <QuizLayout {...layoutProps} canNext={!!answers.furnished} progress={progress}>
        {ref}
        <QuestionHeading title="Is the property furnished or unfurnished?" />
        <div className="flex flex-col gap-2">
          {['Fully furnished', 'Part furnished', 'Unfurnished'].map(opt => (
            <ChoiceCard key={opt} label={opt} selected={answers.furnished === opt} onClick={() => update('furnished', opt)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  EOT: EXTRAS
    // ══════════════════════════════════════
    case 'eot-extras': {
      const sel = answers.eotExtras ?? []
      const items = [
        ['Carpet cleaning', 'All or selected rooms'],
        ['Oven cleaning', 'Professional deep clean'],
        ['Fridge / freezer interior', 'Defrost & clean inside'],
        ['Inside cupboards', 'Kitchen & bedroom storage'],
        ['Interior windows', 'All internal window surfaces'],
        ['Heavy limescale / stains', 'Bathroom & kitchen descaling'],
      ]
      return (
        <QuizLayout {...layoutProps} canNext progress={progress} nextLabel={sel.length === 0 ? 'Skip extras' : 'Continue'}>
          {ref}
          <QuestionHeading
            title="Any specific extras required?"
            subtitle="End of tenancy cleans typically include full kitchen, bathroom, and bedroom cleaning. Select any additional services."
          />
          <div className="flex flex-col gap-2">
            {items.map(([label, desc]) => (
              <MultiSelectCard key={label} label={label} description={desc} checked={sel.includes(label)} onChange={() => update('eotExtras', toggle(sel, label))} />
            ))}
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  EOT: DATES
    // ══════════════════════════════════════
    case 'eot-dates': return (
      <QuizLayout {...layoutProps} canNext progress={progress}>
        {ref}
        <QuestionHeading
          title="Key dates"
          subtitle="These help us schedule the clean at the right time."
        />
        <div className="flex flex-col gap-5">
          <TextInput
            label="Move-out date"
            type="date"
            value={answers.moveOutDate ?? ''}
            onChange={v => update('moveOutDate', v)}
            hint="The date the property will be vacated"
          />
          <TextInput
            label="Inspection / handover date"
            type="date"
            value={answers.inspectionDate ?? ''}
            onChange={v => update('inspectionDate', v)}
            hint="When the landlord or agent will inspect"
          />
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  AIRBNB: GUESTS
    // ══════════════════════════════════════
    case 'airbnb-guests': return (
      <QuizLayout {...layoutProps} canNext={!!answers.guestCapacity} progress={progress}>
        {ref}
        <QuestionHeading title="What is the maximum guest capacity?" />
        <NumberPicker options={[1, 2, 3, 4, 5, 6, 7, 8, '9+']} value={answers.guestCapacity} onChange={v => update('guestCapacity', String(v))} />
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  AIRBNB: TURNOVER
    // ══════════════════════════════════════
    case 'airbnb-turnover': return (
      <QuizLayout {...layoutProps} canNext={!!answers.turnoverFrequency} progress={progress}>
        {ref}
        <QuestionHeading title="How often do guests check in and out?" />
        <div className="flex flex-col gap-2">
          {['Daily or near-daily', 'Several times a week', 'Weekly', 'A few times a month', 'Less frequently', "I'm not sure yet"].map(opt => (
            <ChoiceCard key={opt} label={opt} selected={answers.turnoverFrequency === opt} onClick={() => update('turnoverFrequency', opt)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  AIRBNB: SERVICES
    // ══════════════════════════════════════
    case 'airbnb-services': {
      const sel = answers.airbnbServices ?? []
      return (
        <QuizLayout {...layoutProps} canNext progress={progress} nextLabel={sel.length === 0 ? 'Skip' : 'Continue'}>
          {ref}
          <QuestionHeading title="Which additional services do you need?" subtitle="Select all that apply." />
          <div className="flex flex-col gap-2">
            {[
              ['Linen / laundry', 'Washing and drying bedding'],
              ['Bed making', 'Fresh linen & beds made up'],
              ['Consumable restocking', 'Toiletries, tea, coffee etc.'],
              ['Kitchen reset', 'Appliances & surfaces prepared'],
              ['Waste removal', 'Empty bins & recycling'],
            ].map(([label, desc]) => (
              <MultiSelectCard key={label} label={label} description={desc} checked={sel.includes(label)} onChange={() => update('airbnbServices', toggle(sel, label))} />
            ))}
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  CARPET: ITEMS
    // ══════════════════════════════════════
    case 'carpet-items': {
      const sel = answers.carpetItems ?? []
      return (
        <QuizLayout {...layoutProps} canNext={sel.length > 0} progress={progress}>
          {ref}
          <QuestionHeading title="What needs cleaning?" subtitle="Select everything that applies." />
          <div className="flex flex-col gap-2">
            {[
              ['Carpet (room)', 'One or more rooms'],
              ['Rug', 'Any size or style'],
              ['Sofa', 'Fabric or velvet'],
              ['Armchair', 'Single upholstered chair'],
              ['Dining chairs', 'Fabric seat pads'],
              ['Mattress', 'Any size'],
              ['Other', 'Tell us more at the end'],
            ].map(([label, desc]) => (
              <MultiSelectCard key={label} label={label} description={desc} checked={sel.includes(label)} onChange={() => update('carpetItems', toggle(sel, label))} />
            ))}
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  CARPET: STAINS
    // ══════════════════════════════════════
    case 'carpet-stains': {
      const sel = answers.carpetStainDetails ?? []
      return (
        <QuizLayout {...layoutProps} canNext progress={progress} nextLabel={sel.length === 0 ? 'Skip' : 'Continue'}>
          {ref}
          <QuestionHeading title="Any specific concerns?" subtitle="This helps us bring the right products and equipment." />
          <div className="flex flex-col gap-2">
            {[
              ['Visible stains', 'Food, drink, or other marks'],
              ['Pet odour treatment', 'Neutralise pet smells'],
              ['Heavy soiling', 'Significant dirt or grime'],
              ['Delicate fibres', 'e.g. wool, silk, antique rug'],
              ['None of these', ''],
            ].map(([label, desc]) => (
              <MultiSelectCard
                key={label}
                label={label}
                description={desc || undefined}
                checked={sel.includes(label)}
                onChange={() => {
                  if (label === 'None of these') update('carpetStainDetails', ['None of these'])
                  else update('carpetStainDetails', toggle(sel.filter(s => s !== 'None of these'), label))
                }}
              />
            ))}
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  OVEN: TYPE
    // ══════════════════════════════════════
    case 'oven-type': return (
      <QuizLayout {...layoutProps} canNext={!!answers.ovenType} progress={progress}>
        {ref}
        <QuestionHeading title="What type of oven do you have?" />
        <div className="flex flex-col gap-2">
          {['Single oven', 'Double oven', 'Range cooker', 'Aga-style cooker', 'Other / not sure'].map(opt => (
            <ChoiceCard key={opt} label={opt} selected={answers.ovenType === opt} onClick={() => update('ovenType', opt)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  OVEN: EXTRAS
    // ══════════════════════════════════════
    case 'oven-extras': {
      const sel = answers.ovenExtras ?? []
      return (
        <QuizLayout {...layoutProps} canNext progress={progress} nextLabel={sel.length === 0 ? 'Skip' : 'Continue'}>
          {ref}
          <QuestionHeading title="Anything else to clean while we're there?" />
          <div className="flex flex-col gap-2">
            {[
              ['Hob cleaning', 'Gas or electric hob'],
              ['Extractor fan cleaning', 'Filter & casing'],
              ['Microwave interior', 'Quick additional clean'],
            ].map(([label, desc]) => (
              <MultiSelectCard key={label} label={label} description={desc} checked={sel.includes(label)} onChange={() => update('ovenExtras', toggle(sel, label))} />
            ))}
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  BUILD: SITE
    // ══════════════════════════════════════
    case 'build-site': return (
      <QuizLayout {...layoutProps} canNext={!!answers.buildSiteType} progress={progress}>
        {ref}
        <QuestionHeading title="What type of property or site is this?" />
        <div className="flex flex-col gap-2">
          {['Residential house', 'Residential flat / apartment', 'Commercial office', 'Retail / shop', 'Industrial / warehouse', 'School / education', 'Healthcare', 'Other'].map(opt => (
            <ChoiceCard key={opt} label={opt} selected={answers.buildSiteType === opt} onClick={() => update('buildSiteType', opt)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  BUILD: CONDITION
    // ══════════════════════════════════════
    case 'build-condition': {
      const sel = answers.buildCondition ?? []
      return (
        <QuizLayout {...layoutProps} canNext={!!answers.buildFinished} progress={progress}>
          {ref}
          <QuestionHeading title="Tell us about the build" />
          <div className="flex flex-col gap-4">
            <div>
              <div className="mb-2 text-sm font-medium text-label">Has building work finished?</div>
              <div className="flex flex-col gap-2">
                {['Yes — ready for cleaning', 'Nearly finished', 'Still in progress'].map(opt => (
                  <ChoiceCard key={opt} label={opt} selected={answers.buildFinished === opt} onClick={() => update('buildFinished', opt)} />
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-sm font-medium text-label">What needs attention? (Select all)</div>
              <div className="flex flex-col gap-2">
                {[
                  'Heavy construction dust',
                  'Paint / plaster residue',
                  'Cement / grouting residue',
                  'Window / glass cleaning',
                  'Waste / debris removal',
                  'Floor protection removal',
                ].map(opt => (
                  <MultiSelectCard key={opt} label={opt} checked={sel.includes(opt)} onChange={() => update('buildCondition', toggle(sel, opt))} />
                ))}
              </div>
            </div>
            <TextInput
              label="Handover / completion deadline (optional)"
              type="date"
              value={answers.buildDeadline ?? ''}
              onChange={v => update('buildDeadline', v)}
              hint="When do you need this completed by?"
            />
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  COMMERCIAL: PREMISES
    // ══════════════════════════════════════
    case 'commercial-premises': return (
      <QuizLayout {...layoutProps} canNext={!!answers.commercialPremises} progress={progress}>
        {ref}
        <QuestionHeading title="What type of premises is this?" />
        <div className="flex flex-col gap-2">
          {['Office', 'Retail store', 'School / education', 'Clinic / dental / healthcare', 'Hospitality / restaurant', 'Warehouse / logistics', 'Industrial', 'Public building', 'Other'].map(opt => (
            <ChoiceCard key={opt} label={opt} selected={answers.commercialPremises === opt} onClick={() => update('commercialPremises', opt)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  COMMERCIAL: SIZE
    // ══════════════════════════════════════
    case 'commercial-size': return (
      <QuizLayout {...layoutProps} canNext={!!answers.commercialSize} progress={progress}>
        {ref}
        <QuestionHeading title="Approximately how large is the site?" />
        <div className="flex flex-col gap-2">
          {['Under 1,000 sq ft', '1,000–5,000 sq ft', '5,000–10,000 sq ft', '10,000–25,000 sq ft', 'Over 25,000 sq ft', "I'm not sure"].map(opt => (
            <ChoiceCard key={opt} label={opt} selected={answers.commercialSize === opt} onClick={() => update('commercialSize', opt)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  COMMERCIAL: OCCUPANCY
    // ══════════════════════════════════════
    case 'commercial-occupancy': return (
      <QuizLayout {...layoutProps} canNext={!!answers.commercialOccupancy} progress={progress}>
        {ref}
        <QuestionHeading title="How many people normally use the premises?" />
        <div className="flex flex-col gap-2">
          {['Under 10', '10–25', '26–50', '51–100', '100+', 'Not sure'].map(opt => (
            <ChoiceCard key={opt} label={opt} selected={answers.commercialOccupancy === opt} onClick={() => update('commercialOccupancy', opt)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  COMMERCIAL: AREAS
    // ══════════════════════════════════════
    case 'commercial-areas': {
      const defaults = ['Workspaces / offices', 'Toilets / washrooms', 'Kitchen / staff room', 'Reception']
      const optional = ['Corridors', 'Meeting rooms', 'Warehouse area', 'Changing rooms', 'Public areas', 'Other']
      const sel = answers.commercialAreas ?? defaults
      return (
        <QuizLayout {...layoutProps} canNext={sel.length > 0} progress={progress}>
          {ref}
          <QuestionHeading title="Which areas need cleaning?" subtitle="Select all that apply." />
          <SectionLabel>Core areas</SectionLabel>
          <div className="mb-2 flex flex-col gap-2">
            {defaults.map(a => (
              <MultiSelectCard key={a} label={a} checked={sel.includes(a)} onChange={() => update('commercialAreas', toggle(sel, a))} />
            ))}
          </div>
          <SectionLabel>Additional areas</SectionLabel>
          <div className="flex flex-col gap-2">
            {optional.map(a => (
              <MultiSelectCard key={a} label={a} checked={sel.includes(a)} onChange={() => update('commercialAreas', toggle(sel, a))} />
            ))}
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  COMMERCIAL: FREQUENCY
    // ══════════════════════════════════════
    case 'commercial-frequency': return (
      <QuizLayout {...layoutProps} canNext={!!answers.commercialFrequency} progress={progress}>
        {ref}
        <QuestionHeading title="How often do you need cleaning?" />
        <div className="flex flex-col gap-2">
          {['One-off', 'Daily', '2–3 times per week', 'Weekly', 'Fortnightly', 'Custom schedule'].map(opt => (
            <ChoiceCard key={opt} label={opt} selected={answers.commercialFrequency === opt} onClick={() => update('commercialFrequency', opt)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  COMMERCIAL: HOURS
    // ══════════════════════════════════════
    case 'commercial-hours': return (
      <QuizLayout {...layoutProps} canNext={!!answers.commercialHours} progress={progress}>
        {ref}
        <QuestionHeading title="When should cleaning take place?" />
        <div className="flex flex-col gap-2">
          {['Before opening hours', 'During working hours', 'After closing', 'Overnight', 'Flexible'].map(opt => (
            <ChoiceCard key={opt} label={opt} selected={answers.commercialHours === opt} onClick={() => update('commercialHours', opt)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  COMMERCIAL: EXISTING PROVIDER
    // ══════════════════════════════════════
    case 'commercial-provider': return (
      <QuizLayout {...layoutProps} canNext={!!answers.hasProvider} progress={progress}>
        {ref}
        <QuestionHeading title="Do you already have a cleaning provider?" />
        <div className="flex flex-col gap-2">
          {['Yes', 'No'].map(opt => (
            <ChoiceCard key={opt} label={opt} selected={answers.hasProvider === opt} onClick={() => update('hasProvider', opt)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  COMMERCIAL: IMPROVEMENTS
    // ══════════════════════════════════════
    case 'commercial-improvements': {
      const sel = answers.improvements ?? []
      return (
        <QuizLayout {...layoutProps} canNext={sel.length > 0} progress={progress}>
          {ref}
          <QuestionHeading title="What are you looking to improve?" subtitle="Select all that apply." />
          <div className="flex flex-col gap-2">
            {['Reliability', 'Quality of clean', 'Cost', 'Staff cover', 'Communication', 'Compliance', 'Other'].map(opt => (
              <MultiSelectCard key={opt} label={opt} checked={sel.includes(opt)} onChange={() => update('improvements', toggle(sel, opt))} />
            ))}
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  COMMERCIAL: SPECIALIST REQUIREMENTS
    // ══════════════════════════════════════
    case 'commercial-specialist': {
      const sel = answers.specialistReqs ?? []
      return (
        <QuizLayout {...layoutProps} canNext progress={progress} nextLabel={sel.length === 0 ? 'Skip' : 'Continue'}>
          {ref}
          <QuestionHeading title="Do you have any specialist requirements?" subtitle="Select all that apply." />
          <div className="flex flex-col gap-2">
            {['Carpet cleaning', 'Deep cleaning', 'Disinfection / sanitisation', 'High-touch-area cleaning', 'After-build cleaning', 'Waste management', 'Washroom hygiene', 'Grounds / exterior care', 'Security / front-of-house support', 'None'].map(opt => (
              <MultiSelectCard
                key={opt}
                label={opt}
                checked={sel.includes(opt)}
                onChange={() => {
                  if (opt === 'None') update('specialistReqs', ['None'])
                  else update('specialistReqs', toggle(sel.filter(s => s !== 'None'), opt))
                }}
              />
            ))}
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  COMMERCIAL: COMPLIANCE
    // ══════════════════════════════════════
    case 'commercial-compliance': {
      const sel = answers.complianceReqs ?? []
      return (
        <QuizLayout {...layoutProps} canNext progress={progress} nextLabel={sel.length === 0 ? 'Skip' : 'Continue'}>
          {ref}
          <QuestionHeading
            title="Any access or compliance requirements?"
            subtitle="Tell us so we can ensure the right arrangements."
          />
          <div className="flex flex-col gap-2">
            {['Site induction required', 'DBS-checked staff required', 'Restricted areas', 'Security clearance', 'PPE required', 'Out-of-hours access only', 'Other', 'None'].map(opt => (
              <MultiSelectCard
                key={opt}
                label={opt}
                checked={sel.includes(opt)}
                onChange={() => {
                  if (opt === 'None') update('complianceReqs', ['None'])
                  else update('complianceReqs', toggle(sel.filter(s => s !== 'None'), opt))
                }}
              />
            ))}
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  COMMERCIAL: SITE SURVEY
    // ══════════════════════════════════════
    case 'commercial-survey': return (
      <QuizLayout {...layoutProps} canNext={!!answers.siteSurvey} progress={progress}>
        {ref}
        <QuestionHeading
          title="Would you be happy for us to arrange a site survey?"
          subtitle="For larger commercial sites a brief site visit helps us provide the most accurate quote."
        />
        <div className="flex flex-col gap-2">
          {[
            ['Yes', 'Happy to arrange a visit at a convenient time'],
            ['Maybe', "We can discuss once we've seen the initial estimate"],
            ['I would prefer a remote quote first', 'No visit needed at this stage'],
          ].map(([label, desc]) => (
            <ChoiceCard key={label} label={label} description={desc} selected={answers.siteSurvey === label} onClick={() => update('siteSurvey', label)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  FM: SERVICE
    // ══════════════════════════════════════
    case 'fm-service': {
      const sel = answers.fmServices ?? []
      return (
        <QuizLayout {...layoutProps} canNext={sel.length > 0} progress={progress}>
          {ref}
          <QuestionHeading title="What do you need help with?" subtitle="Select all that apply." />
          <div className="flex flex-col gap-2">
            {[
              ['Reactive maintenance', 'On-demand repairs & fixes'],
              ['Planned preventative maintenance', 'Scheduled inspection & upkeep'],
              ['Handyman work', 'General repairs & tasks'],
              ['Grounds maintenance', 'External & landscape care'],
              ['Waste management', 'Collections & recycling'],
              ['Washroom & hygiene services', 'Consumables & hygiene units'],
              ['Supplies & consumables', 'Managed supply of materials'],
              ['Security / front-of-house staffing', 'On-site personnel support'],
              ['General facilities management', 'Comprehensive FM support'],
              ['Other', ''],
            ].map(([label, desc]) => (
              <MultiSelectCard key={label} label={label} description={desc || undefined} checked={sel.includes(label)} onChange={() => update('fmServices', toggle(sel, label))} />
            ))}
          </div>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  FM: SITE
    // ══════════════════════════════════════
    case 'fm-site': return (
      <QuizLayout {...layoutProps} canNext={!!answers.fmSiteType} progress={progress}>
        {ref}
        <QuestionHeading title="Tell us about the site" />
        <div className="flex flex-col gap-4">
          <div>
            <div className="mb-2 text-sm font-medium text-label">Site type</div>
            <div className="flex flex-col gap-2">
              {['Office / commercial', 'Industrial / warehouse', 'Retail', 'Healthcare', 'Education', 'Hospitality', 'Public sector', 'Mixed use', 'Other'].map(opt => (
                <ChoiceCard key={opt} label={opt} selected={answers.fmSiteType === opt} onClick={() => update('fmSiteType', opt)} />
              ))}
            </div>
          </div>
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  FM: REQUIREMENT
    // ══════════════════════════════════════
    case 'fm-requirement': return (
      <QuizLayout {...layoutProps} canNext progress={progress}>
        {ref}
        <QuestionHeading
          title="Tell us more about your requirements"
          subtitle="The more detail you can share, the better we can tailor our response."
        />
        <div className="flex flex-col gap-5">
          <TextInput
            label="Number of sites / locations"
            placeholder="e.g. 1"
            value={answers.fmLocations ?? ''}
            onChange={v => update('fmLocations', v)}
          />
          <TextArea
            label="Describe what you need"
            placeholder="e.g. We need a reactive maintenance team to cover our 3 office sites across Wiltshire..."
            value={answers.fmDescription ?? ''}
            onChange={v => update('fmDescription', v)}
            rows={4}
          />
          <div>
            <div className="mb-2 text-sm font-medium text-label">Urgency</div>
            <div className="flex flex-col gap-2">
              {['Urgent — within 48 hours', 'Within this week', 'Within this month', 'No immediate rush', 'Ongoing / contract'].map(opt => (
                <ChoiceCard key={opt} label={opt} selected={answers.fmUrgency === opt} onClick={() => update('fmUrgency', opt)} />
              ))}
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm font-medium text-label">Is this a one-off or ongoing requirement?</div>
            <div className="flex flex-col gap-2">
              {['One-off', 'Ongoing contract', 'Not sure yet'].map(opt => (
                <ChoiceCard key={opt} label={opt} selected={answers.fmOngoing === opt} onClick={() => update('fmOngoing', opt)} />
              ))}
            </div>
          </div>
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  POSTCODE
    // ══════════════════════════════════════
    case 'postcode': return (
      <QuizLayout {...layoutProps} canNext={!!answers.postcode} progress={progress}>
        {ref}
        <QuestionHeading
          title="Where is the property?"
          subtitle="We'll use your postcode to confirm we cover your area."
        />
        <div className="flex flex-col gap-4">
          <TextInput
            label="Postcode"
            placeholder="e.g. SN15 1AB"
            value={answers.postcode ?? ''}
            onChange={v => update('postcode', v.toUpperCase())}
            hint="Enter a UK postcode"
          />
          {answers.postcode && answers.postcode.length >= 5 && (
            <div className="flex items-center gap-2 rounded-xl border border-success-border bg-success-bg px-4 py-3 text-sm font-medium text-success">
              <CheckCircle2 className="h-4 w-4 shrink-0" />
              Great — we cover your area.
            </div>
          )}
          <TextInput
            label="Street address (optional)"
            placeholder="e.g. 14 Example Road, Chippenham"
            value={answers.address ?? ''}
            onChange={v => update('address', v)}
          />
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  DATE
    // ══════════════════════════════════════
    case 'date': return (
      <QuizLayout {...layoutProps} canNext progress={progress} nextLabel={!answers.preferredDate ? 'Skip' : 'Continue'}>
        {ref}
        <QuestionHeading
          title="When would you like the cleaning?"
          subtitle="Choose a preferred date — we'll confirm availability."
        />
        <div className="flex flex-col gap-5">
          <TextInput
            label="Preferred date"
            type="date"
            value={answers.preferredDate ?? ''}
            onChange={v => update('preferredDate', v)}
          />
          <div>
            <div className="mb-2 text-sm font-medium text-label">How flexible are you?</div>
            <div className="flex flex-col gap-2">
              {['Exact date required', '± 1 day either side', '± 3 days either side', 'Flexible — any date that suits'].map(opt => (
                <ChoiceCard key={opt} label={opt} selected={answers.flexibility === opt} onClick={() => update('flexibility', opt)} />
              ))}
            </div>
          </div>
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  TIME PREFERENCE
    // ══════════════════════════════════════
    case 'time-pref': return (
      <QuizLayout {...layoutProps} canNext progress={progress} nextLabel={!answers.timePreference ? 'Skip' : 'Continue'}>
        {ref}
        <QuestionHeading title="Preferred time of day" subtitle="We'll aim to match your preference when scheduling." />
        <div className="flex flex-col gap-2">
          {[
            ['Morning', '8:00 am – 12:00 pm'],
            ['Afternoon', '12:00 pm – 5:00 pm'],
            ['Evening', '5:00 pm – 8:00 pm'],
            ['Flexible', 'Any time works for us'],
          ].map(([label, desc]) => (
            <ChoiceCard key={label} label={label} description={desc} selected={answers.timePreference === label} onClick={() => update('timePreference', label)} />
          ))}
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  ACCESS
    // ══════════════════════════════════════
    case 'access': return (
      <QuizLayout {...layoutProps} canNext={!!answers.access} progress={progress}>
        {ref}
        <QuestionHeading title="How will our team access the property?" />
        <div className="mb-4 flex flex-col gap-2">
          {['Someone will be there', 'Key collection from you', 'Key safe', 'Concierge / reception', 'Other'].map(opt => (
            <ChoiceCard key={opt} label={opt} selected={answers.access === opt} onClick={() => update('access', opt)} />
          ))}
        </div>
        <TextArea
          label="Access instructions (optional)"
          placeholder="e.g. key safe code will be provided on confirmation, please ring flat 2 on arrival..."
          value={answers.accessNotes ?? ''}
          onChange={v => update('accessNotes', v)}
          rows={3}
          hint="Do not include sensitive codes here — we'll collect those once confirmed."
        />
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  FREE TEXT / AI INPUT
    // ══════════════════════════════════════
    case 'free-text': return (
      <QuizLayout {...layoutProps} canNext progress={progress} nextLabel={!answers.freeText ? 'Skip' : 'Continue'}>
        {ref}
        <QuestionHeading
          title="Anything else you'd like us to know?"
          subtitle="Tell us in your own words. Our team reads every message."
        />
        <TextArea
          placeholder="e.g. It's a 3-bed house with a large conservatory. The oven hasn't been cleaned in a while. We have a cat."
          value={answers.freeText ?? ''}
          onChange={v => update('freeText', v)}
          rows={6}
        />
        <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
          <Lightbulb className="h-3.5 w-3.5 shrink-0 translate-y-0.5" />
          <span>You can also add photos on the next screen to help us prepare an accurate quote.</span>
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  CONTACT DETAILS
    // ══════════════════════════════════════
    case 'contact': return (
      <QuizLayout
        {...layoutProps}
        canNext={!!(answers.firstName && answers.email)}
        progress={progress}
        nextLabel="Review my details"
      >
        {ref}
        <QuestionHeading
          title="Where should we send your quote?"
          subtitle="We'll use these details to send your quote and follow up on this enquiry."
        />
        <div className="flex flex-col gap-4">
          <div className="grid grid-cols-2 gap-3">
            <TextInput
              label="First name"
              placeholder="Sarah"
              value={answers.firstName ?? ''}
              onChange={v => update('firstName', v)}
              required
            />
            <TextInput
              label="Last name"
              placeholder="Williams"
              value={answers.lastName ?? ''}
              onChange={v => update('lastName', v)}
            />
          </div>
          <TextInput
            label="Email address"
            placeholder="sarah@example.com"
            type="email"
            value={answers.email ?? ''}
            onChange={v => update('email', v)}
            required
          />
          <TextInput
            label="Phone number"
            placeholder="07700 900000"
            type="tel"
            value={answers.phone ?? ''}
            onChange={v => update('phone', v)}
            hint="Optional — helps us contact you quickly about your quote"
          />
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={answers.marketingConsent ?? false}
              onChange={e => update('marketingConsent', e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border-strong accent-primary"
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              I&apos;m happy to receive occasional news and offers from XeniaPure by email. You can unsubscribe at any time.
            </span>
          </label>
        </div>
      </QuizLayout>
    )

    // ══════════════════════════════════════
    //  REVIEW
    // ══════════════════════════════════════
    case 'review': {
      const svc = answers.serviceType
      const reviewSections: { label: string; value: string }[] = [
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
      ].filter(Boolean) as { label: string; value: string }[]

      return (
        <QuizLayout
          {...layoutProps}
          canNext
          nextLabel="Get my quote →"
          progress={progress}
        >
          {ref}
          <QuestionHeading title="Review your details" subtitle="Check everything looks right before we prepare your quote." />

          {/* Service details */}
          <div className="mb-4 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your requirements</span>
              <button
                onClick={() => navigate('service-type')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Edit
              </button>
            </div>
            {reviewSections.map(({ label, value }) => (
              <div key={label} className="flex items-start justify-between border-b border-border/60 px-4 py-3 last:border-0">
                <span className="w-1/3 shrink-0 text-xs text-muted-foreground">{label}</span>
                <span className="ml-3 flex-1 text-right text-sm font-medium text-foreground">{value}</span>
              </div>
            ))}
          </div>

          {/* Contact details */}
          <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
            <div className="flex items-center justify-between border-b border-border px-4 py-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your details</span>
              <button
                onClick={() => navigate('contact')}
                className="text-xs font-semibold text-primary hover:underline"
              >
                Edit
              </button>
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
            By continuing you agree to XeniaPure&apos;s privacy policy. Your information will only be used to prepare and deliver your quote.
          </p>
        </QuizLayout>
      )
    }

    // ══════════════════════════════════════
    //  CALCULATING
    // ══════════════════════════════════════
    case 'calculating': return (
      <CalculatingScreen onDone={() => navigate(getNextScreen('calculating', answers))} />
    )

    // ══════════════════════════════════════
    //  INSTANT QUOTE RESULT
    // ══════════════════════════════════════
    case 'quote-instant': {
      const lines = estimatePrice(answers)
      const total = lines.reduce((s, l) => s + l.price, 0)
      const svc = answers.serviceType
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
              <p className="text-sm text-muted-foreground">{getServiceLabel(svc)} · {answers.postcode}</p>
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

    // ══════════════════════════════════════
    //  MANUAL REVIEW RESULT
    // ══════════════════════════════════════
    case 'quote-manual': {
      const svc = answers.serviceType
      const isFM = svc === 'facilities'
      return (
        <div className="min-h-screen bg-background">
          <header className="border-b border-border bg-card px-4 py-4">
            <div className="mx-auto max-w-2xl">
              <XeniaPureLogo size="sm" />
            </div>
          </header>
          <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:py-12">
            <div className="mb-8 text-center">
              <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-success-bg">
                <CheckCircle2 className="h-7 w-7 text-success" strokeWidth={2} />
              </div>
              <h1 className="mb-2 font-serif text-3xl font-semibold text-foreground">
                {isFM ? "Thanks — we’ll review your requirements" : "Thanks — we have your details"}
              </h1>
              <p className="mx-auto mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
                {isFM
                  ? 'A member of the XeniaPure team will contact you to discuss your site and prepare an appropriate proposal.'
                  : "This service needs a quick review before we can confirm pricing. We'll prepare your quote using the information you've provided and be in touch shortly."
                }
              </p>
            </div>

            <div className="mb-6 overflow-hidden rounded-2xl border border-border bg-card shadow-soft">
              <div className="border-b border-border px-5 py-4">
                <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Enquiry summary</div>
              </div>
              {([
                { label: 'Service', value: getServiceLabel(svc) },
                answers.postcode && { label: 'Location', value: answers.postcode },
                answers.preferredDate && { label: 'Preferred date', value: new Date(answers.preferredDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
                { label: 'Contact', value: [answers.firstName, answers.lastName].filter(Boolean).join(' ') },
                answers.email && { label: 'Email', value: answers.email },
              ].filter(Boolean) as { label: string; value: string }[]).map(row => (
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
              onClick={() => { setScreen('welcome'); setAnswers({}); setHistory([]) }}
              className="mb-3 w-full rounded-xl bg-primary py-4 font-semibold text-primary-foreground shadow-soft-lg transition-all hover:bg-primary-hover"
            >
              Back to XeniaPure
            </button>
            <button className="w-full rounded-xl border border-border bg-card py-3.5 font-semibold text-label shadow-soft transition-all hover:border-border-strong">
              Request a call back
            </button>

            <p className="mt-6 text-center text-xs text-muted-foreground">
              Questions? Call <a href="tel:01249796848" className="font-medium text-primary">01249 796848</a>
            </p>
          </main>
        </div>
      )
    }

    default: return (
      <div className="flex min-h-screen items-center justify-center">
        <button onClick={() => setScreen('welcome')} className="text-primary underline">Return home</button>
      </div>
    )
  }
}

// ══════════════════════════════════════
//  CALCULATING SCREEN (animated)
// ══════════════════════════════════════
function CalculatingScreen({ onDone }: { onDone: () => void }) {
  const [step, setStep] = useState(0)
  const steps = ['Reviewing your requirements…', 'Checking service area…', 'Calculating your quote…', 'Preparing your estimate…']

  useEffect(() => {
    const timers: ReturnType<typeof setTimeout>[] = []
    steps.forEach((_, i) => {
      timers.push(setTimeout(() => setStep(i), i * 700))
    })
    timers.push(setTimeout(onDone, steps.length * 700 + 600))
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- runs once on mount to drive the fixed timer sequence
  }, [])

  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-card px-4 py-4">
        <div className="mx-auto max-w-xl">
          <XeniaPureLogo size="sm" />
        </div>
      </header>
      <main className="flex flex-1 items-center justify-center px-4">
        <div className="max-w-sm text-center">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-secondary">
            <Loader2 className="h-7 w-7 animate-spin text-primary" strokeWidth={2.5} />
          </div>
          <h2 className="mb-3 font-serif text-2xl font-semibold text-foreground">One moment…</h2>
          <div className="space-y-2">
            {steps.map((s, i) => (
              <div
                key={s}
                className={`text-sm transition-all duration-300 ${i <= step ? 'font-medium text-foreground' : 'text-border-strong'}`}
              >
                {i < step ? '✓ ' : i === step ? '→ ' : '  '}{s}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
