import type { Context } from "hono"
import type { SupportedLocale, TranslationKey, InterpolationParams } from "./types"
import { DEFAULT_LOCALE } from "./types"

// Import all translation files
import enErrors from "./locales/en/errors.json"
import enCredits from "./locales/en/credits.json"
import enRateLimit from "./locales/en/rate-limit.json"
import enValidation from "./locales/en/validation.json"

import trErrors from "./locales/tr/errors.json"
import trCredits from "./locales/tr/credits.json"
import trRateLimit from "./locales/tr/rate-limit.json"
import trValidation from "./locales/tr/validation.json"

import esErrors from "./locales/es/errors.json"
import esCredits from "./locales/es/credits.json"
import esRateLimit from "./locales/es/rate-limit.json"
import esValidation from "./locales/es/validation.json"

// Translation store indexed by locale and domain
const translations: Record<SupportedLocale, Record<string, Record<string, string>>> = {
  en: {
    errors: enErrors,
    credits: enCredits,
    "rate-limit": enRateLimit,
    validation: enValidation,
  },
  tr: {
    errors: trErrors,
    credits: trCredits,
    "rate-limit": trRateLimit,
    validation: trValidation,
  },
  es: {
    errors: esErrors,
    credits: esCredits,
    "rate-limit": esRateLimit,
    validation: esValidation,
  },
}

/**
 * Interpolate variables in a translation string
 * Example: "Hello {name}" with { name: "World" } -> "Hello World"
 */
function interpolate(template: string, params?: InterpolationParams): string {
  if (!params) return template

  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match
  })
}

/**
 * Get a translation by key with optional interpolation
 * Falls back to English if the key is not found in the target locale
 */
function getTranslation(
  locale: SupportedLocale,
  key: TranslationKey,
  params?: InterpolationParams
): string {
  const [domain, messageKey] = key.split(".") as [string, string]

  // Try target locale first
  const localeTranslations = translations[locale]?.[domain]
  if (localeTranslations?.[messageKey]) {
    return interpolate(localeTranslations[messageKey], params)
  }

  // Fallback to English
  const fallbackTranslations = translations[DEFAULT_LOCALE]?.[domain]
  if (fallbackTranslations?.[messageKey]) {
    return interpolate(fallbackTranslations[messageKey], params)
  }

  // Last resort: return the key itself
  console.warn(`Missing translation: ${key}`)
  return key
}

/**
 * Main translation function - gets locale from Hono context
 *
 * Usage in routes:
 *   const message = t(c, 'errors.authRequired')
 *   const message = t(c, 'credits.insufficientCreditsDetail', { balance: 5, required: 10 })
 */
export function t(
  c: Context,
  key: TranslationKey,
  params?: InterpolationParams
): string {
  const locale = c.get("locale") ?? DEFAULT_LOCALE
  return getTranslation(locale, key, params)
}

/**
 * Direct translation function without context (for rate limiter config)
 * Useful when context is not available during initialization
 */
export function translate(
  locale: SupportedLocale,
  key: TranslationKey,
  params?: InterpolationParams
): string {
  return getTranslation(locale, key, params)
}

/**
 * Get the current locale from context
 */
export function getLocale(c: Context): SupportedLocale {
  return c.get("locale") ?? DEFAULT_LOCALE
}
