import type { ReactNode } from "react"
import React from "react"
import { Header, Footer } from "~/components/landing"
import { cn } from "~/lib/utils"

interface LegalPageLayoutProps {
  children: ReactNode
  className?: string
}

export function LegalPageLayout({ children, className }: LegalPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-16">
        <div className={cn("container mx-auto px-4 max-w-4xl", className)}>
          {children}
        </div>
      </main>
      <Footer />
    </div>
  )
}

interface LegalSectionProps {
  title: string
  children: ReactNode
  delay?: number
}

export function LegalSection({ title, children, delay = 0 }: LegalSectionProps) {
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    const timer = setTimeout(() => setIsVisible(true), delay)
    return () => clearTimeout(timer)
  }, [delay])

  return (
    <section
      className={cn(
        "mb-8 transition-all duration-700",
        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
      )}
    >
      <h2 className="text-2xl font-semibold mb-4">{title}</h2>
      <div className="prose prose-neutral dark:prose-invert max-w-none">
        {children}
      </div>
    </section>
  )
}
