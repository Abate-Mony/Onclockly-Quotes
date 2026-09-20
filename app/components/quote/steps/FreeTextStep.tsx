import { Controller, type Control } from 'react-hook-form'
import { Lightbulb } from 'lucide-react'
import { TextArea } from '../components/Primitives'

export function FreeTextFields({ control }: { control: Control<{ freeText?: string }> }) {
  return (
    <>
      <Controller
        control={control}
        name="freeText"
        render={({ field }) => (
          <TextArea
            placeholder="e.g. It's a 3-bed house with a large conservatory. The oven hasn't been cleaned in a while. We have a cat."
            value={field.value ?? ''}
            onChange={field.onChange}
            rows={6}
          />
        )}
      />
      <div className="mt-3 flex items-start gap-2 text-xs text-muted-foreground">
        <Lightbulb className="h-3.5 w-3.5 shrink-0 translate-y-0.5" />
        <span>You can also add photos on the next screen to help us prepare an accurate quote.</span>
      </div>
    </>
  )
}
