"use client"

import { QueryProvider } from "./query-provider"
import { ThemeProvider } from "./ThemeProvider"
import { LocaleProvider } from "./locale-provider"

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryProvider>
      <LocaleProvider>
        <ThemeProvider>{children}</ThemeProvider>
      </LocaleProvider>
    </QueryProvider>
  )
}
