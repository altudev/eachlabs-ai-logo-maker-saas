import React from "react"
import type { Route } from "./+types/privacy-policy"
import { useTranslations } from "~/lib/i18n/use-translations"
import { LegalPageLayout, LegalSection } from "~/components/legal/LegalPageLayout"
import { Shield, Eye, Trash, Lock } from "lucide-react"
import { cn } from "~/lib/utils"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Privacy Policy - LogoLoco" },
    {
      name: "description",
      content: "Privacy Policy for LogoLoco AI Logo Generator",
    },
  ]
}

export default function PrivacyPolicy() {
  const t = useTranslations("privacyPolicy")
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <LegalPageLayout>
      <div
        className={cn(
          "transition-all duration-700",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4 flex items-center gap-3">
            <Shield className="h-10 w-10 text-primary" />
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("lastUpdated")}</p>
        </div>

        <LegalSection title={t("sections.introduction.title")} delay={100}>
          <p>{t("sections.introduction.content")}</p>
        </LegalSection>

        <LegalSection
          title={
            <span className="flex items-center gap-2">
              <Eye className="h-6 w-6 text-primary" />
              {t("sections.dataCollection.title")}
            </span>
          }
          delay={200}
        >
          <p>{t("sections.dataCollection.content")}</p>
          <ul>
            <li>{t("sections.dataCollection.items.name")}</li>
            <li>{t("sections.dataCollection.items.email")}</li>
            <li>{t("sections.dataCollection.items.generations")}</li>
            <li>{t("sections.dataCollection.items.usage")}</li>
          </ul>
        </LegalSection>

        <LegalSection
          title={
            <span className="flex items-center gap-2">
              <Lock className="h-6 w-6 text-primary" />
              {t("sections.dataUsage.title")}
            </span>
          }
          delay={300}
        >
          <p>{t("sections.dataUsage.content")}</p>
        </LegalSection>

        <LegalSection
          title={
            <span className="flex items-center gap-2">
              <Trash className="h-6 w-6 text-primary" />
              {t("sections.dataRetention.title")}
            </span>
          }
          delay={400}
        >
          <p>{t("sections.dataRetention.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.yourRights.title")} delay={500}>
          <p>{t("sections.yourRights.content")}</p>
          <ul>
            <li>{t("sections.yourRights.items.access")}</li>
            <li>{t("sections.yourRights.items.correction")}</li>
            <li>{t("sections.yourRights.items.deletion")}</li>
            <li>{t("sections.yourRights.items.export")}</li>
          </ul>
        </LegalSection>

        <LegalSection title={t("sections.security.title")} delay={600}>
          <p>{t("sections.security.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.cookies.title")} delay={700}>
          <p>{t("sections.cookies.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.children.title")} delay={800}>
          <p>{t("sections.children.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.international.title")} delay={900}>
          <p>{t("sections.international.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.changes.title")} delay={1000}>
          <p>{t("sections.changes.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.contact.title")} delay={1100}>
          <p>
            {t("sections.contact.content")}
            <a href="/contact" className="text-primary hover:underline ml-1">
              {t("sections.contact.link")}
            </a>
          </p>
        </LegalSection>
      </div>
    </LegalPageLayout>
  )
}
