import type { Answers } from './types'

const STORAGE_KEY = 'xeniapure-quote-answers'
const EMPTY_JSON = '{}'

const listeners = new Set<() => void>()

function readRaw(): string {
  if (typeof window === 'undefined') return EMPTY_JSON
  try {
    return window.sessionStorage.getItem(STORAGE_KEY) ?? EMPTY_JSON
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
    window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(answers))
  } catch {
    // sessionStorage unavailable (private browsing, quota) — fail silently, in-memory state still works for this page.
  }
  listeners.forEach(l => l())
}

export function clearAnswers(): void {
  if (typeof window === 'undefined') return
  try {
    window.sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    // ignore
  }
  listeners.forEach(l => l())
}
