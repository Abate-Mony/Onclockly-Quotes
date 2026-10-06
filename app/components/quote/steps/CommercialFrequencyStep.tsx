import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = ['One-off', 'Daily', '2–3 times per week', 'Weekly', 'Fortnightly', 'Custom schedule']

export function CommercialFrequencyFields({ control }: { control: Control<{ commercialFrequency: string }> }) {
  return (
    <Controller
      control={control}
      name="commercialFrequency"
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          {OPTIONS.map(opt => (
            <ChoiceCard key={opt} label={opt} selected={field.value === opt} onClick={() => field.onChange(opt)} />
          ))}
        </div>
      )}
    />
  )
}
