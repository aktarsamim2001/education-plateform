import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import { User } from "@/lib/models/mongodb/user"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const { userId, role } = await req.json()

    if (!userId || !role) {
      return NextResponse.json({ error: "User ID and role are required" }, { status: 400 })
    }

    // Validate role
    if (!["student", "instructor", "admin"].includes(role)) {
      return NextResponse.json({ error: "Invalid role" }, { status: 400 })
    }

    // Update user role
    const updatedUser = await User.findByIdAndUpdate(userId, { role }, { new: true })

    if (!updatedUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    return NextResponse.json({
      message: "User role updated successfully",
      user: {
        id: updatedUser._id,
        name: `${updatedUser.firstName} ${updatedUser.lastName}`,
        email: updatedUser.email,
        role: updatedUser.role,
      },
    })
  } catch (error) {
    console.error("Error updating user role:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
