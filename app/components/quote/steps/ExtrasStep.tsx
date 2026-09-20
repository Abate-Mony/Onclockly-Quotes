import { Controller, type Control } from 'react-hook-form'
import { MultiSelectCard } from '../components/Primitives'

const ITEMS: [string, string][] = [
  ['Oven cleaning', 'Professional oven deep clean'],
  ['Fridge interior', 'Inside the fridge & freezer'],
  ['Inside kitchen cupboards', 'Shelves, drawers & interiors'],
  ['Interior windows', 'Inside window surfaces'],
  ['Carpet cleaning', 'Deep extraction clean'],
  ['Upholstery cleaning', 'Sofas & fabric furniture'],
  ['Deep bathroom descaling', 'Limescale & grout treatment'],
  ['Appliance cleaning', 'Microwave, dishwasher, washing machine'],
]

export function ExtrasFields({ control }: { control: Control<{ extras: string[] }> }) {
  return (
    <Controller
      control={control}
      name="extras"
      render={({ field }) => {
        const sel: string[] = field.value ?? []
        const toggle = (v: string) => field.onChange(sel.includes(v) ? sel.filter(x => x !== v) : [...sel, v])
        return (
          <div className="flex flex-col gap-2">
            {ITEMS.map(([label, desc]) => (
              <MultiSelectCard key={label} label={label} description={desc} checked={sel.includes(label)} onChange={() => toggle(label)} />
            ))}
          </div>
        )
      }}
    />
  )
}
