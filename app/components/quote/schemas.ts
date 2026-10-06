import { z } from 'zod'

const UK_POSTCODE = /^[A-Za-z]{1,2}\d[A-Za-z\d]?\s*\d[A-Za-z]{2}$/

export const serviceTypeSchema = z.object({
  serviceType: z.enum(
    ['home-cleaning', 'end-of-tenancy', 'deep-cleaning', 'airbnb', 'carpet',
      'oven', 'after-build', 'commercial', 'facilities', 'other'],
    'Choose a service to continue.',
  ),
})

export const propertyTypeSchema = z.object({
  propertyType: z.enum(
    ['Flat / Apartment', 'Terraced house', 'Semi-detached house', 'Detached house',
      'Bungalow', 'House of multiple occupation (HMO)', 'Other'],
    'Choose a property type to continue.',
  ),
})

export const bedroomsSchema = z.object({
  bedrooms: z.union(
    [z.number().int().min(1).max(5), z.literal('6+')],
    'Choose the number of bedrooms.',
  ),
})

export const bathroomsSchema = z.object({
  bathrooms: z.union(
    [z.number().int().min(1).max(3), z.literal('4+')],
    'Choose the number of bathrooms.',
  ),
})

export const propertySizeSchema = z.object({
  propertySize: z.enum(
    ['Under 750 sq ft', '750–1,250 sq ft', '1,250–2,000 sq ft',
      '2,000–3,000 sq ft', 'Over 3,000 sq ft', "I'm not sure"],
    'Choose a property size.',
  ),
})

export const conditionSchema = z.object({
  condition: z.enum(
    ['Lightly used / already fairly clean', 'Normal lived-in condition',
      'Needs a thorough clean', 'Heavy dirt / grease / limescale',
      'Very heavy cleaning required'],
    'Choose the current condition.',
  ),
})

export const occupancySchema = z.object({
  occupancy: z.enum(
    ['Yes', 'No', 'Moving in', 'Moving out'],
    'Let us know if the property will be occupied.',
  ),
})

export const frequencySchema = z.object({
  frequency: z.enum(
    ['One-off', 'Weekly', 'Every 2 weeks', 'Every 4 weeks', 'Not sure yet'],
    'Choose how often you need cleaning.',
  ),
})

export const areasSchema = z.object({
  areas: z.array(z.string()).min(1, 'Select at least one area.'),
})

export const extrasSchema = z.object({
  extras: z.array(z.string()).default([]),
})

export const specialSchema = z.object({
  special: z.array(z.string()).default([]),
})

export const postcodeSchema = z.object({
  postcode: z.string().trim()
    .min(1, 'Enter your postcode.')
    .regex(UK_POSTCODE, 'Enter a valid UK postcode.'),
  address: z.string().trim().optional(),
})

export const dateSchema = z.object({
  preferredDate: z.string().optional(),
  flexibility: z.string().optional(),
})

export const timePrefSchema = z.object({
  timePreference: z.string().optional(),
})

export const accessSchema = z.object({
  access: z.enum(
    ['Someone will be there', 'Key collection from you', 'Key safe', 'Concierge / reception', 'Other'],
    'Let us know how we can access the property.',
  ),
  accessNotes: z.string().optional(),
})

export const freeTextSchema = z.object({
  freeText: z.string().optional(),
})

export const contactSchema = z.object({
  firstName: z.string().trim().min(1, 'Enter your first name.'),
  lastName: z.string().trim().optional(),
  email: z.string().trim().min(1, 'Enter your email address.').email('Enter a valid email address.'),
  phone: z.string().trim().optional(),
  marketingConsent: z.boolean().default(false),
})

// ── End of tenancy ────────────────────────────────────────────────────
export const eotFurnishedSchema = z.object({
  furnished: z.enum(['Fully furnished', 'Part furnished', 'Unfurnished'], 'Choose one to continue.'),
})
export const eotExtrasSchema = z.object({
  eotExtras: z.array(z.string()).default([]),
})
export const eotDatesSchema = z.object({
  moveOutDate: z.string().optional(),
  inspectionDate: z.string().optional(),
})

// ── Airbnb ────────────────────────────────────────────────────────────
export const airbnbGuestsSchema = z.object({
  guestCapacity: z.string().min(1, 'Choose the maximum guest capacity.'),
})
export const airbnbTurnoverSchema = z.object({
  turnoverFrequency: z.enum(
    ['Daily or near-daily', 'Several times a week', 'Weekly', 'A few times a month', 'Less frequently', "I'm not sure yet"],
    'Choose one to continue.',
  ),
})
export const airbnbServicesSchema = z.object({
  airbnbServices: z.array(z.string()).default([]),
})

// ── Carpet & upholstery ───────────────────────────────────────────────
export const carpetItemsSchema = z.object({
  carpetItems: z.array(z.string()).min(1, 'Select at least one item.'),
})
export const carpetStainsSchema = z.object({
  carpetStainDetails: z.array(z.string()).default([]),
})

// ── Oven ──────────────────────────────────────────────────────────────
export const ovenTypeSchema = z.object({
  ovenType: z.enum(['Single oven', 'Double oven', 'Range cooker', 'Aga-style cooker', 'Other / not sure'], 'Choose one to continue.'),
})
export const ovenExtrasSchema = z.object({
  ovenExtras: z.array(z.string()).default([]),
})

// ── After-build ───────────────────────────────────────────────────────
export const buildSiteSchema = z.object({
  buildSiteType: z.enum(
    ['Residential house', 'Residential flat / apartment', 'Commercial office', 'Retail / shop',
      'Industrial / warehouse', 'School / education', 'Healthcare', 'Other'],
    'Choose one to continue.',
  ),
})
export const buildConditionSchema = z.object({
  buildFinished: z.enum(['Yes — ready for cleaning', 'Nearly finished', 'Still in progress'], 'Choose one to continue.'),
  buildCondition: z.array(z.string()).default([]),
  buildDeadline: z.string().optional(),
})

// ── Commercial ────────────────────────────────────────────────────────
export const commercialPremisesSchema = z.object({
  commercialPremises: z.enum(
    ['Office', 'Retail store', 'School / education', 'Clinic / dental / healthcare', 'Hospitality / restaurant',
      'Warehouse / logistics', 'Industrial', 'Public building', 'Other'],
    'Choose one to continue.',
  ),
})
export const commercialSizeSchema = z.object({
  commercialSize: z.enum(
    ['Under 1,000 sq ft', '1,000–5,000 sq ft', '5,000–10,000 sq ft', '10,000–25,000 sq ft', 'Over 25,000 sq ft', "I'm not sure"],
    'Choose one to continue.',
  ),
})
export const commercialOccupancySchema = z.object({
  commercialOccupancy: z.enum(['Under 10', '10–25', '26–50', '51–100', '100+', 'Not sure'], 'Choose one to continue.'),
})
export const commercialAreasSchema = z.object({
  commercialAreas: z.array(z.string()).min(1, 'Select at least one area.'),
})
export const commercialFrequencySchema = z.object({
  commercialFrequency: z.enum(['One-off', 'Daily', '2–3 times per week', 'Weekly', 'Fortnightly', 'Custom schedule'], 'Choose one to continue.'),
})
export const commercialHoursSchema = z.object({
  commercialHours: z.enum(['Before opening hours', 'During working hours', 'After closing', 'Overnight', 'Flexible'], 'Choose one to continue.'),
})
export const commercialProviderSchema = z.object({
  hasProvider: z.enum(['Yes', 'No'], 'Choose one to continue.'),
})
export const commercialImprovementsSchema = z.object({
  improvements: z.array(z.string()).min(1, 'Select at least one.'),
})
export const commercialSpecialistSchema = z.object({
  specialistReqs: z.array(z.string()).default([]),
})
export const commercialComplianceSchema = z.object({
  complianceReqs: z.array(z.string()).default([]),
})
export const commercialSurveySchema = z.object({
  siteSurvey: z.enum(['Yes', 'Maybe', 'I would prefer a remote quote first'], 'Choose one to continue.'),
})

// ── Facilities management ────────────────────────────────────────────
export const fmServiceSchema = z.object({
  fmServices: z.array(z.string()).min(1, 'Select at least one.'),
})
export const fmSiteSchema = z.object({
  fmSiteType: z.enum(
    ['Office / commercial', 'Industrial / warehouse', 'Retail', 'Healthcare', 'Education', 'Hospitality', 'Public sector', 'Mixed use', 'Other'],
    'Choose one to continue.',
  ),
})
export const fmRequirementSchema = z.object({
  fmLocations: z.string().optional(),
  fmDescription: z.string().optional(),
  fmUrgency: z.string().optional(),
  fmOngoing: z.string().optional(),
})

export const stepSchemas = {
  'service-type': serviceTypeSchema,
  'property-type': propertyTypeSchema,
  'bedrooms': bedroomsSchema,
  'bathrooms': bathroomsSchema,
  'property-size': propertySizeSchema,
  'condition': conditionSchema,
  'occupancy': occupancySchema,
  'frequency': frequencySchema,
  'areas': areasSchema,
  'extras': extrasSchema,
  'special': specialSchema,
  'postcode': postcodeSchema,
  'date': dateSchema,
  'time-pref': timePrefSchema,
  'access': accessSchema,
  'free-text': freeTextSchema,
  'contact': contactSchema,
  'eot-furnished': eotFurnishedSchema,
  'eot-extras': eotExtrasSchema,
  'eot-dates': eotDatesSchema,
  'airbnb-guests': airbnbGuestsSchema,
  'airbnb-turnover': airbnbTurnoverSchema,
  'airbnb-services': airbnbServicesSchema,
  'carpet-items': carpetItemsSchema,
  'carpet-stains': carpetStainsSchema,
  'oven-type': ovenTypeSchema,
  'oven-extras': ovenExtrasSchema,
  'build-site': buildSiteSchema,
  'build-condition': buildConditionSchema,
  'commercial-premises': commercialPremisesSchema,
  'commercial-size': commercialSizeSchema,
  'commercial-occupancy': commercialOccupancySchema,
  'commercial-areas': commercialAreasSchema,
  'commercial-frequency': commercialFrequencySchema,
  'commercial-hours': commercialHoursSchema,
  'commercial-provider': commercialProviderSchema,
  'commercial-improvements': commercialImprovementsSchema,
  'commercial-specialist': commercialSpecialistSchema,
  'commercial-compliance': commercialComplianceSchema,
  'commercial-survey': commercialSurveySchema,
  'fm-service': fmServiceSchema,
  'fm-site': fmSiteSchema,
  'fm-requirement': fmRequirementSchema,
} as const

export type RoutedFormStep = keyof typeof stepSchemas
