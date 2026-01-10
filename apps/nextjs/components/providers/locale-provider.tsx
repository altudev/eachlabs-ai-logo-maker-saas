"use client"

import { createContext, useContext, useState, useCallback, useMemo, useSyncExternalStore, useEffect } from "react"
import { NextIntlClientProvider } from "next-intl"
import { type Locale, defaultLocale, locales, LOCALE_STORAGE_KEY } from "@/lib/i18n/config"

import enMessages from "@/messages/en.json"
import trMessages from "@/messages/tr.json"

const messages: Record<Locale, typeof enMessages> = {
  en: enMessages,
  tr: trMessages,
}

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}

function getStoredLocale(): Locale {
  if (typeof window === "undefined") return defaultLocale
  const stored = localStorage.getItem(LOCALE_STORAGE_KEY)
  if (stored && locales.includes(stored as Locale)) {
    return stored as Locale
  }
  return defaultLocale
}

function subscribeToStorage(callback: () => void) {
  window.addEventListener("storage", callback)
  return () => window.removeEventListener("storage", callback)
}

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const storedLocale = useSyncExternalStore(
    subscribeToStorage,
    getStoredLocale,
    () => defaultLocale
  )
  const [locale, setLocaleState] = useState<Locale>(storedLocale)

  useEffect(() => {
    setLocaleState(storedLocale)
  }, [storedLocale])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(LOCALE_STORAGE_KEY, newLocale)
  }, [])

  const contextValue = useMemo(
    () => ({ locale, setLocale }),
    [locale, setLocale]
  )

  const currentMessages = messages[locale]

  return (
    <LocaleContext.Provider value={contextValue}>
      <NextIntlClientProvider
        locale={locale}
        messages={currentMessages}
        timeZone="UTC"
      >
        {children}
      </NextIntlClientProvider>
    </LocaleContext.Provider>
  )
}
