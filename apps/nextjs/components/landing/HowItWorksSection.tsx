"use client"

import { useEffect, useRef, useState } from "react"
import { motion } from "framer-motion"
import { useTranslations } from "next-intl"
import { MessageSquare, Sparkles, Download, type LucideIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const stepIcons = [MessageSquare, Sparkles, Download] as const
const stepKeys = ["step1", "step2", "step3"] as const
const stepNumbers = ["01", "02", "03"] as const

interface StepCardProps {
  step: { number: string; icon: LucideIcon; title: string; description: string }
  index: number
  isVisible: boolean
  isActive: boolean
  onClick: () => void
}

function StepCard({ step, index, isVisible, isActive, onClick }: StepCardProps) {
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
      className="relative cursor-pointer"
      initial={{ opacity: 0, y: 30 }}
      animate={isVisible ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, delay: index * 0.15 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false)
        setMousePosition({ x: 0, y: 0 })
      }}
      onMouseMove={handleMouseMove}
      onClick={onClick}
      style={{ perspective: "1000px" }}
    >
      {/* Step number badge */}
      <div
        className={cn(
          "absolute -top-3 -left-3 w-10 h-10 rounded-full z-10",
          "flex items-center justify-center text-sm font-bold",
          "transition-all duration-300",
          isActive
            ? "bg-primary text-primary-foreground scale-110"
            : "bg-foreground/[0.05] border border-foreground/[0.1] text-muted-foreground"
        )}
      >
        {step.number}
      </div>

      <motion.div
        className={cn(
          "relative p-6 md:p-8 rounded-2xl h-full",
          "bg-foreground/[0.02]",
          "border transition-colors duration-300",
          isActive ? "border-primary/30 bg-foreground/[0.04]" : "border-foreground/[0.05]",
          isHovered && !isActive && "bg-foreground/[0.03] border-foreground/[0.08]"
        )}
        animate={{
          rotateX: isHovered ? mousePosition.y * -6 : 0,
          rotateY: isHovered ? mousePosition.x * 6 : 0,
        }}
        transition={{ type: "spring", stiffness: 400, damping: 30 }}
        style={{ transformStyle: "preserve-3d" }}
      >
        {/* Spotlight effect */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-500 pointer-events-none"
          style={{
            opacity: isHovered ? 0.08 : 0,
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
            isActive && "from-primary/20 to-primary/10 border-primary/20"
          )}
          style={{
            transform: isHovered ? "translateZ(15px)" : "translateZ(0)",
            transition: "transform 0.3s ease",
          }}
        >
          <step.icon className={cn(
            "h-6 w-6 transition-colors duration-300",
            isActive ? "text-primary" : "text-primary/70"
          )} />
        </div>

        {/* Content */}
        <h3
          className={cn(
            "text-lg font-semibold mb-2 transition-colors duration-300",
            isActive && "text-primary"
          )}
          style={{
            transform: isHovered ? "translateZ(10px)" : "translateZ(0)",
            transition: "transform 0.3s ease",
          }}
        >
          {step.title}
        </h3>
        <p
          className="text-muted-foreground text-sm leading-relaxed"
          style={{
            transform: isHovered ? "translateZ(5px)" : "translateZ(0)",
            transition: "transform 0.3s ease",
          }}
        >
          {step.description}
        </p>

        {/* Progress bar for active step */}
        {isActive && (
          <div className="mt-4 h-0.5 rounded-full bg-white/[0.05] overflow-hidden">
            <motion.div
              className="h-full bg-primary/50"
              initial={{ width: "0%" }}
              animate={{ width: "100%" }}
              transition={{ duration: 4, ease: "linear" }}
            />
          </div>
        )}
      </motion.div>
    </motion.div>
  )
}

export function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const t = useTranslations("howItWorks")

  const steps = stepKeys.map((key, index) => ({
    number: stepNumbers[index],
    icon: stepIcons[index],
    title: t(`steps.${key}.title`),
    description: t(`steps.${key}.description`),
  }))

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-advance steps
  useEffect(() => {
    if (!isVisible) return

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length)
    }, 4000)

    return () => clearInterval(interval)
  }, [isVisible, steps.length])

  return (
    <section
      id="how-it-works"
      ref={sectionRef}
      className="py-24 md:py-32 relative overflow-hidden"
    >
      {/* Grid pattern */}
      <div className="absolute inset-0 opacity-[0.015]" style={{
        backgroundImage: `linear-gradient(var(--foreground) 1px, transparent 1px), linear-gradient(90deg, var(--foreground) 1px, transparent 1px)`,
        backgroundSize: "80px 80px"
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

        {/* Steps */}
        <div className="max-w-5xl mx-auto">
          {/* Desktop layout */}
          <div className="hidden md:grid md:grid-cols-3 gap-6 lg:gap-8">
            {steps.map((step, index) => (
              <div key={step.number} className="relative">
                {/* Connector line */}
                {index < steps.length - 1 && (
                  <div className="absolute top-1/2 left-full w-full h-px bg-gradient-to-r from-white/[0.1] to-transparent z-0 hidden lg:block -translate-y-1/2" />
                )}
                <StepCard
                  step={step}
                  index={index}
                  isVisible={isVisible}
                  isActive={activeStep === index}
                  onClick={() => setActiveStep(index)}
                />
              </div>
            ))}
          </div>

          {/* Mobile layout */}
          <div className="md:hidden space-y-6">
            {steps.map((step, index) => (
              <StepCard
                key={step.number}
                step={step}
                index={index}
                isVisible={isVisible}
                isActive={activeStep === index}
                onClick={() => setActiveStep(index)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom connector */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/10 to-transparent" />
    </section>
  )
}
