import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = ['Yes', 'No', 'Moving in', 'Moving out']

export function OccupancyFields({ control }: { control: Control<{ occupancy: string }> }) {
  return (
    <Controller
      control={control}
      name="occupancy"
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
