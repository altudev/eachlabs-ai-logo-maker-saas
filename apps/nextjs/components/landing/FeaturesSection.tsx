"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { Sparkles, Layers, Download, Palette, Zap, Shield, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const featureIcons = [Sparkles, Layers, Download, Palette, Zap, Shield] as const
const featureKeys = ["aiPowered", "multipleModels", "instantDownloads", "colorIntelligence", "lightningFast", "commercialReady"] as const

interface FeatureCardProps {
  icon: LucideIcon
  title: string
  description: string
  index: number
  isVisible: boolean
}

function FeatureCard({ icon: Icon, title, description, index, isVisible }: FeatureCardProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  const cardRef = useRef<HTMLDivElement>(null)

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    setMousePosition({ x, y })
  }

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "group relative cursor-pointer",
        isVisible ? "opacity-100" : "opacity-0"
      )}
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      onMouseMove={handleMouseMove}
      style={{ perspective: "1000px" }}
    >
      <motion.div
        className={cn(
          "relative p-6 md:p-8 rounded-2xl h-full",
          "bg-foreground/[0.02] dark:bg-white/[0.02]",
          "border border-foreground/[0.05]",
          "transition-colors duration-300",
          isHovered && "bg-foreground/[0.04] border-foreground/[0.1]"
        )}
        animate={{
          rotateX: isHovered ? mousePosition.y * -8 : 0,
          rotateY: isHovered ? mousePosition.x * 8 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Gradient spotlight effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: isHovered ? 0.1 : 0,
            background: `radial-gradient(circle at ${(mousePosition.x + 0.5) * 100}% ${(mousePosition.y + 0.5) * 100}%, var(--primary), transparent 50%)`,
          }}
        />

        {/* Icon */}
        <div
          className={cn(
            "inline-flex p-3 rounded-xl mb-4",
            "bg-gradient-to-br from-primary/10 to-primary/5",
            "border border-primary/10",
            "transition-all duration-300",
            isHovered && "from-primary/20 to-primary/10 border-primary/20"
          )}
          style={{
            transform: isHovered ? "translateZ(20px)" : "translateZ(0)",
            transition: "transform 0.3s ease",
          }}
        >
          <Icon className={cn(
            "h-6 w-6 text-primary/70 transition-colors duration-300",
            isHovered && "text-primary"
          )} />
        </div>

        {/* Content */}
        <h3
          className={cn(
            "text-lg font-semibold mb-2 transition-colors duration-300",
            isHovered && "text-primary"
          )}
          style={{
            transform: isHovered ? "translateZ(15px)" : "translateZ(0)",
            transition: "transform 0.3s ease",
          }}
        >
          {title}
        </h3>
        <p
          className="text-muted-foreground text-sm leading-relaxed"
          style={{
            transform: isHovered ? "translateZ(10px)" : "translateZ(0)",
            transition: "transform 0.3s ease",
          }}
        >
          {description}
        </p>

        {/* Corner accent */}
        <div
          className={cn(
            "absolute top-4 right-4 w-8 h-8 transition-opacity duration-300",
            isHovered ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="absolute top-0 right-0 w-6 h-px bg-gradient-to-l from-primary/50 to-transparent" />
          <div className="absolute top-0 right-0 w-px h-6 bg-gradient-to-b from-primary/50 to-transparent" />
        </div>
      </motion.div>
    </motion.div>
  )
}

export function FeaturesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations("features")

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="features"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Connecting gradient from hero */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
        backgroundSize: "60px 60px"
      }} />

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16 md:mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium mb-6 text-primary/80">
            {t("badge")}
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight mb-6">
            {t("title1")}
            <span className="block text-primary">{t("title2")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("description")}
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featureKeys.map((key, index) => (
            <FeatureCard
              key={key}
              icon={featureIcons[index]}
              title={t(`items.${key}.title`)}
              description={t(`items.${key}.description`)}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>
      </div>

      {/* Bottom connecting line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
    </section>
  )
}
