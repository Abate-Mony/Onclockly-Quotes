import type { ComponentType } from 'react'
import type { Control } from 'react-hook-form'
import type { ZodType } from 'zod'
import {
  serviceTypeSchema, propertyTypeSchema, bedroomsSchema, bathroomsSchema, propertySizeSchema,
  conditionSchema, occupancySchema, frequencySchema, areasSchema, extrasSchema, specialSchema,
  postcodeSchema, dateSchema, timePrefSchema, accessSchema, freeTextSchema, contactSchema,
  eotFurnishedSchema, eotExtrasSchema, eotDatesSchema,
  airbnbGuestsSchema, airbnbTurnoverSchema, airbnbServicesSchema,
  carpetItemsSchema, carpetStainsSchema,
  ovenTypeSchema, ovenExtrasSchema,
  buildSiteSchema, buildConditionSchema,
  commercialPremisesSchema, commercialSizeSchema, commercialOccupancySchema, commercialAreasSchema,
  commercialFrequencySchema, commercialHoursSchema, commercialProviderSchema, commercialImprovementsSchema,
  commercialSpecialistSchema, commercialComplianceSchema, commercialSurveySchema,
  fmServiceSchema, fmSiteSchema, fmRequirementSchema,
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
import { EotFurnishedFields } from './steps/EotFurnishedStep'
import { EotExtrasFields } from './steps/EotExtrasStep'
import { EotDatesFields } from './steps/EotDatesStep'
import { AirbnbGuestsFields } from './steps/AirbnbGuestsStep'
import { AirbnbTurnoverFields } from './steps/AirbnbTurnoverStep'
import { AirbnbServicesFields } from './steps/AirbnbServicesStep'
import { CarpetItemsFields } from './steps/CarpetItemsStep'
import { CarpetStainsFields } from './steps/CarpetStainsStep'
import { OvenTypeFields } from './steps/OvenTypeStep'
import { OvenExtrasFields } from './steps/OvenExtrasStep'
import { BuildSiteFields } from './steps/BuildSiteStep'
import { BuildConditionFields } from './steps/BuildConditionStep'
import { CommercialPremisesFields } from './steps/CommercialPremisesStep'
import { CommercialSizeFields } from './steps/CommercialSizeStep'
import { CommercialOccupancyFields } from './steps/CommercialOccupancyStep'
import { CommercialAreasFields } from './steps/CommercialAreasStep'
import { CommercialFrequencyFields } from './steps/CommercialFrequencyStep'
import { CommercialHoursFields } from './steps/CommercialHoursStep'
import { CommercialProviderFields } from './steps/CommercialProviderStep'
import { CommercialImprovementsFields } from './steps/CommercialImprovementsStep'
import { CommercialSpecialistFields } from './steps/CommercialSpecialistStep'
import { CommercialComplianceFields } from './steps/CommercialComplianceStep'
import { CommercialSurveyFields } from './steps/CommercialSurveyStep'
import { FmServiceFields } from './steps/FmServiceStep'
import { FmSiteFields } from './steps/FmSiteStep'
import { FmRequirementFields } from './steps/FmRequirementStep'

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

  // ── End of tenancy ────────────────────────────────────────────────
  'eot-furnished': {
    schema: eotFurnishedSchema,
    Fields: EotFurnishedFields,
    title: 'Is the property furnished or unfurnished?',
  },
  'eot-extras': {
    schema: eotExtrasSchema,
    Fields: EotExtrasFields,
    title: 'Any specific extras required?',
    subtitle: 'End of tenancy cleans typically include full kitchen, bathroom, and bedroom cleaning. Select any additional services.',
    getNextLabel: (v: { eotExtras?: string[] }) => (v.eotExtras?.length ? 'Continue' : 'Skip extras'),
  },
  'eot-dates': {
    schema: eotDatesSchema,
    Fields: EotDatesFields,
    title: 'Key dates',
    subtitle: 'These help us schedule the clean at the right time.',
  },

  // ── Airbnb ────────────────────────────────────────────────────────
  'airbnb-guests': {
    schema: airbnbGuestsSchema,
    Fields: AirbnbGuestsFields,
    title: 'What is the maximum guest capacity?',
  },
  'airbnb-turnover': {
    schema: airbnbTurnoverSchema,
    Fields: AirbnbTurnoverFields,
    title: 'How often do guests check in and out?',
  },
  'airbnb-services': {
    schema: airbnbServicesSchema,
    Fields: AirbnbServicesFields,
    title: 'Which additional services do you need?',
    subtitle: 'Select all that apply.',
    getNextLabel: (v: { airbnbServices?: string[] }) => skippableLabel(!!v.airbnbServices?.length),
  },

  // ── Carpet & upholstery ───────────────────────────────────────────
  'carpet-items': {
    schema: carpetItemsSchema,
    Fields: CarpetItemsFields,
    title: 'What needs cleaning?',
    subtitle: 'Select everything that applies.',
  },
  'carpet-stains': {
    schema: carpetStainsSchema,
    Fields: CarpetStainsFields,
    title: 'Any specific concerns?',
    subtitle: 'This helps us bring the right products and equipment.',
    getNextLabel: (v: { carpetStainDetails?: string[] }) => skippableLabel(!!v.carpetStainDetails?.length),
  },

  // ── Oven ──────────────────────────────────────────────────────────
  'oven-type': {
    schema: ovenTypeSchema,
    Fields: OvenTypeFields,
    title: 'What type of oven do you have?',
  },
  'oven-extras': {
    schema: ovenExtrasSchema,
    Fields: OvenExtrasFields,
    title: "Anything else to clean while we're there?",
    getNextLabel: (v: { ovenExtras?: string[] }) => skippableLabel(!!v.ovenExtras?.length),
  },

  // ── After-build ───────────────────────────────────────────────────
  'build-site': {
    schema: buildSiteSchema,
    Fields: BuildSiteFields,
    title: 'What type of property or site is this?',
  },
  'build-condition': {
    schema: buildConditionSchema,
    Fields: BuildConditionFields,
    title: 'Tell us about the build',
  },

  // ── Commercial ────────────────────────────────────────────────────
  'commercial-premises': {
    schema: commercialPremisesSchema,
    Fields: CommercialPremisesFields,
    title: 'What type of premises is this?',
  },
  'commercial-size': {
    schema: commercialSizeSchema,
    Fields: CommercialSizeFields,
    title: 'Approximately how large is the site?',
  },
  'commercial-occupancy': {
    schema: commercialOccupancySchema,
    Fields: CommercialOccupancyFields,
    title: 'How many people normally use the premises?',
  },
  'commercial-areas': {
    schema: commercialAreasSchema,
    Fields: CommercialAreasFields,
    title: 'Which areas need cleaning?',
    subtitle: 'Select all that apply.',
  },
  'commercial-frequency': {
    schema: commercialFrequencySchema,
    Fields: CommercialFrequencyFields,
    title: 'How often do you need cleaning?',
  },
  'commercial-hours': {
    schema: commercialHoursSchema,
    Fields: CommercialHoursFields,
    title: 'When should cleaning take place?',
  },
  'commercial-provider': {
    schema: commercialProviderSchema,
    Fields: CommercialProviderFields,
    title: 'Do you already have a cleaning provider?',
  },
  'commercial-improvements': {
    schema: commercialImprovementsSchema,
    Fields: CommercialImprovementsFields,
    title: 'What are you looking to improve?',
    subtitle: 'Select all that apply.',
  },
  'commercial-specialist': {
    schema: commercialSpecialistSchema,
    Fields: CommercialSpecialistFields,
    title: 'Do you have any specialist requirements?',
    subtitle: 'Select all that apply.',
    getNextLabel: (v: { specialistReqs?: string[] }) => skippableLabel(!!v.specialistReqs?.length),
  },
  'commercial-compliance': {
    schema: commercialComplianceSchema,
    Fields: CommercialComplianceFields,
    title: 'Any access or compliance requirements?',
    subtitle: 'Tell us so we can ensure the right arrangements.',
    getNextLabel: (v: { complianceReqs?: string[] }) => skippableLabel(!!v.complianceReqs?.length),
  },
  'commercial-survey': {
    schema: commercialSurveySchema,
    Fields: CommercialSurveyFields,
    title: 'Would you be happy for us to arrange a site survey?',
    subtitle: 'For larger commercial sites a brief site visit helps us provide the most accurate quote.',
  },

  // ── Facilities management ─────────────────────────────────────────
  'fm-service': {
    schema: fmServiceSchema,
    Fields: FmServiceFields,
    title: 'What do you need help with?',
    subtitle: 'Select all that apply.',
  },
  'fm-site': {
    schema: fmSiteSchema,
    Fields: FmSiteFields,
    title: 'Tell us about the site',
  },
  'fm-requirement': {
    schema: fmRequirementSchema,
    Fields: FmRequirementFields,
    title: 'Tell us more about your requirements',
    subtitle: 'The more detail you can share, the better we can tailor our response.',
  },
}
