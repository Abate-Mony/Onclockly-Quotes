import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard, TextInput } from '../components/Primitives'

const FLEX_OPTIONS = ['Exact date required', '± 1 day either side', '± 3 days either side', 'Flexible — any date that suits']

export function DateFields({ control }: { control: Control<{ preferredDate?: string; flexibility?: string }> }) {
  return (
    <div className="flex flex-col gap-5">
      <Controller
        control={control}
        name="preferredDate"
        render={({ field }) => (
          <TextInput label="Preferred date" type="date" value={field.value ?? ''} onChange={field.onChange} />
        )}
      />
      <div>
        <div className="mb-2 text-sm font-medium text-label">How flexible are you?</div>
        <Controller
          control={control}
          name="flexibility"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              {FLEX_OPTIONS.map(opt => (
                <ChoiceCard key={opt} label={opt} selected={field.value === opt} onClick={() => field.onChange(opt)} />
              ))}
            </div>
          )}
        />
      </div>
    </div>
  )
}
