import { Controller, type Control } from 'react-hook-form'
import { NumberPicker } from '../components/Primitives'

export function BedroomsFields({ control }: { control: Control<{ bedrooms: number | '6+' }> }) {
  return (
    <Controller
      control={control}
      name="bedrooms"
      render={({ field }) => (
        <NumberPicker options={[1, 2, 3, 4, 5, '6+']} value={field.value} onChange={field.onChange} />
      )}
    />
  )
}
