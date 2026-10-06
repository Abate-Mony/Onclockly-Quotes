import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS: [string, string][] = [
  ['Yes', 'Happy to arrange a visit at a convenient time'],
  ['Maybe', "We can discuss once we've seen the initial estimate"],
  ['I would prefer a remote quote first', 'No visit needed at this stage'],
]

export function CommercialSurveyFields({ control }: { control: Control<{ siteSurvey: string }> }) {
  return (
    <Controller
      control={control}
      name="siteSurvey"
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
