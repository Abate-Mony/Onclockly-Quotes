import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard, TextArea } from '../components/Primitives'

const OPTIONS = ['Someone will be there', 'Key collection from you', 'Key safe', 'Concierge / reception', 'Other']

export function AccessFields({ control }: { control: Control<{ access: string; accessNotes?: string }> }) {
  return (
    <>
      <Controller
        control={control}
        name="access"
        render={({ field }) => (
          <div className="mb-4 flex flex-col gap-2">
            {OPTIONS.map(opt => (
              <ChoiceCard key={opt} label={opt} selected={field.value === opt} onClick={() => field.onChange(opt)} />
            ))}
          </div>
        )}
      />
      <Controller
        control={control}
        name="accessNotes"
        render={({ field }) => (
          <TextArea
            label="Access instructions (optional)"
            placeholder="e.g. key safe code will be provided on confirmation, please ring flat 2 on arrival..."
            value={field.value ?? ''}
            onChange={field.onChange}
            rows={3}
            hint="Do not include sensitive codes here — we'll collect those once confirmed."
          />
        )}
      />
    </>
  )
}
