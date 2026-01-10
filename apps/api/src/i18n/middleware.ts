import type { Context, Next } from "hono"
import { type SupportedLocale, SUPPORTED_LOCALES, DEFAULT_LOCALE } from "./types"

// Extend Hono's context variables type
declare module "hono" {
  interface ContextVariableMap {
    locale: SupportedLocale
  }
}

/**
 * Parse Accept-Language header and return the best matching locale
 * Example: "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7" -> "tr"
 */
function parseAcceptLanguage(header: string | undefined): SupportedLocale | null {
  if (!header) return null

  const languages = header
    .split(",")
    .map((lang) => {
      const [code, qValue] = lang.trim().split(";q=")
      return {
        code: code.split("-")[0].toLowerCase(), // Extract primary language tag
        quality: qValue ? Number.parseFloat(qValue) : 1.0,
      }
    })
    .sort((a, b) => b.quality - a.quality)

  for (const { code } of languages) {
    if (SUPPORTED_LOCALES.includes(code as SupportedLocale)) {
      return code as SupportedLocale
    }
  }

  return null
}

/**
 * Middleware to detect and set the locale on the context
 *
 * Priority:
 * 1. X-Language header (explicit override)
 * 2. Accept-Language header (browser preference)
 * 3. Default locale (en)
 */
export function i18nMiddleware() {
  return async (c: Context, next: Next) => {
    // Priority 1: Check X-Language header for explicit override
    const xLanguage = c.req.header("X-Language")?.toLowerCase()
    if (xLanguage && SUPPORTED_LOCALES.includes(xLanguage as SupportedLocale)) {
      c.set("locale", xLanguage as SupportedLocale)
      await next()
      return
    }

    // Priority 2: Parse Accept-Language header
    const acceptLanguage = c.req.header("Accept-Language")
    const parsedLocale = parseAcceptLanguage(acceptLanguage)
    if (parsedLocale) {
      c.set("locale", parsedLocale)
      await next()
      return
    }

    // Priority 3: Default to English
    c.set("locale", DEFAULT_LOCALE)
    await next()
  }
}
