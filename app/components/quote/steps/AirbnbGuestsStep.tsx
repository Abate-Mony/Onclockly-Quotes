import { Controller, type Control } from 'react-hook-form'
import { NumberPicker } from '../components/Primitives'

export function AirbnbGuestsFields({ control }: { control: Control<{ guestCapacity: string }> }) {
  return (
    <Controller
      control={control}
      name="guestCapacity"
      render={({ field }) => (
        <NumberPicker
          options={[1, 2, 3, 4, 5, 6, 7, 8, '9+']}
          value={field.value}
          onChange={v => field.onChange(String(v))}
        />
      )}
    />
  )
}
