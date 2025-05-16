"use client"

import ErrorBoundary from "@/components/error-boundary"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <html lang="en">
      <body>
        <ErrorBoundary error={error} reset={reset} />
      </body>
    </html>
  )
}
