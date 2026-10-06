import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard, TextArea, TextInput } from '../components/Primitives'

const URGENCY_OPTIONS = ['Urgent — within 48 hours', 'Within this week', 'Within this month', 'No immediate rush', 'Ongoing / contract']
const ONGOING_OPTIONS = ['One-off', 'Ongoing contract', 'Not sure yet']

export function FmRequirementFields({
  control,
}: {
  control: Control<{ fmLocations?: string; fmDescription?: string; fmUrgency?: string; fmOngoing?: string }>
}) {
  return (
    <div className="flex flex-col gap-5">
      <Controller
        control={control}
        name="fmLocations"
        render={({ field }) => (
          <TextInput label="Number of sites / locations" placeholder="e.g. 1" value={field.value ?? ''} onChange={field.onChange} />
        )}
      />
      <Controller
        control={control}
        name="fmDescription"
        render={({ field }) => (
          <TextArea
            label="Describe what you need"
            placeholder="e.g. We need a reactive maintenance team to cover our 3 office sites across Wiltshire..."
            value={field.value ?? ''}
            onChange={field.onChange}
            rows={4}
          />
        )}
      />
      <div>
        <div className="mb-2 text-sm font-medium text-label">Urgency</div>
        <Controller
          control={control}
          name="fmUrgency"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              {URGENCY_OPTIONS.map(opt => (
                <ChoiceCard key={opt} label={opt} selected={field.value === opt} onClick={() => field.onChange(opt)} />
              ))}
            </div>
          )}
        />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium text-label">Is this a one-off or ongoing requirement?</div>
        <Controller
          control={control}
          name="fmOngoing"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              {ONGOING_OPTIONS.map(opt => (
                <ChoiceCard key={opt} label={opt} selected={field.value === opt} onClick={() => field.onChange(opt)} />
              ))}
            </div>
          )}
        />
      </div>
    </div>
  )
}
