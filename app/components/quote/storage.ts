import type { Answers } from './types'

const EMPTY_JSON = '{}'

// Scoped per company (the URL's first segment, /<slug>/...) rather than
// one global key — otherwise a visitor who starts Company A's quote, then
// opens Company B's link in the same tab, would see Company A's answers
// (including their name/email) bleed into Company B's form.
function storageKey(): string {
  if (typeof window === 'undefined') return 'quote-answers:server'
  const slug = window.location.pathname.split('/')[1] || 'unknown'
  return `quote-answers:${slug}`
}

const listeners = new Set<() => void>()

function readRaw(): string {
  if (typeof window === 'undefined') return EMPTY_JSON
  try {
    return window.sessionStorage.getItem(storageKey()) ?? EMPTY_JSON
  } catch {
    return EMPTY_JSON
  }
}

export function subscribeAnswers(callback: () => void): () => void {
  listeners.add(callback)
  return () => listeners.delete(callback)
}

export function getAnswersSnapshot(): string {
  return readRaw()
}

export function getServerAnswersSnapshot(): string {
  return EMPTY_JSON
}

export function parseAnswers(json: string): Answers {
  try {
    return JSON.parse(json) as Answers
  } catch {
    return {}
  }
}

export function saveAnswers(answers: Answers): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.setItem(storageKey(), JSON.stringify(answers))
  } catch {
    // sessionStorage unavailable (private browsing, quota) — fail silently, in-memory state still works for this page.
  }
  listeners.forEach(l => l())
}

export function clearAnswers(): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(storageKey())
  } catch {
    // ignore
  }
  listeners.forEach(l => l())
}
