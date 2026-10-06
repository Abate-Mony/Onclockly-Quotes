import { Controller, type Control } from 'react-hook-form'
import { ChoiceCard, MultiSelectCard, TextInput } from '../components/Primitives'

const FINISHED_OPTIONS = ['Yes — ready for cleaning', 'Nearly finished', 'Still in progress']
const CONDITION_ITEMS = [
  'Heavy construction dust',
  'Paint / plaster residue',
  'Cement / grouting residue',
  'Window / glass cleaning',
  'Waste / debris removal',
  'Floor protection removal',
]

export function BuildConditionFields({
  control,
}: {
  control: Control<{ buildFinished: string; buildCondition: string[]; buildDeadline?: string }>
}) {
  return (
    <div className="flex flex-col gap-4">
      <div>
        <div className="mb-2 text-sm font-medium text-label">Has building work finished?</div>
        <Controller
          control={control}
          name="buildFinished"
          render={({ field }) => (
            <div className="flex flex-col gap-2">
              {FINISHED_OPTIONS.map(opt => (
                <ChoiceCard key={opt} label={opt} selected={field.value === opt} onClick={() => field.onChange(opt)} />
              ))}
            </div>
          )}
        />
      </div>
      <div>
        <div className="mb-2 text-sm font-medium text-label">What needs attention? (Select all)</div>
        <Controller
          control={control}
          name="buildCondition"
          render={({ field }) => {
            const sel: string[] = field.value ?? []
            return (
              <div className="flex flex-col gap-2">
                {CONDITION_ITEMS.map(opt => (
                  <MultiSelectCard
                    key={opt}
                    label={opt}
                    checked={sel.includes(opt)}
                    onChange={() => field.onChange(sel.includes(opt) ? sel.filter(s => s !== opt) : [...sel, opt])}
                  />
                ))}
              </div>
            )
          }}
        />
      </div>
      <Controller
        control={control}
        name="buildDeadline"
        render={({ field }) => (
          <TextInput
            label="Handover / completion deadline (optional)"
            type="date"
            value={field.value ?? ''}
            onChange={field.onChange}
            hint="When do you need this completed by?"
          />
        )}
      />
    </div>
  )
}
