import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = ['Under 10', '10–25', '26–50', '51–100', '100+', 'Not sure']

export function CommercialOccupancyFields({ control }: { control: Control<{ commercialOccupancy: string }> }) {
  return (
    <Controller
      control={control}
      name="commercialOccupancy"
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
