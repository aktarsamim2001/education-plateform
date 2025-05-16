import NextAuth from "next-auth"
import type { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GitHubProvider from "next-auth/providers/github"
import { compare } from "bcryptjs"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"

export const authOptions: NextAuthOptions = {
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
      profile(profile) {
        return {
          id: profile.id.toString(),
          name: profile.name || profile.login,
          email: profile.email,
          image: profile.avatar_url,
          role: "student", // Default role for GitHub sign-ins
        }
      },
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        await dbConnect()

        const user = await User.findOne({ email: credentials.email })

        if (!user) {
          return null
        }

        const isPasswordValid = await compare(credentials.password, user.password)

        if (!isPasswordValid) {
          return null
        }

        // Update last login
        await User.findByIdAndUpdate(user._id, { lastLogin: new Date() })

        return {
          id: user._id.toString(),
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          role: user.role,
          image: user.avatar,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }

      // If signing in with OAuth and user doesn't exist yet, create them
      if (account?.provider === "github") {
        await dbConnect()
        const existingUser = await User.findOne({ email: token.email })

        if (!existingUser && token.email) {
          const newUser = await User.create({
            email: token.email,
            firstName: token.name?.split(" ")[0] || "GitHub",
            lastName: token.name?.split(" ").slice(1).join(" ") || "User",
            password: Math.random().toString(36).slice(-10), // Random password
            role: "student",
            avatar: token.picture,
            emailVerified: true,
          })

          token.id = newUser._id.toString()
          token.role = "student"
        } else if (existingUser) {
          token.id = existingUser._id.toString()
          token.role = existingUser.role
        }
      }

      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }
