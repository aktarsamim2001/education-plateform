import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"
import { withRoleCheck } from "@/lib/api-middleware"

async function getUsers(req: NextRequest) {
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const page = Number.parseInt(searchParams.get("page") || "1")
  const limit = Number.parseInt(searchParams.get("limit") || "10")
  const search = searchParams.get("search") || ""
  const role = searchParams.get("role") || ""

  const skip = (page - 1) * limit

  // Build query
  const query: any = {}

  if (search) {
    query.$or = [
      { firstName: { $regex: search, $options: "i" } },
      { lastName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ]
  }

  if (role) {
    query.role = role
  }

  // Execute query
  const users = await User.find(query).select("-password").sort({ createdAt: -1 }).skip(skip).limit(limit).lean()

  const total = await User.countDocuments(query)

  return NextResponse.json({
    users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    },
  })
}

export const GET = withRoleCheck([
  {
    handler: getUsers,
    roles: ["admin"],
  },
])

export const POST = withRoleCheck([
  {
    handler: async (req: NextRequest) => {
      await dbConnect()

      const data = await req.json()

      // Validate input
      if (!data.firstName || !data.lastName || !data.email || !data.password || !data.role) {
        return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
      }

      // Check if user already exists
      const existingUser = await User.findOne({ email: data.email })
      if (existingUser) {
        return NextResponse.json({ error: "User with this email already exists" }, { status: 409 })
      }

      // Create new user
      const newUser = await User.create(data)

      // Return user without password
      const user = newUser.toObject()
      delete user.password

      return NextResponse.json(user, { status: 201 })
    },
    roles: ["admin"],
  },
])
