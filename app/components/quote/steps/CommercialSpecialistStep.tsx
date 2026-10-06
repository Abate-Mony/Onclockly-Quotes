import { Controller, type Control } from 'react-hook-form'
import { MultiSelectCard } from '../components/Primitives'

const OPTIONS = [
  'Carpet cleaning', 'Deep cleaning', 'Disinfection / sanitisation', 'High-touch-area cleaning',
  'After-build cleaning', 'Waste management', 'Washroom hygiene', 'Grounds / exterior care',
  'Security / front-of-house support', 'None',
]

export function CommercialSpecialistFields({ control }: { control: Control<{ specialistReqs: string[] }> }) {
  return (
    <Controller
      control={control}
      name="specialistReqs"
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
