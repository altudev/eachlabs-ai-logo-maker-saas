"use client"

import { useEffect, useRef, useState } from "react"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import Image from "next/image"
import Link from "next/link"
import { Loader2, Wand2, Download, FileText, Image as ImageIcon, Coins, AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { useCredits, useInvalidateCredits } from "@/hooks/use-credits"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { RainbowButton } from "@/components/ui/rainbow-button"
import { BuyCreditsButton } from "@/components/buy-credits-button"

const POLL_INTERVAL_MS = 2000

const formSchema = z.object({
  appName: z.string().min(2, {
    message: "App name must be at least 2 characters.",
  }),
  appFocus: z.string().min(3, {
    message: "App focus must be at least 3 characters.",
  }),
  color1: z.string().min(2, {
    message: "Please enter a color.",
  }),
  color2: z.string().min(2, {
    message: "Please enter a second color.",
  }),
  model: z.string({ message: "Please select a model." }).min(1, {
    message: "Please select a model.",
  }),
  outputCount: z.string({ message: "Please choose an output count." }).min(1, {
    message: "Please choose an output count.",
  }),
})

type LogoFormValues = z.infer<typeof formSchema>

type PredictionStatus = "queued" | "running" | "succeeded" | "failed"

type PredictionPayload = {
  status?: unknown
  output?: unknown
  images?: unknown
  error?: unknown
  message?: unknown
}

type NormalizedPrediction = {
  status: PredictionStatus
  images: string[]
  errorMessage?: string
}

const defaultValues: LogoFormValues = {
  appName: "Acme Finance",
  appFocus: "Rocket wallet",
  color1: "Turquoise",
  color2: "Emerald",
  model: "nano-banana",
  outputCount: "2",
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002"
const MAX_POLL_DURATION_MS = 5 * 60 * 1000

const statusMap: Record<string, PredictionStatus> = {
  queued: "queued",
  running: "running",
  succeeded: "succeeded",
  success: "succeeded",
  failed: "failed",
  error: "failed",
}

// Basic color mapping for Turkish color names to CSS values for preview
const colorMap: Record<string, string> = {
  turkuaz: "turquoise",
  "safir yesil": "#0F52BA", // Approximation
  kirmizi: "red",
  mavi: "blue",
  yesil: "green",
  sari: "yellow",
  mor: "purple",
  turuncu: "orange",
  siyah: "black",
  beyaz: "white",
  gri: "gray",
  pembe: "pink",
  lacivert: "navy",
  bordo: "maroon",
}

const getColorValue = (val: string) => {
  if (!val) return "transparent"
  const lower = val.toLowerCase()
  if (colorMap[lower]) return colorMap[lower]
  return val // Return as is (hex, rgb, or valid css name)
}

const parseOutputCount = (value: string) => {
  const parsed = Number.parseInt(value, 10)
  return Number.isFinite(parsed) ? Math.max(1, parsed) : 1
}

const normalizeStatus = (status: unknown): PredictionStatus => {
  if (!status || typeof status !== "string") return "running"
  return statusMap[status.toLowerCase()] ?? "running"
}

const normalizeImages = (payload: PredictionPayload | null) => {
  const candidate = payload?.output ?? payload?.images

  if (Array.isArray(candidate)) {
    return candidate.filter((item): item is string => typeof item === "string")
  }

  if (typeof candidate === "string") {
    return [candidate]
  }

  return []
}

const readErrorMessage = (payload: PredictionPayload | null, fallback: string) => {
  if (payload && typeof payload.error === "string") return payload.error
  if (payload && typeof payload.message === "string") return payload.message
  return fallback
}

async function createPredictionRequest(values: LogoFormValues): Promise<string> {
  const response = await fetch(`${API_BASE_URL}/api/predictions`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(values),
  })

  const data = (await response.json().catch(() => null)) as {
    predictionID?: unknown
    error?: unknown
    balance?: number
  } | null

  // Handle specific error cases
  if (response.status === 401) {
    const error = new Error("Please sign in to generate logos") as Error & { errorType: string }
    error.errorType = "auth_required"
    throw error
  }

  if (response.status === 402) {
    const error = new Error(
      data?.balance === 0
        ? "You have no credits left. Purchase more to continue."
        : "Insufficient credits for this generation."
    ) as Error & { errorType: string; balance: number }
    error.errorType = "insufficient_credits"
    error.balance = data?.balance ?? 0
    throw error
  }

  if (!response.ok || !data) {
    throw new Error(readErrorMessage(data, "Failed to start logo generation"))
  }

  const predictionId = typeof data.predictionID === "string" ? data.predictionID : null

  if (!predictionId) {
    throw new Error("Prediction ID missing in response")
  }

  return predictionId
}

async function fetchPredictionStatus(predictionId: string): Promise<NormalizedPrediction> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predictions/${predictionId}`, {
      credentials: "include",
    })
    const data = (await response.json().catch(() => null)) as PredictionPayload | null

    if (!response.ok || !data) {
      return {
        status: "failed",
        images: [],
        errorMessage: readErrorMessage(data, "Failed to fetch prediction status"),
      }
    }

    const errorMessageCandidate = readErrorMessage(data, "")

    return {
      status: normalizeStatus(data.status),
      images: normalizeImages(data),
      errorMessage: errorMessageCandidate || undefined,
    }
  } catch (error) {
    return {
      status: "failed",
      images: [],
      errorMessage: error instanceof Error ? error.message : "Failed to fetch prediction status",
    }
  }
}

export function LogoMaker() {
  const queryClient = useQueryClient()
  const [generationCount, setGenerationCount] = useState<number>(parseOutputCount(defaultValues.outputCount))
  const [predictionId, setPredictionId] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [errorType, setErrorType] = useState<"auth_required" | "insufficient_credits" | null>(null)
  const pollDeadlineRef = useRef<number | null>(null)

  // Credit balance hooks
  const { data: creditsData, isLoading: isCreditsLoading } = useCredits()
  const { invalidateBalance } = useInvalidateCredits()
  const creditBalance = creditsData?.balance ?? 0

  const form = useForm<LogoFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues,
  })

  const createPrediction = useMutation({
    mutationFn: createPredictionRequest,
    onMutate: (values) => {
      setErrorMessage(null)
      setErrorType(null)
      setGenerationCount(parseOutputCount(values.outputCount))
      pollDeadlineRef.current = null
      setPredictionId(null)
      queryClient.removeQueries({ queryKey: ["prediction-status"], exact: false })
    },
    onSuccess: (id, values) => {
      setPredictionId(id)
      setGenerationCount(parseOutputCount(values.outputCount))
      pollDeadlineRef.current = Date.now() + MAX_POLL_DURATION_MS
      // Invalidate credits after starting generation (credit was deducted)
      invalidateBalance()
    },
    onError: (error) => {
      const err = error as Error & { errorType?: string }
      setErrorMessage(err.message ?? "Failed to start logo generation")
      if (err.errorType === "auth_required" || err.errorType === "insufficient_credits") {
        setErrorType(err.errorType)
      } else {
        setErrorType(null)
      }
      invalidateBalance()
    },
  })

  const predictionQuery = useQuery<NormalizedPrediction>({
    queryKey: ["prediction-status", predictionId],
    queryFn: () => fetchPredictionStatus(predictionId as string),
    enabled: Boolean(predictionId),
    refetchInterval: (query) => {
      if (!predictionId) return false
      if (pollDeadlineRef.current && Date.now() > pollDeadlineRef.current) return false

      const status = query.state.data?.status
      if (!status) return POLL_INTERVAL_MS
      if (status === "succeeded" || status === "failed") return false

      return POLL_INTERVAL_MS
    },
    retry: 2,
    staleTime: 0,
  })

  useEffect(() => {
    if (!predictionId || !pollDeadlineRef.current) return

    const timer = setInterval(() => {
      if (pollDeadlineRef.current && Date.now() > pollDeadlineRef.current) {
        queryClient.cancelQueries({ queryKey: ["prediction-status", predictionId] })
        setErrorMessage("Generation timed out. Please try again.")
        setPredictionId(null)
        pollDeadlineRef.current = null
      }
    }, 1000)

    return () => clearInterval(timer)
  }, [predictionId, queryClient])

  const isPolling = Boolean(predictionId) && (predictionQuery.isPending || predictionQuery.isFetching || predictionQuery.isRefetching)
  const isLoading = createPrediction.isPending || isPolling
  const resultImages = predictionQuery.data?.status === "succeeded" ? predictionQuery.data.images : []
  const queryErrorMessage =
    predictionQuery.data?.status === "failed"
      ? predictionQuery.data.errorMessage ?? "Logo generation failed. Please try again."
      : null
  const combinedError = errorMessage ?? queryErrorMessage
  const shouldShowResults = isLoading || resultImages.length > 0 || Boolean(combinedError)

  function onSubmit(values: LogoFormValues) {
    createPrediction.mutate(values)
  }

  return (
    <div className="w-full max-w-3xl mx-auto p-4">
      <Card className="shadow-xl border-0">
        <CardHeader className="space-y-1 pb-8">
          <div className="flex items-start justify-between">
            <div>
              <CardTitle className="text-xl font-bold">AI Logo Maker</CardTitle>
              <CardDescription>
                Quickly design a modern, app-store-ready logo.
              </CardDescription>
            </div>
            {/* Credit Balance Display */}
            <div className="flex items-center gap-2">
              {isCreditsLoading ? (
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-muted text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading...</span>
                </div>
              ) : (
                <div
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${
                    creditBalance === 0
                      ? "bg-destructive/10 text-destructive"
                      : creditBalance <= 2
                        ? "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400"
                        : "bg-primary/10 text-primary"
                  }`}
                >
                  <Coins className="h-4 w-4" />
                  <span>{creditBalance} credit{creditBalance !== 1 ? "s" : ""}</span>
                </div>
              )}
              {creditBalance <= 2 && !isCreditsLoading && (
                <Button variant={creditBalance === 0 ? "default" : "outline"} size="sm" asChild>
                  <Link href="/pricing">{creditBalance === 0 ? "Buy Credits" : "Get More"}</Link>
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <FormField
                  control={form.control}
                  name="appName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">App Name</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="e.g. PixelPilot"
                            {...field}
                            className="pr-10 h-11 bg-background border-input/60 focus-visible:ring-1"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                            <FileText className="h-5 w-5" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="appFocus"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">App Focus</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="e.g. Flying rocket, Wallet"
                            {...field}
                            className="pr-10 h-11 bg-background border-input/60 focus-visible:ring-1"
                          />
                          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground/50">
                            <ImageIcon className="h-5 w-5" />
                          </div>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color1"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">Color 1</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="e.g. Turquoise"
                            {...field}
                            className="pr-10 h-11 bg-background border-input/60 focus-visible:ring-1"
                          />
                          <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-sm border shadow-sm"
                            style={{ backgroundColor: getColorValue(field.value) }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color2"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">Color 2</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="e.g. Purple"
                            {...field}
                            className="pr-10 h-11 bg-background border-input/60 focus-visible:ring-1"
                          />
                          <div
                            className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 rounded-sm border shadow-sm"
                            style={{ backgroundColor: getColorValue(field.value) }}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">Model</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background border-input/60 focus:ring-1">
                            <SelectValue placeholder="Select a model" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="nano-banana">Nano Banana</SelectItem>
                          <SelectItem value="seedream-v4">
                            Seedream v4
                          </SelectItem>
                          <SelectItem value="reve-text">Reve Text</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="outputCount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="font-semibold text-foreground/80">Output Count</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="h-11 bg-background border-input/60 focus:ring-1">
                            <SelectValue placeholder="Select a count" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="1">1 Image</SelectItem>
                          <SelectItem value="2">2 Images</SelectItem>
                          <SelectItem value="3">3 Images</SelectItem>
                          <SelectItem value="4">4 Images</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <RainbowButton type="submit" className="w-full h-12 rounded-xl text-base font-medium" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Wand2 className="mr-2 h-4 w-4" />
                    Generate Logo
                  </>
                )}
              </RainbowButton>
              {combinedError && !isLoading && (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                    <div className="flex-1 space-y-2">
                      <p className="text-sm text-destructive font-medium">{combinedError}</p>
                      {errorType === "auth_required" && (
                        <Button variant="outline" size="sm" asChild>
                          <Link href="/login">Sign In</Link>
                        </Button>
                      )}
                      {errorType === "insufficient_credits" && (
                        <BuyCreditsButton size="sm" variant="outline" />
                      )}
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Form>
        </CardContent>

        {/* Loading State or Result */}
        {shouldShowResults && (
          <CardFooter className="flex flex-col items-start gap-4 pt-8">
            <div className="w-full space-y-4">
              <h3 className="font-medium text-sm text-muted-foreground">
                {isLoading ? "Generating..." : "Generated Logos:"}
              </h3>

              {isLoading ? (
                <div className="grid grid-cols-2 gap-8">
                  {Array.from({ length: generationCount }).map((_, i) => (
                    <div key={i} className="aspect-square rounded-[2rem] bg-muted animate-pulse" />
                  ))}
                </div>
              ) : resultImages.length > 0 ? (
                <div className="grid grid-cols-2 gap-8">
                  {resultImages.map((img, i) => (
                    <div
                      key={i}
                      className="group relative aspect-square rounded-[2rem] overflow-hidden border bg-white/50 shadow-sm hover:shadow-md transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-br from-white/40 to-transparent z-10 pointer-events-none" />
                      <Image
                        src={img}
                        alt={`Generated logo ${i + 1}`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 768px) 50vw, 33vw"
                        priority={i === 0}
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
                        <Button variant="secondary" size="sm" className="rounded-full" asChild>
                          <a href={img} download target="_blank" rel="noopener noreferrer">
                            <Download className="mr-2 h-4 w-4" />
                            Download
                          </a>
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2 text-sm text-destructive">
                  {combinedError ?? "Logo generation failed. Please try again."}
                </div>
              )}
            </div>
          </CardFooter>
        )}
      </Card>
    </div>
  )
}
