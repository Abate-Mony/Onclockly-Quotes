import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = [
  'Residential house', 'Residential flat / apartment', 'Commercial office', 'Retail / shop',
  'Industrial / warehouse', 'School / education', 'Healthcare', 'Other',
]

export function BuildSiteFields({ control }: { control: Control<{ buildSiteType: string }> }) {
  return (
    <Controller
      control={control}
      name="buildSiteType"
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
