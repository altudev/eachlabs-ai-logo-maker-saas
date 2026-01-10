"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight, Play } from "lucide-react"
import { Button } from "@/components/ui/button"
import { LogoCarousel } from "@/components/landing/LogoCarousel"
import { cn } from "@/lib/utils"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)
  const t = useTranslations("hero")

  useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), 100)
    return () => clearTimeout(timer)
  }, [])

  return (
    <section
      className="relative min-h-screen flex items-center overflow-hidden pt-20"
    >
      {/* Background Gradients */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-purple-900/20 via-background to-background" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Text Content */}
          <div className="space-y-8 text-center lg:text-left pt-10 lg:pt-0">
            {/* Badge */}
            <div
              className={cn(
                "inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm font-medium transition-all duration-700",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
              </span>
              {t("badge")}
            </div>

            {/* Heading */}
            <h1
              className={cn(
                "text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight transition-all duration-700 delay-100",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <span className="block">{t("title1")}</span>
              <span className="block bg-gradient-to-r from-primary via-purple-500 to-pink-500 bg-clip-text text-transparent">
                {t("title2")}
              </span>
            </h1>

            {/* Description */}
            <p
              className={cn(
                "text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 transition-all duration-700 delay-200",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {t("description")}
            </p>

            {/* CTA Buttons */}
            <div
              className={cn(
                "flex flex-col sm:flex-row gap-4 justify-center lg:justify-start transition-all duration-700 delay-300",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              <Button asChild className="h-12 px-8 text-base shadow-[0_0_20px_rgba(168,85,247,0.5)] hover:shadow-[0_0_30px_rgba(168,85,247,0.7)] transition-shadow">
                <Link href="/create">
                  {t("startCreating")}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>

              <Button variant="outline" className="h-12 px-8 text-base" asChild>
                <Link href="#how-it-works">
                  <Play className="mr-2 h-4 w-4" />
                  {t("seeHowItWorks")}
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div
              className={cn(
                "flex flex-wrap gap-8 justify-center lg:justify-start pt-4 transition-all duration-700 delay-400",
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              )}
            >
              {[
                { value: "10K+", label: t("stats.logosCreated") },
                { value: "<60s", label: t("stats.generationTime") },
                { value: "3", label: t("stats.aiModels") },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Logo Carousel Area */}
          <div
            className={cn(
              "h-[400px] md:h-[500px] lg:h-[600px] w-full relative transition-opacity duration-1000 delay-500 overflow-hidden",
              isVisible ? "opacity-100" : "opacity-0"
            )}
          >
            <LogoCarousel />

            {/* Ambient glow effect */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 bg-primary/10 blur-[120px] rounded-full -z-10" />
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div
        className={cn(
          "absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-700 delay-500",
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        )}
      >
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <span className="text-xs uppercase tracking-wider">{t("scroll")}</span>
          <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex justify-center pt-2">
            <div className="w-1 h-2 rounded-full bg-muted-foreground animate-bounce" />
          </div>
        </div>
      </div>
    </section>
  )
}
