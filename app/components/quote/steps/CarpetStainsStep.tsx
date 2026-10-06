import { Controller, type Control } from 'react-hook-form'
import { MultiSelectCard } from '../components/Primitives'

const ITEMS: [string, string][] = [
  ['Visible stains', 'Food, drink, or other marks'],
  ['Pet odour treatment', 'Neutralise pet smells'],
  ['Heavy soiling', 'Significant dirt or grime'],
  ['Delicate fibres', 'e.g. wool, silk, antique rug'],
  ['None of these', ''],
]

export function CarpetStainsFields({ control }: { control: Control<{ carpetStainDetails: string[] }> }) {
  return (
    <Controller
      control={control}
      name="carpetStainDetails"
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
