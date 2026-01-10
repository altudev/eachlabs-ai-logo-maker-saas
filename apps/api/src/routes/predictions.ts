import { Hono } from "hono"
import { eq, desc, and, gte } from "drizzle-orm"
import { z } from "zod"
import type { StatusCode } from "hono/utils/http-status"

import { db } from "../db"
import { logoGenerations } from "../db/schemas"
import { getAuthUser, getUserBalance, deductCredits, addCredits } from "./credits"
import { t, translate, getLocale } from "../i18n"

const EACHLABS_API_URL = "https://api.eachlabs.ai/v1/prediction"

const MODEL_MAP: Record<string, string> = {
  "nano-banana": "nano-banana",
  "seedream-v4": "seedream-v4-text-to-image",
  "reve-text": "reve-text-to-image",
}

type ProviderStatus = "queued" | "running" | "succeeded" | "failed"

const statusMap: Record<string, ProviderStatus> = {
  success: "succeeded",
  failed: "failed",
  running: "running",
  queued: "queued",
}

const DEFAULT_FETCH_TIMEOUT_MS = Number(process.env.EACHLABS_TIMEOUT_MS ?? 30_000)

async function fetchWithTimeout(url: string, init: RequestInit, timeoutMs = DEFAULT_FETCH_TIMEOUT_MS) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), timeoutMs)

  try {
    return await fetch(url, { ...init, signal: controller.signal })
  } finally {
    clearTimeout(timeout)
  }
}

async function safeJson<T = unknown>(response: Response): Promise<T | null> {
  try {
    return (await response.json()) as T
  } catch (error) {
    console.error("Failed to parse provider response:", error)
    return null
  }
}

const requestSchema = z.object({
  appName: z.string().min(2),
  appFocus: z.string().min(2),
  color1: z.string().min(1),
  color2: z.string().min(1),
  model: z.enum(["nano-banana", "seedream-v4", "reve-text"]),
  outputCount: z.union([z.string(), z.number()]).optional(),
})
const paramsSchema = z.object({ id: z.string().min(1) })
export const predictions = new Hono()

predictions.get("/", async (c) => {
  try {
    const user = await getAuthUser(c.req.raw)

    if (!user) {
      return c.json({ error: t(c, "errors.authRequired") }, 401)
    }

    const limitParam = Number.parseInt(c.req.query("limit") ?? "50", 10)
    const offsetParam = Number.parseInt(c.req.query("offset") ?? "0", 10)
    const limit = Number.isFinite(limitParam) ? Math.min(Math.max(limitParam, 1), 100) : 50
    const offset = Number.isFinite(offsetParam) && offsetParam > 0 ? offsetParam : 0

    const retentionDays = Number.parseInt(process.env.GENERATION_RETENTION_DAYS ?? "365", 10)
    const retentionDaysValue = Number.isFinite(retentionDays) ? retentionDays : 365
    const retentionStart = new Date(
      Date.now() - Math.max(1, retentionDaysValue) * 24 * 60 * 60 * 1000
    )

    const history = await db
      .select()
      .from(logoGenerations)
      .where(
        and(
          eq(logoGenerations.userId, user.id),
          gte(logoGenerations.createdAt, retentionStart)
        )
      )
      .orderBy(desc(logoGenerations.createdAt))
      .limit(limit)
      .offset(offset)

    return c.json({ history, pagination: { limit, offset } })
  } catch (error) {
    console.error("History fetch error:", error)
    return c.json({
      error: t(c, "errors.internalError"),
      details: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined
    }, 500)
  }
})

predictions.post("/", async (c) => {
  let generationId: string | null = null
  let userId: string | null = null
  let creditDeducted = false
  let creditsRequired = 1
  const locale = getLocale(c)

  try {
    // Authenticate user
    const user = await getAuthUser(c.req.raw)
    if (!user) {
      return c.json({ error: t(c, "errors.authRequired") }, 401)
    }
    userId = user.id

    const body = await c.req.json()
    const parsedBody = requestSchema.safeParse(body)

    if (!parsedBody.success) {
      return c.json(
        { error: t(c, "validation.invalidRequest"), details: parsedBody.error.format() },
        400
      )
    }

    const { appName, appFocus, color1, color2, model, outputCount } = parsedBody.data
    const apiKey = process.env.EACHLABS_API_KEY

    if (!apiKey) {
      return c.json({ error: t(c, "errors.configMissing") }, 500)
    }

    const selectedModel = MODEL_MAP[model]
    if (!selectedModel) {
      return c.json({ error: t(c, "errors.invalidModel") }, 400)
    }

    const parsedOutputCount = Number.parseInt(`${outputCount ?? 1}`, 10)
    const outputCountValue = Number.isFinite(parsedOutputCount)
      ? Math.min(4, Math.max(1, parsedOutputCount))
      : 1
    creditsRequired = outputCountValue

    // Check credit balance (1 credit per logo/output)
    const balance = await getUserBalance(userId, locale)
    if (balance < creditsRequired) {
      return c.json(
        { error: t(c, "credits.insufficientCredits"), balance, required: creditsRequired },
        402
      )
    }

    const prompt = `Design an iOS 16–ready, minimalist, and modern app icon for ${appName}. Use a softly rounded square background with a sophisticated gradient that blends ${color1} and ${color2}. Center a clean, easily recognizable symbol that represents ${appFocus}, with subtle depth via gentle shadow and light effects. If including text, weave the app name or initials in a sleek, highly legible way. The icon must remain crisp and recognizable at every size on a plain white background.`

    // Create generation record with userId
    try {
      const [record] = await db
        .insert(logoGenerations)
        .values({
          userId,
          appName,
          appFocus,
          color1,
          color2,
          model: selectedModel,
          outputCount: outputCountValue,
          creditsCharged: creditsRequired,
          prompt,
          status: "running",
        })
        .returning({ id: logoGenerations.id })

      generationId = record?.id ?? null
    } catch (error) {
      console.error("Failed to persist generation request:", error)
    }

    // Deduct credit upfront (before calling provider)
    if (generationId) {
      const deductResult = await deductCredits(
        userId,
        creditsRequired,
        generationId,
        translate(locale, "credits.logoGeneration", { appName })
      )
      if (!deductResult.success) {
        // Race condition - balance changed between check and deduct
        return c.json(
          { error: t(c, "credits.insufficientCredits"), balance: deductResult.newBalance, required: creditsRequired },
          402
        )
      }
      creditDeducted = true
    }

    let input: Record<string, unknown> = {
      prompt,
      num_images: outputCountValue,
      sync_mode: false,
    }

    if (selectedModel === "nano-banana") {
      input = {
        ...input,
        output_format: "png",
        aspect_ratio: "1:1",
        limit_generations: true,
      }
    } else if (selectedModel === "seedream-v4-text-to-image") {
      input = {
        ...input,
        image_size: "square_hd",
        enable_safety_checker: true,
      }
    } else if (selectedModel === "reve-text-to-image") {
      input = {
        ...input,
        aspect_ratio: "1:1",
        output_format: "png",
      }
    }

    const response = await fetchWithTimeout(`${EACHLABS_API_URL}/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-API-Key": apiKey,
      },
      body: JSON.stringify({
        model: selectedModel,
        version: "0.0.1",
        input,
      }),
    }).catch((error) => {
      console.error("Prediction request failed:", error)
      return null
    })

    if (!response) {
      if (generationId) {
        try {
          await db
            .update(logoGenerations)
            .set({
              status: "failed",
              error: translate("en", "errors.providerUnreachable"),
              updatedAt: new Date(),
            })
            .where(eq(logoGenerations.id, generationId))
        } catch (dbError) {
          console.error("Failed to update generation status:", dbError)
        }
      }

      // Refund credit if deducted
      if (creditDeducted && userId && generationId) {
        try {
          await addCredits(userId, creditsRequired, "refund", {
            logoGenerationId: generationId,
            description: translate(locale, "credits.refundProviderUnreachable"),
          })
        } catch (refundError) {
          console.error("Failed to refund credit:", refundError)
        }
      }

      return c.json({ error: t(c, "errors.providerUnreachable") }, 502)
    }

    const prediction = await safeJson<Record<string, unknown>>(response)

    if (!prediction) {
      if (generationId) {
        try {
          await db
            .update(logoGenerations)
            .set({
              status: "failed",
              error: translate("en", "errors.providerInvalidResponse"),
              updatedAt: new Date(),
            })
            .where(eq(logoGenerations.id, generationId))
        } catch (dbError) {
          console.error("Failed to update generation status:", dbError)
        }
      }

      // Refund credit if deducted
      if (creditDeducted && userId && generationId) {
        try {
          await addCredits(userId, creditsRequired, "refund", {
            logoGenerationId: generationId,
            description: translate(locale, "credits.refundProviderInvalid"),
          })
        } catch (refundError) {
          console.error("Failed to refund credit:", refundError)
        }
      }

      return c.json({ error: t(c, "errors.providerInvalidResponse") }, 502)
    }

    if (!response.ok) {
      if (generationId) {
        try {
          await db
            .update(logoGenerations)
            .set({
              status: "failed",
              error:
                (prediction && typeof prediction === "object" && "message" in prediction
                  ? String(prediction.message)
                  : undefined) || "Failed to create prediction",
              updatedAt: new Date(),
            })
            .where(eq(logoGenerations.id, generationId))
        } catch (dbError) {
          console.error("Failed to update generation status:", dbError)
        }
      }

      // Refund credit if deducted
      if (creditDeducted && userId && generationId) {
        try {
          await addCredits(userId, creditsRequired, "refund", {
            logoGenerationId: generationId,
            description: translate(locale, "credits.refundProviderError"),
          })
        } catch (refundError) {
          console.error("Failed to refund credit:", refundError)
        }
      }

      const message =
        (prediction && typeof prediction === "object" && "message" in prediction
          ? String(prediction.message)
          : undefined) || "Failed to create prediction"

      return c.newResponse(JSON.stringify({ error: message }), response.status as StatusCode, {
        "Content-Type": "application/json",
      })
    }

    const providerPredictionId = (() => {
      const fromRoot =
        prediction &&
          typeof prediction === "object" &&
          "id" in prediction &&
          typeof (prediction as { id?: unknown }).id === "string"
          ? (prediction as { id?: string }).id
          : null

      if (fromRoot) return fromRoot

      const nested =
        prediction &&
          typeof prediction === "object" &&
          "prediction" in prediction &&
          (prediction as { prediction?: unknown }).prediction &&
          typeof (prediction as { prediction?: unknown }).prediction === "object" &&
          typeof (prediction as { prediction?: { id?: unknown } }).prediction?.id === "string"
          ? ((prediction as { prediction?: { id?: string } }).prediction?.id as string)
          : null

      if (nested) return nested

      return generationId
    })()

    const imagesCandidate =
      prediction && typeof prediction === "object" && "output" in prediction
        ? (prediction as Record<string, unknown>).output
        : prediction && typeof prediction === "object" && "images" in prediction
          ? (prediction as Record<string, unknown>).images
          : undefined

    const imageList = Array.isArray(imagesCandidate)
      ? imagesCandidate.map((item: unknown) => (typeof item === "string" ? item : JSON.stringify(item)))
      : []

    const providerResponse =
      prediction && typeof prediction === "object" ? (prediction as Record<string, unknown>) : null
    const providerStatus: ProviderStatus =
      prediction && typeof prediction === "object" && "status" in prediction
        ? statusMap[String((prediction as { status?: unknown }).status)] ?? "running"
        : imageList.length > 0
          ? "succeeded"
          : "running"

    if (generationId) {
      try {
        await db
          .update(logoGenerations)
          .set({
            status: providerStatus,
            providerPredictionId,
            images: imageList,
            providerResponse,
            updatedAt: new Date(),
          })
          .where(eq(logoGenerations.id, generationId))
      } catch (dbError) {
        console.error("Failed to update generation status:", dbError)
      }
    }

    return c.json({ predictionID: providerPredictionId, prediction })
  } catch (error) {
    console.error("Prediction error:", error)

    if (generationId) {
      try {
        await db
          .update(logoGenerations)
          .set({
            status: "failed",
            error: translate("en", "errors.internalError"),
            updatedAt: new Date(),
          })
          .where(eq(logoGenerations.id, generationId))
      } catch (dbError) {
        console.error("Failed to update generation status:", dbError)
      }
    }

    // Refund credit if deducted
    if (creditDeducted && userId && generationId) {
      try {
        await addCredits(userId, creditsRequired, "refund", {
          logoGenerationId: generationId,
          description: translate(locale, "credits.refundInternalError"),
        })
      } catch (refundError) {
        console.error("Failed to refund credit:", refundError)
      }
    }

    return c.json({ error: t(c, "errors.internalError") }, 500)
  }
})

predictions.get("/:id", async (c) => {
  try {
    const parsedParams = paramsSchema.safeParse({ id: c.req.param("id") })
    if (!parsedParams.success) {
      return c.json({ error: t(c, "errors.invalidPredictionId") }, 400)
    }

    const { id } = parsedParams.data
    const user = await getAuthUser(c.req.raw)

    if (!user) {
      return c.json({ error: t(c, "errors.authRequired") }, 401)
    }

    const [generation] = await db
      .select({
        userId: logoGenerations.userId,
        id: logoGenerations.id,
      })
      .from(logoGenerations)
      .where(eq(logoGenerations.providerPredictionId, id))
      .limit(1)

    if (!generation) {
      return c.json({ error: t(c, "errors.predictionNotFound") }, 404)
    }

    if (generation.userId !== user.id) {
      return c.json({ error: t(c, "errors.forbidden") }, 403)
    }

    const apiKey = process.env.EACHLABS_API_KEY

    if (!apiKey) {
      return c.json({ error: t(c, "errors.configMissing") }, 500)
    }

    const response = await fetchWithTimeout(`${EACHLABS_API_URL}/${id}`, {
      method: "GET",
      headers: {
        "X-API-Key": apiKey,
      },
    }).catch((error) => {
      console.error("Prediction fetch failed:", error)
      return null
    })

    if (!response) {
      return c.json({ error: t(c, "errors.providerUnreachable") }, 502)
    }

    const prediction = await safeJson<Record<string, unknown>>(response)

    if (!prediction) {
      return c.json({ error: t(c, "errors.providerInvalidResponse") }, 502)
    }

    if (response.ok && prediction) {
      const imagesCandidate = prediction?.output ?? prediction?.images
      const imageList = Array.isArray(imagesCandidate)
        ? imagesCandidate.map((item: unknown) => (typeof item === "string" ? item : JSON.stringify(item)))
        : []

      const status: ProviderStatus =
        prediction && typeof prediction === "object" && "status" in prediction
          ? statusMap[String((prediction as { status?: unknown }).status)] ?? "running"
          : "running"

      try {
        await db
          .update(logoGenerations)
          .set({
            status,
            images: imageList,
            providerResponse: prediction,
            updatedAt: new Date(),
          })
          .where(eq(logoGenerations.providerPredictionId, id))
      } catch (dbError) {
        console.error("Failed to sync prediction status:", dbError)
      }
    }

    if (!response.ok) {
      const message =
        (prediction && typeof prediction === "object" && "message" in prediction
          ? String(prediction.message)
          : undefined) || "Failed to fetch prediction"

      return c.newResponse(JSON.stringify({ error: message }), response.status as StatusCode, {
        "Content-Type": "application/json",
      })
    }

    return c.json(prediction)
  } catch (error) {
    console.error("Prediction fetch error:", error)
    return c.json({ error: t(c, "errors.internalError") }, 500)
  }
})
