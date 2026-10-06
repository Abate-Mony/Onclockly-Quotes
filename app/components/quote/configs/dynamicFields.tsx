// Generic Fields components for the dynamic (backend-driven) config — one
// per StepType, built from a step's own data at config-build time rather
// than hand-written per question like the cleaning config's step files.
// See dynamic.ts for how these are wired into a StepConfig per step.
import { Controller, type Control } from 'react-hook-form'
import { z, type ZodType } from 'zod'
import { ChoiceCard, MultiSelectCard, NumberPicker, TextInput, TextArea } from '../components/Primitives'
import type { DynamicStep } from './dynamicTypes'

// NumberPicker renders one button per discrete value — fine for a small
// range (bedrooms 1-8), unusable for something like 1-100. Past this many
// options, fall back to a plain bounded number input instead.
const MAX_NUMBER_PICKER_OPTIONS = 12

export function buildChoiceSchema(step: DynamicStep): ZodType {
    return step.required
        ? z.string().min(1, `Choose an option to continue.`)
        : z.string().optional()
}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic across all step types, like StepConfig.Fields itself
export function ChoiceFields({ step, control }: { step: DynamicStep; control: Control<any> }) {
    const options = step.options ?? []
    return (
        <Controller
            control={control}
            name={step.id}
            render={({ field }) => (
                <div className="flex flex-col gap-2">
                    {options.map(opt => (
                        <ChoiceCard key={opt.value} label={opt.label} selected={field.value === opt.value} onClick={() => field.onChange(opt.value)} />
                    ))}
                </div>
            )}
        />
    )
}

export function buildMultiselectSchema(step: DynamicStep): ZodType {
    return step.required
        ? z.array(z.string()).min(1, 'Choose at least one option.')
        : z.array(z.string()).default([])
}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic across all step types, like StepConfig.Fields itself
export function MultiselectFields({ step, control }: { step: DynamicStep; control: Control<any> }) {
    const options = step.options ?? []
    return (
        <Controller
            control={control}
            name={step.id}
            render={({ field }) => {
                const selected: string[] = field.value ?? []
                const toggle = (v: string) => field.onChange(selected.includes(v) ? selected.filter(x => x !== v) : [...selected, v])
                return (
                    <div className="flex flex-col gap-2">
                        {options.map(opt => (
                            <MultiSelectCard key={opt.value} label={opt.label} checked={selected.includes(opt.value)} onChange={() => toggle(opt.value)} />
                        ))}
                    </div>
                )
            }}
        />
    )
}

export function buildNumberSchema(step: DynamicStep): ZodType {
    const cfg = step.numberConfig ?? { min: 1, max: 10, step: 1 }
    const base = z.number().min(cfg.min, `Must be at least ${cfg.min}.`).max(cfg.max, `Must be at most ${cfg.max}.`)
    return step.required ? base : base.optional()
}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic across all step types, like StepConfig.Fields itself
export function NumberFields({ step, control }: { step: DynamicStep; control: Control<any> }) {
    const cfg = step.numberConfig ?? { min: 1, max: 10, step: 1 }
    const optionCount = Math.floor((cfg.max - cfg.min) / (cfg.step || 1)) + 1
    return (
        <Controller
            control={control}
            name={step.id}
            render={({ field }) => {
                if (optionCount > 0 && optionCount <= MAX_NUMBER_PICKER_OPTIONS) {
                    const options: number[] = []
                    for (let v = cfg.min; v <= cfg.max; v += cfg.step || 1) options.push(v)
                    return <NumberPicker options={options} value={field.value} onChange={field.onChange} />
                }
                return (
                    <TextInput
                        type="number"
                        value={field.value != null ? String(field.value) : ''}
                        onChange={v => field.onChange(v === '' ? undefined : Number(v))}
                        onBlur={field.onBlur}
                    />
                )
            }}
        />
    )
}

export function buildTextSchema(step: DynamicStep): ZodType {
    return step.required ? z.string().trim().min(1, 'This field is required.') : z.string().optional()
}

export function buildTextareaSchema(step: DynamicStep): ZodType {
    return step.required ? z.string().trim().min(1, 'This field is required.') : z.string().optional()
}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic across all step types, like StepConfig.Fields itself
export function TextFields({ step, control }: { step: DynamicStep; control: Control<any> }) {
    return (
        <Controller
            control={control}
            name={step.id}
            render={({ field, fieldState }) => (
                <TextInput placeholder={step.placeholder} value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} hint={step.helpText} />
            )}
        />
    )
}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic across all step types, like StepConfig.Fields itself
export function TextareaFields({ step, control }: { step: DynamicStep; control: Control<any> }) {
    return (
        <Controller
            control={control}
            name={step.id}
            render={({ field, fieldState }) => (
                <TextArea placeholder={step.placeholder} value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} error={fieldState.error?.message} hint={step.helpText} />
            )}
        />
    )
}

export function buildDateSchema(step: DynamicStep): ZodType {
    return step.required ? z.string().min(1, 'Choose a date.') : z.string().optional()
}

    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- generic across all step types, like StepConfig.Fields itself
export function DateFields({ step, control }: { step: DynamicStep; control: Control<any> }) {
    return (
        <Controller
            control={control}
            name={step.id}
            render={({ field }) => (
                <TextInput type="date" value={field.value ?? ''} onChange={field.onChange} onBlur={field.onBlur} />
            )}
        />
    )
}
