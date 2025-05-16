"use client"

import { useEffect } from "react"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <AlertTriangle className="h-16 w-16 text-red-500" />
      <h2 className="mt-6 text-2xl font-bold">Something went wrong!</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        We apologize for the inconvenience. An unexpected error has occurred.
      </p>
      <div className="mt-6 flex gap-4">
        <Button onClick={reset} variant="outline">
          Try again
        </Button>
        <Button asChild>
          <Link href="/">Go back home</Link>
        </Button>
      </div>
      {process.env.NODE_ENV === "development" && (
        <div className="mt-8 max-w-md overflow-auto rounded-md bg-muted p-4 text-left">
          <p className="font-mono text-sm">{error.message}</p>
          {error.stack && <pre className="mt-2 text-xs text-muted-foreground">{error.stack}</pre>}
        </div>
      )}
    </div>
  )
}
