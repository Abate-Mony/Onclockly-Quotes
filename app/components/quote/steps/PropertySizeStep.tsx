import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = [
  'Under 750 sq ft', '750–1,250 sq ft', '1,250–2,000 sq ft',
  '2,000–3,000 sq ft', 'Over 3,000 sq ft', "I'm not sure",
]

export function PropertySizeFields({ control }: { control: Control<{ propertySize: string }> }) {
  return (
    <Controller
      control={control}
      name="propertySize"
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
