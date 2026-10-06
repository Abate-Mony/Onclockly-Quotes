import { Controller, type Control } from 'react-hook-form'
import { MultiSelectCard, SectionLabel } from '../components/Primitives'

const DEFAULTS = ['Workspaces / offices', 'Toilets / washrooms', 'Kitchen / staff room', 'Reception']
const OPTIONAL = ['Corridors', 'Meeting rooms', 'Warehouse area', 'Changing rooms', 'Public areas', 'Other']

export function CommercialAreasFields({ control }: { control: Control<{ commercialAreas: string[] }> }) {
  return (
    <Controller
      control={control}
      name="commercialAreas"
      render={({ field }) => {
        const sel: string[] = field.value ?? DEFAULTS
        const toggle = (v: string) => field.onChange(sel.includes(v) ? sel.filter(x => x !== v) : [...sel, v])
        return (
          <>
            <SectionLabel>Core areas</SectionLabel>
            <div className="mb-2 flex flex-col gap-2">
              {DEFAULTS.map(a => (
                <MultiSelectCard key={a} label={a} checked={sel.includes(a)} onChange={() => toggle(a)} />
              ))}
            </div>
            <SectionLabel>Additional areas</SectionLabel>
            <div className="flex flex-col gap-2">
              {OPTIONAL.map(a => (
                <MultiSelectCard key={a} label={a} checked={sel.includes(a)} onChange={() => toggle(a)} />
              ))}
            </div>
          </>
        )
      }}
    />
  )
}

export const COMMERCIAL_AREAS_DEFAULTS = DEFAULTS
