import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS: [string, string][] = [
  ['Morning', '8:00 am – 12:00 pm'],
  ['Afternoon', '12:00 pm – 5:00 pm'],
  ['Evening', '5:00 pm – 8:00 pm'],
  ['Flexible', 'Any time works for us'],
]

export function TimePrefFields({ control }: { control: Control<{ timePreference?: string }> }) {
  return (
    <Controller
      control={control}
      name="timePreference"
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
