import { NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"
import type { NextRequest } from "next/server"

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET })
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = [
    "/",
    "/auth/login",
    "/auth/register",
    "/auth/forgot-password",
    "/courses",
    "/webinars",
    "/blog",
    "/contact",
    "/about",
    "/instructors",
  ]

  // Check if the path is a public route or a static asset
  const isPublicRoute = publicRoutes.some((route) => pathname === route || pathname.startsWith(`${route}/`))
  const isStaticAsset =
    pathname.startsWith("/_next") ||
    pathname.startsWith("/images") ||
    pathname.includes(".") ||
    pathname.startsWith("/api/webhooks")

  // If it's a public route or static asset, allow access
  if (isPublicRoute || isStaticAsset) {
    return NextResponse.next()
  }

  // Check if the path is protected
  const isProtectedPath =
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    pathname.startsWith("/student") ||
    pathname.startsWith("/instructor") ||
    (pathname.startsWith("/api/") && !pathname.startsWith("/api/auth"))

  // Redirect to login if accessing protected route without being authenticated
  if (isProtectedPath && !token) {
    const url = new URL("/auth/login", request.url)
    url.searchParams.set("callbackUrl", encodeURI(pathname))
    return NextResponse.redirect(url)
  }

  // Role-based access control
  if (token) {
    const role = token.role as string

    // Admin routes
    if (pathname.startsWith("/dashboard/admin") && role !== "admin") {
      return redirectBasedOnRole(role, request.url)
    }

    // Student routes
    if (pathname.startsWith("/dashboard/student") && role !== "student" && role !== "admin") {
      return redirectBasedOnRole(role, request.url)
    }

    // Instructor routes
    if (pathname.startsWith("/dashboard/instructor") && role !== "instructor" && role !== "admin") {
      return redirectBasedOnRole(role, request.url)
    }

    // API routes with role-based access
    if (pathname.startsWith("/api/admin") && role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (pathname.startsWith("/api/instructor") && role !== "instructor" && role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }

    if (pathname.startsWith("/api/student") && role !== "student" && role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 })
    }
  }

  return NextResponse.next()
}

function redirectBasedOnRole(role: string, baseUrl: string): NextResponse {
  switch (role) {
    case "admin":
      return NextResponse.redirect(new URL("/dashboard/admin", baseUrl))
    case "instructor":
      return NextResponse.redirect(new URL("/dashboard/instructor", baseUrl))
    case "student":
      return NextResponse.redirect(new URL("/dashboard/student", baseUrl))
    default:
      return NextResponse.redirect(new URL("/auth/login", baseUrl))
  }
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    "/((?!_next/static|_next/image|favicon.ico).*)",
  ],
}
