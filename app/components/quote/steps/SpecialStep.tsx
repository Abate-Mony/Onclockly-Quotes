import { Controller, type Control } from 'react-hook-form'
import { MultiSelectCard } from '../components/Primitives'

const ITEMS: [string, string][] = [
  ['Pets in the property', 'Pet hair, odour considerations'],
  ['Allergy-sensitive household', 'We use appropriate products'],
  ['Fragile / delicate surfaces', 'Extra care around valuables'],
  ['Heavy limescale', 'Particularly in bathrooms'],
  ['Mould / specialist concern', 'May need specialist treatment'],
  ['Access restrictions', 'e.g. no parking, key safe only'],
  ['None of these', ''],
]

export function SpecialFields({ control }: { control: Control<{ special: string[] }> }) {
  return (
    <Controller
      control={control}
      name="special"
      render={({ field }) => {
        const sel: string[] = field.value ?? []
        return (
          <div className="flex flex-col gap-2">
            {ITEMS.map(([label, desc]) => (
              <MultiSelectCard
                key={label}
                label={label}
                description={desc || undefined}
                checked={sel.includes(label)}
                onChange={() => {
                  if (label === 'None of these') field.onChange(['None of these'])
                  else field.onChange(sel.includes(label) ? sel.filter(s => s !== label) : [...sel.filter(s => s !== 'None of these'), label])
                }}
              />
            ))}
          </div>
        )
      }}
    />
  )
}
