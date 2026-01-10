import { createAuthClient } from "better-auth/react"
import { anonymousClient } from "better-auth/client/plugins"
import { polarClient } from "@polar-sh/better-auth"

const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL

if (!baseURL) {
  throw new Error("NEXT_PUBLIC_API_BASE_URL is required for auth client")
}

export const authClient = createAuthClient({
  baseURL,
  plugins: [anonymousClient(), polarClient()],
})
