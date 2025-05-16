import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import { Webinar } from "@/lib/models/mongodb/webinar"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await dbConnect()

    const webinar = await Webinar.findById(id).populate("instructorId", "firstName lastName avatar bio rating reviews")

    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 })
    }

    return NextResponse.json({ webinar })
  } catch (error) {
    console.error("Error fetching webinar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const webinar = await Webinar.findById(id)

    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 })
    }

    // Check if user is the instructor or an admin
    if (webinar.instructorId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const webinarData = await req.json()

    // Update webinar
    const updatedWebinar = await Webinar.findByIdAndUpdate(id, webinarData, { new: true })

    return NextResponse.json({ webinar: updatedWebinar })
  } catch (error) {
    console.error("Error updating webinar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const webinar = await Webinar.findById(id)

    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 })
    }

    // Check if user is the instructor or an admin
    if (webinar.instructorId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete webinar
    await Webinar.findByIdAndDelete(id)

    return NextResponse.json({ message: "Webinar deleted successfully" })
  } catch (error) {
    console.error("Error deleting webinar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
