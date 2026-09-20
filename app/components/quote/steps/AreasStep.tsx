import { Controller, type Control } from 'react-hook-form'
import { MultiSelectCard, SectionLabel } from '../components/Primitives'

const DEFAULTS = ['Kitchen', 'Bathrooms', 'Bedrooms', 'Living room', 'Hallways / stairs']
const OPTIONAL = ['Utility room', 'Conservatory', 'Garage', 'Other']

export function AreasFields({ control }: { control: Control<{ areas: string[] }> }) {
  return (
    <Controller
      control={control}
      name="areas"
      render={({ field }) => {
        const sel: string[] = field.value ?? DEFAULTS
        const toggle = (v: string) => field.onChange(sel.includes(v) ? sel.filter(x => x !== v) : [...sel, v])
        return (
          <>
            <SectionLabel>Main areas</SectionLabel>
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

export const AREAS_DEFAULTS = DEFAULTS
