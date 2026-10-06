import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = ['Before opening hours', 'During working hours', 'After closing', 'Overnight', 'Flexible']

export function CommercialHoursFields({ control }: { control: Control<{ commercialHours: string }> }) {
  return (
    <Controller
      control={control}
      name="commercialHours"
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
