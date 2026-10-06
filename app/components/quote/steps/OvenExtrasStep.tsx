import { Controller, type Control } from 'react-hook-form'
import { MultiSelectCard } from '../components/Primitives'

const ITEMS: [string, string][] = [
  ['Hob cleaning', 'Gas or electric hob'],
  ['Extractor fan cleaning', 'Filter & casing'],
  ['Microwave interior', 'Quick additional clean'],
]

export function OvenExtrasFields({ control }: { control: Control<{ ovenExtras: string[] }> }) {
  return (
    <Controller
      control={control}
      name="ovenExtras"
      render={({ field }) => {
        const sel: string[] = field.value ?? []
        return (
          <div className="flex flex-col gap-2">
            {ITEMS.map(([label, desc]) => (
              <MultiSelectCard
                key={label}
                label={label}
                description={desc}
                checked={sel.includes(label)}
                onChange={() => field.onChange(sel.includes(label) ? sel.filter(s => s !== label) : [...sel, label])}
              />
            ))}
          </div>
        )
      }}
    />
  )
}
