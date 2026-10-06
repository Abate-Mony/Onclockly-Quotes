import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = ['Single oven', 'Double oven', 'Range cooker', 'Aga-style cooker', 'Other / not sure']

export function OvenTypeFields({ control }: { control: Control<{ ovenType: string }> }) {
  return (
    <Controller
      control={control}
      name="ovenType"
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
