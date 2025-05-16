import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import { Webinar } from "@/lib/models/mongodb/webinar"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await dbConnect()

    const webinar = await Webinar.findOne({ slug: params.slug })
      .populate("instructorId", "firstName lastName avatar bio")
      .lean()

    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 })
    }

    return NextResponse.json({ webinar })
  } catch (error) {
    console.error("Error fetching webinar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const webinar = await Webinar.findOne({ slug })

    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 })
    }

    // Check if user is the instructor or an admin
    if (webinar.instructorId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const webinarData = await req.json()

    // Update webinar
    const updatedWebinar = await Webinar.findOneAndUpdate({ slug }, webinarData, { new: true })

    return NextResponse.json({ webinar: updatedWebinar })
  } catch (error) {
    console.error("Error updating webinar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const webinar = await Webinar.findOne({ slug })

    if (!webinar) {
      return NextResponse.json({ error: "Webinar not found" }, { status: 404 })
    }

    // Check if user is the instructor or an admin
    if (webinar.instructorId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete webinar
    await Webinar.findOneAndDelete({ slug })

    return NextResponse.json({ message: "Webinar deleted successfully" })
  } catch (error) {
    console.error("Error deleting webinar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
