import { Controller, type Control } from 'react-hook-form'
import { CheckCircle2 } from 'lucide-react'
import { TextInput } from '../components/Primitives'

export function PostcodeFields({ control }: { control: Control<{ postcode: string; address?: string }> }) {
  return (
    <div className="flex flex-col gap-4">
      <Controller
        control={control}
        name="postcode"
        render={({ field, fieldState }) => (
          <>
            <TextInput
              label="Postcode"
              placeholder="e.g. SN15 1AB"
              value={field.value ?? ''}
              onChange={v => field.onChange(v.toUpperCase())}
              onBlur={field.onBlur}
              error={fieldState.error?.message}
              hint={fieldState.error ? undefined : 'Enter a UK postcode'}
            />
            {field.value && !fieldState.error && (
              <div className="flex items-center gap-2 rounded-xl border border-success-border bg-success-bg px-4 py-3 text-sm font-medium text-success">
                <CheckCircle2 className="h-4 w-4 shrink-0" />
                Great — we cover your area.
              </div>
            )}
          </>
        )}
      />
      <Controller
        control={control}
        name="address"
        render={({ field }) => (
          <TextInput
            label="Street address (optional)"
            placeholder="e.g. 14 Example Road, Chippenham"
            value={field.value ?? ''}
            onChange={field.onChange}
          />
        )}
      />
    </div>
  )
}
