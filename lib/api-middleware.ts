import { type NextRequest, NextResponse } from "next/server"
import { getToken } from "next-auth/jwt"

type RoleHandler = {
  handler: (req: NextRequest, token: any) => Promise<NextResponse> | NextResponse
  roles: string[]
}

export function withRoleCheck(handlers: RoleHandler[]) {
  return async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

    // Check if user is authenticated
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Find the appropriate handler based on user role
    const userRole = token.role as string
    const handler = handlers.find((h) => h.roles.includes(userRole))

    if (!handler) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Execute the handler
    return handler.handler(req, token)
  }
}
