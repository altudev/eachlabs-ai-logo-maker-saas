import React from "react"
import type { Route } from "./+types/refund-policy"
import { useTranslations } from "~/lib/i18n/use-translations"
import { LegalPageLayout, LegalSection } from "~/components/legal/LegalPageLayout"
import { RefreshCw, AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import { cn } from "~/lib/utils"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Refund Policy - LogoLoco" },
    {
      name: "description",
      content: "Refund Policy for LogoLoco AI Logo Generator",
    },
  ]
}

export default function RefundPolicy() {
  const t = useTranslations("refundPolicy")
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
            <RefreshCw className="h-10 w-10 text-primary" />
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("lastUpdated")}</p>
        </div>

        <LegalSection title={t("sections.overview.title")} delay={100}>
          <p>{t("sections.overview.content")}</p>
        </LegalSection>

        <LegalSection
          title={
            <span className="flex items-center gap-2">
              <XCircle className="h-6 w-6 text-destructive" />
              {t("sections.nonRefundable.title")}
            </span>
          }
          delay={200}
        >
          <p>{t("sections.nonRefundable.content")}</p>
          <ul>
            <li>{t("sections.nonRefundable.items.digital")}</li>
            <li>{t("sections.nonRefundable.items.consumed")}</li>
            <li>{t("sections.nonRefundable.items.partial")}</li>
          </ul>
        </LegalSection>

        <LegalSection
          title={
            <span className="flex items-center gap-2">
              <AlertTriangle className="h-6 w-6 text-primary" />
              {t("sections.exceptions.title")}
            </span>
          }
          delay={300}
        >
          <p>{t("sections.exceptions.content")}</p>
          <ul>
            <li>{t("sections.exceptions.items.technical")}</li>
            <li>{t("sections.exceptions.items.billing")}</li>
            <li>{t("sections.exceptions.items.unauthorized")}</li>
          </ul>
        </LegalSection>

        <LegalSection
          title={
            <span className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-primary" />
              {t("sections.freeCredit.title")}
            </span>
          }
          delay={400}
        >
          <p>{t("sections.freeCredit.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.requests.title")} delay={500}>
          <p>{t("sections.requests.content")}</p>
          <p>
            {t("sections.requests.contact")}
            <a href="/contact" className="text-primary hover:underline ml-1">
              {t("sections.requests.link")}
            </a>
          </p>
        </LegalSection>

        <LegalSection title={t("sections.processing.title")} delay={600}>
          <p>{t("sections.processing.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.partial.title")} delay={700}>
          <p>{t("sections.partial.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.changes.title")} delay={800}>
          <p>{t("sections.changes.content")}</p>
        </LegalSection>

        <LegalSection title={t("sections.contact.title")} delay={900}>
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
