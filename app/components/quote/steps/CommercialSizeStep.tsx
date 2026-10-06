import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = ['Under 1,000 sq ft', '1,000–5,000 sq ft', '5,000–10,000 sq ft', '10,000–25,000 sq ft', 'Over 25,000 sq ft', "I'm not sure"]

export function CommercialSizeFields({ control }: { control: Control<{ commercialSize: string }> }) {
  return (
    <Controller
      control={control}
      name="commercialSize"
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
