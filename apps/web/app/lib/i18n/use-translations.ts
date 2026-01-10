import { useContext } from "react"
import { LocaleContext } from "~/components/providers/locale-provider"
import esMessages from "./messages/es.json"
import enMessages from "./messages/en.json"
import trMessages from "./messages/tr.json"
import type { Locale } from "./config"

type Messages = typeof enMessages

const messages: Record<Locale, Messages> = {
  en: enMessages,
  tr: trMessages,
  es: esMessages,
}

type NestedKeyOf<T, K extends string = ""> = T extends object
  ? {
    [P in keyof T & string]: T[P] extends object
    ? NestedKeyOf<T[P], K extends "" ? P : `${K}.${P}`>
    : K extends ""
    ? P
    : `${K}.${P}`
  }[keyof T & string]
  : never

/**
 * Get a nested value from an object using a dot-separated path
 */
function getNestedValue(obj: unknown, path: string): string {
  const keys = path.split(".")
  let current: unknown = obj

  for (const key of keys) {
    if (current === null || current === undefined) {
      return path
    }
    current = (current as Record<string, unknown>)[key]
  }

  return typeof current === "string" ? current : path
}

/**
 * Custom useTranslations hook that mimics next-intl's API
 * @param namespace - The namespace to use for translations (e.g., "header", "hero")
 * @returns A function that returns the translated string for the given key
 */
export function useTranslations<N extends keyof Messages>(namespace: N) {
  const context = useContext(LocaleContext)

  if (!context) {
    throw new Error("useTranslations must be used within a LocaleProvider")
  }

  const { locale } = context
  const currentMessages = messages[locale]
  const namespaceMessages = currentMessages[namespace]

  return function t(key: string): string {
    return getNestedValue(namespaceMessages, key)
  }
}
