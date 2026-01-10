import { Button } from "~/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu"
import { useLocale } from "~/components/providers/locale-provider"
import { useTranslations } from "~/lib/i18n/use-translations"
import { locales } from "~/lib/i18n/config"
import { cn } from "~/lib/utils"

const LOCALE_FLAGS: Record<string, { code: string; flag: string; label: string }> = {
  en: { code: "EN", flag: "/flags/us.svg", label: "English" },
  tr: { code: "TR", flag: "/flags/tr.svg", label: "Türkçe" },
  es: { code: "ES", flag: "/flags/es.svg", label: "Español" },
  ru: { code: "RU", flag: "/flags/ru.svg", label: "Русский" },
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useLocale()
  const t = useTranslations("languageSwitcher")

  const currentFlag = LOCALE_FLAGS[locale]

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 gap-2 px-2">
          {currentFlag && (
            <>
              <img
                src={currentFlag.flag}
                alt={currentFlag.label}
                className="h-4 w-4 rounded-sm object-cover"
              />
              <span className="text-sm font-medium">{currentFlag.code}</span>
            </>
          )}
          <span className="sr-only">{t("label")}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {locales.map((loc) => {
          const info = LOCALE_FLAGS[loc]
          return (
            <DropdownMenuItem
              key={loc}
              onClick={() => setLocale(loc)}
              className={cn("cursor-pointer gap-2", locale === loc && "bg-accent")}
            >
              {info && (
                <>
                  <img
                    src={info.flag}
                    alt={info.label}
                    className="h-4 w-4 rounded-sm object-cover"
                  />
                  <span>{info.code}</span>
                </>
              )}
            </DropdownMenuItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
