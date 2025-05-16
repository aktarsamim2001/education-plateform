"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter, usePathname } from "next/navigation"
import { Loader2 } from "lucide-react"

interface RouteGuardProps {
  children: React.ReactNode
  allowedRoles?: string[]
}

export function RouteGuard({ children, allowedRoles = [] }: RouteGuardProps) {
  const { data: session, status } = useSession()
  const router = useRouter()
  const pathname = usePathname()
  const [authorized, setAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if the route requires authentication
    const authCheck = () => {
      setIsLoading(true)

      if (status === "loading") return

      // If not authenticated at all
      if (status === "unauthenticated") {
        setAuthorized(false)
        router.push(`/auth/login?callbackUrl=${encodeURIComponent(pathname)}`)
        return
      }

      // If authenticated but role check is needed
      if (status === "authenticated" && allowedRoles.length > 0) {
        const userRole = session?.user?.role

        if (!userRole || !allowedRoles.includes(userRole)) {
          setAuthorized(false)
          // Redirect based on role
          if (userRole === "admin") {
            router.push("/dashboard/admin")
          } else if (userRole === "instructor") {
            router.push("/dashboard/instructor")
          } else {
            router.push("/dashboard/student")
          }
          return
        }
      }

      setAuthorized(true)
      setIsLoading(false)
    }

    authCheck()

    // Set up an event listener for route changes
    const handleRouteChange = () => {
      authCheck()
    }

    // Clean up the event listener
    return () => {
      // Remove event listener if needed
    }
  }, [status, session, router, pathname, allowedRoles])

  // Show loading indicator while checking authentication
  if (isLoading || status === "loading" || !authorized) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return <>{children}</>
}

export default RouteGuard
