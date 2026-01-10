export const locales = ["en", "tr", "es"] as const
export type Locale = (typeof locales)[number]

export const defaultLocale: Locale = "en"

export const localeNames: Record<Locale, string> = {
  en: "English",
  tr: "Turkce",
  es: "Espanol",
}

export const LOCALE_STORAGE_KEY = "locale"
