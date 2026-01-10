"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { useTranslations } from "next-intl"
import { ArrowRight } from "lucide-react"
import { cn } from "@/lib/utils"

const showcaseLogosData = [
  { id: 1, nameKey: "financeApp", icon: "F" },
  { id: 2, nameKey: "healthTracker", icon: "+" },
  { id: 3, nameKey: "musicPlayer", icon: "►" },
  { id: 4, nameKey: "taskManager", icon: "✓" },
  { id: 5, nameKey: "socialNetwork", icon: "@" },
  { id: 6, nameKey: "ecommerce", icon: "$" },
  { id: 7, nameKey: "weatherApp", icon: "☀" },
  { id: 8, nameKey: "fitnessCoach", icon: "♥" },
]

interface ShowcaseCardProps {
  logo: { id: number; name: string; icon: string }
  index: number
  isVisible: boolean
}

function ShowcaseCard({ logo, index, isVisible }: ShowcaseCardProps) {
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
      className="group relative aspect-square cursor-pointer"
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={isVisible ? { opacity: 1, y: 0, scale: 1 } : {}}
      transition={{ duration: 0.5, delay: index * 0.08 }}
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
          "w-full h-full rounded-2xl relative overflow-hidden",
          "bg-foreground/[0.02]",
          "border border-foreground/[0.05]",
          "transition-colors duration-300",
          isHovered && "bg-foreground/[0.04] border-foreground/[0.1]"
        )}
        animate={{
          rotateX: isHovered ? mousePosition.y * -10 : 0,
          rotateY: isHovered ? mousePosition.x * 10 : 0,
          scale: isHovered ? 1.02 : 1,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Subtle gradient background */}
        <div
          className="absolute inset-0 opacity-0 transition-opacity duration-500"
          style={{
            opacity: isHovered ? 0.05 : 0,
            background: `radial-gradient(circle at ${(mousePosition.x + 0.5) * 100}% ${(mousePosition.y + 0.5) * 100}%, var(--primary), transparent 60%)`,
          }}
        />

        {/* The Logo */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div
            className={cn(
              "w-16 h-16 md:w-20 md:h-20 rounded-xl",
              "bg-gradient-to-br from-foreground/10 to-foreground/5",
              "border border-foreground/10",
              "flex items-center justify-center",
              "text-3xl md:text-4xl font-semibold text-foreground/60",
              "transition-all duration-300",
              isHovered && "from-primary/15 to-primary/5 border-primary/20 text-primary"
            )}
            style={{
              transform: isHovered ? "translateZ(30px) scale(1.05)" : "translateZ(0) scale(1)",
              transition: "transform 0.3s ease, background 0.3s ease, border-color 0.3s ease, color 0.3s ease",
            }}
          >
            {logo.icon}
          </div>
        </div>

        {/* Shine effect */}
        <div
          className={cn(
            "absolute inset-0 opacity-0 transition-opacity duration-500",
            "bg-gradient-to-tr from-transparent via-foreground/[0.02] to-transparent",
            isHovered && "opacity-100"
          )}
        />
      </motion.div>

      {/* Label on hover */}
      <motion.div
        className="absolute bottom-4 left-1/2 -translate-x-1/2 whitespace-nowrap"
        initial={{ opacity: 0, y: -5 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? 0 : -5,
        }}
        transition={{ duration: 0.2 }}
      >
        <span className="text-xs font-medium text-muted-foreground">
          {logo.name}
        </span>
      </motion.div>
    </motion.div>
  )
}

export function ShowcaseSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations("showcase")

  const showcaseLogos = showcaseLogosData.map((logo) => ({
    ...logo,
    name: t(`logoNames.${logo.nameKey}`),
  }))

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
      id="showcase"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="container mx-auto px-4 relative">
        {/* Section header */}
        <motion.div
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={isVisible ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/5 border border-primary/10 text-sm font-medium mb-6 text-primary/80">
            {t("badge")}
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-6">
            {t("title1")} <span className="text-primary">{t("title2")}</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            {t("description")}
          </p>
        </motion.div>

        {/* Logo Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 max-w-4xl mx-auto">
          {showcaseLogos.map((logo, index) => (
            <ShowcaseCard
              key={logo.id}
              logo={logo}
              index={index}
              isVisible={isVisible}
            />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          className="text-center mt-16"
          initial={{ opacity: 0 }}
          animate={isVisible ? { opacity: 1 } : {}}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <Link
            href="/create"
            className="inline-flex items-center gap-2 text-primary font-medium hover:gap-3 transition-all duration-300"
          >
            {t("startGenerating")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </motion.div>
      </div>

      {/* Bottom connector */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
    </section>
  )
}
