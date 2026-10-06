import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = ['Yes', 'No']

export function CommercialProviderFields({ control }: { control: Control<{ hasProvider: string }> }) {
  return (
    <Controller
      control={control}
      name="hasProvider"
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
