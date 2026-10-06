import { Controller, type Control } from 'react-hook-form'
import { TextInput } from '../components/Primitives'

export function EotDatesFields({ control }: { control: Control<{ moveOutDate?: string; inspectionDate?: string }> }) {
  return (
    <div className="flex flex-col gap-5">
      <Controller
        control={control}
        name="moveOutDate"
        render={({ field }) => (
          <TextInput
            label="Move-out date"
            type="date"
            value={field.value ?? ''}
            onChange={field.onChange}
            hint="The date the property will be vacated"
          />
        )}
      />
      <Controller
        control={control}
        name="inspectionDate"
        render={({ field }) => (
          <TextInput
            label="Inspection / handover date"
            type="date"
            value={field.value ?? ''}
            onChange={field.onChange}
            hint="When the landlord or agent will inspect"
          />
        )}
      />
    </div>
  )
}
