import type { DefaultSession } from "next-auth"

declare module "next-auth" {
  interface User {
    id: string
    role: string
    name?: string | null
    email?: string | null
    image?: string | null
  }

  interface Session {
    user: {
      id: string
      role: string
    } & DefaultSession["user"]
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string
    role: string
  }
}
