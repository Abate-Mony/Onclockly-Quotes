import type { Screen, Answers } from './types'

export function getNextScreen(current: Screen, answers: Answers): Screen {
  const svc = answers.serviceType
  switch (current) {
    case 'welcome': return 'service-type'
    case 'service-type':
      if (svc === 'carpet') return 'carpet-items'
      if (svc === 'oven') return 'oven-type'
      if (svc === 'after-build') return 'build-site'
      if (svc === 'commercial') return 'commercial-premises'
      if (svc === 'facilities') return 'fm-service'
      if (svc === 'other') return 'free-text'
      return 'property-type'
    case 'property-type': return 'bedrooms'
    case 'bedrooms': return 'bathrooms'
    case 'bathrooms':
      if (svc === 'airbnb') return 'airbnb-guests'
      if (svc === 'end-of-tenancy') return 'property-size'
      return 'property-size'
    case 'property-size': return 'condition'
    case 'condition': return 'occupancy'
    case 'occupancy':
      if (svc === 'end-of-tenancy') return 'eot-furnished'
      if (svc === 'home-cleaning') return 'frequency'
      return 'areas'
    case 'frequency': return 'areas'
    case 'areas': return 'extras'
    case 'extras': return 'special'
    case 'special': return 'postcode'
    // EOT
    case 'eot-furnished': return 'eot-extras'
    case 'eot-extras': return 'eot-dates'
    case 'eot-dates': return 'postcode'
    // Airbnb
    case 'airbnb-guests': return 'airbnb-turnover'
    case 'airbnb-turnover': return 'airbnb-services'
    case 'airbnb-services': return 'postcode'
    // Carpet
    case 'carpet-items': return 'carpet-stains'
    case 'carpet-stains': return 'postcode'
    // Oven
    case 'oven-type': return 'oven-extras'
    case 'oven-extras': return 'postcode'
    // After-build
    case 'build-site': return 'build-condition'
    case 'build-condition': return 'postcode'
    // Commercial
    case 'commercial-premises': return 'commercial-size'
    case 'commercial-size': return 'commercial-occupancy'
    case 'commercial-occupancy': return 'commercial-areas'
    case 'commercial-areas': return 'commercial-frequency'
    case 'commercial-frequency': return 'commercial-hours'
    case 'commercial-hours': return 'commercial-provider'
    case 'commercial-provider':
      return answers.hasProvider === 'Yes' ? 'commercial-improvements' : 'commercial-specialist'
    case 'commercial-improvements': return 'commercial-specialist'
    case 'commercial-specialist': return 'commercial-compliance'
    case 'commercial-compliance': return 'commercial-survey'
    case 'commercial-survey': return 'postcode'
    // FM
    case 'fm-service': return 'fm-site'
    case 'fm-site': return 'fm-requirement'
    case 'fm-requirement': return 'contact'
    // Common tail
    case 'postcode': return 'date'
    case 'date': return 'time-pref'
    case 'time-pref': return 'access'
    case 'access': return 'free-text'
    case 'free-text': return 'contact'
    case 'contact': return 'review'
    case 'review': return 'calculating'
    case 'calculating':
      if (svc === 'facilities' || svc === 'other' || svc === 'commercial' || svc === 'after-build') return 'quote-manual'
      if (answers.special?.some(s => ['Mould / specialist concern', 'Access restrictions'].includes(s))) return 'quote-manual'
      return 'quote-instant'
    default: return 'welcome'
  }
}

const BRANCH_TOTALS: Record<string, number> = {
  'home-cleaning': 13,
  'deep-cleaning': 12,
  'end-of-tenancy': 13,
  'airbnb': 11,
  'carpet': 7,
  'oven': 7,
  'after-build': 9,
  'commercial': 15,
  'facilities': 7,
  'other': 5,
}

const STEP_ORDER: Screen[] = [
  'service-type',
  'property-type', 'bedrooms', 'bathrooms', 'property-size', 'condition', 'occupancy',
  'frequency', 'areas', 'extras', 'special',
  'eot-empty', 'eot-furnished', 'eot-extras', 'eot-dates',
  'airbnb-guests', 'airbnb-turnover', 'airbnb-services',
  'carpet-items', 'carpet-stains',
  'oven-type', 'oven-extras',
  'build-site', 'build-condition',
  'commercial-premises', 'commercial-size', 'commercial-occupancy', 'commercial-areas',
  'commercial-frequency', 'commercial-hours', 'commercial-provider', 'commercial-improvements',
  'commercial-specialist', 'commercial-compliance', 'commercial-survey',
  'fm-service', 'fm-site', 'fm-requirement',
  'postcode', 'date', 'time-pref', 'access', 'free-text', 'contact', 'review',
]

export function getProgress(screen: Screen, answers: Answers): { current: number; total: number } | null {
  if (screen === 'welcome' || screen === 'calculating' || screen === 'quote-instant' || screen === 'quote-manual') return null
  const svc = answers.serviceType
  const total = svc ? (BRANCH_TOTALS[svc] ?? 10) : 10
  const idx = STEP_ORDER.indexOf(screen)
  const current = idx < 0 ? 1 : Math.min(idx + 1, total)
  return { current, total }
}

export function getServiceLabel(svc?: string): string {
  const map: Record<string, string> = {
    'home-cleaning': 'Home Cleaning',
    'end-of-tenancy': 'End of Tenancy',
    'deep-cleaning': 'Deep Cleaning',
    'airbnb': 'Airbnb / Holiday Let',
    'carpet': 'Carpet & Upholstery',
    'oven': 'Oven Cleaning',
    'after-build': 'After-Build Cleaning',
    'commercial': 'Office / Commercial',
    'facilities': 'Facilities Management',
    'other': 'Specialist Cleaning',
  }
  return svc ? (map[svc] ?? svc) : ''
}

export function requiresManualQuote(answers: Answers): boolean {
  const svc = answers.serviceType
  if (svc === 'facilities' || svc === 'other' || svc === 'commercial' || svc === 'after-build') return true
  if (answers.special?.some(s => ['Mould / specialist concern', 'Access restrictions'].includes(s))) return true
  return false
}

export function estimatePrice(answers: Answers): { line: string; price: number }[] {
  const lines: { line: string; price: number }[] = []
  const svc = answers.serviceType
  const beds = answers.bedrooms ?? 2
  const baths = answers.bathrooms ?? 1

  if (svc === 'end-of-tenancy') {
    const base = 150 + beds * 45 + baths * 30
    lines.push({ line: 'End of tenancy (base)', price: base })
    if (answers.eotExtras?.includes('Carpet cleaning')) lines.push({ line: 'Carpet cleaning', price: beds * 35 })
    if (answers.eotExtras?.includes('Oven cleaning')) lines.push({ line: 'Oven cleaning', price: 55 })
    if (answers.eotExtras?.includes('Fridge / freezer interior')) lines.push({ line: 'Fridge / freezer', price: 25 })
    if (answers.eotExtras?.includes('Inside cupboards')) lines.push({ line: 'Inside cupboards', price: 40 })
    if (answers.eotExtras?.includes('Interior windows')) lines.push({ line: 'Interior windows', price: 35 })
  } else if (svc === 'home-cleaning') {
    const base = 80 + beds * 20 + baths * 15
    lines.push({ line: 'Regular home clean (est.)', price: base })
  } else if (svc === 'deep-cleaning') {
    const base = 140 + beds * 35 + baths * 25
    lines.push({ line: 'Deep clean (base)', price: base })
    if (answers.extras?.includes('Oven cleaning')) lines.push({ line: 'Oven cleaning', price: 55 })
    if (answers.extras?.includes('Carpet cleaning')) lines.push({ line: 'Carpet cleaning', price: beds * 35 })
    if (answers.extras?.includes('Interior windows')) lines.push({ line: 'Interior windows', price: 35 })
  } else if (svc === 'airbnb') {
    const base = 75 + beds * 22
    lines.push({ line: 'Airbnb / holiday let clean', price: base })
    if (answers.airbnbServices?.includes('Linen / laundry')) lines.push({ line: 'Linen & laundry', price: beds * 12 })
    if (answers.airbnbServices?.includes('Consumable restocking')) lines.push({ line: 'Consumable restocking', price: 20 })
  } else if (svc === 'carpet') {
    const count = answers.carpetItems?.length ?? 1
    lines.push({ line: 'Carpet & upholstery clean', price: count * 65 })
    if (answers.carpetStainDetails?.includes('Pet odour treatment')) lines.push({ line: 'Pet odour treatment', price: 30 })
  } else if (svc === 'oven') {
    const base = answers.ovenType === 'Range cooker' ? 110 : answers.ovenType === 'Double oven' ? 90 : 65
    lines.push({ line: `Oven cleaning (${answers.ovenType ?? 'standard'})`, price: base })
    if (answers.ovenExtras?.includes('Hob cleaning')) lines.push({ line: 'Hob cleaning', price: 30 })
    if (answers.ovenExtras?.includes('Extractor fan cleaning')) lines.push({ line: 'Extractor fan', price: 35 })
  }

  return lines
}
