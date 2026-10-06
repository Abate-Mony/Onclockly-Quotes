import { Controller, type Control } from 'react-hook-form'
import { MultiSelectCard } from '../components/Primitives'

const ITEMS: [string, string][] = [
  ['Carpet (room)', 'One or more rooms'],
  ['Rug', 'Any size or style'],
  ['Sofa', 'Fabric or velvet'],
  ['Armchair', 'Single upholstered chair'],
  ['Dining chairs', 'Fabric seat pads'],
  ['Mattress', 'Any size'],
  ['Other', 'Tell us more at the end'],
]

export function CarpetItemsFields({ control }: { control: Control<{ carpetItems: string[] }> }) {
  return (
    <Controller
      control={control}
      name="carpetItems"
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
