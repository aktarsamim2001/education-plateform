import { type NextRequest, NextResponse } from "next/server"
import dbConnect from "@/lib/db-connect"
import { CourseProgress } from "@/lib/models/mongodb/course"
import { getServerSession } from "next-auth/next"
import { authOptions } from "../../../../auth/[...nextauth]/route"
import { Course } from "@/lib/models/mongodb/course"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const progress = await CourseProgress.findOne({
      userId: session.user.id,
      courseId: id,
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

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const session = await getServerSession(authOptions)
    const { lessonId } = await req.json()

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    if (!lessonId) {
      return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 })
    }

    await dbConnect()

    // Find or create progress
    let progress = await CourseProgress.findOne({
      userId: session.user.id,
      courseId: id,
    })

    if (!progress) {
      progress = await CourseProgress.create({
        userId: session.user.id,
        courseId: id,
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
    const course = await Course.findById(id)
    if (!course || !course.lessons) {
      return NextResponse.json({ error: "Course or lessons not found" }, { status: 404 })
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
