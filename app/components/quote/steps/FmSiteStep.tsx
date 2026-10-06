import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard } from '../components/Primitives'

const OPTIONS = ['Office / commercial', 'Industrial / warehouse', 'Retail', 'Healthcare', 'Education', 'Hospitality', 'Public sector', 'Mixed use', 'Other']

export function FmSiteFields({ control }: { control: Control<{ fmSiteType: string }> }) {
  return (
    <Controller
      control={control}
      name="fmSiteType"
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
