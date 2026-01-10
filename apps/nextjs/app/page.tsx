import { Header } from "@/components/landing/Header"
import { HeroSection } from "@/components/landing/HeroSection"
import { FeaturesSection } from "@/components/landing/FeaturesSection"
import { ShowcaseSection } from "@/components/landing/ShowcaseSection"
import { HowItWorksSection } from "@/components/landing/HowItWorksSection"
import { CTASection } from "@/components/landing/CTASection"
import { PricingSection } from "@/components/landing/PricingSection"
import { Footer } from "@/components/landing/Footer"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Header />
      <HeroSection />
      <FeaturesSection />
      <ShowcaseSection />
      <HowItWorksSection />
      <PricingSection />
      <CTASection />
      <Footer />
    </main>
  )
}
