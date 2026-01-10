import type { Route } from "./+types/settings"
import { useTranslations } from "~/lib/i18n/use-translations"
import { Header, Footer } from "~/components/landing"
import { Settings as SettingsIcon, FileText, Scale, RefreshCw, Mail, User } from "lucide-react"
import { Button } from "~/components/ui/button"
import { cn } from "~/lib/utils"
import { useState, useEffect } from "react"
import { Link } from "react-router"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings - LogoLoco" },
    {
      name: "description",
      content: "Manage your LogoLoco account settings",
    },
  ]
}

export default function Settings() {
  const t = useTranslations("settings")
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div
            className={cn(
              "transition-all duration-700",
              isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            )}
          >
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
                <SettingsIcon className="h-10 w-10 text-primary" />
                {t("title")}
              </h1>
              <p className="text-muted-foreground">{t("description")}</p>
            </div>

            <div className="grid gap-6">
              {/* Account Section */}
              <section className="p-6 rounded-lg border border-border/50 bg-muted/30">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  {t("account.title")}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("account.description")}
                </p>
                <div className="flex gap-3">
                  <Button variant="outline" size="sm">
                    {t("account.editProfile")}
                  </Button>
                  <Button variant="outline" size="sm">
                    {t("account.changePassword")}
                  </Button>
                </div>
              </section>

              {/* Legal Section */}
              <section className="p-6 rounded-lg border border-border/50 bg-muted/30">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  {t("legal.title")}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("legal.description")}
                </p>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <Button
                    asChild
                    variant="outline"
                    className="justify-start h-auto py-3 px-4"
                  >
                    <Link to="/privacy-policy">
                      <FileText className="h-4 w-4 mr-2 shrink-0" />
                      <span className="text-left">
                        <div className="font-medium">{t("legal.links.privacy")}</div>
                        <div className="text-xs text-muted-foreground">
                          {t("legal.links.privacyDesc")}
                        </div>
                      </span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="justify-start h-auto py-3 px-4"
                  >
                    <Link to="/terms-of-use">
                      <Scale className="h-4 w-4 mr-2 shrink-0" />
                      <span className="text-left">
                        <div className="font-medium">{t("legal.links.terms")}</div>
                        <div className="text-xs text-muted-foreground">
                          {t("legal.links.termsDesc")}
                        </div>
                      </span>
                    </Link>
                  </Button>

                  <Button
                    asChild
                    variant="outline"
                    className="justify-start h-auto py-3 px-4"
                  >
                    <Link to="/refund-policy">
                      <RefreshCw className="h-4 w-4 mr-2 shrink-0" />
                      <span className="text-left">
                        <div className="font-medium">{t("legal.links.refund")}</div>
                        <div className="text-xs text-muted-foreground">
                          {t("legal.links.refundDesc")}
                        </div>
                      </span>
                    </Link>
                  </Button>
                </div>
              </section>

              {/* Support Section */}
              <section className="p-6 rounded-lg border border-border/50 bg-muted/30">
                <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                  <Mail className="h-5 w-5 text-primary" />
                  {t("support.title")}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("support.description")}
                </p>
                <Button asChild variant="outline">
                  <Link to="/contact">
                    <Mail className="h-4 w-4 mr-2" />
                    {t("support.contactButton")}
                  </Link>
                </Button>
              </section>

              {/* Danger Zone */}
              <section className="p-6 rounded-lg border border-destructive/50 bg-destructive/5">
                <h2 className="text-xl font-semibold mb-4 text-destructive">
                  {t("danger.title")}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {t("danger.description")}
                </p>
                <Button variant="destructive" size="sm">
                  {t("danger.deleteButton")}
                </Button>
              </section>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
