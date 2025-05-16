import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import { Course } from "@/lib/models/mongodb/course"
import User from "@/lib/models/mongodb/user"

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params
    const { lessonId } = await req.json()

    if (!lessonId) {
      return NextResponse.json({ error: "Lesson ID is required" }, { status: 400 })
    }

    await dbConnect()

    // Get course details
    const course = await Course.findOne({ slug })

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Check if user is enrolled in this course
    const user = await User.findById(session.user.id)

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const isEnrolled = user.enrolledCourses.some((courseId) => courseId.toString() === course._id.toString())

    if (!isEnrolled && session.user.role !== "admin") {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 401 })
    }

    // Find the progress record for this course
    const progressIndex = user.courseProgress.findIndex(
      (progress) => progress.courseId.toString() === course._id.toString(),
    )

    if (progressIndex === -1) {
      // Create new progress record if it doesn't exist
      user.courseProgress.push({
        courseId: course._id,
        completedLessons: [lessonId],
        lastAccessedLesson: lessonId,
        lastAccessedAt: new Date(),
        timeSpent: 0,
      })
    } else {
      // Update existing progress record
      const progress = user.courseProgress[progressIndex]

      // Add lesson to completed lessons if not already completed
      if (!progress.completedLessons.includes(lessonId)) {
        progress.completedLessons.push(lessonId)
      }

      progress.lastAccessedLesson = lessonId
      progress.lastAccessedAt = new Date()

      user.courseProgress[progressIndex] = progress
    }

    await user.save()

    // Calculate progress percentage
    let totalLessons = 0
    course.modules.forEach((module) => {
      totalLessons += module.lessons.length
    })

    const updatedProgress = user.courseProgress.find(
      (progress) => progress.courseId.toString() === course._id.toString(),
    )

    const completedLessons = updatedProgress.completedLessons.length
    const percentage = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0

    // Check if course is completed
    if (percentage === 100) {
      // Update user's completed courses
      if (!user.completedCourses.includes(course._id)) {
        user.completedCourses.push(course._id)
        await user.save()
      }
    }

    return NextResponse.json({
      success: true,
      progress: {
        completedLessons: updatedProgress.completedLessons,
        lastAccessedLesson: updatedProgress.lastAccessedLesson,
        percentage,
        timeSpent: updatedProgress.timeSpent || 0,
      },
    })
  } catch (error) {
    console.error("Error marking lesson as complete:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
