import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import User from "@/lib/models/mongodb/user"
import { Course } from "@/lib/models/mongodb/course"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Get user's enrolled courses
    const user = await User.findOne({ email: session.user.email }).select("enrolledCourses")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Get course details for enrolled courses
    const enrolledCourseIds = user.enrolledCourses || []
    const courses = await Course.find({ _id: { $in: enrolledCourseIds } })
      .populate("instructorId", "firstName lastName")
      .sort({ createdAt: -1 })
      .lean()

    // Format the data for the frontend
    const formattedCourses = courses.map((course) => ({
      id: course._id.toString(),
      title: course.title,
      slug: course.slug,
      thumbnail: course.thumbnail,
      instructorName: course.instructorId
        ? `${course.instructorId.firstName} ${course.instructorId.lastName}`
        : "Unknown Instructor",
      progress: course.progress || 0,
      totalLessons: course.totalLessons || 0,
      completedLessons: course.completedLessons || 0,
    }))

    return NextResponse.json({ courses: formattedCourses })
  } catch (error) {
    console.error("Error fetching student courses:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
