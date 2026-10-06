import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = ['Fully furnished', 'Part furnished', 'Unfurnished']

export function EotFurnishedFields({ control }: { control: Control<{ furnished: string }> }) {
  return (
    <Controller
      control={control}
      name="furnished"
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
