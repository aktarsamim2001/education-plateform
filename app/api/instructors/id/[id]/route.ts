import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"
import { Course } from "@/lib/models/mongodb/course"
import { Webinar } from "@/lib/models/mongodb/webinar"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    await dbConnect()

    const instructor = await User.findById(id).select(
      "firstName lastName avatar bio expertise rating reviews students courses webinars",
    )

    if (!instructor || instructor.role !== "instructor") {
      return NextResponse.json({ error: "Instructor not found" }, { status: 404 })
    }

    // Get instructor's courses
    const courses = await Course.find({ instructorId: id, status: "published" }).sort({ createdAt: -1 }).limit(6)

    // Get instructor's webinars
    const webinars = await Webinar.find({ instructorId: id }).sort({ date: 1 }).limit(6)

    return NextResponse.json({ instructor, courses, webinars })
  } catch (error) {
    console.error("Error fetching instructor:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
