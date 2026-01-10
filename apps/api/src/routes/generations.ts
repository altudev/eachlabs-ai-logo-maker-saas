import { Hono } from "hono"
import { eq, desc, and, sql } from "drizzle-orm"
import { z } from "zod"

import { db } from "../db"
import { logoGenerations } from "../db/schemas"
import { getAuthUser } from "./credits"
import { t } from "../i18n"

const querySchema = z.object({
  limit: z.coerce.number().min(1).max(100).optional().default(20),
  offset: z.coerce.number().min(0).optional().default(0),
  status: z.enum(["queued", "running", "succeeded", "failed"]).optional(),
})

const paramsSchema = z.object({
  id: z.string().uuid(),
})

export const generations = new Hono()

/**
 * GET /api/generations
 * List user's past logo generations
 */
generations.get("/", async (c) => {
  const user = await getAuthUser(c.req.raw)

  if (!user) {
    return c.json({ error: t(c, "errors.authRequired") }, 401)
  }

  try {
    const query = querySchema.safeParse({
      limit: c.req.query("limit"),
      offset: c.req.query("offset"),
      status: c.req.query("status"),
    })

    if (!query.success) {
      return c.json({ error: t(c, "errors.invalidQueryParams"), details: query.error.format() }, 400)
    }

    const { limit, offset, status } = query.data

    const conditions = [eq(logoGenerations.userId, user.id)]
    if (status) {
      conditions.push(eq(logoGenerations.status, status))
    }

    const results = await db
      .select({
        id: logoGenerations.id,
        appName: logoGenerations.appName,
        appFocus: logoGenerations.appFocus,
        color1: logoGenerations.color1,
        color2: logoGenerations.color2,
        model: logoGenerations.model,
        outputCount: logoGenerations.outputCount,
        status: logoGenerations.status,
        images: logoGenerations.images,
        creditsCharged: logoGenerations.creditsCharged,
        createdAt: logoGenerations.createdAt,
      })
      .from(logoGenerations)
      .where(and(...conditions))
      .orderBy(desc(logoGenerations.createdAt))
      .limit(limit)
      .offset(offset)

    // Get total count for pagination
    const [countResult] = await db
      .select({ count: sql<number>`count(*)` })
      .from(logoGenerations)
      .where(and(...conditions))
    const total = Number(countResult?.count ?? 0)

    return c.json({
      generations: results,
      pagination: {
        limit,
        offset,
        total,
        hasMore: offset + results.length < total,
      },
    })
  } catch (error) {
    console.error("Failed to fetch generations:", error)
    return c.json({ error: t(c, "errors.fetchGenerationsFailed") }, 500)
  }
})

/**
 * GET /api/generations/:id
 * Get details of a specific generation (must belong to user)
 */
generations.get("/:id", async (c) => {
  const user = await getAuthUser(c.req.raw)

  if (!user) {
    return c.json({ error: t(c, "errors.authRequired") }, 401)
  }

  try {
    const params = paramsSchema.safeParse({ id: c.req.param("id") })

    if (!params.success) {
      return c.json({ error: t(c, "errors.invalidGenerationId") }, 400)
    }

    const { id } = params.data

    const [generation] = await db
      .select({
        id: logoGenerations.id,
        appName: logoGenerations.appName,
        appFocus: logoGenerations.appFocus,
        color1: logoGenerations.color1,
        color2: logoGenerations.color2,
        model: logoGenerations.model,
        outputCount: logoGenerations.outputCount,
        prompt: logoGenerations.prompt,
        status: logoGenerations.status,
        images: logoGenerations.images,
        creditsCharged: logoGenerations.creditsCharged,
        error: logoGenerations.error,
        createdAt: logoGenerations.createdAt,
        updatedAt: logoGenerations.updatedAt,
      })
      .from(logoGenerations)
      .where(and(eq(logoGenerations.id, id), eq(logoGenerations.userId, user.id)))
      .limit(1)

    if (!generation) {
      return c.json({ error: t(c, "errors.generationNotFound") }, 404)
    }

    return c.json({ generation })
  } catch (error) {
    console.error("Failed to fetch generation:", error)
    return c.json({ error: t(c, "errors.fetchGenerationsFailed") }, 500)
  }
})
