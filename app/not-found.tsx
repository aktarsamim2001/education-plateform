import Link from "next/link"

import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center">
      <h1 className="text-8xl font-bold">404</h1>
      <h2 className="mt-4 text-2xl font-bold">Page Not Found</h2>
      <p className="mt-2 max-w-md text-muted-foreground">
        The page you are looking for doesn't exist or has been moved.
      </p>
      <div className="mt-8 flex gap-4">
        <Button asChild variant="outline">
          <Link href="/">Go back home</Link>
        </Button>
        <Button asChild>
          <Link href="/courses">Browse Courses</Link>
        </Button>
      </div>
    </div>
  )
}
