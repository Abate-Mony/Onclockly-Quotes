import { Controller, type Control } from 'react-hook-form'
import { NumberPicker } from '../components/Primitives'

export function BathroomsFields({ control }: { control: Control<{ bathrooms: number | '4+' }> }) {
  return (
    <Controller
      control={control}
      name="bathrooms"
      render={({ field }) => (
        <NumberPicker options={[1, 2, 3, '4+']} value={field.value} onChange={field.onChange} />
      )}
    />
  )
}
