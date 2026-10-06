import { Controller, type Control } from 'react-hook-form'
import { MultiSelectCard } from '../components/Primitives'

const OPTIONS = [
  'Site induction required', 'DBS-checked staff required', 'Restricted areas', 'Security clearance',
  'PPE required', 'Out-of-hours access only', 'Other', 'None',
]

export function CommercialComplianceFields({ control }: { control: Control<{ complianceReqs: string[] }> }) {
  return (
    <Controller
      control={control}
      name="complianceReqs"
      render={({ field }) => {
        const sel: string[] = field.value ?? []
        return (
          <div className="flex flex-col gap-2">
            {OPTIONS.map(opt => (
              <MultiSelectCard
                key={opt}
                label={opt}
                checked={sel.includes(opt)}
                onChange={() => {
                  if (opt === 'None') field.onChange(['None'])
                  else field.onChange(sel.includes(opt) ? sel.filter(s => s !== opt) : [...sel.filter(s => s !== 'None'), opt])
                }}
              />
            ))}
          </div>
        )
      }}
    />
  )
}
