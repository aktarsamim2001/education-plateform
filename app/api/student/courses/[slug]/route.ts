import { NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/app/api/auth/[...nextauth]/route"
import { connectToDatabase } from "@/lib/db-connect"
import { CourseModel } from "@/lib/models/mongodb/course"
import { UserModel } from "@/lib/models/mongodb/user"

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { slug } = params

    await connectToDatabase()

    // Get course details
    const course = await CourseModel.findOne({ slug }).populate("instructor", "name avatar title bio")

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 })
    }

    // Check if user is enrolled in this course
    const user = await UserModel.findOne({
      email: session.user.email,
      enrolledCourses: course._id,
    })

    if (!user) {
      return NextResponse.json({ error: "Not enrolled in this course" }, { status: 403 })
    }

    // Get user's progress for this course
    const progress = await UserModel.findOne(
      { email: session.user.email, "courseProgress.courseId": course._id },
      { "courseProgress.$": 1 },
    )

    const courseProgress = progress?.courseProgress?.[0] || {
      completedLessons: [],
      lastAccessedAt: null,
      quizScores: [],
    }

    // Calculate total lessons
    let totalLessons = 0
    course.modules.forEach((module) => {
      totalLessons += module.lessons.length
    })

    // Calculate percentage
    const completedPercentage =
      totalLessons > 0 ? Math.round((courseProgress.completedLessons.length / totalLessons) * 100) : 0

    // Mark completed lessons
    const modulesWithProgress = course.modules.map((module) => {
      const lessonsWithProgress = module.lessons.map((lesson) => {
        return {
          ...lesson.toObject(),
          completed: courseProgress.completedLessons.includes(lesson._id.toString()),
        }
      })

      return {
        ...module.toObject(),
        lessons: lessonsWithProgress,
      }
    })

    // Format response
    const courseWithProgress = {
      id: course._id,
      title: course.title,
      slug: course.slug,
      description: course.description,
      coverImage: course.coverImage,
      category: course.category,
      level: course.level,
      price: course.price,
      duration: course.duration,
      learningOutcomes: course.learningOutcomes,
      requirements: course.requirements,
      instructor: course.instructor,
      modules: modulesWithProgress,
      resources: course.resources,
      progress: {
        completedLessons: courseProgress.completedLessons.length,
        totalLessons,
        percentage: completedPercentage,
        lastAccessedAt: courseProgress.lastAccessedAt,
        timeSpent: courseProgress.timeSpent || 0,
        quizScores: courseProgress.quizScores || [],
      },
    }

    return NextResponse.json({ course: courseWithProgress })
  } catch (error) {
    console.error("Error fetching student course details:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
