"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

interface ErrorBoundaryProps {
  error: Error & { digest?: string }
  reset: () => void
}

export default function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error("Application error:", error)
  }, [error])

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold">Something went wrong</h1>
        <p className="text-muted-foreground">
          We apologize for the inconvenience. Please try again or contact support if the problem persists.
        </p>
        {error.message && (
          <div className="rounded-md bg-destructive/10 p-4 text-destructive">
            <p className="text-sm font-medium">{error.message}</p>
          </div>
        )}
        <Button onClick={reset}>Try again</Button>
      </div>
    </div>
  )
}
