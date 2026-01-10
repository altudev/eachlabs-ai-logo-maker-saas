import { useState, useEffect, useSyncExternalStore, useContext } from "react"
import { Link } from "react-router"
import { Moon, Sun, Menu, X, Sparkles } from "lucide-react"
import { Button } from "~/components/ui/button"
import { LanguageSwitcher } from "~/components/ui/language-switcher"
import { useTranslations } from "~/lib/i18n/use-translations"
import { ThemeContext } from "~/lib/theme-context"
import { cn } from "~/lib/utils"

function useIsMounted() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  )
}

export function Header() {
  const { theme, setTheme } = useContext(ThemeContext)
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const mounted = useIsMounted()
  const t = useTranslations("header")

  const navLinks = [
    { href: "#features", label: t("features") },
    { href: "#showcase", label: t("showcase") },
    { href: "#how-it-works", label: t("howItWorks") },
    { href: "/history", label: t("history"), isRoute: true },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }

    handleScroll()
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-lg border-b border-border/50 shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="container mx-auto px-4">
        <nav className="flex items-center justify-between h-16 md:h-20">
          {/* Logo */}
          <Link
            to="/"
            className="flex items-center gap-2 font-bold text-xl tracking-tight"
          >
            <div className="relative">
              <Sparkles className="h-6 w-6 text-primary" />
              <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
            </div>
            <span className="hidden sm:inline">LogoLoco</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
                >
                  {link.label}
                </a>
              )
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center gap-2">
            {/* Language switcher */}
            <LanguageSwitcher />

            {/* Theme toggle */}
            {mounted && theme ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleTheme}
                className="relative overflow-hidden"
              >
                <Sun
                  className={cn(
                    "h-5 w-5 transition-all duration-300",
                    theme === "dark"
                      ? "rotate-90 scale-0 opacity-0"
                      : "rotate-0 scale-100 opacity-100"
                  )}
                />
                <Moon
                  className={cn(
                    "absolute h-5 w-5 transition-all duration-300",
                    theme === "dark"
                      ? "rotate-0 scale-100 opacity-100"
                      : "-rotate-90 scale-0 opacity-0"
                  )}
                />
                <span className="sr-only">{t("toggleTheme")}</span>
              </Button>
            ) : (
              <div className="h-10 w-10" />
            )}

            {/* CTA Button */}
            <Button asChild className="hidden sm:inline-flex">
              <Link to="/create">{t("createLogo")}</Link>
            </Button>

            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
              <span className="sr-only">{t("toggleMenu")}</span>
            </Button>
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={cn(
            "md:hidden overflow-hidden transition-all duration-300",
            mobileMenuOpen ? "max-h-64 pb-4" : "max-h-0"
          )}
        >
          <div className="flex flex-col gap-2 pt-2">
            {navLinks.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.href}
                  to={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.href}
                  href={link.href}
                  className="px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-colors"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </a>
              )
            )}
            <Button asChild className="mt-2">
              <Link to="/create">{t("createLogo")}</Link>
            </Button>
          </div>
        </div>
      </div>

      {/* Dither border */}
      {isScrolled && <div className="dither-border-halftone opacity-30" />}
    </header>
  )
}
