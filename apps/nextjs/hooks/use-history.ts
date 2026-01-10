import { useQuery } from "@tanstack/react-query"

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002"

export type HistoryItem = {
    id: string
    appName: string
    appFocus: string
    color1: string
    color2: string
    model: string
    status: "queued" | "running" | "succeeded" | "failed"
    images: string[]
    creditsCharged: number
    createdAt: string
}

async function fetchHistory(): Promise<HistoryItem[]> {
    try {
        const response = await fetch(`${API_BASE_URL}/api/predictions`, {
            credentials: "include",
        })

        if (!response.ok) {
            const error = new Error(
                response.status === 401 ? "Sign in to view your history" : "Failed to fetch history"
            ) as Error & { status?: number }
            error.status = response.status
            throw error
        }

        const data = (await response.json()) as { history?: HistoryItem[] }
        return data.history ?? []
    } catch (error) {
        // Normalize network/unknown errors so the UI can render a friendly state
        if (error instanceof Error) {
            throw error
        }

        throw new Error("Failed to fetch history")
    }
}

export function useHistory() {
    return useQuery({
        queryKey: ["history"],
        queryFn: fetchHistory,
    })
}
