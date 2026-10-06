import { Controller, type Control } from 'react-hook-form'
import { MultiSelectCard } from '../components/Primitives'

const ITEMS: [string, string][] = [
  ['Reactive maintenance', 'On-demand repairs & fixes'],
  ['Planned preventative maintenance', 'Scheduled inspection & upkeep'],
  ['Handyman work', 'General repairs & tasks'],
  ['Grounds maintenance', 'External & landscape care'],
  ['Waste management', 'Collections & recycling'],
  ['Washroom & hygiene services', 'Consumables & hygiene units'],
  ['Supplies & consumables', 'Managed supply of materials'],
  ['Security / front-of-house staffing', 'On-site personnel support'],
  ['General facilities management', 'Comprehensive FM support'],
  ['Other', ''],
]

export function FmServiceFields({ control }: { control: Control<{ fmServices: string[] }> }) {
  return (
    <Controller
      control={control}
      name="fmServices"
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
                onChange={() => field.onChange(sel.includes(label) ? sel.filter(s => s !== label) : [...sel, label])}
              />
            ))}
          </div>
        )
      }}
    />
  )
}
