import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import { Course } from "@/lib/models/mongodb/course"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../auth/[...nextauth]/route"

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    await dbConnect()

    const course = await Course.findOne({ slug: params.slug, status: "published" })
      .populate("instructorId", "firstName lastName avatar bio")
      .lean()

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    return NextResponse.json({ course })
  } catch (error) {
    console.error("Error fetching course:", error)
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

    const course = await Course.findOne({ slug })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Check if user is the instructor or an admin
    if (course.instructorId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courseData = await req.json()

    // Update course
    const updatedCourse = await Course.findOneAndUpdate({ slug }, courseData, { new: true })

    return NextResponse.json({ course: updatedCourse })
  } catch (error) {
    console.error("Error updating course:", error)
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

    const course = await Course.findOne({ slug })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Check if user is the instructor or an admin
    if (course.instructorId.toString() !== session.user.id && session.user.role !== "admin") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Delete course
    await Course.findOneAndDelete({ slug })

    return NextResponse.json({ message: "Course deleted successfully" })
  } catch (error) {
    console.error("Error deleting course:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
