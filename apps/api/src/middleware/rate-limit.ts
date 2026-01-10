import type { Context, Next } from "hono"
import { translate, getLocale, type TranslationKey } from "../i18n"

interface RateLimitEntry {
  count: number
  resetAt: number
}

interface RateLimitConfig {
  windowMs: number // Time window in milliseconds
  maxRequests: number // Max requests per window
  keyGenerator?: (c: Context) => string // Custom key generator
  messageKey: TranslationKey // Translation key for error message
}

// In-memory store (for single instance deployments)
// For production with multiple instances, use Redis
const store = new Map<string, RateLimitEntry>()

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  for (const [key, entry] of store.entries()) {
    if (entry.resetAt < now) {
      store.delete(key)
    }
  }
}, 60_000) // Clean up every minute

function getClientIdentifier(c: Context): string {
  // Try to get user ID from auth (set by auth middleware)
  const userId = c.get("userId") as string | undefined
  if (userId) {
    return `user:${userId}`
  }

  // Fall back to IP address
  const forwarded = c.req.header("x-forwarded-for")
  const ip = forwarded?.split(",")[0]?.trim() || c.req.header("x-real-ip") || "unknown"
  return `ip:${ip}`
}

export function createRateLimiter(config: RateLimitConfig) {
  const {
    windowMs,
    maxRequests,
    keyGenerator = getClientIdentifier,
    messageKey,
  } = config

  return async (c: Context, next: Next) => {
    const key = keyGenerator(c)
    const now = Date.now()
    const entry = store.get(key)

    if (!entry || entry.resetAt < now) {
      // First request or window expired
      store.set(key, {
        count: 1,
        resetAt: now + windowMs,
      })
    } else {
      // Increment counter
      entry.count++

      if (entry.count > maxRequests) {
        const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
        const locale = getLocale(c)
        const message = translate(locale, messageKey)

        return c.json(
          {
            error: message,
            retryAfter,
          },
          429,
          {
            "Retry-After": String(retryAfter),
            "X-RateLimit-Limit": String(maxRequests),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": String(Math.ceil(entry.resetAt / 1000)),
          }
        )
      }
    }

    // Add rate limit headers
    const currentEntry = store.get(key)!
    c.header("X-RateLimit-Limit", String(maxRequests))
    c.header("X-RateLimit-Remaining", String(Math.max(0, maxRequests - currentEntry.count)))
    c.header("X-RateLimit-Reset", String(Math.ceil(currentEntry.resetAt / 1000)))

    await next()
  }
}

// Pre-configured rate limiters
export const strictRateLimit = createRateLimiter({
  windowMs: 60_000, // 1 minute
  maxRequests: 10, // 10 requests per minute
  messageKey: "rate-limit.strict",
})

export const moderateRateLimit = createRateLimiter({
  windowMs: 60_000, // 1 minute
  maxRequests: 30, // 30 requests per minute
  messageKey: "rate-limit.moderate",
})

export const relaxedRateLimit = createRateLimiter({
  windowMs: 60_000, // 1 minute
  maxRequests: 100, // 100 requests per minute
  messageKey: "rate-limit.relaxed",
})
