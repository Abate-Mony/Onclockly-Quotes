import { Controller, type Control } from 'react-hook-form'
import { TextInput } from '../components/Primitives'
import { useCompany } from '../CompanyContext'

export interface ContactFieldsData {
  firstName: string
  lastName?: string
  email: string
  phone?: string
  marketingConsent: boolean
}

export function ContactFields({ control }: { control: Control<ContactFieldsData> }) {
  const company = useCompany()
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <Controller
          control={control}
          name="firstName"
          render={({ field, fieldState }) => (
            <TextInput label="First name" placeholder="Sarah" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} required />
          )}
        />
        <Controller
          control={control}
          name="lastName"
          render={({ field }) => (
            <TextInput label="Last name" placeholder="Williams" value={field.value ?? ''} onChange={field.onChange} />
          )}
        />
      </div>
      <Controller
        control={control}
        name="email"
        render={({ field, fieldState }) => (
          <TextInput label="Email address" placeholder="sarah@example.com" type="email" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} required />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field }) => (
          <TextInput
            label="Phone number"
            placeholder="07700 900000"
            type="tel"
            value={field.value ?? ''}
            onChange={field.onChange}
            hint="Optional — helps us contact you quickly about your quote"
          />
        )}
      />
      <Controller
        control={control}
        name="marketingConsent"
        render={({ field }) => (
          <label className="flex cursor-pointer items-start gap-3">
            <input
              type="checkbox"
              checked={field.value ?? false}
              onChange={e => field.onChange(e.target.checked)}
              className="mt-0.5 h-4 w-4 rounded border-border-strong accent-primary"
            />
            <span className="text-xs leading-relaxed text-muted-foreground">
              I&apos;m happy to receive occasional news and offers from {company.name} by email. You can unsubscribe at any time.
            </span>
          </label>
        )}
      />
    </div>
  )
}
