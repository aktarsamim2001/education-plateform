import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import { Course } from "@/lib/models/mongodb/course"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    // Check if user is authenticated and is an admin
    if (!session || session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Get all courses with instructor details
    const courses = await Course.find({}).populate("instructorId", "firstName lastName").sort({ createdAt: -1 }).lean()

    // Format the data for the frontend
    const formattedCourses = courses.map((course) => ({
      id: course._id.toString(),
      title: course.title,
      slug: course.slug,
      thumbnail: course.thumbnail,
      price: course.price,
      category: course.category,
      level: course.level,
      status: course.status,
      students: course.students,
      instructor: course.instructorId ? `${course.instructorId.firstName} ${course.instructorId.lastName}` : "Unknown",
      createdAt: course.createdAt,
      updatedAt: course.updatedAt,
    }))

    return NextResponse.json({ courses: formattedCourses })
  } catch (error) {
    console.error("Error fetching courses for admin:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
