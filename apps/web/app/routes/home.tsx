import type { Route } from "./+types/home"
import {
  Header,
  HeroSection,
  FeaturesSection,
  ShowcaseSection,
  HowItWorksSection,
  PricingSection,
  CTASection,
  Footer,
} from "~/components/landing"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "LogoLoco - AI Logo Generator" },
    {
      name: "description",
      content:
        "Create stunning, professional logos with the power of AI. No design skills required.",
    },
  ]
}

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
