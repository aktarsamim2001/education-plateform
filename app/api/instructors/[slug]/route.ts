import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"
import { Course } from "@/lib/models/mongodb/course"
import { Webinar } from "@/lib/models/mongodb/webinar"

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    await dbConnect()

    // Find instructor by slug (assuming instructors have a slug field)
    // If not, you might need to find by ID or create a slug field for instructors
    const instructor = await User.findOne({
      slug,
      role: "instructor",
    }).select("firstName lastName avatar bio expertise rating reviews students courses webinars slug")

    if (!instructor) {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    // Get instructor's courses
    const courses = await Course.find({
      instructorId: instructor._id,
      status: "published",
    })
      .sort({ createdAt: -1 })
      .limit(6)

    // Get instructor's webinars
    const webinars = await Webinar.find({
      instructorId: instructor._id,
    })
      .sort({ date: 1 })
      .limit(6)

    return NextResponse.json({ instructor, courses, webinars })
  } catch (error) {
    console.error("Error fetching instructor:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
