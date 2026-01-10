"use client"

import { useEffect } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { CheckCircle2, ArrowLeft } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useInvalidateCredits } from "@/hooks/use-credits"

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams()
  const checkoutId = searchParams.get("checkout_id")
  const { invalidateAll } = useInvalidateCredits()

  useEffect(() => {
    invalidateAll()
  }, [invalidateAll])

  return (
    <div className="min-h-[70vh] w-full px-4 py-12 flex items-center justify-center">
      <Card className="w-full max-w-2xl shadow-lg border-0">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 text-primary flex items-center justify-center">
            <CheckCircle2 className="h-8 w-8" />
          </div>
          <CardTitle className="text-2xl font-semibold">Payment confirmed</CardTitle>
          <p className="text-muted-foreground">
            Your credits are ready to use. Head back to generate more logos.
          </p>
        </CardHeader>
        <CardContent className="flex flex-col items-center gap-3">
          {checkoutId && (
            <p className="text-xs text-muted-foreground">
              Checkout ID: <span className="font-mono text-foreground">{checkoutId}</span>
            </p>
          )}
          <div className="flex flex-wrap gap-3 justify-center mt-2">
            <Button asChild>
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to logo maker
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/history">View history</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
