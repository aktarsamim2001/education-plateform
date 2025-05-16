"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import { Loader2 } from "lucide-react"

export default function DashboardRedirector() {
  const { data: session, status } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (status === "authenticated") {
      const role = session?.user?.role

      if (role === "admin") {
        router.push("/dashboard/admin")
      } else if (role === "instructor") {
        router.push("/dashboard/instructor")
      } else {
        router.push("/dashboard/student")
      }
    } else if (status === "unauthenticated") {
      router.push("/auth/login")
    }
  }, [status, session, router])

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="text-center">
        <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
        <p className="mt-4 text-lg">Redirecting to your dashboard...</p>
      </div>
    </div>
  )
}
