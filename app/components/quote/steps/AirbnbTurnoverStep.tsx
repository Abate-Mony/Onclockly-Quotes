import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = ['Daily or near-daily', 'Several times a week', 'Weekly', 'A few times a month', 'Less frequently', "I'm not sure yet"]

export function AirbnbTurnoverFields({ control }: { control: Control<{ turnoverFrequency: string }> }) {
  return (
    <Controller
      control={control}
      name="turnoverFrequency"
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
