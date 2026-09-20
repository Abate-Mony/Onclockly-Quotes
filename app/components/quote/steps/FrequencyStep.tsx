import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS: [string, string][] = [
  ['One-off', 'A single clean on one date'],
  ['Weekly', 'Every week on a regular day'],
  ['Every 2 weeks', 'Fortnightly visits'],
  ['Every 4 weeks', 'Monthly visits'],
  ['Not sure yet', "We'll work it out together"],
]

export function FrequencyFields({ control }: { control: Control<{ frequency: string }> }) {
  return (
    <Controller
      control={control}
      name="frequency"
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
