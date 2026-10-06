import type { ReactNode } from 'react'
import { Check } from 'lucide-react'

// ---- Logo ----
// Company name/logo are per-company (see CompanyContext) — this renders
// whichever company the wizard is currently running for, never a
// hardcoded brand. The droplet mark is a generic fallback icon shown when
// a company has no logo uploaded, not brand-specific artwork.
export function BrandLogo({
  name,
  logoUrl,
  size = 'md',
  onDark = false,
}: {
  name: string
  logoUrl?: string | null
  size?: 'sm' | 'md' | 'lg'
  onDark?: boolean
}) {
  const text = size === 'sm' ? 'text-lg' : size === 'lg' ? 'text-3xl' : 'text-xl'
  const badge = size === 'sm' ? 'h-7 w-7' : size === 'lg' ? 'h-10 w-10' : 'h-8 w-8'
  const icon = size === 'sm' ? 16 : size === 'lg' ? 22 : 18
  return (
    <div className={`flex items-center gap-2.5 ${text} font-serif font-semibold ${onDark ? 'text-white' : 'text-foreground'}`}>
      <span className={`flex ${badge} shrink-0 items-center justify-center overflow-hidden rounded-xl ${onDark ? 'bg-white/10' : 'bg-primary/10'}`}>
        {logoUrl ? (
          // eslint-disable-next-line @next/next/no-img-element -- arbitrary per-company remote URL, not a known-at-build-time asset
          <img src={logoUrl} alt="" className="h-full w-full object-cover" />
        ) : (
          <svg width={icon} height={icon} viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M12 2C12 2 7 6 7 11a5 5 0 0010 0c0-5-5-9-5-9z" fill="#1d4ed8" opacity="0.2" />
            <path d="M12 2C12 2 7 6 7 11a5 5 0 0010 0c0-5-5-9-5-9z" stroke="#1d4ed8" strokeWidth="1.5" strokeLinejoin="round" />
            <circle cx="12" cy="11" r="2" fill="#1d4ed8" />
            <path d="M9 18l-1 4M15 18l1 4M7 19h10" stroke="#1d4ed8" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
        )}
      </span>
      {name}
    </div>
  )
}

// ---- Progress Bar ----
export function ProgressBar({ current, total }: { current: number; total: number }) {
  const pct = Math.round((current / total) * 100)
  return (
    <div className="w-full">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">Step {current} of {total}</span>
        <span className="text-xs font-medium text-muted-foreground">{pct}%</span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

// ---- Choice Card (single select) ----
export function ChoiceCard({
  label,
  description,
  icon,
  selected,
  onClick,
}: {
  label: string
  description?: string
  icon?: ReactNode
  selected: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center gap-3.5 rounded-2xl border p-4 text-left transition-all duration-150
        ${selected
          ? 'border-primary/40 bg-secondary/60 shadow-[0_0_0_3px_var(--color-secondary)]'
          : 'border-border bg-card shadow-soft hover:-translate-y-0.5 hover:border-border-strong hover:shadow-soft-lg'
        }`}
    >
      {icon && (
        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors
          ${selected ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground group-hover:text-foreground'}`}>
          {icon}
        </span>
      )}
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium leading-snug text-foreground">{label}</div>
        {description && <div className="mt-0.5 text-xs leading-snug text-muted-foreground">{description}</div>}
      </div>
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors
        ${selected ? 'border-primary bg-primary' : 'border-border-strong bg-transparent'}`}>
        {selected && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
      </span>
    </button>
  )
}

// ---- Multi Select (checkboxes) ----
export function MultiSelectCard({
  label,
  description,
  checked,
  onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`flex w-full items-center gap-3.5 rounded-2xl border p-3.5 text-left transition-all duration-150
        ${checked
          ? 'border-primary/40 bg-secondary/60 shadow-[0_0_0_3px_var(--color-secondary)]'
          : 'border-border bg-card shadow-soft hover:border-border-strong hover:shadow-soft-lg'
        }`}
    >
      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition-colors
        ${checked ? 'border-primary bg-primary' : 'border-border-strong bg-transparent'}`}>
        {checked && <Check className="h-3 w-3 text-primary-foreground" strokeWidth={3} />}
      </span>
      <div className="min-w-0 flex-1">
        <div className="text-sm font-medium leading-snug text-foreground">{label}</div>
        {description && <div className="mt-0.5 text-xs leading-snug text-muted-foreground">{description}</div>}
      </div>
    </button>
  )
}

// ---- Number Picker ----
export function NumberPicker({
  options,
  value,
  onChange,
}: {
  options: (number | string)[]
  value?: number | string
  onChange: (v: number | string) => void
}) {
  return (
    <div className="flex flex-wrap gap-2.5">
      {options.map((opt) => (
        <button
          key={String(opt)}
          onClick={() => onChange(opt)}
          className={`h-14 min-w-[56px] rounded-xl border px-4 text-base font-semibold transition-all duration-150
            ${value === opt
              ? 'border-primary bg-primary text-primary-foreground shadow-soft-lg'
              : 'border-border bg-card text-foreground shadow-soft hover:-translate-y-0.5 hover:border-border-strong'
            }`}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}

// ---- Text Input ----
export function TextInput({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  type = 'text',
  hint,
  error,
  required,
}: {
  label?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  type?: string
  hint?: string
  error?: string
  required?: boolean
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label className="text-sm font-medium text-label">
          {label}{required && <span className="ml-0.5 text-danger">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full rounded-xl border bg-card px-4 py-3
          text-sm text-foreground placeholder-muted-foreground/60 shadow-soft outline-none transition-colors
          ${error ? 'border-danger focus:border-danger focus:ring-4 focus:ring-danger/10' : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/10'}`}
      />
      {error ? <p className="text-xs text-danger">{error}</p> : hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

// ---- Textarea ----
export function TextArea({
  label,
  placeholder,
  value,
  onChange,
  onBlur,
  hint,
  error,
  rows = 4,
}: {
  label?: string
  placeholder?: string
  value: string
  onChange: (v: string) => void
  onBlur?: () => void
  hint?: string
  error?: string
  rows?: number
}) {
  return (
    <div className="flex flex-col gap-1.5">
      {label && <label className="text-sm font-medium text-label">{label}</label>}
      <textarea
        rows={rows}
        placeholder={placeholder}
        value={value}
        onChange={e => onChange(e.target.value)}
        onBlur={onBlur}
        className={`w-full resize-none rounded-xl border bg-card px-4 py-3
          text-sm text-foreground placeholder-muted-foreground/60 shadow-soft outline-none transition-colors
          ${error ? 'border-danger focus:border-danger focus:ring-4 focus:ring-danger/10' : 'border-border focus:border-primary focus:ring-4 focus:ring-primary/10'}`}
      />
      {error ? <p className="text-xs text-danger">{error}</p> : hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}

// ---- Question Heading ----
export function QuestionHeading({ title, subtitle, required }: { title: string; subtitle?: string; required?: boolean }) {
  return (
    <div className="mb-6 animate-fade-in-up">
      <h2 className="font-serif text-2xl font-semibold leading-snug tracking-tight text-foreground sm:text-[1.75rem]">
        {title}
        {required === true && <span className="ml-1 text-danger">*</span>}
        {required === false && <span className="ml-2 align-middle text-xs font-sans font-normal text-muted-foreground">(optional)</span>}
      </h2>
      {subtitle && <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{subtitle}</p>}
    </div>
  )
}

// ---- Section Label ----
export function SectionLabel({ children }: { children: ReactNode }) {
  return (
    <div className="mb-2.5 mt-6 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground first:mt-0">
      <span className="h-1 w-1 rounded-full bg-primary/50" />
      {children}
    </div>
  )
}
