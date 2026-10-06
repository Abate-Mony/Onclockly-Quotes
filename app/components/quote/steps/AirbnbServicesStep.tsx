import { Controller, type Control } from 'react-hook-form'
import { MultiSelectCard } from '../components/Primitives'

const ITEMS: [string, string][] = [
  ['Linen / laundry', 'Washing and drying bedding'],
  ['Bed making', 'Fresh linen & beds made up'],
  ['Consumable restocking', 'Toiletries, tea, coffee etc.'],
  ['Kitchen reset', 'Appliances & surfaces prepared'],
  ['Waste removal', 'Empty bins & recycling'],
]

export function AirbnbServicesFields({ control }: { control: Control<{ airbnbServices: string[] }> }) {
  return (
    <Controller
      control={control}
      name="airbnbServices"
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
