import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = [
  'Office', 'Retail store', 'School / education', 'Clinic / dental / healthcare', 'Hospitality / restaurant',
  'Warehouse / logistics', 'Industrial', 'Public building', 'Other',
]

export function CommercialPremisesFields({ control }: { control: Control<{ commercialPremises: string }> }) {
  return (
    <Controller
      control={control}
      name="commercialPremises"
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
