import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import dbConnect from "@/lib/db-connect"
import { apiMiddleware } from "@/lib/api-middleware"
import { Course, CourseProgress } from "@/lib/models/mongodb/course"

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const courseId = params.id
    const userId = session.user.id

    // Get course
    const course = await Course.findById(courseId)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Get course progress
    let courseProgress = await CourseProgress.findOne({ userId, courseId })

    if (!courseProgress) {
      // Create new progress record if it doesn't exist
      courseProgress = await CourseProgress.create({
        userId,
        courseId,
        completedLessons: [],
        progress: 0,
        lastAccessedAt: new Date(),
      })
    }

    // Calculate total lessons
    const totalLessons = course.modules.reduce((total, module) => total + module.lessons.length, 0)

    // Calculate module progress
    const moduleProgress = course.modules.map((module) => {
      const moduleLessons = module.lessons.map((lesson) => lesson._id.toString())
      const completedModuleLessons = courseProgress.completedLessons.filter((lessonId) =>
        moduleLessons.includes(lessonId.toString()),
      )

      return {
        id: module._id.toString(),
        title: module.title,
        totalLessons: module.lessons.length,
        completedLessons: completedModuleLessons.length,
        progress:
          module.lessons.length > 0 ? Math.round((completedModuleLessons.length / module.lessons.length) * 100) : 0,
      }
    })

    // Find next lesson to continue
    let nextLesson = null

    for (const module of course.modules) {
      for (const lesson of module.lessons) {
        if (!courseProgress.completedLessons.includes(lesson._id.toString())) {
          nextLesson = {
            id: lesson._id.toString(),
            title: lesson.title,
            moduleId: module._id.toString(),
            moduleTitle: module.title,
          }
          break
        }
      }
      if (nextLesson) break
    }

    // Calculate time spent (in a real implementation, this would come from actual tracking data)
    const timeSpent = courseProgress.completedLessons.length * 15 // Estimate 15 minutes per lesson

    return NextResponse.json({
      progress: {
        courseId: course._id.toString(),
        progress: courseProgress.progress,
        completedLessons: courseProgress.completedLessons,
        totalLessons,
        lastAccessed: courseProgress.lastAccessedAt,
        timeSpent,
        modules: moduleProgress,
        nextLesson,
      },
    })
  })
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  return apiMiddleware(req, async () => {
    const session = await getServerSession(authOptions)

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    await dbConnect()

    const courseId = params.id
    const userId = session.user.id
    const { lessonId, completed } = await req.json()

    // Get course
    const course = await Course.findById(courseId)

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Validate lesson exists in course
    let lessonExists = false
    let totalLessons = 0

    for (const module of course.modules) {
      totalLessons += module.lessons.length

      for (const lesson of module.lessons) {
        if (lesson._id.toString() === lessonId) {
          lessonExists = true
          break
        }
      }

      if (lessonExists) break
    }

    if (!lessonExists) {
      return NextResponse.json({ error: "Lesson not found in course" }, { status: 404 })
    }

    // Update course progress
    let courseProgress = await CourseProgress.findOne({ userId, courseId })

    if (!courseProgress) {
      // Create new progress record if it doesn't exist
      courseProgress = await CourseProgress.create({
        userId,
        courseId,
        completedLessons: [],
        progress: 0,
        lastAccessedAt: new Date(),
      })
    }

    // Update completed lessons
    if (completed) {
      if (!courseProgress.completedLessons.includes(lessonId)) {
        courseProgress.completedLessons.push(lessonId)
      }
    } else {
      courseProgress.completedLessons = courseProgress.completedLessons.filter((id) => id.toString() !== lessonId)
    }

    // Update progress percentage
    courseProgress.progress = Math.round((courseProgress.completedLessons.length / totalLessons) * 100)
    courseProgress.lastAccessedAt = new Date()

    await courseProgress.save()

    return NextResponse.json({
      success: true,
      progress: courseProgress.progress,
      completedLessons: courseProgress.completedLessons,
    })
  })
}
