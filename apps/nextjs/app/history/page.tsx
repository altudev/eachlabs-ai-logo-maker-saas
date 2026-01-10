"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { formatDistanceToNow } from "date-fns"
import {
    Download,
    MoreHorizontal,
    Search,
    Loader2,
    AlertCircle,
    ChevronLeft,
    ChevronRight
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Header } from "@/components/landing/Header"
import { useHistory, type HistoryItem } from "@/hooks/use-history"

const ITEMS_PER_PAGE = 8

export default function HistoryPage() {
    const { data: history, isLoading, error } = useHistory()
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)

    // Filter history based on search query
    const filteredHistory = history?.filter((item) =>
        item.appName.toLowerCase().includes(searchQuery.toLowerCase())
    ) ?? []

    // Pagination logic
    const totalPages = Math.ceil(filteredHistory.length / ITEMS_PER_PAGE)
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    const paginatedHistory = filteredHistory.slice(startIndex, startIndex + ITEMS_PER_PAGE)

    const handlePageChange = (page: number) => {
        setCurrentPage(page)
    }

    if (isLoading) {
        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex h-[50vh] w-full items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                </div>
            </div>
        )
    }

    if (error) {
        const status = (error as { status?: number })?.status
        const isUnauthorized = status === 401

        return (
            <div className="min-h-screen bg-background">
                <Header />
                <div className="flex h-[50vh] w-full flex-col items-center justify-center gap-4 text-center">
                    <div className="rounded-full bg-destructive/10 p-4">
                        <AlertCircle className="h-8 w-8 text-destructive" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="text-lg font-semibold">
                            {isUnauthorized ? "Sign in to view history" : "Failed to load history"}
                        </h3>
                        <p className="text-muted-foreground max-w-sm">
                            {error instanceof Error ? error.message : "An unexpected error occurred"}
                        </p>
                        {isUnauthorized ? (
                            <Button asChild className="mt-4">
                                <Link href="/login">Sign In</Link>
                            </Button>
                        ) : (
                            <Button className="mt-4" onClick={() => window.location.reload()}>
                                Retry
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background">
            <Header />
            <div className="container mx-auto max-w-7xl pt-24 pb-10 space-y-8">
                <div className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight">Your generation history</h1>
                    <p className="text-muted-foreground">
                        View and manage your previously generated logos.
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Generations</CardTitle>
                                <CardDescription>
                                    A list of your recent logo generations.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="flex items-center py-4">
                            <div className="relative w-full max-w-sm">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search by app name..."
                                    value={searchQuery}
                                    onChange={(e) => {
                                        setSearchQuery(e.target.value)
                                        setCurrentPage(1) // Reset to first page on search
                                    }}
                                    className="pl-9"
                                />
                            </div>
                            <div className="ml-auto text-sm text-muted-foreground">
                                {filteredHistory.length} result{filteredHistory.length !== 1 && "s"}
                            </div>
                        </div>

                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[300px]">Logo</TableHead>
                                        <TableHead>Model</TableHead>
                                        <TableHead>Credits</TableHead>
                                        <TableHead>Status</TableHead>
                                        <TableHead>Date</TableHead>
                                        <TableHead className="text-right">Actions</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {paginatedHistory.length === 0 ? (
                                        <TableRow>
                                            <TableCell colSpan={5} className="h-24 text-center">
                                                No results found.
                                            </TableCell>
                                        </TableRow>
                                    ) : (
                                        paginatedHistory.map((item) => (
                                            <TableRow key={item.id}>
                                                <TableCell>
                                                    <div className="flex items-center gap-3">
                                                        <div className="relative h-12 w-12 overflow-hidden rounded-lg border bg-muted">
                                                            {item.images && item.images.length > 0 ? (
                                                                <Image
                                                                    src={item.images[0]}
                                                                    alt={item.appName}
                                                                    fill
                                                                    className="object-cover"
                                                                />
                                                            ) : (
                                                                <div className="flex h-full w-full items-center justify-center bg-secondary text-xs text-muted-foreground">
                                                                    No img
                                                                </div>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-col">
                                                            <span className="font-medium">{item.appName}</span>
                                                            <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                                                                {item.appFocus}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <Badge variant="outline" className="font-mono text-xs">
                                                        {item.model}
                                                    </Badge>
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-1 text-sm font-medium">
                                                        <span>{item.creditsCharged}</span>
                                                        <span className="text-muted-foreground text-xs">credits</span>
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <StatusBadge status={item.status} />
                                                </TableCell>
                                                <TableCell className="text-muted-foreground text-sm">
                                                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                                                </TableCell>
                                                <TableCell className="text-right">
                                                    <div className="flex items-center justify-end gap-2">
                                                        {item.status === "succeeded" && item.images.length > 0 && (
                                                            <Button variant="outline" size="sm" asChild>
                                                                <a href={item.images[0]} download target="_blank" rel="noopener noreferrer">
                                                                    <Download className="mr-2 h-4 w-4" />
                                                                    Download
                                                                </a>
                                                            </Button>
                                                        )}
                                                        <Button variant="secondary" size="sm" className="cursor-pointer">
                                                            Details
                                                        </Button>
                                                    </div>
                                                </TableCell>
                                            </TableRow>
                                        ))
                                    )}
                                </TableBody>
                            </Table>
                        </div>

                        {/* Pagination Controls */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-end space-x-2 py-4">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage - 1)}
                                    disabled={currentPage === 1}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                    Previous
                                </Button>
                                <div className="text-sm font-medium">
                                    Page {currentPage} of {totalPages}
                                </div>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handlePageChange(currentPage + 1)}
                                    disabled={currentPage === totalPages}
                                >
                                    Next
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

function StatusBadge({ status }: { status: string }) {
    if (status === "succeeded") {
        return (
            <Badge variant="default" className="bg-green-500/15 text-green-700 hover:bg-green-500/25 border-green-500/20 dark:text-green-400">
                Succeeded
            </Badge>
        )
    }
    if (status === "failed") {
        return (
            <Badge variant="destructive" className="bg-red-500/15 text-red-700 hover:bg-red-500/25 border-red-500/20 dark:text-red-400">
                Failed
            </Badge>
        )
    }
    if (status === "running") {
        return (
            <Badge variant="secondary" className="animate-pulse bg-blue-500/15 text-blue-700 border-blue-500/20 dark:text-blue-400">
                Running
            </Badge>
        )
    }
    return <Badge variant="secondary">{status}</Badge>
}
