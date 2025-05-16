import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import { CourseProgress } from "@/lib/models/mongodb/course"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../auth/[...nextauth]/route"
import { Course } from "@/lib/models/mongodb/course"

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    // Find course by slug
    const course = await Course.findOne({ slug })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    const progress = await CourseProgress.findOne({
      userId: session.user.id,
      courseId: course._id,
    })

    if (!progress) {
      return NextResponse.json({ error: "Progress not found" }, { status: 404 })
    }

    return NextResponse.json({ progress })
  } catch (error) {
    console.error("Error fetching course progress:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function PUT(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params
    const session = await getServerSession(authOptions)
    const { lessonId } = await req.json()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!lessonId) {
      return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 })
    }

    await dbConnect()

    // Find course by slug
    const course = await Course.findOne({ slug })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Find or create progress
    let progress = await CourseProgress.findOne({
      userId: session.user.id,
      courseId: course._id,
    })

    if (!progress) {
      progress = await CourseProgress.create({
        userId: session.user.id,
        courseId: course._id,
        completedLessons: [lessonId],
        lastAccessedLesson: lessonId,
        progress: 0, // Will be calculated below
        lastAccessedAt: new Date(),
      })
    } else {
      // Update progress
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId)
      }
      progress.lastAccessedLesson = lessonId
      progress.lastAccessedAt = new Date()
    }

    // Calculate progress percentage
    if (!course.lessons) {
      return NextResponse.json({ error: "Course lessons not found" }, { status: 404 })
    }
    const totalLessons = course.lessons.length
    const completedLessons = progress.completedLessons.length
    progress.progress = Math.round((completedLessons / totalLessons) * 100)

    await progress.save()

    return NextResponse.json({ progress })
  } catch (error) {
    console.error("Error updating course progress:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
