import type { ComponentType } from 'react'
import { Controller, type Control } from 'react-hook-form'
import {
  Home, KeyRound, Sparkles, BedDouble, Sofa, Flame, HardHat, Building2, Wrench, MessageCircle,
} from 'lucide-react'
import { ChoiceCard } from '../components/Primitives'
import type { ServiceType } from '../types'

const SERVICE_OPTIONS: [ServiceType, string, string, ComponentType<{ className?: string }>][] = [
  ['home-cleaning', 'Home cleaning', 'Regular domestic cleaning', Home],
  ['end-of-tenancy', 'End of tenancy', 'Full clean for moving in or out', KeyRound],
  ['deep-cleaning', 'Deep cleaning', 'Thorough, intensive clean', Sparkles],
  ['airbnb', 'Airbnb / Holiday let', 'Turnover cleans for guests', BedDouble],
  ['carpet', 'Carpet or upholstery', 'Carpets, rugs, sofas & more', Sofa],
  ['oven', 'Oven cleaning', 'Professional oven deep clean', Flame],
  ['after-build', 'After-build cleaning', 'Post-construction clean', HardHat],
  ['commercial', 'Office / Commercial', 'Business premises cleaning', Building2],
  ['facilities', 'Facilities / Maintenance', 'FM support & maintenance', Wrench],
  ['other', 'Something else', 'Tell us what you need', MessageCircle],
]

export function ServiceTypeFields({ control }: { control: Control<{ serviceType: ServiceType }> }) {
  return (
    <Controller
      control={control}
      name="serviceType"
      render={({ field }) => (
        <div className="flex flex-col gap-2">
          {SERVICE_OPTIONS.map(([val, label, desc, Icon]) => (
            <ChoiceCard
              key={val}
              label={label}
              description={desc}
              icon={<Icon className="h-5 w-5" />}
              selected={field.value === val}
              onClick={() => field.onChange(val)}
            />
          ))}
        </div>
      )}
    />
  )
}
