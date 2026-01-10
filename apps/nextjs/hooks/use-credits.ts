"use client"

import { useQuery, useQueryClient } from "@tanstack/react-query"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002"

export interface CreditBalance {
  balance: number
  totalPurchased: number
  totalUsed: number
}

export interface CreditTransaction {
  id: string
  type: string
  amount: number
  balanceAfter: number
  description: string | null
  createdAt: string
}

export interface CreditPackage {
  id: string
  name: string
  credits: number
  priceInCents: number
  polarProductId?: string | null
  metadata: {
    description?: string
    popular?: boolean
    savings?: string
  } | null
}

async function fetchBalance(): Promise<CreditBalance> {
  const response = await fetch(`${API_BASE_URL}/api/credits/balance`, {
    credentials: "include",
  })

  if (!response.ok) {
    if (response.status === 401) {
      throw new Error("Please sign in to view credits")
    }
    throw new Error("Failed to fetch credit balance")
  }

  return response.json()
}

async function fetchTransactions(limit = 20): Promise<{ transactions: CreditTransaction[] }> {
  const response = await fetch(`${API_BASE_URL}/api/credits/transactions?limit=${limit}`, {
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch transactions")
  }

  return response.json()
}

async function fetchPackages(): Promise<{ packages: CreditPackage[] }> {
  const response = await fetch(`${API_BASE_URL}/api/credits/packages`, {
    credentials: "include",
  })

  if (!response.ok) {
    throw new Error("Failed to fetch packages")
  }

  return response.json()
}

/**
 * Hook to fetch and manage user's credit balance
 */
export function useCredits() {
  return useQuery({
    queryKey: ["credits", "balance"],
    queryFn: fetchBalance,
    staleTime: 30_000, // Consider fresh for 30 seconds
    retry: (failureCount, error) => {
      // Don't retry on auth errors
      if (error instanceof Error && error.message.includes("sign in")) {
        return false
      }
      return failureCount < 2
    },
  })
}

/**
 * Hook to fetch user's transaction history
 */
export function useCreditTransactions(limit = 20) {
  return useQuery({
    queryKey: ["credits", "transactions", limit],
    queryFn: () => fetchTransactions(limit),
    staleTime: 60_000, // Consider fresh for 1 minute
  })
}

/**
 * Hook to fetch available credit packages
 */
export function useCreditPackages() {
  return useQuery({
    queryKey: ["credits", "packages"],
    queryFn: fetchPackages,
    staleTime: 5 * 60_000, // Consider fresh for 5 minutes
  })
}

/**
 * Hook to invalidate credit queries after a purchase or generation
 */
export function useInvalidateCredits() {
  const queryClient = useQueryClient()

  return {
    invalidateBalance: () => {
      queryClient.invalidateQueries({ queryKey: ["credits", "balance"] })
    },
    invalidateTransactions: () => {
      queryClient.invalidateQueries({ queryKey: ["credits", "transactions"] })
    },
    invalidateAll: () => {
      queryClient.invalidateQueries({ queryKey: ["credits"] })
    },
  }
}
