import type { ComponentType } from 'react'
import type { Control } from 'react-hook-form'
import type { ZodType } from 'zod'
import {
  serviceTypeSchema, propertyTypeSchema, bedroomsSchema, bathroomsSchema, propertySizeSchema,
  conditionSchema, occupancySchema, frequencySchema, areasSchema, extrasSchema, specialSchema,
  postcodeSchema, dateSchema, timePrefSchema, accessSchema, freeTextSchema, contactSchema,
  type RoutedFormStep,
} from './schemas'
import { ServiceTypeFields } from './steps/ServiceTypeStep'
import { PropertyTypeFields } from './steps/PropertyTypeStep'
import { BedroomsFields } from './steps/BedroomsStep'
import { BathroomsFields } from './steps/BathroomsStep'
import { PropertySizeFields } from './steps/PropertySizeStep'
import { ConditionFields } from './steps/ConditionStep'
import { OccupancyFields } from './steps/OccupancyStep'
import { FrequencyFields } from './steps/FrequencyStep'
import { AreasFields } from './steps/AreasStep'
import { ExtrasFields } from './steps/ExtrasStep'
import { SpecialFields } from './steps/SpecialStep'
import { PostcodeFields } from './steps/PostcodeStep'
import { DateFields } from './steps/DateStep'
import { TimePrefFields } from './steps/TimePrefStep'
import { AccessFields } from './steps/AccessStep'
import { FreeTextFields } from './steps/FreeTextStep'
import { ContactFields } from './steps/ContactStep'

export interface StepConfig {
  schema: ZodType
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- registry deliberately erases each step's distinct field-shape generic
  Fields: ComponentType<{ control: Control<any> }>
  title: string
  subtitle?: string
  showBack?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  getNextLabel?: (values: any) => string
}

const skippableLabel = (hasValue: boolean) => (hasValue ? 'Continue' : 'Skip')

export const stepRegistry: Record<RoutedFormStep, StepConfig> = {
  'service-type': {
    schema: serviceTypeSchema,
    Fields: ServiceTypeFields,
    title: 'What do you need help with?',
    subtitle: "Choose the service that best describes what you're looking for.",
    showBack: false,
  },
  'property-type': {
    schema: propertyTypeSchema,
    Fields: PropertyTypeFields,
    title: 'What type of property is it?',
  },
  'bedrooms': {
    schema: bedroomsSchema,
    Fields: BedroomsFields,
    title: 'How many bedrooms?',
  },
  'bathrooms': {
    schema: bathroomsSchema,
    Fields: BathroomsFields,
    title: 'How many bathrooms?',
    subtitle: 'Include any en-suites or shower rooms.',
  },
  'property-size': {
    schema: propertySizeSchema,
    Fields: PropertySizeFields,
    title: 'Approximately how large is the property?',
    subtitle: "A rough estimate is fine — choose 'I'm not sure' if you prefer.",
  },
  'condition': {
    schema: conditionSchema,
    Fields: ConditionFields,
    title: 'How would you describe the current condition?',
    subtitle: 'This helps us estimate the time needed.',
  },
  'occupancy': {
    schema: occupancySchema,
    Fields: OccupancyFields,
    title: 'Will the property be occupied during the clean?',
  },
  'frequency': {
    schema: frequencySchema,
    Fields: FrequencyFields,
    title: 'How often would you like cleaning?',
  },
  'areas': {
    schema: areasSchema,
    Fields: AreasFields,
    title: 'Which areas should we clean?',
    subtitle: 'Select all that apply.',
  },
  'extras': {
    schema: extrasSchema,
    Fields: ExtrasFields,
    title: 'Would you like any extras?',
    subtitle: 'Optional add-ons — choose as many as you like.',
    getNextLabel: (v: { extras?: string[] }) => skippableLabel(!!v.extras?.length),
  },
  'special': {
    schema: specialSchema,
    Fields: SpecialFields,
    title: 'Anything we should know before arriving?',
    subtitle: 'This helps us prepare appropriately.',
    getNextLabel: (v: { special?: string[] }) => skippableLabel(!!v.special?.length),
  },
  'postcode': {
    schema: postcodeSchema,
    Fields: PostcodeFields,
    title: 'Where is the property?',
    subtitle: "We'll use your postcode to confirm we cover your area.",
  },
  'date': {
    schema: dateSchema,
    Fields: DateFields,
    title: 'When would you like the cleaning?',
    subtitle: "Choose a preferred date — we'll confirm availability.",
    getNextLabel: (v: { preferredDate?: string }) => skippableLabel(!!v.preferredDate),
  },
  'time-pref': {
    schema: timePrefSchema,
    Fields: TimePrefFields,
    title: 'Preferred time of day',
    subtitle: "We'll aim to match your preference when scheduling.",
    getNextLabel: (v: { timePreference?: string }) => skippableLabel(!!v.timePreference),
  },
  'access': {
    schema: accessSchema,
    Fields: AccessFields,
    title: 'How will our team access the property?',
  },
  'free-text': {
    schema: freeTextSchema,
    Fields: FreeTextFields,
    title: "Anything else you'd like us to know?",
    subtitle: 'Tell us in your own words. Our team reads every message.',
    getNextLabel: (v: { freeText?: string }) => skippableLabel(!!v.freeText),
  },
  'contact': {
    schema: contactSchema,
    Fields: ContactFields,
    title: 'Where should we send your quote?',
    subtitle: "We'll use these details to send your quote and follow up on this enquiry.",
    getNextLabel: () => 'Review my details',
  },
}
