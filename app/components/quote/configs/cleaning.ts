// The "cleaning" industry config — wraps the existing registry.tsx/
// flow.ts/schemas.ts (built for XeniaPure, now generic across any cleaning
// company) behind the shared IndustryConfig interface. A second industry
// is a sibling file here implementing the same interface, not a change to
// QuizStepRunner or any step component.
import { stepRegistry } from '../registry'
import { getNextScreen, getProgress, getServiceLabel, requiresManualQuote, estimatePrice } from '../flow'
import type { Screen, Answers } from '../types'
import type { IndustryConfig } from './types'

export const cleaningConfig: IndustryConfig = {
  key: 'cleaning',
  initialStep: 'service-type',
  stepRegistry,
  getNextScreen: (current, answers) => getNextScreen(current as Screen, answers as Answers),
  getProgress: (screen, answers) => getProgress(screen as Screen, answers as Answers),
  getServiceLabel: (serviceType) => getServiceLabel(serviceType as Answers['serviceType']),
  requiresManualQuote: (answers) => requiresManualQuote(answers as Answers),
  estimatePrice: (answers) => estimatePrice(answers as Answers),
}
