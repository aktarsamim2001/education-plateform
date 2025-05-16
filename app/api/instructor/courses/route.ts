import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import dbConnect from "@/lib/db-connect"
import { Course } from "@/lib/models/mongodb/course"
import { User } from "@/lib/models/mongodb/user"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })

    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const courses = await Course.find({ instructor: user._id }).sort({ createdAt: -1 })

    return NextResponse.json({ courses })
  } catch (error) {
    console.error("Error fetching instructor courses:", error)
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const user = await User.findOne({ email: session.user.email })

    if (!user || user.role !== "instructor") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()

    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^\w\s]/gi, "")
      .replace(/\s+/g, "-")

    // Check if slug already exists
    const existingCourse = await Course.findOne({ slug })
    if (existingCourse) {
      return NextResponse.json({ error: "Course with similar title already exists" }, { status: 409 })
    }

    // Create new course
    const course = new Course({
      ...data,
      slug,
      instructor: user._id,
      status: data.status || "draft", // Default to draft if not specified
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await course.save()

    return NextResponse.json({ course }, { status: 201 })
  } catch (error) {
    console.error("Error creating course:", error)
    return NextResponse.json({ error: "Failed to create course" }, { status: 500 })
  }
}
