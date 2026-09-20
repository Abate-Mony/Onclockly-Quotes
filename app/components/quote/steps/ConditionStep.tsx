import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS: [string, string][] = [
  ['Lightly used / already fairly clean', 'Light general tidying needed'],
  ['Normal lived-in condition', 'Regular day-to-day use'],
  ['Needs a thorough clean', 'Has been used heavily'],
  ['Heavy dirt / grease / limescale', 'Significant build-up in areas'],
  ['Very heavy cleaning required', 'Multiple areas need intensive attention'],
]

export function ConditionFields({ control }: { control: Control<{ condition: string }> }) {
  return (
    <Controller
      control={control}
      name="condition"
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          {OPTIONS.map(([label, desc]) => (
            <ChoiceCard key={label} label={label} description={desc} selected={field.value === label} onClick={() => field.onChange(label)} />
          ))}
        </div>
      )}
    />
  )
}
