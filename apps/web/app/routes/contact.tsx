import type { Route } from "./+types/contact"
import { useTranslations } from "~/lib/i18n/use-translations"
import { LegalPageLayout } from "~/components/legal/LegalPageLayout"
import { Mail, MessageSquare, Send, CheckCircle } from "lucide-react"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Textarea } from "~/components/ui/textarea"
import { Label } from "~/components/ui/label"
import { cn } from "~/lib/utils"
import { useState, useEffect } from "react"
import { toast } from "sonner"

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Contact Us - LogoLoco" },
    {
      name: "description",
      content: "Get in touch with the LogoLoco team",
    },
  ]
}

export default function Contact() {
  const t = useTranslations("contact")
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Basic validation
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Please fill in all required fields")
      return
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(formData.email)) {
      toast.error("Please enter a valid email address")
      return
    }

    setIsSubmitting(true)

    // Simulate form submission
    // In production, this would call your API endpoint
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
      toast.success("Message sent successfully!")
      setFormData({ name: "", email: "", subject: "", message: "" })

      // Reset success state after 3 seconds
      setTimeout(() => setIsSubmitted(false), 3000)
    }, 1500)
  }

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
            <Mail className="h-10 w-10 text-primary" />
            {t("title")}
          </h1>
          <p className="text-muted-foreground">{t("description")}</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 rounded-lg bg-muted/50 border border-border/50">
              <MessageSquare className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">{t("info.responseTitle")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("info.responseTime")}
              </p>
            </div>

            <div className="p-6 rounded-lg bg-muted/50 border border-border/50">
              <Mail className="h-6 w-6 text-primary mb-3" />
              <h3 className="font-semibold mb-2">{t("info.emailTitle")}</h3>
              <a
                href="mailto:support@logoloco.ai"
                className="text-sm text-primary hover:underline"
              >
                support@logoloco.ai
              </a>
            </div>

            <div className="p-6 rounded-lg bg-muted/50 border border-border/50">
              <h3 className="font-semibold mb-3">{t("info.officeHoursTitle")}</h3>
              <p className="text-sm text-muted-foreground">
                {t("info.officeHours")}
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">
                    {t("form.name")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder={t("form.namePlaceholder")}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">
                    {t("form.email")} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder={t("form.emailPlaceholder")}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="subject">{t("form.subject")}</Label>
                <Input
                  id="subject"
                  name="subject"
                  type="text"
                  value={formData.subject}
                  onChange={handleInputChange}
                  placeholder={t("form.subjectPlaceholder")}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="message">
                  {t("form.message")} <span className="text-destructive">*</span>
                </Label>
                <Textarea
                  id="message"
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  placeholder={t("form.messagePlaceholder")}
                  rows={8}
                  required
                  className="resize-none"
                />
              </div>

              <Button
                type="submit"
                className="w-full sm:w-auto"
                disabled={isSubmitting || isSubmitted}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin mr-2">⏳</span>
                    {t("form.sending")}
                  </>
                ) : isSubmitted ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    {t("form.sent")}
                  </>
                ) : (
                  <>
                    <Send className="mr-2 h-4 w-4" />
                    {t("form.submit")}
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground">
                {t("form.required")}
              </p>
            </form>
          </div>
        </div>
      </div>
    </LegalPageLayout>
  )
}
