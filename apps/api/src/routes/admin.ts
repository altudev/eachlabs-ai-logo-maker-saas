import { Hono } from "hono"
import { eq, desc } from "drizzle-orm"
import { z } from "zod"

import { db } from "../db"
import { userCreditBalances, creditTransactions } from "../db/schemas"
import { getAuthUser, addCredits, getUserBalance } from "./credits"
import { t } from "../i18n"

type AdminUser = { id: string; email: string }

// Simple admin check - can be expanded to use roles/permissions
const ADMIN_EMAILS = (process.env.ADMIN_EMAILS ?? "").split(",").map((e) => e.trim().toLowerCase()).filter(Boolean)

async function isAdmin(req: Request): Promise<{ isAdmin: boolean; user: AdminUser | null }> {
  const user = await getAuthUser(req)

  if (!user || !user.email) {
    return { isAdmin: false, user: null }
  }

  // Check if user email is in admin list
  const isAdminUser = ADMIN_EMAILS.includes(user.email.toLowerCase())

  return { isAdmin: isAdminUser, user: { id: user.id, email: user.email } }
}

const adjustCreditsSchema = z.object({
  userId: z.string().min(1),
  amount: z.number().int().positive(),
  type: z.enum(["add", "remove"]),
  reason: z.string().min(1).max(500),
})

const userIdParamSchema = z.object({
  userId: z.string().min(1),
})

export const admin = new Hono<{ Variables: { adminUser: AdminUser } }>()

/**
 * Middleware to check admin access
 */
admin.use("*", async (c, next) => {
  const { isAdmin: isAdminUser, user } = await isAdmin(c.req.raw)

  if (!user) {
    return c.json({ error: t(c, "errors.authRequired") }, 401)
  }

  if (!isAdminUser) {
    return c.json({ error: t(c, "errors.adminRequired") }, 403)
  }

  // Store admin user info for later use
  c.set("adminUser", user)

  await next()
})

/**
 * POST /api/admin/credits/adjust
 * Manually adjust a user's credit balance
 */
admin.post("/credits/adjust", async (c) => {
  try {
    const body = await c.req.json()
    const parsed = adjustCreditsSchema.safeParse(body)

    if (!parsed.success) {
      return c.json({ error: t(c, "validation.invalidRequest"), details: parsed.error.format() }, 400)
    }

    const { userId, amount, type, reason } = parsed.data
    const adminUser = c.get("adminUser")

    const transactionType = type === "add" ? "adjustment_add" : "adjustment_remove"
    const creditAmount = type === "add" ? amount : -amount

    // For removals, check if user has enough credits
    if (type === "remove") {
      const currentBalance = await getUserBalance(userId)
      if (currentBalance < amount) {
        return c.json({
          error: t(c, "credits.insufficientCredits"),
          currentBalance,
          requestedRemoval: amount,
        }, 400)
      }
    }

    const result = await addCredits(userId, creditAmount, transactionType, {
      description: t(c, "credits.adminAdjustment", { reason }),
      performedBy: adminUser.id,
      metadata: {
        adminEmail: adminUser.email,
        reason,
        type,
      },
    })

    if (!result.success) {
      return c.json({ error: t(c, "credits.adjustFailed") }, 500)
    }

    console.log(`Admin ${adminUser.email} adjusted credits for user ${userId}: ${type} ${amount} (${reason})`)

    return c.json({
      success: true,
      adjustment: {
        userId,
        type,
        amount,
        reason,
        newBalance: result.newBalance,
        performedBy: adminUser.email,
      },
    })
  } catch (error) {
    console.error("Failed to adjust credits:", error)
    return c.json({ error: t(c, "credits.adjustFailed") }, 500)
  }
})

/**
 * GET /api/admin/users/:userId/balance
 * Get a user's credit balance and stats
 */
admin.get("/users/:userId/balance", async (c) => {
  try {
    const params = userIdParamSchema.safeParse({ userId: c.req.param("userId") })

    if (!params.success) {
      return c.json({ error: t(c, "errors.invalidUserId") }, 400)
    }

    const { userId } = params.data

    const [balance] = await db
      .select({
        userId: userCreditBalances.userId,
        balance: userCreditBalances.balance,
        totalPurchased: userCreditBalances.totalPurchased,
        totalUsed: userCreditBalances.totalUsed,
        lastTransactionAt: userCreditBalances.lastTransactionAt,
        createdAt: userCreditBalances.createdAt,
      })
      .from(userCreditBalances)
      .where(eq(userCreditBalances.userId, userId))
      .limit(1)

    if (!balance) {
      return c.json({ error: t(c, "errors.userNotFound") }, 404)
    }

    return c.json({ balance })
  } catch (error) {
    console.error("Failed to fetch user balance:", error)
    return c.json({ error: t(c, "credits.fetchUserBalanceFailed") }, 500)
  }
})

/**
 * GET /api/admin/users/:userId/transactions
 * Get a user's transaction history
 */
admin.get("/users/:userId/transactions", async (c) => {
  try {
    const params = userIdParamSchema.safeParse({ userId: c.req.param("userId") })

    if (!params.success) {
      return c.json({ error: t(c, "errors.invalidUserId") }, 400)
    }

    const { userId } = params.data
    const limit = Math.min(Number(c.req.query("limit")) || 50, 100)
    const offset = Number(c.req.query("offset")) || 0

    const transactions = await db
      .select({
        id: creditTransactions.id,
        type: creditTransactions.type,
        amount: creditTransactions.amount,
        balanceAfter: creditTransactions.balanceAfter,
        description: creditTransactions.description,
        polarOrderId: creditTransactions.polarOrderId,
        logoGenerationId: creditTransactions.logoGenerationId,
        performedBy: creditTransactions.performedBy,
        metadata: creditTransactions.metadata,
        createdAt: creditTransactions.createdAt,
      })
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, userId))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(limit)
      .offset(offset)

    return c.json({
      transactions,
      pagination: { limit, offset },
    })
  } catch (error) {
    console.error("Failed to fetch user transactions:", error)
    return c.json({ error: t(c, "credits.fetchUserTransactionsFailed") }, 500)
  }
})
