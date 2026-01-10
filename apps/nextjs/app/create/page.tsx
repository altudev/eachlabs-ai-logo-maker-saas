import { LogoMaker } from "@/components/logo-maker";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Create Logo | LogoLoco",
  description: "Design your perfect logo with AI. Enter your app name, choose colors, and let our AI create stunning logos for you.",
};

export default function CreatePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-6">
        <Button variant="ghost" asChild className="mb-6">
          <Link href="/" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
        </Button>
      </div>

      <div className="flex flex-col items-center justify-center px-4 pb-16">
        <div className="w-full max-w-5xl space-y-8">
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-5xl font-bold tracking-tighter">
              Create Your Logo
            </h1>
            <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
              Describe your vision and let AI bring it to life in seconds.
            </p>
          </div>

          <LogoMaker />
        </div>
      </div>
    </div>
  );
}
