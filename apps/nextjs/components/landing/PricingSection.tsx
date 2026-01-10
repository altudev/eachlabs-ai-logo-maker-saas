"use client"

import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { cn } from "@/lib/utils"

const CHECKMARK_ICON_BLUE = "/assets/figma/66cbec02adae279d4479c11bcbca347dd4db4a00.svg"
const CHECKMARK_ICON_GREY = "/assets/figma/3608cacbefa4cfb945effcfa84e4757fbfb7a87b.svg"

type CreditPackageKey = "starter" | "maker" | "team" | "studio"

interface CreditPackage {
  key: CreditPackageKey
  highlight?: boolean
  badgeKey?: string
  ctaKey?: string
}

const creditPackages: CreditPackage[] = [
  {
    key: "starter",
    badgeKey: "packages.starter.badge",
    ctaKey: "actions.useCredit",
  },
  {
    key: "maker",
  },
  {
    key: "team",
    highlight: true,
    badgeKey: "packages.team.badge",
  },
  {
    key: "studio",
  },
]

const featureKeys = ["features.perRun", "features.commercial", "features.png", "features.retention"] as const

export function PricingSection() {
  const t = useTranslations("pricing")

  return (
    <section className="py-24 relative overflow-hidden bg-white dark:bg-gray-950" id="pricing">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-4xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium text-primary/80">
            {t("badge")}
          </div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold tracking-tight text-[#1a1a1a] dark:text-white"
          >
            {t("title")}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-[#4f4f4f] dark:text-gray-400 max-w-2xl mx-auto"
          >
            {t("description")}
          </motion.p>
          <p className="text-sm text-primary font-medium">{t("note")}</p>
        </div>

        {/* Feature list */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
          {featureKeys.map((key, index) => (
            <motion.div
              key={key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-muted/60 border border-border/60"
            >
              <img
                src={CHECKMARK_ICON_GREY}
                alt="check"
                className="w-5 h-5"
              />
              <span className="text-sm font-medium text-[#1a1a1a] dark:text-gray-200">
                {t(key)}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Packages Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto items-start">
          {creditPackages.map((pkg, index) => {
            const name = t(`packages.${pkg.key}.name`)
            const price = t(`packages.${pkg.key}.price`)
            const credits = t(`packages.${pkg.key}.credits`)
            const description = t(`packages.${pkg.key}.description`)
            const badge = pkg.badgeKey ? t(pkg.badgeKey) : null
            const buttonText = pkg.ctaKey ? t(pkg.ctaKey) : t("actions.buyCredits")

            return (
              <motion.div
                key={pkg.key}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.08 }}
                className={cn(
                  "relative rounded-[20px] flex flex-col h-full bg-white dark:bg-gray-950 border shadow-lg",
                  pkg.highlight
                    ? "border-2 border-primary/70 shadow-xl"
                    : "border-gray-200 dark:border-gray-800 p-8"
                )}
              >
                {pkg.highlight && (
                  <div className="absolute -top-3 right-4 bg-primary text-white text-[11px] font-bold tracking-[0.08em] px-3 py-1 rounded-full">
                    {badge}
                  </div>
                )}

                <div className={cn("flex flex-col h-full", pkg.highlight && "p-8 pt-10")}>
                  <div className="mb-6">
                    <h3 className="text-xl font-bold mb-2 text-[#1a1a1a] dark:text-white">{name}</h3>
                    <p className="text-[#4f4f4f] dark:text-gray-400 text-sm mb-4">
                      {description}
                    </p>

                    <div className="flex items-baseline gap-2">
                      <span className="text-4xl font-bold tracking-tight text-[#1a1a1a] dark:text-white">
                        {price}
                      </span>
                      <span className="text-sm font-medium text-[#1a1a1a] dark:text-gray-300">
                        {credits}
                      </span>
                    </div>
                    <div className="mt-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.08em] text-primary">
                      {t("oneTime")}
                    </div>
                  </div>

                  <div className="space-y-4 flex-grow mb-8">
                    <div className="flex items-start gap-3">
                      <div className="shrink-0 pt-0.5">
                        <img
                          src={pkg.highlight ? CHECKMARK_ICON_BLUE : CHECKMARK_ICON_GREY}
                          alt="check"
                          className="w-5 h-5"
                        />
                      </div>
                      <span className="text-[15px] text-[#4f4f4f] dark:text-gray-300">
                        {t("featureReminder")}
                      </span>
                    </div>
                  </div>

                  <button
                    className={cn(
                      "w-full py-3.5 rounded-full text-[16px] font-medium transition-all duration-300",
                      "bg-[#1a1a1a] dark:bg-white text-white dark:text-[#1a1a1a] hover:opacity-90"
                    )}
                  >
                    {buttonText}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
