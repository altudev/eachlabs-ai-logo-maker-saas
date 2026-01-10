import React from "react"
import type { Route } from "./+types/terms-of-use"
import { useTranslations } from "~/lib/i18n/use-translations"
import { LegalPageLayout, LegalSection } from "~/components/legal/LegalPageLayout"
import { FileText, AlertCircle, Users, Ban } from "lucide-react"
import { cn } from "~/lib/utils"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Terms of Use - LogoLoco" },
    {
      name: "description",
      content: "Terms of Service for LogoLoco AI Logo Generator",
    },
  ]
}

export default function TermsOfUse() {
  const t = useTranslations("termsOfUse")
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
            <FileText className="h-10 w-10 text-primary" />
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("lastUpdated")}</p>
        </div>

        <LegalSection title={t("sections.acceptance.title")} delay={100}>
          <p>{t("sections.acceptance.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.account.title")} delay={200}>
          <p>{t("sections.account.content")}</p>
          <ul>
            <li>{t("sections.account.items.accuracy")}</li>
            <li>{t("sections.account.items.security")}</li>
            <li>{t("sections.account.items.notification")}</li>
          </ul>
        </LegalSection>

        <LegalSection
          title={
            <span className="flex items-center gap-2">
              <AlertCircle className="h-6 w-6 text-primary" />
              {t("sections.credits.title")}
            </span>
          }
          delay={300}
        >
          <p>{t("sections.credits.content")}</p>
          <ul>
            <li>{t("sections.credits.items.nonRefundable")}</li>
            <li>{t("sections.credits.items.nonTransferable")}</li>
            <li>{t("sections.credits.items.expiration")}</li>
          </ul>
        </LegalSection>

        <LegalSection title={t("sections.generations.title")} delay={400}>
          <p>{t("sections.generations.content")}</p>
          <ul>
            <li>{t("sections.generations.items.quantity")}</li>
            <li>{t("sections.generations.items.commercial")}</li>
            <li>{t("sections.generations.items.ownership")}</li>
            <li>{t("sections.generations.items.variation")}</li>
          </ul>
        </LegalSection>

        <LegalSection
          title={
            <span className="flex items-center gap-2">
              <Users className="h-6 w-6 text-primary" />
              {t("sections.userConduct.title")}
            </span>
          }
          delay={500}
        >
          <p>{t("sections.userConduct.content")}</p>
          <ul>
            <li>{t("sections.userConduct.items.illegal")}</li>
            <li>{t("sections.userConduct.items.infringement")}</li>
            <li>{t("sections.userConduct.items.abuse")}</li>
          </ul>
        </LegalSection>

        <LegalSection
          title={
            <span className="flex items-center gap-2">
              <Ban className="h-6 w-6 text-primary" />
              {t("sections.prohibitedUses.title")}
            </span>
          }
          delay={600}
        >
          <p>{t("sections.prohibitedUses.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.intellectual.title")} delay={700}>
          <p>{t("sections.intellectual.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.disclaimer.title")} delay={800}>
          <p>{t("sections.disclaimer.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.limitation.title")} delay={900}>
          <p>{t("sections.limitation.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.termination.title")} delay={1000}>
          <p>{t("sections.termination.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.governing.title")} delay={1100}>
          <p>{t("sections.governing.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.changes.title")} delay={1200}>
          <p>{t("sections.changes.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.contact.title")} delay={1300}>
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
