import { Hono, type Context } from "hono"
import { eq } from "drizzle-orm"
import crypto from "crypto"

import { db } from "../db"
import { creditTransactions, creditPackages } from "../db/schemas"
import { addCredits } from "./credits"
import { t, translate } from "../i18n"

// ============================================================================
// POLAR.SH WEBHOOK HANDLER
// ============================================================================

const POLAR_WEBHOOK_SECRET = process.env.POLAR_WEBHOOK_SECRET

/**
 * Verify Polar.sh webhook signature
 * Polar uses HMAC-SHA256 signature in the "webhook-signature" header
 */
function verifyPolarSignature(payload: string, signature: string | null, secret: string): boolean {
  if (!signature) return false

  try {
    // Polar signature format: "v1,timestamp,signature"
    const parts = signature.split(",")
    if (parts.length < 3) return false

    const timestamp = parts[1]
    const providedSignature = parts[2]

    // Create the signed payload (timestamp.payload)
    const signedPayload = `${timestamp}.${payload}`
    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(signedPayload)
      .digest("hex")

    return crypto.timingSafeEqual(
      Buffer.from(providedSignature),
      Buffer.from(expectedSignature)
    )
  } catch {
    return false
  }
}

type PolarCheckoutEvent = {
  type: "checkout.created" | "checkout.updated" | "order.created"
  data: {
    id: string
    status?: string
    product_id?: string
    product?: {
      id: string
      name?: string
    }
    customer_id?: string
    customer_email?: string
    customer?: {
      id: string
      email?: string
    }
    user_id?: string
    metadata?: Record<string, unknown>
    amount?: number
    currency?: string
  }
}

export const webhooks = new Hono()

/**
 * POST /api/webhooks/polar
 * Handle Polar.sh webhook events for credit purchases
 */
webhooks.post("/polar", async (c) => {
  try {
    const rawBody = await c.req.text()
    const signature = c.req.header("webhook-signature") ?? c.req.header("x-polar-signature")

    // Verify signature if secret is configured
    if (POLAR_WEBHOOK_SECRET) {
      if (!verifyPolarSignature(rawBody, signature ?? null, POLAR_WEBHOOK_SECRET)) {
        console.error("Polar webhook signature verification failed")
        return c.json({ error: t(c, "errors.invalidSignature") }, 401)
      }
    } else {
      console.warn("POLAR_WEBHOOK_SECRET not set - skipping signature verification")
    }

    const event = JSON.parse(rawBody) as PolarCheckoutEvent

    // Handle order.created event (successful payment)
    if (event.type === "order.created") {
      return await handleOrderCreated(c, event)
    }

    // Handle checkout.updated for completed checkouts
    if (event.type === "checkout.updated" && event.data.status === "succeeded") {
      return await handleOrderCreated(c, event)
    }

    // Acknowledge other events
    return c.json({ received: true, type: event.type })
  } catch (error) {
    console.error("Polar webhook error:", error)
    return c.json({ error: t(c, "errors.webhookFailed") }, 500)
  }
})

async function handleOrderCreated(c: Context, event: PolarCheckoutEvent) {
  const orderId = event.data.id
  const productId = event.data.product_id ?? event.data.product?.id
  const userId = event.data.user_id ?? event.data.metadata?.userId as string | undefined
  const customerEmail = event.data.customer_email ?? event.data.customer?.email

  if (!orderId) {
    console.error("Polar webhook: missing order ID")
    return c.json({ error: t(c, "errors.missingOrderId") }, 400)
  }

  // Check idempotency - has this order already been processed?
  const existing = await db
    .select({ id: creditTransactions.id })
    .from(creditTransactions)
    .where(eq(creditTransactions.polarOrderId, orderId))
    .limit(1)

  if (existing.length > 0) {
    console.log(`Polar webhook: order ${orderId} already processed`)
    return c.json({ received: true, status: "already_processed" })
  }

  // Find the package by Polar product ID
  let credits = 0
  let packageName = "Credit Package"

  if (productId) {
    const [pkg] = await db
      .select({ credits: creditPackages.credits, name: creditPackages.name })
      .from(creditPackages)
      .where(eq(creditPackages.polarProductId, productId))
      .limit(1)

    if (pkg) {
      credits = pkg.credits
      packageName = pkg.name
    }
  }

  // Fallback: calculate from amount if no package found (1 credit = $1 = 100 cents)
  if (credits === 0 && event.data.amount) {
    credits = Math.floor(event.data.amount / 100)
  }

  if (credits === 0) {
    console.error(`Polar webhook: could not determine credits for order ${orderId}`)
    return c.json({ error: t(c, "errors.creditsUndetermined") }, 400)
  }

  if (!userId) {
    console.error(`Polar webhook: missing user ID for order ${orderId}`)
    // Store the order for manual processing later
    return c.json({
      error: t(c, "errors.invalidUserId"),
      orderId,
      customerEmail,
      credits,
      status: "pending_user_link",
    }, 400)
  }

  // Add credits to user (use English for stored transaction description)
  const result = await addCredits(userId, credits, "purchase", {
    polarOrderId: orderId,
    polarProductId: productId,
    description: translate("en", "credits.purchaseDescription", { packageName, credits }),
    performedBy: "polar_webhook",
    metadata: {
      customerEmail,
      amount: event.data.amount,
      currency: event.data.currency,
    },
  })

  if (!result.success) {
    console.error(`Polar webhook: failed to add credits for order ${orderId}`)
    return c.json({ error: t(c, "credits.addFailed") }, 500)
  }

  console.log(`Polar webhook: added ${credits} credits for user ${userId}, order ${orderId}`)
  return c.json({
    received: true,
    status: "processed",
    credits,
    newBalance: result.newBalance,
  })
}

if (process.env.NODE_ENV !== "production") {
  /**
   * POST /api/webhooks/polar/test
   * Test endpoint for manual credit addition (development only)
   */
  webhooks.post("/polar/test", async (c) => {
    try {
      const { userId, credits, description } = await c.req.json()

      if (!userId || !credits) {
        return c.json({ error: t(c, "credits.userIdAndCreditsRequired") }, 400)
      }

      const result = await addCredits(userId, credits, "adjustment_add", {
        description: description ?? translate("en", "credits.testCreditAddition"),
        performedBy: "test_endpoint",
      })

      return c.json({
        success: result.success,
        newBalance: result.newBalance,
      })
    } catch (error) {
      console.error("Test webhook error:", error)
      return c.json({ error: t(c, "credits.addFailed") }, 500)
    }
  })
}
