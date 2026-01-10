"use client"

import { useState, useMemo } from "react"
import { Loader2, ShoppingCart } from "lucide-react"

import { authClient } from "@/lib/auth-client"
import { useCreditPackages } from "@/hooks/use-credits"
import { Button, type ButtonProps } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type BuyCreditsButtonProps = {
  className?: string
  label?: string
  packageId?: string
  disabled?: boolean
} & Partial<ButtonProps>

/**
 * Trigger a Polar checkout for the first active credit package (or a specific one via packageId).
 * Assumes packages include a polarProductId (exposed by /api/credits/packages).
 */
export function BuyCreditsButton({
  className,
  label = "Buy credits",
  packageId,
  disabled,
  size = "sm",
  variant = "default",
  ...buttonProps
}: BuyCreditsButtonProps) {
  const { data, isLoading, isError } = useCreditPackages()
  const { data: sessionData, isPending: isSessionLoading } = authClient.useSession()
  const [isPending, setIsPending] = useState(false)
  const [localError, setLocalError] = useState<string | null>(null)

  const targetPackage = useMemo(() => {
    const list = data?.packages ?? []
    if (!list.length) return null
    if (packageId) {
      return list.find((pkg) => pkg.id === packageId) ?? null
    }
    return list[0]
  }, [data?.packages, packageId])

  const handleCheckout = async () => {
    if (isLoading || disabled) return
    setLocalError(null)

    if (!targetPackage || !targetPackage.polarProductId) {
      setLocalError("No purchasable package is available.")
      return
    }

    if (isSessionLoading) {
      setLocalError("Checking your session. Please try again in a moment.")
      return
    }

    if (!sessionData?.session) {
      setLocalError("Please sign in to purchase credits.")
      return
    }

    try {
      setIsPending(true)
      await authClient.checkout({
        products: [targetPackage.polarProductId],
      })
    } catch (error) {
      if (error instanceof Error && error.message.toLowerCase().includes("unauthorized")) {
        setLocalError("Please sign in to purchase credits.")
      } else {
        const message =
          error instanceof Error ? error.message : "Failed to start checkout. Please try again."
        setLocalError(message)
      }
      console.error("Checkout error:", error)
    } finally {
      setIsPending(false)
    }
  }

  const showDisabled = disabled || isLoading || isPending || isError || isSessionLoading

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Button
        size={size}
        variant={variant}
        onClick={handleCheckout}
        disabled={showDisabled}
        {...buttonProps}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redirecting…
          </>
        ) : (
          <>
            <ShoppingCart className="mr-2 h-4 w-4" />
            {label}
          </>
        )}
      </Button>
      {localError && (
        <p className="text-xs text-destructive leading-tight">
          {localError}
        </p>
      )}
    </div>
  )
}
