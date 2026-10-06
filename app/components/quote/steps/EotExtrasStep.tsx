import { Controller, type Control } from 'react-hook-form'
import { MultiSelectCard } from '../components/Primitives'

const ITEMS: [string, string][] = [
  ['Carpet cleaning', 'All or selected rooms'],
  ['Oven cleaning', 'Professional deep clean'],
  ['Fridge / freezer interior', 'Defrost & clean inside'],
  ['Inside cupboards', 'Kitchen & bedroom storage'],
  ['Interior windows', 'All internal window surfaces'],
  ['Heavy limescale / stains', 'Bathroom & kitchen descaling'],
]

export function EotExtrasFields({ control }: { control: Control<{ eotExtras: string[] }> }) {
  return (
    <Controller
      control={control}
      name="eotExtras"
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
