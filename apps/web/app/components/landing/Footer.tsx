import { Link } from "react-router"
import { Sparkles, Github, Twitter } from "lucide-react"
import { useTranslations } from "~/lib/i18n/use-translations"

const socialLinks = [
  { label: "Twitter", icon: Twitter, href: "https://twitter.com" },
  { label: "GitHub", icon: Github, href: "https://github.com" },
]

export function Footer() {
  const t = useTranslations("footer")

  const footerLinks = {
    product: [
      { label: t("links.features"), href: "#features" },
      { label: t("links.showcase"), href: "#showcase" },
      { label: t("links.howItWorks"), href: "#how-it-works" },
      { label: t("links.createLogo"), href: "/create", isRoute: true },
    ],
    company: [
      { label: t("links.about"), href: "#" },
      { label: t("links.blog"), href: "#" },
      { label: t("links.careers"), href: "#" },
      { label: t("links.contact"), href: "/contact", isRoute: true },
    ],
    legal: [
      { label: t("links.privacyPolicy"), href: "/privacy-policy", isRoute: true },
      { label: t("links.termsOfService"), href: "/terms-of-use", isRoute: true },
      { label: t("links.refundPolicy"), href: "/refund-policy", isRoute: true },
    ],
  }

  return (
    <footer className="border-t border-border/50 bg-muted/30">
      {/* Dither border */}
      <div className="dither-border-halftone opacity-30" />

      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8 lg:gap-12">
          {/* Brand column */}
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="relative">
                <Sparkles className="h-6 w-6 text-primary" />
                <div className="absolute inset-0 bg-primary/20 blur-lg rounded-full" />
              </div>
              <span className="font-bold text-xl">LogoLoco</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-6 max-w-xs">
              {t("tagline")}
            </p>
            {/* Social links */}
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-lg bg-muted hover:bg-muted/80 text-muted-foreground hover:text-foreground transition-colors"
                >
                  <social.icon className="h-5 w-5" />
                  <span className="sr-only">{social.label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Product links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">
              {t("sections.product")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.product.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">
              {t("sections.company")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.company.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>

          {/* Legal links */}
          <div>
            <h3 className="font-semibold text-sm mb-4">
              {t("sections.legal")}
            </h3>
            <ul className="space-y-3">
              {footerLinks.legal.map((link) => (
                <li key={link.label}>
                  {link.isRoute ? (
                    <Link
                      to={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  ) : (
                    <a
                      href={link.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </a>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-border/50 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} LogoLoco. {t("copyright")}
          </p>
          <p className="text-sm text-muted-foreground">{t("madeWith")} ❤️</p>
        </div>
      </div>
    </footer>
  )
}
