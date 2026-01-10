"use client"

import { Coins, AlertCircle, Loader2 } from "lucide-react"
import Link from "next/link"

import { useCredits } from "@/hooks/use-credits"
import { Button } from "@/components/ui/button"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { BuyCreditsButton } from "@/components/buy-credits-button"

interface CreditBalanceProps {
  variant?: "default" | "compact" | "detailed"
  showBuyButton?: boolean
  className?: string
}

export function CreditBalance({
  variant = "default",
  showBuyButton = true,
  className,
}: CreditBalanceProps) {
  const { data, isLoading, isError, error } = useCredits()

  if (isLoading) {
    return (
      <div className={cn("flex items-center gap-2 text-muted-foreground", className)}>
        <Loader2 className="h-4 w-4 animate-spin" />
        <span className="text-sm">Loading...</span>
      </div>
    )
  }

  if (isError) {
    const isAuthError = error instanceof Error && error.message.includes("sign in")

    if (isAuthError) {
      return (
        <div className={cn("flex items-center gap-2", className)}>
          <Button variant="outline" size="sm" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
        </div>
      )
    }

    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={cn("flex items-center gap-1 text-destructive", className)}>
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">Error</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Failed to load credits</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  const balance = data?.balance ?? 0
  const isLow = balance <= 2
  const isEmpty = balance === 0

  if (variant === "compact") {
    return (
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                "flex items-center gap-1.5 px-2 py-1 rounded-full text-sm font-medium",
                isEmpty
                  ? "bg-destructive/10 text-destructive"
                  : isLow
                    ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                    : "bg-primary/10 text-primary",
                className
              )}
            >
              <Coins className="h-3.5 w-3.5" />
              <span>{balance}</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{balance} credit{balance !== 1 ? "s" : ""} remaining</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    )
  }

  if (variant === "detailed") {
    return (
      <div className={cn("space-y-2", className)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Coins className={cn("h-5 w-5", isEmpty ? "text-destructive" : "text-primary")} />
            <div>
              <p className="text-sm font-medium">Credit Balance</p>
              <p className={cn("text-2xl font-bold", isEmpty && "text-destructive")}>
                {balance}
              </p>
            </div>
          </div>
          {showBuyButton && (
            <BuyCreditsButton size="sm" variant="default" />
          )}
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
          <div>
            <p>Total Purchased</p>
            <p className="font-medium text-foreground">{data?.totalPurchased ?? 0}</p>
          </div>
          <div>
            <p>Total Used</p>
            <p className="font-medium text-foreground">{data?.totalUsed ?? 0}</p>
          </div>
        </div>
      </div>
    )
  }

  // Default variant
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div
        className={cn(
          "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium",
          isEmpty
            ? "bg-destructive/10 text-destructive"
            : isLow
              ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
              : "bg-primary/10 text-primary"
        )}
      >
        <Coins className="h-4 w-4" />
        <span>{balance} credit{balance !== 1 ? "s" : ""}</span>
      </div>
      {showBuyButton && (isEmpty || isLow) && (
        <BuyCreditsButton
          variant={isEmpty ? "default" : "outline"}
          size="sm"
          label={isEmpty ? "Buy Credits" : "Get More"}
        />
      )}
    </div>
  )
}
