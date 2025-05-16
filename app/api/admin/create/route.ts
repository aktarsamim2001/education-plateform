import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"
import { hash } from "bcryptjs"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Only allow this endpoint to be called by an existing admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { firstName, lastName, email, password } = await req.json()

    // Validate input
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    await dbConnect()

    // Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 409 })
    }

    // Hash password
    const hashedPassword = await hash(password, 12)

    // Create new admin user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role: "admin",
    })

    // Remove password from response
    const newUser = {
      id: user._id.toString(),
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
    }

    return NextResponse.json({ user: newUser }, { status: 201 })
  } catch (error) {
    console.error("Admin creation error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
