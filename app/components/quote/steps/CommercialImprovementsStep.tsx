import { Controller, type Control } from 'react-hook-form'
import { MultiSelectCard } from '../components/Primitives'

const OPTIONS = ['Reliability', 'Quality of clean', 'Cost', 'Staff cover', 'Communication', 'Compliance', 'Other']

export function CommercialImprovementsFields({ control }: { control: Control<{ improvements: string[] }> }) {
  return (
    <Controller
      control={control}
      name="improvements"
      render={({ field }) => {
        const sel: string[] = field.value ?? []
        return (
          <div className="flex flex-col gap-2">
            {OPTIONS.map(opt => (
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
  )
}
