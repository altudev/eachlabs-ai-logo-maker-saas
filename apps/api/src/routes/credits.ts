import { Hono } from "hono"
import { eq, desc, sql } from "drizzle-orm"

import { db } from "../db"
import { userCreditBalances, creditTransactions, creditPackages } from "../db/schemas"
import { auth } from "../auth"
import { t, translate, type SupportedLocale } from "../i18n"

type CreditTransactionType =
  | "signup_bonus"
  | "purchase"
  | "usage"
  | "refund"
  | "adjustment_add"
  | "adjustment_remove"

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

const SIGNUP_BONUS_CREDITS = Number.parseInt(process.env.SIGNUP_BONUS_CREDITS ?? "1", 10) || 1

/**
 * Get the authenticated user from the request
 */
export async function getAuthUser(req: Request) {
  const session = await auth.api.getSession({ headers: req.headers })
  return session?.user ?? null
}

/**
 * Initialize a user's credit balance with signup bonus (1 free credit)
 * This is idempotent - will not create duplicate records
 */
export async function initializeUserCredits(userId: string, locale: SupportedLocale = "en"): Promise<void> {
  const existing = await db
    .select({ userId: userCreditBalances.userId })
    .from(userCreditBalances)
    .where(eq(userCreditBalances.userId, userId))
    .limit(1)

  if (existing.length > 0) {
    return // Already initialized
  }

  const now = new Date()
  const descriptionKey = SIGNUP_BONUS_CREDITS === 1 ? "credits.welcomeBonus" : "credits.welcomeBonusPlural"
  const description = translate(locale, descriptionKey, { count: SIGNUP_BONUS_CREDITS })

  await db.transaction(async (tx) => {
    await tx.insert(userCreditBalances).values({
      userId,
      balance: SIGNUP_BONUS_CREDITS,
      totalPurchased: 0,
      totalUsed: 0,
      lastTransactionAt: now,
      createdAt: now,
      updatedAt: now,
    })

    await tx.insert(creditTransactions).values({
      userId,
      type: "signup_bonus",
      amount: SIGNUP_BONUS_CREDITS,
      balanceAfter: SIGNUP_BONUS_CREDITS,
      description,
      performedBy: "system",
      createdAt: now,
    })
  })
}

/**
 * Get a user's current credit balance
 * Initializes the user if they don't exist yet
 */
export async function getUserBalance(userId: string, locale: SupportedLocale = "en"): Promise<number> {
  await initializeUserCredits(userId, locale)

  const [result] = await db
    .select({ balance: userCreditBalances.balance })
    .from(userCreditBalances)
    .where(eq(userCreditBalances.userId, userId))
    .limit(1)

  return result?.balance ?? 0
}

/**
 * Check if user has sufficient credits
 */
export async function hasEnoughCredits(userId: string, required: number): Promise<boolean> {
  const balance = await getUserBalance(userId)
  return balance >= required
}

/**
 * Deduct credits from a user's balance
 * Returns true if successful, false if insufficient balance
 */
export async function deductCredits(
  userId: string,
  amount: number,
  logoGenerationId: string,
  description: string
): Promise<{ success: boolean; newBalance: number }> {
  const now = new Date()

  return await db.transaction(async (tx) => {
    // Lock the row and check balance
    const [current] = await tx
      .select({ balance: userCreditBalances.balance })
      .from(userCreditBalances)
      .where(eq(userCreditBalances.userId, userId))
      .for("update")

    if (!current || current.balance < amount) {
      return { success: false, newBalance: current?.balance ?? 0 }
    }

    const newBalance = current.balance - amount

    // Update balance
    await tx
      .update(userCreditBalances)
      .set({
        balance: newBalance,
        totalUsed: sql`${userCreditBalances.totalUsed} + ${amount}`,
        lastTransactionAt: now,
        updatedAt: now,
      })
      .where(eq(userCreditBalances.userId, userId))

    // Record transaction
    await tx.insert(creditTransactions).values({
      userId,
      type: "usage",
      amount: -amount,
      balanceAfter: newBalance,
      logoGenerationId,
      description,
      performedBy: "system",
      createdAt: now,
    })

    return { success: true, newBalance }
  })
}

/**
 * Add credits to a user's balance (for purchases)
 */
export async function addCredits(
  userId: string,
  amount: number,
  type: CreditTransactionType,
  options: {
    polarOrderId?: string
    polarProductId?: string
    description: string
    performedBy?: string
    metadata?: Record<string, unknown>
    logoGenerationId?: string
    locale?: SupportedLocale
  }
): Promise<{ success: boolean; newBalance: number }> {
  const now = new Date()
  const locale = options.locale ?? "en"

  // Initialize user if needed
  await initializeUserCredits(userId, locale)

  return await db.transaction(async (tx) => {
    // Lock the row
    const [current] = await tx
      .select({ balance: userCreditBalances.balance, totalPurchased: userCreditBalances.totalPurchased })
      .from(userCreditBalances)
      .where(eq(userCreditBalances.userId, userId))
      .for("update")

    if (!current) {
      return { success: false, newBalance: 0 }
    }

    const newBalance = current.balance + amount
    const isPurchase = type === "purchase"

    // Update balance
    await tx
      .update(userCreditBalances)
      .set({
        balance: newBalance,
        totalPurchased: isPurchase
          ? sql`${userCreditBalances.totalPurchased} + ${amount}`
          : current.totalPurchased,
        lastTransactionAt: now,
        updatedAt: now,
      })
      .where(eq(userCreditBalances.userId, userId))

    // Record transaction
    await tx.insert(creditTransactions).values({
      userId,
      type,
      amount,
      balanceAfter: newBalance,
      polarOrderId: options.polarOrderId,
      polarProductId: options.polarProductId,
      logoGenerationId: options.logoGenerationId,
      description: options.description,
      performedBy: options.performedBy ?? "system",
      metadata: options.metadata,
      createdAt: now,
    })

    return { success: true, newBalance }
  })
}

// ============================================================================
// ROUTES
// ============================================================================

export const credits = new Hono()

/**
 * GET /api/credits/balance
 * Get the authenticated user's credit balance
 */
credits.get("/balance", async (c) => {
  const user = await getAuthUser(c.req.raw)

  if (!user) {
    return c.json({ error: t(c, "errors.unauthorized") }, 401)
  }

  try {
    const locale = c.get("locale") ?? "en"
    const balance = await getUserBalance(user.id, locale)

    const [stats] = await db
      .select({
        totalPurchased: userCreditBalances.totalPurchased,
        totalUsed: userCreditBalances.totalUsed,
      })
      .from(userCreditBalances)
      .where(eq(userCreditBalances.userId, user.id))
      .limit(1)

    return c.json({
      balance,
      totalPurchased: stats?.totalPurchased ?? 0,
      totalUsed: stats?.totalUsed ?? 0,
    })
  } catch (error) {
    console.error("Failed to fetch balance:", error)
    return c.json({ error: t(c, "credits.fetchBalanceFailed") }, 500)
  }
})

/**
 * GET /api/credits/transactions
 * Get the authenticated user's transaction history
 */
credits.get("/transactions", async (c) => {
  const user = await getAuthUser(c.req.raw)

  if (!user) {
    return c.json({ error: t(c, "errors.unauthorized") }, 401)
  }

  try {
    const parsedLimit = Number.parseInt(c.req.query("limit") ?? "50", 10)
    const parsedOffset = Number.parseInt(c.req.query("offset") ?? "0", 10)
    const limit = Number.isFinite(parsedLimit) ? Math.min(Math.max(parsedLimit, 1), 100) : 50
    const offset = Number.isFinite(parsedOffset) && parsedOffset > 0 ? parsedOffset : 0

    const transactions = await db
      .select({
        id: creditTransactions.id,
        type: creditTransactions.type,
        amount: creditTransactions.amount,
        balanceAfter: creditTransactions.balanceAfter,
        description: creditTransactions.description,
        createdAt: creditTransactions.createdAt,
      })
      .from(creditTransactions)
      .where(eq(creditTransactions.userId, user.id))
      .orderBy(desc(creditTransactions.createdAt))
      .limit(limit)
      .offset(offset)

    return c.json({ transactions })
  } catch (error) {
    console.error("Failed to fetch transactions:", error)
    return c.json({ error: t(c, "credits.fetchTransactionsFailed") }, 500)
  }
})

/**
 * GET /api/credits/packages
 * Get available credit packages for purchase
 */
credits.get("/packages", async (c) => {
  try {
    const packages = await db
      .select({
        id: creditPackages.id,
        name: creditPackages.name,
        credits: creditPackages.credits,
        priceInCents: creditPackages.priceInCents,
        polarProductId: creditPackages.polarProductId,
        metadata: creditPackages.metadata,
      })
      .from(creditPackages)
      .where(eq(creditPackages.isActive, true))
      .orderBy(creditPackages.sortOrder)

    return c.json({ packages })
  } catch (error) {
    console.error("Failed to fetch packages:", error)
    return c.json({ error: t(c, "credits.fetchPackagesFailed") }, 500)
  }
})
