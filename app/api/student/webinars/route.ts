import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"
import { Webinar } from "@/lib/models/mongodb/webinar"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Get user's registered webinars
    const user = await User.findOne({ email: session.user.email }).select("registeredWebinars")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get webinar details for registered webinars
    const registeredWebinarIds = user.registeredWebinars || []
    const webinars = await Webinar.find({ _id: { $in: registeredWebinarIds } })
      .populate("instructorId", "firstName lastName")
      .sort({ date: 1 })
      .lean()

    // Format the data for the frontend
    const formattedWebinars = webinars.map((webinar) => ({
      id: webinar._id.toString(),
      title: webinar.title,
      slug: webinar.slug,
      thumbnail: webinar.thumbnail,
      instructorName: webinar.instructorId
        ? `${webinar.instructorId.firstName} ${webinar.instructorId.lastName}`
        : "Unknown Instructor",
      date: new Date(webinar.date).toLocaleDateString(),
      time: new Date(webinar.date).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      status: webinar.status,
      isFree: webinar.isFree,
      price: webinar.price,
    }))

    return NextResponse.json({ webinars: formattedWebinars })
  } catch (error) {
    console.error("Error fetching student webinars:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
