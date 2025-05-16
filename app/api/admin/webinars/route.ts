import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import { Webinar } from "@/lib/models/mongodb/webinar"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Get all webinars with instructor details
    const webinars = await Webinar.find({}).populate("instructorId", "firstName lastName").sort({ date: 1 }).lean()

    // Format the data for the frontend
    const formattedWebinars = webinars.map((webinar) => ({
      id: webinar._id.toString(),
      title: webinar.title,
      slug: webinar.slug,
      thumbnail: webinar.thumbnail,
      price: webinar.price,
      category: webinar.category,
      date: webinar.date,
      status: webinar.status,
      attendees: webinar.attendees?.length || 0,
      instructor: webinar.instructorId
        ? `${webinar.instructorId.firstName} ${webinar.instructorId.lastName}`
        : "Unknown",
      createdAt: webinar.createdAt,
      updatedAt: webinar.updatedAt,
    }))

    return NextResponse.json({ webinars: formattedWebinars })
  } catch (error) {
    console.error("Error fetching webinars for admin:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const webinarData = await req.json()

    // Create new webinar
    const newWebinar = new Webinar(webinarData)
    await newWebinar.save()

    return NextResponse.json(
      {
        message: "Webinar created successfully",
        webinar: newWebinar,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("Error creating webinar:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
