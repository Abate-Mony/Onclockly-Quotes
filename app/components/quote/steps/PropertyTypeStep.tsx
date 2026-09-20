import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = [
  'Flat / Apartment', 'Terraced house', 'Semi-detached house', 'Detached house',
  'Bungalow', 'House of multiple occupation (HMO)', 'Other',
]

export function PropertyTypeFields({ control }: { control: Control<{ propertyType: string }> }) {
  return (
    <Controller
      control={control}
      name="propertyType"
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
