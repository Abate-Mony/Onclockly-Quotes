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
} as const

export type RoutedFormStep = keyof typeof stepSchemas
