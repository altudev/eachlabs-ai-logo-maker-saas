import { createContext } from "react"

export interface ThemeContextType {
  theme: string
  setTheme: (theme: string) => void
}

export const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  setTheme: () => {},
})
