import "dotenv/config"
import { Hono } from "hono"
import { cors } from "hono/cors"

import { auth } from "./auth"
import { predictions } from "./routes/predictions"
import { credits } from "./routes/credits"
import { webhooks } from "./routes/webhooks"
import { generations } from "./routes/generations"
import { admin } from "./routes/admin"
import { strictRateLimit, moderateRateLimit } from "./middleware/rate-limit"
import { i18nMiddleware } from "./i18n"

const app = new Hono()

const allowedOrigins =
  process.env.ALLOWED_ORIGINS?.split(",").map((origin) => origin.trim()).filter(Boolean) ?? [
    "http://localhost:3000",
    "http://localhost:3002",
  ]

app.use(
  "*",
  cors({
    origin: allowedOrigins,
    credentials: true,
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowHeaders: ["Content-Type", "X-API-Key", "Authorization", "X-Language", "Accept-Language"],
  })
)

// i18n middleware - detect language from headers
app.use("*", i18nMiddleware())

app.get("/", (c) => c.text("API is running"))
app.get("/health", (c) => c.json({ status: "ok" }))

app.on(["POST", "GET"], "/api/auth/*", (c) => auth.handler(c.req.raw))

// Apply strict rate limiting to predictions (10/min)
app.use("/api/predictions/*", strictRateLimit)
app.route("/api/predictions", predictions)

// Apply moderate rate limiting to credits (30/min)
app.use("/api/credits/*", moderateRateLimit)
app.route("/api/credits", credits)

// No rate limiting on webhooks (they come from Polar.sh)
app.route("/api/webhooks", webhooks)

// User generations history
app.use("/api/generations/*", moderateRateLimit)
app.route("/api/generations", generations)

// Admin routes (rate limited)
app.use("/api/admin/*", moderateRateLimit)
app.route("/api/admin", admin)

const port = Number(process.env.PORT ?? 3002)

Bun.serve({
  port,
  fetch: app.fetch,
})

console.log(`API server listening on http://localhost:${port}`)
